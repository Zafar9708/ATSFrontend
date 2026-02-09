import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Divider,
  Stack,
  Fade,
  Modal
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as ChartTooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Static data for demo
const staticJobsData = [
  {
    id: 'JOB-001',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    department: 'Engineering',
    experience: '5+ years',
    type: 'Full-time',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    status: 'active',
    priority: 'high',
    candidates: 24,
    openings: 3,
    postedDate: '2024-01-15',
    deadline: '2024-02-28',
    recruiter: 'Sarah Johnson',
    progress: 75
  },
  {
    id: 'JOB-002',
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    department: 'Design',
    experience: '3+ years',
    type: 'Full-time',
    location: 'Remote',
    salary: '$90,000 - $110,000',
    status: 'active',
    priority: 'medium',
    candidates: 18,
    openings: 2,
    postedDate: '2024-01-20',
    deadline: '2024-03-10',
    recruiter: 'Michael Chen',
    progress: 60
  },
  {
    id: 'JOB-003',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    department: 'Operations',
    experience: '4+ years',
    type: 'Contract',
    location: 'New York, NY',
    salary: '$130,000 - $160,000',
    status: 'active',
    priority: 'high',
    candidates: 32,
    openings: 1,
    postedDate: '2024-01-10',
    deadline: '2024-02-20',
    recruiter: 'David Wilson',
    progress: 90
  },
  {
    id: 'JOB-004',
    title: 'Product Manager',
    company: 'ProductLabs',
    department: 'Product',
    experience: '6+ years',
    type: 'Full-time',
    location: 'Austin, TX',
    salary: '$140,000 - $180,000',
    status: 'on-hold',
    priority: 'medium',
    candidates: 15,
    openings: 1,
    postedDate: '2024-01-05',
    deadline: '2024-02-15',
    recruiter: 'Emma Davis',
    progress: 40
  },
  {
    id: 'JOB-005',
    title: 'Data Scientist',
    company: 'DataInsights',
    department: 'Analytics',
    experience: '3+ years',
    type: 'Full-time',
    location: 'Seattle, WA',
    salary: '$110,000 - $140,000',
    status: 'active',
    priority: 'low',
    candidates: 28,
    openings: 2,
    postedDate: '2024-01-25',
    deadline: '2024-03-05',
    recruiter: 'Robert Garcia',
    progress: 50
  },
  {
    id: 'JOB-006',
    title: 'Backend Developer',
    company: 'CodeCraft',
    department: 'Engineering',
    experience: '4+ years',
    type: 'Full-time',
    location: 'Remote',
    salary: '$115,000 - $145,000',
    status: 'closed',
    priority: 'medium',
    candidates: 42,
    openings: 0,
    postedDate: '2023-12-15',
    deadline: '2024-01-30',
    recruiter: 'James Miller',
    progress: 100
  },
  {
    id: 'JOB-007',
    title: 'Marketing Specialist',
    company: 'GrowthHack',
    department: 'Marketing',
    experience: '2+ years',
    type: 'Full-time',
    location: 'Los Angeles, CA',
    salary: '$70,000 - $90,000',
    status: 'active',
    priority: 'low',
    candidates: 22,
    openings: 2,
    postedDate: '2024-01-30',
    deadline: '2024-03-15',
    recruiter: 'Lisa Thompson',
    progress: 30
  },
  {
    id: 'JOB-008',
    title: 'QA Engineer',
    company: 'QualityFirst',
    department: 'Quality Assurance',
    experience: '3+ years',
    type: 'Contract',
    location: 'Boston, MA',
    salary: '$85,000 - $105,000',
    status: 'active',
    priority: 'medium',
    candidates: 19,
    openings: 3,
    postedDate: '2024-01-18',
    deadline: '2024-02-25',
    recruiter: 'Thomas Lee',
    progress: 65
  }
];

// Chart data
const applicationTrendsData = [
  { month: 'Jan', applications: 120, interviews: 45 },
  { month: 'Feb', applications: 180, interviews: 65 },
  { month: 'Mar', applications: 150, interviews: 55 },
  { month: 'Apr', applications: 220, interviews: 85 },
  { month: 'May', applications: 190, interviews: 70 },
  { month: 'Jun', applications: 250, interviews: 95 }
];

const jobStatusData = [
  { name: 'Active', value: 65, color: '#4CAF50' },
  { name: 'On Hold', value: 15, color: '#FF9800' },
  { name: 'Closed', value: 20, color: '#F44336' }
];

const departmentDistributionData = [
  { department: 'Engineering', jobs: 8, candidates: 150 },
  { department: 'Design', jobs: 4, candidates: 60 },
  { department: 'Product', jobs: 3, candidates: 45 },
  { department: 'Marketing', jobs: 2, candidates: 30 },
  { department: 'Sales', jobs: 2, candidates: 25 }
];

const RecruiterDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(staticJobsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    department: '',
    experience: '',
    location: '',
    salary: '',
    status: 'active',
    priority: 'medium',
    openings: 1
  });

  // Dashboard stats
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalCandidates: jobs.reduce((sum, job) => sum + job.candidates, 0),
    conversionRate: 12.5,
    avgTimeToHire: 28
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateJob = () => {
    navigate('/dashboard/jobs/createJob');
  };

  const handleViewJob = (jobId) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setEditForm({
      title: job.title,
      company: job.company,
      department: job.department,
      experience: job.experience,
      location: job.location,
      salary: job.salary,
      status: job.status,
      priority: job.priority,
      openings: job.openings
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setJobs(jobs.map(job => 
      job.id === jobToEdit.id ? { ...job, ...editForm } : job
    ));
    setEditModalOpen(false);
    setJobToEdit(null);
  };

  const handleDeleteJob = (job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setJobs(jobs.filter(j => j.id !== selectedJob.id));
    setDeleteDialogOpen(false);
    setSelectedJob(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckIcon fontSize="small" />;
      case 'on-hold': return <ScheduleIcon fontSize="small" />;
      case 'closed': return <CancelIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ 
      ml: '10px',
      scrollable:"hidden",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3,
      boxSizing: 'border-box',
      width: 'calc(100vw - 180px)',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Recruiter Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Manage your job postings and track recruitment metrics
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateJob}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 3,
              px: 3,
              py: 1,
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Create Job
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { 
              title: 'Total Jobs', 
              value: stats.totalJobs, 
              icon: <WorkIcon />, 
              color: '#2196F3',
              trend: '+12% from last month'
            },
            { 
              title: 'Active Jobs', 
              value: stats.activeJobs, 
              icon: <CheckIcon />, 
              color: '#4CAF50',
              trend: `${Math.round((stats.activeJobs / stats.totalJobs) * 100)}% of total`
            },
            { 
              title: 'Total Candidates', 
              value: stats.totalCandidates.toLocaleString(), 
              icon: <PeopleIcon />, 
              color: '#FF9800',
              trend: '+24% from last month'
            },
            { 
              title: 'Avg. Time to Hire', 
              value: `${stats.avgTimeToHire} days`, 
              icon: <CalendarIcon />, 
              color: '#9C27B0',
              trend: '-5 days from last quarter'
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                backdropFilter: 'blur(4px)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(31, 38, 135, 0.15)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${stat.color} 30%, ${alpha(stat.color, 0.7)} 90%)`,
                      color: 'white',
                      mr: 2
                    }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="800" color="text.primary">
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      {stat.trend}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Charts Section */}
          <Grid item xs={12} lg={8}>
            {/* Application Trends */}
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
              backdropFilter: 'blur(4px)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              p: 3,
              mb: 3
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Application Trends
                </Typography>
                <Chip 
                  label="Last 6 months" 
                  size="small"
                  sx={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}
                />
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationTrendsData}>
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip 
                      contentStyle={{
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#2196F3" 
                      fillOpacity={1} 
                      fill="url(#colorApplications)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="interviews" 
                      stroke="#4CAF50" 
                      fillOpacity={1} 
                      fill="url(#colorInterviews)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>

            {/* Smaller Charts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                  backdropFilter: 'blur(4px)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  p: 3,
                  height: '100%'
                }}>
                  <Typography variant="h6" fontWeight="600" color="text.primary" mb={3}>
                    Job Status Distribution
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {jobStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          contentStyle={{
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e0e0e0'
                          }}
                          formatter={(value) => [value, 'Jobs']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                  backdropFilter: 'blur(4px)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  p: 3,
                  height: '100%'
                }}>
                  <Typography variant="h6" fontWeight="600" color="text.primary" mb={3}>
                    Department Distribution
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis 
                          dataKey="department" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip 
                          contentStyle={{
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                        <Bar 
                          dataKey="jobs" 
                          fill="#2196F3" 
                          radius={[4, 4, 0, 0]}
                          name="Open Positions"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Sidebar Content */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
              backdropFilter: 'blur(4px)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              p: 3,
              height: '100%'
            }}>
              {/* Quick Actions */}
              <Typography variant="h6" fontWeight="600" color="text.primary" mb={3}>
                Quick Actions
              </Typography>
              <Stack spacing={2} sx={{ mb: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateJob}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: 3,
                    py: 1.5,
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create New Job
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PeopleIcon />}
                  onClick={() => navigate('/candidates')}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    borderColor: 'rgba(33, 150, 243, 0.3)',
                    color: '#2196F3',
                    '&:hover': {
                      borderColor: '#2196F3',
                      background: 'rgba(33, 150, 243, 0.04)'
                    }
                  }}
                >
                  View Candidates
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    borderColor: 'rgba(76, 175, 80, 0.3)',
                    color: '#4CAF50',
                    '&:hover': {
                      borderColor: '#4CAF50',
                      background: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Export Reports
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Recent Activity */}
              <Typography variant="h6" fontWeight="600" color="text.primary" mb={3}>
                Recent Activity
              </Typography>
              <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                {[
                  { action: 'New application received for Senior Developer', time: '2 hours ago' },
                  { action: 'Interview scheduled for UX Designer position', time: '4 hours ago' },
                  { action: 'Job posting "Data Scientist" published', time: '1 day ago' },
                  { action: 'Candidate Michael Chen hired', time: '2 days ago' },
                  { action: 'New job "DevOps Engineer" created', time: '3 days ago' },
                  { action: 'Job "Backend Developer" closed', time: '4 days ago' }
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: index === 0 ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(33, 150, 243, 0.05)',
                        borderColor: 'rgba(33, 150, 243, 0.2)'
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                      {activity.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Jobs Table */}
        <Card sx={{ 
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
          backdropFilter: 'blur(4px)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          overflow: 'hidden',
          mt: 3
        }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Recent Job Postings
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center', 
                flexWrap: 'wrap'
              }}>
                <TextField
                  size="small"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.8)'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  displayEmpty
                  sx={{ 
                    borderRadius: 3,
                    minWidth: 120,
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  size="small"
                  displayEmpty
                  sx={{ 
                    borderRadius: 3,
                    minWidth: 120,
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Job Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Candidates</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow 
                    key={job.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(33, 150, 243, 0.02)'
                      }
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography fontWeight="600" color="text.primary">
                          {job.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {job.company} • {job.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.department}
                        size="small"
                        sx={{
                          background: 'rgba(33, 150, 243, 0.1)',
                          color: '#2196F3',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography>{job.location}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                          {[...Array(Math.min(job.candidates, 3))].map((_, i) => (
                            <Avatar key={i} alt={`Candidate ${i + 1}`} />
                          ))}
                        </AvatarGroup>
                        <Typography fontWeight="500">{job.candidates}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={job.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              background: 'rgba(0, 0, 0, 0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: job.progress === 100 ? '#4CAF50' : '#2196F3'
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="500" sx={{ minWidth: 40 }}>
                          {job.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(job.status)}
                        label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        size="small"
                        sx={{
                          background: `rgba(${
                            job.status === 'active' ? '76, 175, 80' : 
                            job.status === 'on-hold' ? '255, 152, 0' : '244, 67, 54'
                          }, 0.1)`,
                          color: job.status === 'active' ? '#4CAF50' : 
                                 job.status === 'on-hold' ? '#FF9800' : '#F44336',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewJob(job.id)}
                            sx={{
                              background: 'rgba(33, 150, 243, 0.1)',
                              color: '#2196F3',
                              '&:hover': {
                                background: '#2196F3',
                                color: 'white'
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Job">
                          <IconButton
                            size="small"
                            onClick={() => handleEditJob(job)}
                            sx={{
                              background: 'rgba(255, 152, 0, 0.1)',
                              color: '#FF9800',
                              '&:hover': {
                                background: '#FF9800',
                                color: 'white'
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Job">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteJob(job)}
                            sx={{
                              background: 'rgba(244, 67, 54, 0.1)',
                              color: '#F44336',
                              '&:hover': {
                                background: '#F44336',
                                color: 'white'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Edit Job Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={editModalOpen}>
          <Card sx={{
            width: '100%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="700" color="text.primary">
                Edit Job
              </Typography>
              <IconButton onClick={() => setEditModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={editForm.title}
                  onChange={(e) => handleEditFormChange('title', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  value={editForm.company}
                  onChange={(e) => handleEditFormChange('company', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={editForm.department}
                  onChange={(e) => handleEditFormChange('department', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Experience"
                  value={editForm.experience}
                  onChange={(e) => handleEditFormChange('experience', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={editForm.location}
                  onChange={(e) => handleEditFormChange('location', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  value={editForm.salary}
                  onChange={(e) => handleEditFormChange('salary', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={editForm.status}
                  onChange={(e) => handleEditFormChange('status', e.target.value)}
                  size="small"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={editForm.priority}
                  onChange={(e) => handleEditFormChange('priority', e.target.value)}
                  size="small"
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Open Positions"
                  type="number"
                  value={editForm.openings}
                  onChange={(e) => handleEditFormChange('openings', e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setEditModalOpen(false)}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: '#2196F3',
                    color: '#2196F3'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)'
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Card>
        </Fade>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 3,
            width: '100%',
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 2, color: 'text.primary' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography color="text.primary">
            Are you sure you want to delete the job posting for <strong>{selectedJob?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="error" mt={2}>
            This action cannot be undone. All associated candidate data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0, gap: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: '#2196F3',
                color: '#2196F3'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #F44336 30%, #FF5252 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #D32F2F 30%, #F44336 90%)'
              }
            }}
          >
            Delete Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruiterDashboard;