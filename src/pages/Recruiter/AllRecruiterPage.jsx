// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     Button,
//     IconButton,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Checkbox,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Select,
//     ToggleButton,
//     ToggleButtonGroup,
//     Avatar,
//     TextField,
//     Chip,
//     Dialog,
//     Menu,
//     ListItemIcon,
//     ListItemText,
//     CircularProgress,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Divider,
//     Snackbar,
//     Alert,
//     Tooltip,
//     useMediaQuery,
//     useTheme,
//     Drawer,
//     Fab,
//     Badge,
//     Stack,
//     Grid,
//     InputAdornment,
//     LinearProgress,
//     Rating,
// } from "@mui/material";
// import {
//     ViewModule as CardViewIcon,
//     ViewHeadline as TableViewIcon,
//     FilterList as FilterIcon,
//     MoreVert as MoreIcon,
//     Person as PersonIcon,
//     Email as EmailIcon,
//     Phone as PhoneIcon,
//     Work as WorkIcon,
//     Business as BusinessIcon,
//     CalendarToday as CalendarIcon,
//     Assignment as AssignmentIcon,
//     CheckCircle as CheckCircleIcon,
//     Schedule as ScheduleIcon,
//     TrendingUp as TrendingUpIcon,
//     School as SchoolIcon,
//     LocationOn as LocationIcon,
//     Search as SearchIcon,
//     Close as CloseIcon,
//     ArrowBack as ArrowBackIcon,
//     Add as AddIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     Star as StarIcon,
//     StarBorder as StarBorderIcon,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import adminService from "../../services/adminService";
// import { useUser } from "../../contexts/UserContext";

// // Blue color palette
// const colors = {
//     primary: {
//         main: '#1976D2',
//         light: '#42A5F5',
//         dark: '#1565C0',
//         gradient: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
//         bg: '#E3F2FD',
//     },
//     secondary: {
//         main: '#0288D1',
//         light: '#4FC3F7',
//         dark: '#01579B',
//         gradient: 'linear-gradient(135deg, #0288D1 0%, #29B6F6 100%)',
//         bg: '#E1F5FE',
//     },
//     success: {
//         main: '#10B981',
//         light: '#34D399',
//         dark: '#059669',
//         bg: '#ECFDF5',
//     },
//     warning: {
//         main: '#F59E0B',
//         light: '#FBBF24',
//         dark: '#D97706',
//         bg: '#FFFBEB',
//     },
//     error: {
//         main: '#EF4444',
//         light: '#F87171',
//         dark: '#DC2626',
//         bg: '#FEF2F2',
//     },
//     info: {
//         main: '#1976D2',
//         light: '#42A5F5',
//         dark: '#1565C0',
//         bg: '#E3F2FD',
//     },
//     neutral: {
//         50: '#F9FAFB',
//         100: '#F3F4F6',
//         200: '#E5E7EB',
//         300: '#D1D5DB',
//         400: '#9CA3AF',
//         500: '#6B7280',
//         600: '#4B5563',
//         700: '#374151',
//         800: '#1F2937',
//         900: '#111827',
//     }
// };

// // Edit Recruiter Dialog Component (removed department)
// const EditRecruiterDialog = ({ open, onClose, onEdit, recruiter }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         experience: '',
//         isActive: true,
//     });
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (recruiter) {
//             setFormData({
//                 firstName: recruiter.firstName || '',
//                 lastName: recruiter.lastName || '',
//                 email: recruiter.email || '',
//                 phone: recruiter.phone || '',
//                 experience: recruiter.experience || '',
//                 isActive: recruiter.isActive !== undefined ? recruiter.isActive : true,
//             });
//         }
//     }, [recruiter]);

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             await onEdit(recruiter._id, formData);
//             onClose();
//         } catch (error) {
//             console.error('Error editing recruiter:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!recruiter) return null;

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth="md"
//             fullWidth
//             fullScreen={isMobile}
//             PaperProps={{
//                 sx: {
//                     borderRadius: { xs: 0, sm: 3 },
//                     maxHeight: '90vh',
//                 }
//             }}
//         >
//             <DialogTitle sx={{
//                 background: colors.primary.gradient,
//                 color: 'white',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <EditIcon />
//                     <Typography variant={isMobile ? "subtitle1" : "h6"}>
//                         Edit Recruiter
//                     </Typography>
//                 </Box>
//                 <IconButton edge="end" color="inherit" onClick={onClose}>
//                     <CloseIcon />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent dividers sx={{ p: isMobile ? 2 : 3, bgcolor: colors.neutral[50] }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="First Name"
//                             value={formData.firstName}
//                             onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                             required
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Last Name"
//                             value={formData.lastName}
//                             onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                             required
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             type="email"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             required
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Phone"
//                             value={formData.phone}
//                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Experience (years)"
//                             type="number"
//                             value={formData.experience}
//                             onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                             size="small"
//                         />
//                     </Grid>
               
//                     <Grid item xs={12}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Status</InputLabel>
//                             <Select
//                                 value={formData.isActive}
//                                 onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
//                                 label="Status"
//                             >
//                                 <MenuItem value={true}>Active</MenuItem>
//                                 <MenuItem value={false}>Inactive</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                 </Grid>
//             </DialogContent>
//             <DialogActions sx={{ p: 2, bgcolor: colors.neutral[50] }}>
//                 <Button onClick={onClose}>Cancel</Button>
//                 <Button
//                     onClick={handleSubmit}
//                     variant="contained"
//                     disabled={loading || !formData.firstName || !formData.lastName || !formData.email}
//                     sx={{
//                         background: colors.primary.gradient,
//                         color: 'white',
//                     }}
//                 >
//                     {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // Delete Confirmation Dialog
// const DeleteConfirmationDialog = ({ open, onClose, onConfirm, recruiterName, loading }) => {
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
//             <DialogTitle sx={{ background: colors.error.bg, color: colors.error.dark }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <DeleteIcon />
//                     <Typography variant="h6">Delete Recruiter</Typography>
//                 </Box>
//             </DialogTitle>
//             <DialogContent sx={{ mt: 2 }}>
//                 <Typography variant="body1">
//                     Are you sure you want to delete <strong>{recruiterName}</strong>?
//                 </Typography>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} disabled={loading}>Cancel</Button>
//                 <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
//                     {loading ? <CircularProgress size={24} /> : 'Delete'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // Recruiter Details Dialog Component (removed department)
// const RecruiterDetailsDialog = ({ open, onClose, recruiter, onEditClick }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
//     if (!recruiter) return null;

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth="md"
//             fullWidth
//             fullScreen={isMobile}
//         >
//             <DialogTitle sx={{ background: colors.primary.gradient, color: 'white' }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <PersonIcon />
//                         <Typography variant={isMobile ? "subtitle1" : "h6"}>
//                             Recruiter Details
//                         </Typography>
//                     </Box>
//                     <IconButton edge="end" color="inherit" onClick={onClose}>
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//             </DialogTitle>
//             <DialogContent dividers>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} display="flex" alignItems="center" gap={2}>
//                         <Avatar sx={{ width: 80, height: 80, background: colors.secondary.gradient }}>
//                             {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
//                         </Avatar>
//                         <Box>
//                             <Typography variant="h5">{recruiter.firstName} {recruiter.lastName}</Typography>
//                             <Typography color="textSecondary">{recruiter.email}</Typography>
//                             <Box display="flex" gap={1} mt={1}>
//                                 <Chip label={recruiter.role || 'Recruiter'} size="small" />
//                                 {recruiter.isActive && (
//                                     <Chip label="Active" size="small" color="success" />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Grid>

//                     <Grid item xs={12}>
//                         <Divider />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="primary" gutterBottom>
//                             Contact Information
//                         </Typography>
//                         <Stack spacing={1}>
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <EmailIcon fontSize="small" color="primary" />
//                                 <Typography>{recruiter.email}</Typography>
//                             </Box>
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <PhoneIcon fontSize="small" color="primary" />
//                                 <Typography>{recruiter.phone || 'Not provided'}</Typography>
//                             </Box>
//                         </Stack>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="primary" gutterBottom>
//                             Professional Information
//                         </Typography>
//                         <Stack spacing={1}>
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <WorkIcon fontSize="small" color="primary" />
//                                 <Typography>Experience: {recruiter.experience || '0'} years</Typography>
//                             </Box>
//                         </Stack>
//                     </Grid>

//                     {recruiter.recentActivity && recruiter.recentActivity.length > 0 && (
//                         <>
//                             <Grid item xs={12}>
//                                 <Divider />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Typography variant="subtitle2" color="primary" gutterBottom>
//                                     Recent Activity
//                                 </Typography>
//                                 <Stack spacing={1}>
//                                     {recruiter.recentActivity.map((activity, index) => (
//                                         <Box key={index} display="flex" alignItems="center" gap={1}>
//                                             <ScheduleIcon fontSize="small" color="disabled" />
//                                             <Typography variant="body2">
//                                                 {activity.description} - {new Date(activity.date).toLocaleDateString()}
//                                             </Typography>
//                                         </Box>
//                                     ))}
//                                 </Stack>
//                             </Grid>
//                         </>
//                     )}
//                 </Grid>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Close</Button>
//                 <Button
//                     variant="contained"
//                     startIcon={<EditIcon />}
//                     onClick={() => {
//                         onClose();
//                         onEditClick(recruiter);
//                     }}
//                 >
//                     Edit Recruiter
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // Add Recruiter Dialog Component (removed department)
// const AddRecruiterDialog = ({ open, onClose, onAdd }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         experience: '',
//     });
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             await onAdd(formData);
//             onClose();
//             setFormData({
//                 firstName: '',
//                 lastName: '',
//                 email: '',
//                 phone: '',
//                 experience: '',
              
//             });
//         } catch (error) {
//             console.error('Error adding recruiter:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth="md"
//             fullWidth
//             fullScreen={isMobile}
//         >
//             <DialogTitle sx={{ background: colors.primary.gradient, color: 'white' }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <AddIcon />
//                         <Typography variant={isMobile ? "subtitle1" : "h6"}>
//                             Add New Recruiter
//                         </Typography>
//                     </Box>
//                     <IconButton edge="end" color="inherit" onClick={onClose}>
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//             </DialogTitle>
//             <DialogContent dividers>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="First Name"
//                             value={formData.firstName}
//                             onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                             required
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Last Name"
//                             value={formData.lastName}
//                             onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                             required
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             type="email"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             required
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Phone"
//                             value={formData.phone}
//                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                             size="small"
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Experience (years)"
//                             type="number"
//                             value={formData.experience}
//                             onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                             size="small"
//                         />
//                     </Grid>
          
//                 </Grid>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Cancel</Button>
//                 <Button
//                     onClick={handleSubmit}
//                     variant="contained"
//                     disabled={loading || !formData.firstName || !formData.lastName || !formData.email}
//                 >
//                     {loading ? <CircularProgress size={24} /> : 'Add Recruiter'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // Main Recruiters Component
// const RecruitersPage = () => {
//     const navigate = useNavigate();
//     const theme = useTheme();
//     const { user: currentUser } = useUser();
    
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [viewMode, setViewMode] = useState("table");
//     const [selectedRecruiters, setSelectedRecruiters] = useState([]);
//     const [recruiters, setRecruiters] = useState([]);
//     const [filteredRecruiters, setFilteredRecruiters] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    
//     // Dialog states
//     const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//     const [selectedRecruiter, setSelectedRecruiter] = useState(null);
//     const [openAddDialog, setOpenAddDialog] = useState(false);
//     const [openEditDialog, setOpenEditDialog] = useState(false);
//     const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//     const [deleteLoading, setDeleteLoading] = useState(false);
    
//     // Enhanced Filter states - removed department
//     const [filters, setFilters] = useState({
//         status: '',
//         specialization: '',
//         experienceRange: '',
//         searchQuery: '',
//     });
    
//     // Mobile filter drawer
//     const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
//     const [tempFilters, setTempFilters] = useState({});

//     // Mock data for filter options - removed department

//     const experienceRanges = ['0-2 years', '2-4 years', '4-6 years', '6-8 years', '8-10 years', '10+ years'];


//     const getMainContentWidth = () => {
//         if (isMobile) return '100%';
//         if (isTablet) {
//             return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
//         }
//         return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
//     };

//     const getCardGridColumns = () => {
//         if (isMobile) return '1fr';
//         if (isTablet) {
//             return sidebarOpen ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
//         }
//         if (sidebarOpen) {
//             return {
//                 md: 'repeat(2, 1fr)',
//                 lg: 'repeat(3, 1fr)',
//                 xl: 'repeat(4, 1fr)'
//             };
//         }
//         return {
//             md: 'repeat(3, 1fr)',
//             lg: 'repeat(4, 1fr)',
//             xl: 'repeat(5, 1fr)'
//         };
//     };

//     const getContainerPadding = () => {
//         if (isMobile) return 1;
//         if (isTablet) return 2;
//         return 3;
//     };

//     const getFilterCount = () => {
//         return Object.keys(filters).filter(key => filters[key] && key !== 'searchQuery').length;
//     };

//     const handleBack = () => {
//         navigate(-1);
//     };

//     useEffect(() => {
//         fetchRecruiters();
//     }, []);

//     const fetchRecruiters = async () => {
//         try {
//             setLoading(true);
//             const response = await adminService.getRecruiters();
            
//             let recruitersList = [];
//             if (response.recruiters && Array.isArray(response.recruiters)) {
//                 recruitersList = response.recruiters;
//             } else if (response.recuiter && Array.isArray(response.recuiter)) {
//                 recruitersList = response.recuiter;
//             } else if (Array.isArray(response)) {
//                 recruitersList = response;
//             }
            
//             // Enhanced mock data with additional fields - removed department
//             recruitersList = recruitersList.map(recruiter => ({
//                 ...recruiter,
//                 isActive: recruiter.isActive !== undefined ? recruiter.isActive : true,
//                 experience: recruiter.experience || Math.floor(Math.random() * 15) + 1,
//                 hireTarget: Math.floor(Math.random() * 20) + 5,
//                 placements: Math.floor(Math.random() * 15) + 1,
//                 activeRequisitions: Math.floor(Math.random() * 8) + 1,
//                 joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
//             }));
            
//             setRecruiters(recruitersList);
//             setFilteredRecruiters(recruitersList);
//         } catch (err) {
//             console.error("Error fetching recruiters:", err);
//             setError(err.message);
//             showSnackbar(err.message, "error");
            
//             const mockRecruiters = generateMockRecruiters();
//             setRecruiters(mockRecruiters);
//             setFilteredRecruiters(mockRecruiters);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Generate mock recruiters - removed department
//     const generateMockRecruiters = () => {
//         const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Maria'];
//         const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        
//         return Array.from({ length: 25 }, (_, i) => ({
//             _id: `recruiter_${i + 1}`,
//             firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
//             lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
//             email: `recruiter${i + 1}@example.com`,
//             phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
//             experience: Math.floor(Math.random() * 15) + 1,
//             isActive: Math.random() > 0.2,
//             role: 'recruiter',
//             hireTarget: Math.floor(Math.random() * 20) + 5,
//             placements: Math.floor(Math.random() * 15) + 1,
//             activeRequisitions: Math.floor(Math.random() * 8) + 1,
//             joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
//             recentActivity: [
//                 { description: 'Placed candidate for Senior Developer role', date: new Date().toISOString() },
//                 { description: 'Scheduled 3 interviews for this week', date: new Date().toISOString() },
//                 { description: 'Added 5 new candidates to pipeline', date: new Date().toISOString() },
//             ]
//         }));
//     };

//     // Apply enhanced filters - removed department
//     useEffect(() => {
//         let result = [...recruiters];

//         if (filters.status) {
//             if (filters.status === 'active') {
//                 result = result.filter(r => r.isActive);
//             } else if (filters.status === 'inactive') {
//                 result = result.filter(r => !r.isActive);
//             }
//         }


//         if (filters.experienceRange) {
//             const [min, max] = filters.experienceRange.split('-').map(Number);
//             result = result.filter(r => {
//                 const exp = r.experience || 0;
//                 if (filters.experienceRange === '10+') {
//                     return exp >= 10;
//                 }
//                 if (max) {
//                     return exp >= min && exp <= max;
//                 }
//                 return true;
//             });
//         }

//         if (filters.searchQuery) {
//             const query = filters.searchQuery.toLowerCase();
//             result = result.filter(r => 
//                 `${r.firstName} ${r.lastName}`.toLowerCase().includes(query) ||
//                 r.email.toLowerCase().includes(query)
//             );
//         }

//         setFilteredRecruiters(result);
//     }, [recruiters, filters]);

//     const showSnackbar = (message, severity = "success") => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     };

//     const handleSelectRecruiter = (id) => {
//         setSelectedRecruiters((prev) =>
//             prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
//         );
//     };

//     const handleSelectAll = (event) => {
//         if (event.target.checked) {
//             setSelectedRecruiters(filteredRecruiters.map(r => r._id));
//         } else {
//             setSelectedRecruiters([]);
//         }
//     };

//     const handleOpenDetails = (recruiter) => {
//         setSelectedRecruiter(recruiter);
//         setOpenDetailsDialog(true);
//     };

//     const handleCloseDetails = () => {
//         setOpenDetailsDialog(false);
//         setSelectedRecruiter(null);
//     };

//     const handleOpenEdit = (recruiter, event) => {
//         if (event) {
//             event.stopPropagation();
//         }
//         setSelectedRecruiter(recruiter);
//         setOpenEditDialog(true);
//     };

//     const handleCloseEdit = () => {
//         setOpenEditDialog(false);
//         setSelectedRecruiter(null);
//     };

//     const handleOpenDelete = (recruiter, event) => {
//         if (event) {
//             event.stopPropagation();
//         }
//         setSelectedRecruiter(recruiter);
//         setOpenDeleteDialog(true);
//     };

//     const handleCloseDelete = () => {
//         setOpenDeleteDialog(false);
//         setSelectedRecruiter(null);
//     };

//     const handleEditRecruiter = async (id, updatedData) => {
//         try {
//             setRecruiters(prev => prev.map(recruiter => 
//                 recruiter._id === id 
//                     ? { ...recruiter, ...updatedData }
//                     : recruiter
//             ));
//             showSnackbar('Recruiter updated successfully!');
//         } catch (error) {
//             console.error('Error editing recruiter:', error);
//             showSnackbar(error.message, 'error');
//             throw error;
//         }
//     };

//     const handleDeleteRecruiter = async () => {
//         if (!selectedRecruiter) return;
        
//         setDeleteLoading(true);
//         try {
//             setRecruiters(prev => prev.filter(r => r._id !== selectedRecruiter._id));
//             setSelectedRecruiters(prev => prev.filter(id => id !== selectedRecruiter._id));
//             showSnackbar('Recruiter deleted successfully!');
//             handleCloseDelete();
//         } catch (error) {
//             console.error('Error deleting recruiter:', error);
//             showSnackbar(error.message, 'error');
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     const handleAddRecruiter = async (recruiterData) => {
//         try {
//             const newRecruiter = {
//                 ...recruiterData,
//                 _id: `recruiter_${Date.now()}`,
//                 isActive: true,
//                 role: 'recruiter',
//                 hireTarget: 10,
//                 placements: 0,
//                 activeRequisitions: 0,
//                 joinedDate: new Date().toISOString(),
//                 recentActivity: [],
//             };
            
//             setRecruiters(prev => [newRecruiter, ...prev]);
//             showSnackbar('Recruiter added successfully!');
//         } catch (error) {
//             console.error('Error adding recruiter:', error);
//             showSnackbar(error.message, 'error');
//             throw error;
//         }
//     };

//     const handleFilterChange = (filterName) => (event) => {
//         setFilters({
//             ...filters,
//             [filterName]: event.target.value
//         });
//     };

//     const handleResetFilters = () => {
//         setFilters({
//             status: '',
           
           
//             searchQuery: '',
//         });
//         setTempFilters({});
//     };

//     const handleMobileFilterApply = () => {
//         setFilters(tempFilters);
//         setMobileFilterOpen(false);
//     };

//     const handleMobileFilterClear = () => {
//         setTempFilters({});
//     };



//     // Mobile Filter Drawer - removed department
//     const MobileFilterDrawer = () => (
//         <Drawer
//             anchor="bottom"
//             open={mobileFilterOpen}
//             onClose={() => setMobileFilterOpen(false)}
//             PaperProps={{
//                 sx: {
//                     maxHeight: '85vh',
//                     borderTopLeftRadius: 24,
//                     borderTopRightRadius: 24,
//                     p: { xs: 2.5, sm: 3 },
//                 }
//             }}
//         >
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h6" fontWeight={600}>Filter Recruiters</Typography>
//                 <IconButton onClick={() => setMobileFilterOpen(false)}>
//                     <CloseIcon />
//                 </IconButton>
//             </Box>

//             <Box sx={{ maxHeight: 'calc(85vh - 180px)', overflowY: 'auto' }}>
//                 <Stack spacing={2.5}>
//                     <FormControl fullWidth size="small">
//                         <InputLabel>Status</InputLabel>
//                         <Select
//                             value={tempFilters.status || ""}
//                             onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
//                             label="Status"
//                         >
//                             <MenuItem value="">All Status</MenuItem>
//                             <MenuItem value="active">Active</MenuItem>
//                             <MenuItem value="inactive">Inactive</MenuItem>
//                         </Select>
//                     </FormControl>


//                     <FormControl fullWidth size="small">
//                         <InputLabel>Experience</InputLabel>
//                         <Select
//                             value={tempFilters.experienceRange || ""}
//                             onChange={(e) => setTempFilters(prev => ({ ...prev, experienceRange: e.target.value }))}
//                             label="Experience"
//                         >
//                             <MenuItem value="">All Experience</MenuItem>
//                             {experienceRanges.map(range => (
//                                 <MenuItem key={range} value={range}>{range}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>

//                 </Stack>
//             </Box>

//             <Box sx={{ display: 'flex', gap: 2, mt: 3, pt: 2.5, borderTop: `1px solid #e0e0e0` }}>
//                 <Button fullWidth variant="outlined" onClick={handleMobileFilterClear}>
//                     Clear All
//                 </Button>
//                 <Button fullWidth variant="contained" onClick={handleMobileFilterApply}>
//                     Apply Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
//                 </Button>
//             </Box>
//         </Drawer>
//     );

//     if (loading && recruiters.length === 0) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{
//             width: getMainContentWidth(),
//             minHeight: '100vh',
//             p: getContainerPadding(),
//             ml: { xs: 0, sm: sidebarOpen ? '200px' : '65px', md: sidebarOpen ? '200px' : '65px' },
//             transition: 'margin-left 0.3s ease, width 0.3s ease',
//             mt: { xs: 7, sm: 8, md: 9 },
//             bgcolor: colors.neutral[100],
//         }}>
//             <Box sx={{ mb: isMobile ? 1 : 2 }}>
//                 <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
//                     Back 
//                 </Button>
//             </Box>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: isMobile ? 'center' : 'right' }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>

//             {/* Header */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//                 <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
//                     Recruiters <span style={{ color: colors.primary.main }}>({recruiters.length})</span>
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
//                         Add Recruiter
//                     </Button>
//                     <ToggleButtonGroup value={viewMode} exclusive onChange={(e, newMode) => newMode && setViewMode(newMode)} size="small">
//                         <ToggleButton value="table">
//                             <TableViewIcon fontSize="small" />
//                         </ToggleButton>
//                         <ToggleButton value="card">
//                             <CardViewIcon fontSize="small" />
//                         </ToggleButton>
//                     </ToggleButtonGroup>
//                 </Box>
//             </Box>

//             {/* Filters Section - with reset button in first row */}
//             {isMobile ? (
//                 <Card sx={{ mb: 2 }}>
//                     <CardContent sx={{ p: 1.5 }}>
//                         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                             <TextField
//                                 fullWidth
//                                 size="small"
//                                 placeholder="Search recruiters..."
//                                 value={filters.searchQuery}
//                                 onChange={handleFilterChange('searchQuery')}
//                                 InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
//                             />
//                             <Badge badgeContent={getFilterCount()} color="primary">
//                                 <IconButton onClick={() => { setTempFilters(filters); setMobileFilterOpen(true); }}>
//                                     <FilterIcon />
//                                 </IconButton>
//                             </Badge>
//                         </Box>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <Card sx={{ mb: 2 }}>
//                     <CardContent>
//                         {/* First Row - 6 items (5 filters + reset button) */}
//                         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
//                             <FormControl fullWidth size="small">
//                                 <InputLabel>Status</InputLabel>
//                                 <Select value={filters.status} onChange={handleFilterChange('status')} label="Status">
//                                     <MenuItem value="">All</MenuItem>
//                                     <MenuItem value="active">Active</MenuItem>
//                                     <MenuItem value="inactive">Inactive</MenuItem>
//                                 </Select>
//                             </FormControl>


//                             <FormControl fullWidth size="small">
//                                 <InputLabel>Experience</InputLabel>
//                                 <Select value={filters.experienceRange} onChange={handleFilterChange('experienceRange')} label="Experience">
//                                     <MenuItem value="">All</MenuItem>
//                                     {experienceRanges.map(range => <MenuItem key={range} value={range}>{range}</MenuItem>)}
//                                 </Select>
//                             </FormControl>

                       

//                             <Button
//                                 variant="outlined"
//                                 onClick={handleResetFilters}
//                                 sx={{ height: '40px', }}
//                                 disabled={getFilterCount() === 0 && !filters.searchQuery}
//                             >
//                                 RESET ALL
//                             </Button>
//                         </Box>

//                         {/* Search Row */}
//                         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
//                             <TextField
//                                 fullWidth
//                                 size="small"
//                                 placeholder="Search recruiters by name, email..."
//                                 value={filters.searchQuery}
//                                 onChange={handleFilterChange('searchQuery')}
//                                 InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
//                             />
//                         </Box>
//                     </CardContent>
//                 </Card>
//             )}

//             <MobileFilterDrawer />

//             {/* Bulk Actions */}
//             {selectedRecruiters.length > 0 && (
//                 <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, p: 1.5, bgcolor: colors.primary.light + '20', borderRadius: 2 }}>
//                     <Typography variant="body2" fontWeight={600}>
//                         {selectedRecruiters.length} recruiter{selectedRecruiters.length > 1 ? 's' : ''} selected
//                     </Typography>
//                     <FormControl size="small" sx={{ minWidth: 150 }}>
//                         <InputLabel>Bulk Actions</InputLabel>
//                         <Select label="Bulk Actions" defaultValue="" onChange={(e) => {
//                             const action = e.target.value;
//                             if (action === 'delete') {
//                                 if (window.confirm(`Delete ${selectedRecruiters.length} recruiters?`)) {
//                                     setRecruiters(prev => prev.filter(r => !selectedRecruiters.includes(r._id)));
//                                     setSelectedRecruiters([]);
//                                     showSnackbar(`${selectedRecruiters.length} recruiters deleted`);
//                                 }
//                             } else if (action === 'export') {
//                                 console.log('Exporting:', selectedRecruiters);
//                                 showSnackbar('Exporting selected recruiters...');
//                             } else if (action === 'activate') {
//                                 setRecruiters(prev => prev.map(r => 
//                                     selectedRecruiters.includes(r._id) ? { ...r, isActive: true } : r
//                                 ));
//                                 setSelectedRecruiters([]);
//                                 showSnackbar(`${selectedRecruiters.length} recruiters activated`);
//                             } else if (action === 'deactivate') {
//                                 setRecruiters(prev => prev.map(r => 
//                                     selectedRecruiters.includes(r._id) ? { ...r, isActive: false } : r
//                                 ));
//                                 setSelectedRecruiters([]);
//                                 showSnackbar(`${selectedRecruiters.length} recruiters deactivated`);
//                             }
//                         }}>
//                             <MenuItem value="delete">Delete</MenuItem>
//                             <MenuItem value="export">Export</MenuItem>
//                             <MenuItem value="activate">Activate</MenuItem>
//                             <MenuItem value="deactivate">Deactivate</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Box>
//             )}

//             {/* Table View - removed department column */}
//             {viewMode === "table" ? (
//                 <TableContainer component={Paper}>
//                     <Table sx={{ minWidth: 1000 }} size={isMobile ? "small" : "medium"}>
//                         <TableHead>
//                             <TableRow sx={{ bgcolor: colors.neutral[100] }}>
//                                 <TableCell padding="checkbox">
//                                     <Checkbox onChange={handleSelectAll} checked={selectedRecruiters.length === filteredRecruiters.length && filteredRecruiters.length > 0} />
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: 'bold' }}>Recruiter</TableCell>
//                                 <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
//                                 <TableCell sx={{ fontWeight: 'bold' }}>Experience</TableCell>
                          
