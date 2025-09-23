

// import React, { useState, useEffect } from 'react';
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
//   CircularProgress,
//   Alert,
//   Button,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   Select,
//   Divider,
//   Tooltip,
//   useTheme,
//   Badge,
//   Avatar
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   DateRange as DateRangeIcon,
//   Refresh as RefreshIcon,
//   BarChart as BarChartIcon,
//   TrendingUp as TrendingUpIcon,
//   Work as WorkIcon,
//   People as PeopleIcon,
//   Business as BusinessIcon,
//   CheckCircle as ActiveIcon,
//   Cancel as InactiveIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { getJobs, createJob, deleteJob } from '../../services/recruiterService';
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer
// } from 'recharts';

// const RecruiterDashboard = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [jobToDelete, setJobToDelete] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [refreshing, setRefreshing] = useState(false);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [newJob, setNewJob] = useState({
//     jobName: '',
//     jobTitle: '',
//     department: '',
//     experience: '',
//     jobDesc: '',
//     status: 'Active'
//   });
//   const [formErrors, setFormErrors] = useState({});

//   // Sample data for charts
//   const jobStatusData = [
//     { name: 'Active', value: 75 },
//     { name: 'Closed', value: 25 },
//   ];

//   const jobTypeData = [
//     { name: 'Full-time', value: 60 },
//     { name: 'Part-time', value: 20 },
//     { name: 'Contract', value: 15 },
//     { name: 'Remote', value: 5 },
//   ];

//   const COLORS = [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main];

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const jobs = await getJobs();
//       setJobs(jobs);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to fetch jobs:', err);
//       setError(err.message || 'Failed to fetch jobs');
//       setJobs([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchJobs();
//   };

//   const filteredJobs = jobs.filter(job => {
//     const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     job.jobDesc.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalJobs = jobs.length;
//   const activeJobs = jobs.filter(j => j.status === 'Active').length;
//   const closedJobs = jobs.filter(j => j.status === 'Closed').length;

//   const handleViewJobsPage = () => {
//     navigate('/jobs');
//   };

//   const confirmDelete = (job) => {
//     setJobToDelete(job);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteJob = async () => {
//     try {
//       await deleteJob(jobToDelete._id);
//       setDeleteDialogOpen(false);
//       setJobs(jobs.filter(j => j._id !== jobToDelete._id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleAddDialogOpen = () => {
//     navigate('/dashboard/jobs/createJob');
//   };

//   const handleAddDialogClose = () => {
//     setAddDialogOpen(false);
//     setNewJob({
//       jobName: '',
//       jobTitle: '',
//       department: '',
//       experience: '',
//       jobDesc: '',
//       status: 'Active'
//     });
//     setFormErrors({});
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewJob(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!newJob.jobName.trim()) errors.jobName = 'Job name is required';
//     if (!newJob.jobTitle.trim()) errors.jobTitle = 'Job title is required';
//     if (!newJob.jobDesc.trim()) errors.jobDesc = 'Description is required';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         await createJob(newJob);
//         handleAddDialogClose();
//         fetchJobs();
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{
//       height: '100%', 
//       minHeight: '100vh',
//       marginRight:'40px',
//     //   backgroundColor: theme.palette.background.default,
//       backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
//     }}>
//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mr={6}>
//         <Box>
//           <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 0.5 }}>
//             Recruiter Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <WorkIcon fontSize="small" />
//             Manage job postings and candidate applications
//           </Typography>
//         </Box>
//         <Box display="flex" alignItems="center" gap={2}>
//           <Button
//             variant="contained"
//             startIcon={<RefreshIcon />}
//             onClick={handleRefresh}
//             disabled={refreshing}
//             sx={{
//               backgroundColor: theme.palette.grey[200],
//               color: theme.palette.text.primary,
//               '&:hover': {
//                 backgroundColor: theme.palette.grey[300]
//               }
//             }}
//           >
//             Refresh
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleAddDialogOpen}
//             sx={{
//               backgroundColor: theme.palette.primary.main,
//               color: 'white',
//               '&:hover': {
//                 backgroundColor: theme.palette.primary.dark,
//                 boxShadow: theme.shadows[4]
//               },
//               boxShadow: theme.shadows[2]
//             }}
//           >
//             New Job
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<PeopleIcon />}
//             onClick={handleViewJobsPage}
//             sx={{
//               borderColor: theme.palette.primary.main,
//               color: theme.palette.primary.main,
//               '&:hover': {
//                 backgroundColor: theme.palette.primary.light,
//                 borderColor: theme.palette.primary.dark
//               }
//             }}
//           >
//             View Jobs Page
//           </Button>
//         </Box>
//       </Box>

//       <Grid container spacing={3}  width={'100%'} >
//         {/* Left Column - 70% width */}
//         <Grid item xs={12} md={8}  width={'100%'}>
//           {/* Stats Cards */}
//           <Grid container spacing={3} sx={{ mb: 3 }}>
//             <Grid item xs={12} sm={4}  width={'31%'} >
//               <Card sx={{ 
//                 p: 2, 
//                 borderRadius: 3,
//                 background: `linear-gradient(195deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//                 color: 'white',
//                 boxShadow: theme.shadows[4],
//                 position: 'relative',
//                 overflow: 'hidden',
//                 '&:before': {
//                   content: '""',
//                   position: 'absolute',
//                   top: '-50px',
//                   right: '-50px',
//                   width: '120px',
//                   height: '120px',
//                   borderRadius: '50%',
//                   background: 'rgba(255,255,255,0.1)'
//                 }
//               }}>
//                 <Box position="relative" zIndex={1}>
//                   <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Jobs</Typography>
//                   <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{totalJobs}</Typography>
//                   <Box display="flex" alignItems="center">
//                     <TrendingUpIcon sx={{ mr: 1 }} />
//                     <Typography variant="body2">0</Typography>
//                   </Box>
//                 </Box>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={4}  width={'31%'}>
//               <Card sx={{ 
//                 p: 2, 

//                 height: '100%', 
//                 borderRadius: 3,
//                 background: `linear-gradient(195deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
//                 color: 'white',
//                 boxShadow: theme.shadows[4],
//                 position: 'relative',
//                 overflow: 'hidden',
//                 '&:before': {
//                   content: '""',
//                   position: 'absolute',
//                   top: '-50px',
//                   right: '-50px',
//                   width: '120px',
//                   height: '120px',
//                   borderRadius: '50%',
//                   background: 'rgba(255,255,255,0.1)'
//                 }
//               }}>
//                 <Box position="relative" zIndex={1} width={180}>
//                   <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Jobs</Typography>
//                   <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{activeJobs}</Typography>
//                   <Box display="flex" alignItems="center">
//                     <ActiveIcon sx={{ mr: 1 }} />
//                     {/* <Typography variant="body2">{Math.round((activeJobs/totalJobs)*100)}% of total</Typography> */}
//                                         <Typography variant="body2">0</Typography>

//                   </Box>
//                 </Box>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={4}  width={'31%'}>
//               <Card sx={{ 
//                 p: 2, 
//                 height: '100%', 
//                 borderRadius: 3,
//                 background: `linear-gradient(195deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
//                 color: 'white',
//                 boxShadow: theme.shadows[4],
//                 position: 'relative',
//                 overflow: 'hidden',
//                 '&:before': {
//                   content: '""',
//                   position: 'absolute',
//                   top: '-50px',
//                   right: '-50px',
//                   width: '120px',
//                   height: '120px',
//                   borderRadius: '50%',
//                   background: 'rgba(255,255,255,0.1)'
//                 }
//               }}>
//                 <Box position="relative" zIndex={1} width={180}>
//                   <Typography variant="body2" sx={{ opacity: 0.8 }}>Closed Jobs</Typography>
//                   <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{closedJobs}</Typography>
//                   <Box display="flex" alignItems="center">
//                     <InactiveIcon sx={{ mr: 1 }} />
//                     {/* <Typography variant="body2">{Math.round((closedJobs/totalJobs)*100)}% of total</Typography> */}
//                                         <Typography variant="body2">0</Typography>

//                   </Box>
//                 </Box>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* Search and Filter Row */}
//           <Card sx={{ 
//             p: 2, 
//             mb: 3, 
//             mr:5,
//             borderRadius: 3,
//             boxShadow: theme.shadows[1],
//             backgroundColor: theme.palette.background.paper,
//             border: `1px solid ${theme.palette.divider}`
//           }}>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} md={8} width={'65%'}>
//                 <TextField
//                   fullWidth
//                   placeholder="Search jobs by title or description..."
//                   variant="outlined"
//                   size="small"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
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
//                 />
//               </Grid>
//               <Grid item xs={12} md={4} width={'30%'}>
//                 <TextField
//                   select
//                   fullWidth
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   size="small"
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <FilterIcon color="action" fontSize="small" />
//                       </InputAdornment>
//                     ),
//                     style: {
//                       borderRadius: 8,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 >
//                   <MenuItem value="all">All Status</MenuItem>
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Closed">Closed</MenuItem>
//                 </TextField>
//               </Grid>
//             </Grid>
//           </Card>

//           {/* Jobs Table */}
//           <Card sx={{ 
//             p: 0, 
//             mr:5,
//             borderRadius: 3,
//             boxShadow: theme.shadows[1],
//             backgroundColor: theme.palette.background.paper,
//             border: `1px solid ${theme.palette.divider}`,
//             overflow: 'hidden'
//           }}>
//             <Box 
//               display="flex" 
//               justifyContent="space-between" 
//               alignItems="center" 
//               p={3}
//               sx={{
//                 borderBottom: `1px solid ${theme.palette.divider}`
//               }}
//             >
//               <Typography variant="h6" fontWeight="600">Job Listings</Typography>
//               <Box display="flex" alignItems="center" gap={1}>
//                 <Typography variant="body2" color="text.secondary">
//                   Showing {filteredJobs.length} of {jobs.length} jobs
//                 </Typography>
//                 <Chip 
//                   label={`${Math.round((filteredJobs.length/jobs.length)*100)}%`} 
//                   size="small" 
//                   sx={{ 
//                     backgroundColor: theme.palette.action.selected,
//                     fontWeight: 500
//                   }} 
//                 />
//               </Box>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
//                     <TableCell sx={{ fontWeight: 600 }}>Job Name</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredJobs.map((job) => (
//                     <TableRow 
//                       key={job._id} 
//                       hover
//                       sx={{ 
//                         '&:last-child td': { borderBottom: 0 },
//                         opacity: job.status === 'Active' ? 1 : 0.9,
//                         '&:hover': {
//                           backgroundColor: theme.palette.action.hover
//                         }
//                       }}
//                     >
//                       <TableCell>
//                         <Typography fontWeight="600">{job.jobName}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography>{job.jobTitle}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography>{job.department}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography>{job.experience}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={job.status}
//                           size="small"
//                           sx={{
//                             backgroundColor: job.status === 'Active' ? 
//                               theme.palette.success.light : 
//                               theme.palette.error.light,
//                             color: job.status === 'Active' ? 
//                               theme.palette.success.dark : 
//                               theme.palette.error.dark,
//                             fontWeight: 500
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="right">
//                         <Box display="flex" justifyContent="flex-end" gap={1}>
//                           <Tooltip title="View Details">
//                             <IconButton
//                               size="small"
//                               sx={{
//                                 backgroundColor: theme.palette.action.hover,
//                                 color: theme.palette.primary.main,
//                                 '&:hover': {
//                                   backgroundColor: theme.palette.primary.main,
//                                   color: 'white'
//                                 }
//                               }}
//                             >
//                               <VisibilityIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete Job">
//                             <IconButton
//                               onClick={() => confirmDelete(job)}
//                               size="small"
//                               sx={{
//                                 backgroundColor: theme.palette.action.hover,
//                                 color: theme.palette.error.main,
//                                 '&:hover': {
//                                   backgroundColor: theme.palette.error.main,
//                                   color: 'white'
//                                 }
//                               }}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Card>
//         </Grid>

//         {/* Right Column - 30% width */}
//         <Grid item xs={12} md={4} mr={3} display={'flex'} gap={'35px'} flexDirection={'row'} width={'100%'}>
//           {/* Job Status Distribution */}
//           <Card sx={{ 
//             p: 3,
//             width:'48%', 
//             mb: 3,
//             height: 320,
//             borderRadius: 3,
//             boxShadow: theme.shadows[1],
//             backgroundColor: theme.palette.background.paper,
//             border: `1px solid ${theme.palette.divider}`
//           }}>
//             <Typography variant="h6" fontWeight="600" mb={2}>Job Status Distribution</Typography>
//             <Box height={250}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={jobStatusData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {jobStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <ChartTooltip 
//                     contentStyle={{
//                       borderRadius: 8,
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       boxShadow: theme.shadows[2]
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Box>
//           </Card>

//           {/* Job Type Distribution */}
//           <Card sx={{ 
//             width:'48%',
//             p: 1, 
//             mb: 3,
//             height: 320,
//             borderRadius: 3,
//             boxShadow: theme.shadows[1],
//             backgroundColor: theme.palette.background.paper,
//             border: `1px solid ${theme.palette.divider}`
//           }}>
//             <Typography variant="h6" fontWeight="600" mb={2}>Job Type Distribution</Typography>
//             <Box height={250}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={jobTypeData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {jobTypeData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <ChartTooltip 
//                     contentStyle={{
//                       borderRadius: 8,
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       boxShadow: theme.shadows[2]
//                     }}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Box>
//           </Card>
// </Grid>
//           {/* Quick Actions */}
//           <Card sx={{ 
//             p: 3,
//             mr:4,
//             width:'100%',
//             borderRadius: 3,
//             boxShadow: theme.shadows[1],
//             backgroundColor: theme.palette.background.paper,
//             border: `1px solid ${theme.palette.divider}`
//           }}>
//             <Typography variant="h6" fontWeight="600" mb={2}>Quick Actions</Typography>
//             <Grid container spacing={2} >
//               <Grid item xs={12} width={'60%'} ml={'15px'}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={handleAddDialogOpen}
//                   sx={{
//                     py: 1.5,
//                     borderRadius: 2,
//                     backgroundColor: theme.palette.primary.main,
//                     '&:hover': {
//                       backgroundColor: theme.palette.primary.dark,
//                       boxShadow: theme.shadows[2]
//                     },
//                     boxShadow: theme.shadows[1]
//                   }}
//                 >
//                   Post New Job
//                 </Button>
//               </Grid>
//               <Grid item xs={12} width={'30%'}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<PeopleIcon />}
//                   onClick={handleViewJobsPage}
//                   sx={{
//                     py: 1.5,
//                     borderRadius: 2,
//                     borderColor: theme.palette.divider,
//                     '&:hover': {
//                       backgroundColor: theme.palette.action.hover,
//                       borderColor: theme.palette.primary.main
//                     }
//                   }}
//                 >
//                   View Jobs Page
//                 </Button>
//               </Grid>
//             </Grid>
//           </Card>
//         </Grid>
    

//       {/* Add Job Dialog */}
//       <Dialog
//         open={addDialogOpen}
//         onClose={handleAddDialogClose}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             p: 3,
//             background: theme.palette.background.paper,
//             boxShadow: theme.shadows[5]
//           }
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 3 }}>Create New Job Posting</DialogTitle>
//         <form onSubmit={handleSubmit}>
//           <DialogContent sx={{ p: 0 }}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Job Name"
//                   name="jobName"
//                   value={newJob.jobName}
//                   onChange={handleInputChange}
//                   error={!!formErrors.jobName}
//                   helperText={formErrors.jobName}
//                   variant="outlined"
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Job Title"
//                   name="jobTitle"
//                   value={newJob.jobTitle}
//                   onChange={handleInputChange}
//                   error={!!formErrors.jobTitle}
//                   helperText={formErrors.jobTitle}
//                   variant="outlined"
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Department"
//                   name="department"
//                   value={newJob.department}
//                   onChange={handleInputChange}
//                   variant="outlined"
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Experience Required"
//                   name="experience"
//                   value={newJob.experience}
//                   onChange={handleInputChange}
//                   variant="outlined"
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Job Description"
//                   name="jobDesc"
//                   value={newJob.jobDesc}
//                   onChange={handleInputChange}
//                   error={!!formErrors.jobDesc}
//                   helperText={formErrors.jobDesc}
//                   variant="outlined"
//                   multiline
//                   rows={4}
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Status"
//                   name="status"
//                   value={newJob.status}
//                   onChange={handleInputChange}
//                   variant="outlined"
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.default
//                     }
//                   }}
//                 >
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Closed">Closed</MenuItem>
//                 </TextField>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 0, mt: 3 }}>
//             <Button 
//               onClick={handleAddDialogClose}
//               variant="outlined"
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
//               type="submit"
//               variant="contained"
//               sx={{
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 px: 3,
//                 py: 1,
//                 backgroundColor: theme.palette.primary.main,
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.dark,
//                   boxShadow: theme.shadows[1]
//                 }
//               }}
//             >
//               Create Job
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             padding: 3,
//             minWidth: 500,
//             background: theme.palette.background.paper,
//             boxShadow: theme.shadows[5]
//           }
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 2 }}>Confirm Job Deletion</DialogTitle>
//         <DialogContent sx={{ p: 0, mb: 3 }}>
//           <Typography>
//             Are you sure you want to permanently delete the job <strong>{jobToDelete?.jobTitle}</strong>?
//           </Typography>
//           <Typography variant="body2" color="error" mt={2}>
//             <strong>Warning:</strong> This action cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 0 }}>
//           <Button 
//             onClick={() => setDeleteDialogOpen(false)}
//             variant="outlined"
//             sx={{
//               borderRadius: 2,
//               textTransform: 'none',
//               px: 3,
//               py: 1,
//               borderColor: theme.palette.divider,
//               '&:hover': {
//                 borderColor: theme.palette.primary.main
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleDeleteJob} 
//             variant="contained"
//             color="error"
//             sx={{
//               borderRadius: 2,
//               textTransform: 'none',
//               px: 3,
//               py: 1,
//               boxShadow: 'none',
//               '&:hover': {
//                 backgroundColor: theme.palette.error.dark,
//                 boxShadow: 'none'
//               }
//             }}
//           >
//             Delete Permanently
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default RecruiterDashboard; 



import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Divider,
  Tooltip,
  useTheme,
  Badge,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getJobs, createJob, deleteJob } from '../../services/recruiterService';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer
} from 'recharts';

const RecruiterDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    jobName: '',
    jobTitle: '',
    department: '',
    experience: '',
    jobDesc: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Calculate job status data based on real API response
  const getJobStatusData = () => {
    if (!jobs || jobs.length === 0) return [];
    
    const statusCounts = {};
    
    // Count jobs by status
    jobs.forEach(job => {
      const status = job.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Convert to array format for the chart
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Calculate job type data based on real API response
  const getJobTypeData = () => {
    if (!jobs || jobs.length === 0) return [];
    
    const typeCounts = {};
    
    // Count jobs by type
    jobs.forEach(job => {
      const type = job.jobFormId?.jobType || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    // Convert to array format for the chart
    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const COLORS = [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobs = await getJobs();
      setJobs(jobs);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err.message || 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.jobDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const closedJobs = jobs.filter(j => j.status === 'Closed').length;

  const handleViewJobsPage = () => {
    navigate('/jobs');
  };

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    try {
      await deleteJob(jobToDelete._id);
      setDeleteDialogOpen(false);
      setJobs(jobs.filter(j => j._id !== jobToDelete._id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddDialogOpen = () => {
    navigate('/dashboard/jobs/createJob');
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewJob({
      jobName: '',
      jobTitle: '',
      department: '',
      experience: '',
      jobDesc: '',
      status: 'Active'
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newJob.jobName.trim()) errors.jobName = 'Job name is required';
    if (!newJob.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!newJob.jobDesc.trim()) errors.jobDesc = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await createJob(newJob);
        handleAddDialogClose();
        fetchJobs();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{
      height: '100%', 
      minHeight: '100vh',
      marginRight:'40px',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
    }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mr={6}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 0.5 }}>
            Recruiter Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon fontSize="small" />
            Manage job postings and candidate applications
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.grey[300]
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDialogOpen}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: theme.shadows[4]
              },
              boxShadow: theme.shadows[2]
            }}
          >
            New Job
          </Button>
          <Button
            variant="outlined"
            startIcon={<PeopleIcon />}
            onClick={handleViewJobsPage}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.dark
              }
            }}
          >
            View Jobs Page
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} width={'100%'} >
        {/* Left Column - 70% width */}
        <Grid item xs={12} md={8} width={'100%'}>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4} width={'31%'} >
              <Card sx={{ 
                p: 2, 
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
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Jobs</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{totalJobs}</Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">0</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} width={'31%'}>
              <Card sx={{ 
                p: 2, 
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
                  background: 'rgba(255,255,255,0.1)'
                }
              }}>
                <Box position="relative" zIndex={1} width={180}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Jobs</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{activeJobs}</Typography>
                  <Box display="flex" alignItems="center">
                    <ActiveIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">{totalJobs > 0 ? Math.round((activeJobs/totalJobs)*100) : 0}% of total</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} width={'31%'}>
              <Card sx={{ 
                p: 2, 
                height: '100%', 
                borderRadius: 3,
                background: `linear-gradient(195deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
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
                <Box position="relative" zIndex={1} width={180}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Closed Jobs</Typography>
                  <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{closedJobs}</Typography>
                  <Box display="flex" alignItems="center">
                    <InactiveIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">{totalJobs > 0 ? Math.round((closedJobs/totalJobs)*100) : 0}% of total</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filter Row */}
          <Card sx={{ 
            p: 2, 
            mb: 3, 
            mr:5,
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8} width={'65%'}>
                <TextField
                  fullWidth
                  placeholder="Search jobs by title or description..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                />
              </Grid>
              <Grid item xs={12} md={4} width={'30%'}>
                <TextField
                  select
                  fullWidth
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    style: {
                      borderRadius: 8,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Card>

          {/* Jobs Table */}
          <Card sx={{ 
            p: 0, 
            mr:5,
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
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
              <Typography variant="h6" fontWeight="600">Job Listings</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </Typography>
                <Chip 
                  label={`${jobs.length > 0 ? Math.round((filteredJobs.length/jobs.length)*100) : 0}%`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: theme.palette.action.selected,
                    fontWeight: 500
                  }} 
                />
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                    <TableCell sx={{ fontWeight: 600 }}>Job Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow 
                      key={job._id} 
                      hover
                      sx={{ 
                        '&:last-child td': { borderBottom: 0 },
                        opacity: job.status === 'Active' ? 1 : 0.9,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="600">{job.jobName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{job.jobTitle}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{job.department}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{job.experience}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.status}
                          size="small"
                          sx={{
                            backgroundColor: job.status === 'Active' ? 
                              theme.palette.success.light : 
                              theme.palette.error.light,
                            color: job.status === 'Active' ? 
                              theme.palette.success.dark : 
                              theme.palette.error.dark,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.primary.main,
                                  color: 'white'
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Job">
                            <IconButton
                              onClick={() => confirmDelete(job)}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Right Column - 30% width */}
        <Grid item xs={12} md={4} mr={3} display={'flex'} gap={'35px'} flexDirection={'row'} width={'100%'}>
          {/* Job Status Distribution */}
          <Card sx={{ 
            p: 3,
            width:'48%', 
            mb: 3,
            height: 320,
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="h6" fontWeight="600" mb={2}>Job Status Distribution</Typography>
            <Box height={250}>
              {getJobStatusData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getJobStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getJobStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      contentStyle={{
                        borderRadius: 8,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2]
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="body2" color="text.secondary">
                    No job data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>

          {/* Job Type Distribution */}
          <Card sx={{ 
            width:'48%',
            p: 3, 
            mb: 3,
            height: 320,
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="h6" fontWeight="600" mb={2}>Job Type Distribution</Typography>
            <Box height={250}>
              {getJobTypeData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getJobTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getJobTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip 
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
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="body2" color="text.secondary">
                    No job data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ 
          p: 3,
          mr:4,
          width:'100%',
          borderRadius: 3,
          boxShadow: theme.shadows[1],
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" fontWeight="600" mb={2}>Quick Actions</Typography>
          <Grid container spacing={2} >
            <Grid item xs={12} width={'60%'} ml={'15px'}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: theme.shadows[2]
                  },
                  boxShadow: theme.shadows[1]
                }}
              >
                Post New Job
              </Button>
            </Grid>
            <Grid item xs={12} width={'30%'}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={handleViewJobsPage}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                View Jobs Page
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Add Job Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
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
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 3 }}>Create New Job Posting</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Name"
                  name="jobName"
                  value={newJob.jobName}
                  onChange={handleInputChange}
                  error={!!formErrors.jobName}
                  helperText={formErrors.jobName}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={newJob.jobTitle}
                  onChange={handleInputChange}
                  error={!!formErrors.jobTitle}
                  helperText={formErrors.jobTitle}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={newJob.department}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Experience Required"
                  name="experience"
                  value={newJob.experience}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="jobDesc"
                  value={newJob.jobDesc}
                  onChange={handleInputChange}
                  error={!!formErrors.jobDesc}
                  helperText={formErrors.jobDesc}
                  variant="outlined"
                  multiline
                  rows={4}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={newJob.status}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 0, mt: 3 }}>
            <Button 
              onClick={handleAddDialogClose}
              variant="outlined"
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
              type="submit"
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[1]
                }
              }}
            >
              Create Job
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 3,
            minWidth: 500,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[5]
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 2 }}>Confirm Job Deletion</DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography>
            Are you sure you want to permanently delete the job <strong>{jobToDelete?.jobTitle}</strong>?
          </Typography>
          <Typography variant="body2" color="error" mt={2}>
            <strong>Warning:</strong> This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
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
            onClick={handleDeleteJob} 
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
                boxShadow: 'none'
              }
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruiterDashboard;