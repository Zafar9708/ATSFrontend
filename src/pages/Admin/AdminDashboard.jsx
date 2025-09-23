


// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Grid,
//   Snackbar,
//   Alert,
//   Divider,
//   Chip,
//   Avatar,
//   IconButton,
//   Card,
//   CardContent,
//   InputAdornment,
//   Badge,
//   Tooltip,
//   useTheme,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Search as SearchIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   CheckCircle as ActiveIcon,
//   Cancel as InactiveIcon,
//   Refresh as RefreshIcon,
//   People as PeopleIcon,
//   Work as WorkIcon,
//   BarChart as BarChartIcon,
//   TrendingUp as TrendingUpIcon,
//   Email as EmailIcon,
//   Lock as LockIcon,
//   FilterAlt as FilterIcon,
//   CalendarToday as CalendarIcon,
//   Dashboard as DashboardIcon,
//   Person as PersonIcon,
//   Phone as PhoneIcon,
//   WorkHistory as ExperienceIcon,
//   Link as LinkIcon,
//   Send as SendIcon
// } from '@mui/icons-material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import adminService from '../../services/adminService';
// import { useNavigate } from 'react-router-dom';
// import MainLayout from '../../layout/MainLayout';


// const AdminDashboard = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [recruiters, setRecruiters] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newRecruiter, setNewRecruiter] = useState({ 
//     email: '', 
//     password: '', 
//     username: '', 
//     experience: 0, 
//     phoneNumber: '',
//     profilePicture: null
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [saving, setSaving] = useState(false);
//   const [searchRecruiter, setSearchRecruiter] = useState('');
//   const [searchJob, setSearchJob] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const [timeFilter, setTimeFilter] = useState('all');
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
//   const [newRecruiterLink, setNewRecruiterLink] = useState('');
//   const [recruiterActivityData, setRecruiterActivityData] = useState([]);

//   // Calculate recruiter activity data
//   useEffect(() => {
//     if (recruiters.length > 0) {
//       // Group by month and count added recruiters
//       const monthlyData = {};

//       recruiters.forEach(recruiter => {
//         const date = new Date(recruiter.createdAt);
//         const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

//         if (!monthlyData[monthYear]) {
//           monthlyData[monthYear] = { name: monthYear, added: 0, active: 0 };
//         }

//         monthlyData[monthYear].added++;
//         if (recruiter.isActive) {
//           monthlyData[monthYear].active++;
//         }
//       });

//       // Convert to array format for the chart and sort by date
//       const activityData = Object.values(monthlyData).sort((a, b) => {
//         const dateA = new Date(a.name);
//         const dateB = new Date(b.name);
//         return dateA - dateB;
//       });

//       setRecruiterActivityData(activityData.slice(-6)); // Last 6 months
//     }
//   }, [recruiters]);

//   // Filter jobs based on status and target hire date
//   const activeJobs = jobs.filter(job => {
//     const today = new Date();
//     const targetHireDate = new Date(job.jobFormId?.targetHireDate);
//     return job.status === 'Active' && targetHireDate >= today;
//   });

//   // Calculate average jobs per recruiter
//   const avgJobsPerRecruiter = recruiters.length > 0 
//     ? (jobs.length / recruiters.length).toFixed(1) 
//     : 0;

//   // Job status data for pie chart
//   const jobStatusData = [
//     { name: 'Active', value: activeJobs.length },
//     { name: 'Closed', value: jobs.filter(j => j.status === 'Closed').length },
//     // { name: 'Draft', value: jobs.filter(j => j.status === 'Draft').length },
//   ];

//   const COLORS = [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main];

//   const fetchRecruiters = async () => {
//     setLoading(true);
//     try {
//       const response = await adminService.getRecruiters();
//       if (response.recruiters && Array.isArray(response.recruiters)) {
//         setRecruiters(response.recruiters);
//       } else if (response.recuiter && Array.isArray(response.recuiter)) {
//         setRecruiters(response.recuiter);
//       } else {
//         setRecruiters([]);
//       }
//     } catch (err) {
//       console.error('Error fetching recruiters:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch recruiters', severity: 'error' });
//       setRecruiters([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const response = await adminService.getAllJobs();
//       if (response.jobs && Array.isArray(response.jobs)) {
//         setJobs(response.jobs);
//       } else {
//         setJobs([]);
//       }
//     } catch (err) {
//       console.error('Error fetching jobs:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch jobs', severity: 'error' });
//       setJobs([]);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchRecruiters();
//     fetchJobs().finally(() => setRefreshing(false));
//   };

//   useEffect(() => {
//     fetchRecruiters();
//     fetchJobs();
//   }, []);

//   const handleOpenDialog = (recruiter = null) => {
//     if (recruiter) {
//       setEditingId(recruiter._id);
//       setNewRecruiter({ 
//         email: recruiter.email, 
//         password: '', 
//         username: recruiter.username || '', 
//         experience: recruiter.experience || 0, 
//         phoneNumber: recruiter.phoneNumber || '',
//         profilePicture: null
//       });
//       setProfilePreview(recruiter.profilePicture || null);
//     } else {
//       setEditingId(null);
//       setNewRecruiter({ 
//         email: '', 
//         password: '', 
//         username: '', 
//         experience: 0, 
//         phoneNumber: '',
//         profilePicture: null
//       });
//       setProfilePreview(null);
//     }
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     if (saving) return;
//     setOpenDialog(false);
//     setEditingId(null);
//     setNewRecruiter({ 
//       email: '', 
//       password: '', 
//       username: '', 
//       experience: 0, 
//       phoneNumber: '',
//       profilePicture: null
//     });
//     setProfileImage(null);
//     setProfilePreview(null);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(file);
//       setNewRecruiter({ ...newRecruiter, profilePicture: file });

//       // Create a preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveRecruiter = async () => {
//     if (!newRecruiter.email.trim()) {
//       setSnackbar({ open: true, message: 'Email is required', severity: 'warning' });
//       return;
//     }
//     if (!newRecruiter.username.trim()) {
//       setSnackbar({ open: true, message: 'Username is required', severity: 'warning' });
//       return;
//     }

//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append('email', newRecruiter.email);
//       formData.append('password', 'temporary-password'); // Will be overridden by backend
//       formData.append('username', newRecruiter.username);
//       formData.append('experience', newRecruiter.experience);
//       formData.append('phoneNumber', newRecruiter.phoneNumber);

//       if (newRecruiter.profilePicture) {
//         formData.append('profilePicture', newRecruiter.profilePicture);
//       }

//       const response = await adminService.addRecruiter(formData);

//       if (response.data.status === 'success') {
//         setSnackbar({ 
//           open: true, 
//           message: 'Recruiter added successfully. Welcome email sent!', 
//           severity: 'success' 
//         });

//         // Show welcome dialog with login link
//         setNewRecruiterLink(response.data.data.loginLink);
//         setShowWelcomeDialog(true);
//       } else if (response.data.status === 'partial_success') {
//         setSnackbar({ 
//           open: true, 
//           message: 'Recruiter created but welcome email failed to send', 
//           severity: 'warning' 
//         });

