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
  Checkbox,
  ListItemText,
  OutlinedInput,
  useMediaQuery,
  useTheme,
  Drawer,
  Fab,
  Badge,
  Tooltip
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
  Share as ShareIcon,
  FilterAlt as FilterAltIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { parseISO, format, isAfter } from "date-fns";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import axios from "axios";

const statusOptions = {
  'Active': ['On Hold', 'Closed Own', 'Archived'],
  'Inactive': ['Active', 'On Hold', 'Closed Own', 'Archived'],
  'On Hold': ['Active', 'Inactive', 'Closed Own', 'Archived'],
  'Closed Own': ['Active', 'Inactive', 'On Hold', 'Archived'],
  'Archived': ['Active'],
  'Default': ['Active', 'Inactive', 'On Hold', 'Closed Own', 'Archived']
};

const businessUnitOptions = ["Internal", "External"];

// API Base URL
const API_BASE_URL = "http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.com/api/v1";

const JobsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Get tenantId from URL params
  const { tenantId } = useParams();
  
  // Sidebar state - you'll need to connect this to your actual sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");
  const [showPriority, setShowPriority] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
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
  
  // New state for share functionality
  const [shareDialog, setShareDialog] = useState({
    open: false,
    jobId: null,
    jobTitle: ''
  });
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  
  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData')) || { role: 'admin' };

  const isAdmin = userData?.role === 'admin';
  const isRecruiter = userData?.role === 'recruiter';

  // Calculate main content width based on sidebar state
  const getMainContentWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '100%';
    return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
  };

  // Get responsive grid columns for job cards
  const getGridColumns = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    if (sidebarOpen) {
      return {
        md: 'repeat(3, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)'
      };
    }
    return {
      md: 'repeat(4, 1fr)',
      lg: 'repeat(5, 1fr)',
      xl: 'repeat(6, 1fr)'
    };
  };

  // Get responsive container padding
  const getContainerPadding = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

