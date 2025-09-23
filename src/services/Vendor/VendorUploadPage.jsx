import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'
import {
    Box,
    Card,
    CardContent,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button,
    IconButton,
    Typography,
    Grid,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    LinearProgress,
    Divider,
    Stack,
    Fade,
    Backdrop,
    DialogContentText,
    TextField as MuiTextField,
    InputAdornment,
    Tabs,
    Tab,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    AttachFile as AttachFileIcon,
    Analytics,
    Add as AddIcon,
    Close,
    Download,
} from '@mui/icons-material';

const VendorUploadPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [jobDetails, setJobDetails] = useState(null);
    const [vendorEmail, setVendorEmail] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [activeTab, setActiveTab] = useState(0);
    const [analysisData, setAnalysisData] = useState(null);
    const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
    const [emailWarning, setEmailWarning] = useState(false);
    const [duplicateEmailError, setDuplicateEmailError] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [locations, setLocations] = useState([]);
    const [sources, setSources] = useState([]);
    const [stages, setStages] = useState([]);
    const [loadingStages, setLoadingStages] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [loadingSources, setLoadingSources] = useState(false);
    const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
    const [showAddSourceDialog, setShowAddSourceDialog] = useState(false);
    const [newLocation, setNewLocation] = useState("");
    const [newSource, setNewSource] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        stage: "",
        source: "",
        availableToJoin: "",
        currentLocation: "",
        preferredLocation: "",
        gender: "",
        currentCTC: "",
        expectedCTC: "",
        currency: "INR",
        skills: "",
        experience: "",
        education: "",
        additionalDocuments: null,
        resume: null,
    });

    const fileInputRef = useRef(null);
    const docsInputRef = useRef(null);
    const bulkInputRef = useRef(null);


   const decodeToken = (token) => {
  try {
    return jwtDecode(token); // ✅ Use jwtDecode from your import
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

    // Get auth headers for API calls
    const getAuthHeaders = () => {
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/validate-token/${token}`);

                if (response.data.valid) {
                    setJobDetails(response.data.job);
                    setVendorEmail(response.data.vendorEmail);
                    fetchInitialData();
                } else {
                    setError(response.data.error || 'Invalid or expired token');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                if (error.response?.data?.error) {
                    setError(error.response.data.error);
                } else {
                    setError('Failed to validate token. Please check your connection.');
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchInitialData = async () => {
            try {
                setLoadingStages(true);
                setLoadingLocations(true);
                setLoadingSources(true);

                const [stagesData, locationsData, sourcesData] = await Promise.all([
                    axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/stages/all', getAuthHeaders()),
                    axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/locations', getAuthHeaders()),
                    axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/sources', getAuthHeaders()),
                ]);

                setStages(stagesData.data);
                setLocations(locationsData.data);
                setSources(sourcesData.data);
            } catch (error) {
                console.error('Failed to load initial data:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load form data. Please refresh the page.',
                    severity: 'error'
                });
            } finally {
                setLoadingStages(false);
                setLoadingLocations(false);
                setLoadingSources(false);
            }
        };

        validateToken();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "email" && duplicateEmailError) {
            setDuplicateEmailError(false);
        }
    };

    const handleCurrencyChange = (e) => {
        setFormData((prev) => ({ ...prev, currency: e.target.value }));
    };

    // ✅ Corrected handleResumeUpload function
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!validTypes.includes(file.type)) {
            setSnackbar({
                open: true,
                message: "Invalid file type. Please upload PDF or Word documents",
                severity: "error",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message: "File size should be less than 5MB",
                severity: "error",
            });
            return;
        }

        setIsAnalyzingResume(true);
        setEmailWarning(false);
        setDuplicateEmailError(false);
        setResumeFile(file);

        try {
    const formData = new FormData();
    formData.append('resume', file);
    
    // ✅ Use jwtDecode directly
    const decodedToken = jwtDecode(token);
    const jobIdFromToken = decodedToken?.jobId;
    
    formData.append('jobId', jobIdFromToken);

    const response = await axios.post(
      'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/resumes/analyze',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

            if (response.data.success) {
                setAnalysisData(response.data.data);

                // DEBUG: Log the full response to understand its structure
                console.log('Full API response:', response.data);
                console.log('Extracted data:', response.data.data.extractedData);
                console.log('AI Analysis:', response.data.aiAnalysis);

                // Extract data from the response - handle different possible structures
                const extractedData = response.data.data.extractedData || {};
                const aiAnalysis = response.data.aiAnalysis || {};

                // Auto-fill form fields with extracted data
                setFormData((prev) => ({
                    ...prev,
                    firstName: extractedData.firstName || extractedData.firstname || prev.firstName,
                    lastName: extractedData.lastName || extractedData.lastname || prev.lastName,
                    email: extractedData.email || extractedData.contactEmail || prev.email,
                    mobile: extractedData.mobile || extractedData.phone || extractedData.contact || prev.mobile,
                    skills: Array.isArray(extractedData.skills) ?
                        extractedData.skills.join(", ") :
                        extractedData.skills || prev.skills,
                    experience: extractedData.experience || extractedData.workExperience || prev.experience,
                    education: extractedData.education || extractedData.educationalBackground || prev.education,
                    resume: file,
                }));

                // Check if email was found
                const hasEmail = extractedData.email || extractedData.contactEmail;
                if (!hasEmail) {
                    setEmailWarning(true);
                    setSnackbar({
                        open: true,
                        message: "No email found in resume. Please add manually.",
                        severity: "warning",
                    });
                } else {
                    setEmailWarning(false);
                }

                // Show analysis dialog if we have analysis data
                if (aiAnalysis.matchPercentage !== undefined) {
                    setShowAnalysisDialog(true);
                }

                setSnackbar({
                    open: true,
                    message: "Resume analyzed successfully",
                    severity: "success",
                });
            } else {
                throw new Error(response.data.error || "Analysis failed");
            }
        } catch (error) {
            console.error('Resume analysis error:', error);

            let errorMessage = "Failed to analyze resume";
            let severity = "error";

            if (error.response) {
                if (error.response.status === 409) {
                    errorMessage = error.response.data.message || "This email already exists in our system";
                    setDuplicateEmailError(true);
                } else if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity,
            });
        } finally {
            setIsAnalyzingResume(false);
        }
    };


    const handleDocsUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, additionalDocuments: file }));
            setSnackbar({
                open: true,
                message: "Document attached successfully",
                severity: "success",
            });
        }
    };

    const handleBulkUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Handle bulk file upload logic here
        console.log('Bulk files selected:', files);
        setSnackbar({
            open: true,
            message: "Bulk upload file selected. Processing...",
            severity: "info",
        });
    };

    const downloadTemplate = () => {
        // Create a template download link
        const templateContent = "firstName,lastName,email,mobile,currentCTC,expectedCTC,currency,skills,experience,education,availableToJoin,gender,source,stage,currentLocation,preferredLocation\nJohn,Doe,john.doe@example.com,1234567890,500000,700000,INR,\"Java,Spring,SQL\",\"5 years in software development\",\"BTech in Computer Science\",30,Male,Referral,Screening, Bangalore, Bangalore";

        const blob = new Blob([templateContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'candidate_upload_template.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();

        setSnackbar({
            open: true,
            message: "Template downloaded successfully!",
            severity: "success",
        });
    };

    const handleSubmit = async () => {
        if (emailWarning && !formData.email) {
            setSnackbar({
                open: true,
                message: "Please enter candidate email address",
                severity: "error",
            });
            return;
        }

        if (!resumeFile) {
            setSnackbar({
                open: true,
                message: "Please upload a resume first",
                severity: "error",
            });
            return;
        }

        if (formData.currentCTC && (isNaN(formData.currentCTC) || formData.currentCTC < 0)) {
            setSnackbar({
                open: true,
                message: "Current CTC must be a valid positive number",
                severity: "error",
            });
            return;
        }

        if (formData.expectedCTC && (isNaN(formData.expectedCTC) || formData.expectedCTC < 0)) {
            setSnackbar({
                open: true,
                message: "Expected CTC must be a valid positive number",
                severity: "error",
            });
            return;
        }

        setIsLoading(true);
        try {
    const formDataToSend = new FormData();

    // ✅ Append all form data EXCEPT files
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'resume' && key !== 'additionalDocuments') {
        formDataToSend.append(key, value.toString());
      }
    });

    // ✅ Append files
    if (resumeFile) {
      formDataToSend.append('resume', resumeFile);
    }
    if (formData.additionalDocuments) {
      formDataToSend.append('additionalDocuments', formData.additionalDocuments);
    }

    // ✅ Use jwtDecode directly
    const decodedToken = jwtDecode(token);
    const jobIdFromToken = decodedToken?.jobId;

    console.log('Job ID from token:', jobIdFromToken);

    if (!jobIdFromToken) {
      setSnackbar({
        open: true,
        message: "Job ID is missing. Please refresh the page and try again.",
        severity: "error",
      });
      return;
    }

    formDataToSend.append('jobId', jobIdFromToken);
    formDataToSend.append('vendorEmail', vendorEmail);

    const response = await axios.post(
      'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/submit-candidate',
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      }
    );

            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: response.data.message || "Candidate submitted for approval",
                    severity: "success",
                });

                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobile: "",
                    stage: "",
                    source: "",
                    availableToJoin: "",
                    currentLocation: "",
                    preferredLocation: "",
                    gender: "",
                    currentCTC: "",
                    expectedCTC: "",
                    currency: "INR",
                    skills: "",
                    experience: "",
                    education: "",
                    additionalDocuments: null,
                    resume: null,
                });
                setResumeFile(null);
            }
        } catch (error) {
            console.error('Candidate submission error:', error);

            let errorMessage = "Failed to submit candidate";
            let severity = "error";

            if (error.response) {
                if (error.response.status === 409) {
                    errorMessage = error.response.data.error || "This candidate already exists";
                    if (error.response.data.duplicate) {
                        // Handle duplicate case - don't reset form, let vendor see the error
                        severity = "warning";
                    }
                } else if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                }
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleShowAnalysis = () => {
        setShowAnalysisDialog(true);
    };

    const handleCloseAnalysisDialog = () => {
        setShowAnalysisDialog(false);
    };

    const handleAddLocation = async () => {
        if (!newLocation.trim()) return;

        try {
            setIsLoading(true);
            const response = await axios.post(
                'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/location',
                { name: newLocation },
                getAuthHeaders()
            );
            setLocations((prev) => [...prev, response.data]);
            setFormData((prev) => ({
                ...prev,
                currentLocation: response.data._id,
                preferredLocation: response.data._id,
            }));
            setNewLocation("");
            setShowAddLocationDialog(false);
            setSnackbar({
                open: true,
                message: "Location added successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Failed to add location",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSource = async () => {
        if (!newSource.trim()) return;

        try {
            setIsLoading(true);
            const response = await axios.post(
                'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/source',
                { name: newSource },
                // getAuthHeaders()
            );
            setSources((prev) => [...prev, response.data]);
            setFormData((prev) => ({ ...prev, source: response.data._id }));
            setNewSource("");
            setShowAddSourceDialog(false);
            setSnackbar({
                open: true,
                message: "Source added successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Failed to add source",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Validating your access...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Return to Home
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Submit Candidates for: {jobDetails.jobTitle}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Shared with: {vendorEmail}
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Job Details
                    </Typography>

                    {jobDetails.compensation && jobDetails.compensation.currency && jobDetails.compensation.amount && (
                        <Typography variant="body1" paragraph>
                            <strong>Compensation:</strong> {jobDetails.compensation.currency} {jobDetails.compensation.amount}
                        </Typography>
                    )}

                    <Typography variant="body1" paragraph>
                        <strong>Description:</strong> {jobDetails.jobDesc}
                    </Typography>

                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                        <Tab label="Add Candidate" />
                        <Tab label="Bulk Upload" />
                    </Tabs>

                    {activeTab === 0 && (
                        <Box
                            sx={{
                                width: "100%",
                                mx: "auto",
                                p: 0,
                                position: "relative",
                            }}
                        >
                            <Backdrop
                                sx={{
                                    color: "#fff",
                                    zIndex: (theme) => theme.zIndex.drawer + 1,
                                    position: "absolute",
                                    borderRadius: "12px",
                                }}
                                open={isLoading || isAnalyzingResume}
                            >
                                <Fade in={isLoading || isAnalyzingResume}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            p: 4,
                                            borderRadius: "12px",
                                            boxShadow: 3,
                                        }}
                                    >
                                        <CircularProgress
                                            size={60}
                                            thickness={4}
                                            sx={{
                                                color: "#3f51b5",
                                                mb: 2,
                                            }}
                                        />
                                        <Typography variant="h6" color="text.primary">
                                            {isAnalyzingResume ? "Analyzing Resume..." : "Adding Candidate..."}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Please wait while we process your request
                                        </Typography>
                                    </Box>
                                </Fade>
                            </Backdrop>

                            <Box sx={{ textAlign: "center", mb: 3 }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={isLoading || isAnalyzingResume}
                                >
                                    {isAnalyzingResume ? (
                                        <CircularProgress size={40} />
                                    ) : (
                                        <CloudUploadIcon sx={{ fontSize: 40 }} />
                                    )}
                                </IconButton>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Upload Resume (PDF, DOC, DOCX)
                                </Typography>
                                {resumeFile && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {resumeFile.name}
                                    </Typography>
                                )}
                            </Box>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Typography variant="h6">Candidate Information</Typography>
                                {analysisData && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<Analytics />}
                                        onClick={handleShowAnalysis}
                                        size="small"
                                    >
                                        View Analysis
                                    </Button>
                                )}
                            </Stack>

                            <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        size="small"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        size="small"
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        size="small"
                                        required
                                        error={duplicateEmailError}
                                        helperText={
                                            duplicateEmailError
                                                ? "This email already exists in our system"
                                                : emailWarning
                                                    ? "No email found in resume. Please add manually."
                                                    : ""
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        size="small"
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal" size="small">
                                        <InputLabel id="stage">Stage</InputLabel>
                                        <Select
                                            labelId="stage"
                                            label="stage"
                                            name="stage"
                                            value={formData.stage}
                                            onChange={handleChange}
                                            sx={{
                                                height: 40,
                                                width: 265,
                                            }}
                                            disabled={loadingStages}
                                            required
                                        >
                                            {loadingStages ? (
                                                <MenuItem value="">
                                                    <CircularProgress size={24} />
                                                </MenuItem>
                                            ) : (
                                                Array.isArray(stages) && stages.map((stage) => (
                                                    <MenuItem key={stage._id} value={stage._id}>
                                                        {stage.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal" size="small">
                                        <InputLabel id="source">Source</InputLabel>
                                        <Select
                                            labelId="source"
                                            label="source"
                                            name="source"
                                            value={formData.source}
                                            onChange={handleChange}
                                            sx={{
                                                height: 40,
                                                width: 265,
                                            }}
                                            required
                                        >
                                            {loadingSources ? (
                                                <MenuItem value="">
                                                    <CircularProgress size={24} />
                                                </MenuItem>
                                            ) : (
                                                Array.isArray(sources) && sources.map((source) => (
                                                    <MenuItem key={source._id} value={source._id}>
                                                        {source.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                            <Divider />
                                            <MenuItem
                                                onClick={() => setShowAddSourceDialog(true)}
                                                sx={{ color: "primary.main" }}
                                            >
                                                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                                                Add New Source
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Available to Join (Days)"
                                        name="availableToJoin"
                                        type="number"
                                        value={formData.availableToJoin}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        margin="normal"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal" size="small">
                                        <InputLabel id="location">Current Location</InputLabel>
                                        <Select
                                            labelId="location"
                                            label="Current Location"
                                            name="currentLocation"
                                            value={formData.currentLocation}
                                            onChange={handleChange}
                                            sx={{
                                                height: 40,
                                                width: 265,
                                            }}
                                        >
                                            {loadingLocations ? (
                                                <MenuItem value="">
                                                    <CircularProgress size={24} />
                                                </MenuItem>
                                            ) : (
                                                Array.isArray(locations) && locations.map((location) => (
                                                    <MenuItem key={location._id} value={location._id}>
                                                        {location.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                            <Divider />
                                            <MenuItem
                                                onClick={() => setShowAddLocationDialog(true)}
                                                sx={{ color: "primary.main" }}
                                            >
                                                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                                                Add New Location
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal" size="small">
                                        <InputLabel id="location">Preferred Location</InputLabel>
                                        <Select
                                            labelId="location"
                                            label="Preferred Location"
                                            name="preferredLocation"
                                            value={formData.preferredLocation}
                                            onChange={handleChange}
                                            sx={{
                                                height: 40,
                                                width: 265,
                                            }}
                                        >
                                            {loadingLocations ? (
                                                <MenuItem value="">
                                                    <CircularProgress size={24} />
                                                </MenuItem>
                                            ) : (
                                                Array.isArray(locations) && locations.map((location) => (
                                                    <MenuItem key={location._id} value={location._id}>
                                                        {location.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                            <Divider />
                                            <MenuItem
                                                onClick={() => setShowAddLocationDialog(true)}
                                                sx={{ color: "primary.main" }}
                                            >
                                                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                                                Add New Location
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal" size="small">
                                        <InputLabel id="Gender">Gender</InputLabel>
                                        <Select
                                            labelId="Gender"
                                            label="Gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            sx={{
                                                height: 40,
                                                width: 265,
                                            }}
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                            <MenuItem value="Prefer not to say">
                                                Prefer not to say
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Current CTC"
                                        name="currentCTC"
                                        type="number"
                                        value={formData.currentCTC}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        margin="normal"
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {/* <Select
                            value={formData.currency || 'INR'}
                            onChange={handleCurrencyChange}
                            size="small"
                            sx={{ minWidth: 70 }}
                          >
                            <MenuItem value="INR">₹</MenuItem>
                            <MenuItem value="USD">$</MenuItem>
                            <MenuItem value="EUR">€</MenuItem>
                            <MenuItem value="GBP">£</MenuItem>
                          </Select> */}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Expected CTC"
                                        name="expectedCTC"
                                        type="number"
                                        value={formData.expectedCTC}
                                        onChange={handleChange}
                                        sx={{
                                            height: 40,
                                            width: 265,
                                        }}
                                        margin="normal"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                label="Skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                margin="normal"
                                size="small"
                                helperText="Separate multiple skills with commas"
                                sx={{ width: 550 }}
                            />


                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        sx={{
                                            height: 1,
                                            width: 268,
                                        }}
                                        multiline
                                        rows={3}
                                        margin="normal"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Education"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        sx={{
                                            height: 1,
                                            width: 268,
                                        }}
                                        multiline
                                        rows={3}
                                        margin="normal"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <input
                                    type="file"
                                    ref={docsInputRef}
                                    hidden
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    onChange={handleDocsUpload}
                                    multiple
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<AttachFileIcon />}
                                    onClick={() => docsInputRef.current.click()}
                                    fullWidth
                                    size="large"
                                    sx={{
                                        width: 550,
                                        mt: 2,
                                        borderWidth: 2,
                                        "&:hover": { borderWidth: 2 },
                                    }}
                                >
                                    Attach Additional Documents
                                </Button>
                                {formData.additionalDocuments && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {formData.additionalDocuments.name}
                                    </Typography>
                                )}
                            </Grid>

                            <Box
                                sx={{
                                    mt: 4,
                                    ml: 42,
                                    display: "flex",
                                    justifyContent: "flex-center",
                                    gap: 2,
                                }}
                            >
                                <Button
                                    onClick={() => navigate('/')}
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    disabled={isLoading || isAnalyzingResume}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={
                                        isLoading ||
                                        isAnalyzingResume ||
                                        !resumeFile ||
                                        (emailWarning && !formData.email)
                                    }
                                >
                                    {isLoading ? <CircularProgress size={24} /> : "Add Candidate"}
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Bulk Upload Candidates
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                Download the template, fill in candidate details, and upload the completed file.
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Download />}
                                    onClick={downloadTemplate}
                                    sx={{ mr: 2 }}
                                >
                                    Download Template
                                </Button>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload Filled Template
                                    <input
                                        type="file"
                                        ref={bulkInputRef}
                                        hidden
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleBulkUpload}
                                    />
                                </Button>
                            </Box>

                            <Typography variant="body2" color="textSecondary">
                                <strong>Template includes fields:</strong> First Name, Last Name, Email, Mobile,
                                Current CTC, Expected CTC, Currency, Skills, Experience, Education,
                                Available to Join (days), Gender, Source, Stage, Current Location, Preferred Location
                            </Typography>
                        </Box>
                    )}

                    <Box mt={4}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Resume Analysis Dialog */}
            {/* Resume Analysis Dialog */}
            <Dialog
                open={showAnalysisDialog}
                onClose={handleCloseAnalysisDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Resume Analysis</DialogTitle>
                <DialogContent dividers>
                    {analysisData?.aiAnalysis && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Matching Score: {analysisData.aiAnalysis.matchPercentage || 0}%
                            </Typography>

                            {analysisData.aiAnalysis.recommendation && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Recommendation: {analysisData.aiAnalysis.recommendation}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}

                            <Typography variant="subtitle1" gutterBottom>
                                Matching Skills:
                            </Typography>
                            {analysisData.aiAnalysis.matchingSkills?.length > 0 ? (
                                <Box sx={{ mb: 3 }}>
                                    {analysisData.aiAnalysis.matchingSkills.map((skill, index) => (
                                        <Box key={index} sx={{ mb: 1 }}>
                                            <Typography variant="body2">
                                                {skill.skill} ({Math.round(skill.confidence * 100)}% match)
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={skill.confidence * 100}
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    No matching skills identified
                                </Typography>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Missing Skills:
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                                {analysisData.aiAnalysis.missingSkills?.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        color="error"
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Box>

                            {analysisData.aiAnalysis.experienceMatch && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" gutterBottom>
                                        Experience Match:
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {analysisData.aiAnalysis.experienceMatch}
                                    </Typography>
                                </>
                            )}

                            {analysisData.aiAnalysis.educationMatch && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" gutterBottom>
                                        Education Match:
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {analysisData.aiAnalysis.educationMatch}
                                    </Typography>
                                </>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Analysis Summary:
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ whiteSpace: "pre-line" }}>
                                {analysisData.aiAnalysis.analysis || "No analysis available"}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAnalysisDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Add Location Dialog */}
            <Dialog
                open={showAddLocationDialog}
                onClose={() => setShowAddLocationDialog(false)}
            >
                <DialogTitle>Add New Location</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a new location that's not in the list
                    </DialogContentText>
                    <MuiTextField
                        autoFocus
                        margin="dense"
                        label="Location Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddLocationDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddLocation} disabled={!newLocation.trim()}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Source Dialog */}
            <Dialog
                open={showAddSourceDialog}
                onClose={() => setShowAddSourceDialog(false)}
            >
                <DialogTitle>Add New Source</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a new source that's not in the list
                    </DialogContentText>
                    <MuiTextField
                        autoFocus
                        margin="dense"
                        label="Source Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddSourceDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddSource} disabled={!newSource.trim()}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VendorUploadPage;