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

// // API Configuration - Use relative paths for Vercel deployment
// const API_BASE_URL = '/api'; // Empty string means relative paths

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000, // 30 seconds timeout
// });

// // Add request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.code === 'ERR_NETWORK') {
//       console.error('Network error - please check your connection');
//     }
//     return Promise.reject(error);
//   }
// );

// // API Service
// const apiService = {
//   getJobDetails: async (jobId) => {
//     const response = await api.get(`/v1/job/${jobId}`);
//     return response.data;
//   },

//   getJobCandidates: async (jobId) => {
//     const response = await api.get(`/v1/candidates/job/${jobId}`);
//     return response.data;
//   },

//   getUpcomingInterviews: async () => {
//     try {
//       const response = await api.get(`/v1/interviews/upcoming`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching interviews:', error);
//       // Return empty array instead of trying offline endpoint
//       return { data: [] };
//     }
//   },

//   updateCandidateStage: async (candidateId, stage) => {
//     const response = await api.patch(`/v1/candidates/${candidateId}/stage`, { stage });
//     return response.data;
//   },

//   deleteCandidate: async (candidateId) => {
//     const response = await api.delete(`/v1/candidates/${candidateId}`);
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
//       const transformedCandidates = transformCandidates(candidatesResponse.candidates || []);
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
//       setError(err.response?.data?.message || 'Failed to load dashboard data. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformCandidates = (apiCandidates) => {
//     return (apiCandidates || []).map(c => ({
//       id: c._id,
//       name: c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
//       firstName: c.firstName,
//       lastName: c.lastName,
//       email: c.email || 'No email',
//       phone: c.mobile || 'No phone',
//       stage: c.stage?.name || 'Sourced',
//       status: c.resume?.status || 'active',
//       appliedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         year: 'numeric' 
//       }) : 'Unknown',
//       experience: c.experience || 'Not specified',
//       currentLocation: c.currentLocation?.name || 'Not specified',
//       preferredLocation: c.preferredLocation?.name || 'Not specified',
//       avatarColor: getRandomColor(c._id),
//       rating: (c.resume?.matchingScore || 75) / 20,
//       lastActivity: getRelativeTime(c.updatedAt ? new Date(c.updatedAt) : new Date()),
//       currentCTC: c.currentCTC ? `${c.currency || 'INR'} ${c.currentCTC}` : 'Not specified',
//       expectedCTC: c.expectedCTC ? `${c.currency || 'INR'} ${c.expectedCTC}` : 'Not specified',
//       skills: c.skills || [],
//       matchingScore: c.resume?.matchingScore || Math.floor(Math.random() * 30) + 60,
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
//         if (!c.createdAt) return false;
//         const appliedDate = new Date(c.createdAt);
//         return appliedDate.toDateString() === date.toDateString();
//       }).length;

//       weekData.push({
//         day: dayName,
//         applications: applications,
//         interviews: Math.floor(applications * 0.3)
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
//       fetchAllData();
//     } catch (err) {
//       console.error('Error updating candidate stage:', err);
//       setError('Failed to update candidate stage');
//     }
//   };

//   const handleDeleteCandidate = async (candidateId) => {
//     if (window.confirm('Are you sure you want to delete this candidate?')) {
//       try {
//         await apiService.deleteCandidate(candidateId);
//         fetchAllData();
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
//               {job?.jobTitle || 'Job Details'}
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
//               <Chip 
//                 size="small" 
//                 icon={<BusinessIcon sx={{ fontSize: 14 }} />}
//                 label={job?.department || 'Department'} 
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
//                 label={`ID: ${job?.jobName || job?._id?.slice(-6) || 'N/A'}`}
//                 variant="outlined"
//                 sx={{ fontWeight: 500 }}
//               />
//             </Box>
//           </Box>
//           <Box sx={{ display: 'flex', gap: 1.5 }}>
//             {/* <PrimaryButton 
//               size="small" 
//               startIcon={<AddIcon />}
//               onClick={() => navigate(`/candidates/add/${jobId}`)}
//             >
//               Add Candidate
//             </PrimaryButton> */}
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
//                   value={(candidates.filter(c => c.status === 'shortlisted').length / (stats.totalCandidates || 1)) * 100 || 0}
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
//                             {interview.date ? new Date(interview.date).toLocaleDateString() : 'Date TBD'}, {interview.time || 'Time TBD'}
//                           </Typography>
//                         </Box>
//                         <Chip label={interview.platform || 'In Person'} size="small" variant="outlined" />
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
//                   {/* <PrimaryButton startIcon={<AddIcon />} onClick={() => navigate(`/candidates/add/${jobId}`)}>
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
//                             <Tooltip title="View Profile">
//                               <IconButton size="small" onClick={() => navigate(`/candidates/${candidate.id}`)}>
//                                 <VisibilityIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
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






// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box, Typography, Card, CardContent, Button,
//   TextField, Avatar, Stack, IconButton, Paper,
//   Chip, useTheme, styled, alpha, LinearProgress,
//   Grid, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Tooltip, Menu, MenuItem, Select,
//   InputAdornment, Badge, Divider, Alert, CircularProgress,
//   Dialog, DialogContent
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
//   Notifications as NotificationsIcon,
//   Close as CloseIcon
// } from "@mui/icons-material";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, 
//   Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell
// } from 'recharts';
// import axios from 'axios';
// // import AddCandidateForm from "./AddCandidateForm";
// import AddCandidateForm from "../Candidates/AddCandidateForm";

// // API Configuration
// const API_BASE_URL = '/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.code === 'ERR_NETWORK') {
//       console.error('Network error - please check your connection');
//     }
//     return Promise.reject(error);
//   }
// );

// const apiService = {
//   getJobDetails: async (jobId) => {
//     const response = await api.get(`/v1/job/${jobId}`);
//     return response.data;
//   },
//   getJobCandidates: async (jobId) => {
//     const response = await api.get(`/v1/candidates/job/${jobId}`);
//     return response.data;
//   },
//   getUpcomingInterviews: async () => {
//     try {
//       const response = await api.get(`/v1/interviews/upcoming`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching interviews:', error);
//       return { data: [] };
//     }
//   },
//   updateCandidateStage: async (candidateId, stage) => {
//     const response = await api.patch(`/v1/candidates/${candidateId}/stage`, { stage });
//     return response.data;
//   },
//   deleteCandidate: async (candidateId) => {
//     const response = await api.delete(`/v1/candidates/${candidateId}`);
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

// // Custom label for pie charts
// const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
//   if (percent < 0.05) return null;
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);
//   return (
//     <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// const Dashboard = () => {
//   const { id: jobId } = useParams();
//   const navigate = useNavigate();
//   const theme = useTheme();
  
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

//   // Add Candidate dialog state
//   const [addCandidateOpen, setAddCandidateOpen] = useState(false);

//   useEffect(() => {
//     if (jobId) {
//       fetchAllData();
//     }
//   }, [jobId]);

//   const fetchAllData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [jobResponse, candidatesResponse, interviewsResponse] = await Promise.all([
//         apiService.getJobDetails(jobId),
//         apiService.getJobCandidates(jobId),
//         apiService.getUpcomingInterviews()
//       ]);

//       setJob(jobResponse.job);

//       const transformedCandidates = transformCandidates(candidatesResponse.candidates || []);
//       setCandidates(transformedCandidates);

//       setInterviews(interviewsResponse.data || []);

//       const pipeline = calculatePipelineData(transformedCandidates);
//       setPipelineData(pipeline);

//       const weekly = generateWeeklyData(transformedCandidates);
//       setWeeklyData(weekly);

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
//       setError(err.response?.data?.message || 'Failed to load dashboard data. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformCandidates = (apiCandidates) => {
//     return (apiCandidates || []).map(c => ({
//       id: c._id,
//       name: c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
//       firstName: c.firstName,
//       lastName: c.lastName,
//       email: c.email || 'No email',
//       phone: c.mobile || 'No phone',
//       stage: c.stage?.name || 'Sourced',
//       status: c.resume?.status || 'active',
//       appliedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { 
//         month: 'short', day: 'numeric', year: 'numeric' 
//       }) : 'Unknown',
//       experience: c.experience || 'Not specified',
//       currentLocation: c.currentLocation?.name || 'Not specified',
//       preferredLocation: c.preferredLocation?.name || 'Not specified',
//       avatarColor: getRandomColor(c._id),
//       rating: (c.resume?.matchingScore || 75) / 20,
//       lastActivity: getRelativeTime(c.updatedAt ? new Date(c.updatedAt) : new Date()),
//       currentCTC: c.currentCTC ? `${c.currency || 'INR'} ${c.currentCTC}` : 'Not specified',
//       expectedCTC: c.expectedCTC ? `${c.currency || 'INR'} ${c.expectedCTC}` : 'Not specified',
//       skills: c.skills || [],
//       matchingScore: c.resume?.matchingScore || Math.floor(Math.random() * 30) + 60,
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
//         if (!c.createdAt) return false;
//         const appliedDate = new Date(c.createdAt);
//         return appliedDate.toDateString() === date.toDateString();
//       }).length;
//       weekData.push({
//         day: dayName,
//         applications,
//         interviews: Math.floor(applications * 0.3)
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

//   const handleRefresh = () => fetchAllData();

//   const handleFilterClick = (event) => setFilterAnchor(event.currentTarget);
//   const handleFilterClose = () => setFilterAnchor(null);

//   const handleStageChange = async (candidateId, newStage) => {
//     try {
//       await apiService.updateCandidateStage(candidateId, newStage);
//       fetchAllData();
//     } catch (err) {
//       console.error('Error updating candidate stage:', err);
//       setError('Failed to update candidate stage');
//     }
//   };

//   const handleDeleteCandidate = async (candidateId) => {
//     if (window.confirm('Are you sure you want to delete this candidate?')) {
//       try {
//         await apiService.deleteCandidate(candidateId);
//         fetchAllData();
//       } catch (err) {
//         console.error('Error deleting candidate:', err);
//         setError('Failed to delete candidate');
//       }
//     }
//   };

//   const getStageColor = (stage) => {
//     const colors = {
//       'Sourced': '#2196F3', 'Screening': '#FF9800', 'Interview': '#9C27B0',
//       'Offer': '#4CAF50', 'Hired': '#00C853', 'Rejected': '#F44336'
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

//   const filteredCandidates = candidates.filter(c => {
//     const matchesSearch = searchQuery === '' || 
//       c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
//     const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
//     const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter;
//     return matchesSearch && matchesStage && matchesStatus;
//   });

//   // Weekly pie data derived from weeklyData totals
//   const weeklyPieData = [
//     { name: 'Applications', value: weeklyData.reduce((s, d) => s + d.applications, 0), color: theme.palette.primary.main },
//     { name: 'Interviews',   value: weeklyData.reduce((s, d) => s + d.interviews, 0),   color: theme.palette.secondary.main },
//   ].filter(d => d.value > 0);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="body1" color="text.secondary">Loading dashboard data...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error" action={<Button color="inherit" size="small" onClick={handleRefresh}>Retry</Button>}>
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, maxWidth: '1300', overflowX: 'hidden', marginLeft: 10 }}>

//       {/* ── Header ─────────────────────────────────────────────── */}
//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}>
//               {job?.jobTitle || 'Job Details'}
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
//               <Chip size="small" icon={<BusinessIcon sx={{ fontSize: 14 }} />} label={job?.department || 'Department'} sx={{ fontWeight: 500 }} />
//               <Chip size="small" icon={<LocationIcon sx={{ fontSize: 14 }} />} label={job?.jobFormId?.locations?.[0]?.name || 'Remote'} sx={{ fontWeight: 500 }} />
//               <Chip size="small" icon={<MoneyIcon sx={{ fontSize: 14 }} />} label={`${job?.jobFormId?.currency || 'INR'} ${job?.jobFormId?.amount || 'N/A'}`} sx={{ fontWeight: 500 }} />
//               <Chip size="small" icon={<WorkIcon sx={{ fontSize: 14 }} />} label={job?.jobFormId?.jobType || 'Full-time'} sx={{ fontWeight: 500 }} />
//               <Chip size="small" label={`ID: ${job?.jobName || job?._id?.slice(-6) || 'N/A'}`} variant="outlined" sx={{ fontWeight: 500 }} />
//             </Box>
//           </Box>
//         </Box>

//         {/* Search and Filter Bar */}
//         <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
//           <TextField
//             placeholder="Search candidates by name, email, or skills..."
//             size="small"
//             sx={{ flex: 1, minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: theme.palette.background.paper } }}
//             InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <SecondaryButton startIcon={<FilterIcon />} onClick={handleFilterClick}>Filter</SecondaryButton>
//           <SecondaryButton startIcon={<RefreshIcon />} onClick={handleRefresh}>Refresh</SecondaryButton>
//         </Box>

//         {/* Filter Menu */}
//         <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={handleFilterClose}
//           PaperProps={{ sx: { width: 240, p: 2, borderRadius: 2 } }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Filter by Stage</Typography>
//           <Select fullWidth size="small" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} sx={{ mb: 2 }}>
//             <MenuItem value="all">All Stages</MenuItem>
//             <MenuItem value="Sourced">Sourced</MenuItem>
//             <MenuItem value="Screening">Screening</MenuItem>
//             <MenuItem value="Interview">Interview</MenuItem>
//             <MenuItem value="Offer">Offer</MenuItem>
//             <MenuItem value="Hired">Hired</MenuItem>
//             <MenuItem value="Rejected">Rejected</MenuItem>
//           </Select>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Filter by Status</Typography>
//           <Select fullWidth size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//             <MenuItem value="all">All Status</MenuItem>
//             <MenuItem value="shortlisted">Shortlisted</MenuItem>
//             <MenuItem value="under review">Under Review</MenuItem>
//             <MenuItem value="rejected">Rejected</MenuItem>
//             <MenuItem value="on hold">On Hold</MenuItem>
//           </Select>
//         </Menu>

//         {/* Stats Cards */}
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Total Candidates</Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{stats.totalCandidates}</Typography>
//                     <Typography variant="caption" color="text.secondary">{candidates.filter(c => c.status === 'shortlisted').length} shortlisted</Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 48, height: 48 }}>
//                     <PeopleIcon />
//                   </Avatar>
//                 </Box>
//                 <LinearProgress variant="determinate"
//                   value={(candidates.filter(c => c.status === 'shortlisted').length / (stats.totalCandidates || 1)) * 100 || 0}
//                   sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }} />
//               </CardContent>
//             </StatCard>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Interviews Today</Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{stats.interviewsToday}</Typography>
//                     <Typography variant="caption" color="text.secondary">{interviews.length} total scheduled</Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 48, height: 48 }}>
//                     <ScheduleIcon />
//                   </Avatar>
//                 </Box>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//                   <Typography variant="caption" color="text.secondary">2 completed</Typography>
//                   <Typography variant="caption" color="text.secondary">{stats.interviewsToday - 2} pending</Typography>
//                 </Box>
//               </CardContent>
//             </StatCard>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Positions Filled</Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{stats.positionsFilled}/{job?.jobFormId?.openings || 1}</Typography>
//                     <Typography variant="caption" color="text.secondary">{(job?.jobFormId?.openings || 1) - stats.positionsFilled} remaining</Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 48, height: 48 }}>
//                     <HowToRegIcon />
//                   </Avatar>
//                 </Box>
//                 <LinearProgress variant="determinate"
//                   value={(stats.positionsFilled / (job?.jobFormId?.openings || 1)) * 100}
//                   sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: alpha(theme.palette.success.main, 0.1) }} />
//               </CardContent>
//             </StatCard>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard>
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Acceptance Rate</Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{stats.acceptanceRate}%</Typography>
//                     <Typography variant="caption" color="text.secondary">Above average</Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 48, height: 48 }}>
//                     <TrendingUpIcon />
//                   </Avatar>
//                 </Box>
//                 <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
//                   <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
//                   <Typography variant="caption" color="success.main">+5.2% from last month</Typography>
//                 </Box>
//               </CardContent>
//             </StatCard>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* ── Main Content ──────────────────────────────────────────── */}
//       <Grid container spacing={2}>

//         {/* ── Candidate Pipeline — Donut Chart ────────────────────── */}
//         <Grid item xs={12} lg={3}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>Candidate Pipeline</Typography>
//                 <Chip label={`${candidates.length} total`} size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
//               </Box>

//               {pipelineData.length > 0 ? (
//                 <>
//                   <Box sx={{ height: 220 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pipelineData}
//                           cx="50%" cy="50%"
//                           innerRadius={55}
//                           outerRadius={85}
//                           paddingAngle={3}
//                           dataKey="value"
//                           labelLine={false}
//                           label={renderCustomLabel}
//                         >
//                           {pipelineData.map((entry, index) => (
//                             <Cell key={index} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <RechartsTooltip
//                           contentStyle={{ borderRadius: '8px', border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}
//                           formatter={(value, name) => [`${value} candidates`, name]}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Box>
//                   {/* Legend */}
//                   <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
//                     {pipelineData.map((entry, index) => (
//                       <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
//                           <Typography variant="caption" color="text.secondary">{entry.name}</Typography>
//                         </Box>
//                         <Typography variant="caption" sx={{ fontWeight: 700, color: entry.color }}>{entry.value}</Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </>
//               ) : (
//                 <Box sx={{ textAlign: 'center', py: 6 }}>
//                   <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
//                   <Typography variant="body2" color="text.secondary">No pipeline data yet</Typography>
//                 </Box>
//               )}
//             </CardContent>
//           </DashboardCard>
//         </Grid>

