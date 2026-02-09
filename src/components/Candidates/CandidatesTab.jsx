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
} from "@mui/material";
import {
    ViewModule as CardViewIcon,
    ViewHeadline as TableViewIcon,
    Add as AddIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    AssignmentInd as InterviewIcon,
    ArrowForward as StageIcon,
    NoteAdd as RemarksIcon,
    Email as EmailIcon,
    Assessment as AnalysisIcon,
    CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Import all components
import AddCandidateForm from "./AddCandidateForm";
import ScheduleOfflineInterviewForm from "../../pages/Interview/ScheduleOfflineInterviewForm";
import ScheduleOnlineInterviewForm from "../../pages/Interview/ScheduleOnlineInterviewForm";
import MoveCandidateForm from "./MoveCandidateForm";
import CandidateDetailsPage from "../../pages/Candidate/CandidateDetailsPage";
import CandidateResumeAnalysis from "../../pages/Candidate/CandidateResumeAnalysis";
import BulkUploadDialog from "./BulkUploadDialog";
import ErrorBoundary from "../ErrorBoundary";

const CandidatesTab = () => {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState("table");
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [openAddCandidate, setOpenAddCandidate] = useState(false);
    const [interviewAnchorEl, setInterviewAnchorEl] = useState(null);
    const [stageAnchorEl, setStageAnchorEl] = useState(null);
    const [remarksAnchorEl, setRemarksAnchorEl] = useState(null);
    const [currentCandidate, setCurrentCandidate] = useState(null);
    const [candidates, setCandidates] = useState([]);
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
    const [stages, setStages] = useState([]);
    const [stageOptions, setStageOptions] = useState([]);
    const [rejectedFilter, setRejectedFilter] = useState('');
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
    const [selectedCandidateForAnalysis, setSelectedCandidateForAnalysis] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [rejectionTypes, setRejectionTypes] = useState([]);
    const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
    
    // Filter state
    const [filters, setFilters] = useState({
        source: '',
        experience: '',
        availableToJoin: '',
        status: '',
        searchQuery: ''
    });

    // Dummy data
    const dummyCandidates = [
        {
            _id: "1",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@email.com",
            mobile: "+1 (555) 123-4567",
            experience: 5,
            source: "LinkedIn",
            stage: { _id: "2", name: "Interview" },
            availableToJoin: 15,
            status: "active",
            owner: "Alex Johnson",
            skills: "React, JavaScript, TypeScript, Node.js",
            rejectionType: "",
            resume: "john_smith_resume.pdf"
        },
        {
            _id: "2",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.j@email.com",
            mobile: "+1 (555) 987-6543",
            experience: 3,
            source: "Indeed",
            stage: { _id: "1", name: "Screening" },
            availableToJoin: 7,
            status: "active",
            owner: "Maria Garcia",
            skills: "React, Redux, HTML/CSS, Jest",
            rejectionType: "",
            resume: "sarah_johnson_resume.pdf"
        },
        {
            _id: "3",
            firstName: "Michael",
            lastName: "Chen",
            email: "michael.c@email.com",
            mobile: "+1 (555) 456-7890",
            experience: 7,
            source: "Referral",
            stage: { _id: "3", name: "Offer" },
            availableToJoin: 30,
            status: "active",
            owner: "David Kim",
            skills: "React, TypeScript, GraphQL, AWS",
            rejectionType: "",
            resume: "michael_chen_resume.pdf"
        },
        {
            _id: "4",
            firstName: "Emma",
            lastName: "Davis",
            email: "emma.d@email.com",
            mobile: "+1 (555) 234-5678",
            experience: 4,
            source: "LinkedIn",
            stage: { _id: "4", name: "Hired" },
            availableToJoin: 60,
            status: "hired",
            owner: "Alex Johnson",
            skills: "React, JavaScript, Docker, Kubernetes",
            rejectionType: "",
            resume: "emma_davis_resume.pdf"
        },
        {
            _id: "5",
            firstName: "Robert",
            lastName: "Wilson",
            email: "robert.w@email.com",
            mobile: "+1 (555) 345-6789",
            experience: 6,
            source: "Career Site",
            stage: { _id: "5", name: "Rejected" },
            availableToJoin: 45,
            status: "rejected",
            owner: "Maria Garcia",
            skills: "React, Node.js, MongoDB, Express",
            rejectionType: "Technical Assessment Failed",
            resume: "robert_wilson_resume.pdf"
        },
        {
            _id: "6",
            firstName: "Lisa",
            lastName: "Brown",
            email: "lisa.b@email.com",
            mobile: "+1 (555) 567-8901",
            experience: 8,
            source: "LinkedIn",
            stage: { _id: "2", name: "Interview" },
            availableToJoin: 10,
            status: "active",
            owner: "David Kim",
            skills: "React, TypeScript, Python, Django",
            rejectionType: "",
            resume: "lisa_brown_resume.pdf"
        },
        {
            _id: "7",
            firstName: "James",
            lastName: "Wilson",
            email: "james.w@email.com",
            mobile: "+1 (555) 678-9012",
            experience: 2,
            source: "Indeed",
            stage: { _id: "1", name: "Sourced" },
            availableToJoin: 20,
            status: "active",
            owner: "Alex Johnson",
            skills: "React, JavaScript, CSS",
            rejectionType: "",
            resume: "james_wilson_resume.pdf"
        },
        {
            _id: "8",
            firstName: "Anna",
            lastName: "Taylor",
            email: "anna.t@email.com",
            mobile: "+1 (555) 789-0123",
            experience: 5,
            source: "Referral",
            stage: { _id: "2", name: "Interview" },
            availableToJoin: 14,
            status: "active",
            owner: "Maria Garcia",
            skills: "React, Vue.js, Node.js, MongoDB",
            rejectionType: "",
            resume: "anna_taylor_resume.pdf"
        }
    ];

    const dummyStages = [
        { _id: "1", name: "Sourced" },
        { _id: "2", name: "Screening" },
        { _id: "3", name: "Interview" },
        { _id: "4", name: "Offer" },
        { _id: "5", name: "Hired" },
        { _id: "6", name: "Rejected" },
        { _id: "7", name: "Archived" }
    ];

    const dummyRejectionTypes = [
        "Technical Assessment Failed",
        "Cultural Fit Mismatch",
        "Salary Expectations Too High",
        "Found Better Candidate",
        "Position Closed",
        "Candidate Withdrew"
    ];

    const dummySources = ["LinkedIn", "Indeed", "Referral", "Career Site", "Glassdoor", "Other"];

    // Initialize data
    useEffect(() => {
        // Simulate loading delay
        setTimeout(() => {
            setCandidates(dummyCandidates);
            setStages(dummyStages);
            setStageOptions(dummyStages);
            setRejectionTypes(dummyRejectionTypes);
            setLoading(false);
        }, 500);
    }, [id]);

    // Helper function to get stage name
    const getStageName = (stage) => {
        if (!stage) return 'Sourced';
        
        if (typeof stage === 'string') {
            const foundStage = dummyStages.find(s => s._id === stage) ||
                dummyStages.find(s => s.name === stage);
            return foundStage?.name || 'Sourced';
        }
        
        if (typeof stage === 'object') {
            if (stage.name) return stage.name;
            if (stage._id) {
                const foundStage = dummyStages.find(s => s._id === stage._id);
                return foundStage?.name || 'Sourced';
            }
        }
        
        return 'Sourced';
    };

    // Calculate candidate counts for all stages
    const calculateStageCounts = (candidates) => {
        const counts = {
            sourced: 0,
            screening: 0,
            interview: 0,
            offer: 0,
            hired: 0,
            archived: 0,
            rejected: 0,
            all: candidates.length
        };

        candidates.forEach(candidate => {
            if (!candidate) return;

            const stageName = getStageName(candidate.stage).toLowerCase();
            if (stageName in counts) {
                counts[stageName]++;
            }
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
            if (filters.source && candidate.source !== filters.source) {
                return false;
            }

            // Experience filter
            if (filters.experience) {
                const candidateExp = candidate.experience || 0;
                
                if (filters.experience === '0-2' && (candidateExp < 0 || candidateExp > 2)) {
                    return false;
                }
                if (filters.experience === '3-5' && (candidateExp < 3 || candidateExp > 5)) {
                    return false;
                }
                if (filters.experience === '5+' && candidateExp < 5) {
                    return false;
                }
            }

            // Available to join filter
            if (filters.availableToJoin && candidate.availableToJoin > parseInt(filters.availableToJoin)) {
                return false;
            }

            // Search query filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const candidateText = [
                    candidate.firstName || '',
                    candidate.lastName || '',
                    candidate.email || '',
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
    
    const stageCardData = [
        {
            stage: 'sourced',
            label: 'Sourced',
            count: stageCounts.all,
            totalCount: stageCounts.all
        },
        { stage: 'screening', label: 'Screening', count: stageCounts.screening },
        { stage: 'interview', label: 'Interview', count: stageCounts.interview },
        { stage: 'offer', label: 'Offer', count: stageCounts.offer },
        { stage: 'hired', label: 'Hired', count: stageCounts.hired },
        { stage: 'rejected', label: 'Rejected', count: stageCounts.rejected }
    ];

    // Snackbar handler
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
            const allIds = getFilteredCandidates().map((c) => c._id);
            setSelectedCandidates(allIds);
        } else {
            setSelectedCandidates([]);
        }
    };

    const handleOpenAddCandidate = () => {
        setOpenAddCandidate(true);
    };

    const handleCloseAddCandidate = () => {
        setOpenAddCandidate(false);
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

    const handleSubmitCandidate = async (formData) => {
        try {
            // Simulate API call
            const newCandidate = {
                _id: Date.now().toString(),
                ...formData,
                owner: localStorage.getItem("user_name") || 'Not assigned',
                status: 'active',
                stage: { _id: "1", name: "Sourced" }
            };

            setCandidates(prev => [...prev, newCandidate]);
            showSnackbar("Candidate added successfully!");
            handleCloseAddCandidate();
        } catch (error) {
            console.error("Error adding candidate:", error);
            showSnackbar("Failed to add candidate", "error");
        }
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
        const candidate = candidates.find(c => c._id === candidateId);
        setCurrentCandidate(candidate);
        setShowInterviewModal(true);
        handleCloseInterviewMenu();
    };

    const handleStageMove = async (formData) => {
        try {
            // Simulate API update
            setCandidates(prev => prev.map(candidate => 
                candidate._id === currentCandidate?._id 
                    ? { ...candidate, stage: { _id: formData.stage, name: getStageName(formData.stage) } }
                    : candidate
            ));
            showSnackbar("Candidate stage updated successfully!");
            setMoveDialogOpen(false);
        } catch (error) {
            console.error("Error updating candidate stage:", error);
            showSnackbar("Failed to update stage", "error");
        }
    };

    const handleBulkStageMove = async () => {
        try {
            // Simulate bulk update
            setCandidates(prev => prev.map(candidate => 
                selectedCandidates.includes(candidate._id)
                    ? { ...candidate, stage: { _id: newStage, name: getStageName(newStage) } }
                    : candidate
            ));

            setSelectedCandidates([]);
            setBulkMoveDialogOpen(false);
            showSnackbar("Candidates moved successfully!");
        } catch (error) {
            console.error("Error moving candidates:", error);
            showSnackbar("Failed to move candidates", "error");
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
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const selectedCount = selectedCandidates.length;
            showSnackbar(`Email sent to ${selectedCount} candidates`, "success");
            setEmailDialogOpen(false);
            setEmailSubject('');
            setEmailBody('');
        } catch (error) {
            console.error("Error sending bulk email:", error);
            showSnackbar("Failed to send emails", "error");
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleBulkAction = async (action) => {
        if (action === "delete") {
            try {
                // Simulate delete
                setCandidates(prev => prev.filter(candidate => !selectedCandidates.includes(candidate._id)));
                setSelectedCandidates([]);
                showSnackbar("Candidate(s) deleted successfully!");
            } catch (error) {
                console.error("Bulk delete failed:", error);
                showSnackbar("Failed to delete candidates", "error");
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
            // Simulate API call with dummy analysis data
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const dummyAnalysisData = {
                overallScore: 85,
                skillsMatch: {
                    react: { score: 90, required: true },
                    javascript: { score: 88, required: true },
                    typescript: { score: 75, required: true },
                    nodejs: { score: 80, required: false }
                },
                experience: {
                    total: candidate.experience,
                    relevant: candidate.experience - 1,
                    companies: ["Tech Corp", "Startup Inc"],
                    roles: ["Frontend Developer", "Software Engineer"]
                },
                education: "Bachelor's in Computer Science",
                keywords: ["React", "JavaScript", "TypeScript", "Redux", "HTML5", "CSS3"],
                suggestions: [
                    "Strong React and JavaScript skills",
                    "Good TypeScript knowledge",
                    "Consider for senior frontend role"
                ]
            };
            
            setAnalysisData(dummyAnalysisData);
        } catch (error) {
            console.error("Error fetching analysis:", error);
            showSnackbar("Failed to load analysis", "error");
            setAnalysisData(null);
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleAddRemarks = () => {
        handleCloseRemarksMenu();
        setRemarksDialogOpen(true);
    };

    const handleSubmitRemarks = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setRemarksDialogOpen(false);
            setRemarksText('');
            showSnackbar("Remarks added successfully!");
        } catch (error) {
            console.error('Error saving remarks:', error);
            showSnackbar("Failed to save remarks", "error");
        }
    };

    const handleBack = () => {
        navigate(-1);
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

    const handleOpenBulkUpload = () => {
        setBulkUploadOpen(true);
    };

    const handleCloseBulkUpload = () => {
        setBulkUploadOpen(false);
    };

    const handleBulkUploadComplete = () => {
        // Simulate adding more candidates
        const newCandidates = [
            {
                _id: Date.now().toString(),
                firstName: "New",
                lastName: "Candidate",
                email: "new.candidate@email.com",
                mobile: "+1 (555) 999-8888",
                experience: 4,
                source: "Bulk Upload",
                stage: { _id: "1", name: "Sourced" },
                availableToJoin: 30,
                status: "active",
                owner: "System",
                skills: "React, JavaScript",
                rejectionType: "",
                resume: "new_candidate_resume.pdf"
            }
        ];
        
        setCandidates(prev => [...prev, ...newCandidates]);
        showSnackbar("Bulk upload completed successfully!");
        handleCloseBulkUpload();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const filteredCandidates = getFilteredCandidates();

    return (
        <Box sx={{ p: 1, mt: 0,marginLeft:10 }}>
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
            
            <Button 
                startIcon={<ArrowBack />} 
                onClick={handleBack}
                sx={{ mb: 0 }}
            >
                Back
            </Button>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, width: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    All Candidates ({candidates.length})
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

                    {/* Bulk Upload Button */}
                    <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleOpenBulkUpload}
                    >
                        Bulk Upload
                    </Button>
                    
                    {location.pathname !== '/dashboard/candidates' && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddCandidate}>
                            Add Candidate
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Add Candidate Dialog - Using AddCandidateForm Component */}
            <Dialog open={openAddCandidate} onClose={handleCloseAddCandidate} maxWidth="md" fullWidth>
                <AddCandidateForm 
                    onClose={handleCloseAddCandidate} 
                    onSubmit={handleSubmitCandidate}
                    jobId={id}
                />
            </Dialog>

            {/* Bulk Upload Dialog - Using BulkUploadDialog Component */}
            <BulkUploadDialog
                open={bulkUploadOpen}
                onClose={handleCloseBulkUpload}
                jobId={id}
                onUploadComplete={handleBulkUploadComplete}
            />

            {/* Move Candidate Form - Using MoveCandidateForm Component */}
            <MoveCandidateForm
                open={moveDialogOpen}
                onClose={() => setMoveDialogOpen(false)}
                candidate={candidates.find(c => c._id === currentCandidate?._id)}
                onMoveComplete={handleStageMove}
                stages={dummyStages}
            />

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
                            {dummyStages.map(option => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.name}
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

            {/* Stages Summary */}
            <Card sx={{ mb: 2, overflow: "hidden" }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, overflowX: "auto", py: 2 }}>
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
                                    width: "150px",
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
                <Box sx={{ mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
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
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Filters
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Source</InputLabel>
                            <Select
                                label="Source"
                                value={filters.source}
                                onChange={handleFilterChange('source')}
                            >
                                <MenuItem value="">All Sources</MenuItem>
                                {dummySources.map(source => (
                                    <MenuItem key={source} value={source}>{source}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
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

                        <FormControl size="small" sx={{ minWidth: 250 }}>
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

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                value={filters.status}
                                onChange={handleFilterChange('status')}
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                {dummyStages.map(stage => (
                                    <MenuItem key={stage._id} value={stage.name}>
                                        {stage.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            placeholder="Search candidates..."
                            value={filters.searchQuery}
                            onChange={handleFilterChange('searchQuery')}
                            sx={{ flexGrow: 1, maxWidth: 400 }}
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
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2">{selectedCandidates.length} selected</Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
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

            {/* Interview Forms - Using imported components */}
            {currentCandidate && (
                <>
                    <ScheduleOnlineInterviewForm
                        open={showInterviewModal && interviewType === "online"}
                        onClose={() => setShowInterviewModal(false)}
                        candidate={currentCandidate}
                        user={{ email: localStorage.getItem("user_email") || "user@example.com" }}
                        onSuccess={() => {
                            showSnackbar("Online interview scheduled successfully!");
                            setShowInterviewModal(false);
                        }}
                    />
                    <ScheduleOfflineInterviewForm
                        open={showInterviewModal && interviewType === "offline"}
                        onClose={() => setShowInterviewModal(false)}
                        candidate={currentCandidate}
                        user={{ email: localStorage.getItem("user_email") || "user@example.com" }}
                        onSuccess={() => {
                            showSnackbar("Offline interview scheduled successfully!");
                            setShowInterviewModal(false);
                        }}
                    />
                </>
            )}

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

            {/* Resume Analysis Dialog - Using CandidateResumeAnalysis Component */}
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
                    backgroundColor: '#1976d2',
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

            {/* Candidate Views */}
            {viewMode === "table" ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        onChange={handleSelectAllCandidates}
                                        checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                                        sx={{ color: '#3f51b5' }}
                                    />
                                </TableCell>

                                {[
                                    "Name",
                                    "Status",
                                    "Experience",
                                    "Source",
                                    "Available to join",
                                    "Email",
                                    "Phone",
                                    "Actions"
                                ].map((label, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            color: '#333',
                                            borderBottom: '2px solid #e0e0e0'
                                        }}
                                    >
                                        {label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCandidates.map((candidate) => (
                                <TableRow
                                    key={candidate._id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleOpenDetails(candidate)}
                                >
                                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedCandidates.includes(candidate._id)}
                                            onChange={() => handleSelectCandidate(candidate._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim()}
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography component="span">
                                                {getStageName(candidate?.stage)}
                                            </Typography>
                                            {getStageName(candidate?.stage) === "Rejected" && candidate.rejectionType && (
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                    {candidate.rejectionType}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{candidate.experience || '0'} years</TableCell>
                                    <TableCell>{candidate.source || 'Unknown'}</TableCell>
                                    <TableCell>{candidate.availableToJoin || '0'} days</TableCell>
                                    <TableCell>
                                        <Box>
                                            <div>{candidate.email || 'Not provided'}</div>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{candidate.mobile || 'Not provided'}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => handleInterviewClick(e, candidate._id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <InterviewIcon />
                                        </IconButton>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => handleStageClick(e, candidate._id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <StageIcon />
                                        </IconButton>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => handleRemarksClick(e, candidate._id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AnalysisIcon />}
                                            onClick={() => handleOpenAnalysis(candidate._id)}
                                            disabled={!candidate.resume}
                                            size="small"
                                        >
                                            View Analysis
                                        </Button>
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
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        gap: 2,
                        padding: 3,
                    }}
                >
                    {filteredCandidates.map((candidate) => (
                        <Card
                            key={candidate._id}
                            sx={{
                                borderRadius: 3,
                                boxShadow: 6,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                ":hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: 12,
                                },
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                bgcolor: "background.paper",
                            }}
                        >
                            <CardContent
                                sx={{ display: "flex", flexDirection: "column", gap: 3, padding: 3 }}
                            >
                                {/* Header: Name, Avatar, and Checkbox */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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
                                            fontSize: "1.4rem",
                                            fontWeight: "bold",
                                            width: 48,
                                            height: 48,
                                        }}
                                        onClick={() => handleOpenDetails(candidate)}
                                    >
                                        {candidate.firstName?.charAt(0) || '?'}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }} onClick={() => handleOpenDetails(candidate)}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {candidate.experience || '0'} years | {candidate.source || 'Unknown'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        className="action-button"
                                        sx={{ color: "text.secondary" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemarksClick(e, candidate._id);
                                        }}
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                </Box>

                                {/* Status Chip */}
                                <Chip
                                    label={getStageName(candidate.stage)}
                                    color={
                                        getStageName(candidate.stage) === "Hired" ? "success" :
                                        getStageName(candidate.stage) === "Rejected" ? "error" :
                                        getStageName(candidate.stage) === "Archived" ? "default" : "primary"
                                    }
                                    size="small"
                                    sx={{
                                        alignSelf: "flex-start",
                                        fontWeight: "bold",
                                        backgroundColor:
                                            getStageName(candidate.stage) === "Hired" ? "success.light" :
                                            getStageName(candidate.stage) === "Rejected" ? "error.light" :
                                            getStageName(candidate.stage) === "Archived" ? "grey.500" : "primary.light",
                                        color: "white",
                                        borderRadius: 20,
                                        padding: "0.5rem 1rem",
                                        mb: 2,
                                    }}
                                />

                                {/* Rejection Details */}
                                {getStageName(candidate.stage) === "Rejected" && candidate.rejectionType && (
                                    <Box sx={{
                                        backgroundColor: '#ffeeee',
                                        p: 1,
                                        borderRadius: 1,
                                        borderLeft: '3px solid #f44336'
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {candidate.rejectionType}
                                        </Typography>
                                        {candidate.rejectionReason && (
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                {candidate.rejectionReason}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Contact Info */}
                                <Box onClick={() => handleOpenDetails(candidate)}>
                                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
                                        <strong>Email:</strong> {candidate.email || 'Not provided'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
                                        <strong>Phone:</strong> {candidate.mobile || 'Not provided'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
                                        <strong>Owner:</strong> {candidate.owner || 'Not assigned'}
                                    </Typography>
                                </Box>

                                {/* Action Buttons */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: 3,
                                        gap: 1
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
                                            backgroundColor: '#4caf50',
                                            '&:hover': {
                                                backgroundColor: '#388e3c',
                                            }
                                        }}
                                    >
                                        View Analysis
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
                                            padding: 2,
                                            ":hover": { backgroundColor: "primary.dark" },
                                            transition: "background-color 0.2s ease",
                                        }}
                                    >
                                        <InterviewIcon />
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
                                            padding: 2,
                                            ":hover": { backgroundColor: "secondary.dark" },
                                            transition: "background-color 0.2s ease",
                                        }}
                                    >
                                        <StageIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
            
            {/* Candidate Details Dialog - Using CandidateDetailsPage Component */}
            {openDetailsDialog && selectedCandidate && (
                <CandidateDetailsPage
                    open={openDetailsDialog}
                    onClose={handleCloseDetails}
                    candidate={selectedCandidate}
                />
            )}
        </Box>
    );
};

export default CandidatesTab;