//                                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                                 <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filteredRecruiters.map((recruiter) => (
//                                 <TableRow key={recruiter._id} hover onClick={() => handleOpenDetails(recruiter)}>
//                                     <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
//                                         <Checkbox checked={selectedRecruiters.includes(recruiter._id)} onChange={() => handleSelectRecruiter(recruiter._id)} />
//                                     </TableCell>
//                                     <TableCell>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Avatar sx={{ width: 32, height: 32, bgcolor: colors.secondary.main }}>
//                                                 {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
//                                             </Avatar>
//                                             <Typography variant="body2" fontWeight={600}>
//                                                 {recruiter.firstName} {recruiter.lastName}
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Typography variant="body2">{recruiter.email}</Typography>
//                                         <Typography variant="caption" color="textSecondary">{recruiter.phone}</Typography>
//                                     </TableCell>
                                  
//                                     <TableCell>{recruiter.experience} years</TableCell>
//                                     <TableCell>
//                                         <Chip label={recruiter.isActive ? "Active" : "Inactive"} size="small" color={recruiter.isActive ? "success" : "default"} />
//                                     </TableCell>
//                                     <TableCell onClick={(e) => e.stopPropagation()}>
//                                         <IconButton size="small" onClick={(e) => handleOpenEdit(recruiter, e)}>
//                                             <EditIcon fontSize="small" />
//                                         </IconButton>
//                                         <IconButton size="small" onClick={(e) => handleOpenDelete(recruiter, e)}>
//                                             <DeleteIcon fontSize="small" />
//                                         </IconButton>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             ) : (
//                 // Card View - removed department
//                 <Box sx={{ display: "grid", gridTemplateColumns: getCardGridColumns(), gap: 2 }}>
//                     {filteredRecruiters.map((recruiter) => (
//                         <Card key={recruiter._id} sx={{ cursor: "pointer" }} onClick={() => handleOpenDetails(recruiter)}>
//                             <CardContent>
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
//                                     <Checkbox checked={selectedRecruiters.includes(recruiter._id)} onChange={(e) => { e.stopPropagation(); handleSelectRecruiter(recruiter._id); }} onClick={(e) => e.stopPropagation()} size="small" />
//                                     <Avatar sx={{ width: 48, height: 48, bgcolor: colors.secondary.main }}>
//                                         {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
//                                     </Avatar>
//                                     <Box flex={1}>
//                                         <Typography variant="body1" fontWeight={600}>
//                                             {recruiter.firstName} {recruiter.lastName}
//                                         </Typography>
                                      
