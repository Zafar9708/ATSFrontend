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
    Tooltip,
    Menu,
    ListItemIcon,
    ListItemText,
    CircularProgress,
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
    MoreVert as MoreIcon,
    Download as DownloadIcon,
    PictureAsPdf as PdfIcon,
    Description as DescriptionIcon,
    Clear as ClearIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Color palette
const colors = {
    primary: {
        main: '#6366F1',
        light: '#818CF8',
        dark: '#4F46E5',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        bg: '#EEF2FF',
    },
    secondary: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
        bg: '#EFF6FF',
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

// Add Candidate Dialog Component
const AddCandidateDialog = ({ open, onClose, onAdd, vendors, jobs }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        vendor: '',
        vendorContact: '',
        jobTitle: '',
        matchScore: 85,
        status: 'Pending',
        skills: '',
        experience: '',
        relevantExperience: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            
            const newCandidate = {
                id: Date.now(),
                ...formData,
                skills: skillsArray,
                submissionDate: new Date().toISOString(),
                resume: 'resume.pdf',
                coverLetter: 'cover-letter.doc',
                matchScore: Number(formData.matchScore),
            };
            
            await onAdd(newCandidate);
            onClose();
            setFormData({
                name: '',
                email: '',
                vendor: '',
                vendorContact: '',
                jobTitle: '',
                matchScore: 85,
                status: 'Pending',
                skills: '',
                experience: '',
                relevantExperience: '',
            });
        } catch (error) {
            console.error('Error adding candidate:', error);
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
                        Add New Candidate
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
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            size="small"
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
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Vendor</InputLabel>
                            <Select
                                value={formData.vendor}
                                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                label="Vendor"
                            >
                                {vendors.map(v => (
                                    <MenuItem key={v} value={v}>{v}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Vendor Contact Email"
                            value={formData.vendorContact}
                            onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Job Title</InputLabel>
                            <Select
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                label="Job Title"
                            >
                                {jobs.map(j => (
                                    <MenuItem key={j} value={j}>{j}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Match Score (%)"
                            type="number"
                            value={formData.matchScore}
                            onChange={(e) => setFormData({ ...formData, matchScore: e.target.value })}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Skills (comma separated)"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            size="small"
                            helperText="Enter skills separated by commas"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Total Experience"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            placeholder="e.g., 5 years"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Relevant Experience"
                            value={formData.relevantExperience}
                            onChange={(e) => setFormData({ ...formData, relevantExperience: e.target.value })}
                            placeholder="e.g., 3 years"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                label="Status"
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Reviewing">Reviewing</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: colors.neutral[50] }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.name || !formData.email || !formData.vendor || !formData.jobTitle}
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Candidate'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, candidateName, loading }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                }
            }}
        >
            <DialogTitle sx={{ 
                background: colors.error.bg,
                color: colors.error.dark,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: `1px solid ${colors.error.light}`,
            }}>
                <DeleteIcon />
                <Typography variant="h6">Delete Candidate</Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ color: colors.neutral[700] }}>
                    Are you sure you want to delete <strong>{candidateName}</strong>?
                </Typography>
                <Typography variant="body2" sx={{ color: colors.neutral[500], mt: 1 }}>
                    This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Edit Candidate Dialog
const EditCandidateDialog = ({ open, onClose, onEdit, candidate, vendors, jobs }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        vendor: '',
        vendorContact: '',
        jobTitle: '',
        matchScore: 85,
        status: 'Pending',
        skills: '',
        experience: '',
        relevantExperience: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (candidate) {
            setFormData({
                name: candidate.name || '',
                email: candidate.email || '',
                vendor: candidate.vendor || '',
                vendorContact: candidate.vendorContact || '',
                jobTitle: candidate.jobTitle || '',
                matchScore: candidate.matchScore || 85,
                status: candidate.status || 'Pending',
                skills: candidate.skills ? candidate.skills.join(', ') : '',
                experience: candidate.experience || '',
                relevantExperience: candidate.relevantExperience || '',
            });
        }
    }, [candidate]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            
            const updatedCandidate = {
                ...candidate,
                ...formData,
                skills: skillsArray,
                matchScore: Number(formData.matchScore),
            };
            
            await onEdit(candidate.id, updatedCandidate);
            onClose();
        } catch (error) {
            console.error('Error editing candidate:', error);
        } finally {
            setLoading(false);
        }
    };

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
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <EditIcon />
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                        Edit Candidate
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
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            size="small"
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
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Vendor</InputLabel>
                            <Select
                                value={formData.vendor}
                                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                label="Vendor"
                            >
                                {vendors.map(v => (
                                    <MenuItem key={v} value={v}>{v}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Vendor Contact Email"
                            value={formData.vendorContact}
                            onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Job Title</InputLabel>
                            <Select
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                label="Job Title"
                            >
                                {jobs.map(j => (
                                    <MenuItem key={j} value={j}>{j}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Match Score (%)"
                            type="number"
                            value={formData.matchScore}
                            onChange={(e) => setFormData({ ...formData, matchScore: e.target.value })}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Skills (comma separated)"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Total Experience"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            placeholder="e.g., 5 years"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Relevant Experience"
                            value={formData.relevantExperience}
                            onChange={(e) => setFormData({ ...formData, relevantExperience: e.target.value })}
                            placeholder="e.g., 3 years"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                label="Status"
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Reviewing">Reviewing</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: colors.neutral[50] }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.name || !formData.email || !formData.vendor || !formData.jobTitle}
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Stat Card Component
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

// Candidate Details Dialog
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
                    <Grid item xs={12} display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                width: isMobile ? 60 : 80,
                                height: isMobile ? 60 : 80,
                                background: colors.secondary.gradient,
                                fontSize: isMobile ? '1.5rem' : '2rem',
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
                                    }}
                                />
                                <Chip
                                    label={`${candidate.matchScore}% Match`}
                                    size="small"
                                    sx={{
                                        background: colors.primary.bg,
                                        color: colors.primary.dark,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

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
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 600, mb: 2 }}>
                            Skills & Experience
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box>
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
                                        {candidate.experience || '5 years total'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                        Relevant: {candidate.relevantExperience || '3 years'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
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
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
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
                                }}
                            >
                                Cover Letter.doc
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', bgcolor: colors.neutral[50] }}>
                <Button onClick={onClose}>Close</Button>
                <Button
                    variant="contained"
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                    }}
                >
                    View Full Profile
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Vendor Candidates Component
const AdminVendorsPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Sidebar state - assume sidebar is 240px wide when open, 65px when collapsed
    const [sidebarOpen] = useState(true); // This would come from your app's state
    
    // Data states
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    
    // UI states
    const [searchQuery, setSearchQuery] = useState('');
    const [vendorFilter, setVendorFilter] = useState('all');
    const [jobFilter, setJobFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        vendor: 'all',
        job: 'all',
        status: 'all',
        dateRange: 'all',
    });
    
    // Dialog states
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Calculate sidebar offset
    const getSidebarOffset = () => {
        if (isMobile) return 0;
        return sidebarOpen ? '240px' : '65px';
    };

    // Get container width
    const getMainWidth = () => {
        if (isMobile) return '100%';
        return `calc(100% - ${sidebarOpen ? '240px' : '65px'})`;
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
            const matchScore = Math.floor(Math.random() * 30) + 70;
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

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c => 
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.vendor.toLowerCase().includes(query) ||
                c.jobTitle.toLowerCase().includes(query)
            );
        }

        if (vendorFilter !== 'all') {
            result = result.filter(c => c.vendor === vendorFilter);
        }

        if (jobFilter !== 'all') {
            result = result.filter(c => c.jobTitle === jobFilter);
        }

        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }

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
    };

    const handleViewDetails = (candidate) => {
        setSelectedCandidate(candidate);
        setDetailsDialogOpen(true);
    };

    const handleAddCandidate = (newCandidate) => {
        setCandidates(prev => [newCandidate, ...prev]);
        showSnackbar('Candidate added successfully!');
    };

    const handleEditCandidate = (id, updatedCandidate) => {
        setCandidates(prev => prev.map(c => 
            c.id === id ? updatedCandidate : c
        ));
        showSnackbar('Candidate updated successfully!');
    };

    const handleOpenEdit = (candidate, event) => {
        if (event) event.stopPropagation();
        setSelectedCandidate(candidate);
        setEditDialogOpen(true);
        setAnchorEl(null);
    };

    const handleOpenDelete = (candidate, event) => {
        if (event) event.stopPropagation();
        setSelectedCandidate(candidate);
        setDeleteDialogOpen(true);
        setAnchorEl(null);
    };

    const handleDeleteCandidate = async () => {
        if (!selectedCandidate) return;
        
        setDeleteLoading(true);
        try {
            setCandidates(prev => prev.filter(c => c.id !== selectedCandidate.id));
            showSnackbar('Candidate deleted successfully!');
            setDeleteDialogOpen(false);
            setSelectedCandidate(null);
        } catch (error) {
            showSnackbar(error.message, 'error');
        } finally {
            setDeleteLoading(false);
        }
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
                width: getMainWidth(),
                ml: getSidebarOffset(),
                bgcolor: colors.neutral[100],
            }}>
                <CircularProgress sx={{ color: colors.primary.main }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '1200px',
            minHeight: '100vh',
            p: isMobile ? 1.5 : 3,
            ml: getSidebarOffset(),
            transition: 'margin-left 0.3s ease, width 0.3s ease',
            mt: { xs: 7, sm: 8, md: 9 },
       
        }}>
            {/* Back Button */}
          <Box sx={{ mb: isMobile ? 1 : 2 }}>
  <Button
    startIcon={<ArrowBackIcon />}
    onClick={handleBack}
    sx={{
      // Text and icon color - blue
      color: '#1976d2',
      
      // Hover effect - blue text with light grey background
      '&:hover': {
        backgroundColor: '#f5f5f5',  // Light grey background on hover
        color: '#1565C0',  // Slightly darker blue on hover
      },
      
      // Responsive styles
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 500,
      textTransform: 'none',
      px: isMobile ? 1 : 2,
      py: isMobile ? 0.5 : 1,
      
      // Optional: smooth transition for hover effect
      transition: 'all 0.2s ease',
      
      // Remove default background
      backgroundColor: 'transparent',
    }}
  >
    Back  
  </Button>
</Box>

            {/* Snackbar */}
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
                justifyContent: 'space-between',
                mb: 3,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: 2
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                        Vendor Submissions
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                        Review and manage candidates submitted by recruitment vendors
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                            background: colors.primary.gradient,
                            filter: 'brightness(1.1)',
                        },
                        borderRadius: 2,
                        px: 3,
                    }}
                >
                    Add Candidate
                </Button>
            </Box>

        {/* Stats Cards - Increased Width */}
<Grid container spacing={3} sx={{ mb: 4, }}>
    <Grid item xs={12} sm={6} md={3} sx={{width:"23%"}}>
        <StatCard
            title="Total Submissions"
            value={stats.total}
            icon={PersonIcon}
            color={{ main: colors.primary.main, bg: colors.primary.bg }}
        />
    </Grid>
    <Grid item xs={12} sm={6} md={3} sx={{width:"23%"}}>
        <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={ScheduleIcon}
            color={{ main: colors.warning.main, bg: colors.warning.bg }}
        />
    </Grid>
    <Grid item xs={12} sm={6} md={3} sx={{width:"23%"}}>
        <StatCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircleIcon}
            color={{ main: colors.success.main, bg: colors.success.bg }}
        />
    </Grid>
    <Grid item xs={12} sm={6} md={3} sx={{width:"23%"}}>
        <StatCard
            title="Avg. Match"
            value={`${stats.avgMatch}%`}
            icon={StarIcon}
            color={{ main: colors.secondary.main, bg: colors.secondary.bg }}
        />
    </Grid>
</Grid>
            {/* Filter Section */}
            <Paper sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Search Field */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search candidates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: colors.neutral[400] }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={handleClearSearch}>
                                            <ClearIcon fontSize="small" sx={{ color: colors.neutral[400] }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Vendor Filter */}
                    <Grid item xs={12} sm={6} md={2}>
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

                    {/* Job Filter */}
                    <Grid item xs={12} sm={6} md={2}>
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

                    {/* Status Filter */}
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                                <MenuItem value="Reviewing">Reviewing</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Date Range Filter */}
                    <Grid item xs={12} sm={6} md={2}>
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

                    {/* Action Buttons */}
                    <Grid item xs={12} md={2}>
                        <Box display="flex" gap={1} ml="140px">
                            <Tooltip title="Reset Filters">
                                <IconButton 
                                    onClick={handleResetFilters}
                                    size="small"
                                    sx={{ 
                                        border: `1px solid ${colors.neutral[200]}`,
                                        borderRadius: 1,
                                    }}
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export Data">
                                <IconButton 
                                    onClick={handleExport}
                                    size="small"
                                    sx={{ 
                                        border: `1px solid ${colors.neutral[200]}`,
                                        borderRadius: 1,
                                    }}
                                >
                                    <ExportIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            {isMobile ? (
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
                                    >
                                        Filters
                                    </Button>
                                </Badge>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<FilterIcon />}
                                    onClick={handleResetFilters}
                                    size="small"
                                    sx={{
                                        background: colors.neutral[100],
                                        color: colors.neutral[700],
                                        '&:hover': {
                                            background: colors.neutral[200],
                                        },
                                        flex: 1,
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Active Filters */}
                {getFilterCount() > 0 && !isMobile && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                            Active Filters:
                        </Typography>
                        {vendorFilter !== 'all' && (
                            <Chip
                                label={`Vendor: ${vendorFilter}`}
                                onDelete={() => setVendorFilter('all')}
                                size="small"
                                sx={{
                                    backgroundColor: colors.primary.bg,
                                    color: colors.primary.dark,
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
                                }}
                            />
                        )}
                        {dateRange !== 'all' && (
                            <Chip
                                label={`Date: ${dateRange === 'today' ? 'Today' : 
                                       dateRange === 'week' ? 'Last 7 Days' :
                                       dateRange === 'month' ? 'Last 30 Days' :
                                       dateRange === 'quarter' ? 'Last 90 Days' : ''}`}
                                onDelete={() => setDateRange('all')}
                                size="small"
                                sx={{
                                    backgroundColor: colors.primary.bg,
                                    color: colors.primary.dark,
                                }}
                            />
                        )}
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
                            <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Vendor</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Job</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
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
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                                        <Typography variant="body2">{candidate.vendor}</Typography>
                                        <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                                            {candidate.vendorContact}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{candidate.jobTitle}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {new Date(candidate.submissionDate).toLocaleDateString()}
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
                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleOpenEdit(candidate, e)}
                                                sx={{ color: colors.info.main }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleOpenDelete(candidate, e)}
                                                sx={{ color: colors.error.main }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="More Actions">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuClick(e, candidate)}
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

            <AddCandidateDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onAdd={handleAddCandidate}
                vendors={vendors}
                jobs={jobs}
            />

            <EditCandidateDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onEdit={handleEditCandidate}
                candidate={selectedCandidate}
                vendors={vendors}
                jobs={jobs}
            />

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteCandidate}
                candidateName={selectedCandidate ? selectedCandidate.name : ''}
                loading={deleteLoading}
            />

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer />
        </Box>
    );
};

export default AdminVendorsPage;