//         {/* ── Upcoming Interviews ──────────────────────────────────── */}
//         <Grid item xs={12} lg={4}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>Upcoming Interviews</Typography>
//               </Box>

//               {interviews.length > 0 ? (
//                 <Stack spacing={2}>
//                   {interviews.slice(0, 3).map((interview) => (
//                     <Paper key={interview._id} variant="outlined"
//                       sx={{
//                         p: 2, borderRadius: "8px", borderColor: alpha(theme.palette.divider, 0.2),
//                         '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: alpha(theme.palette.primary.main, 0.02) },
//                       }}>
//                       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{interview.candidateName}</Typography>
//                         <Chip label={interview.type} size="small"
//                           sx={{ fontWeight: 500, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }} />
//                       </Box>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
//                         <Box sx={{ display: "flex", alignItems: "center" }}>
//                           <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
//                           <Typography variant="caption">
//                             {interview.date ? new Date(interview.date).toLocaleDateString() : 'Date TBD'}, {interview.time || 'Time TBD'}
//                           </Typography>
//                         </Box>
//                         <Chip label={interview.platform || 'In Person'} size="small" variant="outlined" />
//                       </Box>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Box sx={{ textAlign: 'center', py: 4 }}>
//                   <ScheduleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
//                   <Typography variant="body2" color="text.secondary">No upcoming interviews scheduled</Typography>
//                 </Box>
//               )}
//             </CardContent>
//           </DashboardCard>
//         </Grid>

//         {/* ── Weekly Activity — Donut Chart ────────────────────────── */}
//         <Grid item xs={12} lg={5}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>Weekly Activity</Typography>
//                 <Typography variant="body2" color="text.secondary">Last 7 days</Typography>
//               </Box>

//               {weeklyPieData.length > 0 ? (
//                 <>
//                   <Box sx={{ height: 220 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={weeklyPieData}
//                           cx="50%" cy="50%"
//                           innerRadius={60}
//                           outerRadius={90}
//                           paddingAngle={4}
//                           dataKey="value"
//                           labelLine={false}
//                           label={renderCustomLabel}
//                         >
//                           {weeklyPieData.map((entry, index) => (
//                             <Cell key={index} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <RechartsTooltip
//                           contentStyle={{ borderRadius: '8px', border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}
//                           formatter={(value, name) => [`${value}`, name]}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Box>
//                   {/* Summary stats below the donut */}
//                   <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
//                     {weeklyPieData.map((entry, index) => (
//                       <Box key={index} sx={{
//                         display: 'flex', flexDirection: 'column', alignItems: 'center',
//                         p: 1.5, borderRadius: '8px', bgcolor: alpha(entry.color, 0.08)
//                       }}>
//                         <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color, mb: 0.5 }} />
//                         <Typography variant="h6" sx={{ fontWeight: 700, color: entry.color, lineHeight: 1.2 }}>{entry.value}</Typography>
//                         <Typography variant="caption" color="text.secondary">{entry.name}</Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </>
//               ) : (
//                 <Box sx={{ textAlign: 'center', py: 6 }}>
//                   <BarChartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
//                   <Typography variant="body2" color="text.secondary">No activity this week</Typography>
//                 </Box>
//               )}
//             </CardContent>
//           </DashboardCard>
//         </Grid>

//         {/* ── Candidates Table ─────────────────────────────────────── */}
//         <Grid item xs={12}>
//           <DashboardCard>
//             <CardContent sx={{ p: 2.5 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>Candidates ({filteredCandidates.length})</Typography>
//               </Box>

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
//                       <TableRow key={candidate.id} hover
//                         sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: candidate.avatarColor }}>
//                               {candidate.name?.charAt(0)}
//                             </Avatar>
//                             <Box>
//                               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{candidate.name}</Typography>
//                               <Typography variant="caption" color="text.secondary">{candidate.experience} exp</Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Box>
//                             <Typography variant="body2">{candidate.email}</Typography>
//                             <Typography variant="caption" color="text.secondary">{candidate.phone}</Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={candidate.stage} size="small"
//                             sx={{ bgcolor: alpha(getStageColor(candidate.stage), 0.1), color: getStageColor(candidate.stage), fontWeight: 500 }} />
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2">{candidate.appliedDate}</Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Box sx={{ width: 60 }}>
//                               <LinearProgress variant="determinate" value={candidate.matchingScore}
//                                 sx={{
//                                   height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1),
//                                   '& .MuiLinearProgress-bar': {
//                                     bgcolor: candidate.matchingScore >= 80 ? 'success.main' : candidate.matchingScore >= 60 ? 'warning.main' : 'error.main'
//                                   }
//                                 }} />
//                             </Box>
//                             <Typography variant="body2" sx={{ fontWeight: 600 }}>{candidate.matchingScore}%</Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Box>
//                             <Typography variant="caption" display="block">Current: {candidate.currentCTC}</Typography>
//                             <Typography variant="caption" color="text.secondary">Expected: {candidate.expectedCTC}</Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={candidate.status} size="small" color={getStatusColor(candidate.status)} variant="outlined" />
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2" color="text.secondary">{candidate.lastActivity}</Typography>
//                         </TableCell>
//                         <TableCell align="right">
//                           <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
//                             <Tooltip title="View Profile">
//                               <IconButton size="small" onClick={() => navigate(`/candidates/${candidate.id}`)}>
//                                 <VisibilityIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {filteredCandidates.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                           <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
//                           <Typography variant="body1" color="text.secondary">No candidates found</Typography>
//                           <Button variant="outlined" size="small" sx={{ mt: 2 }}
//                             onClick={() => setAddCandidateOpen(true)}>
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

//       {/* ── Add Candidate Dialog ─────────────────────────────────── */}
//       <Dialog
//         open={addCandidateOpen}
//         onClose={() => setAddCandidateOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: '12px' } }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1.5, px: 1.5 }}>
//           <IconButton onClick={() => setAddCandidateOpen(false)} size="small">
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//         <DialogContent sx={{ pt: 0 }}>
//           <AddCandidateForm
//             onClose={() => setAddCandidateOpen(false)}
//             onSubmit={() => { setAddCandidateOpen(false); fetchAllData(); }}
//           />
//         </DialogContent>
//       </Dialog>

//     </Box>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Button,
  TextField, Avatar, Stack, IconButton, Paper,
  Chip, useTheme, useMediaQuery, LinearProgress,
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Menu, MenuItem, Select,
  InputAdornment, Divider, Alert, CircularProgress,
  Dialog, DialogContent
} from "@mui/material";
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  HowToReg as HowToRegIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import axios from "axios";
import AddCandidateForm from "../Candidates/AddCandidateForm";

/* ─── API ──────────────────────────────────────────────────────── */
const API_BASE_URL = "/api";
const api = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const apiService = {
  getJobDetails: (jobId) => api.get(`/v1/job/${jobId}`).then((r) => r.data),
  getJobCandidates: (jobId) => api.get(`/v1/candidates/job/${jobId}`).then((r) => r.data),
  getUpcomingInterviews: () =>
    api.get("/v1/interviews/upcoming").then((r) => r.data).catch(() => ({ data: [] })),
};

/* ─── Design Tokens ────────────────────────────────────────────── */
const D = {
  bg: "#f5f7fa",
  surface: "#ffffff",
  surfaceAlt: "#f9fafb",
  border: "#e8ecf0",
  borderLight: "#f0f3f6",
  text: "#0d1117",
  textSub: "#4a5568",
  textMuted: "#8896a7",
  blue: "#1a56db",
  blueL: "#eff4ff",
  blueM: "#3b82f6",
  green: "#059669",
  greenL: "#ecfdf5",
  amber: "#d97706",
  amberL: "#fffbeb",
  purple: "#7c3aed",
  purpleL: "#faf5ff",
  rose: "#e11d48",
  roseL: "#fff1f2",
  sky: "#0284c7",
  skyL: "#f0f9ff",
  indigo: "#4338ca",
  indigoL: "#eef2ff",
  shadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
  shadowMd: "0 4px 12px rgba(0,0,0,.08), 0 8px 32px rgba(0,0,0,.06)",
};

const STAGE_COLORS = {
  Sourced: D.blueM,
  Screening: D.amber,
  Interview: D.purple,
  Offer: D.green,
  Hired: "#10b981",
  Rejected: D.rose,
};

const PIE_COLORS = [D.blueM, D.amber, D.purple, D.green, "#10b981", D.rose];

/* ─── Helpers ──────────────────────────────────────────────────── */
const getRelativeTime = (date) => {
  const diff = new Date() - new Date(date);
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
};
const getAvatarColor = (seed) => {
  const c = [D.blueM, D.amber, D.green, D.purple, D.rose, D.sky, D.indigo];
  return c[(seed?.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) || 0) % c.length];
};
const stageColor = (s) => STAGE_COLORS[s] || D.textMuted;
const fmtCTC = (val, currency = "INR") =>
  val ? `${currency} ${Number(val).toLocaleString("en-IN")}` : "—";

/* ─── Sub-components ───────────────────────────────────────────── */

