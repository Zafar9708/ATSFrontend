import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  Avatar,
  Tooltip,
  LinearProgress,
  Rating,
  Badge,
  InputAdornment,
  CardHeader,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachFile as AttachFileIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  ContentCopy as DuplicateIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import axios from 'axios';

// DUMMY DATA
const DUMMY_CANDIDATES = {
  pending: [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      mobile: '+1 (555) 123-4567',
      vendorEmail: 'techrecruiters@vendor.com',
      vendorName: 'Tech Recruiters Inc',
      jobId: {
        jobTitle: 'Senior React Developer',
        jobId: 'REACT-2024-001'
      },
      createdAt: '2024-01-15T10:30:00.000Z',
      status: 'pending',
      currentCTC: 120000,
      expectedCTC: 140000,
      currency: 'USD',
      experience: '5 years',
      skills: 'React, TypeScript, Node.js, MongoDB, AWS',
      education: 'Masters in Computer Science',
      currentLocation: 'San Francisco, CA',
      resume: {
        url: 'https://example.com/resume1.pdf',
        fileName: 'john_smith_resume.pdf'
      },
      aiAnalysis: {
        matchPercentage: 85,
        matchingSkills: ['React', 'TypeScript', 'Node.js'],
        missingSkills: ['GraphQL', 'Docker'],
        recommendation: 'Strong candidate with excellent React experience',
        analysis: 'High potential for senior developer role'
      },
      submissionDate: '2024-01-15'
    },
    {
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      mobile: '+1 (555) 987-6543',
      vendorEmail: 'hiresmart@vendor.com',
      vendorName: 'HireSmart Solutions',
      jobId: {
        jobTitle: 'DevOps Engineer',
        jobId: 'DEVOPS-2024-002'
      },
      createdAt: '2024-01-14T14:45:00.000Z',
      status: 'pending',
      currentCTC: 110000,
      expectedCTC: 130000,
      currency: 'USD',
      experience: '4 years',
      skills: 'Docker, Kubernetes, AWS, CI/CD, Terraform',
      education: 'Bachelors in IT',
      currentLocation: 'Remote',
      resume: {
        url: 'https://example.com/resume2.pdf',
        fileName: 'sarah_j_resume.pdf'
      },
      aiAnalysis: {
        matchPercentage: 78,
        matchingSkills: ['Docker', 'AWS', 'CI/CD'],
        missingSkills: ['Azure', 'Helm'],
        recommendation: 'Good fit for junior-mid DevOps role',
        analysis: 'Solid foundation in cloud technologies'
      },
      submissionDate: '2024-01-14'
    }
  ],
  approved: [
    {
      _id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      mobile: '+1 (555) 456-7890',
      vendorEmail: 'eliterecruit@vendor.com',
      vendorName: 'Elite Recruiters',
      jobId: {
        jobTitle: 'Full Stack Developer',
        jobId: 'FULLSTACK-2024-003'
      },
      createdAt: '2024-01-10T09:15:00.000Z',
      status: 'approved',
      currentCTC: 95000,
      expectedCTC: 115000,
      currency: 'USD',
      experience: '3 years',
      skills: 'JavaScript, Python, Django, React, PostgreSQL',
      education: 'Bachelors in Software Engineering',
      currentLocation: 'New York, NY',
      approvedBy: 'Admin User',
      approvedAt: '2024-01-12T11:30:00.000Z',
      resume: {
        url: 'https://example.com/resume3.pdf',
        fileName: 'michael_chen_resume.pdf'
      },
      aiAnalysis: {
        matchPercentage: 92,
        matchingSkills: ['JavaScript', 'React', 'Python'],
        missingSkills: ['TypeScript'],
        recommendation: 'Excellent full-stack developer candidate',
        analysis: 'Well-rounded skillset with good project experience'
      },
      submissionDate: '2024-01-10'
    }
  ],
  rejected: [
    {
      _id: '4',
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.w@example.com',
      mobile: '+1 (555) 789-0123',
      vendorEmail: 'techfinders@vendor.com',
      vendorName: 'Tech Finders',
      jobId: {
        jobTitle: 'Senior Backend Engineer',
        jobId: 'BACKEND-2024-004'
      },
      createdAt: '2024-01-05T16:20:00.000Z',
      status: 'rejected',
      currentCTC: 130000,
      expectedCTC: 160000,
      currency: 'USD',
      experience: '6 years',
      skills: 'Java, Spring Boot, Microservices, Kafka',
      education: 'Masters in Computer Engineering',
      currentLocation: 'Austin, TX',
      rejectedBy: 'Admin User',
      rejectedAt: '2024-01-07T10:15:00.000Z',
      rejectionReason: 'Salary expectations too high for budget',
      resume: {
        url: 'https://example.com/resume4.pdf',
        fileName: 'robert_w_resume.pdf'
      },
      aiAnalysis: {
        matchPercentage: 65,
        matchingSkills: ['Java', 'Spring Boot'],
        missingSkills: ['Node.js', 'Cloud Experience'],
        recommendation: 'Candidate requires specific Java expertise',
        analysis: 'Good technical skills but mismatch for current requirements'
      },
      submissionDate: '2024-01-05'
    }
  ],
  duplicate: [
    {
      _id: '5',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      mobile: '+1 (555) 234-5678',
      vendorEmail: 'fastrecruit@vendor.com',
      vendorName: 'Fast Recruit',
      jobId: {
        jobTitle: 'UX Designer',
        jobId: 'UX-2024-005'
      },
      createdAt: '2024-01-08T13:45:00.000Z',
      status: 'duplicate',
      currentCTC: 90000,
      expectedCTC: 110000,
      currency: 'USD',
      experience: '4 years',
      skills: 'Figma, Adobe XD, User Research, Prototyping',
      education: 'Bachelors in Design',
      currentLocation: 'Chicago, IL',
      duplicateOf: 'EXISTING-001',
      duplicateReason: 'Already in candidate database',
      resume: {
        url: 'https://example.com/resume5.pdf',
        fileName: 'emily_davis_resume.pdf'
      },
      aiAnalysis: {
        matchPercentage: 88,
        matchingSkills: ['Figma', 'User Research'],
        missingSkills: ['HTML/CSS'],
        recommendation: 'Duplicate entry',
        analysis: 'Candidate already exists in system'
      },
      submissionDate: '2024-01-08'
    }
  ]
};