//         // Show dialog with manual link
//         setNewRecruiterLink(response.data.data.loginLink);
//         setShowWelcomeDialog(true);
//       }

//       await fetchRecruiters();
//       handleCloseDialog();
//     } catch (err) {
//       console.error('Error saving recruiter:', err);
//       const message = err.response?.data?.message || 'Error saving recruiter';
//       setSnackbar({ open: true, message, severity: 'error' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleResendWelcomeEmail = async (recruiterId) => {
//     try {
//       const response = await adminService.resendWelcomeEmail(recruiterId);
//       setSnackbar({ 
//         open: true, 
//         message: 'Welcome email resent successfully', 
//         severity: 'success' 
//       });
//       setNewRecruiterLink(response.data.loginLink);
//       setShowWelcomeDialog(true);
//     } catch (err) {
//       console.error('Error resending welcome email:', err);
//       setSnackbar({ 
//         open: true, 
//         message: 'Failed to resend welcome email', 
//         severity: 'error' 
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this recruiter?')) return;
//     try {
//       await adminService.deleteRecruiter(id);
//       setSnackbar({ open: true, message: 'Recruiter deleted successfully', severity: 'info' });
//       fetchRecruiters();
//     } catch (err) {
//       console.error('Error deleting recruiter:', err);
//       const message = err.response?.data?.message || 'Error deleting recruiter';
//       setSnackbar({ open: true, message, severity: 'error' });
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setSnackbar({ open: true, message: 'Link copied to clipboard', severity: 'success' });
//     });
//   };

//   const filteredRecruiters = recruiters.filter(
//     (r) => r.email.toLowerCase().includes(searchRecruiter.toLowerCase()) ||
//            r.username?.toLowerCase().includes(searchRecruiter.toLowerCase())
//   );

//   const filteredJobs = jobs.filter(job => {
//     // Search filter
//     const matchesSearch = 
//       job.jobName?.toLowerCase().includes(searchJob.toLowerCase()) ||
//       job.jobTitle?.toLowerCase().includes(searchJob.toLowerCase()) ||
//       job.department?.toLowerCase().includes(searchJob.toLowerCase()) ||
//       (job.jobFormId?.recruitingPerson?.some(email => 
//         email?.toLowerCase().includes(searchJob.toLowerCase())) 
//       );

//     // Time filter
//     const jobDate = new Date(job.createdAt);
//     let matchesTime = true;

//     if (timeFilter === 'weekly') {
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//       matchesTime = jobDate >= oneWeekAgo;
//     } else if (timeFilter === 'monthly') {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//       matchesTime = jobDate >= oneMonthAgo;
//     } else if (timeFilter === 'yearly') {
//       const oneYearAgo = new Date();
//       oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
//       matchesTime = jobDate >= oneYearAgo;
//     } else if (timeFilter === 'custom' && startDate && endDate) {
//       matchesTime = jobDate >= new Date(startDate) && jobDate <= new Date(endDate);
//     }

//     return matchesSearch && matchesTime;
//   });

//   // Function to get recruiter name from tenant ID
//   const getRecruiterName = (tenantId) => {
//     const recruiter = recruiters.find(r => r._id === tenantId);
//     return recruiter ? recruiter.username || recruiter.email : 'Unknown';
//   };

//   if (loading && !refreshing) {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         minHeight="80vh"
//       >
//         <CircularProgress size={60} />
//         <Typography mt={2}>Loading Dashboard...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <>
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ 
//         p:0, 
//         backgroundColor: theme.palette.background.default,
//         minHeight: '100vh',
//         maxWidth: '100%',
//         overflowX: 'hidden',
//         marginRight:"50px"



//       }}>
//         {/* Header */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mr={6}>
//           <Box>
//             <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
//               Admin Dashboard
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <DashboardIcon fontSize="small" />
//               Manage recruiters and job postings
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={2}>
//             <FormControl size="small" sx={{ minWidth: 120 }}>
//               <InputLabel>Time Filter</InputLabel>
//               <Select
//                 value={timeFilter}
//                 onChange={(e) => setTimeFilter(e.target.value)}
//                 label="Time Filter"
//                 sx={{ borderRadius: 2 }}
//               >
//                 <MenuItem value="all">All Time</MenuItem>
//                 <MenuItem value="weekly">Weekly</MenuItem>
//                 <MenuItem value="monthly">Monthly</MenuItem>
//                 <MenuItem value="yearly">Yearly</MenuItem>
//                 <MenuItem value="custom">Custom Range</MenuItem>
//               </Select>
//             </FormControl>

//             {timeFilter === 'custom' && (
//               <Box display="flex" gap={1} alignItems="center">
//                 <DatePicker
//                   label="Start Date"
//                   value={startDate}
//                   onChange={(newValue) => setStartDate(newValue)}
//                   renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150 }} />}
//                 />
//                 <Typography>-</Typography>
//                 <DatePicker
//                   label="End Date"
//                   value={endDate}
//                   onChange={(newValue) => setEndDate(newValue)}
//                   renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150 }} />}
//                 />
//               </Box>
//             )}

//             <Tooltip title="Refresh Data">
//               <IconButton
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 sx={{
//                   backgroundColor: theme.palette.action.hover,
//                   '&:hover': {
//                     backgroundColor: theme.palette.grey[300]
//                   }
//                 }}
//               >
//                 <RefreshIcon />
//               </IconButton>
//             </Tooltip>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => handleOpenDialog()}
//               sx={{
//                 backgroundColor: theme.palette.primary.main,
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.dark,
//                   boxShadow: theme.shadows[4]
//                 },
//                 boxShadow: theme.shadows[2],
//                 borderRadius: 2,
//                 px: 3,
//                 py: 1,
//                 mr: 1
//               }}
//             >
//               Add Recruiter
//             </Button>
//             <Button
//               variant="outlined"
//               startIcon={<WorkIcon />}
//               onClick={() => navigate('/dashboard/jobs/createJob')}
//               sx={{
//                 color: theme.palette.primary.main,
//                 borderColor: theme.palette.primary.main,
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.light,
//                   borderColor: theme.palette.primary.dark
//                 },
//                 borderRadius: 2,
//                 px: 3,
//                 py: 1
//               }}
//             >
//               Create Job
//             </Button>
//           </Box>
//         </Box>

//         {/* Stats Cards */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} sm={6} md={3} width={'25%'}>
//             <Card sx={{ 
//               p: 3, 
//               height: '100%', 
//               borderRadius: 3,
//               background: `linear-gradient(195deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//               color: 'white',
//               boxShadow: theme.shadows[4],
//               position: 'relative',
//               overflow: 'hidden',
//               '&:before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: '-50px',
//                 right: '-50px',
//                 width: '120px',
//                 height: '120px',
//                 borderRadius: '50%',
//                 background: 'rgba(255,255,255,0.1)'
//               }
//             }}>
//               <Box position="relative" zIndex={1}>
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Recruiters</Typography>
//                 <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{recruiters.length}</Typography>
//                 <Box display="flex" alignItems="center">
//                   <TrendingUpIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2">+{Math.floor(recruiters.length * 0.12)} from last month</Typography>
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3} width={'22%'}>
//             <Card sx={{ 
//               p: 3, 
//               height: '100%', 
//               borderRadius: 3,
//               background: `linear-gradient(195deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
//               color: 'white',
//               boxShadow: theme.shadows[4],
//               position: 'relative',
//               overflow: 'hidden',
//               '&:before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: '-50px',
//                 right: '-50px',
//                 width: '120px',
//                 height: '120px',
//                 borderRadius: '50%',
//                 background: 'rgala(255,255,255,0.1)'
//               }
//             }}>
//               <Box position="relative" zIndex={1}>
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Jobs</Typography>
//                 <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{jobs.length}</Typography>
//                 <Box display="flex" alignItems="center">
//                   <WorkIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2">{Math.floor(jobs.length * 0.3)} new this month</Typography>
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3} width={'22%'}>
//             <Card sx={{ 
//               p: 3, 
//               height: '100%',
//               borderRadius: 3,
//               background: `linear-gradient(195deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
//               color: 'white',
//               boxShadow: theme.shadows[4],
//               position: 'relative',
//               overflow: 'hidden',
//               '&:before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: '-50px',
//                 right: '-50px',
//                 width: '120px',
//                 height: '120px',
//                 borderRadius: '50%',
//                 background: 'rgba(255,255,255,0.1)'
//               }
//             }}>
//               <Box position="relative" zIndex={1}>
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Jobs</Typography>
//                 <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>
//                   {activeJobs.length}
//                 </Typography>
//                 <Box display="flex" alignItems="center">
//                   <ActiveIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2">
//                     {jobs.length > 0 ? Math.round((activeJobs.length / jobs.length) * 100) : 0}% of total
//                   </Typography>
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3} width={'22%'}>
//             <Card sx={{ 
//               p: 3, 
//               height: '100%', 
//               borderRadius: 3,
//               background: `linear-gradient(195deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
//               color: 'white',
//               boxShadow: theme.shadows[4],
//               position: 'relative',
//               overflow: 'hidden',
//               '&:before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: '-50px',
//                 right: '-50px',
//                 width: '120px',
//                 height: '120px',
//                 borderRadius: '50%',
//                 background: 'rgala(255,255,255,0.1)'
//               }
//             }}>
//               <Box position="relative" zIndex={1}>
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>Avg Jobs/Recruiter</Typography>
//                 <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>
//                   {avgJobsPerRecruiter}
//                 </Typography>
//                 <Box display="flex" alignItems="center">
//                   <BarChartIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2">Across all recruiters</Typography>
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Charts Section */}
//         <Grid container spacing={3} sx={{ mb: 4,  }} >
//           <Grid item xs={12} md={6} width={'47%'}>
//             <Card sx={{ 
//               p: 3, 
//               height: '100%', 
//               borderRadius: 3,
//               boxShadow: theme.shadows[1],
//               backgroundColor: theme.palette.background.paper
//             }}>
//               <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
//                 Recruiter Activity (Last 6 Months)
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={recruiterActivityData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
//                   <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
//                   <YAxis stroke={theme.palette.text.secondary} />
//                   <ChartTooltip 
//                     contentStyle={{
//                       borderRadius: 8,
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       boxShadow: theme.shadows[2]
//                     }}
//                   />
//                   <Legend />
//                   <Bar dataKey="added" name="Recruiters Added" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="active" name="Active Recruiters" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={6} width={'47%'}>
//             <Card sx={{ 
//               p: 3, 
//               height: '100%', 
//               borderRadius: 3,
//               boxShadow: theme.shadows[1],
//               backgroundColor: theme.palette.background.paper
//             }}>
//               <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
//                 Job Status Distribution
//               </Typography>
//               <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 {jobStatusData.some(item => item.value > 0) ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={jobStatusData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {jobStatusData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip 
//                         formatter={(value, name) => [`${value} jobs`, name]}
//                         contentStyle={{
//                           borderRadius: 8,
//                           backgroundColor: theme.palette.background.paper,
//                           border: `1px solid ${theme.palette.divider}`,
//                           boxShadow: theme.shadows[2]
//                         }}
//                       />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <Typography variant="body2" color="text.secondary">
//                     No job data available
//                   </Typography>
//                 )}
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Horizontal Layout */}
//         <Grid container spacing={3} >
//           {/* Left Column - Recruiters */}
//           <Grid item xs={12} md={6} mr={6} width={'100%'}>
//             <Card sx={{ 
//               height: '100%',
//               borderRadius: 3,
//               boxShadow: theme.shadows[1],
//               backgroundColor: theme.palette.background.paper
//             }}>
//               <Box 
//                 display="flex" 
//                 justifyContent="space-between" 
//                 alignItems="center" 
//                 p={3}

