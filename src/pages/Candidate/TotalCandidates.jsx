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
} from "@mui/material";
import {
    ViewModule as CardViewIcon,
    ViewHeadline as TableViewIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    AssignmentInd as InterviewIcon,
    ArrowForward as StageIcon,
    NoteAdd as RemarksIcon,
    Email as EmailIcon,
    Assessment as AnalysisIcon,
    CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

import CandidateDetailsPage from "../../pages/Candidate/CandidateDetailsPage";
import CandidateResumeAnalysis from "../../pages/Candidate/CandidateResumeAnalysis";
import candidateService from "../../services/Candidates/candidateService";
import stageService from "../../services/Candidates/stageService";
import BulkUploadDialog from "../../components/Candidates/BulkUploadDialog";
import ErrorBoundary from "../../components/ErrorBoundary";

// Dummy data for candidates
const DUMMY_CANDIDATES = [
    {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        mobile: "+1 (555) 123-4567",
        experience: 5,
        skills: ["React", "JavaScript", "Node.js", "MongoDB", "AWS"],
        source: "LinkedIn",
        stage: "interview",
        availableToJoin: 15,
        owner: { email: "recruiter1@company.com", name: "Sarah Smith" },
        vendor: "TechVendors Inc.",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_1.pdf",
        createdAt: "2024-01-15"
    },
    {
        _id: "2",
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@email.com",
        mobile: "+1 (555) 987-6543",
        experience: 3,
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        source: "Indeed",
        stage: "sourced",
        availableToJoin: 30,
        owner: { email: "recruiter2@company.com", name: "Mike Johnson" },
        vendor: "N/A",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_2.pdf",
        createdAt: "2024-02-01"
    },
    {
        _id: "3",
        firstName: "Robert",
        middleName: "James",
        lastName: "Chen",
        email: "robert.chen@email.com",
        mobile: "+1 (555) 456-7890",
        experience: 8,
        skills: ["Java", "Spring Boot", "Microservices", "Kubernetes", "Azure"],
        source: "Referral",
        stage: "preboarding",
        availableToJoin: 7,
        owner: { email: "recruiter3@company.com", name: "David Lee" },
        vendor: "Staffing Solutions",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_3.pdf",
        createdAt: "2024-01-28"
    },
    {
        _id: "4",
        firstName: "Sophia",
        lastName: "Rodriguez",
        email: "sophia.r@email.com",
        mobile: "+1 (555) 234-5678",
        experience: 2,
        skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "HTML/CSS"],
        source: "LinkedIn",
        stage: "rejected",
        availableToJoin: 0,
        owner: { email: "recruiter1@company.com", name: "Sarah Smith" },
        vendor: "N/A",
        rejectionType: "Skills Mismatch",
        rejectionReason: "Lacking required JavaScript framework experience",
        resume: "resume_4.pdf",
        createdAt: "2024-02-15"
    },
    {
        _id: "5",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.b@email.com",
        mobile: "+1 (555) 345-6789",
        experience: 6,
        skills: ["DevOps", "CI/CD", "Linux", "AWS", "Terraform"],
        source: "Career Website",
        stage: "hired",
        availableToJoin: 0,
        owner: { email: "recruiter4@company.com", name: "Amanda Taylor" },
        vendor: "Tech Recruiters Ltd.",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_5.pdf",
        createdAt: "2023-12-10"
    },
    {
        _id: "6",
        firstName: "Lisa",
        lastName: "Miller",
        email: "lisa.m@email.com",
        mobile: "+1 (555) 567-8901",
        experience: 4,
        skills: ["Salesforce", "CRM", "Business Analysis", "SQL"],
        source: "Indeed",
        stage: "archived",
        availableToJoin: 45,
        owner: { email: "recruiter2@company.com", name: "Mike Johnson" },
        vendor: "N/A",
        rejectionType: "",
        rejectionReason: "",
        resume: "",
        createdAt: "2024-02-20"
    },
    {
        _id: "7",
        firstName: "David",
        lastName: "Garcia",
        email: "david.g@email.com",
        mobile: "+1 (555) 678-9012",
        experience: 7,
        skills: ["Data Science", "Python", "Machine Learning", "TensorFlow", "SQL"],
        source: "LinkedIn",
        stage: "interview",
        availableToJoin: 21,
        owner: { email: "recruiter3@company.com", name: "David Lee" },
        vendor: "Data Recruiters Inc.",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_7.pdf",
        createdAt: "2024-01-05"
    },
    {
        _id: "8",
        firstName: "Jennifer",
        lastName: "Taylor",
        email: "jennifer.t@email.com",
        mobile: "+1 (555) 789-0123",
        experience: 1,
        skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
        source: "Campus Recruitment",
        stage: "sourced",
        availableToJoin: 60,
        owner: { email: "recruiter4@company.com", name: "Amanda Taylor" },
        vendor: "N/A",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_8.pdf",
        createdAt: "2024-03-01"
    },
    {
        _id: "9",
        firstName: "Kevin",
        lastName: "Wang",
        email: "kevin.w@email.com",
        mobile: "+1 (555) 890-1234",
        experience: 9,
        skills: ["Project Management", "Agile", "Scrum", "JIRA", "Confluence"],
        source: "Referral",
        stage: "rejected",
        availableToJoin: 0,
        owner: { email: "recruiter1@company.com", name: "Sarah Smith" },
        vendor: "Management Recruiters",
        rejectionType: "Salary Expectations",
        rejectionReason: "Salary expectations exceed budget",
        resume: "resume_9.pdf",
        createdAt: "2024-02-05"
    },
    {
        _id: "10",
        firstName: "Amanda",
        lastName: "Scott",
        email: "amanda.s@email.com",
        mobile: "+1 (555) 901-2345",
        experience: 5,
        skills: ["Marketing", "SEO", "Google Analytics", "Content Strategy"],
        source: "LinkedIn",
        stage: "preboarding",
        availableToJoin: 14,
        owner: { email: "recruiter2@company.com", name: "Mike Johnson" },
        vendor: "Marketing Staffing",
        rejectionType: "",
        rejectionReason: "",
        resume: "resume_10.pdf",
        createdAt: "2024-02-25"
    }
];

