

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Card,
    Tabs,
    Tab,
    Chip,
    Divider,
    Grid,
    IconButton,
    Collapse,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import {
    Add as AddIcon,
    FormatBold as FormatBoldIcon,
    FormatItalic as FormatItalicIcon,
    FormatUnderlined as FormatUnderlinedIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Visibility as PreviewIcon
} from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = "https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1";

const EmailTemplateTab = ({ 
    candidate, 
    user,
    showPreview, 
    setShowPreview, 
    subject, 
    setSubject, 
    body, 
    setBody, 
    templates,
    date,
    startTime,
    duration,
    timezone,
    platform,
    selectedTemplate,
    setSelectedTemplate
}) => {
    const handleTemplateChange = (e) => {
        const templateId = e.target.value;
        const selected = templates.find(t => t._id === templateId);
        if (selected) {
            setSelectedTemplate(templateId);
            setSubject(selected.subject);
            
            let formattedBody = selected.body
                .replace(/{recipient}/g, `${candidate.firstName} ${candidate.lastName}`)
                .replace(/{date}/g, date)
                .replace(/{time}/g, startTime)
                .replace(/{duration}/g, duration?.value || duration)
                .replace(/{timezone}/g, timezone?.value || timezone)
                .replace(/{platform}/g, platform)
                .replace(/{interviewer}/g, user.name)
                .replace(/{feedbackLink}/g, 'Will be provided');
            setBody(formattedBody);
        }
    };

    const formatText = (format) => {
        const formats = {
            bold: '**',
            italic: '*',
            underline: '__'
        };
        setBody(prevBody => prevBody + formats[format]);
    };

    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="template-select-label">Select Template</InputLabel>
                <Select
                    labelId="template-select-label"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    label="Select Template"
                    inputProps={{ name: 'template' }}
                    required
                >
                    <MenuItem value="">
                        <em>Select a template</em>
                    </MenuItem>
                    {templates.map(template => (
                        <MenuItem key={template._id} value={template._id}>{template.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 3 }}
                required
                name="subject"
                inputProps={{ 'aria-label': 'Email subject' }}
            />

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Body</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <IconButton 
                        size="small" 
                        onClick={() => formatText('bold')} 
                        aria-label="bold text"
                    >
                        <FormatBoldIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => formatText('italic')} 
                        aria-label="italic text"
                    >
                        <FormatItalicIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => formatText('underline')} 
                        aria-label="underline text"
                    >
                        <FormatUnderlinedIcon fontSize="small" />
                    </IconButton>
                </Box>
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    variant="outlined"
                    required
                    name="body"
                    inputProps={{ 'aria-label': 'Email body' }}
                />
            </Box>

            {showPreview && (
                <Card sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h6">Preview</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">{subject}</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
                        {body}
                    </Typography>
                </Card>
            )}
        </Box>
    );
};

const NotesTab = ({ notes, setNotes }) => {
    return (
        <Box>
            <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Add notes for the interview panel..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                name="notes"
                inputProps={{ 'aria-label': 'Interview notes' }}
            />
        </Box>
    );
};

const ScheduleOnlineInterviewForm = ({ open, onClose, candidate, user }) => {

    const {id} = useParams()
    console.log("idddddddd",candidate?.jobId);
    
    const [interviewers, setInterviewers] = useState([]);
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [timezone, setTimezone] = useState("");
    const [platform, setPlatform] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [showAddInterviewer, setShowAddInterviewer] = useState(false);
    const [newInterviewer, setNewInterviewer] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [showPreview, setShowPreview] = useState(false);
    const [subject, setSubject] = useState("Online Interview Invitation");
    const [body, setBody] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [timezones, setTimezones] = useState([]);
    const [durations, setDurations] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const fallbackTimezones = [
        { value: "UTC+05:30", label: "UTC+05:30 (IST)" },
        { value: "UTC+00:00", label: "UTC+00:00 (GMT)" },
        { value: "UTC-05:00", label: "UTC-05:00 (EST)" }
    ];
    
    const fallbackDurations = [
        { value: "30", label: "30 minutes" },
        { value: "60", label: "1 hour" },
        { value: "90", label: "1.5 hours" }
    ];

    const validateForm = () => {
        return (
            date && 
            startTime && 
            selectedInterviewers.length > 0 && 
            subject && 
            body && 
            duration && 
            timezone &&
            platform &&
            selectedTemplate
        );
    };

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    
                    const fetchTimezones = async () => {
                        try {
                            const res = await axios.get(`${API_BASE}/interviews/timezones`);
                            return res.data.map(tz => typeof tz === 'string' ? { value: tz, label: tz } : tz);
                        } catch (error) {
                            console.error("Error fetching timezones:", error);
                            return fallbackTimezones;
                        }
                    };

                    const fetchDurations = async () => {
                        try {
                            const res = await axios.get(`${API_BASE}/interviews/durations`,{
                                headers:{
                                            'ngrok-skip-browser-warning': 'true'

                                }
                            });
                            return res.data;
                        } catch (error) {
                            console.error("Error fetching durations:", error);
                            return fallbackDurations;
                        }
                    };

                    const fetchInterviewers = async () => {
                        try {
                            const res = await axios.get(`${API_BASE}/interviewers`,{
                                headers:{
                                            'ngrok-skip-browser-warning': 'true'

                                }
                            });
                            return res.data;
                        } catch (error) {
                            console.error("Error fetching interviewers:", error);
                            return [];
                        }
                    };

                    const fetchTemplates = async () => {
                        try {
                            const res = await axios.get(`${API_BASE}/email-templates`,{
                                headers:{
                                            'ngrok-skip-browser-warning': 'true'

                                }
                            });
                            return res.data;
                        } catch (error) {
                            console.error("Error fetching templates:", error);
                            return [];
                        }
                    };

                    const [
                        timezonesData, 
                        durationsData, 
                        interviewersData, 
                        templatesData
                    ] = await Promise.all([
                        fetchTimezones(),
                        fetchDurations(),
                        fetchInterviewers(),
                        fetchTemplates()
                    ]);

                    setTimezones(timezonesData);
                    setDurations(durationsData);
                    setInterviewers(interviewersData);
                    setTemplates(templatesData);
                    
                    setTimezone(timezonesData.find(tz => tz.value === "UTC+05:30") || timezonesData[0]);
                    setDuration(durationsData[0]?.value || durationsData[0]);
                    setDate(new Date().toISOString().split('T')[0]);
                    
                } catch (error) {
                    console.error("Error initializing form data:", error);
                    setSnackbar({
                        open: true,
                        message: "Error initializing form data. Using fallback values.",
                        severity: "warning"
                    });
                } finally {
                    setLoading(false);
                }
            };
            
            fetchData();
        }
    }, [open]);

    const handleAddInterviewer = async () => {
        if (!newInterviewer.name || !newInterviewer.email) {
            setSnackbar({
                open: true,
                message: "Name and email are required",
                severity: "error"
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE}/interviewers`,{
                headers:{
                            'ngrok-skip-browser-warning': 'true'

                }
            }, newInterviewer);
            
            setInterviewers([...interviewers, response.data]);
            setSelectedInterviewers([...selectedInterviewers, response.data._id]);
            setNewInterviewer({ name: "", email: "", phone: "" });
            setShowAddInterviewer(false);
            
            setSnackbar({
                open: true,
                message: "Interviewer added successfully!",
                severity: "success"
            });
        } catch (error) {
            console.error("Error adding interviewer:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Failed to add interviewer",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: "Please fill all required fields",
                severity: "error"
            });
            
            if (!date) {
                document.querySelector('input[type="date"]')?.focus();
            } else if (!startTime) {
                document.querySelector('input[type="time"]')?.focus();
            } else if (selectedInterviewers.length === 0) {
                document.querySelector('#interviewer-label')?.focus();
            } else if (!subject) {
                document.querySelector('input[name="subject"]')?.focus();
            } else if (!body) {
                document.querySelector('textarea[name="body"]')?.focus();
            } else if (!duration) {
                document.querySelector('#duration-label')?.focus();
            } else if (!timezone) {
                document.querySelector('#timezone-label')?.focus();
            } else if (!platform) {
                document.querySelector('#platform-label')?.focus();
            } else if (!selectedTemplate) {
                document.querySelector('#template-select-label')?.focus();
            }
            
            return;
        }

        setLoading(true);
        
        try {
            // Prepare the request data according to API requirements
            const requestData = {
                candidate: {
                    id: candidate._id,
                    name: `${candidate.firstName} ${candidate.lastName}`,
                    email: candidate.email
                },
                interviewerIds: selectedInterviewers,
                date,
                startTime,
                duration: duration?.value || duration,
                timezone: timezone?.value || timezone,
                platform: platform.toLowerCase().replace(' ', '_'),
                templateId: selectedTemplate,
                notes,
                scheduledBy: user.email,
                jobId:candidate?.jobId
            };

            console.log("Submitting interview data:", requestData);


            const token=localStorage.getItem("token")
            const response = await axios.post(`${API_BASE}/interviews/schedule`, requestData, {
                headers: {
                     Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',

                }
            });

            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: response.data.message || "Interview scheduled successfully!",
                    severity: "success"
                });
                
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 1000);
            } else {
                throw new Error(response.data.message || "Failed to schedule interview");
            }
            
        } catch (error) {
            console.error("Error scheduling interview:", error);
            let errorMessage = "Failed to schedule interview";
            
            if (error.response) {
                errorMessage = error.response.data?.message || 
                              `Server responded with ${error.response.status}: ${JSON.stringify(error.response.data)}`;
            } else if (error.request) {
                errorMessage = "No response received from server";
            } else {
                errorMessage = error.message;
            }
            
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedInterviewers([]);
        setDate(new Date().toISOString().split('T')[0]);
        setStartTime("");
        setDuration(durations[0]?.value || durations[0] || "");
        setTimezone(timezones[0] || "");
        setPlatform("");
        setSubject(`Online Interview - ${candidate.firstName} ${candidate.lastName}`);
        setBody("");
        setNotes("");
        setTabValue(0);
        setShowPreview(false);
        setSelectedTemplate("");
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading && !open) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose} 
                maxWidth="md" 
                fullWidth
                aria-labelledby="schedule-interview-dialog-title"
            >
                <DialogTitle id="schedule-interview-dialog-title">
                    Schedule Online Interview with {candidate.firstName} {candidate.lastName}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        {/* <Card sx={{ mb: 3, p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">Candidate Information</Typography>
                                    <Typography>
                                        <strong>Name:</strong> {candidate.firstName} {candidate.lastName}
                                    </Typography>
                                    <Typography>
                                        <strong>Email:</strong> {candidate.email}
                                    </Typography>
                                    <Typography>
                                        <strong>Phone:</strong> {candidate.mobile}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">Resume</Typography>
                                    {candidate.resume?.path ? (
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => window.open(candidate.resume.path, '_blank')}
                                            aria-label="View candidate resume"
                                        >
                                            View Resume
                                        </Button>
                                    ) : (
                                        <Typography color="text.secondary">No resume uploaded</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Card> */}

                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Panel Members</Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} required>
                            <InputLabel id="interviewer-label">Select Interviewers</InputLabel>
                            <Select
                                labelId="interviewer-label"
                                label="Select Interviewer"
                                multiple
                                value={selectedInterviewers}
                                onChange={(e) => setSelectedInterviewers(e.target.value)}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((id) => {
                                            const interviewer = interviewers.find(i => i._id === id);
                                            return interviewer ? (
                                                <Chip 
                                                    key={id} 
                                                    label={interviewer.name} 
                                                    onDelete={() => setSelectedInterviewers(prev => prev.filter(i => i !== id))}
                                                />
                                            ) : null;
                                        })}
                                    </Box>
                                )}
                                inputProps={{ name: 'interviewers' }}
                                disabled={loading}
                            >
                                {interviewers.map((interviewer) => (
                                    <MenuItem key={interviewer._id} value={interviewer._id}>
                                        {interviewer.name} ({interviewer.email})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button 
                                startIcon={showAddInterviewer ? <ExpandLessIcon /> : <AddIcon />}
                                onClick={() => setShowAddInterviewer(!showAddInterviewer)}
                                size="small"
                                disabled={loading}
                                aria-label={showAddInterviewer ? 'Hide interviewer form' : 'Add interviewer'}
                            >
                                {showAddInterviewer ? 'Hide Form' : 'Add Interviewer'}
                            </Button>
                        </Box>
                        
                        <Collapse in={showAddInterviewer}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={newInterviewer.name}
                                        onChange={(e) => setNewInterviewer({...newInterviewer, name: e.target.value})}
                                        required
                                        disabled={loading}
                                        name="interviewer-name"
                                        inputProps={{ 'aria-label': 'Interviewer name' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={newInterviewer.email}
                                        onChange={(e) => setNewInterviewer({...newInterviewer, email: e.target.value})}
                                        required
                                        disabled={loading}
                                        name="interviewer-email"
                                        inputProps={{ 'aria-label': 'Interviewer email' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={newInterviewer.phone}
                                        onChange={(e) => setNewInterviewer({...newInterviewer, phone: e.target.value})}
                                        disabled={loading}
                                        name="interviewer-phone"
                                        inputProps={{ 'aria-label': 'Interviewer phone' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleAddInterviewer}
                                        sx={{ height: '100%' }}
                                        disabled={loading || !newInterviewer.name || !newInterviewer.email}
                                        aria-label="Add interviewer"
                                    >
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </Collapse>

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Interview Date</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant={date === new Date().toISOString().split('T')[0] ? "contained" : "outlined"}
                                        onClick={() => setDate(new Date().toISOString().split('T')[0])}
                                        size="small"
                                        disabled={loading}
                                        aria-label="Set interview date to today"
                                    >
                                        Today
                                    </Button>
                                    <Button
                                        variant={date === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? "contained" : "outlined"}
                                        onClick={() => setDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])}
                                        size="small"
                                        disabled={loading}
                                        aria-label="Set interview date to tomorrow"
                                    >
                                        Tomorrow
                                    </Button>
                                    <TextField
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ flexGrow: 1 }}
                                        size="small"
                                        required
                                        disabled={loading}
                                        name="date"
                                        inputProps={{ 'aria-label': 'Interview date' }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Time & Duration</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        type="time"
                                        label="Start Time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                        required
                                        disabled={loading}
                                        name="start-time"
                                        inputProps={{ 'aria-label': 'Interview start time' }}
                                    />
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel id="duration-label">Duration</InputLabel>
                                        <Select
                                            labelId="duration-label"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            label="Duration"
                                            disabled={loading}
                                            name="duration"
                                            inputProps={{ 'aria-label': 'Interview duration' }}
                                        >
                                            {durations.map((option, index) => {
                                                const value = option.value || option;
                                                const label = option.label || `${value} minutes`;
                                                return (
                                                    <MenuItem key={value || index} value={option}>
                                                        {label}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel id="timezone-label">Timezone</InputLabel>
                                        <Select
                                            labelId="timezone-label"
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            label="Timezone"
                                            disabled={loading}
                                            name="timezone"
                                            inputProps={{ 'aria-label': 'Interview timezone' }}
                                        >
                                            {timezones.map((tz, index) => (
                                                <MenuItem key={tz.value || tz || index} value={tz}>
                                                    {tz.label || tz.value || tz}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Meeting Platform</Typography>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel id="platform-label">Select Platform</InputLabel>
                                    <Select
                                        labelId="platform-label"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        label="Select Platform"
                                        disabled={loading}
                                        name="platform"
                                        inputProps={{ 'aria-label': 'Meeting platform' }}
                                    >
                                        <MenuItem value="Google Meet">Google Meet</MenuItem>
                                        <MenuItem value="Zoom">Zoom</MenuItem>
                                        <MenuItem value="Microsoft Teams">Microsoft Teams</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Tabs 
                            value={tabValue} 
                            onChange={(e, newValue) => setTabValue(newValue)} 
                            sx={{ mb: 2 }}
                            aria-label="Email and notes tabs"
                        >
                            <Tab label="Email Template" disabled={loading} />
                            <Tab label="Notes for Interview Panel" disabled={loading} />
                        </Tabs>
                        <Box sx={{ pt: 1 }}>
                            {tabValue === 0 && (
                                <EmailTemplateTab 
                                    candidate={candidate} 
                                    user={user}
                                    showPreview={showPreview}
                                    setShowPreview={setShowPreview}
                                    subject={subject}
                                    setSubject={setSubject}
                                    body={body}
                                    setBody={setBody}
                                    templates={templates}
                                    date={date}
                                    startTime={startTime}
                                    duration={duration}
                                    timezone={timezone}
                                    platform={platform}
                                    selectedTemplate={selectedTemplate}
                                    setSelectedTemplate={setSelectedTemplate}
                                />
                            )}
                            {tabValue === 1 && <NotesTab notes={notes} setNotes={setNotes} />}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
                            <Button 
                                onClick={onClose} 
                                variant="outlined" 
                                disabled={loading}
                                aria-label="Cancel interview scheduling"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<PreviewIcon />}
                                onClick={() => setShowPreview(!showPreview)}
                                disabled={loading || tabValue !== 0}
                                aria-label="Preview interview email"
                            >
                                Preview Email
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                disabled={loading}
                                aria-label="Schedule interview"
                            >
                                {loading ? "Scheduling..." : "Schedule Interview"}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ScheduleOnlineInterviewForm;