const DUMMY_STATS = {
  total: 25,
  pending: 12,
  approved: 8,
  rejected: 3,
  duplicate: 2,
  avgMatchScore: 78
};

const VendorCandidatesPage = () => {
  const theme = useTheme();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState(DUMMY_STATS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedJob, setSelectedJob] = useState('all');
  const [useDummyData, setUseDummyData] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get unique vendors and jobs for filters
  const vendors = Array.from(new Set(candidates.map(c => c.vendorName || c.vendorEmail)));
  const jobs = Array.from(new Set(candidates.map(c => c.jobId?.jobTitle).filter(Boolean)));

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchCandidates = async (status = 'pending') => {
    try {
      setLoading(true);
      if (!useDummyData) {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/candidates?status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCandidates(response.data.candidates || []);
      } else {
        // Use dummy data
        setCandidates(DUMMY_CANDIDATES[status] || []);
      }
    } catch (error) {
      console.error('Error fetching vendor candidates:', error);
      // Fallback to dummy data
      setCandidates(DUMMY_CANDIDATES[status] || []);
      setUseDummyData(true);
      setSnackbar({
        open: true,
        message: 'Using demo data. Backend connection failed.',
        severity: 'info'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(activeTab);
  }, [activeTab, useDummyData]);

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };

  const handleApprove = async () => {
    try {
      if (!useDummyData) {
        const response = await axios.patch(
          `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/candidates/${selectedCandidate._id}/approve`,
          {},
          getAuthHeaders()
        );

        if (response.data.success) {
          setSnackbar({
            open: true,
            message: 'Candidate approved successfully',
            severity: 'success'
          });
        }
      } else {
        // Simulate success for dummy data
        setSnackbar({
          open: true,
          message: 'Candidate approved successfully (Demo)',
          severity: 'success'
        });
      }

      setApproveDialogOpen(false);
      setSelectedCandidate(null);
      fetchCandidates(activeTab);
    } catch (error) {
      console.error('Error approving candidate:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to approve candidate',
        severity: 'error'
      });
    }
  };

  const handleReject = async () => {
    try {
      if (!useDummyData) {
        const response = await axios.patch(
          `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/candidates/${selectedCandidate._id}/reject`,
          { reason: rejectReason },
          getAuthHeaders()
        );

        if (response.data.success) {
          setSnackbar({
            open: true,
            message: 'Candidate rejected successfully',
            severity: 'success'
          });
        }
      } else {
        // Simulate success for dummy data
        setSnackbar({
          open: true,
          message: 'Candidate rejected successfully (Demo)',
          severity: 'success'
        });
      }

      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedCandidate(null);
      fetchCandidates(activeTab);
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to reject candidate',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      duplicate: 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <PendingIcon fontSize="small" />,
      approved: <CheckCircleIcon fontSize="small" />,
      rejected: <CancelIcon fontSize="small" />,
      duplicate: <DuplicateIcon fontSize="small" />
    };
    return icons[status] || <PendingIcon fontSize="small" />;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnackbar({
        open: true,
        message: 'Data exported successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to export data',
        severity: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleDataMode = () => {
    setUseDummyData(!useDummyData);
    setSnackbar({
      open: true,
      message: `Switched to ${!useDummyData ? 'demo' : 'live'} data mode`,
      severity: 'info'
    });
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      searchTerm === '' ||
      candidate.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.vendorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVendor = selectedVendor === 'all' || candidate.vendorName === selectedVendor || candidate.vendorEmail === selectedVendor;
    const matchesJob = selectedJob === 'all' || candidate.jobId?.jobTitle === selectedJob;
    
    return matchesSearch && matchesVendor && matchesJob;
  });

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <Card sx={{ 
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `1px solid ${color}30`,
      borderRadius: 2,
      height: '100%'
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
            {subtext && (
              <Typography variant="caption" color="text.secondary">
                {subtext}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            bgcolor: `${color}20`,
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const MatchScore = ({ score }) => (
    <Box display="flex" alignItems="center" gap={1}>
      <LinearProgress 
        variant="determinate" 
        value={score} 
        sx={{ 
          width: 80, 
          height: 6,
          borderRadius: 3,
          bgcolor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            bgcolor: score >= 80 ? theme.palette.success.main : 
                    score >= 60 ? theme.palette.warning.main : 
                    theme.palette.error.main
          }
        }}
      />
      <Typography variant="body2" fontWeight="medium">
        {score}%
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto',marginLeft:7 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Vendor Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage candidates submitted by recruitment vendors
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchCandidates(activeTab)}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          <Button
            variant={useDummyData ? "contained" : "outlined"}
            color={useDummyData ? "warning" : "primary"}
            onClick={toggleDataMode}
            sx={{ minWidth: 120 }}
          >
            {useDummyData ? 'Demo Mode' : 'Live Mode'}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Submissions"
            value={stats.total}
            icon={<PersonIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={<PendingIcon sx={{ color: theme.palette.warning.main }} />}
            color={theme.palette.warning.main}
            subtext={`${Math.round((stats.pending / stats.total) * 100)}% of total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
            subtext={`${Math.round((stats.approved / stats.total) * 100)}% of total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Match Score"
            value={`${stats.avgMatchScore}%`}
            icon={<TrendingUpIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
            subtext="Across all submissions"
          />
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={selectedVendor}
                  label="Vendor"
                  onChange={(e) => setSelectedVendor(e.target.value)}
                >
                  <MenuItem value="all">All Vendors</MenuItem>
                  {vendors.map((vendor, index) => (
                    <MenuItem key={index} value={vendor}>
                      {vendor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Job Title</InputLabel>
                <Select
                  value={selectedJob}
                  label="Job Title"
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <MenuItem value="all">All Jobs</MenuItem>
                  {jobs.map((job, index) => (
                    <MenuItem key={index} value={job}>
                      {job}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setSelectedVendor('all');
                    setSelectedJob('all');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)} 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem'
              }
            }}
          >
            <Tab 
              value="pending" 
              label={
                <Badge badgeContent={stats.pending} color="warning" sx={{ mr: 1 }}>
                  Pending Review
                </Badge>
              } 
            />
            <Tab 
              value="approved" 
              label={
                <Badge badgeContent={stats.approved} color="success" sx={{ mr: 1 }}>
                  Approved
                </Badge>
              } 
            />
            <Tab 
              value="rejected" 
              label={
                <Badge badgeContent={stats.rejected} color="error" sx={{ mr: 1 }}>
                  Rejected
                </Badge>
              } 
            />
            <Tab 
              value="duplicate" 
              label={
                <Badge badgeContent={stats.duplicate} color="default" sx={{ mr: 1 }}>
                  Duplicates
                </Badge>
              } 
            />
          </Tabs>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Job</TableCell>
                  <TableCell>Match Score</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <TableRow 
                      key={candidate._id}
                      hover
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.light, 0.04),
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleViewCandidate(candidate)}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">
                              {candidate.firstName} {candidate.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {candidate.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {candidate.vendorName || candidate.vendorEmail}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {candidate.vendorEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {candidate.jobId?.jobTitle || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {candidate.jobId?.jobId || ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <MatchScore score={candidate.aiAnalysis?.matchPercentage || 0} />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {new Date(candidate.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(candidate.status)}
                          label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          color={getStatusColor(candidate.status)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box display="flex" gap={0.5} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewCandidate(candidate)}
                              color="primary"
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {candidate.status === 'pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCandidate(candidate);
                                    setApproveDialogOpen(true);
                                  }}
                                  color="success"
                                  sx={{ 
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                                  }}
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCandidate(candidate);
                                    setRejectDialogOpen(true);
                                  }}
                                  color="error"
                                  sx={{ 
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                                  }}
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No {activeTab} candidates found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm ? 'Try adjusting your search filters' : 'Check back later for new submissions'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Candidate Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
              {selectedCandidate?.firstName?.charAt(0)}{selectedCandidate?.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted by: {selectedCandidate?.vendorName || selectedCandidate?.vendorEmail}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {selectedCandidate && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <EmailIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography>{selectedCandidate.email}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PhoneIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Mobile</Typography>
                        <Typography>{selectedCandidate.mobile || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Location</Typography>
                        <Typography>{selectedCandidate.currentLocation || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <WorkIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Experience</Typography>
                        <Typography>{selectedCandidate.experience || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Job & Compensation
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Job Applied</Typography>
                    <Typography>{selectedCandidate.jobId?.jobTitle || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCandidate.jobId?.jobId}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Current CTC</Typography>
                      <Typography>
                        {selectedCandidate.currentCTC ? 
                          `${selectedCandidate.currency} ${selectedCandidate.currentCTC.toLocaleString()}` : 'N/A'
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Expected CTC</Typography>
                      <Typography>
                        {selectedCandidate.expectedCTC ? 
                          `${selectedCandidate.currency} ${selectedCandidate.expectedCTC.toLocaleString()}` : 'N/A'
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  AI Analysis
                </Typography>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Match Score</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedCandidate.aiAnalysis?.matchPercentage || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={selectedCandidate.aiAnalysis?.matchPercentage || 0}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {selectedCandidate.aiAnalysis?.recommendation || 'No analysis available'}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedCandidate.skills ? (
                    selectedCandidate.skills.split(',').map((skill, index) => (
                      <Chip key={index} label={skill.trim()} size="small" />
                    ))
                  ) : (
                    <Typography color="text.secondary">No skills listed</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Education
                </Typography>
                <Typography>{selectedCandidate.education || 'N/A'}</Typography>
              </Grid>

              {selectedCandidate.resume && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Resume
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    href={selectedCandidate.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume ({selectedCandidate.resume.fileName})
                  </Button>
                </Grid>
              )}

              {selectedCandidate.status === 'rejected' && selectedCandidate.rejectionReason && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), borderColor: alpha(theme.palette.error.main, 0.2) }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>
                        Rejection Details
                      </Typography>
                      <Typography>{selectedCandidate.rejectionReason}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Rejected on: {new Date(selectedCandidate.rejectedAt).toLocaleDateString()} by {selectedCandidate.rejectedBy}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          {selectedCandidate?.status === 'pending' && (
            <>
              <Button 
                onClick={() => setRejectDialogOpen(true)} 
                color="error" 
                startIcon={<RejectIcon />}
              >
                Reject
              </Button>
              <Button 
                onClick={() => setApproveDialogOpen(true)} 
                variant="contained" 
                color="success"
                startIcon={<ApproveIcon />}
              >
                Approve
              </Button>
            </>
          )}
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Approve Candidate</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: theme.palette.success.main }}>
              <CheckCircleIcon />
            </Avatar>
            <Box>
              <Typography fontWeight="medium">
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Match Score: {selectedCandidate?.aiAnalysis?.matchPercentage}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2">
            This candidate will be added to the main candidate database and become available for the hiring process.
            Are you sure you want to approve?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="success" startIcon={<ApproveIcon />}>
            Approve Candidate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Reject Candidate</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: theme.palette.error.main }}>
              <CancelIcon />
            </Avatar>
            <Box>
              <Typography fontWeight="medium">
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCandidate?.vendorName}
              </Typography>
            </Box>
          </Box>
          <Typography gutterBottom>
            Please provide a reason for rejecting this candidate:
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={3}
            margin="normal"
            placeholder="e.g., Skills mismatch, Salary expectations too high, etc."
          />
          <Typography variant="caption" color="text.secondary">
            This feedback will be shared with the vendor.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            startIcon={<RejectIcon />}
            disabled={!rejectReason.trim()}
          >
            Reject Candidate
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorCandidatesPage;