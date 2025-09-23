
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
import BulkUploadDialog from "./BulkUploadDialog"; 
import CloseIcon from '@mui/icons-material/Close';
import {  ArrowBack } from "@mui/icons-material"; // Added ArrowBack icon


import AddCandidateForm from "./AddCandidateForm";
import ScheduleOfflineInterviewForm from "../../pages/Interview/ScheduleOfflineInterviewForm";
import ScheduleOnlineInterviewForm from "../../pages/Interview/ScheduleOnlineInterviewForm";
import MoveCandidateForm from "./MoveCandidateForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import CandidateDetailsPage from "../../pages/Candidate/CandidateDetailsPage";
import CandidateResumeAnalysis from "../../pages/Candidate/CandidateResumeAnalysis";
import candidateService from "../../services/Candidates/candidateService";
import stageService from "../../services/Candidates/stageService";
import ErrorBoundary from "../ErrorBoundary";

// const rejectionTypes = ["R1 Rejected", "R2 Rejected", "Client Rejected"];

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
    const [loading, setLoading] = useState(true);
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
    const [rejectionTypes, setRejectionTypes] = useState(false);
    const [bulkUploadOpen, setBulkUploadOpen] = useState(false); // Add state for bulk upload dialog

    // Filter state
    const [filters, setFilters] = useState({
        source: '',
        experience: '',
        availableToJoin: '',
        status: '',
        searchQuery: ''
    });

    // Fetch stages from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [candidatesData, stagesData, optionsData, rejectionData] = await Promise.all([
                    id ? candidateService.fetchCandidatesByJob(id) : candidateService.fetchCandidates(),
                    stageService.fetchStages(),
                    stageService.fetchStageOptions(),
                    stageService.fetchRejectionTypes()
                ]);

                // Normalize all candidate stage data
                const validatedCandidates = candidatesData.map(candidate => {
                    // Ensure stage is either a string or normalized object
                    let normalizedStage;
                    if (!candidate.stage) {
                        normalizedStage = 'Sourced';
                    } else if (typeof candidate.stage === 'string') {
                        normalizedStage = candidate.stage;
                    } else if (candidate.stage._id && candidate.stage.name) {
                        normalizedStage = {
                            _id: candidate.stage._id,
                            name: candidate.stage.name
                        };
                    } else {
                        normalizedStage = 'Sourced';
                    }

                    return {
                        ...candidate,
                        stage: normalizedStage,
                        owner: candidate.owner || localStorage.getItem("user_name") || 'Not assigned'
                    };
                });

                setCandidates(validatedCandidates);
                setStages(stagesData);
                setStageOptions(optionsData);
                setRejectionTypes(rejectionData);

            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Helper function to normalize stage data
    const normalizeStageData = (stage) => {
        if (!stage) return null;
        if (typeof stage === 'string') return stage;

        // Handle both {_id, name} and other object formats
        if (stage._id) {
            return { _id: stage._id, name: stage.name || 'Sourced' };
        }

        return null;
    };

    // Fetch stage options from API - updated implementation
    useEffect(() => {
        const fetchStageOptions = async () => {
            try {
                const data = await stageService.fetchStageOptions();
                setStageOptions(data);
            } catch (err) {
                console.error("Error fetching stage options:", err);
                // Fallback to default options
                setStageOptions([
                    { _id: '1', name: 'Sourced' },
                    { _id: '2', name: 'Interview' },
                    { _id: '3', name: 'Preboarding' },
                    { _id: '4', name: 'Hired' },
                    { _id: '5', name: 'Rejected' },
                    { _id: '6', name: 'Archived' }
                ]);
            }
        };
        fetchStageOptions();
    }, []);

    // Helper function to get stage name
    const getStageName = (stage) => {
        // Handle null/undefined case
        if (!stage) return 'Sourced';

        // Handle string case
        if (typeof stage === 'string') {
            // If it's already a name, return it
            if (['Sourced', 'Interview', 'Preboarding', 'Hired', 'Rejected', 'Archived'].includes(stage)) {
                return stage;
            }

            // If it's an ID, find the corresponding stage
            const foundStage = stages.find(s => s._id === stage) ||
                stageOptions.find(s => s._id === stage);
            return foundStage?.name || 'Sourced';
        }

        // Handle object case
        if (typeof stage === 'object') {
            // Handle both {_id, name} and other object formats
            if (stage.name) return stage.name;
            if (stage._id) {
                const foundStage = stages.find(s => s._id === stage._id) ||
                    stageOptions.find(s => s._id === stage._id);
                return foundStage?.name || 'Sourced';
            }
        }

        // Fallback
        return 'Sourced';
    };

    // Fetch candidates from API
    const loadCandidates = async () => {
        try {
            setLoading(true);
            setError(null);
            let data = [];

            if (id) {
                data = await candidateService.fetchCandidatesByJob(id);
            } else {
                data = await candidateService.fetchCandidates();
            }

            // Map owner IDs to names if needed
            const candidatesWithOwnerNames = data.map(candidate => ({
                ...candidate,
                owner: candidate.owner || localStorage.getItem("user_name") || 'Not assigned'
            }));

            setCandidates(Array.isArray(candidatesWithOwnerNames) ? candidatesWithOwnerNames : []);

            if (data.length === 0 && id) {
                showSnackbar("No candidates found for this job", "info");
            }
        } catch (err) {
            setError(err.message);
            showSnackbar(err.message, "error");
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate candidate counts for all stages (ignoring status filter)
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

    // Filter candidates based on filter criteria (including status filter)
    const getFilteredCandidates = () => {
        return (candidates || []).filter(candidate => {
            if (!candidate) return false;

            // Skip status filter if filters.status is empty or 'sourced' (which now shows all)
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

            // Apply source filter - handle both string and object sources
            if (filters.source) {
                const candidateSource = candidate.source;
                const sourceName = typeof candidateSource === 'string'
                    ? candidateSource
                    : candidateSource?.name;

                if (sourceName !== filters.source) {
                    return false;
                }
            }

            // Rest of your filter logic...
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

            if (filters.availableToJoin && (candidate.availableToJoin || 0) > parseInt(filters.availableToJoin)) {
                return false;
            }

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
    const stageCounts = calculateStageCounts(candidates || []);

    const stageCardData = [
        {
            stage: 'sourced',
            label: 'Sourced',
            count: stageCounts.all,
            totalCount: stageCounts.all
        },
        { stage: 'interview', label: 'Interview', count: stageCounts.interview },
        { stage: 'preboarding', label: 'Preboarding', count: stageCounts.preboarding },
        { stage: 'hired', label: 'Hired', count: stageCounts.hired },
        { stage: 'archived', label: 'Archived', count: stageCounts.archived },
        { stage: 'rejected', label: 'Rejected', count: stageCounts.rejected }
    ];
     

        const handleOpenBulkUpload = () => {
        setBulkUploadOpen(true);
    };

    const handleCloseBulkUpload = () => {
        setBulkUploadOpen(false);
    };

        const handleBulkUploadComplete = () => {
        // Refresh the candidate list after bulk upload
        loadCandidates();
        handleCloseBulkUpload();
        showSnackbar("Bulk upload completed successfully!");
    };


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
            // Add owner name to the form data before submission
            const formDataWithOwner = {
                ...formData,
                owner: localStorage.getItem("user_name") || 'Not assigned'
            };

            const newCandidate = await candidateService.createCandidate(formDataWithOwner);

            // Update local state immediately with the new candidate
            setCandidates(prev => [...prev, {
                ...newCandidate,
                owner: localStorage.getItem("user_name") || 'Not assigned'
            }]);

            showSnackbar("Candidate added successfully!");
            handleCloseAddCandidate();
        } catch (error) {
            console.error("Error adding candidate:", error);
            showSnackbar(error.message, "error");
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
        setCurrentCandidate(candidates.find(c => c._id === candidateId));
        setShowInterviewModal(true);
        handleCloseInterviewMenu();
    };

    const handleStageMove = async (formData) => {
        try {
            const updatedCandidate = await candidateService.updateCandidate(currentCandidate, formData);
            await loadCandidates();
            showSnackbar("Candidate stage updated successfully!");
            setMoveDialogOpen(false);
        } catch (error) {
            console.error("Error updating candidate stage:");
            showSnackbar(success.message, "error");
        }
    };

    const handleBulkStageMove = async () => {
        try {
            const updatePromises = selectedCandidates.map(candidateId =>
                candidateService.updateCandidate(candidateId, { stage: newStage })
            );

            await Promise.all(updatePromises);
            await loadCandidates();

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

            const response = await candidateService.sendBulkEmails({
                recipients: selectedCandidateEmails,
                subject: emailSubject,
                body: emailBody
            });

            if (response.success) {
                showSnackbar(`Email sent to ${selectedCandidateEmails.length} candidates`, "success");
                setEmailDialogOpen(false);
                setEmailSubject('');
                setEmailBody('');
            } else {
                throw new Error(response.message || "Failed to send emails");
            }
        } catch (error) {
            console.error("Error sending bulk email:", error);
            showSnackbar(error.message, "error");
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleBulkAction = async (action) => {
        if (action === "delete") {
            try {
                if (selectedCandidates.length === 1) {
                    await candidateService.deleteCandidate(selectedCandidates[0]);
                    await loadCandidates();
                } else if (selectedCandidates.length > 1) {
                    for (const id of selectedCandidates) {
                        await candidateService.deleteCandidate(id);
                    }
                    await loadCandidates();
                }

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
            const analysisData = await candidateService.getResumeAnalysis(candidateId);
            setAnalysisData(analysisData);
        } catch (error) {
            console.error("Full error object:", error);
            
            let errorMessage = error.message;
            if (error.message.includes('ECONNREFUSED') || 
                error.message.includes('Failed to fetch')) {
              errorMessage = 'Cannot connect to the server. Please ensure the backend is running.';
            }
            
            showSnackbar(errorMessage, "error");
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
            const response = await candidateService.addRemarks({
                text: remarksText,
                candidateId: currentCandidate
            });

            setRemarksDialogOpen(false);
            setRemarksText('');
            showSnackbar("Remarks added successfully!");
        } catch (error) {
            console.error('Error saving remarks:', error);
            showSnackbar(error.message, "error");
        }
    };

    const handleBack = () => {
    navigate(-1); // Go back one step in history
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

    return (
        <Box sx={{ p: 1,mt:0 }}>
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
        sx={{ mb:0 }}
      >
        Back
      </Button>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 ,  width: "100%"}}>

                
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    All Candidates
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

            {/* Add Candidate Dialog */}
            <Dialog open={openAddCandidate} onClose={handleCloseAddCandidate} maxWidth="md" fullWidth>
                <AddCandidateForm onClose={handleCloseAddCandidate} onSubmit={handleSubmitCandidate} />
            </Dialog>

            {/* Bulk Upload Dialog */}
           <BulkUploadDialog
                open={bulkUploadOpen}
                onClose={handleCloseBulkUpload}
                jobId={id}
                onUploadComplete={handleBulkUploadComplete}
            />

            {/* Move Candidate Form */}
            <MoveCandidateForm
                open={moveDialogOpen}
                onClose={() => setMoveDialogOpen(false)}
                candidate={candidates.find(c => c._id === currentCandidate)}
                onMoveComplete={handleStageMove}
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
                                {
                                    (Array.isArray(candidates) ? candidates : [])
                                        .map(c => {
                                            if (!c) return null;
                                            if (typeof c.source === 'string') return c.source;
                                            if (c.source && typeof c.source === 'object') return c.source.name;
                                            return null;
                                        })
                                        .filter(Boolean)
                                        .filter((value, index, self) => self.indexOf(value) === index) // Unique values
                                        .map(source => (
                                            <MenuItem key={source} value={source}>{source}</MenuItem>
                                        ))
                                }
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

            {/* Interview Forms */}
            {currentCandidate && (
                <>
                    <ScheduleOnlineInterviewForm
                        open={showInterviewModal && interviewType === "online"}
                        onClose={() => setShowInterviewModal(false)}
                        candidate={currentCandidate}
                        user={{ email: localStorage.getItem("user_email") }}
                        onSuccess={() => {
                            showSnackbar("Online interview scheduled successfully!");
                            setShowInterviewModal(false);
                        }}
                    />
                    <ScheduleOfflineInterviewForm
                        open={showInterviewModal && interviewType === "offline"}
                        onClose={() => setShowInterviewModal(false)}
                        candidate={currentCandidate}
                        user={{ email: localStorage.getItem("user_email") }}
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
                                        checked={selectedCandidates.length === getFilteredCandidates().length}
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
                                    // "Candidate Owner",
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
                            {getFilteredCandidates().map((candidate) => (
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
                                        {`${candidate.firstName || ''} ${candidate.middleName || ''} ${candidate.lastName || ''}`.trim()}
                                    </TableCell>
                                    <TableCell>
                                        <ErrorBoundary>
                                            <Box>
                                                {(() => {
                                                    try {
                                                        // Force conversion to string
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
                                    <TableCell>{candidate.experience || '0'} years</TableCell>
                                    <ErrorBoundary>
                                        <TableCell>
                                            {typeof candidate.source === 'string'
                                                ? candidate.source
                                                : candidate.source?.name || 'Unknown'}
                                        </TableCell></ErrorBoundary>
                                    <TableCell>{candidate.availableToJoin || '0'} days</TableCell>
                                    <TableCell>
                                        <Box>
                                            <div>{candidate.email || 'Not provided'}</div>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{candidate.mobile || 'Not provided'}</TableCell>
                                    {/* <TableCell>{candidate.owner || localStorage.getItem("user_name") || 'Not assigned'}</TableCell> */}
                                    <TableCell onClick={(e) => e.stopPropagation()}>

                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => handleInterviewClick(e, candidate._id)}
                                        >
                                            <InterviewIcon />
                                        </IconButton>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => handleStageClick(e, candidate._id)}
                                        >
                                            <StageIcon />
                                        </IconButton>
                                        <IconButton
                                            className="action-button"
                                            onClick={(e) => handleRemarksClick(e, candidate._id)}
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AnalysisIcon />}
                                            onClick={() => handleOpenAnalysis(candidate._id)}
                                            disabled={!candidate.resume}
                                            size="small"
                                            sx={{ mr: 1 }}
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
                    {getFilteredCandidates().map((candidate) => (
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
                                        onClick={() => handleNavigateToCandidate(candidate)}
                                    >
                                        {candidate.firstName?.charAt(0) || '?'}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }} onClick={() => handleNavigateToCandidate(candidate)}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {`${candidate.firstName || ''} ${candidate.middleName || ''} ${candidate.lastName || ''}`.trim()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {candidate.experience || '0'} years | {typeof candidate.source === 'string'
                                                ? candidate.source
                                                : candidate.source?.name || 'Unknown'}
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
                                            getStageName(candidate.stage) === "Archived" ? "default" : "primary"
                                    }
                                    size="small"
                                    sx={{
                                        alignSelf: "flex-start",
                                        fontWeight: "bold",
                                        backgroundColor:
                                            getStageName(candidate.stage) === "Hired" ? "success.light" :
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
                                <Box onClick={() => handleNavigateToCandidate(candidate)}>
                                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
                                        <strong>Email:</strong> {candidate.email || 'Not provided'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
                                        <strong>Phone:</strong> {candidate.mobile || 'Not provided'}
                                    </Typography>
                                    {/* <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
                                        <strong>Owner:</strong> {candidate.owner || localStorage.getItem("user_name") || 'Not assigned'}
                                    </Typography> */}
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

export default CandidatesTab;

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
// } from "@mui/material";
// import {
//     ViewModule as CardViewIcon,
//     ViewHeadline as TableViewIcon,
//     Add as AddIcon,
//     FilterList as FilterIcon,
//     MoreVert as MoreIcon,
//     AssignmentInd as InterviewIcon,
//     ArrowForward as StageIcon,
//     NoteAdd as RemarksIcon,
//     Email as EmailIcon,
//     Assessment as AnalysisIcon,
//     CloudUpload as CloudUploadIcon,
// } from "@mui/icons-material";
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { useTheme } from '@mui/material/styles';
// import CloseIcon from '@mui/icons-material/Close';

// import AddCandidateForm from "./AddCandidateForm";
// import ScheduleOfflineInterviewForm from "../../pages/Interview/ScheduleOfflineInterviewForm";
// import ScheduleOnlineInterviewForm from "../../pages/Interview/ScheduleOnlineInterviewForm";
// import MoveCandidateForm from "./MoveCandidateForm";
// import BulkUploadDialog from "./BulkUploadDialog"; // Import the new component
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// import CandidateDetailsPage from "../../pages/Candidate/CandidateDetailsPage";
// import CandidateResumeAnalysis from "../../pages/Candidate/CandidateResumeAnalysis";
// import candidateService from "../../services/Candidates/candidateService";
// import stageService from "../../services/Candidates/stageService";
// import ErrorBoundary from "../ErrorBoundary";

// const rejectionTypes = ["R1 Rejected", "R2 Rejected", "Client Rejected"];

// const CandidatesTab = () => {
//     const location = useLocation();
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [viewMode, setViewMode] = useState("table");
//     const [selectedCandidates, setSelectedCandidates] = useState([]);
//     const [openAddCandidate, setOpenAddCandidate] = useState(false);
//     const [interviewAnchorEl, setInterviewAnchorEl] = useState(null);
//     const [stageAnchorEl, setStageAnchorEl] = useState(null);
//     const [remarksAnchorEl, setRemarksAnchorEl] = useState(null);
//     const [currentCandidate, setCurrentCandidate] = useState(null);
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showInterviewModal, setShowInterviewModal] = useState(false);
//     const [interviewType, setInterviewType] = useState(null);
//     const [moveDialogOpen, setMoveDialogOpen] = useState(false);
//     const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//     const [selectedCandidate, setSelectedCandidate] = useState(null);
//     const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
//     const [remarksText, setRemarksText] = useState('');
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         severity: "success"
//     });
//     const [bulkMoveDialogOpen, setBulkMoveDialogOpen] = useState(false);
//     const [emailDialogOpen, setEmailDialogOpen] = useState(false);
//     const [emailSubject, setEmailSubject] = useState('');
//     const [emailBody, setEmailBody] = useState('');
//     const [isSendingEmail, setIsSendingEmail] = useState(false);
//     const [stages, setStages] = useState([]);
//     const [stageOptions, setStageOptions] = useState([]);
//     const [rejectedFilter, setRejectedFilter] = useState('');
//     const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
//     const [selectedCandidateForAnalysis, setSelectedCandidateForAnalysis] = useState(null);
//     const [analysisData, setAnalysisData] = useState(null);
//     const [analysisLoading, setAnalysisLoading] = useState(false);
//     const [rejectionTypes, setRejectionTypes] = useState(false);
//     const [bulkUploadOpen, setBulkUploadOpen] = useState(false); // Add state for bulk upload dialog
//     const [newStage, setNewStage] = useState('');

//     // Filter state
//     const [filters, setFilters] = useState({
//         source: '',
//         experience: '',
//         availableToJoin: '',
//         status: '',
//         searchQuery: ''
//     });

//     // Fetch stages from API
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);

//                 const [candidatesData, stagesData, optionsData, rejectionData] = await Promise.all([
//                     id ? candidateService.fetchCandidatesByJob(id) : candidateService.fetchCandidates(),
//                     stageService.fetchStages(),
//                     stageService.fetchStageOptions(),
//                     stageService.fetchRejectionTypes()
//                 ]);

//                 // Normalize all candidate stage data
//                 const validatedCandidates = candidatesData.map(candidate => {
//                     // Ensure stage is either a string or normalized object
//                     let normalizedStage;
//                     if (!candidate.stage) {
//                         normalizedStage = 'Sourced';
//                     } else if (typeof candidate.stage === 'string') {
//                         normalizedStage = candidate.stage;
//                     } else if (candidate.stage._id && candidate.stage.name) {
//                         normalizedStage = {
//                             _id: candidate.stage._id,
//                             name: candidate.stage.name
//                         };
//                     } else {
//                         normalizedStage = 'Sourced';
//                     }

//                     return {
//                         ...candidate,
//                         stage: normalizedStage,
//                         owner: candidate.owner || localStorage.getItem("user_name") || 'Not assigned'
//                     };
//                 });

//                 setCandidates(validatedCandidates);
//                 setStages(stagesData);
//                 setStageOptions(optionsData);
//                 setRejectionTypes(rejectionData);

//             } catch (err) {
//                 console.error("Failed to fetch data:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     // Helper function to normalize stage data
//     const normalizeStageData = (stage) => {
//         if (!stage) return null;
//         if (typeof stage === 'string') return stage;

//         // Handle both {_id, name} and other object formats
//         if (stage._id) {
//             return { _id: stage._id, name: stage.name || 'Sourced' };
//         }

//         return null;
//     };

//     // Fetch stage options from API - updated implementation
//     useEffect(() => {
//         const fetchStageOptions = async () => {
//             try {
//                 const data = await stageService.fetchStageOptions();
//                 setStageOptions(data);
//             } catch (err) {
//                 console.error("Error fetching stage options:", err);
//                 // Fallback to default options
//                 setStageOptions([
//                     { _id: '1', name: 'Sourced' },
//                     { _id: '2', name: 'Interview' },
//                     { _id: '3', name: 'Preboarding' },
//                     { _id: '4', name: 'Hired' },
//                     { _id: '5', name: 'Rejected' },
//                     { _id: '6', name: 'Archived' }
//                 ]);
//             }
//         };
//         fetchStageOptions();
//     }, []);

//     // Helper function to get stage name
//     const getStageName = (stage) => {
//         // Handle null/undefined case
//         if (!stage) return 'Sourced';

//         // Handle string case
//         if (typeof stage === 'string') {
//             // If it's already a name, return it
//             if (['Sourced', 'Interview', 'Preboarding', 'Hired', 'Rejected', 'Archived'].includes(stage)) {
//                 return stage;
//             }

//             // If it's an ID, find the corresponding stage
//             const foundStage = stages.find(s => s._id === stage) ||
//                 stageOptions.find(s => s._id === stage);
//             return foundStage?.name || 'Sourced';
//         }

//         // Handle object case
//         if (typeof stage === 'object') {
//             // Handle both {_id, name} and other object formats
//             if (stage.name) return stage.name;
//             if (stage._id) {
//                 const foundStage = stages.find(s => s._id === stage._id) ||
//                     stageOptions.find(s => s._id === stage._id);
//                 return foundStage?.name || 'Sourced';
//             }
//         }

//         // Fallback
//         return 'Sourced';
//     };

//     // Fetch candidates from API
//     const loadCandidates = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             let data = [];

//             if (id) {
//                 data = await candidateService.fetchCandidatesByJob(id);
//             } else {
//                 data = await candidateService.fetchCandidates();
//             }

//             // Map owner IDs to names if needed
//             const candidatesWithOwnerNames = data.map(candidate => ({
//                 ...candidate,
//                 owner: candidate.owner || localStorage.getItem("user_name") || 'Not assigned'
//             }));

//             setCandidates(Array.isArray(candidatesWithOwnerNames) ? candidatesWithOwnerNames : []);

//             if (data.length === 0 && id) {
//                 showSnackbar("No candidates found for this job", "info");
//             }
//         } catch (err) {
//             setError(err.message);
//             showSnackbar(err.message, "error");
//             setCandidates([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Calculate candidate counts for all stages (ignoring status filter)
//     const calculateStageCounts = (candidates) => {
//         const counts = {
//             sourced: 0,
//             interview: 0,
//             preboarding: 0,
//             hired: 0,
//             archived: 0,
//             rejected: 0,
//             all: candidates.length
//         };

//         candidates.forEach(candidate => {
//             if (!candidate) return;

//             const stageName = getStageName(candidate.stage).toLowerCase();
//             counts[stageName] = (counts[stageName] || 0) + 1;
//         });

//         return counts;
//     };

//     // Filter candidates based on filter criteria (including status filter)
//     const getFilteredCandidates = () => {
//         return (candidates || []).filter(candidate => {
//             if (!candidate) return false;

//             // Skip status filter if filters.status is empty or 'sourced' (which now shows all)
//             if (filters.status && filters.status.toLowerCase() !== 'sourced') {
//                 const candidateStageName = getStageName(candidate.stage).toLowerCase();
//                 if (candidateStageName !== filters.status.toLowerCase()) {
//                     return false;
//                 }

//                 if (filters.status.toLowerCase() === 'rejected' && rejectedFilter) {
//                     if (candidate.rejectionType !== rejectedFilter) {
//                         return false;
//                     }
//                 }
//             }

//             // Apply source filter - handle both string and object sources
//             if (filters.source) {
//                 const candidateSource = candidate.source;
//                 const sourceName = typeof candidateSource === 'string'
//                     ? candidateSource
//                     : candidateSource?.name;

//                 if (sourceName !== filters.source) {
//                     return false;
//                 }
//             }

//             // Rest of your filter logic...
//             if (filters.experience) {
//                 const [min, max] = filters.experience.split('-').map(Number);
//                 const candidateExp = parseFloat(candidate.experience || 0);

//                 if (filters.experience === '5+' && candidateExp < 5) {
//                     return false;
//                 }
//                 if (max && (candidateExp < min || candidateExp > max)) {
//                     return false;
//                 }
//             }

//             if (filters.availableToJoin && (candidate.availableToJoin || 0) > parseInt(filters.availableToJoin)) {
//                 return false;
//             }

//             if (filters.searchQuery) {
//                 const query = filters.searchQuery.toLowerCase();
//                 const candidateText = [
//                     candidate.firstName || '',
//                     candidate.middleName || '',
//                     candidate.lastName || '',
//                     candidate.email || '',
//                     candidate.mobile || '',
//                     candidate.skills || ''
//                 ].join(' ').toLowerCase();

//                 if (!candidateText.includes(query)) {
//                     return false;
//                 }
//             }

//             return true;
//         });
//     };
//     const stageCounts = calculateStageCounts(candidates || []);

//     const stageCardData = [
//         {
//             stage: 'sourced',
//             label: 'Sourced',
//             count: stageCounts.all,
//             totalCount: stageCounts.all
//         },
//         { stage: 'interview', label: 'Interview', count: stageCounts.interview },
//         { stage: 'preboarding', label: 'Preboarding', count: stageCounts.preboarding },
//         { stage: 'hired', label: 'Hired', count: stageCounts.hired },
//         { stage: 'archived', label: 'Archived', count: stageCounts.archived },
//         { stage: 'rejected', label: 'Rejected', count: stageCounts.rejected }
//     ];

//     const showSnackbar = (message, severity = "success") => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     };

//     const handleSelectCandidate = (id) => {
//         setSelectedCandidates((prev) =>
//             prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
//         );
//     };

//     const handleSelectAllCandidates = (event) => {
//         if (event.target.checked) {
//             const allIds = getFilteredCandidates().map((c) => c._id);
//             setSelectedCandidates(allIds);
//         } else {
//             setSelectedCandidates([]);
//         }
//     };

//     const handleOpenAddCandidate = () => {
//         setOpenAddCandidate(true);
//     };

//     const handleCloseAddCandidate = () => {
//         setOpenAddCandidate(false);
//     };

//     const handleOpenBulkUpload = () => {
//         setBulkUploadOpen(true);
//     };

//     const handleCloseBulkUpload = () => {
//         setBulkUploadOpen(false);
//     };

//     const handleOpenDetails = (candidate) => {
//         setSelectedCandidate(candidate);
//         setOpenDetailsDialog(true);
//     };

//     const handleNavigateToCandidate = (candidate) => {
//         navigate(`/candidates/${candidate._id}`);
//     };

//     const handleCloseDetails = () => {
//         setOpenDetailsDialog(false);
//     };

//     const handleSubmitCandidate = async (formData) => {
//         try {
//             // Add owner name to the form data before submission
//             const formDataWithOwner = {
//                 ...formData,
//                 owner: localStorage.getItem("user_name") || 'Not assigned'
//             };

//             const newCandidate = await candidateService.createCandidate(formDataWithOwner);

//             // Update local state immediately with the new candidate
//             setCandidates(prev => [...prev, {
//                 ...newCandidate,
//                 owner: localStorage.getItem("user_name") || 'Not assigned'
//             }]);

//             showSnackbar("Candidate added successfully!");
//             handleCloseAddCandidate();
//         } catch (error) {
//             console.error("Error adding candidate:", error);
//             showSnackbar(error.message, "error");
//         }
//     };

//     const handleBulkUploadComplete = () => {
//         // Refresh the candidate list after bulk upload
//         loadCandidates();
//         handleCloseBulkUpload();
//         showSnackbar("Bulk upload completed successfully!");
//     };

//     const handleInterviewClick = (event, candidateId) => {
//         setCurrentCandidate(candidateId);
//         setInterviewAnchorEl(event.currentTarget);
//     };

//     const handleStageClick = (event, candidateId) => {
//         setCurrentCandidate(candidateId);
//         setStageAnchorEl(event.currentTarget);
//     };

//     const handleRemarksClick = (event, candidateId) => {
//         setCurrentCandidate(candidateId);
//         setRemarksAnchorEl(event.currentTarget);
//     };

//     const handleCloseInterviewMenu = () => {
//         setInterviewAnchorEl(null);
//     };

//     const handleCloseStageMenu = () => {
//         setStageAnchorEl(null);
//     };

//     const handleCloseRemarksMenu = () => {
//         setRemarksAnchorEl(null);
//     };

//     const handleInterviewOption = (option, candidateId) => {
//         setInterviewType(option);
//         setCurrentCandidate(candidates.find(c => c._id === candidateId));
//         setShowInterviewModal(true);
//         handleCloseInterviewMenu();
//     };

//     const handleStageMove = async (formData) => {
//         try {
//             const updatedCandidate = await candidateService.updateCandidate(currentCandidate, formData);
//             await loadCandidates();
//             showSnackbar("Candidate stage updated successfully!");
//             setMoveDialogOpen(false);
//         } catch (error) {
//             console.error("Error updating candidate stage:", error);
//             showSnackbar(error.message, "error");
//         }
//     };

//     const handleBulkStageMove = async () => {
//         try {
//             const updatePromises = selectedCandidates.map(candidateId =>
//                 candidateService.updateCandidate(candidateId, { stage: newStage })
//             );

//             await Promise.all(updatePromises);
//             await loadCandidates();

//             setSelectedCandidates([]);
//             setBulkMoveDialogOpen(false);
//             showSnackbar("Candidates moved successfully!");
//         } catch (error) {
//             console.error("Error moving candidates:", error);
//             showSnackbar(error.message, "error");
//         }
//     };

//     const handleBulkEmail = async () => {
//         setEmailDialogOpen(true);
//     };

//     const handleSendBulkEmail = async () => {
//         if (!emailSubject || !emailBody) {
//             showSnackbar("Please enter both subject and body", "error");
//             return;
//         }

//         try {
//             setIsSendingEmail(true);
//             const selectedCandidateEmails = candidates
//                 .filter(c => selectedCandidates.includes(c._id))
//                 .map(c => c.email);

//             if (selectedCandidateEmails.length === 0) {
//                 showSnackbar("No candidates selected", "error");
//                 return;
//             }

//             const response = await candidateService.sendBulkEmails({
//                 recipients: selectedCandidateEmails,
//                 subject: emailSubject,
//                 body: emailBody
//             });

//             if (response.success) {
//                 showSnackbar(`Email sent to ${selectedCandidateEmails.length} candidates`, "success");
//                 setEmailDialogOpen(false);
//                 setEmailSubject('');
//                 setEmailBody('');
//             } else {
//                 throw new Error(response.message || "Failed to send emails");
//             }
//         } catch (error) {
//             console.error("Error sending bulk email:", error);
//             showSnackbar(error.message, "error");
//         } finally {
//             setIsSendingEmail(false);
//         }
//     };

//     const handleBulkAction = async (action) => {
//         if (action === "delete") {
//             try {
//                 if (selectedCandidates.length === 1) {
//                     await candidateService.deleteCandidate(selectedCandidates[0]);
//                     await loadCandidates();
//                 } else if (selectedCandidates.length > 1) {
//                     for (const id of selectedCandidates) {
//                         await candidateService.deleteCandidate(id);
//                     }
//                     await loadCandidates();
//                 }

//                 setSelectedCandidates([]);
//                 showSnackbar("Candidate(s) deleted successfully!");
//             } catch (error) {
//                 console.error("Bulk delete failed:", error);
//                 showSnackbar(error.message, "error");
//             }
//         } else if (action === "email") {
//             handleBulkEmail();
//         } else if (action === "move-to-sourced") {
//             setBulkMoveDialogOpen(true);
//         }
//     };

//     const handleFilterChange = (filterName) => (event) => {
//         setFilters({
//             ...filters,
//             [filterName]: event.target.value
//         });

//         if (filterName === 'status' && event.target.value.toLowerCase() !== 'rejected') {
//             setRejectedFilter('');
//         }
//     };

//     const handleRejectedFilterChange = (event) => {
//         setRejectedFilter(event.target.value);
//     };

//     const handleOpenAnalysis = async (candidateId) => {
//         const candidate = candidates.find(c => c._id === candidateId);
//         if (!candidate) return;

//         setSelectedCandidateForAnalysis(candidate);
//         setAnalysisLoading(true);
//         setAnalysisDialogOpen(true);

//         try {
//             const analysisData = await candidateService.getResumeAnalysis(candidateId);
//             setAnalysisData(analysisData);
//         } catch (error) {
//             console.error("Full error object:", error);
            
//             let errorMessage = error.message;
//             if (error.message.includes('ECONNREFUSED') || 
//                 error.message.includes('Failed to fetch')) {
//               errorMessage = 'Cannot connect to the server. Please ensure the backend is running.';
//             }
            
//             showSnackbar(errorMessage, "error");
//             setAnalysisData(null);
//         } finally {
//             setAnalysisLoading(false);
//         }
//     };

//     const handleAddRemarks = () => {
//         handleCloseRemarksMenu();
//         setRemarksDialogOpen(true);
//     };

//     const handleSubmitRemarks = async () => {
//         try {
//             const response = await candidateService.addRemarks({
//                 text: remarksText,
//                 candidateId: currentCandidate
//             });

//             setRemarksDialogOpen(false);
//             setRemarksText('');
//             showSnackbar("Remarks added successfully!");
//         } catch (error) {
//             console.error('Error saving remarks:', error);
//             showSnackbar(error.message, "error");
//         }
//     };

//     const handleStageCardClick = (stage) => {
//         if (stage === 'sourced') {
//             setFilters({
//                 ...filters,
//                 status: ''
//             });
//         } else {
//             setFilters({
//                 ...filters,
//                 status: stage
//             });
//         }
//         setRejectedFilter('');
//     };

//     const handleRejectedCardClick = () => {
//         setFilters({
//             ...filters,
//             status: 'rejected'
//         });
//         setRejectedFilter('');
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                 <Typography color="error">{error}</Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ p: 0 }}>
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>

//             {/* Header */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 ,  width: "100%",}}>
//                 <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                     All Candidates
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <ToggleButtonGroup
//                         value={viewMode}
//                         exclusive
//                         onChange={(e, newMode) => newMode && setViewMode(newMode)}
//                         size="small"
//                     >
//                         <ToggleButton value="table" aria-label="table view">
//                             <TableViewIcon />
//                         </ToggleButton>
//                         <ToggleButton value="card" aria-label="card view">
//                             <CardViewIcon />
//                         </ToggleButton>
//                     </ToggleButtonGroup>
                    
//                     {/* Bulk Upload Button */}
//                     <Button
//                         variant="outlined"
//                         startIcon={<CloudUploadIcon />}
//                         onClick={handleOpenBulkUpload}
//                     >
//                         Bulk Upload
//                     </Button>
                    
//                     {location.pathname !== '/dashboard/candidates' && (
//                         <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddCandidate}>
//                             Add Candidate
//                         </Button>
//                     )}
//                 </Box>
//             </Box>

//             {/* Add Candidate Dialog */}
//             <Dialog open={openAddCandidate} onClose={handleCloseAddCandidate} maxWidth="md" fullWidth>
//                 <AddCandidateForm onClose={handleCloseAddCandidate} onSubmit={handleSubmitCandidate} />
//             </Dialog>

//             {/* Bulk Upload Dialog */}
//             <BulkUploadDialog
//                 open={bulkUploadOpen}
//                 onClose={handleCloseBulkUpload}
//                 jobId={id}
//                 onUploadComplete={handleBulkUploadComplete}
//             />

//             {/* Move Candidate Form */}
//             <MoveCandidateForm
//                 open={moveDialogOpen}
//                 onClose={() => setMoveDialogOpen(false)}
//                 candidate={candidates.find(c => c._id === currentCandidate)}
//                 onMoveComplete={handleStageMove}
//             />

//             {/* Bulk Move Dialog */}
//             <Dialog open={bulkMoveDialogOpen} onClose={() => setBulkMoveDialogOpen(false)}>
//                 <DialogTitle>Move Selected Candidates to Another Stage</DialogTitle>
//                 <DialogContent>
//                     <FormControl fullWidth margin="normal">
//                         <InputLabel>New Stage</InputLabel>
//                         <Select
//                             value={newStage}
//                             onChange={(e) => setNewStage(e.target.value)}
//                             label="New Stage"
//                         >
//                             {stageOptions.map(option => (
//                                 <MenuItem key={option._id || option} value={option._id || option}>
//                                     {option.name || option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setBulkMoveDialogOpen(false)}>Cancel</Button>
//                     <Button
//                         onClick={handleBulkStageMove}
//                         variant="contained"
//                         disabled={!newStage}
//                     >
//                         Move Candidates
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Bulk Email Dialog */}
//             <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
//                 <DialogTitle>Send Email to Selected Candidates</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Subject"
//                         type="text"
//                         fullWidth
//                         variant="outlined"
//                         value={emailSubject}
//                         onChange={(e) => setEmailSubject(e.target.value)}
//                         sx={{ mb: 3 }}
//                     />
//                     <TextField
//                         margin="dense"
//                         label="Email Body"
//                         type="text"
//                         fullWidth
//                         variant="outlined"
//                         multiline
//                         rows={10}
//                         value={emailBody}
//                         onChange={(e) => setEmailBody(e.target.value)}
//                     />
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                         This email will be sent to {selectedCandidates.length} selected candidates.
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
//                     <Button
//                         onClick={handleSendBulkEmail}
//                         variant="contained"
//                         disabled={isSendingEmail || !emailSubject || !emailBody}
//                         startIcon={isSendingEmail ? <CircularProgress size={20} /> : null}
//                     >
//                         {isSendingEmail ? 'Sending...' : 'Send Email'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Stages Summary */}
//             <Card sx={{ mb: 2, overflow: "hidden" }}>
//                 <CardContent sx={{ p: 2 }}>
//                     <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, overflowX: "auto", py: 2 }}>
//                         {stageCardData.map(({ stage, label, count, totalCount }) => (
//                             <Card
//                                 key={stage}
//                                 id={stage === 'rejected' ? 'rejected-card' : undefined}
//                                 onClick={() => {
//                                     if (stage === 'rejected') {
//                                         handleRejectedCardClick();
//                                     } else {
//                                         handleStageCardClick(stage);
//                                     }
//                                 }}
//                                 sx={{
//                                     backgroundColor: (stage === 'sourced' && !filters.status) ||
//                                         (stage !== 'sourced' && filters.status.toLowerCase() === stage) ?
//                                         "#e3f2fd" : "#f5f5f5",
//                                     width: "150px",
//                                     textAlign: "center",
//                                     borderRadius: 2,
//                                     p: 2,
//                                     boxShadow: 2,
//                                     flexShrink: 0,
//                                     cursor: "pointer",
//                                     transition: "transform 0.2s",
//                                     ":hover": {
//                                         transform: "translateY(-4px)",
//                                         boxShadow: 4,
//                                     }
//                                 }}
//                             >
//                                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                     {stage === 'sourced' ? `${totalCount}` : count}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                     {label}
//                                 </Typography>
//                             </Card>
//                         ))}
//                     </Box>
//                 </CardContent>
//             </Card>

//             {/* Rejected Filter */}
//             {filters.status.toLowerCase() === 'rejected' && (
//                 <Box sx={{ mb: 2 }}>
//                     <FormControl size="small" sx={{ minWidth: 200 }}>
//                         <InputLabel>Rejection Type</InputLabel>
//                         <Select
//                             value={rejectedFilter}
//                             onChange={handleRejectedFilterChange}
//                             label="Rejection Type"
//                         >
//                             <MenuItem value="">All Rejected</MenuItem>
//                             {rejectionTypes.map(type => (
//                                 <MenuItem key={type} value={type}>{type}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>
//             )}

//             {/* Filters */}
//             <Card sx={{ mb: 2 }}>
//                 <CardContent>
//                     <Typography variant="subtitle1" fontWeight={600} mb={2}>
//                         Filters
//                     </Typography>
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
//                         <FormControl size="small" sx={{ minWidth: 180 }}>
//                             <InputLabel>Source</InputLabel>
//                             <Select
//                                 label="Source"
//                                 value={filters.source}
//                                 onChange={handleFilterChange('source')}
//                             >
//                                 <MenuItem value="">All Sources</MenuItem>
//                                 {
//                                     (Array.isArray(candidates) ? candidates : [])
//                                         .map(c => {
//                                             if (!c) return null;
//                                             if (typeof c.source === 'string') return c.source;
//                                             if (c.source && typeof c.source === 'object') return c.source.name;
//                                             return null;
//                                         })
//                                         .filter(Boolean)
//                                         .filter((value, index, self) => self.indexOf(value) === index) // Unique values
//                                         .map(source => (
//                                             <MenuItem key={source} value={source}>{source}</MenuItem>
//                                         ))
//                                 }
//                             </Select>
//                         </FormControl>

//                         <FormControl size="small" sx={{ minWidth: 180 }}>
//                             <InputLabel>Experience</InputLabel>
//                             <Select
//                                 label="Experience"
//                                 value={filters.experience}
//                                 onChange={handleFilterChange('experience')}
//                             >
//                                 <MenuItem value="">All Experience</MenuItem>
//                                 <MenuItem value="0-2">0-2 years</MenuItem>
//                                 <MenuItem value="3-5">3-5 years</MenuItem>
//                                 <MenuItem value="5+">5+ years</MenuItem>
//                             </Select>
//                         </FormControl>

//                         <FormControl size="small" sx={{ minWidth: 250 }}>
//                             <InputLabel>Available to join (In Days)</InputLabel>
//                             <Select
//                                 label="Available to join (In Days)"
//                                 value={filters.availableToJoin}
//                                 onChange={handleFilterChange('availableToJoin')}
//                             >
//                                 <MenuItem value="">Any Availability</MenuItem>
//                                 <MenuItem value="7">Within 7 days</MenuItem>
//                                 <MenuItem value="15">Within 15 days</MenuItem>
//                                 <MenuItem value="30">Within 30 days</MenuItem>
//                                 <MenuItem value="60">Within 60 days</MenuItem>
//                             </Select>
//                         </FormControl>

//                         <FormControl size="small" sx={{ minWidth: 150 }}>
//                             <InputLabel>Status</InputLabel>
//                             <Select
//                                 label="Status"
//                                 value={filters.status}
//                                 onChange={handleFilterChange('status')}
//                             >
//                                 <MenuItem value="">All Statuses</MenuItem>
//                                 {stageOptions.map(option => (
//                                     <MenuItem key={option._id || option} value={option.name || option}>
//                                         {option.name || option}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>

//                         <TextField
//                             size="small"
//                             placeholder="Search candidates..."
//                             value={filters.searchQuery}
//                             onChange={handleFilterChange('searchQuery')}
//                             sx={{ flexGrow: 1, maxWidth: 400 }}
//                             InputProps={{
//                                 endAdornment: (
//                                     <IconButton size="small">
//                                         <FilterIcon />
//                                     </IconButton>
//                                 ),
//                             }}
//                         />
//                     </Box>
//                 </CardContent>
//             </Card>

//             {/* Bulk Actions */}
//             {selectedCandidates.length > 0 && (
//                 <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
//                     <Typography variant="body2">{selectedCandidates.length} selected</Typography>
//                     <FormControl size="small" sx={{ minWidth: 150 }}>
//                         <InputLabel>Bulk Actions</InputLabel>
//                         <Select
//                             label="Bulk Actions"
//                             defaultValue=""
//                             onChange={(e) => handleBulkAction(e.target.value)}
//                         >
//                             <MenuItem value="email">
//                                 <ListItemIcon>
//                                     <EmailIcon fontSize="small" />
//                                 </ListItemIcon>
//                                 <ListItemText>Send email</ListItemText>
//                             </MenuItem>
//                             <MenuItem value="delete">Delete</MenuItem>
//                             <MenuItem value="move-to-sourced">
//                                 <ListItemIcon>
//                                     <StageIcon fontSize="small" />
//                                 </ListItemIcon>
//                                 <ListItemText>Move to another Stage</ListItemText>
//                             </MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Box>
//             )}

//             {/* Interview Forms */}
//             {currentCandidate && (
//                 <>
//                     <ScheduleOnlineInterviewForm
//                         open={showInterviewModal && interviewType === "online"}
//                         onClose={() => setShowInterviewModal(false)}
//                         candidate={currentCandidate}
//                         user={{ email: localStorage.getItem("user_email") }}
//                         onSuccess={() => {
//                             showSnackbar("Online interview scheduled successfully!");
//                             setShowInterviewModal(false);
//                         }}
//                     />
//                     <ScheduleOfflineInterviewForm
//                         open={showInterviewModal && interviewType === "offline"}
//                         onClose={() => setShowInterviewModal(false)}
//                         candidate={currentCandidate}
//                         user={{ email: localStorage.getItem("user_email") }}
//                         onSuccess={() => {
//                             showSnackbar("Offline interview scheduled successfully!");
//                             setShowInterviewModal(false);
//                         }}
//                     />
//                 </>
//             )}

//             {/* Interview Menu */}
//             <Menu
//                 anchorEl={interviewAnchorEl}
//                 open={Boolean(interviewAnchorEl)}
//                 onClose={handleCloseInterviewMenu}
//             >
//                 <MenuItem onClick={() => handleInterviewOption("online", currentCandidate)}>
//                     <ListItemText>Schedule Online Interview</ListItemText>
//                 </MenuItem>
//                 <MenuItem onClick={() => handleInterviewOption("offline", currentCandidate)}>
//                     <ListItemText>Schedule Offline Interview</ListItemText>
//                 </MenuItem>
//             </Menu>

//             {/* Stage Menu */}
//             <Menu
//                 anchorEl={stageAnchorEl}
//                 open={Boolean(stageAnchorEl)}
//                 onClose={handleCloseStageMenu}
//             >
//                 <MenuItem onClick={() => {
//                     setMoveDialogOpen(true);
//                     handleCloseStageMenu();
//                 }}>
//                     <ListItemText>Move to Another Stage</ListItemText>
//                 </MenuItem>
//             </Menu>

//             {/* Remarks Menu */}
//             <Menu
//                 anchorEl={remarksAnchorEl}
//                 open={Boolean(remarksAnchorEl)}
//                 onClose={handleCloseRemarksMenu}
//             >
//                 <MenuItem onClick={handleAddRemarks}>
//                     <ListItemIcon>
//                         <RemarksIcon fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText>Add Remarks</ListItemText>
//                 </MenuItem>
//             </Menu>

//             <Dialog open={remarksDialogOpen} onClose={() => setRemarksDialogOpen(false)}>
//                 <DialogTitle>Add Remarks</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         id="remarks"
//                         label="Remarks"
//                         type="text"
//                         fullWidth
//                         variant="standard"
//                         multiline
//                         rows={4}
//                         value={remarksText}
//                         onChange={(e) => setRemarksText(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setRemarksDialogOpen(false)}>Cancel</Button>
//                     <Button onClick={handleSubmitRemarks}>Save</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Resume Analysis Dialog */}
//             <Dialog
//                 open={analysisDialogOpen}
//                 onClose={() => setAnalysisDialogOpen(false)}
//                 maxWidth="md"
//                 fullWidth
//                 sx={{
//                     '& .MuiDialog-paper': {
//                         borderRadius: 3,
//                         maxHeight: '90vh'
//                     }
//                 }}
//             >
//                 <DialogTitle sx={{
//                     color: 'white',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     padding: '16px 24px'
//                 }}>
//                     <Box display="flex" alignItems="center">
//                         <AnalysisIcon sx={{ mr: 1 }} />
//                         <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
//                             Resume Analysis - {selectedCandidateForAnalysis?.firstName} {selectedCandidateForAnalysis?.lastName}
//                         </Typography>
//                     </Box>
//                     <IconButton
//                         edge="end"
//                         color="inherit"
//                         onClick={() => setAnalysisDialogOpen(false)}
//                         aria-label="close"
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers sx={{ p: 0 }}>
//                     {analysisLoading ? (
//                         <Box sx={{
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             height: '200px'
//                         }}>
//                             <CircularProgress />
//                         </Box>
//                     ) : (
//                         <CandidateResumeAnalysis
//                             open={analysisDialogOpen}
//                             onClose={() => setAnalysisDialogOpen(false)}
//                             candidate={selectedCandidateForAnalysis}
//                             analysisData={analysisData}
//                             loading={analysisLoading}
//                         />
//                     )}
//                 </DialogContent>
//             </Dialog>

//             {/* Candidate Views */}
//             {viewMode === "table" ? (
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                                 <TableCell padding="checkbox">
//                                     <Checkbox
//                                         onChange={handleSelectAllCandidates}
//                                         checked={selectedCandidates.length === getFilteredCandidates().length}
//                                         sx={{ color: '#3f51b5' }}
//                                     />
//                                 </TableCell>

//                                 {[
//                                     "Name",
//                                     "Status",
//                                     "Experience",
//                                     "Source",
//                                     "Available to join",
//                                     "Email",
//                                     "Phone",
//                                     // "Candidate Owner",
//                                     "Actions"
//                                 ].map((label, index) => (
//                                     <TableCell
//                                         key={index}
//                                         sx={{
//                                             fontWeight: 'bold',
//                                             fontSize: '0.85rem',
//                                             color: '#333',
//                                             borderBottom: '2px solid #e0e0e0'
//                                         }}
//                                     >
//                                         {label}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {getFilteredCandidates().map((candidate) => (
//                                 <TableRow
//                                     key={candidate._id}
//                                     hover
//                                     sx={{ cursor: "pointer" }}
//                                     onClick={() => handleNavigateToCandidate(candidate)}
//                                 >
//                                     <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
//                                         <Checkbox
//                                             checked={selectedCandidates.includes(candidate._id)}
//                                             onChange={() => handleSelectCandidate(candidate._id)}
//                                         />
//                                     </TableCell>
//                                     <TableCell>
//                                         {`${candidate.firstName || ''} ${candidate.middleName || ''} ${candidate.lastName || ''}`.trim()}
//                                     </TableCell>
//                                     <TableCell>
//                                         <ErrorBoundary>
//                                             <Box>
//                                                 {(() => {
//                                                     try {
//                                                         // Force conversion to string
//                                                         const stageName = String(getStageName(candidate?.stage || 'Sourced'));
//                                                         const rejectionType = candidate?.rejectionType
//                                                             ? String(candidate.rejectionType)
//                                                             : null;

//                                                         return (
//                                                             <>
//                                                                 <Typography component="span">
//                                                                     {stageName}
//                                                                 </Typography>
//                                                                 {stageName === "Rejected" && rejectionType && (
//                                                                     <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
//                                                                         {rejectionType}
//                                                                     </Typography>
//                                                                 )}
//                                                             </>
//                                                         );
//                                                     } catch (error) {
//                                                         console.error('Error rendering stage:', error);
//                                                         return (
//                                                             <Typography color="error">
//                                                                 Error loading stage
//                                                             </Typography>
//                                                         );
//                                                     }
//                                                 })()}
//                                             </Box>
//                                         </ErrorBoundary>
//                                     </TableCell>
//                                     <TableCell>{candidate.experience || '0'} years</TableCell>
//                                     <ErrorBoundary>
//                                         <TableCell>
//                                             {typeof candidate.source === 'string'
//                                                 ? candidate.source
//                                                 : candidate.source?.name || 'Unknown'}
//                                         </TableCell></ErrorBoundary>
//                                     <TableCell>{candidate.availableToJoin || '0'} days</TableCell>
//                                     <TableCell>
//                                         <Box>
//                                             <div>{candidate.email || 'Not provided'}</div>
//                                         </Box>
//                                     </TableCell>
//                                     <TableCell>{candidate.mobile || 'Not provided'}</TableCell>
//                                     {/* <TableCell>{candidate.owner || localStorage.getItem("user_name") || 'Not assigned'}</TableCell> */}
//                                     <TableCell onClick={(e) => e.stopPropagation()}>

//                                         <IconButton
//                                             className="action-button"
//                                             onClick={(e) => handleInterviewClick(e, candidate._id)}
//                                         >
//                                             <InterviewIcon />
//                                         </IconButton>
//                                         <IconButton
//                                             className="action-button"
//                                             onClick={(e) => handleStageClick(e, candidate._id)}
//                                         >
//                                             <StageIcon />
//                                         </IconButton>
//                                         <IconButton
//                                             className="action-button"
//                                             onClick={(e) => handleRemarksClick(e, candidate._id)}
//                                         >
//                                             <MoreIcon />
//                                         </IconButton>
//                                         <Button
//                                             variant="outlined"
//                                             startIcon={<AnalysisIcon />}
//                                             onClick={() => handleOpenAnalysis(candidate._id)}
//                                             disabled={!candidate.resume}
//                                             size="small"
//                                             sx={{ mr: 1 }}
//                                         >
//                                             View Analysis
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             ) : (
//                 <Box
//                     sx={{
//                         display: "grid",
//                         gridTemplateColumns: { xs: "极狐", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
//                         gap: 2,
//                         padding: 3,
//                     }}
//                 >
//                     {getFilteredCandidates().map((candidate) => (
//                         <Card
//                             key={candidate._id}
//                             sx={{
//                                 borderRadius: 3,
//                                 boxShadow: 6,
//                                 transition: "transform 0.3s ease, box-shadow 0.3s ease",
//                                 ":hover": {
//                                     transform: "translateY(-8px)",
//                                     boxShadow: 12,
//                                 },
//                                 display: "极狐",
//                                 flexDirection: "column",
//                                 height: "100%",
//                                 bgcolor: "background.paper",
//                             }}
//                         >
//                             <CardContent
//                                 sx={{ display: "极狐", flexDirection: "column", gap: 3, padding: 3 }}
//                             >
//                                 {/* Header: Name, Avatar, and Checkbox */}
//                                 <Box sx={{ display: "极狐", alignItems: "center", gap: 3 }}>
//                                     <Checkbox
//                                         checked={selectedCandidates.includes(candidate._id)}
//                                         onChange={(e) => {
//                                             e.stopPropagation();
//                                             handleSelectCandidate(candidate._id);
//                                         }}
//                                         color="primary"
//                                         sx={{ padding: 0 }}
//                                     />
//                                     <Avatar
//                                         sx={{
//                                             bgcolor: "primary.main",
//                                             fontSize: "1.4rem",
//                                             fontWeight: "bold",
//                                             width: 48,
//                                             height: 48,
//                                         }}
//                                         onClick={() => handleNavigateToCandidate(candidate)}
//                                     >
//                                         {candidate.firstName?.charAt(0) || '?'}
//                                     </Avatar>
//                                     <Box sx={{ flex: 1 }} onClick={handleNavigateToCandidate(candidate)}>
//                                         <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
//                                             {`${candidate.firstName || ''} ${candidate.middleName || ''} ${candidate.lastName || ''}`.trim()}
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                                             {candidate.experience || '0'} years | {typeof candidate.source === 'string'
//                                                 ? candidate.source
//                                                 : candidate.source?.name || 'Unknown'}
//                                         </Typography>
//                                     </Box>
//                                     <IconButton
//                                         className="action-button"
//                                         sx={{ color: "text.secondary" }}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleRemarksClick(e, candidate._id);
//                                         }}
//                                     >
//                                         <MoreIcon />
//                                     </IconButton>
//                                 </Box>

//                                 {/* Status Chip */}
//                                 <Chip
//                                     label={getStageName(candidate.stage)}
//                                     color={
//                                         getStageName(candidate.stage) === "Hired" ? "success" :
//                                             getStageName(candidate.stage) === "Archived" ? "default" : "primary"
//                                     }
//                                     size="small"
//                                     sx={{
//                                         alignSelf: "flex-start",
//                                         fontWeight: "bold",
//                                         backgroundColor:
//                                             getStageName(candidate.stage) === "Hired" ? "success.light" :
//                                                 getStageName(candidate.stage) === "Archived" ? "grey.500" : "极狐.light",
//                                         color: "white",
//                                         borderRadius: 20,
//                                         padding: "0.5rem 1rem",
//                                         mb: 2,
//                                     }}
//                                 />

//                                 {/* Rejection Details */}
//                                 {getStageName(candidate.stage) === "Rejected" && candidate.rejectionType && (
//                                     <Box sx={{
//                                         backgroundColor: '#ffeeee',
//                                         p: 1,
//                                         borderRadius: 1,
//                                         borderLeft: '3px solid #f44336'
//                                     }}>
//                                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                                             {candidate.rejectionType}
//                                         </Typography>
//                                         {candidate.rejectionReason && (
//                                             <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
//                                                 {candidate.rejectionReason}
//                                             </Typography>
//                                         )}
//                                     </Box>
//                                 )}

//                                 {/* Contact Info */}
//                                 <Box onClick={() => handleNavigateToCandidate(candidate)}>
//                                     <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
//                                         <strong>Email:</strong> {candidate.email || 'Not provided'}
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
//                                         <strong>Phone:</strong> {candidate.mobile || 'Not provided'}
//                                     </Typography>
//                                     {/* <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "500" }}>
//                                         <strong>Owner:</strong> {candidate.owner || localStorage.getItem("user_name") || 'Not assigned'}
//                                     </Typography> */}
//                                 </Box>

//                                 {/* Action Buttons */}
//                                 <Box
//                                     sx={{
//                                         display: "",
//                                         justifyContent: "space-between",
//                                         marginTop: 3,
//                                         gap: 1
//                                     }}
//                                     onClick={(e) => e.stopPropagation()}
//                                 >
//                                     <Button
//                                         variant="contained"
//                                         startIcon={<AnalysisIcon />}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleOpenAnalysis(candidate._id);
//                                         }}
//                                         disabled={!candidate.resume}
//                                         sx={{
//                                             flex: 1,
//                                             textTransform: 'none',
//                                             backgroundColor: '#4caf50',
//                                             '&:hover': {
//                                                 backgroundColor: '#388e3c',
//                                             }
//                                         }}
//                                     >
//                                         View Analysis
//                                     </Button>
//                                     <IconButton
//                                         className="action-button"
//                                         onClick={(极狐) => {
//                                             e.stopPropagation();
//                                             handleInterviewClick(e, candidate._id);
//                                         }}
//                                         sx={{
//                                             backgroundColor: "primary.main",
//                                             color: "white",
//                                             borderRadius: "50%",
//                                             padding: 2,
//                                             ":hover": { backgroundColor: "primary.dark" },
//                                             transition: "background-color 0.2s ease",
//                                         }}
//                                     >
//                                         <InterviewIcon />
//                                     </IconButton>
//                                     <IconButton
//                                         className="action-button"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleStageClick(e, candidate._id);
//                                         }}
//                                         sx={{
//                                             backgroundColor: "secondary.main",
//                                             color: "white",
//                                             borderRadius: "50%",
//                                             padding: 2,
//                                             ":hover": { backgroundColor: "secondary.dark" },
//                                             transition: "background-color 0.2s ease",
//                                         }}
//                                     >
//                                         <StageIcon />
//                                     </IconButton>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </Box>
//             )}
//             {openDetailsDialog && (
//                 <CandidateDetailsPage
//                     open={openDetailsDialog}
//                     onClose={handleCloseDetails}
//                     candidate={selectedCandidate}
//                 />
//             )}
//         </Box>
//     );
// };

// export default CandidatesTab;