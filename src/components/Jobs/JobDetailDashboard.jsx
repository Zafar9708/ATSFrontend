// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box, Typography, Card, CardContent, Button,
//   TextField, Avatar, Stack, IconButton, Paper,
//   Chip, useTheme, styled, alpha, LinearProgress,
//   Grid, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Tooltip, Menu, MenuItem,Select,
//   InputAdornment, Badge, Divider, Alert, CircularProgress
// } from "@mui/material";
// import {
//   People as PeopleIcon,
//   Schedule as ScheduleIcon,
//   HowToReg as HowToRegIcon,
//   Work as WorkIcon,
//   TrendingUp as TrendingUpIcon,
//   MoreVert as MoreVertIcon,
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Download as DownloadIcon,
//   Mail as MailIcon,
//   Phone as PhoneIcon,
//   CalendarToday as CalendarIcon,
//   LocationOn as LocationIcon,
//   AttachMoney as MoneyIcon,
//   Business as BusinessIcon,
//   CheckCircle as CheckCircleIcon,
//   PlayArrow as PlayArrowIcon,
//   Pause as PauseIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   Add as AddIcon,
//   ChevronRight as ChevronRightIcon,
//   BarChart as BarChartIcon,
//   Timeline as TimelineIcon,
//   Refresh as RefreshIcon,
//   Notifications as NotificationsIcon
// } from "@mui/icons-material";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, 
//   Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell
// } from 'recharts';
// import axios from 'axios';

// // API Configuration
// const API_BASE_URL = '/api/v1';
// const getAuthToken = () => localStorage.getItem('token'); // Adjust based on your token storage

// // API Service
// const apiService = {
//   getJobDetails: async (jobId) => {
//     const token = getAuthToken();
//     const response = await axios.get(`${API_BASE_URL}/job/${jobId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   getJobCandidates: async (jobId) => {
//     const token = getAuthToken();
//     const response = await axios.get(`${API_BASE_URL}/candidates/job/${jobId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   getUpcomingInterviews: async () => {
//     const token = getAuthToken();
//     try {
//       const response = await axios.get(`${API_BASE_URL}/interviews/upcoming`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       // Try offline endpoint if main fails
//       const offlineResponse = await axios.get(`${API_BASE_URL}/offline/interviews/upcoming`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return offlineResponse.data;
//     }
//   },

//   updateCandidateStage: async (candidateId, stage) => {
//     const token = getAuthToken();
//     const response = await axios.patch(`${API_BASE_URL}/candidates/${candidateId}/stage`, 
//       { stage },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   },

//   deleteCandidate: async (candidateId) => {
//     const token = getAuthToken();
//     const response = await axios.delete(`${API_BASE_URL}/candidates/${candidateId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   }
// };

// // Styled Components
// const StatCard = styled(Card)(({ theme }) => ({
//   borderRadius: '12px',
//   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
//   border: '1px solid',
//   borderColor: alpha(theme.palette.divider, 0.1),
//   transition: 'all 0.3s ease',
//   height: '100%',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
//   }
// }));

// const DashboardCard = styled(Card)(({ theme }) => ({
//   borderRadius: '12px',
//   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
//   border: '1px solid',
//   borderColor: alpha(theme.palette.divider, 0.08),
//   height: '100%'
// }));

// const PrimaryButton = styled(Button)(({ theme }) => ({
//   background: theme.palette.primary.main,
//   color: theme.palette.common.white,
//   fontWeight: 500,
//   textTransform: 'none',
//   borderRadius: '8px',
//   padding: '8px 20px',
//   fontSize: '0.875rem',
//   '&:hover': {
//     background: theme.palette.primary.dark,
//     boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
//   }
// }));

// const SecondaryButton = styled(Button)(({ theme }) => ({
//   background: theme.palette.grey[100],
//   color: theme.palette.text.primary,
//   fontWeight: 500,
//   textTransform: 'none',
//   borderRadius: '8px',
//   padding: '8px 20px',
//   fontSize: '0.875rem',
//   border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//   '&:hover': {
//     background: theme.palette.grey[200],
//     borderColor: alpha(theme.palette.divider, 0.3)
//   }
// }));

// const Dashboard = () => {
//   const { id: jobId } = useParams();
//   const navigate = useNavigate();
//   const theme = useTheme();
  
//   // State
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [job, setJob] = useState(null);
//   const [stats, setStats] = useState({
//     totalCandidates: 0,
//     interviewsToday: 0,
//     positionsFilled: 0,
//     acceptanceRate: 0
//   });
//   const [candidates, setCandidates] = useState([]);
//   const [interviews, setInterviews] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterAnchor, setFilterAnchor] = useState(null);
//   const [stageFilter, setStageFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Fetch data on mount
//   useEffect(() => {
//     if (jobId) {
//       fetchAllData();
//     }
//   }, [jobId]);

//   const fetchAllData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Fetch all data in parallel
//       const [jobResponse, candidatesResponse, interviewsResponse] = await Promise.all([
//         apiService.getJobDetails(jobId),
//         apiService.getJobCandidates(jobId),
//         apiService.getUpcomingInterviews()
//       ]);

//       // Set job data
//       setJob(jobResponse.job);

//       // Transform candidates data
//       const transformedCandidates = transformCandidates(candidatesResponse.candidates);
//       setCandidates(transformedCandidates);

//       // Transform interviews data
//       setInterviews(interviewsResponse.data || []);

//       // Calculate pipeline data from candidates
//       const pipeline = calculatePipelineData(transformedCandidates);
//       setPipelineData(pipeline);

//       // Generate weekly activity data from candidates
//       const weekly = generateWeeklyData(transformedCandidates);
//       setWeeklyData(weekly);

//       // Calculate stats
//       const totalCandidates = transformedCandidates.length;
//       const interviewsToday = interviewsResponse.data?.filter(i => {
//         const today = new Date().toDateString();
//         const interviewDate = new Date(i.date).toDateString();
//         return interviewDate === today;
//       }).length || 0;
      
//       const positionsFilled = transformedCandidates.filter(c => 
//         c.stage === 'Hired' || c.status === 'hired'
//       ).length;
      
//       const acceptanceRate = totalCandidates > 0 
//         ? ((positionsFilled / totalCandidates) * 100).toFixed(1)
//         : 0;

//       setStats({
//         totalCandidates,
//         interviewsToday,
//         positionsFilled,
//         acceptanceRate: parseFloat(acceptanceRate)
//       });

//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.response?.data?.message || 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformCandidates = (apiCandidates) => {
//     return apiCandidates.map(c => ({
//       id: c._id,
//       name: c.fullName || `${c.firstName} ${c.lastName}`,
//       firstName: c.firstName,
//       lastName: c.lastName,
//       email: c.email,
//       phone: c.mobile,
//       stage: c.stage?.name || 'Sourced',
//       status: c.resume?.status || 'active',
//       appliedDate: new Date(c.createdAt).toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         year: 'numeric' 
//       }),
//       experience: c.experience || 'Not specified',
//       currentLocation: c.currentLocation?.name || 'Not specified',
//       preferredLocation: c.preferredLocation?.name || 'Not specified',
//       avatarColor: getRandomColor(c._id),
//       rating: (c.resume?.matchingScore || 75) / 20, // Convert to 5-point scale
//       lastActivity: getRelativeTime(new Date(c.updatedAt)),
//       currentCTC: c.currentCTC ? `${c.currency || 'INR'} ${c.currentCTC}` : 'Not specified',
//       expectedCTC: c.expectedCTC ? `${c.currency || 'INR'} ${c.expectedCTC}` : 'Not specified',
//       skills: c.skills || [],
//       matchingScore: c.resume?.matchingScore || 0,
//       source: c.source?.name || 'Direct'
//     }));
//   };

//   const calculatePipelineData = (candidates) => {
//     const stages = ['Sourced', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
//     const colors = ['#2196F3', '#FF9800', '#9C27B0', '#4CAF50', '#00C853', '#F44336'];
    
//     return stages.map((stage, index) => ({
//       name: stage,
//       value: candidates.filter(c => c.stage === stage).length,
//       color: colors[index]
//     })).filter(item => item.value > 0);
//   };

//   const generateWeeklyData = (candidates) => {
//     const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//     const today = new Date();
//     const weekData = [];

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(date.getDate() - i);
      
//       const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      
//       const applications = candidates.filter(c => {
//         const appliedDate = new Date(c.createdAt);
//         return appliedDate.toDateString() === date.toDateString();
//       }).length;

//       weekData.push({
//         day: dayName,
//         applications: applications,
//         interviews: Math.floor(applications * 0.3) // Rough estimate
//       });
//     }

//     return weekData;
//   };

//   const getRandomColor = (seed) => {
//     const colors = ['#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#F44336', '#009688', '#673AB7'];
//     const index = seed?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
//     return colors[index || 0];
//   };

//   const getRelativeTime = (date) => {
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     return `${diffDays}d ago`;
//   };

//   const handleRefresh = () => {
//     fetchAllData();
//   };

//   const handleFilterClick = (event) => {
//     setFilterAnchor(event.currentTarget);
//   };

//   const handleFilterClose = () => {
//     setFilterAnchor(null);
//   };

//   const handleStageChange = async (candidateId, newStage) => {
//     try {
//       await apiService.updateCandidateStage(candidateId, newStage);
//       fetchAllData(); // Refresh data
//     } catch (err) {
//       console.error('Error updating candidate stage:', err);
//       setError('Failed to update candidate stage');
//     }
//   };