const handleBack = () => {
    navigate(-1); // Navigates to the previous page
};

  useEffect(() => {
    const handleBackButton = (e) => {
      if (location.state?.from) {
        navigate(location.state.from);
      } else if (tenantId) {
        navigate(`/tenant/${tenantId}/dashboard`);
      } else {
        navigate('/dashboard');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [navigate, location.state, tenantId]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        
        // Include tenantId in API request if available
        const url = tenantId 
          ? `${API_BASE_URL}/tenant/${tenantId}/job` 
          : `${API_BASE_URL}/job`;
        
        const response = await axios.get(url, {
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
  }, [tenantId]);

  // Fetch vendors function
  const fetchVendors = async () => {
    try {
      setVendorsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.com/api/admin/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success && response.data.vendors) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to fetch vendors', 
        severity: "error" 
      });
    } finally {
      setVendorsLoading(false);
    }
  };

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
    const hireDate = job.jobFormId?.targetHireDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If status is Active but date has passed, return 'Closed Own' visually
    if (job.status === 'Active' && hireDate && new Date(hireDate) < today) {
      return 'Closed Own';
    }
    
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

    if (showActiveOnly && !showArchived) {
      result = result.filter(job => isJobActive(job));
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
  }, [jobs, archivedJobs, showArchived, showPriority, showActiveOnly, searchTerm, filters]);

  const activeJobsCount = jobs.filter(job => isJobActive(job)).length;
  const priorityJobsCount = jobs.filter(job => job.jobFormId?.markPriority && isJobActive(job)).length;

  const handleCreateJobClick = () => {
    if (tenantId) {
      navigate(`/tenant/${tenantId}/dashboard/jobs/createJob`);
    } else {
      navigate("/dashboard/jobs/createJob");
    }
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

  const handleMobileFilterApply = () => {
    setFilters(tempFilters);
    setMobileFilterOpen(false);
  };

  const handleMobileFilterClear = () => {
    setTempFilters({});
  };

  const handleResetFilters = () => {
    setFilters({});
    setTempFilters({});
    setSearchTerm("");
    setShowPriority(false);
    setShowActiveOnly(false);
    setMobileFilterOpen(false);
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

  const handleShareMenuClick = (event, jobId, jobTitle) => {
    event.stopPropagation();
    setShareAnchorEl(event.currentTarget);
    setCurrentJobId(jobId);
    setShareDialog(prev => ({ ...prev, jobTitle }));
  };

  const handleShareMenuClose = () => {
    setShareAnchorEl(null);
  };

  const handleShareClick = () => {
    handleShareMenuClose();
    setShareDialog({ ...shareDialog, open: true, jobId: currentJobId });
    fetchVendors();
    setSelectedVendors([]);
  };

  const handleShareDialogClose = () => {
    setShareDialog({ open: false, jobId: null, jobTitle: '' });
    setSelectedVendors([]);
  };

  const handleVendorChange = (event) => {
    const value = event.target.value;
    setSelectedVendors(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSendToVendors = async () => {
    if (selectedVendors.length === 0) {
      setSnackbar({ 
        open: true, 
        message: 'Please select at least one vendor', 
        severity: "error" 
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.com/api/job-shares/share',
        {
          jobId: shareDialog.jobId,
          vendorIds: selectedVendors
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSnackbar({ 
          open: true, 
          message: response.data.message, 
          severity: "success" 
        });
        
        handleShareDialogClose();
      }
    } catch (error) {
      console.error('Failed to share job:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to share job', 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
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
    setShowPriority(false);
    setShowActiveOnly(false);
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
    if (tenantId) {
      navigate(`/tenant/${tenantId}/dashboard/jobs/${jobId}`);
    } else {
      navigate(`/dashboard/jobs/${jobId}`);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFilterCount = () => {
    return Object.keys(filters).filter(key => filters[key]).length;
  };

  if (loading && jobs.length === 0) {
    return (
      <MainLayout>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          width: getMainContentWidth(),
          ml: { xs: 0, sm: 0, md: sidebarOpen ? '240px' : '65px' },
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}>
          <CircularProgress size={isMobile ? 40 : 60} thickness={4} />
        </Box>
      </MainLayout>
    );
  }

  const hasExternalJobs = jobs.some(job => job.jobFormId?.BusinessUnit === 'external');

  // Mobile Filter Drawer Component
  const MobileFilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileFilterOpen}
      onClose={() => setMobileFilterOpen(false)}
      PaperProps={{
        sx: {
          maxHeight: '80vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', px: 1 }}>
        {filtersConfig.map((filter) => (
          <Box key={filter.id} sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={tempFilters[filter.id] || ""}
                onChange={(e) => setTempFilters(prev => ({ ...prev, [filter.id]: e.target.value }))}
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
          </Box>
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleMobileFilterClear}
        >
          Clear
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleMobileFilterApply}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <MainLayout>
      <Box
        sx={{
          width: getMainContentWidth(),
          minHeight: '100vh',
          background: '#f8f9fa',
          p: getContainerPadding(),
          ml: { xs: 0, sm: 0, md: sidebarOpen ? '200px' : '65px' },
          transition: 'margin-left 0.3s ease, width 0.3s ease',
          mt: { xs: 7, sm: 8, md: 9 },
          overflowX: 'hidden',
        }}
      >
        {/* Back Button */}
<Box sx={{ mb: isMobile ? 1 : 2 }}>
  <Button
    startIcon={<ArrowBackIcon />}
    onClick={handleBack}
    sx={{
      // Text and icon color - blue
      color: '#1976d2',
      
      // Hover effect - blue text with light grey background
      '&:hover': {
        backgroundColor: '#f5f5f5',  // Light grey background on hover
        color: '#1565C0',  // Slightly darker blue on hover
      },
      
      // Responsive styles
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 500,
      textTransform: 'none',
      px: isMobile ? 1 : 2,
      py: isMobile ? 0.5 : 1,
      
      // Optional: smooth transition for hover effect
      transition: 'all 0.2s ease',
      
      // Remove default background
      backgroundColor: 'transparent',
    }}
  >
    Back  
  </Button>
</Box>

        {/* All Dialogs */}
        <Dialog 
          open={showArchiveDialog} 
          onClose={handleArchiveDialogClose}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: isMobile ? 1 : 2,
              width: isMobile ? 'calc(100% - 16px)' : '100%',
              maxWidth: isMobile ? '100%' : 'sm',
            }
          }}
        >
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
        <Dialog 
          open={statusChangeDialog.open} 
          onClose={handleStatusChangeDialogClose}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: isMobile ? 1 : 2,
              width: isMobile ? 'calc(100% - 16px)' : '100%',
              maxWidth: isMobile ? '100%' : 'sm',
            }
          }}
        >
          <DialogTitle>Change Status to {statusChangeDialog.newStatus}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={`Reason for ${statusChangeDialog.newStatus}`}
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
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

        {/* Share Dialog */}
        <Dialog 
          open={shareDialog.open} 
          onClose={handleShareDialogClose} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              m: isMobile ? 1 : 2,
              width: isMobile ? 'calc(100% - 16px)' : '100%',
              maxWidth: isMobile ? '100%' : 'sm',
            }
          }}
        >
          <DialogTitle>
            Share Job: {shareDialog.jobTitle}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Select vendors to share this job with:
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="vendor-select-label">Vendors</InputLabel>
                <Select
                  labelId="vendor-select-label"
                  id="vendor-select"
                  multiple
                  value={selectedVendors}
                  onChange={handleVendorChange}
                  input={<OutlinedInput label="Vendors" />}
                  renderValue={(selected) => {
                    const selectedNames = vendors
                      .filter(v => selected.includes(v._id))
                      .map(v => `${v.firstName} ${v.lastName} (${v.companyName})`);
                    return selectedNames.join(', ');
                  }}
                >
                  {vendorsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading vendors...
                    </MenuItem>
                  ) : vendors.length === 0 ? (
                    <MenuItem disabled>No vendors available</MenuItem>
                  ) : (
                    vendors.map((vendor) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        <Checkbox checked={selectedVendors.indexOf(vendor._id) > -1} />
                        <ListItemText 
                          primary={`${vendor.firstName} ${vendor.lastName}`}
                          secondary={`${vendor.companyName} - ${vendor.email}`}
                        />
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShareDialogClose}>Cancel</Button>
            <Button
              onClick={handleSendToVendors}
              color="primary"
              variant="contained"
              disabled={selectedVendors.length === 0 || vendorsLoading}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {/* Import Dialog */}
        <Dialog 
          open={showImportDialog} 
          onClose={handleImportDialogClose}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: isMobile ? 1 : 2,
              width: isMobile ? 'calc(100% - 16px)' : '100%',
              maxWidth: isMobile ? '100%' : 'sm',
            }
          }}
        >
          <DialogTitle>Import Jobs</DialogTitle>
          <DialogContent>
            <Box sx={{ p: isMobile ? 1 : 2 }}>
              <Typography variant="body1" gutterBottom>
                Download a template CSV file and fill in your job data:
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                gap: 2, 
                mb: 3 
              }}>
                <Button
                  variant="outlined"
                  onClick={() => downloadTemplate('internal')}
                  startIcon={<FileUploadIcon />}
                  fullWidth={isMobile}
                >
                  Internal Jobs Template
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => downloadTemplate('external')}
                  startIcon={<FileUploadIcon />}
                  fullWidth={isMobile}
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
          anchorOrigin={{ 
            vertical: isMobile ? 'bottom' : 'top', 
            horizontal: isMobile ? 'center' : 'right' 
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Header Section - Responsive */}
        <Paper 
          elevation={0} 
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: 2,
            p: isMobile ? 1.5 : 2,
            mb: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ color: 'primary.main', fontWeight: 'bold' }}
            >
              {showArchived ? 'Archived Jobs' : `Total Jobs (${activeJobsCount})`}
              {showPriority && !showArchived && (
                <Typography 
                  component="span" 
                  variant="body2" 
                  sx={{ ml: 1, color: 'text.secondary', display: isMobile ? 'block' : 'inline' }}
                >
                  ({priorityJobsCount} priority)
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {showArchived ? 'Viewing archived jobs' : 'Here you can find all the jobs of this organisation.'}
            </Typography>
          </Box>

          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center", 
            gap: isMobile ? 1 : 2,
            flexWrap: "wrap" 
          }}>
            {!showArchived && (
              <>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: isMobile ? 'space-between' : 'flex-start'
                }}>
                  <Switch
                    checked={showPriority}
                    onChange={(e) => setShowPriority(e.target.checked)}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  />
                  <Typography variant="body2">Priority Only</Typography>
                </Box>

                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: isMobile ? 'space-between' : 'flex-start',
                  ml: { xs: 0, sm: 1 }
                }}>
                  <Switch
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    color="success"
                    size={isMobile ? "small" : "medium"}
                  />
                  <Typography variant="body2" sx={{ color: showActiveOnly ? 'success.main' : 'text.primary' }}>
                    Active Only
                  </Typography>
                </Box>
              </>
            )}

            <Box sx={{ 
              display: "flex", 
              gap: 1,
              justifyContent: isMobile ? 'space-between' : 'flex-end',
              flex: 1
            }}>
              {/* View Toggle - Only show on desktop */}
              {isDesktop && (
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
              )}

              <Button
                variant={showArchived ? "outlined" : "contained"}
                color="primary"
                onClick={handleShowArchived}
                size={isMobile ? "small" : "medium"}
                startIcon={<ArchiveIcon />}
                fullWidth={isMobile}
              >
                {showArchived ? 'Back to Active' : 'Archived'}
              </Button>

              {!showArchived && (
                <>
                  {isMobile ? (
                    <Fab
                      color="primary"
                      size="small"
                      onClick={handleCreateJobClick}
                      sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
                    >
                      <AddIcon />
                    </Fab>
                  ) : (
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
                    </>
                  )}
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

        {/* Filters Section - Responsive */}
     {/* Filters Section - Responsive with visible labels */}
{/* Filters Section - Responsive with full-width labels */}
{!showArchived && (
  <>
    {isMobile ? (
      // Mobile Filter Bar
      <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <InputBase
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search jobs..."
            sx={{
              p: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white',
              flex: 1
            }}
            startAdornment={
              <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            }
          />
          <Badge badgeContent={getFilterCount()} color="primary">
            <IconButton 
              onClick={() => {
                setTempFilters(filters);
                setMobileFilterOpen(true);
              }}
              sx={{ border: '1px solid #ddd', borderRadius: 1 }}
            >
              <FilterAltIcon />
            </IconButton>
          </Badge>
        </Box>
      </Paper>
    ) : (
      // Desktop/Tablet Filters - Full width with increased margins
      <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 2.5, borderRadius: 2 }}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {filtersConfig.map((filter) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={filter.id}>
              <FormControl fullWidth size="small">
                <InputLabel 
                  sx={{ 
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                    fontWeight: 500,
                    color: '#1e293b',
                    transform: 'translate(14px, -9px) scale(0.85)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -9px) scale(0.85)'
                    },
                    backgroundColor: 'white',
                    px: 0.5,
                    zIndex: 1
                  }}
                >
                  {filter.label}
                </InputLabel>
                <Select
                  value={filters[filter.id] || ""}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  label={filter.label}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em style={{ color: '#64748b', fontSize: '0.9rem' }}>Select {filter.label}</em>;
                    }
                    return selected;
                  }}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                      py: { xs: 1.2, sm: 1.4, md: 1.6 },
                      px: { xs: 1.5, sm: 2 },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      '& em': {
                        color: '#64748b',
                        fontStyle: 'normal'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1',
                      borderWidth: '1.5px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: '2px'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          fontSize: '0.9rem',
                          py: 1,
                          px: 2
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">
                    <em style={{ fontSize: '0.9rem', color: '#64748b' }}>None</em>
                  </MenuItem>
                  {filter.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      <span style={{ fontSize: '0.9rem' }}>{option}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              fullWidth
              size="medium"
              sx={{ 
                height: { xs: '44px', sm: '48px', md: '52px' },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                fontWeight: 500,
                ml:"60px",
                whiteSpace: 'nowrap',
                borderColor: '#cbd5e1',
                borderWidth: '1.5px',
                color: '#475569',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: '#f0f9ff',
                  color: '#2563eb'
                },
                '&.Mui-disabled': {
                  borderColor: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
              disabled={Object.keys(filters).length === 0 && !searchTerm && !showPriority && !showActiveOnly}
            >
              Reset All Filters
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: { xs: 2, sm: 2.5, md: 3 }, 
          display: 'flex', 
          maxWidth: '100%' 
        }}>
          <InputBase
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={`Search ${showArchived ? 'archived' : ''} jobs...`}
            sx={{
              p: { xs: '8px 14px', sm: '10px 16px', md: '12px 18px' },
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#2563eb'
              },
              '&:focus-within': {
                borderColor: '#2563eb',
                borderWidth: '2px'
              },
              '& input::placeholder': {
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                color: '#94a3b8'
              }
            }}
            startAdornment={
              <SearchIcon sx={{ 
                mr: 1.5, 
                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' }, 
                color: '#64748b' 
              }} />
            }
          />
        </Box>
      </Paper>
    )}

    {/* Mobile Filter Drawer - Enhanced */}
    <Drawer
      anchor="bottom"
      open={mobileFilterOpen}
      onClose={() => setMobileFilterOpen(false)}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          p: { xs: 2.5, sm: 3 }
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 1,
        borderBottom: '2px solid #f1f5f9'
      }}>
        <Typography variant="h6" sx={{ 
          fontSize: '1.2rem', 
          fontWeight: 600,
          color: '#0f172a'
        }}>
          Filter Jobs
        </Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ 
        maxHeight: 'calc(90vh - 180px)', 
        overflowY: 'auto', 
        px: 0.5,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#94a3b8',
          borderRadius: '10px',
        },
      }}>
        {filtersConfig.map((filter) => (
          <Box key={filter.id} sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel 
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  backgroundColor: 'white',
                  px: 1,
                  zIndex: 1
                }}
              >
                {filter.label}
              </InputLabel>
              <Select
                value={tempFilters[filter.id] || ""}
                onChange={(e) => setTempFilters(prev => ({ ...prev, [filter.id]: e.target.value }))}
                label={filter.label}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em style={{ color: '#64748b', fontSize: '0.95rem' }}>Select {filter.label}</em>;
                  }
                  return selected;
                }}
                sx={{
                  '& .MuiSelect-select': {
                    fontSize: '0.95rem',
                    py: 1.6,
                    px: 2,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1',
                    borderWidth: '1.5px'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.95rem',
                        py: 1.2,
                        px: 2
                      }
                    }
                  }
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: '0.95rem', color: '#64748b' }}>None</em>
                </MenuItem>
                {filter.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    <span style={{ fontSize: '0.95rem' }}>{option}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mt: 3, 
        pt: 2.5, 
        borderTop: '2px solid #f1f5f9'
      }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setTempFilters({});
            handleMobileFilterClear();
          }}
          sx={{ 
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 500,
            borderRadius: 2,
            borderColor: '#cbd5e1',
            borderWidth: '1.5px',
            color: '#475569',
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: '#f0f9ff',
              color: '#2563eb'
            }
          }}
        >
          Clear All
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleMobileFilterApply}
          sx={{ 
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 500,
            borderRadius: 2,
            backgroundColor: '#2563eb',
            '&:hover': {
              backgroundColor: '#1e40af'
            }
          }}
        >
          Apply Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
        </Button>
      </Box>
    </Drawer>
  </>
)}

        {/* Jobs Display Section - Responsive */}
        {filteredJobs.length === 0 ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight={isMobile ? "50vh" : "40vh"}
            flexDirection="column"
            gap={2}
          >
            <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" align="center">
              {showArchived ? 'No archived jobs found' : 'No jobs match your criteria'}
            </Typography>
            {!showArchived && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetFilters}
                size={isMobile ? "small" : "medium"}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <>
            {/* For Mobile and Tablet - Always Card View */}
            {(isMobile || isTablet) && (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: getGridColumns(),
                gap: isMobile ? 2 : 3,
                p: isMobile ? 0.5 : 1
              }}>
                {filteredJobs.map((job) => {
                  const jobForm = job.jobFormId || {};
                  const targetDate = jobForm.targetHireDate ? parseISO(jobForm.targetHireDate) : null;
                  const status = getJobStatus(job);
                  const availableStatusChanges = getAvailableStatusChanges(status);
                  const clientName = jobForm.BusinessUnit === 'external' && jobForm.Client ? getClientName(jobForm.Client) : null;

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
                      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                        {/* Header with Job Title and Actions */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                            <Typography variant="caption" color="primary" fontWeight="bold" noWrap>
                              {job.formattedJobNumber}
                            </Typography>
                            <Typography 
                              variant={isMobile ? "body2" : "subtitle1"} 
                              fontWeight="bold" 
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.3,
                                minHeight: isMobile ? '2.4em' : '2.6em',
                                fontSize: isMobile ? '0.9rem' : '1rem'
                              }}
                            >
                              {job.jobTitle}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
                            {jobForm.markPriority && (
                              <StarIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
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

                        {/* Client Name Section - Only shown if client exists */}
                        {clientName && (
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'inline-block',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                backgroundColor: '#e3f2fd',
                                color: 'primary.main',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {clientName}
                            </Typography>
                          </Box>
                        )}

                        <Box display="flex" alignItems="center" mb={1} gap={0.5} flexWrap="wrap">
                          <WorkIcon color="action" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {job.department}
                          </Typography>
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                          <LocationIcon color="action" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {jobForm.locations ? getLocationNames(jobForm.locations) : "Remote"}
                          </Typography>
                        </Box>

                        <Stack 
                          direction="row" 
                          spacing={0.5} 
                          mb={1} 
                          flexWrap="wrap" 
                          useFlexGap
                          sx={{ gap: 0.5 }}
                        >
                          <Chip
                            icon={<GroupIcon sx={{ fontSize: '0.8rem' }} />}
                            label={`${jobForm.openings || 0}`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#90caf9',
                              height: isMobile ? 20 : 24,
                              '& .MuiChip-label': { fontSize: isMobile ? '0.625rem' : '0.75rem' }
                            }}
                          />
                          <Chip
                            icon={<MoneyIcon sx={{ fontSize: '0.8rem' }} />}
                            label={jobForm.currency || 'USD'}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#a5d6a7',
                              height: isMobile ? 20 : 24,
                              '& .MuiChip-label': { fontSize: isMobile ? '0.625rem' : '0.75rem' }
                            }}
                          />
                          <Chip
                            icon={<TimeIcon sx={{ fontSize: '0.8rem' }} />}
                            label={jobForm.jobType || 'FT'}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#ffcc80',
                              height: isMobile ? 20 : 24,
                              '& .MuiChip-label': { fontSize: isMobile ? '0.625rem' : '0.75rem' }
                            }}
                          />
                        </Stack>

                        <Box 
                          display="flex" 
                          flexDirection={isMobile ? 'column' : 'row'}
                          justifyContent="space-between" 
                          alignItems={isMobile ? 'flex-start' : 'center'}
                          gap={isMobile ? 1 : 0}
                        >
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CalendarTodayIcon color="action" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
                            <Typography variant="caption" color="text.secondary">
                              {targetDate ? format(targetDate, 'MMM dd') : "No date"}
                            </Typography>
                          </Box>
                          <Chip
                            label={status}
                            size="small"
                            color={getStatusColor(status)}
                            variant="outlined"
                            sx={{ 
                              height: isMobile ? 20 : 24,
                              '& .MuiChip-label': { fontSize: isMobile ? '0.625rem' : '0.75rem' }
                            }}
                          />
                        </Box>

                        <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                          <PersonIcon color="action" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {Array.isArray(jobForm.recruitingPerson) ?
                              jobForm.recruitingPerson.join(', ') :
                              jobForm.recruitingPerson || "Not assigned"}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                          <BusinessIcon color="action" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
                          <Typography variant="caption" color="text.secondary">
                            Unit: {jobForm.BusinessUnit === 'external' ? 'External' : 'Internal'}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Menu
                        anchorEl={statusMenuAnchorEl}
                        open={Boolean(statusMenuAnchorEl && currentJobId === job._id)}
                        onClose={handleStatusMenuClose}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareMenuClick(e, job._id, job.jobTitle);
                          }}
                        >
                          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                          Share
                        </MenuItem>
                        <Divider />
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
                      <Menu
                        anchorEl={shareAnchorEl}
                        open={Boolean(shareAnchorEl && currentJobId === job._id)}
                        onClose={handleShareMenuClose}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MenuItem onClick={handleShareClick}>
                          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                          Share with Vendors
                        </MenuItem>
                      </Menu>
                    </Card>
                  );
                })}
              </Box>
            )}

            {/* For Desktop - Both Card and Table Views based on user selection */}
            {isDesktop && (
              <>
                {view === "table" ? (
                  // Table View
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      mt: 2, 
                      boxShadow: 'none', 
                      border: '1px solid #eee', 
                      borderRadius: 2,
                      overflowX: 'auto',
                      maxWidth: '100%'
                    }}
                  >
                    <Table 
                      sx={{ 
                        minWidth: 650,
                        '& .MuiTableCell-root': {
                          padding: isTablet ? '12px 6px' : '16px 8px',
                          fontSize: isTablet ? '0.75rem' : '0.875rem'
                        }
                      }} 
                      size={isTablet ? "small" : "medium"}
                    >
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Job ID</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Dept.</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Unit</TableCell>
                          {hasExternalJobs && (
                            <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                          )}
                          <TableCell sx={{ fontWeight: 'bold' }}>Open.</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Hire Date</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Recruiter</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Pri.</TableCell>
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
                              <TableCell sx={{ maxWidth: isTablet ? 120 : 200 }}>
                                <Typography noWrap sx={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {job.jobTitle}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: isTablet ? 80 : 120, fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {job.department}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: isTablet ? 80 : 120, fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {jobForm.locations ? getLocationNames(jobForm.locations) : "Remote"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {jobForm.BusinessUnit ? jobForm.BusinessUnit.charAt(0).toUpperCase() + jobForm.BusinessUnit.slice(1) : "-"}
                                </Typography>
                              </TableCell>
                              {hasExternalJobs && (
                                <TableCell>
                                  <Typography noWrap sx={{ maxWidth: isTablet ? 80 : 100, fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                    {jobForm.BusinessUnit === 'external' ? getClientName(jobForm.Client) : "-"}
                                  </Typography>
                                </TableCell>
                              )}
                              <TableCell align="center">
                                <Typography sx={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {jobForm.openings || 0}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {targetDate ? format(targetDate, 'MMM dd') : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: isTablet ? 80 : 100, fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
                                  {Array.isArray(jobForm.recruitingPerson) ?
                                    jobForm.recruitingPerson.join(', ') :
                                    jobForm.recruitingPerson || "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={status}
                                  size="small"
                                  color={getStatusColor(status)}
                                  variant="outlined"
                                  sx={{ 
                                    borderRadius: 1,
                                    height: isTablet ? 20 : 24,
                                    '& .MuiChip-label': { fontSize: isTablet ? '0.625rem' : '0.75rem' }
                                  }}
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
                                  <MenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShareMenuClick(e, job._id, job.jobTitle);
                                    }}
                                  >
                                    <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                                    Share
                                  </MenuItem>
                                  <Divider />
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
                                <Menu
                                  anchorEl={shareAnchorEl}
                                  open={Boolean(shareAnchorEl && currentJobId === job._id)}
                                  onClose={handleShareMenuClose}
                                >
                                  <MenuItem onClick={handleShareClick}>
                                    <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                                    Share with Vendors
                                  </MenuItem>
                                </Menu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  // Card View for Desktop
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: getGridColumns(),
                    gap: 3,
                    p: 1
                  }}>
                    {filteredJobs.map((job) => {
                      const jobForm = job.jobFormId || {};
                      const targetDate = jobForm.targetHireDate ? parseISO(jobForm.targetHireDate) : null;
                      const status = getJobStatus(job);
                      const availableStatusChanges = getAvailableStatusChanges(status);
                      const clientName = jobForm.BusinessUnit === 'external' && jobForm.Client ? getClientName(jobForm.Client) : null;

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
                            {/* Header with Job Title and Actions */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                                <Typography variant="caption" color="primary" fontWeight="bold" noWrap>
                                  {job.formattedJobNumber}
                                </Typography>
                                <Typography 
                                  variant="subtitle1" 
                                  fontWeight="bold" 
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.3,
                                    minHeight: '2.6em',
                                    fontSize: '1rem'
                                  }}
                                >
                                  {job.jobTitle}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
                                {jobForm.markPriority && (
                                  <StarIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
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

                            {/* Client Name Section - Only shown if client exists */}
                            {clientName && (
                              <Box sx={{ mb: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'inline-block',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    backgroundColor: '#e3f2fd',
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {clientName}
                                </Typography>
                              </Box>
                            )}

                            <Box display="flex" alignItems="center" mb={1} gap={0.5} flexWrap="wrap">
                              <WorkIcon color="action" sx={{ fontSize: '1rem' }} />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {job.department}
                              </Typography>
                              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                              <LocationIcon color="action" sx={{ fontSize: '1rem' }} />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {jobForm.locations ? getLocationNames(jobForm.locations) : "Remote"}
                              </Typography>
                            </Box>

                            <Stack 
                              direction="row" 
                              spacing={0.5} 
                              mb={1} 
                              flexWrap="wrap" 
                              useFlexGap
                              sx={{ gap: 0.5 }}
                            >
                              <Chip
                                icon={<GroupIcon sx={{ fontSize: '0.8rem' }} />}
                                label={`${jobForm.openings || 0}`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: '#90caf9',
                                  height: 24,
                                  '& .MuiChip-label': { fontSize: '0.75rem' }
                                }}
                              />
                              <Chip
                                icon={<MoneyIcon sx={{ fontSize: '0.8rem' }} />}
                                label={jobForm.currency || 'USD'}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: '#a5d6a7',
                                  height: 24,
                                  '& .MuiChip-label': { fontSize: '0.75rem' }
                                }}
                              />
                              <Chip
                                icon={<TimeIcon sx={{ fontSize: '0.8rem' }} />}
                                label={jobForm.jobType || 'FT'}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: '#ffcc80',
                                  height: 24,
                                  '& .MuiChip-label': { fontSize: '0.75rem' }
                                }}
                              />
                            </Stack>

                            <Box 
                              display="flex" 
                              justifyContent="space-between" 
                              alignItems="center"
                            >
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <CalendarTodayIcon color="action" sx={{ fontSize: '1rem' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {targetDate ? format(targetDate, 'MMM dd') : "No date"}
                                </Typography>
                              </Box>
                              <Chip
                                label={status}
                                size="small"
                                color={getStatusColor(status)}
                                variant="outlined"
                                sx={{ 
                                  height: 24,
                                  '& .MuiChip-label': { fontSize: '0.75rem' }
                                }}
                              />
                            </Box>

                            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                              <PersonIcon color="action" sx={{ fontSize: '1rem' }} />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {Array.isArray(jobForm.recruitingPerson) ?
                                  jobForm.recruitingPerson.join(', ') :
                                  jobForm.recruitingPerson || "Not assigned"}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                              <BusinessIcon color="action" sx={{ fontSize: '1rem' }} />
                              <Typography variant="caption" color="text.secondary">
                                Unit: {jobForm.BusinessUnit === 'external' ? 'External' : 'Internal'}
                              </Typography>
                            </Box>
                          </CardContent>

                          <Menu
                            anchorEl={statusMenuAnchorEl}
                            open={Boolean(statusMenuAnchorEl && currentJobId === job._id)}
                            onClose={handleStatusMenuClose}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareMenuClick(e, job._id, job.jobTitle);
                              }}
                            >
                              <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                              Share
                            </MenuItem>
                            <Divider />
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
                          <Menu
                            anchorEl={shareAnchorEl}
                            open={Boolean(shareAnchorEl && currentJobId === job._id)}
                            onClose={handleShareMenuClose}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MenuItem onClick={handleShareClick}>
                              <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                              Share with Vendors
                            </MenuItem>
                          </Menu>
                        </Card>
                      );
                    })}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default JobsPage;