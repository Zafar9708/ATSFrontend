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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Avatar,
    TextField,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Snackbar,
    Alert,
    useMediaQuery,
    useTheme,
    Drawer,
    Badge,
    Stack,
    Grid,
    InputAdornment,
    LinearProgress,
    Rating,
    Tooltip,
    AvatarGroup,
    Menu,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    ToggleButton,
    ToggleButtonGroup,
    InputBase,
    Paper as SearchPaper,
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon,
    GetApp as ExportIcon,
    Visibility as ViewIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    CalendarToday as CalendarIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    MoreVert as MoreIcon,
    Download as DownloadIcon,
    PictureAsPdf as PdfIcon,
    Description as DocIcon,
    InsertDriveFile as FileIcon,
    Clear as ClearIcon,
    FilterAlt as FilterAltIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Color palette - Updated pink to blue
const colors = {
    primary: {
        main: '#6366F1',
        light: '#818CF8',
        dark: '#4F46E5',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        bg: '#EEF2FF',
    },
    secondary: {
        main: '#3B82F6', // Changed from pink to blue
        light: '#60A5FA',
        dark: '#2563EB',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', // Updated gradient
        bg: '#EFF6FF', // Light blue background
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
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
        bg: '#EFF6FF',
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

// Stat Card Component - Updated secondary color references
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card sx={{ 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: `1px solid ${colors.neutral[200]}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
    }}>
        <CardContent sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="caption" sx={{ color: colors.neutral[500], fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {title}
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.neutral[800], fontWeight: 700, mt: 0.5 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: color?.bg || colors.primary.bg,
                }}>
                    <Icon sx={{ color: color?.main || colors.primary.main, fontSize: 24 }} />
                </Box>
            </Box>
        </CardContent>
    </Card>
);

// Candidate Details Dialog - Updated pink to blue
const CandidateDetailsDialog = ({ open, onClose, candidate }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!candidate) return null;

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
                py: 2
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon />
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                        Candidate Details
                    </Typography>
                </Box>
                <IconButton edge="end" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: isMobile ? 2 : 3, bgcolor: colors.neutral[50] }}>
                <Grid container spacing={3}>
                    {/* Profile Section - Updated avatar gradient */}
                    <Grid item xs={12} display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                width: isMobile ? 60 : 80,
                                height: isMobile ? 60 : 80,
                                background: colors.secondary.gradient,
                                fontSize: isMobile ? '1.5rem' : '2rem',
                                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)', // Updated shadow color
                            }}
                        >
                            {candidate.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                                {candidate.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                                {candidate.email}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                <Chip
                                    label={candidate.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: 
                                            candidate.status === 'Approved' ? colors.success.bg :
                                            candidate.status === 'Pending' ? colors.warning.bg :
                                            candidate.status === 'Rejected' ? colors.error.bg :
                                            colors.info.bg,
                                        color:
                                            candidate.status === 'Approved' ? colors.success.dark :
                                            candidate.status === 'Pending' ? colors.warning.dark :
                                            candidate.status === 'Rejected' ? colors.error.dark :
                                            colors.info.dark,
                                        fontWeight: 500,
                                        border: '1px solid',
                                        borderColor:
                                            candidate.status === 'Approved' ? colors.success.light :
                                            candidate.status === 'Pending' ? colors.warning.light :
                                            candidate.status === 'Rejected' ? colors.error.light :
                                            colors.info.light,
                                    }}
                                />
                                <Chip
                                    label={`${candidate.matchScore}% Match`}
                                    size="small"
                                    sx={{
                                        background: colors.primary.bg,
                                        color: colors.primary.dark,
                                        fontWeight: 500,
                                        border: `1px solid ${colors.primary.light}`,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    {/* Rest of the dialog content remains the same */}
                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: colors.neutral[200] }} />
                    </Grid>

                    {/* Vendor & Job Info */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Vendor Information
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <BusinessIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    {candidate.vendor}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <PersonIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    {candidate.vendorContact || 'Not specified'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Job Details
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <WorkIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    {candidate.jobTitle}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarIcon sx={{ fontSize: '1.2rem', color: colors.primary.main }} />
                                <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                    Submitted: {new Date(candidate.submissionDate).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: colors.neutral[200] }} />
                    </Grid>

                    {/* Skills & Experience */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Skills & Experience
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 1 }}>
                                        Technical Skills
                                    </Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {candidate.skills?.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                size="small"
                                                sx={{
                                                    background: colors.primary.light + '15',
                                                    color: colors.primary.dark,
                                                    border: `1px solid ${colors.primary.light}`,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 1 }}>
                                        Experience
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: colors.neutral[800], fontWeight: 500 }}>
                                        {candidate.experience || '5'} years total
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                        Relevant: {candidate.relevantExperience || '3'} years
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Match Analysis */}
                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: colors.neutral[200] }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Match Analysis
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>Overall Match</Typography>
                                <Typography variant="body2" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                                    {candidate.matchScore}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={candidate.matchScore}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: colors.neutral[200],
                                    '& .MuiLinearProgress-bar': {
                                        background: colors.primary.gradient,
                                        borderRadius: 4,
                                    }
                                }}
                            />
                        </Box>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={4}>
                                <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block' }}>
                                    Skills Match
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.success.dark, fontWeight: 600 }}>
                                    85%
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block' }}>
                                    Experience Match
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.warning.dark, fontWeight: 600 }}>
                                    70%
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block' }}>
                                    Location Match
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.info.dark, fontWeight: 600 }}>
                                    90%
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Resume/Documents */}
                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: colors.neutral[200] }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Documents
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            <Button
                                variant="outlined"
                                startIcon={<PdfIcon />}
                                size="small"
                                sx={{
                                    borderColor: colors.error.light,
                                    color: colors.error.dark,
                                    '&:hover': {
                                        borderColor: colors.error.main,
                                        backgroundColor: colors.error.bg,
                                    }
                                }}
                            >
                                Resume.pdf
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DescriptionIcon />}
                                size="small"
                                sx={{
                                    borderColor: colors.info.light,
                                    color: colors.info.dark,
                                    '&:hover': {
                                        borderColor: colors.info.main,
                                        backgroundColor: colors.info.bg,
                                    }
                                }}
                            >
                                Cover Letter.doc
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', bgcolor: colors.neutral[50] }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{ 
                        borderColor: colors.neutral[300],
                        color: colors.neutral[700],
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                    }}
                >
                    View Full Profile
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Vendor Candidates Component
const VendorCandidatesPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Data states
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    
    // UI states
    const [searchQuery, setSearchQuery] = useState('');
    const [vendorFilter, setVendorFilter] = useState('all');
    const [jobFilter, setJobFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all'); // New filter
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // New state for advanced filters
    const [tempFilters, setTempFilters] = useState({
        vendor: 'all',
        job: 'all',
        status: 'all',
        dateRange: 'all',
    });
    
    // Dialog states
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Get main content width
    const getMainContentWidth = () => {
        if (isMobile) return '100%';
        return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
    };

    // Get container padding
    const getContainerPadding = () => {
        if (isMobile) return 1.5;
        return 3;
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Generate mock data
    useEffect(() => {
        const mockCandidates = generateMockCandidates();
        setCandidates(mockCandidates);
        setFilteredCandidates(mockCandidates);
        setLoading(false);
    }, []);

    const generateMockCandidates = () => {
        const vendors = ['Fast Recruit', 'TechSource', 'Global Talent', 'HR Solutions', 'CareerMakers'];
        const jobs = ['UX Designer', 'Frontend Developer', 'Backend Engineer', 'Product Manager', 'Data Scientist'];
        const statuses = ['Pending', 'Approved', 'Rejected', 'Reviewing'];
        const firstNames = ['Emily', 'James', 'Sarah', 'Michael', 'Jessica', 'David', 'Lisa', 'Robert', 'Amanda', 'John'];
        const lastNames = ['Davis', 'Wilson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];
        
        return Array.from({ length: 25 }, (_, i) => {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const matchScore = Math.floor(Math.random() * 30) + 70; // 70-100
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const vendor = vendors[Math.floor(Math.random() * vendors.length)];
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            const daysAgo = Math.floor(Math.random() * 30);
            
            return {
                id: i + 1,
                name: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                vendor,
                vendorContact: `${firstName.charAt(0)}${lastName}@${vendor.toLowerCase().replace(' ', '')}.com`,
                jobTitle: job,
                matchScore,
                status,
                submissionDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
                skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'UI/UX', 'Product Strategy'].slice(0, Math.floor(Math.random() * 4) + 2),
                experience: `${Math.floor(Math.random() * 10) + 2} years`,
                relevantExperience: `${Math.floor(Math.random() * 5) + 1} years`,
                resume: 'resume.pdf',
                coverLetter: 'cover-letter.doc',
            };
        });
    };

    // Apply filters
    useEffect(() => {
        let result = [...candidates];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c => 
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.vendor.toLowerCase().includes(query) ||
                c.jobTitle.toLowerCase().includes(query)
            );
        }

        // Vendor filter
        if (vendorFilter !== 'all') {
            result = result.filter(c => c.vendor === vendorFilter);
        }

        // Job filter
        if (jobFilter !== 'all') {
            result = result.filter(c => c.jobTitle === jobFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }

        // Date range filter
        if (dateRange !== 'all') {
            const now = new Date();
            const daysMap = {
                'today': 1,
                'week': 7,
                'month': 30,
                'quarter': 90,
            };
            const days = daysMap[dateRange];
            if (days) {
                const cutoffDate = new Date(now.setDate(now.getDate() - days));
                result = result.filter(c => new Date(c.submissionDate) >= cutoffDate);
            }
        }

        setFilteredCandidates(result);
    }, [candidates, searchQuery, vendorFilter, jobFilter, statusFilter, dateRange]);

    // Calculate stats
    const stats = {
        total: candidates.length,
        pending: candidates.filter(c => c.status === 'Pending').length,
        approved: candidates.filter(c => c.status === 'Approved').length,
        avgMatch: Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length) || 0,
    };

    // Get unique vendors and jobs for filters
    const vendors = [...new Set(candidates.map(c => c.vendor))];
    const jobs = [...new Set(candidates.map(c => c.jobTitle))];

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            const mockCandidates = generateMockCandidates();
            setCandidates(mockCandidates);
            setFilteredCandidates(mockCandidates);
            setLoading(false);
            showSnackbar('Data refreshed successfully!');
        }, 1000);
    };

    const handleExport = () => {
        showSnackbar('Exporting data...', 'info');
        // Implement export logic here
    };

    const handleViewDetails = (candidate) => {
        setSelectedCandidate(candidate);
        setDetailsDialogOpen(true);
    };

    const handleStatusChange = (candidateId, newStatus) => {
        setCandidates(prev => prev.map(c => 
            c.id === candidateId ? { ...c, status: newStatus } : c
        ));
        showSnackbar(`Candidate status updated to ${newStatus}`);
        setAnchorEl(null);
    };

    const handleMenuClick = (event, candidate) => {
        setAnchorEl(event.currentTarget);
        setSelectedCandidate(candidate);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMobileFilterApply = () => {
        setVendorFilter(tempFilters.vendor);
        setJobFilter(tempFilters.job);
        setStatusFilter(tempFilters.status);
        setDateRange(tempFilters.dateRange);
        setMobileFilterOpen(false);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setVendorFilter('all');
        setJobFilter('all');
        setStatusFilter('all');
        setDateRange('all');
        setTempFilters({ 
            vendor: 'all', 
            job: 'all', 
            status: 'all',
            dateRange: 'all',
        });
        setShowAdvancedFilters(false);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Get filter badge count
    const getFilterCount = () => {
        let count = 0;
        if (vendorFilter !== 'all') count++;
        if (jobFilter !== 'all') count++;
        if (statusFilter !== 'all') count++;
        if (dateRange !== 'all') count++;
        return count;
    };

    // Mobile Filter Drawer - Updated with new filters
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
                    p: 2.5,
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                    Filter Candidates
                </Typography>
                <IconButton onClick={() => setMobileFilterOpen(false)} sx={{ color: colors.neutral[500] }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Stack spacing={2.5}>
                <FormControl fullWidth size="small">
                    <InputLabel>Vendor</InputLabel>
                    <Select
                        value={tempFilters.vendor}
                        onChange={(e) => setTempFilters({ ...tempFilters, vendor: e.target.value })}
                        label="Vendor"
                    >
                        <MenuItem value="all">All Vendors</MenuItem>
                        {vendors.map(v => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Job Position</InputLabel>
                    <Select
                        value={tempFilters.job}
                        onChange={(e) => setTempFilters({ ...tempFilters, job: e.target.value })}
                        label="Job Position"
                    >
                        <MenuItem value="all">All Jobs</MenuItem>
                        {jobs.map(j => (
                            <MenuItem key={j} value={j}>{j}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={tempFilters.status}
                        onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                        label="Status"
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                        <MenuItem value="Reviewing">Reviewing</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Date Range</InputLabel>
                    <Select
                        value={tempFilters.dateRange}
                        onChange={(e) => setTempFilters({ ...tempFilters, dateRange: e.target.value })}
                        label="Date Range"
                    >
                        <MenuItem value="all">All Time</MenuItem>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="week">Last 7 Days</MenuItem>
                        <MenuItem value="month">Last 30 Days</MenuItem>
                        <MenuItem value="quarter">Last 90 Days</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => {
                        setTempFilters({ 
                            vendor: 'all', 
                            job: 'all', 
                            status: 'all',
                            dateRange: 'all',
                        });
                    }}
                    sx={{ 
                        borderColor: colors.neutral[300],
                        color: colors.neutral[700],
                    }}
                >
                    Reset
                </Button>
                <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={handleMobileFilterApply}
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                    }}
                >
                    Apply Filters
                </Button>
            </Box>
        </Drawer>
    );

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: getMainContentWidth(),
                ml: { xs: 0, sm: sidebarOpen ? '200px' : '65px' },
            }}>
                <CircularProgress sx={{ color: colors.primary.main }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            width: getMainContentWidth(),
            minHeight: '100vh',
            p: getContainerPadding(),
            ml: { xs: 0, sm: sidebarOpen ? '200px' : '65px' },
            transition: 'margin-left 0.3s ease, width 0.3s ease',
            mt: { xs: 7, sm: 8, md: 9 },
            bgcolor: colors.neutral[100],
        }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
                <IconButton
                    onClick={handleBack}
                    sx={{
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        '&:hover': { bgcolor: 'white' },
                    }}
                >
                    <ArrowBackIcon sx={{ color: colors.primary.main }} />
                </IconButton>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                        Vendor Submissions
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                        Review and manage candidates submitted by recruitment vendors
                    </Typography>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3} width={"31%"}>
                    <StatCard
                        title="Total Submissions"
                        value={stats.total}
                        icon={PersonIcon}
                        color={{ main: colors.primary.main, bg: colors.primary.bg }}
                    />
                </Grid>
                <Grid item xs={6} sm={3} width={"31%"}>
                    <StatCard
                        title="Pending Review"
                        value={stats.pending}
                        icon={ScheduleIcon}
                        color={{ main: colors.warning.main, bg: colors.warning.bg }}
                    />
                </Grid>
                <Grid item xs={6} sm={3} width={"31%"}>
                    <StatCard
                        title="Approved"
                        value={stats.approved}
                        icon={CheckCircleIcon}
                        color={{ main: colors.success.main, bg: colors.success.bg }}
                    />
                </Grid>
       
            </Grid>

            {/* Redesigned Filter Section */}
            <Paper sx={{ 
                p: 2.5, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
                {/* Search Bar - Full width at top */}
                <Box sx={{ mb: 2.5 }}>
                    <SearchPaper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: 'none',
                            border: `1px solid ${colors.neutral[200]}`,
                            '&:hover': {
                                borderColor: colors.primary.main,
                            },
                        }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon sx={{ color: colors.neutral[400] }} />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search by name, email, vendor, or job title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <IconButton sx={{ p: '10px' }} onClick={handleClearSearch}>
                                <ClearIcon sx={{ color: colors.neutral[400], fontSize: 20 }} />
                            </IconButton>
                        )}
                    </SearchPaper>
                </Box>

                {/* Filter Chips Row */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexWrap: 'wrap',
                    mb: showAdvancedFilters ? 2 : 0,
                }}>
                    <Chip
                        icon={<FilterAltIcon />}
                        label={`Filters ${getFilterCount() > 0 ? `(${getFilterCount()})` : ''}`}
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        color={getFilterCount() > 0 ? "primary" : "default"}
                        variant={getFilterCount() > 0 ? "filled" : "outlined"}
                        sx={{ 
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: getFilterCount() > 0 ? 'white' : colors.primary.main },
                        }}
                    />
                    
                    {/* Active filter chips */}
                    {vendorFilter !== 'all' && (
                        <Chip
                            label={`Vendor: ${vendorFilter}`}
                            onDelete={() => setVendorFilter('all')}
                            size="small"
                            sx={{
                                backgroundColor: colors.primary.bg,
                                color: colors.primary.dark,
                                border: `1px solid ${colors.primary.light}`,
                            }}
                        />
                    )}
                    
                    {jobFilter !== 'all' && (
                        <Chip
                            label={`Job: ${jobFilter}`}
                            onDelete={() => setJobFilter('all')}
                            size="small"
                            sx={{
                                backgroundColor: colors.primary.bg,
                                color: colors.primary.dark,
                                border: `1px solid ${colors.primary.light}`,
                            }}
                        />
                    )}
                    
                    {statusFilter !== 'all' && (
                        <Chip
                            label={`Status: ${statusFilter}`}
                            onDelete={() => setStatusFilter('all')}
                            size="small"
                            sx={{
                                backgroundColor: colors.primary.bg,
                                color: colors.primary.dark,
                                border: `1px solid ${colors.primary.light}`,
                            }}
                        />
                    )}

                    {dateRange !== 'all' && (
                        <Chip
                            label={`Date: ${dateRange === 'today' ? 'Today' : 
                                   dateRange === 'week' ? 'Last 7 days' :
                                   dateRange === 'month' ? 'Last 30 days' :
                                   dateRange === 'quarter' ? 'Last 90 days' : ''}`}
                            onDelete={() => setDateRange('all')}
                            size="small"
                            sx={{
                                backgroundColor: colors.primary.bg,
                                color: colors.primary.dark,
                                border: `1px solid ${colors.primary.light}`,
                            }}
                        />
                    )}

                    {getFilterCount() > 0 && (
                        <Button 
                            size="small" 
                            onClick={handleResetFilters}
                            sx={{ 
                                color: colors.neutral[500],
                                fontSize: '0.75rem',
                                textTransform: 'none',
                            }}
                        >
                            Clear all
                        </Button>
                    )}
                </Box>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && !isMobile && (
                    <Box sx={{ 
                        mt: 2.5,
                        p: 2,
                        backgroundColor: colors.neutral[50],
                        borderRadius: 2,
                        border: `1px solid ${colors.neutral[200]}`,
                    }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Vendor</InputLabel>
                                    <Select
                                        value={vendorFilter}
                                        onChange={(e) => setVendorFilter(e.target.value)}
                                        label="Vendor"
                                    >
                                        <MenuItem value="all">All Vendors</MenuItem>
                                        {vendors.map(v => (
                                            <MenuItem key={v} value={v}>{v}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Job Position</InputLabel>
                                    <Select
                                        value={jobFilter}
                                        onChange={(e) => setJobFilter(e.target.value)}
                                        label="Job Position"
                                    >
                                        <MenuItem value="all">All Jobs</MenuItem>
                                        {jobs.map(j => (
                                            <MenuItem key={j} value={j}>{j}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Date Range</InputLabel>
                                    <Select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        label="Date Range"
                                    >
                                        <MenuItem value="all">All Time</MenuItem>
                                        <MenuItem value="today">Today</MenuItem>
                                        <MenuItem value="week">Last 7 Days</MenuItem>
                                        <MenuItem value="month">Last 30 Days</MenuItem>
                                        <MenuItem value="quarter">Last 90 Days</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box display="flex" gap={1} justifyContent="flex-end">
                                    <Button 
                                        variant="outlined" 
                                        onClick={handleResetFilters}
                                        size="small"
                                        sx={{ 
                                            borderColor: colors.neutral[300],
                                            color: colors.neutral[700],
                                            minWidth: '80px',
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Status Toggle Buttons */}
                {!isMobile && (
                    <Box sx={{ 
                        mt: 2, 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <ToggleButtonGroup
                            value={statusFilter}
                            exclusive
                            onChange={(e, newStatus) => {
                                if (newStatus !== null) {
                                    setStatusFilter(newStatus);
                                }
                            }}
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root': {
                                    borderColor: colors.neutral[200],
                                    color: colors.neutral[600],
                                    '&.Mui-selected': {
                                        backgroundColor: colors.primary.bg,
                                        color: colors.primary.main,
                                        borderColor: colors.primary.light,
                                        '&:hover': {
                                            backgroundColor: colors.primary.bg,
                                        }
                                    }
                                }
                            }}
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="Pending">
                                <ScheduleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                                Pending
                            </ToggleButton>
                            <ToggleButton value="Approved">
                                <CheckCircleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                                Approved
                            </ToggleButton>
                            <ToggleButton value="Rejected">
                                <CancelIcon sx={{ mr: 0.5, fontSize: 16 }} />
                                Rejected
                            </ToggleButton>
                            <ToggleButton value="Reviewing">
                                Reviewing
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <Box display="flex" gap={1}>
                            <Button
                                startIcon={<RefreshIcon />}
                                onClick={handleRefresh}
                                size="small"
                                sx={{ color: colors.neutral[600] }}
                            >
                                Refresh
                            </Button>
                            <Button
                                startIcon={<ExportIcon />}
                                onClick={handleExport}
                                size="small"
                                sx={{ color: colors.neutral[600] }}
                            >
                                Export
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Mobile filter button */}
                {isMobile && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Badge badgeContent={getFilterCount()} color="primary">
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => {
                                    setTempFilters({ 
                                        vendor: vendorFilter, 
                                        job: jobFilter, 
                                        status: statusFilter,
                                        dateRange: dateRange,
                                    });
                                    setMobileFilterOpen(true);
                                }}
                                fullWidth
                                sx={{ 
                                    borderColor: colors.neutral[300],
                                    color: colors.neutral[700],
                                }}
                            >
                                Filters
                            </Button>
                        </Badge>
                        <Button
                            variant="outlined"
                            onClick={handleResetFilters}
                            disabled={getFilterCount() === 0}
                            sx={{ 
                                borderColor: colors.neutral[300],
                                color: colors.neutral[700],
                                minWidth: '80px',
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Results Count - Mobile only */}
            {isMobile && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2 
                }}>
                    <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                        Showing {filteredCandidates.length} of {candidates.length} candidates
                    </Typography>
                    <Box display="flex" gap={1}>
                        <IconButton size="small" onClick={handleRefresh}>
                            <RefreshIcon fontSize="small" sx={{ color: colors.neutral[500] }} />
                        </IconButton>
                        <IconButton size="small" onClick={handleExport}>
                            <ExportIcon fontSize="small" sx={{ color: colors.neutral[500] }} />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* Candidates Table */}
            <TableContainer component={Paper} sx={{ 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflow: 'auto',
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: colors.neutral[50] }}>
                            <TableCell sx={{ fontWeight: 600, color: colors.neutral[700] }}>Candidate</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: colors.neutral[700] }}>Vendor</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: colors.neutral[700] }}>Job</TableCell>
                            
                            <TableCell sx={{ fontWeight: 600, color: colors.neutral[700] }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: colors.neutral[700] }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: colors.neutral[700] }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCandidates.map((candidate) => (
                            <TableRow key={candidate.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                background: colors.secondary.gradient,
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {candidate.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: colors.neutral[800] }}>
                                                {candidate.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                                {candidate.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                            {candidate.vendor}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            {candidate.vendorContact}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: colors.neutral[700] }}>
                                        {candidate.jobTitle}
                                    </Typography>
                                </TableCell>
                            
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                                        {new Date(candidate.submissionDate).toLocaleDateString('en-US', {
                                            month: 'numeric',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={candidate.status}
                                        size="small"
                                        sx={{
                                            backgroundColor: 
                                                candidate.status === 'Approved' ? colors.success.bg :
                                                candidate.status === 'Pending' ? colors.warning.bg :
                                                candidate.status === 'Rejected' ? colors.error.bg :
                                                colors.info.bg,
                                            color:
                                                candidate.status === 'Approved' ? colors.success.dark :
                                                candidate.status === 'Pending' ? colors.warning.dark :
                                                candidate.status === 'Rejected' ? colors.error.dark :
                                                colors.info.dark,
                                            fontWeight: 500,
                                            border: '1px solid',
                                            borderColor:
                                                candidate.status === 'Approved' ? colors.success.light :
                                                candidate.status === 'Pending' ? colors.warning.light :
                                                candidate.status === 'Rejected' ? colors.error.light :
                                                colors.info.light,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewDetails(candidate)}
                                                sx={{ color: colors.primary.main }}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="More Actions">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuClick(e, candidate)}
                                                sx={{ color: colors.neutral[500] }}
                                            >
                                                <MoreIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Empty State */}
            {filteredCandidates.length === 0 && (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    px: 2,
                }}>
                    <PersonIcon sx={{ fontSize: 60, color: colors.neutral[300], mb: 2 }} />
                    <Typography variant="h6" sx={{ color: colors.neutral[600], mb: 1 }}>
                        No candidates found
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 2 }}>
                        Try adjusting your search or filter criteria
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleResetFilters}
                        sx={{
                            background: colors.primary.gradient,
                            color: 'white',
                        }}
                    >
                        Clear Filters
                    </Button>
                </Box>
            )}

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleStatusChange(selectedCandidate?.id, 'Approved')}>
                    <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText>Approve</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange(selectedCandidate?.id, 'Rejected')}>
                    <ListItemIcon>
                        <CancelIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Reject</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange(selectedCandidate?.id, 'Reviewing')}>
                    <ListItemIcon>
                        <ScheduleIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <ListItemText>Move to Review</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download Resume</ListItemText>
                </MenuItem>
            </Menu>

            {/* Dialogs */}
            <CandidateDetailsDialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                candidate={selectedCandidate}
            />

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer />
        </Box>
    );
};

export default VendorCandidatesPage;