//   const handleDeleteCandidate = async (candidateId) => {
//     if (window.confirm('Are you sure you want to delete this candidate?')) {
//       try {
//         await apiService.deleteCandidate(candidateId);
//         fetchAllData(); // Refresh data
//       } catch (err) {
//         console.error('Error deleting candidate:', err);
//         setError('Failed to delete candidate');
//       }
//     }
//   };

//   const getStageColor = (stage) => {
//     const colors = {
//       'Sourced': '#2196F3',
//       'Screening': '#FF9800',
//       'Interview': '#9C27B0',
//       'Offer': '#4CAF50',
//       'Hired': '#00C853',
//       'Rejected': '#F44336'
//     };
//     return colors[stage] || '#757575';
//   };

//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'shortlisted': return 'success';
//       case 'under review': return 'info';
//       case 'rejected': return 'error';
//       case 'on hold': return 'warning';
//       default: return 'default';
//     }
//   };

//   // Filter candidates based on search and filters
//   const filteredCandidates = candidates.filter(c => {
//     const matchesSearch = searchQuery === '' || 
//       c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
//     const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
//     const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter;
    
//     return matchesSearch && matchesStage && matchesStatus;
//   });

//   if (loading) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         minHeight: '100vh',
//         flexDirection: 'column',
//         gap: 2
//       }}>
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="body1" color="text.secondary">
//           Loading dashboard data...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert 
//           severity="error" 
//           action={
//             <Button color="inherit" size="small" onClick={handleRefresh}>
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       p: 3, 
//       maxWidth: '1300',
//       overflowX: 'hidden',
//       marginLeft: 10,
//     }}>
//       {/* Header */}
//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center',
//           mb: 2 
//         }}>
//           <Box>
//             <Typography variant="h4" sx={{ 
//               fontWeight: 700, 
//               mb: 0.5,
//               color: theme.palette.text.primary
//             }}>
//               {job?.jobTitle}
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
//               <Chip 
//                 size="small" 
//                 icon={<BusinessIcon sx={{ fontSize: 14 }} />}
//                 label={job?.department} 
//                 sx={{ fontWeight: 500 }}
//               />
//               <Chip 
//                 size="small" 
//                 icon={<LocationIcon sx={{ fontSize: 14 }} />}
//                 label={job?.jobFormId?.locations?.[0]?.name || 'Remote'} 
//                 sx={{ fontWeight: 500 }}
//               />
//               <Chip 
//                 size="small" 
//                 icon={<MoneyIcon sx={{ fontSize: 14 }} />}
//                 label={`${job?.jobFormId?.currency || 'INR'} ${job?.jobFormId?.amount || 'N/A'}`} 
//                 sx={{ fontWeight: 500 }}
//               />
//               <Chip 
//                 size="small" 
//                 icon={<WorkIcon sx={{ fontSize: 14 }} />}
//                 label={job?.jobFormId?.jobType || 'Full-time'} 
//                 sx={{ fontWeight: 500 }}
//               />
//               <Chip 
//                 size="small" 
//                 label={`ID: ${job?.jobName || job?._id?.slice(-6)}`}
//                 variant="outlined"
//                 sx={{ fontWeight: 500 }}
//               />
//             </Box>
//           </Box>
//           <Box sx={{ display: 'flex', gap: 1.5 }}>
          
//           </Box>
//         </Box>
        
//         {/* Search and Filter Bar */}
//         <Box sx={{ 
//           display: 'flex', 
//           gap: 2,
//           mb: 3,
//           flexWrap: 'wrap'
//         }}>
//           <TextField
//             placeholder="Search candidates by name, email, or skills..."
//             size="small"
//             sx={{
//               flex: 1,
//               minWidth: 300,
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '8px',
//                 backgroundColor: theme.palette.background.paper
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: 'text.secondary' }} />
//                 </InputAdornment>
//               )
//             }}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <SecondaryButton
//             startIcon={<FilterIcon />}
//             onClick={handleFilterClick}
//           >
//             Filter
//           </SecondaryButton>
//           {/* <SecondaryButton startIcon={<DownloadIcon />}>
//             Export
//           </SecondaryButton> */}
//           <SecondaryButton startIcon={<RefreshIcon />} onClick={handleRefresh}>
//             Refresh
//           </SecondaryButton>
//         </Box>
        
//         {/* Filter Menu */}
//         <Menu
//           anchorEl={filterAnchor}
//           open={Boolean(filterAnchor)}
//           onClose={handleFilterClose}
//           PaperProps={{
//             sx: { width: 240, p: 2, borderRadius: 2 }
//           }}
//         >
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//             Filter by Stage
//           </Typography>
//           <Select
//             fullWidth
//             size="small"
//             value={stageFilter}
//             onChange={(e) => setStageFilter(e.target.value)}
//             sx={{ mb: 2 }}
//           >
//             <MenuItem value="all">All Stages</MenuItem>
//             <MenuItem value="Sourced">Sourced</MenuItem>
//             <MenuItem value="Screening">Screening</MenuItem>
//             <MenuItem value="Interview">Interview</MenuItem>
//             <MenuItem value="Offer">Offer</MenuItem>
//             <MenuItem value="Hired">Hired</MenuItem>
//             <MenuItem value="Rejected">Rejected</MenuItem>
//           </Select>

//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//             Filter by Status
//           </Typography>
//           <Select
//             fullWidth
//             size="small"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <MenuItem value="all">All Status</MenuItem>
//             <MenuItem value="shortlisted">Shortlisted</MenuItem>
//             <MenuItem value="under review">Under Review</MenuItem>
//             <MenuItem value="rejected">Rejected</MenuItem>
//             <MenuItem value="on hold">On Hold</MenuItem>
//           </Select>
//         </Menu>
        
//         {/* Stats Cards */}
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           {/* Total Candidates */}
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
//                       Total Candidates
//                     </Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
//                       {stats.totalCandidates}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {candidates.filter(c => c.status === 'shortlisted').length} shortlisted
//                     </Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 48, height: 48 }}>
//                     <PeopleIcon />
//                   </Avatar>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={(candidates.filter(c => c.status === 'shortlisted').length / stats.totalCandidates) * 100 || 0}
//                   sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
//                 />
//               </CardContent>
//             </StatCard>
//           </Grid>

//           {/* Interviews Today */}
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
//                       Interviews Today
//                     </Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
//                       {stats.interviewsToday}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {interviews.length} total scheduled
//                     </Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 48, height: 48 }}>
//                     <ScheduleIcon />
//                   </Avatar>
//                 </Box>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     2 completed
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {stats.interviewsToday - 2} pending
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </StatCard>
//           </Grid>

//           {/* Positions Filled */}
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
//                       Positions Filled
//                     </Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
//                       {stats.positionsFilled}/{job?.jobFormId?.openings || 1}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {(job?.jobFormId?.openings || 1) - stats.positionsFilled} remaining
//                     </Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 48, height: 48 }}>
//                     <HowToRegIcon />
//                   </Avatar>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={(stats.positionsFilled / (job?.jobFormId?.openings || 1)) * 100}
//                   sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: alpha(theme.palette.success.main, 0.1) }}
//                 />
//               </CardContent>
//             </StatCard>
//           </Grid>

//           {/* Acceptance Rate */}
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
//                       Acceptance Rate
//                     </Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
//                       {stats.acceptanceRate}%
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Above average
//                     </Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 48, height: 48 }}>
//                     <TrendingUpIcon />
//                   </Avatar>
//                 </Box>
//                 <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
//                   <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
//                   <Typography variant="caption" color="success.main">
//                     +5.2% from last month
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </StatCard>
//           </Grid>
//         </Grid>
//       </Box>
      
//       {/* Main Dashboard Content */}
//       <Grid container spacing={2}>
//         {/* Candidate Pipeline */}
//         <Grid item xs={12} lg={3}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Candidate Pipeline
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   <Chip 
//                     label={`${candidates.length} total`} 
//                     size="small" 
//                     sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
//                   />
//                 </Box>
//               </Box>
//               <Box sx={{ height: 300 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={pipelineData} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
//                     <XAxis type="number" />
//                     <YAxis dataKey="name" type="category" width={80} />
//                     <RechartsTooltip
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//                       }}
//                     />
//                     <Bar dataKey="value" radius={[0, 4, 4, 0]}>
//                       {pipelineData.map((entry, index) => (
//                         <Cell key={index} fill={entry.color} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             </CardContent>
//           </DashboardCard>
//         </Grid>

//         {/* Upcoming Interviews */}
//         <Grid item xs={12} lg={4}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Upcoming Interviews
//                 </Typography>
//                 <PrimaryButton size="small" endIcon={<ChevronRightIcon />}>
//                   Schedule
//                 </PrimaryButton>
//               </Box>

