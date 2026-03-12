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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { useUser } from "../../contexts/UserContext";

// Blue color palette
const colors = {
    primary: {
        main: '#1976D2', // Blue
        light: '#42A5F5',
        dark: '#1565C0',
        gradient: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
        bg: '#E3F2FD',
    },
    secondary: {
        main: '#0288D1', // Light Blue
        light: '#4FC3F7',
        dark: '#01579B',
        gradient: 'linear-gradient(135deg, #0288D1 0%, #29B6F6 100%)',
        bg: '#E1F5FE',
    },
    success: {
        main: '#10B981', // Emerald
        light: '#34D399',
        dark: '#059669',
        bg: '#ECFDF5',
    },
    warning: {
        main: '#F59E0B', // Amber
        light: '#FBBF24',
        dark: '#D97706',
        bg: '#FFFBEB',
    },
    error: {
        main: '#EF4444', // Red
        light: '#F87171',
        dark: '#DC2626',
        bg: '#FEF2F2',
    },
    info: {
        main: '#1976D2', // Blue
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

// Recruiter Details Dialog Component with blue theme
const RecruiterDetailsDialog = ({ open, onClose, recruiter }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    if (!recruiter) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, sm: 3 },
                    maxHeight: '90vh',
                    m: isMobile ? 0 : 2,
                }
            }}
        >
            <DialogTitle sx={{
                background: colors.primary.gradient,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon />
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                        Recruiter Details
                    </Typography>
                </Box>
                <IconButton edge="end" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: isMobile ? 2 : 3, bgcolor: colors.neutral[50] }}>
                <Grid container spacing={3}>
                    {/* Profile Section */}
                    <Grid item xs={12} display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                width: isMobile ? 60 : 80,
                                height: isMobile ? 60 : 80,
                                background: colors.secondary.gradient,
                                fontSize: isMobile ? '1.5rem' : '2rem',
                                boxShadow: '0 4px 14px rgba(2, 136, 209, 0.3)',
                            }}
                        >
                            {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                                {recruiter.firstName} {recruiter.lastName}
                            </Typography>
                            <Typography variant="body2" color={colors.neutral[500]}>
                                {recruiter.email}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                <Chip
                                    label={recruiter.role || 'Recruiter'}
                                    size="small"
                                    sx={{ 
                                        background: colors.primary.light,
                                        color: 'white',
                                        fontWeight: 500
                                    }}
                                />
                                {recruiter.isActive && (
                                    <Chip
                                        label="Active"
                                        size="small"
                                        sx={{ 
                                            background: colors.success.bg,
                                            color: colors.success.dark,
                                            fontWeight: 500,
                                            border: `1px solid ${colors.success.light}`
                                        }}
                                        icon={<CheckCircleIcon sx={{ color: colors.success.main, fontSize: '1rem' }} />}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: colors.neutral[200] }} />
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Contact Information
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <EmailIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.email}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <PhoneIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.phone || 'Not provided'}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LocationIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.location || 'Not specified'}</Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Professional Information */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Professional Information
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <WorkIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    Experience: {recruiter.experience || '0'} years
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <BusinessIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    Department: {recruiter.department || 'Not assigned'}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AssignmentIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    Specialization: {recruiter.specialization || 'General'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: colors.neutral[200] }} />
                    </Grid>

                    {/* Performance Metrics */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Performance Overview
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ 
                                    p: 2, 
                                    textAlign: 'center', 
                                    background: colors.primary.bg,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
                                }}>
                                    <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 700 }}>
                                        {recruiter.totalJobsAssigned || 0}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 500 }}>
                                        Jobs Assigned
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ 
                                    p: 2, 
                                    textAlign: 'center', 
                                    background: colors.success.bg,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
                                }}>
                                    <Typography variant="h6" sx={{ color: colors.success.dark, fontWeight: 700 }}>
                                        {recruiter.activeJobs || 0}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 500 }}>
                                        Active Jobs
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ 
                                    p: 2, 
                                    textAlign: 'center', 
                                    background: colors.secondary.bg,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(2, 136, 209, 0.1)'
                                }}>
                                    <Typography variant="h6" sx={{ color: colors.secondary.dark, fontWeight: 700 }}>
                                        {recruiter.candidatesSourced || 0}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 500 }}>
                                        Candidates Sourced
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ 
                                    p: 2, 
                                    textAlign: 'center', 
                                    background: colors.warning.bg,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)'
                                }}>
                                    <Typography variant="h6" sx={{ color: colors.warning.dark, fontWeight: 700 }}>
                                        {recruiter.placements || 0}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 500 }}>
                                        Placements
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Skills */}
                    {recruiter.skills && recruiter.skills.length > 0 && (
                        <>
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor: colors.neutral[200] }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                                    Skills & Expertise
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {recruiter.skills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            size="small"
                                            sx={{ 
                                                background: colors.primary.light + '20',
                                                color: colors.primary.dark,
                                                fontWeight: 500,
                                                border: `1px solid ${colors.primary.light}`,
                                                '&:hover': {
                                                    background: colors.primary.light + '40',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        </>
                    )}

                    {/* Recent Activity */}
                    {recruiter.recentActivity && recruiter.recentActivity.length > 0 && (
                        <>
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor: colors.neutral[200] }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                                    Recent Activity
                                </Typography>
                                <Stack spacing={1}>
                                    {recruiter.recentActivity.map((activity, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <ScheduleIcon sx={{ fontSize: '1rem', color: colors.neutral[400] }} />
                                            <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                                                {activity.description} - <span style={{ color: colors.primary.main }}>{new Date(activity.date).toLocaleDateString()}</span>
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', bgcolor: colors.neutral[50] }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined"
                    sx={{ 
                        borderColor: colors.neutral[300],
                        color: colors.neutral[700],
                        '&:hover': {
                            borderColor: colors.primary.main,
                            backgroundColor: colors.primary.light + '10',
                        }
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            background: colors.primary.gradient,
                            filter: 'brightness(1.1)',
                        }
                    }}
                    onClick={() => {
                        // Handle edit
                        onClose();
                    }}
                >
                    Edit Recruiter
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Add Recruiter Dialog Component with blue theme
const AddRecruiterDialog = ({ open, onClose, onAdd }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        department: '',
        experience: '',
        specialization: '',
        skills: [],
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAdd(formData);
            onClose();
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                location: '',
                department: '',
                experience: '',
                specialization: '',
                skills: [],
            });
        } catch (error) {
            console.error('Error adding recruiter:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, sm: 3 },
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{
                background: colors.primary.gradient,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <AddIcon />
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                        Add New Recruiter
                    </Typography>
                </Box>
                <IconButton edge="end" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: isMobile ? 2 : 3, bgcolor: colors.neutral[50] }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Experience (years)"
                            type="number"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Specialization"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Skills (comma separated)"
                            value={formData.skills.join(', ')}
                            onChange={(e) => setFormData({
                                ...formData,
                                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            size="small"
                            helperText="Enter skills separated by commas"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: colors.primary.main,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: colors.neutral[50] }}>
                <Button 
                    onClick={onClose}
                    sx={{ 
                        color: colors.neutral[600],
                        '&:hover': {
                            backgroundColor: colors.neutral[100],
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.firstName || !formData.lastName || !formData.email}
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            background: colors.primary.gradient,
                            filter: 'brightness(1.1)',
                        },
                        '&.Mui-disabled': {
                            background: colors.neutral[300],
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Recruiter'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Recruiters Component with blue theme
const RecruitersPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { user: currentUser } = useUser();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    
    // Sidebar state
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
    
    // Filter states
    const [filters, setFilters] = useState({
        department: '',
        status: '',
        searchQuery: '',
        performance: '',
    });
    
    // Mobile filter drawer
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({});

    // Get main content width
    const getMainContentWidth = () => {
        if (isMobile) return '100%';
        if (isTablet) {
            return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
        }
        return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
    };

    // Get card grid columns
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

    // Get container padding
    const getContainerPadding = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
    };

    // Get filter count
    const getFilterCount = () => {
        return Object.keys(filters).filter(key => filters[key] && key !== 'searchQuery').length;
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Fetch recruiters
    useEffect(() => {
        fetchRecruiters();
    }, []);

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
            
            // Add mock performance data if not present
            recruitersList = recruitersList.map(recruiter => ({
                ...recruiter,
                totalJobsAssigned: recruiter.totalJobsAssigned || Math.floor(Math.random() * 20) + 5,
                activeJobs: recruiter.activeJobs || Math.floor(Math.random() * 10) + 1,
                candidatesSourced: recruiter.candidatesSourced || Math.floor(Math.random() * 100) + 20,
                placements: recruiter.placements || Math.floor(Math.random() * 30) + 5,
                performance: recruiter.performance || (Math.random() * 5).toFixed(1),
                skills: recruiter.skills || ['Technical Recruitment', 'Screening', 'Interviewing'],
                isActive: recruiter.isActive !== undefined ? recruiter.isActive : true,
            }));
            
            setRecruiters(recruitersList);
            setFilteredRecruiters(recruitersList);
        } catch (err) {
            console.error("Error fetching recruiters:", err);
            setError(err.message);
            showSnackbar(err.message, "error");
            
            // Use mock data for demonstration
            const mockRecruiters = generateMockRecruiters();
            setRecruiters(mockRecruiters);
            setFilteredRecruiters(mockRecruiters);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock recruiters for demonstration
    const generateMockRecruiters = () => {
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Maria'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        const departments = ['IT', 'Healthcare', 'Finance', 'Engineering', 'Sales', 'Marketing'];
        const specializations = ['Technical', 'Executive', 'Healthcare', 'IT', 'Sales', 'General'];
        
        return Array.from({ length: 25 }, (_, i) => ({
            _id: `recruiter_${i + 1}`,
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            email: `recruiter${i + 1}@example.com`,
            phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
            department: departments[Math.floor(Math.random() * departments.length)],
            experience: Math.floor(Math.random() * 15) + 1,
            specialization: specializations[Math.floor(Math.random() * specializations.length)],
            skills: ['Technical Recruitment', 'Screening', 'Interviewing', 'Negotiation', 'Onboarding'].slice(0, Math.floor(Math.random() * 4) + 2),
            totalJobsAssigned: Math.floor(Math.random() * 20) + 5,
            activeJobs: Math.floor(Math.random() * 10) + 1,
            candidatesSourced: Math.floor(Math.random() * 100) + 20,
            placements: Math.floor(Math.random() * 30) + 5,
            performance: (Math.random() * 2 + 3).toFixed(1),
            isActive: Math.random() > 0.2,
            role: 'recruiter',
            recentActivity: [
                { description: 'Placed candidate for Senior Developer role', date: new Date().toISOString() },
                { description: 'Scheduled 3 interviews for this week', date: new Date().toISOString() },
            ]
        }));
    };

    // Apply filters
    useEffect(() => {
        let result = [...recruiters];

        if (filters.department) {
            result = result.filter(r => r.department === filters.department);
        }

        if (filters.status) {
            if (filters.status === 'active') {
                result = result.filter(r => r.isActive);
            } else if (filters.status === 'inactive') {
                result = result.filter(r => !r.isActive);
            }
        }

        if (filters.performance) {
            const [min, max] = filters.performance.split('-').map(Number);
            if (filters.performance === '4+') {
                result = result.filter(r => parseFloat(r.performance) >= 4);
            } else if (max) {
                result = result.filter(r => {
                    const perf = parseFloat(r.performance);
                    return perf >= min && perf <= max;
                });
            }
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(r => 
                `${r.firstName} ${r.lastName}`.toLowerCase().includes(query) ||
                r.email.toLowerCase().includes(query) ||
                r.department?.toLowerCase().includes(query) ||
                r.skills?.some(s => s.toLowerCase().includes(query))
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

    const handleAddRecruiter = async (recruiterData) => {
        try {
            // API call would go here
            console.log('Adding recruiter:', recruiterData);
            
            // For demo, add to local state
            const newRecruiter = {
                ...recruiterData,
                _id: `recruiter_${Date.now()}`,
                totalJobsAssigned: 0,
                activeJobs: 0,
                candidatesSourced: 0,
                placements: 0,
                performance: '0.0',
                isActive: true,
                role: 'recruiter',
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
            department: '',
            status: '',
            searchQuery: '',
            performance: '',
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

    // Get unique departments for filter
    const departments = [...new Set(recruiters.map(r => r.department).filter(Boolean))];

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
                    background: 'white',
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${colors.neutral[200]}`
            }}>
                <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 600, color: colors.neutral[800] }}>
                    Filter Recruiters
                </Typography>
                <IconButton onClick={() => setMobileFilterOpen(false)} size="small" sx={{ color: colors.neutral[500] }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ maxHeight: 'calc(85vh - 180px)', overflowY: 'auto', px: 0.5 }}>
                <Stack spacing={2.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: colors.neutral[600] }}>Department</InputLabel>
                        <Select
                            value={tempFilters.department || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, department: e.target.value }))}
                            label="Department"
                            sx={{
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                            }}
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map(dept => (
                                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: colors.neutral[600] }}>Status</InputLabel>
                        <Select
                            value={tempFilters.status || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                            label="Status"
                            sx={{
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                            }}
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: colors.neutral[600] }}>Performance</InputLabel>
                        <Select
                            value={tempFilters.performance || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, performance: e.target.value }))}
                            label="Performance"
                            sx={{
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                            }}
                        >
                            <MenuItem value="">All Performance</MenuItem>
                            <MenuItem value="4-5">4-5 Stars</MenuItem>
                            <MenuItem value="3-4">3-4 Stars</MenuItem>
                            <MenuItem value="2-3">2-3 Stars</MenuItem>
                            <MenuItem value="1-2">1-2 Stars</MenuItem>
                            <MenuItem value="4+">4+ Stars</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, pt: 2.5, borderTop: `2px solid ${colors.neutral[200]}` }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                        setTempFilters({});
                        handleMobileFilterClear();
                    }}
                    sx={{ 
                        py: 1.5, 
                        borderRadius: 2,
                        borderColor: colors.neutral[300],
                        color: colors.neutral[700],
                        '&:hover': {
                            borderColor: colors.primary.main,
                            backgroundColor: colors.primary.light + '10',
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
                        borderRadius: 2,
                        background: colors.primary.gradient,
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            background: colors.primary.gradient,
                            filter: 'brightness(1.1)',
                        }
                    }}
                >
                    Apply Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
                </Button>
            </Box>
        </Drawer>
    );

    if (loading && recruiters.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                width: getMainContentWidth(),
                ml: { xs: 0, sm: sidebarOpen ? '200px' : '65px', md: sidebarOpen ? '200px' : '65px' },
                transition: 'margin-left 0.3s ease, width 0.3s ease',
                mt: { xs: 7, sm: 8, md: 9 },
            }}>
                <CircularProgress sx={{ color: colors.primary.main }} size={isMobile ? 40 : 60} />
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
            overflowX: 'hidden',
            bgcolor: colors.neutral[100],
        }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: isMobile ? 'center' : 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{
                        borderRadius: 2,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header with Back Button and Actions */}
            <Box sx={{
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-between",
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                mb: 3
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            backgroundColor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            '&:hover': { 
                                backgroundColor: 'white',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                            },
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                        }}
                        size={isMobile ? "small" : "medium"}
                    >
                        <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} sx={{ color: colors.primary.main }} />
                    </IconButton>
                    <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                        Recruiters <span style={{ color: colors.primary.main, fontSize: isMobile ? '1rem' : '1.25rem' }}>({recruiters.length})</span>
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        fullWidth={isMobile}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            background: colors.primary.gradient,
                            color: 'white',
                            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                            '&:hover': {
                                background: colors.primary.gradient,
                                filter: 'brightness(1.1)',
                            },
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        Add Recruiter
                    </Button>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newMode) => newMode && setViewMode(newMode)}
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            '& .MuiToggleButton-root': {
                                border: 'none',
                                color: colors.neutral[500],
                                '&.Mui-selected': {
                                    background: colors.primary.gradient,
                                    color: 'white',
                                    '&:hover': {
                                        background: colors.primary.gradient,
                                        filter: 'brightness(1.1)',
                                    }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="table" aria-label="table view">
                            <TableViewIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="card" aria-label="card view">
                            <CardViewIcon fontSize="small" />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {/* Filters Section */}
            {isMobile ? (
                // Mobile Filter Bar
                <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 1.5 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search recruiters..."
                                value={filters.searchQuery}
                                onChange={handleFilterChange('searchQuery')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" sx={{ color: colors.neutral[400] }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: colors.primary.main,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: colors.primary.main,
                                        },
                                    },
                                }}
                            />
                            <Badge badgeContent={getFilterCount()} sx={{ '& .MuiBadge-badge': { bgcolor: colors.primary.main, color: 'white' } }}>
                                <IconButton
                                    onClick={() => {
                                        setTempFilters(filters);
                                        setMobileFilterOpen(true);
                                    }}
                                    sx={{ 
                                        border: `1px solid ${colors.neutral[200]}`,
                                        borderRadius: 1,
                                        color: colors.neutral[600],
                                        '&:hover': {
                                            borderColor: colors.primary.main,
                                            color: colors.primary.main,
                                        }
                                    }}
                                >
                                    <FilterIcon />
                                </IconButton>
                            </Badge>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                // Desktop Filters
                <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: colors.neutral[800] }}>
                            Filters
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ color: colors.neutral[600] }}>Department</InputLabel>
                                    <Select
                                        value={filters.department}
                                        onChange={handleFilterChange('department')}
                                        label="Department"
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: colors.primary.main,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: colors.primary.main,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">All Departments</MenuItem>
                                        {departments.map(dept => (
                                            <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ color: colors.neutral[600] }}>Status</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={handleFilterChange('status')}
                                        label="Status"
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: colors.primary.main,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: colors.primary.main,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">All Status</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ color: colors.neutral[600] }}>Performance</InputLabel>
                                    <Select
                                        value={filters.performance}
                                        onChange={handleFilterChange('performance')}
                                        label="Performance"
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: colors.primary.main,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: colors.primary.main,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">All Performance</MenuItem>
                                        <MenuItem value="4-5">4-5 Stars</MenuItem>
                                        <MenuItem value="3-4">3-4 Stars</MenuItem>
                                        <MenuItem value="2-3">2-3 Stars</MenuItem>
                                        <MenuItem value="1-2">1-2 Stars</MenuItem>
                                        <MenuItem value="4+">4+ Stars</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Button
                                    variant="outlined"
                                    onClick={handleResetFilters}
                                    fullWidth
                                    size="medium"
                                    sx={{ 
                                        height: '40px',
                                        borderColor: colors.neutral[300],
                                        color: colors.neutral[700],
                                        '&:hover': {
                                            borderColor: colors.primary.main,
                                            color: colors.primary.main,
                                            backgroundColor: colors.primary.light + '10',
                                        },
                                        '&.Mui-disabled': {
                                            borderColor: colors.neutral[200],
                                            color: colors.neutral[400],
                                        }
                                    }}
                                    disabled={getFilterCount() === 0 && !filters.searchQuery}
                                >
                                    Reset Filters
                                </Button>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search recruiters by name, email, skills..."
                                value={filters.searchQuery}
                                onChange={handleFilterChange('searchQuery')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: colors.neutral[400] }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: colors.primary.main,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: colors.primary.main,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer />

            {/* Bulk Actions */}
            {selectedRecruiters.length > 0 && (
                <Box sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    p: 1.5,
                    backgroundColor: colors.primary.light + '10',
                    borderRadius: 2,
                    border: `1px solid ${colors.primary.light}`,
                }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary.dark }}>
                        {selectedRecruiters.length} recruiter{selectedRecruiters.length > 1 ? 's' : ''} selected
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                        <InputLabel sx={{ color: colors.neutral[600] }}>Bulk Actions</InputLabel>
                        <Select
                            label="Bulk Actions"
                            defaultValue=""
                            onChange={(e) => {
                                const action = e.target.value;
                                if (action === 'delete') {
                                    // Handle bulk delete
                                    setRecruiters(prev => prev.filter(r => !selectedRecruiters.includes(r._id)));
                                    setSelectedRecruiters([]);
                                    showSnackbar(`${selectedRecruiters.length} recruiters deleted`);
                                }
                            }}
                            sx={{
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main,
                                },
                            }}
                        >
                            <MenuItem value="delete">Delete</MenuItem>
                            <MenuItem value="export">Export</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Table View */}
            {viewMode === "table" ? (
                <TableContainer component={Paper} sx={{
                    maxWidth: '100%',
                    overflowX: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <Table sx={{ minWidth: { xs: 800, sm: 900, md: 1000 } }} size={isMobile ? "small" : "medium"}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: colors.primary.main + '10' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        onChange={handleSelectAll}
                                        checked={selectedRecruiters.length === filteredRecruiters.length && filteredRecruiters.length > 0}
                                        sx={{
                                            color: colors.primary.light,
                                            '&.Mui-checked': {
                                                color: colors.primary.main,
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Recruiter</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Experience</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Performance</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Jobs</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Placements</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: colors.neutral[700] }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRecruiters.map((recruiter) => (
                                <TableRow
                                    key={recruiter._id}
                                    hover
                                    sx={{ 
                                        cursor: "pointer",
                                        '&:hover': {
                                            backgroundColor: colors.primary.light + '08',
                                        }
                                    }}
                                    onClick={() => handleOpenDetails(recruiter)}
                                >
                                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedRecruiters.includes(recruiter._id)}
                                            onChange={() => handleSelectRecruiter(recruiter._id)}
                                            sx={{
                                                color: colors.primary.light,
                                                '&.Mui-checked': {
                                                    color: colors.primary.main,
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                background: colors.secondary.gradient,
                                                fontSize: '0.9rem',
                                                boxShadow: '0 2px 8px rgba(2, 136, 209, 0.2)',
                                            }}>
                                                {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                                                    {recruiter.firstName} {recruiter.lastName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                                    {recruiter.specialization}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.email}</Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            {recruiter.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.department}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.experience} years</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Rating
                                                value={parseFloat(recruiter.performance)}
                                                precision={0.5}
                                                readOnly
                                                size="small"
                                                sx={{
                                                    '& .MuiRating-iconFilled': {
                                                        color: colors.warning.main,
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: colors.neutral[500] }}>({recruiter.performance})</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                            {recruiter.activeJobs}/{recruiter.totalJobsAssigned}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(recruiter.activeJobs / recruiter.totalJobsAssigned) * 100}
                                            sx={{ 
                                                width: 80, 
                                                height: 4, 
                                                borderRadius: 2, 
                                                mt: 0.5,
                                                backgroundColor: colors.neutral[200],
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: colors.primary.main,
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: colors.success.dark, fontWeight: 600 }}>
                                            {recruiter.placements}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={recruiter.isActive ? "Active" : "Inactive"}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: recruiter.isActive ? colors.success.bg : colors.neutral[200],
                                                color: recruiter.isActive ? colors.success.dark : colors.neutral[600],
                                                fontWeight: 500,
                                                border: recruiter.isActive ? `1px solid ${colors.success.light}` : 'none',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton 
                                                size="small" 
                                                sx={{ 
                                                    color: colors.primary.main,
                                                    '&:hover': {
                                                        backgroundColor: colors.primary.light + '20',
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                sx={{ 
                                                    color: colors.error.main,
                                                    '&:hover': {
                                                        backgroundColor: colors.error.light + '20',
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                // Card View
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: getCardGridColumns(),
                        gap: { xs: 2, sm: 2.5, md: 3 },
                    }}
                >
                    {filteredRecruiters.map((recruiter) => (
                        <Card
                            key={recruiter._id}
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                ":hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)',
                                },
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                cursor: "pointer",
                                border: `1px solid ${colors.neutral[200]}`,
                            }}
                            onClick={() => handleOpenDetails(recruiter)}
                        >
                            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                {/* Header */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                    <Checkbox
                                        checked={selectedRecruiters.includes(recruiter._id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelectRecruiter(recruiter._id);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        size="small"
                                        sx={{
                                            color: colors.primary.light,
                                            '&.Mui-checked': {
                                                color: colors.primary.main,
                                            },
                                        }}
                                    />
                                    <Avatar
                                        sx={{
                                            width: { xs: 40, sm: 48 },
                                            height: { xs: 40, sm: 48 },
                                            background: colors.secondary.gradient,
                                            fontSize: { xs: '1rem', sm: '1.2rem' },
                                            boxShadow: '0 4px 12px rgba(2, 136, 209, 0.3)',
                                        }}
                                    >
                                        {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                                            {recruiter.firstName} {recruiter.lastName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            {recruiter.specialization}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={recruiter.isActive ? "Active" : "Inactive"}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: recruiter.isActive ? colors.success.bg : colors.neutral[200],
                                            color: recruiter.isActive ? colors.success.dark : colors.neutral[600],
                                            fontWeight: 500,
                                            border: recruiter.isActive ? `1px solid ${colors.success.light}` : 'none',
                                        }}
                                    />
                                </Box>

                                {/* Contact Info */}
                                <Box sx={{ mb: 1.5 }}>
                                    <Stack spacing={0.5}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <EmailIcon sx={{ fontSize: '1rem', color: colors.neutral[400] }} />
                                            <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.email}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PhoneIcon sx={{ fontSize: '1rem', color: colors.neutral[400] }} />
                                            <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.phone}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <BusinessIcon sx={{ fontSize: '1rem', color: colors.neutral[400] }} />
                                            <Typography variant="body2" sx={{ color: colors.neutral[700] }}>{recruiter.department}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Divider sx={{ my: 1.5, borderColor: colors.neutral[200] }} />

                                {/* Stats */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box textAlign="center">
                                        <Typography variant="body2" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                                            {recruiter.activeJobs}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            Active Jobs
                                        </Typography>
                                    </Box>
                                    <Box textAlign="center">
                                        <Typography variant="body2" sx={{ color: colors.success.dark, fontWeight: 600 }}>
                                            {recruiter.placements}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            Placements
                                        </Typography>
                                    </Box>
                                    <Box textAlign="center">
                                        <Typography variant="body2" sx={{ color: colors.secondary.dark, fontWeight: 600 }}>
                                            {recruiter.candidatesSourced}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            Candidates
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Performance Rating */}
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Rating
                                        value={parseFloat(recruiter.performance)}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                        sx={{
                                            '& .MuiRating-iconFilled': {
                                                color: colors.warning.main,
                                            },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                                        {recruiter.experience} years exp.
                                    </Typography>
                                </Box>

                                {/* Skills */}
                                <Box sx={{ mt: 1.5 }}>
                                    <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block', mb: 0.5 }}>
                                        Skills:
                                    </Typography>
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {recruiter.skills?.slice(0, 3).map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                size="small"
                                                sx={{ 
                                                    height: 20, 
                                                    fontSize: '0.65rem',
                                                    backgroundColor: colors.primary.light + '15',
                                                    color: colors.primary.dark,
                                                    border: `1px solid ${colors.primary.light}`,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))}
                                        {recruiter.skills?.length > 3 && (
                                            <Chip
                                                label={`+${recruiter.skills.length - 3}`}
                                                size="small"
                                                sx={{ 
                                                    height: 20, 
                                                    fontSize: '0.65rem',
                                                    backgroundColor: colors.neutral[200],
                                                    color: colors.neutral[600],
                                                    fontWeight: 500,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Dialogs */}
            <RecruiterDetailsDialog
                open={openDetailsDialog}
                onClose={handleCloseDetails}
                recruiter={selectedRecruiter}
            />

            <AddRecruiterDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onAdd={handleAddRecruiter}
            />
        </Box>
    );
};

export default RecruitersPage;