//                                     </Box>
//                                     <Chip label={recruiter.isActive ? "Active" : "Inactive"} size="small" color={recruiter.isActive ? "success" : "default"} />
//                                 </Box>

//                                 <Stack spacing={0.5} mb={1.5}>
//                                     <Box display="flex" alignItems="center" gap={1}>
//                                         <EmailIcon fontSize="small" color="disabled" />
//                                         <Typography variant="body2">{recruiter.email}</Typography>
//                                     </Box>
//                                     <Box display="flex" alignItems="center" gap={1}>
//                                         <PhoneIcon fontSize="small" color="disabled" />
//                                         <Typography variant="body2">{recruiter.phone}</Typography>
//                                     </Box>
                                  
//                                 </Stack>

//                                 <Box sx={{ mb: 1.5, p: 1, bgcolor: colors.neutral[50], borderRadius: 1 }}>
//                                     <Grid container spacing={1}>
//                                         <Grid item xs={4}>
//                                             <Typography variant="caption" color="textSecondary">Placements</Typography>
//                                             <Typography variant="body2" fontWeight={600} color="primary">{recruiter.placements || 0}</Typography>
//                                         </Grid>
//                                         <Grid item xs={4}>
//                                             <Typography variant="caption" color="textSecondary">Target</Typography>
//                                             <Typography variant="body2">{recruiter.hireTarget || 0}</Typography>
//                                         </Grid>
//                                         <Grid item xs={4}>
//                                             <Typography variant="caption" color="textSecondary">Active</Typography>
//                                             <Typography variant="body2" color="warning.main">{recruiter.activeRequisitions || 0}</Typography>
//                                         </Grid>
//                                     </Grid>
                                   
