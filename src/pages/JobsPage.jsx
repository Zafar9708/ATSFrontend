import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Switch,
  Button,
  Menu,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  InputBase,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Star as StarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  ViewModule as ViewModuleIcon,
  TableRows as TableRowsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Archive as ArchiveIcon,
  Close as CloseIcon,
  FileUpload as FileUploadIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { parseISO, format, isAfter } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import axios from "axios";

const statusOptions = {
  'Active': ['Inactive', 'On Hold', 'Closed Own', 'Archived'],
  'Inactive': ['Active', 'On Hold', 'Closed Own', 'Archived'],
  'On Hold': ['Active', 'Inactive', 'Closed Own', 'Archived'],
  'Closed Own': ['Active', 'Inactive', 'On Hold', 'Archived'],
  'Archived': ['Active'],
  'Default': ['Active', 'Inactive', 'On Hold', 'Closed Own', 'Archived']
};

const businessUnitOptions = ["Internal", "External"];

// API Base URL
const API_BASE_URL = "http://ats-env.eba-qmshqp3j.ap-south-1.elasticbeanstalk.com/api/v1";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");
  const [showPriority, setShowPriority] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [jobToArchive, setJobToArchive] = useState(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [recruiters, setRecruiters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statusChangeDialog, setStatusChangeDialog] = useState({
    open: false,
    newStatus: '',
    reason: '',
    jobId: null
  });

  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData')) || { role: 'admin' };

  const isAdmin = userData?.role === 'admin';
  const isRecruiter = userData?.role === 'recruiter';

  useEffect(() => {
    const handleBackButton = (e) => {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/dashboard');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [navigate, location.state]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_BASE_URL}/job`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.jobs) {
          const allJobs = response.data.jobs.map((job) => ({
            ...job,
            formattedJobNumber: job.jobName || `WR${String(job._id).slice(-4)}`,
            status: job.status || 'Active'
          }));

          const activeJobs = allJobs.filter(job => job.status !== 'Archived');
          const archived = allJobs.filter(job => job.status === 'Archived');

          setJobs(activeJobs);
          setArchivedJobs(archived);
          setFilteredJobs(activeJobs);

          // Extract unique values for filters
          const uniqueRecruiters = [...new Set(
            allJobs.flatMap(job => {
              const recruiters = job.jobFormId?.recruitingPerson || [];
              return Array.isArray(recruiters) ? recruiters : [recruiters];
            }).filter(Boolean)
          )];

          const uniqueDepartments = [...new Set(allJobs.map(job => job.department).filter(Boolean))];
          const uniqueLocations = [...new Set(
            allJobs.flatMap(job =>
              job.jobFormId?.locations?.map(loc => loc.name) || []
            ).filter(Boolean)
          )];

          setRecruiters(uniqueRecruiters);
          setDepartments(uniqueDepartments);
          setLocations(uniqueLocations);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setSnackbar({ 
          open: true, 
          message: error.response?.data?.message || 'Failed to fetch jobs', 
          severity: "error" 
        });
        setJobs([]);
        setArchivedJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatJobNumber = (index) => {
    const number = index + 1;
    return `WR${number.toString().padStart(2, '0')}`;
  };

  const getClientName = (client) => {
    if (!client) return "Not assigned";
    if (typeof client === 'object') {
      return client.name || "Not assigned";
    }
    return client;
  };

  const getLocationNames = (locations) => {
    if (!locations || !Array.isArray(locations)) return "Remote";
    return locations.map(loc => loc.name).join(', ');
  };

  const getJobStatus = (job) => {
    return job.status || 'Active';
  };

  const isJobActive = (job) => {
    return getJobStatus(job) === 'Active';
  };

  const filtersConfig = [
    { label: "Status", id: "status", options: ["Active", "Inactive", "On Hold", "Closed Own"] },
    { label: "Business Unit", id: "businessUnit", options: businessUnitOptions },
    { label: "Department", id: "department", options: departments },
    { label: "Recruiter", id: "recruiter", options: recruiters },
    { label: "Location", id: "location", options: locations },
  ];

  useEffect(() => {
    const jobsToFilter = showArchived ? archivedJobs : jobs;
    let result = jobsToFilter;

    if (showPriority && !showArchived) {
      result = result.filter(job => job.jobFormId?.markPriority);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => {
        const jobTitle = job.jobTitle || '';
        const jobNumber = job.jobName || job.formattedJobNumber || '';
        const locationNames = job.jobFormId?.locations ?
          job.jobFormId.locations.map(loc => loc.name).join(', ') :
          '';
        const department = job.department || '';
        const clientName = job.jobFormId?.BusinessUnit === 'external' ?
          getClientName(job.jobFormId.Client).toLowerCase() :
          '';

        return (
          jobTitle.toLowerCase().includes(term) ||
          jobNumber.toLowerCase().includes(term) ||
          locationNames.toLowerCase().includes(term) ||
          department.toLowerCase().includes(term) ||
          clientName.includes(term)
        );
      });
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(job => {
          switch (key) {
            case 'status':
              return getJobStatus(job) === value;
            case 'businessUnit':
              return job.jobFormId?.BusinessUnit?.toLowerCase() === value.toLowerCase();
            case 'department':
              return job.department === value;
            case 'recruiter':
              const jobRecruiters = job.jobFormId?.recruitingPerson || [];
              return Array.isArray(jobRecruiters) ?
                jobRecruiters.includes(value) :
                jobRecruiters === value;
            case 'location':
              const jobLocations = job.jobFormId?.locations || [];
              return jobLocations.some(loc => loc.name === value);
            default:
              return true;
          }
        });
      }
    });

    setFilteredJobs(result);
  }, [jobs, archivedJobs, showArchived, showPriority, searchTerm, filters]);

  const activeJobsCount = jobs.filter(job => isJobActive(job)).length;
  const priorityJobsCount = jobs.filter(job => job.jobFormId?.markPriority && isJobActive(job)).length;

  const handleCreateJobClick = () => {
    navigate("/dashboard/jobs/createJob");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const handleStatusMenuClick = (event, jobId) => {
    event.stopPropagation();
    setStatusMenuAnchorEl(event.currentTarget);
    setCurrentJobId(jobId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setCurrentJobId(null);
  };

  const handleArchiveClick = (event, jobId) => {
    event.stopPropagation();
    setJobToArchive(jobId);
    setShowArchiveDialog(true);
  };

  const handleArchiveDialogClose = () => {
    setShowArchiveDialog(false);
    setJobToArchive(null);
  };

  const updateJobStatusAPI = async (jobId, newStatus, reason) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${API_BASE_URL}/job/${jobId}/status`,
        { status: newStatus, statusReason: reason },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        if (newStatus === 'Archived') {
          const jobToArchive = jobs.find(job => job._id === jobId);
          if (jobToArchive) {
            setJobs(jobs.filter(job => job._id !== jobId));
            setArchivedJobs([...archivedJobs, { ...jobToArchive, status: 'Archived' }]);
          }
        } else {
          setJobs(jobs.map(job =>
            job._id === jobId ? { ...job, status: newStatus } : job
          ));
        }

        setSnackbar({ 
          open: true, 
          message: `Job status updated to ${newStatus}`, 
          severity: "success" 
        });
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to update job status', 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (['Closed Own', 'On Hold', 'Archived'].includes(newStatus)) {
      setStatusChangeDialog({
        open: true,
        newStatus,
        reason: '',
        jobId: currentJobId
      });
      handleStatusMenuClose();
      return;
    }

    await updateJobStatusAPI(currentJobId, newStatus, '');
    handleStatusMenuClose();
  };

  const handleStatusChangeDialogClose = () => {
    setStatusChangeDialog({
      open: false,
      newStatus: '',
      reason: '',
      jobId: null
    });
  };

  const handleStatusReasonSubmit = async () => {
    await updateJobStatusAPI(
      statusChangeDialog.jobId,
      statusChangeDialog.newStatus,
      statusChangeDialog.reason
    );
    handleStatusChangeDialogClose();
  };

  const handleArchiveConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${API_BASE_URL}/job/${jobToArchive}/status`,
        { status: 'Archived', statusReason: 'Archived by user' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        const jobToMove = jobs.find(job => job._id === jobToArchive);
        setJobs(jobs.filter(job => job._id !== jobToArchive));
        setArchivedJobs([...archivedJobs, { ...jobToMove, status: 'Archived' }]);

        setShowArchiveDialog(false);
        setJobToArchive(null);
        setSnackbar({ 
          open: true, 
          message: 'Job archived successfully', 
          severity: "success" 
        });
      }
    } catch (error) {
      console.error('Failed to archive job:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to archive job', 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowArchived = () => {
    setShowArchived(!showArchived);
    setFilters({});
    setSearchTerm("");
  };

  const handleImportClick = () => {
    setShowImportDialog(true);
    handleMenuClose();
  };

  const handleImportDialogClose = () => {
    setShowImportDialog(false);
    setImportFile(null);
  };

  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const downloadTemplate = (businessUnit) => {
    const headers = [
      'jobTitle',
      'department',
      'experience',
      'jobDesc',
      'jobType',
      'locations',
      'openings',
      'targetHireDate',
      'currency',
      'amount',
      'allowReapply',
      'reapplyDate',
      'markPriority',
      'hiringFlow',
      'BusinessUnit',
      'salesPerson',
      'recruitingPerson'
    ];

    if (businessUnit === 'external') {
      headers.push('Client');
    }

    const sampleData = [
      'QA Automation',
      'IT',
      '2+ years',
      'Develop and maintain software applications',
      'Full-time',
      '689b1953c35fc2efab3c660c',
      '5',
      '2023-12-15',
      'INR',
      '120000',
      'true',
      '90',
      'true',
      'Screening,Technical Interview,HR Round',
      businessUnit,
      'Zafar',
      'alice@example.com,jane.smith@example.com'
    ];

    if (businessUnit === 'external') {
      sampleData.push('Client Company Name');
    }

    let csvContent = headers.join(',') + '\n' + sampleData.join(',');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jobs_template_${businessUnit}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      setSnackbar({ open: true, message: 'Please select a file to import', severity: "error" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await axios.post(`${API_BASE_URL}/job/import`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        // Refresh jobs list after import
        const jobsResponse = await axios.get(`${API_BASE_URL}/job`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (jobsResponse.data && jobsResponse.data.jobs) {
          const allJobs = jobsResponse.data.jobs.map((job) => ({
            ...job,
            formattedJobNumber: job.jobName || `WR${String(job._id).slice(-4)}`,
            status: job.status || 'Active'
          }));

          const activeJobs = allJobs.filter(job => job.status !== 'Archived');
          const archived = allJobs.filter(job => job.status === 'Archived');

          setJobs(activeJobs);
          setArchivedJobs(archived);
          setFilteredJobs(activeJobs);
        }

        setShowImportDialog(false);
        setImportFile(null);
        setSnackbar({ 
          open: true, 
          message: response.data.message || 'Jobs imported successfully', 
          severity: "success" 
        });
      }
    } catch (error) {
      console.error('Failed to import jobs:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to import jobs', 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateJob = async () => {
    handleMenuClose();

    if (!currentJobId) {
      setSnackbar({ open: true, message: 'No job selected for duplication', severity: "error" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/job/${currentJobId}/duplicate`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Refresh jobs list after duplication
        const jobsResponse = await axios.get(`${API_BASE_URL}/job`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (jobsResponse.data && jobsResponse.data.jobs) {
          const allJobs = jobsResponse.data.jobs.map((job) => ({
            ...job,
            formattedJobNumber: job.jobName || `WR${String(job._id).slice(-4)}`,
            status: job.status || 'Active'
          }));

          const activeJobs = allJobs.filter(job => job.status !== 'Archived');
          const archived = allJobs.filter(job => job.status === 'Archived');

          setJobs(activeJobs);
          setArchivedJobs(archived);
          setFilteredJobs(activeJobs);
        }

        setSnackbar({ 
          open: true, 
          message: response.data.message || 'Job duplicated successfully', 
          severity: "success" 
        });
      }
    } catch (error) {
      console.error('Failed to duplicate job:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to duplicate job', 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'On Hold': return 'warning';
      case 'Closed Own': return 'primary';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  const getAvailableStatusChanges = (currentStatus) => {
    return statusOptions[currentStatus] || statusOptions['Default'];
  };

  const handleJobCardClick = (jobId) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && jobs.length === 0) {
    return (
      <MainLayout>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </MainLayout>
    );
  }

  const hasExternalJobs = jobs.some(job => job.jobFormId?.BusinessUnit === 'external');

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 3, marginLeft:1, marginTop:3,marginLeft:-4, }}>
        {/* Archive Dialog */}
        
        <Dialog open={showArchiveDialog} onClose={handleArchiveDialogClose}>
          <DialogTitle>Archive Job</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to archive this job?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleArchiveDialogClose}>Cancel</Button>
            <Button onClick={handleArchiveConfirm} color="primary" variant="contained">
              Archive
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog open={statusChangeDialog.open} onClose={handleStatusChangeDialogClose}>
          <DialogTitle>Change Status to {statusChangeDialog.newStatus}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={`Reason for ${statusChangeDialog.newStatus}`}
              fullWidth
              multiline
              rows={4}
              value={statusChangeDialog.reason}
              onChange={(e) => setStatusChangeDialog(prev => ({
                ...prev,
                reason: e.target.value
              }))}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleStatusChangeDialogClose}>Cancel</Button>
            <Button
              onClick={handleStatusReasonSubmit}
              color="primary"
              variant="contained"
              disabled={!statusChangeDialog.reason.trim()}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={showImportDialog} onClose={handleImportDialogClose}>
          <DialogTitle>Import Jobs</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: 400, p: 2 }}>
              <Typography variant="body1" gutterBottom>
                Download a template CSV file and fill in your job data:
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => downloadTemplate('internal')}
                  startIcon={<FileUploadIcon />}
                >
                  Internal Jobs Template
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => downloadTemplate('external')}
                  startIcon={<FileUploadIcon />}
                >
                  External Jobs Template
                </Button>
              </Box>

              <Typography variant="body1" gutterBottom>
                Upload your filled CSV file:
              </Typography>
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="import-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="import-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<FileUploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Select CSV File
                </Button>
              </label>
              {importFile && (
                <Typography variant="body2">
                  Selected file: {importFile.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleImportDialogClose}>Cancel</Button>
            <Button
              onClick={handleImportSubmit}
              color="primary"
              variant="contained"
              disabled={!importFile}
            >
              Import
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Header Section */}
        <Paper elevation={0} sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          mb: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {showArchived ? 'Archived Jobs' : `Active Jobs (${activeJobsCount})`}
              {showPriority && !showArchived && (
                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({priorityJobsCount} priority)
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {showArchived ? 'Viewing archived jobs' : 'Here you can find all the jobs of this organisation.'}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {!showArchived && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Switch
                  checked={showPriority}
                  onChange={(e) => setShowPriority(e.target.checked)}
                  color="primary"
                />
                <Typography variant="body2">Priority Only</Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => setView("card")}
                color={view === "card" ? "primary" : "default"}
                size="small"
              >
                <ViewModuleIcon />
              </IconButton>
              <IconButton
                onClick={() => setView("table")}
                color={view === "table" ? "primary" : "default"}
                size="small"
              >
                <TableRowsIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant={showArchived ? "outlined" : "contained"}
                color="primary"
                onClick={handleShowArchived}
                size="small"
                startIcon={<ArchiveIcon />}
              >
                {showArchived ? 'Back to Active' : 'View Archived'}
              </Button>

              {!showArchived && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateJobClick}
                    size="small"
                    sx={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      height: '36px'
                    }}
                  >
                    Create Job
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMenuClick}
                    size="small"
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      minWidth: '36px',
                      height: '36px',
                    }}
                  >
                    <ArrowDropDownIcon fontSize="small" />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleImportClick}>
                      <FileUploadIcon fontSize="small" sx={{ mr: 1 }} />
                      Import Jobs
                    </MenuItem>
                    <MenuItem onClick={handleDuplicateJob}>
                      <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
                      Duplicate Job
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Filters Section */}
        {!showArchived && (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              {filtersConfig.map((filter) => (
                <Grid item xs={6} sm={4} md={2} key={filter.id}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 195 }}>
                    <InputLabel>{filter.label}</InputLabel>
                    <Select
                      value={filters[filter.id] || ""}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      label={filter.label}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {filter.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  fullWidth
                  size="small"
                  sx={{ height: '40px' }}
                  disabled={Object.keys(filters).length === 0 && !searchTerm}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', maxWidth: '100%' }}>
              <InputBase
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={`Search ${showArchived ? 'archived' : ''} jobs...`}
                sx={{
                  p: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
                startAdornment={
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                }
              />
            </Box>
          </Paper>
        )}

        {/* Jobs Display Section */}
        {filteredJobs.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              {showArchived ? 'No archived jobs found' : 'No jobs match your criteria'}
            </Typography>
          </Box>
        ) : view === "table" ? (
          <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none', border: '1px solid #eee', borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Job ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Business Unit</TableCell>
                  {hasExternalJobs && (
                    <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'bold' }}>Openings</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hire Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Recruiting Member</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => {
                  const jobForm = job.jobFormId || {};
                  const targetDate = jobForm.targetHireDate ? parseISO(jobForm.targetHireDate) : null;
                  const status = getJobStatus(job);
                  const availableStatusChanges = getAvailableStatusChanges(status);

                  return (
                    <TableRow
                      key={job._id}
                      hover
                      onClick={() => handleJobCardClick(job._id)}
                      sx={{
                        cursor: 'pointer',
                        '&:nth-of-type(even)': { backgroundColor: '#fafafa' }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{job.formattedJobNumber}</TableCell>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        {jobForm.locations ? getLocationNames(jobForm.locations) : "Remote"}
                      </TableCell>
                      <TableCell>
                        {jobForm.BusinessUnit ? jobForm.BusinessUnit.charAt(0).toUpperCase() + jobForm.BusinessUnit.slice(1) : "-"}
                      </TableCell>
                      {hasExternalJobs && (
                        <TableCell>
                          {jobForm.BusinessUnit === 'external' ? getClientName(jobForm.Client) : "-"}
                        </TableCell>
                      )}
                      <TableCell align="center">{jobForm.openings || 0}</TableCell>
                      <TableCell>
                        {targetDate ? format(targetDate, 'MMM dd, yyyy') : "-"}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(jobForm.recruitingPerson) ?
                          jobForm.recruitingPerson.join(', ') :
                          jobForm.recruitingPerson || "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          color={getStatusColor(status)}
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {jobForm.markPriority ? (
                          <StarIcon color="primary" fontSize="small" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentJobId(job._id);
                            handleStatusMenuClick(e, job._id);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={statusMenuAnchorEl}
                          open={Boolean(statusMenuAnchorEl && currentJobId === job._id)}
                          onClose={handleStatusMenuClose}
                        >
                          <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                            Change {status} to:
                          </Typography>
                          {availableStatusChanges.map(status => (
                            <MenuItem
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              sx={{ minWidth: 150 }}
                            >
                              <CheckCircleIcon
                                color={getStatusColor(status)}
                                sx={{ mr: 1, fontSize: '1rem' }}
                              />
                              {status}
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            p: 1
          }}>
            {filteredJobs.map((job) => {
              const jobForm = job.jobFormId || {};
              const targetDate = jobForm.targetHireDate ? parseISO(jobForm.targetHireDate) : null;
              const status = getJobStatus(job);
              const availableStatusChanges = getAvailableStatusChanges(status);

              return (
                <Card
                  key={job._id}
                  onClick={() => handleJobCardClick(job._id)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: jobForm.markPriority ? '4px solid #FFD700' : 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Header with Job Title and Client Name */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Box flex="1">
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {job.formattedJobNumber}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                          {job.jobTitle}
                        </Typography>
                      </Box>

                      {/* Client Name on the right side */}
                      {jobForm.BusinessUnit === 'external' && jobForm.Client && (
                        <Box sx={{ ml: 2, textAlign: 'right', minWidth: '80px' }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            color="primary"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: '#e3f2fd'
                            }}
                          >
                            {getClientName(jobForm.Client)}
                          </Typography>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center">
                        {jobForm.markPriority && (
                          <StarIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusMenuClick(e, job._id);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1} gap={1}>
                      <WorkIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {job.department}
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <LocationIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {jobForm.locations ? getLocationNames(jobForm.locations) : "Remote"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} mb={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={<GroupIcon fontSize="small" />}
                        label={`${jobForm.openings || 0} openings`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#90caf9' }}
                      />
                      <Chip
                        icon={<MoneyIcon fontSize="small" />}
                        label={`${jobForm.currency || 'USD'} ${jobForm.amount || '0'}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#a5d6a7' }}
                      />
                      <Chip
                        icon={<TimeIcon fontSize="small" />}
                        label={jobForm.jobType || 'Full-time'}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#ffcc80' }}
                      />
                    </Stack>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarTodayIcon color="action" fontSize="small" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: 'bold',
                              paddingX: 1,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}
                          >
                            Hire Date: {targetDate ? format(targetDate, 'MMM dd, yyyy') : "Not set"}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={status}
                        size="small"
                        color={getStatusColor(status)}
                        variant="outlined"
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="action" fontSize="small" />
                        <Typography variant="caption"
                          color="text.secondary"
                          sx={{
                            fontWeight: 'bold',
                            paddingX: 1,
                            borderRadius: 1,
                            display: 'inline-block'
                          }}>
                          Recruiter: {Array.isArray(jobForm.recruitingPerson) ?
                            jobForm.recruitingPerson.join(', ') :
                            jobForm.recruitingPerson || "Not assigned"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <BusinessIcon fontSize="small" color="action" />
                          <Typography variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: 'bold',
                              paddingLeft: 1,
                              display: 'inline-block'
                            }}>
                            Unit: {jobForm.BusinessUnit === 'external' ? 'External' : 'Internal'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>

                  <Menu
                    anchorEl={statusMenuAnchorEl}
                    open={Boolean(statusMenuAnchorEl && currentJobId === job._id)}
                    onClose={handleStatusMenuClose}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                      Change {status} to:
                    </Typography>
                    {availableStatusChanges.map(status => (
                      <MenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        sx={{ minWidth: 150 }}
                      >
                        <CheckCircleIcon
                          color={getStatusColor(status)}
                          sx={{ mr: 1, fontSize: '1rem' }}
                        />
                        {status}
                      </MenuItem>
                    ))}
                  </Menu>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default JobsPage;