/** Stat Card */
const KpiCard = ({ label, value, sub, icon, color, bg, progress, trend }) => (
  <Card sx={{
    borderRadius: "14px", border: `1px solid ${D.border}`, boxShadow: D.shadow,
    background: D.surface, overflow: "hidden", height: "100%",
    transition: "transform .18s, box-shadow .18s",
    "&:hover": { transform: "translateY(-2px)", boxShadow: D.shadowMd },
  }}>
    <Box sx={{ height: 3, background: color }} />
    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: D.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}
        </Typography>
        <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
          {React.cloneElement(icon, { sx: { fontSize: 18 } })}
        </Box>
      </Box>
      <Typography sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 900, color: D.text, lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: D.textMuted }}>{sub}</Typography>
      {progress !== undefined && (
        <LinearProgress variant="determinate" value={Math.min(progress, 100)}
          sx={{ mt: 1.5, height: 4, borderRadius: 4, bgcolor: bg,
            "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 4 } }} />
      )}
      {trend && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 0.4 }}>
          <TrendingUpIcon sx={{ fontSize: 13, color: D.green }} />
          <Typography sx={{ fontSize: 11, color: D.green }}>{trend}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

/** Dark tooltip for recharts */
const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: "#1e293b", borderRadius: "10px", p: "8px 14px", boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}>
      {label && <Typography sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, mb: 0.4 }}>{label}</Typography>}
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.2 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: p.color }} />
          <Typography sx={{ color: "#f8fafc", fontSize: 12, fontWeight: 600 }}>{p.name}: {p.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

/** Section wrapper card */
const SCard = ({ children, title, badge, action, noPad }) => (
  <Card sx={{ borderRadius: "14px", border: `1px solid ${D.border}`, boxShadow: D.shadow, background: D.surface, height: "100%" }}>
    {(title || action) && (
      <Box sx={{ px: 2.5, py: 1.8, borderBottom: `1px solid ${D.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: D.text }}>{title}</Typography>
          {badge != null && (
            <Chip label={badge} size="small" sx={{ fontSize: 10, fontWeight: 700, background: D.indigoL, color: D.indigo, height: 18 }} />
          )}
        </Box>
        {action}
      </Box>
    )}
    <Box sx={noPad ? {} : { p: 2.5 }}>{children}</Box>
  </Card>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);

  useEffect(() => { if (jobId) fetchAllData(); }, [jobId]);

  const fetchAllData = async () => {
    setLoading(true); setError(null);
    try {
      const [jobRes, candRes, intRes] = await Promise.all([
        apiService.getJobDetails(jobId),
        apiService.getJobCandidates(jobId),
        apiService.getUpcomingInterviews(),
      ]);
      setJob(jobRes.job);
      const transformed = transformCandidates(candRes.candidates || []);
      setCandidates(transformed);
      setInterviews(intRes.data || []);
      setPipelineData(calcPipeline(transformed));
      setWeeklyData(genWeekly(transformed));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally { setLoading(false); }
  };

  const transformCandidates = (list) =>
    (list || []).map((c) => ({
      id: c._id,
      name: c.fullName || `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Unknown",
      email: c.email || "—",
      phone: c.mobile || "—",
      stage: c.stage?.name || "Sourced",
      status: c.resume?.status || "active",
      appliedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
      experience: c.experience || "—",
      avatarColor: getAvatarColor(c._id),
      lastActivity: getRelativeTime(c.updatedAt || new Date()),
      currentCTC: fmtCTC(c.currentCTC, c.currency),
      expectedCTC: fmtCTC(c.expectedCTC, c.currency),
      skills: c.skills || [],
      matchingScore: c.resume?.matchingScore || Math.floor(Math.random() * 30) + 60,
    }));

  const calcPipeline = (list) => {
    const stages = ["Sourced", "Screening", "Interview", "Offer", "Hired", "Rejected"];
    return stages
      .map((s, i) => ({ name: s, value: list.filter((c) => c.stage === s).length, color: PIE_COLORS[i] }))
      .filter((d) => d.value > 0);
  };

  const genWeekly = (list) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      const apps = list.filter((c) => c.createdAt && new Date(c.createdAt).toDateString() === d.toDateString()).length;
      return { day: days[dayIdx], applications: apps, interviews: Math.floor(apps * 0.4) };
    });
  };

  /* Derived stats */
  const totalCandidates = candidates.length;
  const interviewsToday = interviews.filter((i) => new Date(i.date).toDateString() === new Date().toDateString()).length;
  const positionsFilled = candidates.filter((c) => c.stage === "Hired").length;
  const openings = job?.jobFormId?.openings || 1;
  const acceptanceRate = totalCandidates > 0 ? ((positionsFilled / totalCandidates) * 100).toFixed(1) : 0;

  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.skills?.some((s) => s.toLowerCase().includes(q));
    return matchSearch && (stageFilter === "all" || c.stage === stageFilter) && (statusFilter === "all" || c.status?.toLowerCase() === statusFilter);
  });

  const scoreColor = (s) => s >= 80 ? D.green : s >= 60 ? D.amber : D.rose;
  const statusChipColor = (s) => ({ shortlisted: [D.greenL, D.green], "under review": [D.skyL, D.sky], rejected: [D.roseL, D.rose], "on hold": [D.amberL, D.amber] }[s?.toLowerCase()] || [D.border, D.textMuted]);

  /* Sidebar/navbar offset — adapt these to your layout */
  const sidebarW = isMobile ? 0 : isTablet ? 0 : "240px";
  const navH = { xs: "56px", sm: "64px" };

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) return (
    <Box sx={{ ml: sidebarW, mt: navH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", gap: 2, background: D.bg }}>
      <CircularProgress size={52} thickness={3.5} sx={{ color: D.blueM }} />
      <Typography sx={{ fontSize: 14, color: D.textSub, fontWeight: 500 }}>Loading dashboard…</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ ml: sidebarW, mt: navH, p: 3 }}>
      <Alert severity="error" action={<Button size="small" onClick={fetchAllData}>Retry</Button>}>{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{
      ml: sidebarW,
      mt: navH,
      minHeight: `calc(100vh - 64px)`,
      background: D.bg,
      p: { xs: 1.5, sm: 2.5, md: 3 },
      boxSizing: "border-box",
      overflowX: "hidden",
    }}>

      {/* ── Page Header ──────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        {/* Title row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 20, sm: 24, md: 28 }, fontWeight: 900, color: D.text, lineHeight: 1.2, letterSpacing: "-.4px" }}>
              {job?.jobTitle || "Job Details"}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1 }}>
              {[
                { icon: <BusinessIcon />, label: job?.department || "Department" },
                { icon: <LocationIcon />, label: job?.jobFormId?.locations?.[0]?.name || "Remote" },
                { icon: <MoneyIcon />,    label: `${job?.jobFormId?.currency || "INR"} ${job?.jobFormId?.amount ? Number(job.jobFormId.amount).toLocaleString("en-IN") : "N/A"}` },
                { icon: <WorkIcon />,     label: job?.jobFormId?.jobType || "Full-time" },
                { icon: null,            label: `ID: ${job?.jobName || job?._id?.slice(-6) || "N/A"}`, outlined: true },
              ].map((ch, i) => (
                <Chip key={i} size="small"
                  icon={ch.icon ? React.cloneElement(ch.icon, { sx: { fontSize: "13px !important" } }) : undefined}
                  label={ch.label}
                  variant={ch.outlined ? "outlined" : "filled"}
                  sx={{ fontSize: 11, fontWeight: 600, background: ch.outlined ? "transparent" : D.blueL, color: ch.outlined ? D.textSub : D.blue, border: ch.outlined ? `1px solid ${D.border}` : "none" }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button onClick={fetchAllData} startIcon={<RefreshIcon />} size="small"
              sx={{ borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: 12, background: D.surface, border: `1px solid ${D.border}`, color: D.textSub, "&:hover": { background: D.blueL } }}>
              Refresh
            </Button>
            <Button onClick={() => setAddCandidateOpen(true)} startIcon={<AddIcon />} variant="contained" size="small"
              sx={{ borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: 12, background: D.blueM, "&:hover": { background: D.blue }, boxShadow: "none" }}>
              {isMobile ? "Add" : "Add Candidate"}
            </Button>
          </Box>
        </Box>

        {/* Search + Filter */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <TextField size="small" placeholder="Search by name, email or skills…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: D.textMuted }} /></InputAdornment>,
              sx: { borderRadius: "9px", background: D.surface, fontSize: 13 } }}
            sx={{ flex: 1, minWidth: 180, maxWidth: 380, "& fieldset": { borderColor: D.border } }} />
          <Button size="small" startIcon={<FilterIcon />} endIcon={<ArrowDownIcon />} onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{ borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: 12, background: D.surface, border: `1px solid ${D.border}`, color: D.textSub, px: 1.8, "&:hover": { background: D.blueL } }}>
            Filter
          </Button>
        </Box>

        {/* Filter Menu */}
        <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}
          PaperProps={{ sx: { width: 230, p: 2, borderRadius: "12px", boxShadow: D.shadowMd, border: `1px solid ${D.border}` } }}>
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: D.textMuted, textTransform: "uppercase", letterSpacing: 0.7, mb: 1 }}>Stage</Typography>
          <Select fullWidth size="small" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
            sx={{ mb: 2, borderRadius: "8px", fontSize: 13 }}>
            {["all", "Sourced", "Screening", "Interview", "Offer", "Hired", "Rejected"].map((v) => (
              <MenuItem key={v} value={v} sx={{ fontSize: 13 }}>{v === "all" ? "All Stages" : v}</MenuItem>
            ))}
          </Select>
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: D.textMuted, textTransform: "uppercase", letterSpacing: 0.7, mb: 1 }}>Status</Typography>
          <Select fullWidth size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: "8px", fontSize: 13 }}>
            {["all", "shortlisted", "under review", "rejected", "on hold"].map((v) => (
              <MenuItem key={v} value={v} sx={{ fontSize: 13 }}>{v === "all" ? "All Status" : v.charAt(0).toUpperCase() + v.slice(1)}</MenuItem>
            ))}
          </Select>
        </Menu>
      </Box>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {[
          { label: "Total Candidates",  value: totalCandidates,                       sub: `${candidates.filter((c) => c.status === "shortlisted").length} shortlisted`, icon: <PeopleIcon />,    color: D.blueM,  bg: D.blueL,   progress: (candidates.filter((c)=>c.status==="shortlisted").length/(totalCandidates||1))*100 },
          { label: "Interviews Today",  value: interviewsToday,                       sub: `${interviews.length} total scheduled`,                                        icon: <ScheduleIcon />,  color: D.sky,    bg: D.skyL },
          { label: "Positions Filled",  value: `${positionsFilled}/${openings}`,      sub: `${openings - positionsFilled} remaining`,                                     icon: <HowToRegIcon />,  color: D.green,  bg: D.greenL,  progress: (positionsFilled / openings) * 100 },
          { label: "Acceptance Rate",   value: `${acceptanceRate}%`,                  sub: "hired / total candidates",                                                    icon: <TrendingUpIcon />, color: D.amber,  bg: D.amberL,  trend: "+5.2% from last month" },
        ].map((s, i) => (
          <Grid item key={i} xs={6} sm={6} md={3}><KpiCard {...s} /></Grid>
        ))}
      </Grid>

      {/* ── Charts Row ───────────────────────────────────────────── */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>

        {/* Pipeline donut */}
        <Grid item xs={12} sm={6} md={3}>
          <SCard title="Pipeline" badge={candidates.length}>
            {pipelineData.length > 0 ? (
              <>
                <Box sx={{ height: 190 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                        {pipelineData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <RechartsTooltip content={<DarkTip />} formatter={(v, n) => [`${v} candidates`, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 0.5 }}>
                  {pipelineData.map((e, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: e.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 11, color: D.textSub }}>{e.name}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: e.color }}>{e.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <PeopleIcon sx={{ fontSize: 40, color: D.textMuted, mb: 1 }} />
                <Typography sx={{ fontSize: 12, color: D.textMuted }}>No pipeline data yet</Typography>
              </Box>
            )}
          </SCard>
        </Grid>

        {/* Weekly bar chart */}
        <Grid item xs={12} sm={6} md={5}>
          <SCard title="Weekly Applications" action={
            <Typography sx={{ fontSize: 11, color: D.textMuted }}>Last 7 days</Typography>
          }>
            <Box sx={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ left: -20, right: 4 }} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke={D.borderLight} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: D.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: D.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip content={<DarkTip />} />
                  <Bar dataKey="applications" name="Applications" fill={D.blueM} radius={[4,4,0,0]} maxBarSize={20} />
                  <Bar dataKey="interviews"   name="Interviews"   fill={D.purple} radius={[4,4,0,0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
              {[["Applications", D.blueM], ["Interviews", D.purple]].map(([n, c]) => (
                <Box key={n} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: c }} />
                  <Typography sx={{ fontSize: 11, color: D.textSub }}>{n}</Typography>
                </Box>
              ))}
            </Box>
          </SCard>
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12} sm={12} md={4}>
          <SCard title="Upcoming Interviews" badge={interviews.length} noPad>
            {interviews.length > 0 ? (
              <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                {interviews.slice(0, 4).map((iv) => (
                  <Box key={iv._id} sx={{
                    p: 1.5, borderRadius: "10px", border: `1px solid ${D.borderLight}`, background: D.surfaceAlt,
                    transition: "border-color .15s", "&:hover": { borderColor: D.blueM, background: D.blueL },
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, color: D.text }}>{iv.candidateName || "—"}</Typography>
                      <Chip label={iv.type || "Interview"} size="small" sx={{ fontSize: 9, fontWeight: 700, background: D.blueL, color: D.blueM, height: 18 }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                      <CalendarIcon sx={{ fontSize: 12, color: D.textMuted }} />
                      <Typography sx={{ fontSize: 11, color: D.textSub }}>
                        {iv.date ? new Date(iv.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBD"} · {iv.time || "TBD"}
                      </Typography>
                      {iv.platform && (
                        <Chip label={iv.platform} size="small" variant="outlined" sx={{ fontSize: 9, height: 16, color: D.textMuted, borderColor: D.border }} />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 5, px: 2 }}>
                <ScheduleIcon sx={{ fontSize: 40, color: D.textMuted, mb: 1 }} />
                <Typography sx={{ fontSize: 12, color: D.textMuted }}>No upcoming interviews</Typography>
              </Box>
            )}
          </SCard>
        </Grid>
      </Grid>

      {/* ── Candidates Table ─────────────────────────────────────── */}
      <SCard title="Candidates" badge={filteredCandidates.length} noPad
        action={
          <Button size="small" onClick={() => setAddCandidateOpen(true)} startIcon={<AddIcon />}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: 11, background: D.blueM, color: "#fff", px: 1.5, "&:hover": { background: D.blue }, boxShadow: "none" }}>
            {isMobile ? "Add" : "Add Candidate"}
          </Button>
        }>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: 600, md: 900 } }}>
            <TableHead>
              <TableRow sx={{ background: D.bg }}>
                {["Candidate", "Contact", "Stage", "Applied", "Score", "CTC", "Status", "Activity", ""].map((h, i) => (
                  <TableCell key={i} align={i === 8 ? "right" : "left"}
                    sx={{ fontSize: 10, fontWeight: 800, color: D.textMuted, textTransform: "uppercase", letterSpacing: 0.7, borderBottom: `1px solid ${D.border}`, py: 1.3, px: i === 0 ? 2.5 : 1.5, whiteSpace: "nowrap" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <PeopleIcon sx={{ fontSize: 44, color: D.textMuted, mb: 1.5, display: "block", mx: "auto" }} />
                    <Typography sx={{ fontSize: 13, color: D.textMuted, mb: 2 }}>No candidates found</Typography>
                    <Button variant="outlined" size="small" onClick={() => setAddCandidateOpen(true)}
                      sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, borderColor: D.border, color: D.textSub }}>
                      Add your first candidate
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {filteredCandidates.map((c) => {
                const [sBg, sColor] = statusChipColor(c.status);
                return (
                  <TableRow key={c.id} sx={{ "&:last-child td": { border: 0 }, "&:hover": { background: D.surfaceAlt }, cursor: "pointer" }}
                    onClick={() => navigate(`/candidates/${c.id}`)}>

                    {/* Candidate */}
                    <TableCell sx={{ px: 2.5, py: 1.4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: c.avatarColor, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {c.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 13, color: D.text, lineHeight: 1.2 }} noWrap>{c.name}</Typography>
                          <Typography sx={{ fontSize: 11, color: D.textMuted }} noWrap>{c.experience} exp</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Contact */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Typography sx={{ fontSize: 12, color: D.textSub }} noWrap>{c.email}</Typography>
                      <Typography sx={{ fontSize: 11, color: D.textMuted }} noWrap>{c.phone}</Typography>
                    </TableCell>

                    {/* Stage */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Chip label={c.stage} size="small"
                        sx={{ fontSize: 10, fontWeight: 700, background: `${stageColor(c.stage)}18`, color: stageColor(c.stage), border: `1px solid ${stageColor(c.stage)}33` }} />
                    </TableCell>

                    {/* Applied */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Typography sx={{ fontSize: 12, color: D.textSub, whiteSpace: "nowrap" }}>{c.appliedDate}</Typography>
                    </TableCell>

                    {/* Score */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 52 }}>
                          <LinearProgress variant="determinate" value={c.matchingScore}
                            sx={{ height: 5, borderRadius: 3, bgcolor: `${scoreColor(c.matchingScore)}20`, "& .MuiLinearProgress-bar": { bgcolor: scoreColor(c.matchingScore), borderRadius: 3 } }} />
                        </Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: scoreColor(c.matchingScore), whiteSpace: "nowrap" }}>{c.matchingScore}%</Typography>
                      </Box>
                    </TableCell>

                    {/* CTC */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Typography sx={{ fontSize: 11, color: D.textSub, whiteSpace: "nowrap" }}>C: {c.currentCTC}</Typography>
                      <Typography sx={{ fontSize: 11, color: D.textMuted, whiteSpace: "nowrap" }}>E: {c.expectedCTC}</Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Chip label={c.status} size="small" sx={{ fontSize: 10, fontWeight: 700, background: sBg, color: sColor, border: `1px solid ${sColor}33`, textTransform: "capitalize" }} />
                    </TableCell>

                    {/* Activity */}
                    <TableCell sx={{ px: 1.5, py: 1.4 }}>
                      <Typography sx={{ fontSize: 12, color: D.textMuted, whiteSpace: "nowrap" }}>{c.lastActivity}</Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ px: 1.5, py: 1.4 }} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View Profile" arrow>
                        <IconButton size="small" onClick={() => navigate(`/candidates/${c.id}`)}
                          sx={{ borderRadius: "7px", p: 0.6, color: D.blueM, background: D.blueL, "&:hover": { background: D.blueM, color: "#fff" }, transition: "all .15s" }}>
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </SCard>

      {/* ── Add Candidate Dialog ──────────────────────────────────── */}
      <Dialog open={addCandidateOpen} onClose={() => setAddCandidateOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, pt: 2.5, pb: 1.5, borderBottom: `1px solid ${D.border}` }}>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: D.text }}>Add Candidate</Typography>
          <IconButton onClick={() => setAddCandidateOpen(false)} size="small"
            sx={{ borderRadius: "8px", background: D.bg, "&:hover": { background: D.border } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <AddCandidateForm
            onClose={() => setAddCandidateOpen(false)}
            onSubmit={() => { setAddCandidateOpen(false); fetchAllData(); }} />
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Dashboard;