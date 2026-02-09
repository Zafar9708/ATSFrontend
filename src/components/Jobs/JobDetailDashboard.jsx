import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Button,
  TextField, Avatar, Stack, IconButton, Paper,
  Chip, useTheme, styled, alpha, LinearProgress,
  Grid, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Tooltip, Menu, MenuItem,
  InputAdornment, Badge, Divider
} from "@mui/material";
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  HowToReg as HowToRegIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Styled Components
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.1),
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
  }
}));

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.08),
  height: '100%'
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '8px 20px',
  fontSize: '0.875rem',
  '&:hover': {
    background: theme.palette.primary.dark,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  background: theme.palette.grey[100],
  color: theme.palette.text.primary,
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '8px 20px',
  fontSize: '0.875rem',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  '&:hover': {
    background: theme.palette.grey[200],
    borderColor: alpha(theme.palette.divider, 0.3)
  }
}));

const Dashboard = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [job, setJob] = useState(null);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    interviewsToday: 0,
    positionsFilled: 0,
    acceptanceRate: 0
  });
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  
  // Dummy Data
  const dummyJob = {
    id: jobId || "JOB-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    experience: "5+ years",
    openings: 3,
    postedDate: "Jan 10, 2024",
    status: "active",
    description: "We are looking for a Senior Frontend Developer with expertise in React.js and modern web technologies to join our growing team."
  };
  
  const dummyCandidates = [
    {
      id: "C001",
      name: "John Smith",
      email: "john.smith@email.com",
      stage: "Interview",
      status: "active",
      appliedDate: "Jan 15, 2024",
      experience: "5 years",
      location: "New York, NY",
      avatarColor: "#2196F3",
      rating: 4.5,
      lastActivity: "2 hours ago"
    },
    {
      id: "C002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      stage: "Screening",
      status: "active",
      appliedDate: "Jan 18, 2024",
      experience: "3 years",
      location: "San Francisco, CA",
      avatarColor: "#FF9800",
      rating: 4.2,
      lastActivity: "1 day ago"
    },
    {
      id: "C003",
      name: "Michael Chen",
      email: "michael.c@email.com",
      stage: "Offer",
      status: "active",
      appliedDate: "Jan 20, 2024",
      experience: "7 years",
      location: "Austin, TX",
      avatarColor: "#4CAF50",
      rating: 4.8,
      lastActivity: "3 hours ago"
    },
    {
      id: "C004",
      name: "Emma Davis",
      email: "emma.d@email.com",
      stage: "Hired",
      status: "hired",
      appliedDate: "Jan 10, 2024",
      experience: "4 years",
      location: "Chicago, IL",
      avatarColor: "#9C27B0",
      rating: 4.6,
      lastActivity: "1 week ago"
    },
    {
      id: "C005",
      name: "Robert Wilson",
      email: "robert.w@email.com",
      stage: "Rejected",
      status: "rejected",
      appliedDate: "Jan 5, 2024",
      experience: "6 years",
      location: "Boston, MA",
      avatarColor: "#F44336",
      rating: 3.8,
      lastActivity: "2 days ago"
    },
    {
      id: "C006",
      name: "Lisa Brown",
      email: "lisa.b@email.com",
      stage: "Interview",
      status: "active",
      appliedDate: "Dec 28, 2023",
      experience: "8 years",
      location: "Seattle, WA",
      avatarColor: "#009688",
      rating: 4.7,
      lastActivity: "5 hours ago"
    }
  ];
  
  const dummyInterviews = [
    {
      id: "I001",
      candidateName: "John Smith",
      candidateId: "C001",
      type: "Technical",
      time: "10:00 AM - 11:00 AM",
      date: "Today",
      interviewers: ["Alex Johnson", "Sarah Lee"],
      status: "scheduled",
      platform: "Zoom"
    },
    {
      id: "I002",
      candidateName: "Michael Chen",
      candidateId: "C003",
      type: "Final",
      time: "2:00 PM - 3:00 PM",
      date: "Today",
      interviewers: ["David Kim"],
      status: "scheduled",
      platform: "Google Meet"
    },
    {
      id: "I003",
      candidateName: "Lisa Brown",
      candidateId: "C006",
      type: "HR",
      time: "11:00 AM - 12:00 PM",
      date: "Tomorrow",
      interviewers: ["Maria Garcia"],
      status: "scheduled",
      platform: "In-person"
    }
  ];
  
  const dummyPipelineData = [
    { name: 'Sourced', value: 24, color: '#2196F3' },
    { name: 'Screening', value: 18, color: '#FF9800' },
    { name: 'Interview', value: 12, color: '#9C27B0' },
    { name: 'Offer', value: 6, color: '#4CAF50' },
    { name: 'Hired', value: 3, color: '#00C853' },
    { name: 'Rejected', value: 9, color: '#F44336' }
  ];
  
  const dummyWeeklyData = [
    { day: 'Mon', applications: 8, interviews: 3 },
    { day: 'Tue', applications: 12, interviews: 5 },
    { day: 'Wed', applications: 10, interviews: 4 },
    { day: 'Thu', applications: 15, interviews: 6 },
    { day: 'Fri', applications: 7, interviews: 2 },
    { day: 'Sat', applications: 2, interviews: 1 },
    { day: 'Sun', applications: 1, interviews: 0 }
  ];

  // Initialize data
  useEffect(() => {
    setJob(dummyJob);
    setCandidates(dummyCandidates);
    setInterviews(dummyInterviews);
    setPipelineData(dummyPipelineData);
    setWeeklyData(dummyWeeklyData);
    
    // Calculate stats
    const totalCandidates = dummyCandidates.length;
    const interviewsToday = dummyInterviews.filter(i => i.date === 'Today').length;
    const positionsFilled = dummyCandidates.filter(c => c.stage === 'Hired').length;
    const acceptanceRate = ((positionsFilled / totalCandidates) * 100).toFixed(1);
    
    setStats({
      totalCandidates,
      interviewsToday,
      positionsFilled,
      acceptanceRate: parseFloat(acceptanceRate)
    });
  }, [jobId]);

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Sourced': '#2196F3',
      'Screening': '#FF9800',
      'Interview': '#9C27B0',
      'Offer': '#4CAF50',
      'Hired': '#00C853',
      'Rejected': '#F44336'
    };
    return colors[stage] || '#757575';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'primary';
      case 'hired': return 'success';
      case 'rejected': return 'error';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '100%',
      overflowX: 'hidden',
      marginLeft:10
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 0.5,
              color: theme.palette.text.primary
            }}>
              {job?.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip 
                size="small" 
                icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                label={job?.department} 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                size="small" 
                icon={<LocationIcon sx={{ fontSize: 14 }} />}
                label={job?.location} 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                size="small" 
                icon={<MoneyIcon sx={{ fontSize: 14 }} />}
                label={job?.salary} 
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <SecondaryButton startIcon={<EditIcon />}>
              Edit Job
            </SecondaryButton>
            <PrimaryButton startIcon={<AddIcon />}>
              Add Candidate
            </PrimaryButton>
          </Box>
        </Box>
        
        {/* Search and Filter Bar */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          mb: 3 
        }}>
          <TextField
            placeholder="Search candidates, interviews..."
            size="small"
            sx={{
              flex: 1,
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: theme.palette.background.paper
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SecondaryButton
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </SecondaryButton>
          <SecondaryButton startIcon={<DownloadIcon />}>
            Export
          </SecondaryButton>
          <SecondaryButton startIcon={<RefreshIcon />}>
            Refresh
          </SecondaryButton>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Total Candidates
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {stats.totalCandidates}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dummyCandidates.filter(c => c.status === 'active').length} active
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 48,
                    height: 48
                  }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ 
                    mt: 2,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }}
                />
              </CardContent>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Interviews Today
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {stats.interviewsToday}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {interviews.length} total scheduled
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    width: 48,
                    height: 48
                  }}>
                    <ScheduleIcon />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    2 completed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 pending
                  </Typography>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Positions Filled
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {stats.positionsFilled}/{job?.openings}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {job?.openings - stats.positionsFilled} remaining
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    width: 48,
                    height: 48
                  }}>
                    <HowToRegIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.positionsFilled / (job?.openings || 1)) * 100} 
                  sx={{ 
                    mt: 2,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1)
                  }}
                />
              </CardContent>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Acceptance Rate
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {stats.acceptanceRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Above average
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    width: 48,
                    height: 48
                  }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    +5.2% from last month
                  </Typography>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>
      </Box>
      
      {/* Main Dashboard Content */}
      <Grid container spacing={2}>
        {/* Left Column - Charts */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {/* Pipeline Chart */}
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Candidate Pipeline
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <SecondaryButton size="small">
                        This Week
                      </SecondaryButton>
                      <SecondaryButton size="small">
                        All Time
                      </SecondaryButton>
                    </Box>
                  </Box>
                  <Box sx={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: '8px',
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {pipelineData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>
            
            {/* Weekly Activity */}
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Weekly Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 7 days
                    </Typography>
                  </Box>
                  <Box sx={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: '8px',
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="applications" 
                          stroke={theme.palette.primary.main} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="interviews" 
                          stroke={theme.palette.secondary.main} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Right Column - Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* Upcoming Interviews */}
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Upcoming Interviews
                    </Typography>
                    <PrimaryButton size="small" endIcon={<ChevronRightIcon />}>
                      View All
                    </PrimaryButton>
                  </Box>
                  <Stack spacing={2}>
                    {interviews.map((interview) => (
                      <Paper 
                        key={interview.id}
                        variant="outlined"
                        sx={{ 
                          p: 2,
                          borderRadius: '8px',
                          borderColor: alpha(theme.palette.divider, 0.2),
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.02)
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {interview.candidateName}
                          </Typography>
                          <Chip 
                            label={interview.type}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption">
                              {interview.date}, {interview.time}
                            </Typography>
                          </Box>
                          <Chip 
                            label={interview.platform}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AvatarGroup max={2} sx={{ mr: 1 }}>
                              {interview.interviewers.map((interviewer, idx) => (
                                <Avatar 
                                  key={idx}
                                  sx={{ 
                                    width: 24, 
                                    height: 24,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {interviewer.charAt(0)}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                            <Typography variant="caption" color="text.secondary">
                              {interview.interviewers.length} interviewers
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </DashboardCard>
            </Grid>
            
            {/* Quick Actions */}
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CalendarIcon />}
                      onClick={() => navigate('/interviews/schedule')}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      Schedule Interview
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<MailIcon />}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      Send Bulk Email
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/jobs/update/${jobId}`)}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      Update Job Posting
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/jobs/create')}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      Create New Job
                    </Button>
                  </Stack>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Candidates Table */}
        <Grid item xs={12}>
          <DashboardCard>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Candidates
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <SecondaryButton startIcon={<DownloadIcon />}>
                    Export
                  </SecondaryButton>
                  <PrimaryButton startIcon={<AddIcon />}>
                    Add Candidate
                  </PrimaryButton>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow 
                        key={candidate.id}
                        hover
                        sx={{ 
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.02)
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                mr: 2,
                                bgcolor: candidate.avatarColor,
                                color: theme.palette.common.white
                              }}
                            >
                              {candidate.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {candidate.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {candidate.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={candidate.stage}
                            size="small"
                            sx={{
                              bgcolor: alpha(getStageColor(candidate.stage), 0.1),
                              color: getStageColor(candidate.stage),
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {candidate.appliedDate}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={candidate.status}
                            size="small"
                            color={getStatusColor(candidate.status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 0.5, fontWeight: 500 }}>
                              {candidate.rating}
                            </Typography>
                            <Box sx={{ 
                              width: 60,
                              height: 4,
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              borderRadius: 2,
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                width: `${(candidate.rating / 5) * 100}%`,
                                height: '100%',
                                bgcolor: theme.palette.primary.main
                              }} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {candidate.lastActivity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="Send Email">
                              <IconButton size="small">
                                <MailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Schedule Interview">
                              <IconButton size="small">
                                <CalendarIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Profile">
                              <IconButton size="small">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

// AvatarGroup component
const AvatarGroup = ({ children, max = 3, sx }) => {
  const avatars = React.Children.toArray(children);
  const total = avatars.length;
  const displayAvatars = avatars.slice(0, max);
  const excess = total - max;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      {displayAvatars.map((avatar, index) => (
        <Box 
          key={index}
          sx={{ 
            ml: index > 0 ? -1 : 0,
            zIndex: total - index
          }}
        >
          {avatar}
        </Box>
      ))}
      {excess > 0 && (
        <Avatar 
          sx={{ 
            width: 24, 
            height: 24,
            fontSize: '0.75rem',
            ml: -1,
            zIndex: 0,
            bgcolor: 'grey.300',
            color: 'grey.700'
          }}
        >
          +{excess}
        </Avatar>
      )}
    </Box>
  );
};

export default Dashboard;