// Dummy data for stages
const DUMMY_STAGES = [
    { _id: "sourced", name: "Sourced" },
    { _id: "interview", name: "Interview" },
    { _id: "preboarding", name: "Preboarding" },
    { _id: "hired", name: "Hired" },
    { _id: "archived", name: "Archived" },
    { _id: "rejected", name: "Rejected" }
];

// Dummy data for rejection types
const DUMMY_REJECTION_TYPES = [
    "Skills Mismatch",
    "Salary Expectations",
    "Culture Fit",
    "Experience Level",
    "Location Constraints",
    "Candidate Withdrew",
    "Position Filled"
];

export const CandidatesTab = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const [viewMode, setViewMode] = useState("table");
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [interviewAnchorEl, setInterviewAnchorEl] = useState(null);
    const [stageAnchorEl, setStageAnchorEl] = useState(null);
    const [remarksAnchorEl, setRemarksAnchorEl] = useState(null);
    const [currentCandidate, setCurrentCandidate] = useState(null);
    const [candidates, setCandidates] = useState(DUMMY_CANDIDATES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewType, setInterviewType] = useState(null);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
    const [remarksText, setRemarksText] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [bulkMoveDialogOpen, setBulkMoveDialogOpen] = useState(false);
    const [newStage, setNewStage] = useState('');
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [stages, setStages] = useState(DUMMY_STAGES);
    const [stageOptions, setStageOptions] = useState(DUMMY_STAGES);
    const [rejectedFilter, setRejectedFilter] = useState('');
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
    const [selectedCandidateForAnalysis, setSelectedCandidateForAnalysis] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [rejectionTypes, setRejectionTypes] = useState(DUMMY_REJECTION_TYPES);
    const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        source: '',
        experience: '',
        availableToJoin: '',
        status: '',
        searchQuery: ''
    });

    // Fetch all candidates and related data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(false); // No loading needed for dummy data
                
                // Use dummy data instead of API
                setCandidates(DUMMY_CANDIDATES);
                setStages(DUMMY_STAGES);
                setStageOptions(DUMMY_STAGES);
                setRejectionTypes(DUMMY_REJECTION_TYPES);

            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError(err.message);
                showSnackbar(err.message, "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper function to get stage name
    const getStageName = (stage) => {
        if (!stage) return 'Sourced';
        
        if (typeof stage === 'string') {
            const foundStage = stages.find(s => s._id === stage) ||
                stageOptions.find(s => s._id === stage);
            return foundStage?.name || 'Sourced';
        }

        if (typeof stage === 'object') {
            if (stage.name) return stage.name;
            if (stage._id) {
                const foundStage = stages.find(s => s._id === stage._id) ||
                    stageOptions.find(s => s._id === stage._id);
                return foundStage?.name || 'Sourced';
            }
        }

        return 'Sourced';
    };

    // Helper function to get recruiter name
    const getRecruiterName = (owner) => {
        if (!owner) return 'Not assigned';
        
        if (typeof owner === 'string') {
            return owner;
        }
        
        if (typeof owner === 'object') {
            // Extract email and get the username part before @
            if (owner.email) {
                return owner.email.split('@')[0];
            }
            if (owner.name) {
                return owner.name;
            }
        }
        
        return 'Not assigned';
    };

    // Helper function to get vendor name
    const getVendorName = (candidate) => {
        // This is a placeholder - you'll need to adjust based on your API structure
        // If your API doesn't provide vendor information, you might need to fetch it separately
        return candidate.vendor || 'Not Specified';
    };

    // Helper function to format skills
    const formatSkills = (skills) => {
        if (!skills) return 'No skills listed';
        
        if (Array.isArray(skills)) {
            return skills.join(', ');
        }
        
        if (typeof skills === 'string') {
            return skills;
        }
        
        return 'No skills listed';
    };

    // Calculate candidate counts for all stages
    const calculateStageCounts = (candidates) => {
        const counts = {
            sourced: 0,
            interview: 0,
            preboarding: 0,
            hired: 0,
            archived: 0,
            rejected: 0,
            all: candidates.length
        };

        candidates.forEach(candidate => {
            if (!candidate) return;

            const stageName = getStageName(candidate.stage).toLowerCase();
            counts[stageName] = (counts[stageName] || 0) + 1;
        });

        return counts;
    };

    // Filter candidates based on filter criteria
    const getFilteredCandidates = () => {
        return candidates.filter(candidate => {
            if (!candidate) return false;

            // Status filter
            if (filters.status && filters.status.toLowerCase() !== 'sourced') {
                const candidateStageName = getStageName(candidate.stage).toLowerCase();
                if (candidateStageName !== filters.status.toLowerCase()) {
                    return false;
                }

                if (filters.status.toLowerCase() === 'rejected' && rejectedFilter) {
                    if (candidate.rejectionType !== rejectedFilter) {
                        return false;
                    }
                }
            }

            // Source filter
            if (filters.source) {
                const candidateSource = candidate.source;
                const sourceName = typeof candidateSource === 'string'
                    ? candidateSource
                    : candidateSource?.name;

                if (sourceName !== filters.source) {
                    return false;
                }
            }

            // Experience filter
            if (filters.experience) {
                const [min, max] = filters.experience.split('-').map(Number);
                const candidateExp = parseFloat(candidate.experience || 0);

                if (filters.experience === '5+' && candidateExp < 5) {
                    return false;
                }
                if (max && (candidateExp < min || candidateExp > max)) {
                    return false;
                }
            }

            // Availability filter
            if (filters.availableToJoin && (candidate.availableToJoin || 0) > parseInt(filters.availableToJoin)) {
                return false;
            }

            // Search filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const candidateText = [
                    candidate.firstName || '',
                    candidate.middleName || '',
                    candidate.lastName || '',
                    candidate.email || '',
                    candidate.mobile || '',
                    candidate.skills || ''
                ].join(' ').toLowerCase();

                if (!candidateText.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    };

    const stageCounts = calculateStageCounts(candidates);
    const filteredCandidates = getFilteredCandidates();

    const stageCardData = [
        {
            stage: 'sourced',
            label: 'All Candidates',
            count: stageCounts.all,
            totalCount: stageCounts.all
        },
        { stage: 'interview', label: 'Interview', count: stageCounts.interview },
        { stage: 'preboarding', label: 'Preboarding', count: stageCounts.preboarding },
        { stage: 'hired', label: 'Hired', count: stageCounts.hired },
        { stage: 'archived', label: 'Archived', count: stageCounts.archived },
        { stage: 'rejected', label: 'Rejected', count: stageCounts.rejected }
    ];

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSelectCandidate = (id) => {
        setSelectedCandidates((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const handleSelectAllCandidates = (event) => {
        if (event.target.checked) {
            const allIds = filteredCandidates.map((c) => c._id);
            setSelectedCandidates(allIds);
        } else {
            setSelectedCandidates([]);
        }
    };

    const handleOpenDetails = (candidate) => {
        setSelectedCandidate(candidate);
        setOpenDetailsDialog(true);
    };

    const handleNavigateToCandidate = (candidate) => {
        navigate(`/candidates/${candidate._id}`);
    };

    const handleCloseDetails = () => {
        setOpenDetailsDialog(false);
    };

    const handleInterviewClick = (event, candidateId) => {
        setCurrentCandidate(candidateId);
        setInterviewAnchorEl(event.currentTarget);
    };

    const handleStageClick = (event, candidateId) => {
        setCurrentCandidate(candidateId);
        setStageAnchorEl(event.currentTarget);
    };

    const handleRemarksClick = (event, candidateId) => {
        setCurrentCandidate(candidateId);
        setRemarksAnchorEl(event.currentTarget);
    };

    const handleCloseInterviewMenu = () => {
        setInterviewAnchorEl(null);
    };

    const handleCloseStageMenu = () => {
        setStageAnchorEl(null);
    };

    const handleCloseRemarksMenu = () => {
        setRemarksAnchorEl(null);
    };

    const handleInterviewOption = (option, candidateId) => {
        setInterviewType(option);
        setCurrentCandidate(candidates.find(c => c._id === candidateId));
        setShowInterviewModal(true);
        handleCloseInterviewMenu();
    };

    const handleStageMove = async (formData) => {
        try {
            // Simulate API call with dummy data
            setCandidates(prevCandidates => 
                prevCandidates.map(candidate => 
                    candidate._id === currentCandidate 
                        ? { ...candidate, stage: formData.stage }
                        : candidate
                )
            );
            showSnackbar("Candidate stage updated successfully!");
            setMoveDialogOpen(false);
        } catch (error) {
            console.error("Error updating candidate stage:", error);
            showSnackbar(error.message, "error");
        }
    };

    const handleBulkStageMove = async () => {
        try {
            // Simulate bulk update with dummy data
            setCandidates(prevCandidates => 
                prevCandidates.map(candidate => 
                    selectedCandidates.includes(candidate._id)
                        ? { ...candidate, stage: newStage }
                        : candidate
                )
            );
            setSelectedCandidates([]);
            setBulkMoveDialogOpen(false);
            showSnackbar("Candidates moved successfully!");
        } catch (error) {
            console.error("Error moving candidates:", error);
            showSnackbar(error.message, "error");
        }
    };

    const handleBulkEmail = async () => {
        setEmailDialogOpen(true);
    };

    const handleSendBulkEmail = async () => {
        if (!emailSubject || !emailBody) {
            showSnackbar("Please enter both subject and body", "error");
            return;
        }

        try {
            setIsSendingEmail(true);
            const selectedCandidateEmails = candidates
                .filter(c => selectedCandidates.includes(c._id))
                .map(c => c.email);

            if (selectedCandidateEmails.length === 0) {
                showSnackbar("No candidates selected", "error");
                return;
            }

            // Simulate email sending
            setTimeout(() => {
                showSnackbar(`Email sent to ${selectedCandidateEmails.length} candidates`, "success");
                setEmailDialogOpen(false);
                setEmailSubject('');
                setEmailBody('');
                setIsSendingEmail(false);
            }, 1500);

        } catch (error) {
            console.error("Error sending bulk email:", error);
            showSnackbar(error.message, "error");
            setIsSendingEmail(false);
        }
    };

    const handleBulkAction = async (action) => {
        if (action === "delete") {
            try {
                // Simulate delete with dummy data
                setCandidates(prevCandidates => 
                    prevCandidates.filter(candidate => !selectedCandidates.includes(candidate._id))
                );
                setSelectedCandidates([]);
                showSnackbar("Candidate(s) deleted successfully!");
            } catch (error) {
                console.error("Bulk delete failed:", error);
                showSnackbar(error.message, "error");
            }
        } else if (action === "email") {
            handleBulkEmail();
        } else if (action === "move-to-sourced") {
            setBulkMoveDialogOpen(true);
        }
    };

    const handleFilterChange = (filterName) => (event) => {
        setFilters({
            ...filters,
            [filterName]: event.target.value
        });

        if (filterName === 'status' && event.target.value.toLowerCase() !== 'rejected') {
            setRejectedFilter('');
        }
    };

    const handleRejectedFilterChange = (event) => {
        setRejectedFilter(event.target.value);
    };

    const handleOpenAnalysis = async (candidateId) => {
        const candidate = candidates.find(c => c._id === candidateId);
        if (!candidate) return;

        setSelectedCandidateForAnalysis(candidate);
        setAnalysisLoading(true);
        setAnalysisDialogOpen(true);

        try {
            // Simulate analysis data
            setTimeout(() => {
                setAnalysisData({
                    score: 85,
                    skillsMatch: candidate.skills || [],
                    missingSkills: ["Advanced Testing", "Cloud Architecture"],
                    experience: candidate.experience,
                    education: "Bachelor's Degree",
                    recommendations: [
                        "Strong technical background",
                        "Good cultural fit",
                        "Recommend for technical interview"
                    ]
                });
                setAnalysisLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching resume analysis:", error);
            showSnackbar(error.message || "Failed to fetch resume analysis", "error");
            setAnalysisData(null);
            setAnalysisLoading(false);
        }
    };

    const handleAddRemarks = () => {
        handleCloseRemarksMenu();
        setRemarksDialogOpen(true);
    };

    const handleSubmitRemarks = async () => {
        try {
            // Simulate adding remarks
            showSnackbar("Remarks added successfully!");
            setRemarksDialogOpen(false);
            setRemarksText('');
        } catch (error) {
            console.error('Error saving remarks:', error);
            showSnackbar(error.message, "error");
        }
    };

    const handleStageCardClick = (stage) => {
        if (stage === 'sourced') {
            setFilters({
                ...filters,
                status: ''
            });
        } else {
            setFilters({
                ...filters,
                status: stage
            });
        }
        setRejectedFilter('');
    };

    const handleRejectedCardClick = () => {
        setFilters({
            ...filters,
            status: 'rejected'
        });
        setRejectedFilter('');
    };

    const handleBulkUploadComplete = () => {
        // Refresh the candidates list after bulk upload
        showSnackbar("Bulk upload completed successfully!", "success");
        setBulkUploadOpen(false);
    };

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: { xs: 1, sm: 2 },
            width: 'auto',
            boxSizing: 'border-box',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            marginLeft:8
        }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between", 
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 3,
                flexShrink: 0
            }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    All Candidates ({candidates.length})
                </Typography>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-end' }
                }}>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => setBulkUploadOpen(true)}
                        sx={{ 
                            mr: 1,
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Bulk Upload
                    </Button>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newMode) => newMode && setViewMode(newMode)}
                        size="small"
                    >
                        <ToggleButton value="table" aria-label="table view">
                            <TableViewIcon />
                        </ToggleButton>
                        <ToggleButton value="card" aria-label="card view">
                            <CardViewIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {/* Stages Summary */}
            <Card sx={{ mb: 2, overflow: "hidden", flexShrink: 0 }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: 2, 
                        justifyContent: "center",
                        py: 2 
                    }}>
                        {stageCardData.map(({ stage, label, count, totalCount }) => (
                            <Card
                                key={stage}
                                id={stage === 'rejected' ? 'rejected-card' : undefined}
                                onClick={() => {
                                    if (stage === 'rejected') {
                                        handleRejectedCardClick();
                                    } else {
                                        handleStageCardClick(stage);
                                    }
                                }}
                                sx={{
                                    backgroundColor: (stage === 'sourced' && !filters.status) ||
                                        (stage !== 'sourced' && filters.status.toLowerCase() === stage) ?
                                        "#e3f2fd" : "#f5f5f5",
                                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: '150px' },
                                    maxWidth: '150px',
                                    minWidth: '120px',
                                    textAlign: "center",
                                    borderRadius: 2,
                                    p: 2,
                                    boxShadow: 2,
                                    flexShrink: 0,
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                    ":hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 4,
                                    }
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {stage === 'sourced' ? `${totalCount}` : count}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {label}
                                </Typography>
                            </Card>
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Rejected Filter */}
            {filters.status.toLowerCase() === 'rejected' && (
                <Box sx={{ mb: 2, flexShrink: 0 }}>
                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                        <InputLabel>Rejection Type</InputLabel>
                        <Select
                            value={rejectedFilter}
                            onChange={handleRejectedFilterChange}
                            label="Rejection Type"
                        >
                            <MenuItem value="">All Rejected</MenuItem>
                            {rejectionTypes.map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Filters */}
            <Card sx={{ mb: 2, flexShrink: 0 }}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Filters
                    </Typography>
                    <Box sx={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: 2,
                        '& .MuiFormControl-root, & .MuiTextField-root': {
                            flex: '1 1 200px',
                            minWidth: { xs: '100%', sm: '200px' },
                            maxWidth: { xs: '100%', sm: '300px' }
                        }
                    }}>
                        <FormControl size="small">
                            <InputLabel>Source</InputLabel>
                            <Select
                                label="Source"
                                value={filters.source}
                                onChange={handleFilterChange('source')}
                            >
                                <MenuItem value="">All Sources</MenuItem>
                                {Array.from(new Set(candidates
                                    .map(c => {
                                        if (!c) return null;
                                        if (typeof c.source === 'string') return c.source;
                                        if (c.source && typeof c.source === 'object') return c.source.name;
                                        return null;
                                    })
                                    .filter(Boolean)
                                )).map(source => (
                                    <MenuItem key={source} value={source}>{source}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small">
                            <InputLabel>Experience</InputLabel>
                            <Select
                                label="Experience"
                                value={filters.experience}
                                onChange={handleFilterChange('experience')}
                            >
                                <MenuItem value="">All Experience</MenuItem>
                                <MenuItem value="0-2">0-2 years</MenuItem>
                                <MenuItem value="3-5">3-5 years</MenuItem>
                                <MenuItem value="5+">5+ years</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small">
                            <InputLabel>Available to join (In Days)</InputLabel>
                            <Select
                                label="Available to join (In Days)"
                                value={filters.availableToJoin}
                                onChange={handleFilterChange('availableToJoin')}
                            >
                                <MenuItem value="">Any Availability</MenuItem>
                                <MenuItem value="7">Within 7 days</MenuItem>
                                <MenuItem value="15">Within 15 days</MenuItem>
                                <MenuItem value="30">Within 30 days</MenuItem>
                                <MenuItem value="60">Within 60 days</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                value={filters.status}
                                onChange={handleFilterChange('status')}
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                {stageOptions.map(option => (
                                    <MenuItem key={option._id || option} value={option.name || option}>
                                        {option.name || option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            placeholder="Search candidates..."
                            value={filters.searchQuery}
                            onChange={handleFilterChange('searchQuery')}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <IconButton size="small">
                                        <FilterIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedCandidates.length > 0 && (
                <Box sx={{ 
                    mb: 2, 
                    display: "flex", 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    flexShrink: 0
                }}>
                    <Typography variant="body2">{selectedCandidates.length} selected</Typography>
                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                        <InputLabel>Bulk Actions</InputLabel>
                        <Select
                            label="Bulk Actions"
                            defaultValue=""
                            onChange={(e) => handleBulkAction(e.target.value)}
                        >
                            <MenuItem value="email">
                                <ListItemIcon>
                                    <EmailIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Send email</ListItemText>
                            </MenuItem>
                            <MenuItem value="delete">Delete</MenuItem>
                            <MenuItem value="move-to-sourced">
                                <ListItemIcon>
                                    <StageIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Move to another Stage</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Bulk Move Dialog */}
            <Dialog open={bulkMoveDialogOpen} onClose={() => setBulkMoveDialogOpen(false)}>
                <DialogTitle>Move Selected Candidates to Another Stage</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>New Stage</InputLabel>
                        <Select
                            value={newStage}
                            onChange={(e) => setNewStage(e.target.value)}
                            label="New Stage"
                        >
                            {stageOptions.map(option => (
                                <MenuItem key={option._id || option} value={option._id || option}>
                                    {option.name || option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkMoveDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleBulkStageMove}
                        variant="contained"
                        disabled={!newStage}
                    >
                        Move Candidates
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Email Dialog */}
            <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Send Email to Selected Candidates</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subject"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        margin="dense"
                        label="Email Body"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={10}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        This email will be sent to {selectedCandidates.length} selected candidates.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSendBulkEmail}
                        variant="contained"
                        disabled={isSendingEmail || !emailSubject || !emailBody}
                        startIcon={isSendingEmail ? <CircularProgress size={20} /> : null}
                    >
                        {isSendingEmail ? 'Sending...' : 'Send Email'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Interview Menu */}
            <Menu
                anchorEl={interviewAnchorEl}
                open={Boolean(interviewAnchorEl)}
                onClose={handleCloseInterviewMenu}
            >
                <MenuItem onClick={() => handleInterviewOption("online", currentCandidate)}>
                    <ListItemText>Schedule Online Interview</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleInterviewOption("offline", currentCandidate)}>
                    <ListItemText>Schedule Offline Interview</ListItemText>
                </MenuItem>
            </Menu>

            {/* Stage Menu */}
            <Menu
                anchorEl={stageAnchorEl}
                open={Boolean(stageAnchorEl)}
                onClose={handleCloseStageMenu}
            >
                <MenuItem onClick={() => {
                    setMoveDialogOpen(true);
                    handleCloseStageMenu();
                }}>
                    <ListItemText>Move to Another Stage</ListItemText>
                </MenuItem>
            </Menu>

            {/* Remarks Menu */}
            <Menu
                anchorEl={remarksAnchorEl}
                open={Boolean(remarksAnchorEl)}
                onClose={handleCloseRemarksMenu}
            >
                <MenuItem onClick={handleAddRemarks}>
                    <ListItemIcon>
                        <RemarksIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add Remarks</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog open={remarksDialogOpen} onClose={() => setRemarksDialogOpen(false)}>
                <DialogTitle>Add Remarks</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="remarks"
                        label="Remarks"
                        type="text"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={4}
                        value={remarksText}
                        onChange={(e) => setRemarksText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemarksDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitRemarks}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Resume Analysis Dialog */}
            <Dialog
                open={analysisDialogOpen}
                onClose={() => setAnalysisDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px'
                }}>
                    <Box display="flex" alignItems="center">
                        <AnalysisIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            Resume Analysis - {selectedCandidateForAnalysis?.firstName} {selectedCandidateForAnalysis?.lastName}
                        </Typography>
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setAnalysisDialogOpen(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    {analysisLoading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px'
                        }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <CandidateResumeAnalysis
                            open={analysisDialogOpen}
                            onClose={() => setAnalysisDialogOpen(false)}
                            candidate={selectedCandidateForAnalysis}
                            analysisData={analysisData}
                            loading={analysisLoading}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Bulk Upload Dialog */}
            <BulkUploadDialog
                open={bulkUploadOpen}
                onClose={() => setBulkUploadOpen(false)}
                onUploadComplete={handleBulkUploadComplete}
            />

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flex: 1 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Main Content Area - This will take remaining space */}
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0 // Important for proper scrolling
            }}>
                {/* Candidate Views */}
                {!loading && viewMode === "table" ? (
                    <TableContainer 
                        component={Paper} 
                        sx={{ 
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            '& .MuiTable-root': {
                                minWidth: '800px'
                            },
                            '& .MuiTableCell-root': {
                                py: 1.5,
                                px: 1.5,
                                whiteSpace: 'nowrap'
                            }
                        }}
                    >
                        <Table 
                            stickyHeader
                            sx={{ 
                                tableLayout: 'fixed',
                                width: '100%'
                            }}
                        >
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell padding="checkbox" width="5%">
                                        <Checkbox
                                            onChange={handleSelectAllCandidates}
                                            checked={selectedCandidates.length === filteredCandidates.length}
                                            sx={{ color: '#3f51b5' }}
                                        />
                                    </TableCell>

                                    <TableCell width="20%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Name
                                    </TableCell>
                                    <TableCell width="10%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Status
                                    </TableCell>
                                    <TableCell width="15%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Email
                                    </TableCell>
                                    <TableCell width="12%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Phone
                                    </TableCell>
                                    <TableCell width="20%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Skills
                                    </TableCell>
                                    <TableCell width="10%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Recruiter
                                    </TableCell>
                                    <TableCell width="8%" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCandidates.map((candidate) => (
                                    <TableRow
                                        key={candidate._id}
                                        hover
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => handleNavigateToCandidate(candidate)}
                                    >
                                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedCandidates.includes(candidate._id)}
                                                onChange={() => handleSelectCandidate(candidate._id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {`${candidate.firstName || ''} ${candidate.middleName || ''} ${candidate.lastName || ''}`.trim()}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                                    {candidate.experience || '0'} yrs • {candidate.availableToJoin || '0'} days
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                                    {typeof candidate.source === 'string'
                                                        ? candidate.source
                                                        : candidate.source?.name || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <ErrorBoundary>
                                                <Box>
                                                    {(() => {
                                                        try {
                                                            const stageName = String(getStageName(candidate?.stage || 'Sourced'));
                                                            const rejectionType = candidate?.rejectionType
                                                                ? String(candidate.rejectionType)
                                                                : null;

                                                            return (
                                                                <>
                                                                    <Typography component="span">
                                                                        {stageName}
                                                                    </Typography>
                                                                    {stageName === "Rejected" && rejectionType && (
                                                                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                                            {rejectionType}
                                                                        </Typography>
                                                                    )}
                                                                </>
                                                            );
                                                        } catch (error) {
                                                            console.error('Error rendering stage:', error);
                                                            return (
                                                                <Typography color="error">
                                                                    Error loading stage
                                                                </Typography>
                                                            );
                                                        }
                                                    })()}
                                                </Box>
                                            </ErrorBoundary>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {candidate.email || 'Not provided'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {candidate.mobile || 'Not provided'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={formatSkills(candidate.skills)}>
                                                <Typography variant="body2" sx={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {formatSkills(candidate.skills)}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {getRecruiterName(candidate.owner)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AnalysisIcon />}
                                                    onClick={() => handleOpenAnalysis(candidate._id)}
                                                    disabled={!candidate.resume}
                                                    size="small"
                                                    sx={{ 
                                                        minWidth: '100px',
                                                        '& .MuiButton-startIcon': {
                                                            mr: 0.5
                                                        }
                                                    }}
                                                >
                                                    Analysis
                                                </Button>
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <IconButton
                                                        className="action-button"
                                                        onClick={(e) => handleInterviewClick(e, candidate._id)}
                                                        size="small"
                                                        sx={{ p: 0.5 }}
                                                    >
                                                        <InterviewIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        className="action-button"
                                                        onClick={(e) => handleStageClick(e, candidate._id)}
                                                        size="small"
                                                        sx={{ p: 0.5 }}
                                                    >
                                                        <StageIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { 
                                xs: "1fr", 
                                sm: "repeat(2, 1fr)", 
                                md: "repeat(3, 1fr)",
                                lg: "repeat(4, 1fr)"
                            },
                            gap: 2,
                            flex: 1,
                            overflowY: 'auto',
                            pb: 2,
                            alignContent: 'flex-start'
                        }}
                    >
                        {filteredCandidates.map((candidate) => (
                            <Card
                                key={candidate._id}
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    ":hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 6,
                                    },
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 'fit-content',
                                    minHeight: '280px',
                                    bgcolor: "background.paper",
                                }}
                            >
                                <CardContent
                                    sx={{ display: "flex", flexDirection: "column", gap: 1.5, padding: 2, height: '100%' }}
                                >
                                    {/* Header: Name, Avatar, and Checkbox */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Checkbox
                                            checked={selectedCandidates.includes(candidate._id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleSelectCandidate(candidate._id);
                                            }}
                                            color="primary"
                                            sx={{ padding: 0 }}
                                        />
                                        <Avatar
                                            sx={{
                                                bgcolor: "primary.main",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                width: 36,
                                                height: 36,
                                            }}
                                            onClick={() => handleNavigateToCandidate(candidate)}
                                        >
                                            {candidate.firstName?.charAt(0) || '?'}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }} onClick={() => handleNavigateToCandidate(candidate)}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: '0.75rem' }}>
                                                {candidate.experience || '0'}y • {candidate.availableToJoin || '0'}d
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Status Chip */}
                                    <Chip
                                        label={getStageName(candidate.stage)}
                                        color={
                                            getStageName(candidate.stage) === "Hired" ? "success" :
                                            getStageName(candidate.stage) === "Archived" ? "default" : "primary"
                                        }
                                        size="small"
                                        sx={{
                                            alignSelf: "flex-start",
                                            fontWeight: "bold",
                                            fontSize: '0.7rem',
                                            height: '24px',
                                            mb: 1,
                                        }}
                                    />

                                    {/* Rejection Details */}
                                    {getStageName(candidate.stage) === "Rejected" && candidate.rejectionType && (
                                        <Box sx={{
                                            backgroundColor: '#ffeeee',
                                            p: 0.75,
                                            borderRadius: 1,
                                            borderLeft: '3px solid #f44336'
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                                {candidate.rejectionType}
                                            </Typography>
                                            {candidate.rejectionReason && (
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25, fontSize: '0.7rem' }}>
                                                    {candidate.rejectionReason}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* Skills */}
                                    <Box onClick={() => handleNavigateToCandidate(candidate)} sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500", fontSize: '0.8rem', mb: 0.5 }}>
                                            Skills:
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: "text.secondary", 
                                            fontSize: '0.75rem', 
                                            lineHeight: 1.3,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            minHeight: '2.8rem'
                                        }}>
                                            {formatSkills(candidate.skills)}
                                        </Typography>
                                    </Box>

                                    {/* Contact Info */}
                                    <Box onClick={() => handleNavigateToCandidate(candidate)}>
                                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500", fontSize: '0.8rem' }}>
                                            Email:
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: "text.secondary", 
                                            fontSize: '0.75rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {candidate.email || 'Not provided'}
                                        </Typography>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginTop: 'auto',
                                            gap: 1,
                                            pt: 1
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button
                                            variant="contained"
                                            startIcon={<AnalysisIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenAnalysis(candidate._id);
                                            }}
                                            disabled={!candidate.resume}
                                            sx={{
                                                flex: 1,
                                                textTransform: 'none',
                                                fontSize: '0.7rem',
                                                padding: '0.3rem 0.6rem',
                                            }}
                                        >
                                            Analysis
                                        </Button>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInterviewClick(e, candidate._id);
                                            }}
                                            sx={{
                                                backgroundColor: "primary.main",
                                                color: "white",
                                                borderRadius: "50%",
                                                padding: 0.75,
                                                ":hover": { backgroundColor: "primary.dark" },
                                            }}
                                            size="small"
                                        >
                                            <InterviewIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStageClick(e, candidate._id);
                                            }}
                                            sx={{
                                                backgroundColor: "secondary.main",
                                                color: "white",
                                                borderRadius: "50%",
                                                padding: 0.75,
                                                ":hover": { backgroundColor: "secondary.dark" },
                                            }}
                                            size="small"
                                        >
                                            <StageIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
            
            {openDetailsDialog && (
                <CandidateDetailsPage
                    open={openDetailsDialog}
                    onClose={handleCloseDetails}
                    candidate={selectedCandidate}
                />
            )}
        </Box>
    );
};