//                 sx={{
//                   borderBottom: `1px solid ${theme.palette.divider}`
//                 }}
//               >
//                 <Typography variant="h5" fontWeight="600">Recruiters</Typography>
//                 <TextField
//                   size="small"
//                   placeholder="Search recruiters..."
//                   variant="outlined"
//                   value={searchRecruiter}
//                   onChange={(e) => setSearchRecruiter(e.target.value)}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon color="action" />
//                       </InputAdornment>
//                     ),
//                     style: {
//                       borderRadius: 8,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                   sx={{ width: 300 }}
//                 />
//               </Box>
//               <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
//                 <Table stickyHeader>
//                   <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredRecruiters.length > 0 ? (
//                       filteredRecruiters.map((recruiter) => (
//                         <TableRow 
//                           key={recruiter._id} 
//                           hover
//                           sx={{ 
//                             '&:last-child td': { borderBottom: 0 },
//                             '&:hover': {
//                               backgroundColor: theme.palette.action.hover
//                             }
//                           }}
//                         >
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               {recruiter.profilePicture ? (
//                                 <Avatar 
//                                   src={recruiter.profilePicture} 
//                                   sx={{ width: 40, height: 40, mr: 2 }}
//                                 />
//                               ) : (
//                                 <Avatar 
//                                   sx={{ 
//                                     width: 40, 
//                                     height: 40, 
//                                     mr: 2,
//                                     backgroundColor: theme.palette.primary.main,
//                                     color: 'white'
//                                   }}
//                                 >
//                                   {recruiter.username?.charAt(0)?.toUpperCase() || recruiter.email.charAt(0).toUpperCase()}
//                                 </Avatar>
//                               )}
//                               <Box>
//                                 <Typography fontWeight="500">{recruiter.username || 'No Name'}</Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2" color="text.secondary">
//                               {recruiter.email}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2" color="text.secondary">
//                               {recruiter.phoneNumber || 'N/A'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               icon={<ExperienceIcon />}
//                               label={`${recruiter.experience || 0} yrs`}
//                               size="small"
//                               variant="outlined"
//                               sx={{ 
//                                 borderColor: theme.palette.info.main,
//                                 color: theme.palette.info.dark
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={recruiter.isActive ? 'Active' : 'Inactive'}
//                               size="small"
//                               sx={{ 
//                                 backgroundColor: recruiter.isActive ? theme.palette.success.light : theme.palette.error.light,
//                                 color: recruiter.isActive ? theme.palette.success.dark : theme.palette.error.dark,
//                                 fontWeight: 500
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <Box display="flex" justifyContent="flex-end" gap={1}>
//                               <Tooltip title="Resend Welcome Email">
//                                 <IconButton
//                                   onClick={() => handleResendWelcomeEmail(recruiter._id)}
//                                   size="small"
//                                   sx={{
//                                     backgroundColor: theme.palette.action.hover,
//                                     color: theme.palette.info.main,
//                                     '&:hover': {
//                                       backgroundColor: theme.palette.info.main,
//                                       color: 'white'
//                                     }
//                                   }}
//                                 >
//                                   <EmailIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Edit Recruiter">
//                                 <IconButton
//                                   onClick={() => handleOpenDialog(recruiter)}
//                                   size="small"
//                                   sx={{
//                                     backgroundColor: theme.palette.action.hover,
//                                     color: theme.palette.secondary.main,
//                                     '&:hover': {
//                                       backgroundColor: theme.palette.secondary.main,
//                                       color: 'white'
//                                     }
//                                   }}
//                                 >
//                                   <EditIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete Recruiter">
//                                 <IconButton
//                                   onClick={() => handleDelete(recruiter._id)}
//                                   size="small"
//                                   sx={{
//                                     backgroundColor: theme.palette.action.hover,
//                                     color: theme.palette.error.main,
//                                     '&:hover': {
//                                       backgroundColor: theme.palette.error.main,
//                                       color: 'white'
//                                     }
//                                   }}
//                                 >
//                                   <DeleteIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                           <Typography variant="body1" color="text.secondary">
//                             No recruiters found
//                           </Typography>
//                           <Button 
//                             variant="text" 
//                             startIcon={<AddIcon />}
//                             onClick={() => handleOpenDialog()}
//                             sx={{ mt: 1 }}
//                           >
//                             Add New Recruiter
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Card>
//           </Grid>

//           {/* Right Column - Jobs */}
//           <Grid item xs={12} md={6}>
//   <Card
//     sx={{
//       height: "100%",
//       borderRadius: 3,
//       boxShadow: theme.shadows[1],
//       backgroundColor: theme.palette.background.paper,
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     {/* Header */}
//     <Box
//       display="flex"
//       justifyContent="space-between"
//       alignItems="center"
//       p={3}
//       sx={{
//         borderBottom: `1px solid ${theme.palette.divider}`,
//       }}
//     >
//       <Typography variant="h5" fontWeight="600">
//         Job Postings
//       </Typography>
//       <TextField
//         size="small"
//         placeholder="Search jobs..."
//         variant="outlined"
//         value={searchJob}
//         onChange={(e) => setSearchJob(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon color="action" />
//             </InputAdornment>
//           ),
//           style: {
//             borderRadius: 8,
//             backgroundColor: theme.palette.background.default,
//           },
//         }}
//         sx={{ width: 250 }}
//       />
//     </Box>

//     {/* Content */}
//     <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
//       <Grid container spacing={2}>
//         {filteredJobs.length > 0 ? (
//           filteredJobs.map((job) => {
//             const targetHireDate = job.jobFormId?.targetHireDate
//               ? new Date(job.jobFormId.targetHireDate).toLocaleDateString()
//               : "Not set";
//             const isActive =
//               job.status === "Active" &&
//               (!job.jobFormId?.targetHireDate ||
//                 new Date(job.jobFormId.targetHireDate) >= new Date());
//             const recruiterName = getRecruiterName(job.userId);

//             return (
//               <Grid item xs={12} sm={6} md={6} key={job._id}>
//                 <Card
//                   sx={{
//                     p: 2.5,
//                     borderRadius: 2,
//                     borderLeft: `4px solid ${
//                       isActive
//                         ? theme.palette.success.main
//                         : theme.palette.error.main
//                     }`,
//                     "&:hover": {
//                       boxShadow: theme.shadows[6],
//                       transform: "translateY(-4px)",
//                     },
//                     transition: "all 0.25s ease-in-out",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Box>
//                     <Typography
//                       variant="h6"
//                       fontWeight="600"
//                       gutterBottom
//                       sx={{ color: theme.palette.text.primary }}
//                     >
//                       {job.jobTitle}
//                     </Typography>

//                     <Box
//                       display="flex"
//                       alignItems="center"
//                       flexWrap="wrap"
//                       gap={1}
//                       mb={2}
//                     >
//                       <Chip
//                         label={job.department}
//                         size="small"
//                         variant="outlined"
//                         sx={{
//                           borderColor: theme.palette.primary.main,
//                           color: theme.palette.primary.dark,
//                         }}
//                       />
//                       <Chip
//                         label={job.jobFormId?.jobType || "Full-time"}
//                         size="small"
//                         variant="outlined"
//                         sx={{
//                           borderColor: theme.palette.secondary.main,
//                           color: theme.palette.secondary.dark,
//                         }}
//                       />
//                       <Chip
//                         label={job.status}
//                         size="small"
//                         sx={{
//                           backgroundColor: isActive
//                             ? theme.palette.success.light
//                             : theme.palette.error.light,
//                           color: isActive
//                             ? theme.palette.success.dark
//                             : theme.palette.error.dark,
//                           fontWeight: 500,
//                         }}
//                       />
//                     </Box>

//                     <Box display="flex" flexDirection="column" gap={1}>
//                       <Typography variant="body2" color="text.secondary">
//                         <Box component="span" fontWeight="500">
//                           Job ID:
//                         </Box>{" "}
//                         {job.jobName}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         <Box component="span" fontWeight="500">
//                           Openings:
//                         </Box>{" "}
//                         {job.jobFormId?.openings || 0}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         <Box component="span" fontWeight="500">
//                           Target Hire:
//                         </Box>{" "}
//                         {targetHireDate}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         <Box component="span" fontWeight="500">
//                           Created by:
//                         </Box>{" "}
//                         {recruiterName}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Box textAlign="right" mt={2}>
//                     <Typography variant="caption" color="text.secondary">
//                       Created: {new Date(job.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </Box>
//                 </Card>
//               </Grid>
//             );
//           })
//         ) : (
//           <Grid item xs={12}>
//             <Box textAlign="center" py={4}>
//               <Typography variant="body1" color="text.secondary">
//                 No jobs found
//               </Typography>
//             </Box>
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   </Card>
// </Grid>

//         </Grid>

//         {/* Add/Edit Recruiter Dialog */}
//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           maxWidth="sm"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               p: 3,
//               background: theme.palette.background.paper,
//               boxShadow: theme.shadows[5]
//             }
//           }}
//         >
//           <DialogTitle sx={{ 
//             fontWeight: 700, 
//             p: 0, 
//             mb: 3,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1
//           }}>
//             <PeopleIcon color="primary" />
//             {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
//           </DialogTitle>
//           <DialogContent sx={{ p: 0, mb: 3 }}>
//             {/* Profile Picture Upload */}
//             <Box display="flex" alignItems="center" mb={3}>
//               <Avatar
//                 src={profilePreview}
//                 sx={{ 
//                     width: 80, 
//                     height: 80, 
//                     mr: 2,
//                     backgroundColor: theme.palette.grey[200]
//                 }}
//               > 
//                 {!profilePreview && <PersonIcon sx={{ fontSize: 40 }} />}
//               </Avatar>
//               <Button
//                 variant="outlined"
//                 component="label"
//                 size="small"
//                 sx={{ borderRadius: 2 }}
//               >
//                 Upload Photo
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />
//               </Button>
//               {profileImage && (
//                 <Typography variant="caption" sx={{ ml: 1 }}>
//                   {profileImage.name}
//                 </Typography>
//               )}
//             </Box>

//             <TextField
//               fullWidth
//               margin="normal"
//               label="Username"
//               value={newRecruiter.username}
//               onChange={(e) => setNewRecruiter({ ...newRecruiter, username: e.target.value })}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 style: {
//                   borderRadius: 8
//                 }
//               }}
//               disabled={saving}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Email"
//               type="email"
//               value={newRecruiter.email}
//               onChange={(e) => setNewRecruiter({ ...newRecruiter, email: e.target.value })}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <EmailIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 style: {
//                   borderRadius: 8
//                 }
//               }}
//               disabled={saving}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Phone Number"
//               type="tel"
//               value={newRecruiter.phoneNumber}
//               onChange={(e) => setNewRecruiter({ ...newRecruiter, phoneNumber: e.target.value })}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PhoneIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 style: {
//                   borderRadius: 8
//                 }
//               }}
//               disabled={saving}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Experience (years)"
//               type="number"
//               value={newRecruiter.experience}
//               onChange={(e) => setNewRecruiter({ ...newRecruiter, experience: parseInt(e.target.value) || 0 })}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <ExperienceIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 style: {
//                   borderRadius: 8
//                 }
//               }}
//               disabled={saving}
//               inputProps={{ min: 0, max: 50 }}
//             />
//           </DialogContent>
//           <DialogActions sx={{ p: 0 }}>
//             <Button 
//               onClick={handleCloseDialog}
//               variant="outlined"
//               disabled={saving}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 px: 3,
//                 py: 1,
//                 borderColor: theme.palette.divider,
//                 '&:hover': {
//                   borderColor: theme.palette.primary.main
//                 }
//               }}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSaveRecruiter}
//               variant="contained"
//               disabled={saving}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 px: 3,
//                 py: 1,
//                 boxShadow: 'none',
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.dark,
//                   boxShadow: 'none'
//                 }
//               }}
//             >
//               {saving ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : editingId ? (
//                 'Update Recruiter'
//               ) : (
//                 'Add Recruiter'
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Welcome Dialog with Login Link */}
//         <Dialog
//           open={showWelcomeDialog}
//           onClose={() => setShowWelcomeDialog(false)}
//           maxWidth="sm"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               p: 3,
//               background: theme.palette.background.paper,
//               boxShadow: theme.shadows[5]
//             }
//           }}
//         >
//           <DialogTitle sx={{ 
//             fontWeight: 700, 
//             p: 0, 
//             mb: 3,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1,
//             color: theme.palette.success.main
//           }}>
//             <CheckCircleIcon color="success" />
//             Recruiter Added Successfully!
//           </DialogTitle>
//           <DialogContent sx={{ p: 0, mb: 3 }}>
//             <Typography variant="body1" gutterBottom>
//               A welcome email with login instructions has been sent to the recruiter's email address.
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//               You can also share this direct login link if needed:
//             </Typography>
//             <Box
//               sx={{
//                 p: 2,
//                 mt: 2,
//                 backgroundColor: theme.palette.grey[100],
//                 borderRadius: 2,
//                 border: `1px solid ${theme.palette.divider}`,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between'
//               }}
//             >
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   whiteSpace: 'nowrap',
//                   mr: 1
//                 }}
//               >
//                 {newRecruiterLink}
//               </Typography>
//               <Tooltip title="Copy link">
//                 <IconButton 
//                   size="small" 
//                   onClick={() => copyToClipboard(newRecruiterLink)}
//                   sx={{ color: theme.palette.primary.main }}
//                 >
//                   <LinkIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </DialogContent>
//           <DialogActions sx={{ p: 0 }}>
//             <Button 
//               onClick={() => setShowWelcomeDialog(false)}
//               variant="contained"
//               sx={{
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 px: 3,
//                 py: 1,
//                 boxShadow: 'none',
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.dark,
//                   boxShadow: 'none'
//                 }
//               }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Snackbar for feedback */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//           <Alert
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             severity={snackbar.severity}
//             sx={{ 
//               width: '100%',
//               borderRadius: 2,
//               boxShadow: theme.shadows[3]
//             }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </LocalizationProvider>
//     </>
//   );
// };

// export default AdminDashboard;





import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
  Badge,
  Tooltip,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  FilterAlt as FilterIcon,
  CalendarToday as CalendarIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  WorkHistory as ExperienceIcon,
  Link as LinkIcon,
  Send as SendIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import adminService from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import {inviteVendor}  from '../../services/Vendor/vendorService';
import MainLayout from '../../layout/MainLayout';


const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecruiter, setNewRecruiter] = useState({
    email: '',
    password: '',
    username: '',
    experience: 0,
    phoneNumber: '',
    profilePicture: null
  });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);
  const [searchRecruiter, setSearchRecruiter] = useState('');
  const [searchJob, setSearchJob] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [newRecruiterLink, setNewRecruiterLink] = useState('');
  const [recruiterActivityData, setRecruiterActivityData] = useState([]);
  const [openVendorDialog, setOpenVendorDialog] = useState(false);
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorInviteLoading, setVendorInviteLoading] = useState(false);
  const [vendorInviteSuccess, setVendorInviteSuccess] = useState(false);

  // Calculate recruiter activity data
  useEffect(() => {
    if (recruiters.length > 0) {
      // Group by month and count added recruiters
      const monthlyData = {};

      recruiters.forEach(recruiter => {
        const date = new Date(recruiter.createdAt);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { name: monthYear, added: 0, active: 0 };
        }

        monthlyData[monthYear].added++;
        if (recruiter.isActive) {
          monthlyData[monthYear].active++;
        }
      });

      // Convert to array format for the chart and sort by date
      const activityData = Object.values(monthlyData).sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA - dateB;
      });

      setRecruiterActivityData(activityData.slice(-6)); // Last 6 months
    }
  }, [recruiters]);

  // Filter jobs based on status and target hire date
  const activeJobs = jobs.filter(job => {
    const today = new Date();
    const targetHireDate = new Date(job.jobFormId?.targetHireDate);
    return job.status === 'Active' && targetHireDate >= today;
  });

  // Calculate average jobs per recruiter
  const avgJobsPerRecruiter = recruiters.length > 0
    ? (jobs.length / recruiters.length).toFixed(1)
    : 0;

  // Job status data for pie chart
  const jobStatusData = [
    { name: 'Active', value: activeJobs.length },
    { name: 'Closed', value: jobs.filter(j => j.status === 'Closed').length },
    // { name: 'Draft', value: jobs.filter(j => j.status === 'Draft').length },
  ];

  const COLORS = [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main];

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const response = await adminService.getRecruiters();
      if (response.recruiters && Array.isArray(response.recruiters)) {
        setRecruiters(response.recruiters);
      } else if (response.recuiter && Array.isArray(response.recuiter)) {
        setRecruiters(response.recuiter);
      } else {
        setRecruiters([]);
      }
    } catch (err) {
      console.error('Error fetching recruiters:', err);
      setSnackbar({ open: true, message: 'Failed to fetch recruiters', severity: 'error' });
      setRecruiters([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await adminService.getAllJobs();
      if (response.jobs && Array.isArray(response.jobs)) {
        setJobs(response.jobs);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setSnackbar({ open: true, message: 'Failed to fetch jobs', severity: 'error' });
      setJobs([]);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecruiters();
    fetchJobs().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchRecruiters();
    fetchJobs();
  }, []);

  const handleOpenDialog = (recruiter = null) => {
    if (recruiter) {
      setEditingId(recruiter._id);
      setNewRecruiter({
        email: recruiter.email,
        password: '',
        username: recruiter.username || '',
        experience: recruiter.experience || 0,
        phoneNumber: recruiter.phoneNumber || '',
        profilePicture: null
      });
      setProfilePreview(recruiter.profilePicture || null);
    } else {
      setEditingId(null);
      setNewRecruiter({
        email: '',
        password: '',
        username: '',
        experience: 0,
        phoneNumber: '',
        profilePicture: null
      });
      setProfilePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;
    setOpenDialog(false);
    setEditingId(null);
    setNewRecruiter({
      email: '',
      password: '',
      username: '',
      experience: 0,
      phoneNumber: '',
      profilePicture: null
    });
    setProfileImage(null);
    setProfilePreview(null);
  };


  const handleInviteVendor = async () => {
    if (!vendorEmail.trim()) {
      setSnackbar({ open: true, message: 'Email is required', severity: 'warning' });
      return;
    }

    setVendorInviteLoading(true);
    try {
      const response = await inviteVendor(vendorEmail);

      setSnackbar({
        open: true,
        message: 'Vendor invitation sent successfully!',
        severity: 'success'
      });

      setVendorInviteSuccess(true);
      // Reset form after a delay
      setTimeout(() => {
        setOpenVendorDialog(false);
        setVendorEmail('');
        setVendorInviteSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error sending vendor invitation:', err);
      const message = err.message || 'Error sending vendor invitation';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setVendorInviteLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setNewRecruiter({ ...newRecruiter, profilePicture: file });

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRecruiter = async () => {
    if (!newRecruiter.email.trim()) {
      setSnackbar({ open: true, message: 'Email is required', severity: 'warning' });
      return;
    }
    if (!newRecruiter.username.trim()) {
      setSnackbar({ open: true, message: 'Username is required', severity: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('email', newRecruiter.email);
      formData.append('password', 'temporary-password'); // Will be overridden by backend
      formData.append('username', newRecruiter.username);
      formData.append('experience', newRecruiter.experience);
      formData.append('phoneNumber', newRecruiter.phoneNumber);

      if (newRecruiter.profilePicture) {
        formData.append('profilePicture', newRecruiter.profilePicture);
      }

      const response = await adminService.addRecruiter(formData);

      if (response.data.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Recruiter added successfully. Welcome email sent!',
          severity: 'success'
        });

        // Show welcome dialog with login link
        setNewRecruiterLink(response.data.data.loginLink);
        setShowWelcomeDialog(true);
      } else if (response.data.status === 'partial_success') {
        setSnackbar({
          open: true,
          message: 'Recruiter created but welcome email failed to send',
          severity: 'warning'
        });

        // Show dialog with manual link
        setNewRecruiterLink(response.data.data.loginLink);
        setShowWelcomeDialog(true);
      }

      await fetchRecruiters();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving recruiter:', err);
      const message = err.response?.data?.message || 'Error saving recruiter';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResendWelcomeEmail = async (recruiterId) => {
    try {
      const response = await adminService.resendWelcomeEmail(recruiterId);
      setSnackbar({
        open: true,
        message: 'Welcome email resent successfully',
        severity: 'success'
      });
      setNewRecruiterLink(response.data.loginLink);
      setShowWelcomeDialog(true);
    } catch (err) {
      console.error('Error resending welcome email:', err);
      setSnackbar({
        open: true,
        message: 'Failed to resend welcome email',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recruiter?')) return;
    try {
      await adminService.deleteRecruiter(id);
      setSnackbar({ open: true, message: 'Recruiter deleted successfully', severity: 'info' });
      fetchRecruiters();
    } catch (err) {
      console.error('Error deleting recruiter:', err);
      const message = err.response?.data?.message || 'Error deleting recruiter';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Link copied to clipboard', severity: 'success' });
    });
  };

  const filteredRecruiters = recruiters.filter(
    (r) => r.email.toLowerCase().includes(searchRecruiter.toLowerCase()) ||
      r.username?.toLowerCase().includes(searchRecruiter.toLowerCase())
  );

  // Fixed time filter function
  const getDateRange = () => {
    const now = new Date();
    let startDateFilter = null;
    let endDateFilter = now;

    switch (timeFilter) {
      case 'weekly':
        startDateFilter = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case 'monthly':
        startDateFilter = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'yearly':
        startDateFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'custom':
        if (startDate && endDate) {
          startDateFilter = new Date(startDate);
          endDateFilter = new Date(endDate);
          endDateFilter.setHours(23, 59, 59, 999); // Include the entire end day
        }
        break;
      default:
        // 'all' or any other value - return null to indicate no date filtering
        return { startDate: null, endDate: null };
    }

    return { startDate: startDateFilter, endDate: endDateFilter };
  };

  const filteredJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch =
      job.jobName?.toLowerCase().includes(searchJob.toLowerCase()) ||
      job.jobTitle?.toLowerCase().includes(searchJob.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchJob.toLowerCase()) ||
      (job.jobFormId?.recruitingPerson?.some(email =>
        email?.toLowerCase().includes(searchJob.toLowerCase()))
      );

    // Time filter - FIXED VERSION
    if (timeFilter === 'all') {
      return matchesSearch; // Show all jobs regardless of date
    }

    const jobDate = new Date(job.createdAt);
    const { startDate: startDateFilter, endDate: endDateFilter } = getDateRange();

    // If we have a valid date range, filter by it
    if (startDateFilter && endDateFilter) {
      const matchesTime = jobDate >= startDateFilter && jobDate <= endDateFilter;
      return matchesSearch && matchesTime;
    }

    // If no valid date range (e.g., custom selected but no dates), show all
    return matchesSearch;
  });

  // Function to get recruiter name from tenant ID
  const getRecruiterName = (tenantId) => {
    const recruiter = recruiters.find(r => r._id === tenantId);
    return recruiter ? recruiter.username || recruiter.email : 'Unknown';
  };

  if (loading && !refreshing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
        <Typography mt={2}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{
          p: 0,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          maxWidth: '100%',
          overflowX: 'hidden',
          marginRight: "50px"
        }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mr={6}>
            <Box>
              <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DashboardIcon fontSize="small" />
                Manage recruiters and job postings
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Filter</InputLabel>
                <Select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  label="Time Filter"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>

              {timeFilter === 'custom' && (
                <Box display="flex" gap={1} alignItems="center">
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150 }} />}
                  />
                  <Typography>-</Typography>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150 }} />}
                  />
                </Box>
              )}

              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    '&:hover': {
                      backgroundColor: theme.palette.grey[300]
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: theme.shadows[4]
                  },
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  mr: 1
                }}
              >
                Add Recruiter
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenVendorDialog(true)} // Changed from handleVendor()
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: theme.shadows[4]
                  },
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  mr: 1
                }}
              >
                Add Vendor
              </Button>
              <Button
                variant="outlined"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/dashboard/jobs/createJob')}
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    borderColor: theme.palette.primary.dark
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Create Job
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3} width={'25%'}>
              <Card sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(195deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                boxShadow: theme.shadows[4],
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}>
                <Box position="relative" zIndex={1}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Recruiters</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{recruiters.length}</Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">+{Math.floor(recruiters.length * 0.12)} from last month</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} width={'22%'}>
              <Card sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(195deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                color: 'white',
                boxShadow: theme.shadows[4],
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgala(255,255,255,0.1)'
                }
              }}>
                <Box position="relative" zIndex={1}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Jobs</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{jobs.length}</Typography>
                  <Box display="flex" alignItems="center">
                    <WorkIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">{Math.floor(jobs.length * 0.3)} new this month</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} width={'22%'}>
              <Card sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(195deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                color: 'white',
                boxShadow: theme.shadows[4],
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}>
                <Box position="relative" zIndex={1}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Jobs</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>
                    {activeJobs.length}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <ActiveIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {jobs.length > 0 ? Math.round((activeJobs.length / jobs.length) * 100) : 0}% of total
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} width={'22%'}>
              <Card sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(195deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                color: 'white',
                boxShadow: theme.shadows[4],
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgala(255,255,255,0.1)'
                }
              }}>
                <Box position="relative" zIndex={1}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Avg Jobs/Recruiter</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>
                    {avgJobsPerRecruiter}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <BarChartIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Across all recruiters</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4, }} >
            <Grid item xs={12} md={6} width={'47%'}>
              <Card sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[1],
                backgroundColor: theme.palette.background.paper
              }}>
                <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                  Recruiter Activity (Last 6 Months)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recruiterActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <ChartTooltip
                      contentStyle={{
                        borderRadius: 8,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="added" name="Recruiters Added" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="active" name="Active Recruiters" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} width={'47%'}>
              <Card sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[1],
                backgroundColor: theme.palette.background.paper
              }}>
                <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                  Job Status Distribution
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {jobStatusData.some(item => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {jobStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          formatter={(value, name) => [`${value} jobs`, name]}
                          contentStyle={{
                            borderRadius: 8,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2]
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No job data available
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Horizontal Layout */}
          <Grid container spacing={3} >
            {/* Left Column - Recruiters */}
            <Grid item xs={12} md={6} mr={6} width={'100%'}>
              <Card sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[1],
                backgroundColor: theme.palette.background.paper
              }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}

                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Typography variant="h5" fontWeight="600">Recruiters</Typography>
                  <TextField
                    size="small"
                    placeholder="Search recruiters..."
                    variant="outlined"
                    value={searchRecruiter}
                    onChange={(e) => setSearchRecruiter(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: 8,
                        backgroundColor: theme.palette.background.default
                      }
                    }}
                    sx={{ width: 300 }}
                  />
                </Box>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                  <Table stickyHeader>
                    <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRecruiters.length > 0 ? (
                        filteredRecruiters.map((recruiter) => (
                          <TableRow
                            key={recruiter._id}
                            hover
                            sx={{
                              '&:last-child td': { borderBottom: 0 },
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover
                              }
                            }}
                          >
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                {recruiter.profilePicture ? (
                                  <Avatar
                                    src={recruiter.profilePicture}
                                    sx={{ width: 40, height: 40, mr: 2 }}
                                  />
                                ) : (
                                  <Avatar
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      mr: 2,
                                      backgroundColor: theme.palette.primary.main,
                                      color: 'white'
                                    }}
                                  >
                                    {recruiter.username?.charAt(0)?.toUpperCase() || recruiter.email.charAt(0).toUpperCase()}
                                  </Avatar>
                                )}
                                <Box>
                                  <Typography fontWeight="500">{recruiter.username || 'No Name'}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {recruiter.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {recruiter.phoneNumber || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={<ExperienceIcon />}
                                label={`${recruiter.experience || 0} yrs`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: theme.palette.info.main,
                                  color: theme.palette.info.dark
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={recruiter.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                sx={{
                                  backgroundColor: recruiter.isActive ? theme.palette.success.light : theme.palette.error.light,
                                  color: recruiter.isActive ? theme.palette.success.dark : theme.palette.error.dark,
                                  fontWeight: 500
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box display="flex" justifyContent="flex-end" gap={1}>
                                <Tooltip title="Resend Welcome Email">
                                  <IconButton
                                    onClick={() => handleResendWelcomeEmail(recruiter._id)}
                                    size="small"
                                    sx={{
                                      backgroundColor: theme.palette.action.hover,
                                      color: theme.palette.info.main,
                                      '&:hover': {
                                        backgroundColor: theme.palette.info.main,
                                        color: 'white'
                                      }
                                    }}
                                  >
                                    <EmailIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Recruiter">
                                  <IconButton
                                    onClick={() => handleOpenDialog(recruiter)}
                                    size="small"
                                    sx={{
                                      backgroundColor: theme.palette.action.hover,
                                      color: theme.palette.secondary.main,
                                      '&:hover': {
                                        backgroundColor: theme.palette.secondary.main,
                                        color: 'white'
                                      }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Recruiter">
                                  <IconButton
                                    onClick={() => handleDelete(recruiter._id)}
                                    size="small"
                                    sx={{
                                      backgroundColor: theme.palette.action.hover,
                                      color: theme.palette.error.main,
                                      '&:hover': {
                                        backgroundColor: theme.palette.error.main,
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              No recruiters found
                            </Typography>
                            <Button
                              variant="text"
                              startIcon={<AddIcon />}
                              onClick={() => handleOpenDialog()}
                              sx={{ mt: 1 }}
                            >
                              Add New Recruiter
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Right Column - Jobs */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  backgroundColor: theme.palette.background.paper,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Job Postings
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search jobs..."
                    variant="outlined"
                    value={searchJob}
                    onChange={(e) => setSearchJob(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: 8,
                        backgroundColor: theme.palette.background.default,
                      },
                    }}
                    sx={{ width: 250 }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
                  <Grid container spacing={2}>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => {
                        const targetHireDate = job.jobFormId?.targetHireDate
                          ? new Date(job.jobFormId.targetHireDate).toLocaleDateString()
                          : "Not set";
                        const isActive =
                          job.status === "Active" &&
                          (!job.jobFormId?.targetHireDate ||
                            new Date(job.jobFormId.targetHireDate) >= new Date());
                        const recruiterName = getRecruiterName(job.userId);

                        return (
                          <Grid item xs={12} sm={6} md={6} key={job._id}>
                            <Card
                              sx={{
                                p: 2.5,
                                borderRadius: 2,
                                borderLeft: `4px solid ${isActive
                                    ? theme.palette.success.main
                                    : theme.palette.error.main
                                  }`,
                                "&:hover": {
                                  boxShadow: theme.shadows[6],
                                  transform: "translateY(-4px)",
                                },
                                transition: "all 0.25s ease-in-out",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  fontWeight="600"
                                  gutterBottom
                                  sx={{ color: theme.palette.text.primary }}
                                >
                                  {job.jobTitle}
                                </Typography>

                                <Box
                                  display="flex"
                                  alignItems="center"
                                  flexWrap="wrap"
                                  gap={1}
                                  mb={2}
                                >
                                  <Chip
                                    label={job.department}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderColor: theme.palette.primary.main,
                                      color: theme.palette.primary.dark,
                                    }}
                                  />
                                  <Chip
                                    label={job.jobFormId?.jobType || "Full-time"}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderColor: theme.palette.secondary.main,
                                      color: theme.palette.secondary.dark,
                                    }}
                                  />
                                  <Chip
                                    label={job.status}
                                    size="small"
                                    sx={{
                                      backgroundColor: isActive
                                        ? theme.palette.success.light
                                        : theme.palette.error.light,
                                      color: isActive
                                        ? theme.palette.success.dark
                                        : theme.palette.error.dark,
                                      fontWeight: 500,
                                    }}
                                  />
                                </Box>

                                <Box display="flex" flexDirection="column" gap={1}>
                                  <Typography variant="body2" color="text.secondary">
                                    <Box component="span" fontWeight="500">
                                      Job ID:
                                    </Box>{" "}
                                    {job.jobName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <Box component="span" fontWeight="500">
                                      Openings:
                                    </Box>{" "}
                                    {job.jobFormId?.openings || 0}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <Box component="span" fontWeight="500">
                                      Target Hire:
                                    </Box>{" "}
                                    {targetHireDate}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <Box component="span" fontWeight="500">
                                      Created by:
                                    </Box>{" "}
                                    {recruiterName}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box textAlign="right" mt={2}>
                                <Typography variant="caption" color="text.secondary">
                                  Created: {new Date(job.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Card>
                          </Grid>
                        );
                      })
                    ) : (
                      <Grid item xs={12}>
                        <Box textAlign="center" py={4}>
                          <Typography variant="body1" color="text.secondary">
                            No jobs found
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Add/Edit Recruiter Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 3,
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[5]
              }
            }}
          >
            <DialogTitle sx={{
              fontWeight: 700,
              p: 0,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PeopleIcon color="primary" />
              {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
            </DialogTitle>
            <DialogContent sx={{ p: 0, mb: 3 }}>
              {/* Profile Picture Upload */}
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={profilePreview}
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 2,
                    backgroundColor: theme.palette.grey[200]
                  }}
                >
                  {!profilePreview && <PersonIcon sx={{ fontSize: 40 }} />}
                </Avatar>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {profileImage && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {profileImage.name}
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={newRecruiter.username}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, username: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 8
                  }
                }}
                disabled={saving}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={newRecruiter.email}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 8
                  }
                }}
                disabled={saving}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                type="tel"
                value={newRecruiter.phoneNumber}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, phoneNumber: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 8
                  }
                }}
                disabled={saving}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Experience (years)"
                type="number"
                value={newRecruiter.experience}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, experience: parseInt(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ExperienceIcon color="action" />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 8
                  }
                }}
                disabled={saving}
                inputProps={{ min: 0, max: 50 }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 0 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                disabled={saving}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRecruiter}
                variant="contained"
                disabled={saving}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: 'none'
                  }
                }}
              >
                {saving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editingId ? (
                  'Update Recruiter'
                ) : (
                  'Add Recruiter'
                )}
              </Button>
            </DialogActions>
          </Dialog>


          <Dialog
        open={openVendorDialog}
        onClose={() => !vendorInviteLoading && setOpenVendorDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[5]
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          p: 0, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EmailIcon color="primary" />
          Invite Vendor
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, mb: 3 }}>
          {vendorInviteSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Vendor invitation sent successfully! The vendor will receive an email with registration instructions.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Enter the vendor's email address to send an invitation. They will receive a link to register as a vendor.
              </Typography>
              
              <TextField
                fullWidth
                margin="normal"
                label="Vendor Email"
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 8
                  }
                }}
                disabled={vendorInviteLoading}
                placeholder="vendor@example.com"
              />
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 0 }}>
          {!vendorInviteSuccess && (
            <Button 
              onClick={() => setOpenVendorDialog(false)}
              variant="outlined"
              disabled={vendorInviteLoading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              Cancel
            </Button>
          )}
          
          {!vendorInviteSuccess ? (
            <Button 
              onClick={handleInviteVendor}
              variant="contained"
              disabled={vendorInviteLoading || !vendorEmail.trim()}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: 'none'
                }
              }}
            >
              {vendorInviteLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Invitation'
              )}
            </Button>
          ) : (
            <Button 
              onClick={() => {
                setOpenVendorDialog(false);
                setVendorEmail('');
                setVendorInviteSuccess(false);
              }}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: 'none'
                }
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

          {/* Welcome Dialog with Login Link */}
          <Dialog
            open={showWelcomeDialog}
            onClose={() => setShowWelcomeDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 3,
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[5]
              }
            }}
          >
            <DialogTitle sx={{
              fontWeight: 700,
              p: 0,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: theme.palette.success.main
            }}>
              <CheckCircleIcon color="success" />
              Recruiter Added Successfully!
            </DialogTitle>
            <DialogContent sx={{ p: 0, mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                A welcome email with login instructions has been sent to the recruiter's email address.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                You can also share this direct login link if needed:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  mt: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mr: 1
                  }}
                >
                  {newRecruiterLink}
                </Typography>
                <Tooltip title="Copy link">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(newRecruiterLink)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <LinkIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 0 }}>
              <Button
                onClick={() => setShowWelcomeDialog(false)}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: 'none'
                  }
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for feedback */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: theme.shadows[3]
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AdminDashboard;