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

// Dummy data for templates
const DUMMY_TEMPLATES = [
    {
        _id: "template_1",
        name: "Technical Interview Invitation",
        subject: "Technical Interview Invitation for {position}",
        body: "Dear {recipient},\n\nYou are invited for a technical interview for the position of {position}.\n\n**Interview Details:**\n📅 Date: {date}\n⏰ Time: {time}\n⏱ Duration: {duration}\n🌐 Timezone: {timezone}\n💻 Platform: {platform}\n👥 Interviewer: {interviewer}\n\nPlease ensure you have a stable internet connection and are ready with any required materials.\n\nBest regards,\n{company} Team"
    },
    {
        _id: "template_2",
        name: "HR Interview Invitation",
        subject: "HR Interview Invitation - {company}",
        body: "Hello {recipient},\n\nCongratulations on progressing to the next stage! We'd like to schedule an HR interview with you.\n\n**Interview Details:**\n📅 Date: {date}\n⏰ Time: {time}\n⏱ Duration: {duration}\n🌐 Timezone: {timezone}\n💻 Platform: {platform}\n👥 Interviewer: {interviewer}\n\nPlease let us know if this time works for you.\n\nLooking forward to speaking with you!\n\nBest regards,\n{company} HR Team"
    },
    {
        _id: "template_3",
        name: "Final Round Interview",
        subject: "Final Interview Round Invitation",
        body: "Dear {recipient},\n\nWe are pleased to invite you for the final round of interviews with our leadership team.\n\n**Interview Details:**\n📅 Date: {date}\n⏰ Time: {time}\n⏱ Duration: {duration}\n🌐 Timezone: {timezone}\n💻 Platform: {platform}\n👥 Interview Panel: {interviewer}\n\nThis will be an opportunity to discuss your experience and expectations in detail.\n\nBest regards,\nLeadership Team"
    }
];

// Dummy data for interviewers
const DUMMY_INTERVIEWERS = [
    {
        _id: "interviewer_1",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        phone: "+1 (555) 123-4567",
        role: "Technical Lead"
    },
    {
        _id: "interviewer_2",
        name: "Mike Chen",
        email: "mike.chen@company.com",
        phone: "+1 (555) 987-6543",
        role: "Engineering Manager"
    },
    {
        _id: "interviewer_3",
        name: "Emma Wilson",
        email: "emma.wilson@company.com",
        phone: "+1 (555) 456-7890",
        role: "HR Manager"
    },
    {
        _id: "interviewer_4",
        name: "David Brown",
        email: "david.brown@company.com",
        phone: "+1 (555) 234-5678",
        role: "Product Manager"
    }
];

// Dummy data for timezones
const DUMMY_TIMEZONES = [
    { value: "UTC+05:30", label: "UTC+05:30 (IST - India Standard Time)" },
    { value: "UTC+00:00", label: "UTC+00:00 (GMT - Greenwich Mean Time)" },
    { value: "UTC-05:00", label: "UTC-05:00 (EST - Eastern Standard Time)" },
    { value: "UTC-08:00", label: "UTC-08:00 (PST - Pacific Standard Time)" },
    { value: "UTC+01:00", label: "UTC+01:00 (CET - Central European Time)" },
    { value: "UTC+10:00", label: "UTC+10:00 (AEST - Australian Eastern Time)" }
];

// Dummy data for durations
const DUMMY_DURATIONS = [
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" }
];

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
                .replace(/{feedbackLink}/g, 'Will be provided')
                .replace(/{company}/g, 'Our Company')
                .replace(/{position}/g, candidate.position || 'the position');
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
    
    const [interviewers, setInterviewers] = useState(DUMMY_INTERVIEWERS);
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
    const [templates, setTemplates] = useState(DUMMY_TEMPLATES);
    const [timezones, setTimezones] = useState(DUMMY_TIMEZONES);
    const [durations, setDurations] = useState(DUMMY_DURATIONS);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [selectedTemplate, setSelectedTemplate] = useState("");

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
            try {
                // Use dummy data directly
                setTimezones(DUMMY_TIMEZONES);
                setDurations(DUMMY_DURATIONS);
                setInterviewers(DUMMY_INTERVIEWERS);
                setTemplates(DUMMY_TEMPLATES);
                
                // Set default values
                const defaultTimezone = DUMMY_TIMEZONES.find(tz => tz.value === "UTC+05:30") || DUMMY_TIMEZONES[0];
                const defaultDuration = DUMMY_DURATIONS[0];
                
                setTimezone(defaultTimezone);
                setDuration(defaultDuration);
                
                // Set default date to today
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                setDate(formattedDate);
                
                // Set default time to next hour
                const nextHour = new Date(today.getTime() + 60 * 60 * 1000);
                const formattedTime = nextHour.toISOString().split('T')[1].substring(0, 5);
                setStartTime(formattedTime);
                
                // Set default subject
                setSubject(`Online Interview Invitation - ${candidate.firstName} ${candidate.lastName}`);
                
            } catch (error) {
                console.error("Error initializing form data:", error);
                setSnackbar({
                    open: true,
                    message: "Error initializing form data.",
                    severity: "warning"
                });
            }
        }
    }, [open, candidate]);

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
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newInterviewerObj = {
                _id: `interviewer_${interviewers.length + 1}`,
                name: newInterviewer.name,
                email: newInterviewer.email,
                phone: newInterviewer.phone,
                role: "Interviewer"
            };
            
            setInterviewers([...interviewers, newInterviewerObj]);
            setSelectedInterviewers([...selectedInterviewers, newInterviewerObj._id]);
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
                message: "Failed to add interviewer",
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
                jobId: candidate?.jobId
            };

            console.log("Submitting interview data:", requestData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate successful response
            const mockResponse = {
                success: true,
                message: "Interview scheduled successfully!",
                data: {
                    interviewId: `interview_${Date.now()}`,
                    meetingLink: "https://meet.google.com/abc-defg-hij",
                    calendarEvent: {
                        id: "calendar_event_123",
                        link: "https://calendar.google.com/event"
                    }
                }
            };

            if (mockResponse.success) {
                setSnackbar({
                    open: true,
                    message: mockResponse.message,
                    severity: "success"
                });
                
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 1000);
            } else {
                throw new Error("Failed to schedule interview");
            }
            
        } catch (error) {
            console.error("Error scheduling interview:", error);
            let errorMessage = "Failed to schedule interview";
            
            if (error.response) {
                errorMessage = error.response.data?.message || 
                              `Server responded with ${error.response.status}`;
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
        setDuration(DUMMY_DURATIONS[0]);
        setTimezone(DUMMY_TIMEZONES[0]);
        setPlatform("");
        setSubject(`Online Interview - ${candidate.firstName} ${candidate.lastName}`);
        setBody("");
        setNotes("");
        setTabValue(0);
        setShowPreview(false);
        setSelectedTemplate("");
        setNewInterviewer({ name: "", email: "", phone: "" });
        setShowAddInterviewer(false);
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
                                        inputProps={{ 
                                            'aria-label': 'Interview date',
                                            min: new Date().toISOString().split('T')[0]
                                        }}
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