//               {interviews.length > 0 ? (
//                 <Stack spacing={2}>
//                   {interviews.slice(0, 3).map((interview) => (
//                     <Paper
//                       key={interview._id}
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         borderRadius: "8px",
//                         borderColor: alpha(theme.palette.divider, 0.2),
//                         '&:hover': {
//                           borderColor: theme.palette.primary.main,
//                           backgroundColor: alpha(theme.palette.primary.main, 0.02),
//                         },
//                       }}
//                     >
//                       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                           {interview.candidateName}
//                         </Typography>
//                         <Chip
//                           label={interview.type}
//                           size="small"
//                           sx={{ fontWeight: 500, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
//                         />
//                       </Box>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
//                         <Box sx={{ display: "flex", alignItems: "center" }}>
//                           <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
//                           <Typography variant="caption">
//                             {new Date(interview.date).toLocaleDateString()}, {interview.time}
//                           </Typography>
//                         </Box>
//                         <Chip label={interview.platform} size="small" variant="outlined" />
//                       </Box>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Box sx={{ textAlign: 'center', py: 4 }}>
//                   <ScheduleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
//                   <Typography variant="body2" color="text.secondary">
//                     No upcoming interviews scheduled
//                   </Typography>
//                   <Button 
//                     variant="outlined" 
//                     size="small" 
//                     sx={{ mt: 2 }}
//                     onClick={() => navigate('/interviews/schedule')}
//                   >
//                     Schedule Interview
//                   </Button>
//                 </Box>
//               )}
//             </CardContent>
//           </DashboardCard>
//         </Grid>

//         {/* Weekly Activity */}
//         <Grid item xs={12} lg={5}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Weekly Activity
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Last 7 days
//                 </Typography>
//               </Box>
//               <Box sx={{ height: 250 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={weeklyData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
//                     <XAxis dataKey="day" />
//                     <YAxis />
//                     <RechartsTooltip
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//                       }}
//                     />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="applications"
//                       stroke={theme.palette.primary.main}
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="interviews"
//                       stroke={theme.palette.secondary.main}
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Box>
//             </CardContent>
//           </DashboardCard>
//         </Grid>

//         {/* Quick Actions */}
//         <Grid item xs={12}>
//           <DashboardCard>
//             {/*  */}
//           </DashboardCard>
//         </Grid>

//         {/* Candidates Table */}
//         <Grid item xs={12}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               {/* Header */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Candidates ({filteredCandidates.length})
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   {/* <SecondaryButton startIcon={<DownloadIcon />}>
//                     Export
//                   </SecondaryButton>
//                   <PrimaryButton startIcon={<AddIcon />} onClick={() => navigate(`/candidates/add/${jobId}`)}>
//                     Add Candidate
//                   </PrimaryButton> */}
//                 </Box>
//               </Box>

//               {/* Table */}
//               <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
//                 <Table sx={{ minWidth: 1200 }}>
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
//                       <TableCell>Candidate</TableCell>
//                       <TableCell>Contact</TableCell>
//                       <TableCell>Stage</TableCell>
//                       <TableCell>Applied Date</TableCell>
//                       <TableCell>Matching Score</TableCell>
//                       <TableCell>CTC (Current/Expected)</TableCell>
//                       <TableCell>Status</TableCell>
//                       <TableCell>Last Activity</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredCandidates.map((candidate) => (
//                       <TableRow
//                         key={candidate.id}
//                         hover
//                         sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}
//                       >
//                         {/* Candidate */}
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: candidate.avatarColor }}>
//                               {candidate.name?.charAt(0)}
//                             </Avatar>
//                             <Box>
//                               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                 {candidate.name}
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 {candidate.experience} exp
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>

//                         {/* Contact */}
//                         <TableCell>
//                           <Box>
//                             <Typography variant="body2">{candidate.email}</Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               {candidate.phone}
//                             </Typography>
//                           </Box>
//                         </TableCell>

//                         {/* Stage */}
//                         <TableCell>
//                           <Chip
//                             label={candidate.stage}
//                             size="small"
//                             sx={{
//                               bgcolor: alpha(getStageColor(candidate.stage), 0.1),
//                               color: getStageColor(candidate.stage),
//                               fontWeight: 500
//                             }}
//                           />
//                         </TableCell>

//                         {/* Applied Date */}
//                         <TableCell>
//                           <Typography variant="body2">{candidate.appliedDate}</Typography>
//                         </TableCell>

//                         {/* Matching Score */}
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Box sx={{ width: 60 }}>
//                               <LinearProgress
//                                 variant="determinate"
//                                 value={candidate.matchingScore}
//                                 sx={{
//                                   height: 6,
//                                   borderRadius: 3,
//                                   bgcolor: alpha(theme.palette.primary.main, 0.1),
//                                   '& .MuiLinearProgress-bar': {
//                                     bgcolor: candidate.matchingScore >= 80 ? 'success.main' : 
//                                             candidate.matchingScore >= 60 ? 'warning.main' : 'error.main'
//                                   }
//                                 }}
//                               />
//                             </Box>
//                             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                               {candidate.matchingScore}%
//                             </Typography>
//                           </Box>
//                         </TableCell>

//                         {/* CTC */}
//                         <TableCell>
//                           <Box>
//                             <Typography variant="caption" display="block">
//                               Current: {candidate.currentCTC}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               Expected: {candidate.expectedCTC}
//                             </Typography>
//                           </Box>
//                         </TableCell>

//                         {/* Status */}
//                         <TableCell>
//                           <Chip
//                             label={candidate.status}
//                             size="small"
//                             color={getStatusColor(candidate.status)}
//                             variant="outlined"
//                           />
//                         </TableCell>

//                         {/* Last Activity */}
//                         <TableCell>
//                           <Typography variant="body2" color="text.secondary">
//                             {candidate.lastActivity}
//                           </Typography>
//                         </TableCell>

//                         {/* Actions */}
//                         <TableCell align="right">
//                           <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
//                             {/* <Tooltip title="Send Email">
//                               <IconButton size="small" onClick={() => window.location.href = `mailto:${candidate.email}`}>
//                                 <MailIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip> */}
//                             {/* <Tooltip title="Schedule Interview">
//                               <IconButton size="small" onClick={() => navigate(`/interviews/schedule?candidate=${candidate.id}`)}>
//                                 <CalendarIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip> */}
//                             <Tooltip title="View Profile">
//                               <IconButton size="small" onClick={() => navigate(`/candidates/${candidate.id}`)}>
//                                 <VisibilityIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                             {/* <Tooltip title="Change Stage">
//                               <IconButton size="small" onClick={(e) => {
//                                 const anchor = e.currentTarget;
//                                 // You can implement a stage change menu here
//                               }}>
//                                 <ChevronRightIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip> */}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
                    
//                     {filteredCandidates.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                           <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
//                           <Typography variant="body1" color="text.secondary">
//                             No candidates found
//                           </Typography>
//                           <Button 
//                             variant="outlined" 
//                             size="small" 
//                             sx={{ mt: 2 }}
//                             onClick={() => navigate(`/candidates/add/${jobId}`)}
//                           >
//                             Add your first candidate
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </DashboardCard>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Button,
  TextField, Avatar, Stack, IconButton, Paper,
  Chip, useTheme, styled, alpha, LinearProgress,
  Grid, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Tooltip, Menu, MenuItem,Select,
  InputAdornment, Badge, Divider, Alert, CircularProgress
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
import axios from 'axios';

// API Configuration - Use relative paths for Vercel deployment
const API_BASE_URL = '/api'; // Empty string means relative paths

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check your connection');
    }
    return Promise.reject(error);
  }
);

// API Service
const apiService = {
  getJobDetails: async (jobId) => {
    const response = await api.get(`/job/${jobId}`);
    return response.data;
  },

  getJobCandidates: async (jobId) => {
    const response = await api.get(`/candidates/job/${jobId}`);
    return response.data;
  },

  getUpcomingInterviews: async () => {
    try {
      const response = await api.get(`/interviews/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interviews:', error);
      // Return empty array instead of trying offline endpoint
      return { data: [] };
    }
  },

  updateCandidateStage: async (candidateId, stage) => {
    const response = await api.patch(`/candidates/${candidateId}/stage`, { stage });
    return response.data;
  },

  deleteCandidate: async (candidateId) => {
    const response = await api.delete(`/candidates/${candidateId}`);
    return response.data;
  }
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch data on mount
  useEffect(() => {
    if (jobId) {
      fetchAllData();
    }
  }, [jobId]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [jobResponse, candidatesResponse, interviewsResponse] = await Promise.all([
        apiService.getJobDetails(jobId),
        apiService.getJobCandidates(jobId),
        apiService.getUpcomingInterviews()
      ]);

      // Set job data
      setJob(jobResponse.job);

      // Transform candidates data
      const transformedCandidates = transformCandidates(candidatesResponse.candidates || []);
      setCandidates(transformedCandidates);

      // Transform interviews data
      setInterviews(interviewsResponse.data || []);

      // Calculate pipeline data from candidates
      const pipeline = calculatePipelineData(transformedCandidates);
      setPipelineData(pipeline);

      // Generate weekly activity data from candidates
      const weekly = generateWeeklyData(transformedCandidates);
      setWeeklyData(weekly);

      // Calculate stats
      const totalCandidates = transformedCandidates.length;
      const interviewsToday = interviewsResponse.data?.filter(i => {
        const today = new Date().toDateString();
        const interviewDate = new Date(i.date).toDateString();
        return interviewDate === today;
      }).length || 0;
      
      const positionsFilled = transformedCandidates.filter(c => 
        c.stage === 'Hired' || c.status === 'hired'
      ).length;
      
      const acceptanceRate = totalCandidates > 0 
        ? ((positionsFilled / totalCandidates) * 100).toFixed(1)
        : 0;

      setStats({
        totalCandidates,
        interviewsToday,
        positionsFilled,
        acceptanceRate: parseFloat(acceptanceRate)
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const transformCandidates = (apiCandidates) => {
    return (apiCandidates || []).map(c => ({
      id: c._id,
      name: c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email || 'No email',
      phone: c.mobile || 'No phone',
      stage: c.stage?.name || 'Sourced',
      status: c.resume?.status || 'active',
      appliedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      }) : 'Unknown',
      experience: c.experience || 'Not specified',
      currentLocation: c.currentLocation?.name || 'Not specified',
      preferredLocation: c.preferredLocation?.name || 'Not specified',
      avatarColor: getRandomColor(c._id),
      rating: (c.resume?.matchingScore || 75) / 20,
      lastActivity: getRelativeTime(c.updatedAt ? new Date(c.updatedAt) : new Date()),
      currentCTC: c.currentCTC ? `${c.currency || 'INR'} ${c.currentCTC}` : 'Not specified',
      expectedCTC: c.expectedCTC ? `${c.currency || 'INR'} ${c.expectedCTC}` : 'Not specified',
      skills: c.skills || [],
      matchingScore: c.resume?.matchingScore || Math.floor(Math.random() * 30) + 60,
      source: c.source?.name || 'Direct'
    }));
  };

  const calculatePipelineData = (candidates) => {
    const stages = ['Sourced', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
    const colors = ['#2196F3', '#FF9800', '#9C27B0', '#4CAF50', '#00C853', '#F44336'];
    
    return stages.map((stage, index) => ({
      name: stage,
      value: candidates.filter(c => c.stage === stage).length,
      color: colors[index]
    })).filter(item => item.value > 0);
  };

  const generateWeeklyData = (candidates) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      
      const applications = candidates.filter(c => {
        if (!c.createdAt) return false;
        const appliedDate = new Date(c.createdAt);
        return appliedDate.toDateString() === date.toDateString();
      }).length;

      weekData.push({
        day: dayName,
        applications: applications,
        interviews: Math.floor(applications * 0.3)
      });
    }

    return weekData;
  };

  const getRandomColor = (seed) => {
    const colors = ['#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#F44336', '#009688', '#673AB7'];
    const index = seed?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index || 0];
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleStageChange = async (candidateId, newStage) => {
    try {
      await apiService.updateCandidateStage(candidateId, newStage);
      fetchAllData();
    } catch (err) {
      console.error('Error updating candidate stage:', err);
      setError('Failed to update candidate stage');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await apiService.deleteCandidate(candidateId);
        fetchAllData();
      } catch (err) {
        console.error('Error deleting candidate:', err);
        setError('Failed to delete candidate');
      }
    }
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
    switch(status?.toLowerCase()) {
      case 'shortlisted': return 'success';
      case 'under review': return 'info';
      case 'rejected': return 'error';
      case 'on hold': return 'warning';
      default: return 'default';
    }
  };

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
    const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStage && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '1300',
      overflowX: 'hidden',
      marginLeft: 10,
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
              {job?.jobTitle || 'Job Details'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Chip 
                size="small" 
                icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                label={job?.department || 'Department'} 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                size="small" 
                icon={<LocationIcon sx={{ fontSize: 14 }} />}
                label={job?.jobFormId?.locations?.[0]?.name || 'Remote'} 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                size="small" 
                icon={<MoneyIcon sx={{ fontSize: 14 }} />}
                label={`${job?.jobFormId?.currency || 'INR'} ${job?.jobFormId?.amount || 'N/A'}`} 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                size="small" 
                icon={<WorkIcon sx={{ fontSize: 14 }} />}
                label={job?.jobFormId?.jobType || 'Full-time'} 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                size="small" 
                label={`ID: ${job?.jobName || job?._id?.slice(-6) || 'N/A'}`}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <PrimaryButton 
              size="small" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/candidates/add/${jobId}`)}
            >
              Add Candidate
            </PrimaryButton>
          </Box>
        </Box>
        
        {/* Search and Filter Bar */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <TextField
            placeholder="Search candidates by name, email, or skills..."
            size="small"
            sx={{
              flex: 1,
              minWidth: 300,
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
          <SecondaryButton startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Refresh
          </SecondaryButton>
        </Box>
        
        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
          PaperProps={{
            sx: { width: 240, p: 2, borderRadius: 2 }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Filter by Stage
          </Typography>
          <Select
            fullWidth
            size="small"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="all">All Stages</MenuItem>
            <MenuItem value="Sourced">Sourced</MenuItem>
            <MenuItem value="Screening">Screening</MenuItem>
            <MenuItem value="Interview">Interview</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Hired">Hired</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Filter by Status
          </Typography>
          <Select
            fullWidth
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="shortlisted">Shortlisted</MenuItem>
            <MenuItem value="under review">Under Review</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="on hold">On Hold</MenuItem>
          </Select>
        </Menu>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Total Candidates */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Total Candidates
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {stats.totalCandidates}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {candidates.filter(c => c.status === 'shortlisted').length} shortlisted
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 48, height: 48 }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(candidates.filter(c => c.status === 'shortlisted').length / (stats.totalCandidates || 1)) * 100 || 0}
                  sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
                />
              </CardContent>
            </StatCard>
          </Grid>

          {/* Interviews Today */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 48, height: 48 }}>
                    <ScheduleIcon />
                  </Avatar>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    2 completed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.interviewsToday - 2} pending
                  </Typography>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Positions Filled */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Positions Filled
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {stats.positionsFilled}/{job?.jobFormId?.openings || 1}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(job?.jobFormId?.openings || 1) - stats.positionsFilled} remaining
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 48, height: 48 }}>
                    <HowToRegIcon />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(stats.positionsFilled / (job?.jobFormId?.openings || 1)) * 100}
                  sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: alpha(theme.palette.success.main, 0.1) }}
                />
              </CardContent>
            </StatCard>
          </Grid>

          {/* Acceptance Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
                  <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 48, height: 48 }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
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
        {/* Candidate Pipeline */}
        <Grid item xs={12} lg={3}>
          <DashboardCard>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Candidate Pipeline
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip 
                    label={`${candidates.length} total`} 
                    size="small" 
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  />
                </Box>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {pipelineData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12} lg={4}>
          <DashboardCard>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upcoming Interviews
                </Typography>
                <PrimaryButton size="small" endIcon={<ChevronRightIcon />}>
                  Schedule
                </PrimaryButton>
              </Box>

              {interviews.length > 0 ? (
                <Stack spacing={2}>
                  {interviews.slice(0, 3).map((interview) => (
                    <Paper
                      key={interview._id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: "8px",
                        borderColor: alpha(theme.palette.divider, 0.2),
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {interview.candidateName}
                        </Typography>
                        <Chip
                          label={interview.type}
                          size="small"
                          sx={{ fontWeight: 500, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
                          <Typography variant="caption">
                            {interview.date ? new Date(interview.date).toLocaleDateString() : 'Date TBD'}, {interview.time || 'Time TBD'}
                          </Typography>
                        </Box>
                        <Chip label={interview.platform || 'In Person'} size="small" variant="outlined" />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ScheduleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No upcoming interviews scheduled
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/interviews/schedule')}
                  >
                    Schedule Interview
                  </Button>
                </Box>
              )}
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Weekly Activity */}
        <Grid item xs={12} lg={5}>
          <DashboardCard>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Weekly Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last 7 days
                </Typography>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
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

        {/* Candidates Table */}
        <Grid item xs={12}>
          <DashboardCard>
            <CardContent sx={{ p: 2.5 }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Candidates ({filteredCandidates.length})
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <PrimaryButton startIcon={<AddIcon />} onClick={() => navigate(`/candidates/add/${jobId}`)}>
                    Add Candidate
                  </PrimaryButton>
                </Box>
              </Box>

              {/* Table */}
              <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                <Table sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Matching Score</TableCell>
                      <TableCell>CTC (Current/Expected)</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow
                        key={candidate.id}
                        hover
                        sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}
                      >
                        {/* Candidate */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: candidate.avatarColor }}>
                              {candidate.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {candidate.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {candidate.experience} exp
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{candidate.email}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {candidate.phone}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Stage */}
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

                        {/* Applied Date */}
                        <TableCell>
                          <Typography variant="body2">{candidate.appliedDate}</Typography>
                        </TableCell>

                        {/* Matching Score */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={candidate.matchingScore}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: candidate.matchingScore >= 80 ? 'success.main' : 
                                            candidate.matchingScore >= 60 ? 'warning.main' : 'error.main'
                                  }
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {candidate.matchingScore}%
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* CTC */}
                        <TableCell>
                          <Box>
                            <Typography variant="caption" display="block">
                              Current: {candidate.currentCTC}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Expected: {candidate.expectedCTC}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            label={candidate.status}
                            size="small"
                            color={getStatusColor(candidate.status)}
                            variant="outlined"
                          />
                        </TableCell>

                        {/* Last Activity */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {candidate.lastActivity}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                            <Tooltip title="View Profile">
                              <IconButton size="small" onClick={() => navigate(`/candidates/${candidate.id}`)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredCandidates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                          <Typography variant="body1" color="text.secondary">
                            No candidates found
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mt: 2 }}
                            onClick={() => navigate(`/candidates/add/${jobId}`)}
                          >
                            Add your first candidate
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
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

export default Dashboard;