//                                 </Box>

//                                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
//                                     <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenEdit(recruiter, e); }}>
//                                         <EditIcon fontSize="small" />
//                                     </IconButton>
//                                     <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDelete(recruiter, e); }}>
//                                         <DeleteIcon fontSize="small" />
//                                     </IconButton>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </Box>
//             )}

//             {/* Dialogs */}
//             <RecruiterDetailsDialog open={openDetailsDialog} onClose={handleCloseDetails} recruiter={selectedRecruiter} onEditClick={handleOpenEdit} />
//             <AddRecruiterDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAdd={handleAddRecruiter} />
//             <EditRecruiterDialog open={openEditDialog} onClose={handleCloseEdit} onEdit={handleEditRecruiter} recruiter={selectedRecruiter} />
//             <DeleteConfirmationDialog open={openDeleteDialog} onClose={handleCloseDelete} onConfirm={handleDeleteRecruiter} recruiterName={selectedRecruiter ? `${selectedRecruiter.firstName} ${selectedRecruiter.lastName}` : ''} loading={deleteLoading} />
//         </Box>
//     );
// };

// export default RecruitersPage;


import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Avatar,
    TextField,
    Chip,
    Dialog,
    Menu,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Snackbar,
    Alert,
    Tooltip,
    useMediaQuery,
    useTheme,
    Drawer,
    Fab,
    Badge,
    Stack,
    Grid,
    InputAdornment,
    LinearProgress,
    Rating,
} from "@mui/material";
import {
    ViewModule as CardViewIcon,
    ViewHeadline as TableViewIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    CalendarToday as CalendarIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon,
    LocationOn as LocationIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    People as PeopleIcon,
    Group as GroupIcon,
  
    Assessment as AssessmentIcon,
    PersonAdd as PersonAddIcon,
 
    Warning as WarningIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { useUser } from "../../contexts/UserContext";

// Blue color palette
const colors = {
    primary: {
        main: '#1976D2',
        light: '#42A5F5',
        dark: '#1565C0',
        gradient: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
        bg: '#E3F2FD',
    },
    secondary: {
        main: '#0288D1',
        light: '#4FC3F7',
        dark: '#01579B',
        gradient: 'linear-gradient(135deg, #0288D1 0%, #29B6F6 100%)',
        bg: '#E1F5FE',
    },
    success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        bg: '#ECFDF5',
    },
    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
        bg: '#FFFBEB',
    },
    error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
        bg: '#FEF2F2',
    },
    info: {
        main: '#1976D2',
        light: '#42A5F5',
        dark: '#1565C0',
        bg: '#E3F2FD',
    },
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    }
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Card sx={{ 
            height: '100%',
            background: color?.gradient || 'white',
            color: color?.gradient ? 'white' : 'inherit',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
            }
        }}>
            <CardContent sx={{ 
                p: isMobile ? 2 : 2.5,
                '&:last-child': { pb: isMobile ? 2 : 2.5 }
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="body2" sx={{ 
                            color: color?.gradient ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                            fontWeight: 500,
                            mb: 1
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 700,
                            mb: 0.5,
                            fontSize: isMobile ? '1.75rem' : '2rem'
                        }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" sx={{ 
                                color: color?.gradient ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                display: 'block'
                            }}>
                                {subtitle}
                            </Typography>
                        )}
                        {trend && (
                            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                <TrendingUpIcon sx={{ 
                                    fontSize: 16,
                                    color: trend === 'up' ? colors.success.light : colors.error.light
                                }} />
                                <Typography variant="caption" sx={{ 
                                    color: color?.gradient ? 'rgba(255,255,255,0.9)' : 
                                           trend === 'up' ? colors.success.main : colors.error.main,
                                    fontWeight: 600
                                }}>
                                    {trendValue}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Avatar sx={{ 
                        bgcolor: color?.gradient ? 'rgba(255,255,255,0.2)' : color?.bg || colors.primary.bg,
                        color: color?.gradient ? 'white' : color?.main || colors.primary.main,
                        width: 48,
                        height: 48
                    }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

// Edit Recruiter Dialog Component (remained same)
const EditRecruiterDialog = ({ open, onClose, onEdit, recruiter }) => {
    // ... (same as before)
};

// Delete Confirmation Dialog (remained same)
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, recruiterName, loading }) => {
    // ... (same as before)
};

// Recruiter Details Dialog Component (remained same)
const RecruiterDetailsDialog = ({ open, onClose, recruiter, onEditClick }) => {
    // ... (same as before)
};

// Add Recruiter Dialog Component (remained same)
const AddRecruiterDialog = ({ open, onClose, onAdd }) => {
    // ... (same as before)
};

// Main Recruiters Component
const RecruitersPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { user: currentUser } = useUser();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState("table");
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [filteredRecruiters, setFilteredRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    
    // Dialog states
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Enhanced Filter states - removed department
    const [filters, setFilters] = useState({
        status: '',
        experienceRange: '',
        searchQuery: '',
    });
    
    // Mobile filter drawer
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({});

    // Statistics state
    const [statistics, setStatistics] = useState({
        totalRecruiters: 0,
        activeRecruiters: 0,
        totalPlacements: 0,
        averageExperience: 0,
        newThisMonth: 0,
        topPerformers: 0,
        totalRequisitions: 0,
        completionRate: 0
    });

    // Mock data for filter options
    const experienceRanges = ['0-2 years', '2-4 years', '4-6 years', '6-8 years', '8-10 years', '10+ years'];

    const getMainContentWidth = () => {
        if (isMobile) return '100%';
        if (isTablet) {
            return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
        }
        return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
    };

    const getCardGridColumns = () => {
        if (isMobile) return '1fr';
        if (isTablet) {
            return sidebarOpen ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
        }
        if (sidebarOpen) {
            return {
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)'
            };
        }
        return {
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
        };
    };

    const getContainerPadding = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
    };

    const getFilterCount = () => {
        return Object.keys(filters).filter(key => filters[key] && key !== 'searchQuery').length;
    };

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const calculateStatistics = (recruitersList) => {
        const total = recruitersList.length;
        const active = recruitersList.filter(r => r.isActive).length;
        const totalPlacements = recruitersList.reduce((sum, r) => sum + (r.placements || 0), 0);
        const totalExperience = recruitersList.reduce((sum, r) => sum + (r.experience || 0), 0);
        const avgExperience = total > 0 ? (totalExperience / total).toFixed(1) : 0;
        
        // New this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = recruitersList.filter(r => new Date(r.joinedDate) >= firstDayOfMonth).length;
        
        // Top performers (placements >= 10)
        const topPerformers = recruitersList.filter(r => (r.placements || 0) >= 10).length;
        
        // Total active requisitions
        const totalRequisitions = recruitersList.reduce((sum, r) => sum + (r.activeRequisitions || 0), 0);
        
        // Completion rate (placements vs targets)
        const totalTargets = recruitersList.reduce((sum, r) => sum + (r.hireTarget || 0), 0);
        const completionRate = totalTargets > 0 ? Math.round((totalPlacements / totalTargets) * 100) : 0;

        setStatistics({
            totalRecruiters: total,
            activeRecruiters: active,
            totalPlacements,
            averageExperience: avgExperience,
            newThisMonth,
            topPerformers,
            totalRequisitions,
            completionRate
        });
    };

    const fetchRecruiters = async () => {
        try {
            setLoading(true);
            const response = await adminService.getRecruiters();
            
            let recruitersList = [];
            if (response.recruiters && Array.isArray(response.recruiters)) {
                recruitersList = response.recruiters;
            } else if (response.recuiter && Array.isArray(response.recuiter)) {
                recruitersList = response.recuiter;
            } else if (Array.isArray(response)) {
                recruitersList = response;
            }
            
            // Enhanced mock data with additional fields
            recruitersList = recruitersList.map(recruiter => ({
                ...recruiter,
                isActive: recruiter.isActive !== undefined ? recruiter.isActive : true,
                experience: recruiter.experience || Math.floor(Math.random() * 15) + 1,
                hireTarget: Math.floor(Math.random() * 20) + 5,
                placements: Math.floor(Math.random() * 15) + 1,
                activeRequisitions: Math.floor(Math.random() * 8) + 1,
                joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            }));
            
            setRecruiters(recruitersList);
            setFilteredRecruiters(recruitersList);
            calculateStatistics(recruitersList);
        } catch (err) {
            console.error("Error fetching recruiters:", err);
            setError(err.message);
            showSnackbar(err.message, "error");
            
            const mockRecruiters = generateMockRecruiters();
            setRecruiters(mockRecruiters);
            setFilteredRecruiters(mockRecruiters);
            calculateStatistics(mockRecruiters);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock recruiters
    const generateMockRecruiters = () => {
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Maria'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        
        return Array.from({ length: 25 }, (_, i) => ({
            _id: `recruiter_${i + 1}`,
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            email: `recruiter${i + 1}@example.com`,
            phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            experience: Math.floor(Math.random() * 15) + 1,
            isActive: Math.random() > 0.2,
            role: 'recruiter',
            hireTarget: Math.floor(Math.random() * 20) + 5,
            placements: Math.floor(Math.random() * 15) + 1,
            activeRequisitions: Math.floor(Math.random() * 8) + 1,
            joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            recentActivity: [
                { description: 'Placed candidate for Senior Developer role', date: new Date().toISOString() },
                { description: 'Scheduled 3 interviews for this week', date: new Date().toISOString() },
                { description: 'Added 5 new candidates to pipeline', date: new Date().toISOString() },
            ]
        }));
    };

    // Apply enhanced filters
    useEffect(() => {
        let result = [...recruiters];

        if (filters.status) {
            if (filters.status === 'active') {
                result = result.filter(r => r.isActive);
            } else if (filters.status === 'inactive') {
                result = result.filter(r => !r.isActive);
            }
        }

        if (filters.experienceRange) {
            const [min, max] = filters.experienceRange.split('-').map(Number);
            result = result.filter(r => {
                const exp = r.experience || 0;
                if (filters.experienceRange === '10+') {
                    return exp >= 10;
                }
                if (max) {
                    return exp >= min && exp <= max;
                }
                return true;
            });
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(r => 
                `${r.firstName} ${r.lastName}`.toLowerCase().includes(query) ||
                r.email.toLowerCase().includes(query)
            );
        }

        setFilteredRecruiters(result);
    }, [recruiters, filters]);

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSelectRecruiter = (id) => {
        setSelectedRecruiters((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedRecruiters(filteredRecruiters.map(r => r._id));
        } else {
            setSelectedRecruiters([]);
        }
    };

    const handleOpenDetails = (recruiter) => {
        setSelectedRecruiter(recruiter);
        setOpenDetailsDialog(true);
    };

    const handleCloseDetails = () => {
        setOpenDetailsDialog(false);
        setSelectedRecruiter(null);
    };

    const handleOpenEdit = (recruiter, event) => {
        if (event) {
            event.stopPropagation();
        }
        setSelectedRecruiter(recruiter);
        setOpenEditDialog(true);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setSelectedRecruiter(null);
    };

    const handleOpenDelete = (recruiter, event) => {
        if (event) {
            event.stopPropagation();
        }
        setSelectedRecruiter(recruiter);
        setOpenDeleteDialog(true);
    };

    const handleCloseDelete = () => {
        setOpenDeleteDialog(false);
        setSelectedRecruiter(null);
    };

    const handleEditRecruiter = async (id, updatedData) => {
        try {
            setRecruiters(prev => prev.map(recruiter => 
                recruiter._id === id 
                    ? { ...recruiter, ...updatedData }
                    : recruiter
            ));
            showSnackbar('Recruiter updated successfully!');
        } catch (error) {
            console.error('Error editing recruiter:', error);
            showSnackbar(error.message, 'error');
            throw error;
        }
    };

    const handleDeleteRecruiter = async () => {
        if (!selectedRecruiter) return;
        
        setDeleteLoading(true);
        try {
            setRecruiters(prev => prev.filter(r => r._id !== selectedRecruiter._id));
            setSelectedRecruiters(prev => prev.filter(id => id !== selectedRecruiter._id));
            showSnackbar('Recruiter deleted successfully!');
            handleCloseDelete();
        } catch (error) {
            console.error('Error deleting recruiter:', error);
            showSnackbar(error.message, 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddRecruiter = async (recruiterData) => {
        try {
            const newRecruiter = {
                ...recruiterData,
                _id: `recruiter_${Date.now()}`,
                isActive: true,
                role: 'recruiter',
                hireTarget: 10,
                placements: 0,
                activeRequisitions: 0,
                joinedDate: new Date().toISOString(),
                recentActivity: [],
            };
            
            setRecruiters(prev => [newRecruiter, ...prev]);
            showSnackbar('Recruiter added successfully!');
        } catch (error) {
            console.error('Error adding recruiter:', error);
            showSnackbar(error.message, 'error');
            throw error;
        }
    };

    const handleFilterChange = (filterName) => (event) => {
        setFilters({
            ...filters,
            [filterName]: event.target.value
        });
    };

    const handleResetFilters = () => {
        setFilters({
            status: '',
            experienceRange: '',
            searchQuery: '',
        });
        setTempFilters({});
    };

    const handleMobileFilterApply = () => {
        setFilters(tempFilters);
        setMobileFilterOpen(false);
    };

    const handleMobileFilterClear = () => {
        setTempFilters({});
    };

    // Mobile Filter Drawer
    const MobileFilterDrawer = () => (
        <Drawer
            anchor="bottom"
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            PaperProps={{
                sx: {
                    maxHeight: '85vh',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    p: { xs: 2.5, sm: 3 },
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>Filter Recruiters</Typography>
                <IconButton onClick={() => setMobileFilterOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ maxHeight: 'calc(85vh - 180px)', overflowY: 'auto' }}>
                <Stack spacing={2.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={tempFilters.status || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                            label="Status"
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>Experience</InputLabel>
                        <Select
                            value={tempFilters.experienceRange || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, experienceRange: e.target.value }))}
                            label="Experience"
                        >
                            <MenuItem value="">All Experience</MenuItem>
                            {experienceRanges.map(range => (
                                <MenuItem key={range} value={range}>{range}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, pt: 2.5, borderTop: `1px solid #e0e0e0` }}>
                <Button fullWidth variant="outlined" onClick={handleMobileFilterClear}>
                    Clear All
                </Button>
                <Button fullWidth variant="contained" onClick={handleMobileFilterApply}>
                    Apply Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
                </Button>
            </Box>
        </Drawer>
    );

    if (loading && recruiters.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            width: getMainContentWidth(),
            minHeight: '100vh',
            p: getContainerPadding(),
            ml: { xs: 0, sm: sidebarOpen ? '200px' : '65px', md: sidebarOpen ? '200px' : '65px' },
            transition: 'margin-left 0.3s ease, width 0.3s ease',
            mt: { xs: 7, sm: 8, md: 9 },
            bgcolor: colors.neutral[100],
        }}>
            <Box sx={{ mb: isMobile ? 1 : 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
                    Back 
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: isMobile ? 'center' : 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
                    Recruiters <span style={{ color: colors.primary.main }}>({recruiters.length})</span>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
                        Add Recruiter
                    </Button> */}
                    <ToggleButtonGroup value={viewMode} exclusive onChange={(e, newMode) => newMode && setViewMode(newMode)} size="small">
                        <ToggleButton value="table">
                            <TableViewIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="card">
                            <CardViewIcon fontSize="small" />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {/* Statistics Cards Section */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    {/* Total Recruiters */}
                    <Grid item xs={12 } sm={6} md={3} width={"32%"}>
                        <StatCard
                            title="Total Recruiters"
                            value={statistics.totalRecruiters}
                            icon={<PeopleIcon />}
                            color={colors.primary}
                            trend="up"
                            trendValue={`+${statistics.newThisMonth} this month`}
                        
                        />
                    </Grid>

                    {/* Active Recruiters */}
                    <Grid item xs={12 } sm={6} md={3} width={"32%"}>
                        <StatCard
                            title="Active Recruiters"
                            value={statistics.activeRecruiters}
                            icon={<GroupIcon />}
                            color={colors.primary}
                            subtitle={`${Math.round((statistics.activeRecruiters / statistics.totalRecruiters) * 100)}% of total`}
                        />
                    </Grid>

                    {/* Total Placements */}
                     <Grid item xs={12 } sm={6} md={3} width={"32%"}>
                        <StatCard
                            title="Total Placements"
                            value={statistics.totalPlacements}
                            icon={<CheckCircleIcon />}
                             color={colors.primary}
                            trend="up"
                            trendValue="+12% vs last month"
                        />
                    </Grid>

                
                </Grid>
            </Box>

            {/* Filters Section */}
            {isMobile ? (
                <Card sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 1.5 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search recruiters..."
                                value={filters.searchQuery}
                                onChange={handleFilterChange('searchQuery')}
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                            />
                            <Badge badgeContent={getFilterCount()} color="primary">
                                <IconButton onClick={() => { setTempFilters(filters); setMobileFilterOpen(true); }}>
                                    <FilterIcon />
                                </IconButton>
                            </Badge>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        {/* First Row - Filters */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select value={filters.status} onChange={handleFilterChange('status')} label="Status">
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Experience</InputLabel>
                                <Select value={filters.experienceRange} onChange={handleFilterChange('experienceRange')} label="Experience">
                                    <MenuItem value="">All</MenuItem>
                                    {experienceRanges.map(range => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <Box sx={{ gridColumn: 'span 2', display: 'flex', gap: 1 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleResetFilters}
                                    disabled={getFilterCount() === 0 && !filters.searchQuery}
                                >
                                    RESET ALL
                                </Button>
                            </Box>
                        </Box>

                        {/* Search Row */}
                        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search recruiters by name, email..."
                                value={filters.searchQuery}
                                onChange={handleFilterChange('searchQuery')}
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}

            <MobileFilterDrawer />

            {/* Bulk Actions */}
            {selectedRecruiters.length > 0 && (
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, p: 1.5, bgcolor: colors.primary.light + '20', borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                        {selectedRecruiters.length} recruiter{selectedRecruiters.length > 1 ? 's' : ''} selected
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Bulk Actions</InputLabel>
                        <Select label="Bulk Actions" defaultValue="" onChange={(e) => {
                            const action = e.target.value;
                            if (action === 'delete') {
                                if (window.confirm(`Delete ${selectedRecruiters.length} recruiters?`)) {
                                    setRecruiters(prev => prev.filter(r => !selectedRecruiters.includes(r._id)));
                                    setSelectedRecruiters([]);
                                    showSnackbar(`${selectedRecruiters.length} recruiters deleted`);
                                }
                            } else if (action === 'export') {
                                console.log('Exporting:', selectedRecruiters);
                                showSnackbar('Exporting selected recruiters...');
                            } else if (action === 'activate') {
                                setRecruiters(prev => prev.map(r => 
                                    selectedRecruiters.includes(r._id) ? { ...r, isActive: true } : r
                                ));
                                setSelectedRecruiters([]);
                                showSnackbar(`${selectedRecruiters.length} recruiters activated`);
                            } else if (action === 'deactivate') {
                                setRecruiters(prev => prev.map(r => 
                                    selectedRecruiters.includes(r._id) ? { ...r, isActive: false } : r
                                ));
                                setSelectedRecruiters([]);
                                showSnackbar(`${selectedRecruiters.length} recruiters deactivated`);
                            }
                        }}>
                            <MenuItem value="delete">Delete</MenuItem>
                            <MenuItem value="export">Export</MenuItem>
                            <MenuItem value="activate">Activate</MenuItem>
                            <MenuItem value="deactivate">Deactivate</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Table View - removed department column */}
            {viewMode === "table" ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 1000 }} size={isMobile ? "small" : "medium"}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: colors.neutral[100] }}>
                                <TableCell padding="checkbox">
                                    <Checkbox onChange={handleSelectAll} checked={selectedRecruiters.length === filteredRecruiters.length && filteredRecruiters.length > 0} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Recruiter</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Experience</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRecruiters.map((recruiter) => (
                                <TableRow key={recruiter._id} hover onClick={() => handleOpenDetails(recruiter)}>
                                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox checked={selectedRecruiters.includes(recruiter._id)} onChange={() => handleSelectRecruiter(recruiter._id)} />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: colors.secondary.main }}>
                                                {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={600}>
                                                {recruiter.firstName} {recruiter.lastName}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{recruiter.email}</Typography>
                                        <Typography variant="caption" color="textSecondary">{recruiter.phone}</Typography>
                                    </TableCell>
                                    <TableCell>{recruiter.experience} years</TableCell>
                                    <TableCell>
                                        <Chip label={recruiter.isActive ? "Active" : "Inactive"} size="small" color={recruiter.isActive ? "success" : "default"} />
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <IconButton size="small" onClick={(e) => handleOpenEdit(recruiter, e)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={(e) => handleOpenDelete(recruiter, e)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                // Card View - removed department
                <Box sx={{ display: "grid", gridTemplateColumns: getCardGridColumns(), gap: 2 }}>
                    {filteredRecruiters.map((recruiter) => (
                        <Card key={recruiter._id} sx={{ cursor: "pointer" }} onClick={() => handleOpenDetails(recruiter)}>
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                    <Checkbox checked={selectedRecruiters.includes(recruiter._id)} onChange={(e) => { e.stopPropagation(); handleSelectRecruiter(recruiter._id); }} onClick={(e) => e.stopPropagation()} size="small" />
                                    <Avatar sx={{ width: 48, height: 48, bgcolor: colors.secondary.main }}>
                                        {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
                                    </Avatar>
                                    <Box flex={1}>
                                        <Typography variant="body1" fontWeight={600}>
                                            {recruiter.firstName} {recruiter.lastName}
                                        </Typography>
                                    </Box>
                                    <Chip label={recruiter.isActive ? "Active" : "Inactive"} size="small" color={recruiter.isActive ? "success" : "default"} />
                                </Box>

                                <Stack spacing={0.5} mb={1.5}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <EmailIcon fontSize="small" color="disabled" />
                                        <Typography variant="body2">{recruiter.email}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <PhoneIcon fontSize="small" color="disabled" />
                                        <Typography variant="body2">{recruiter.phone}</Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ mb: 1.5, p: 1, bgcolor: colors.neutral[50], borderRadius: 1 }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="textSecondary">Placements</Typography>
                                            <Typography variant="body2" fontWeight={600} color="primary">{recruiter.placements || 0}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="textSecondary">Target</Typography>
                                            <Typography variant="body2">{recruiter.hireTarget || 0}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="textSecondary">Active</Typography>
                                            <Typography variant="body2" color="warning.main">{recruiter.activeRequisitions || 0}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenEdit(recruiter, e); }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDelete(recruiter, e); }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Dialogs */}
            <RecruiterDetailsDialog open={openDetailsDialog} onClose={handleCloseDetails} recruiter={selectedRecruiter} onEditClick={handleOpenEdit} />
            <AddRecruiterDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAdd={handleAddRecruiter} />
            <EditRecruiterDialog open={openEditDialog} onClose={handleCloseEdit} onEdit={handleEditRecruiter} recruiter={selectedRecruiter} />
            <DeleteConfirmationDialog open={openDeleteDialog} onClose={handleCloseDelete} onConfirm={handleDeleteRecruiter} recruiterName={selectedRecruiter ? `${selectedRecruiter.firstName} ${selectedRecruiter.lastName}` : ''} loading={deleteLoading} />
        </Box>
    );
};

export default RecruitersPage;