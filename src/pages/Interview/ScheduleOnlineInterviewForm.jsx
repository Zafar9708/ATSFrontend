import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
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

// ── Axios instance with bearer token ───────────────────────────────
const api = axios.create({ baseURL: "/api/v1" });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Static option lists (not fetched from API) ─────────────────────
const TIMEZONES = [
    { value: "Asia/Kolkata",       label: "UTC+05:30 (IST - India Standard Time)" },
    { value: "UTC",                label: "UTC+00:00 (GMT - Greenwich Mean Time)" },
    { value: "America/New_York",   label: "UTC-05:00 (EST - Eastern Standard Time)" },
    { value: "America/Los_Angeles",label: "UTC-08:00 (PST - Pacific Standard Time)" },
    { value: "Europe/Berlin",      label: "UTC+01:00 (CET - Central European Time)" },
    { value: "Australia/Sydney",   label: "UTC+10:00 (AEST - Australian Eastern Time)" },
];

const DURATIONS = [
    { value: 30,  label: "30 minutes" },
    { value: 45,  label: "45 minutes" },
    { value: 60,  label: "1 hour" },
    { value: 90,  label: "1.5 hours" },
    { value: 120, label: "2 hours" },
];

// platform display → API value mapping
const PLATFORMS = [
    { label: "Google Meet",      value: "google_meet" },
    { label: "Zoom",             value: "zoom" },
    { label: "Microsoft Teams",  value: "microsoft_teams" },
    { label: "Other",            value: "other" },
];

// ── EmailTemplateTab ────────────────────────────────────────────────
const EmailTemplateTab = ({
    candidate, user,
    showPreview, setShowPreview,
    subject, setSubject,
    body, setBody,
    templates,
    date, startTime, duration, timezone, platform,
    selectedTemplate, setSelectedTemplate,
}) => {
    const handleTemplateChange = (e) => {
        const templateId = e.target.value;
        const tpl = templates.find(t => t._id === templateId);
        if (!tpl) return;
        setSelectedTemplate(templateId);
        setSubject(tpl.subject || "");

        const formattedBody = (tpl.body || "")
            .replace(/{recipient}/g,  `${candidate.firstName} ${candidate.lastName}`)
            .replace(/{date}/g,        date)
            .replace(/{time}/g,        startTime)
            .replace(/{duration}/g,    String(duration?.value ?? duration))
            .replace(/{timezone}/g,    timezone?.value || timezone)
            .replace(/{platform}/g,    platform)
            .replace(/{interviewer}/g, user?.name || "")
            .replace(/{company}/g,     "Our Company")
            .replace(/{position}/g,    candidate.position || "the position")
            .replace(/{feedbackLink}/g,"Will be provided");
        setBody(formattedBody);
    };

    const insertFormat = (fmt) => {
        const map = { bold: "**", italic: "*", underline: "__" };
        setBody(prev => prev + map[fmt]);
    };

    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Template</InputLabel>
                <Select
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    label="Select Template"
                >
                    <MenuItem value=""><em>Select a template</em></MenuItem>
                    {templates.map(t => (
                        <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth label="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                sx={{ mb: 3 }}
                required
            />

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Body</Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <IconButton size="small" onClick={() => insertFormat("bold")}><FormatBoldIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => insertFormat("italic")}><FormatItalicIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => insertFormat("underline")}><FormatUnderlinedIcon fontSize="small" /></IconButton>
                </Box>
                <TextField
                    fullWidth multiline rows={6}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                />
            </Box>

            {showPreview && (
                <Card sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h6">Preview</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">{subject}</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line", mt: 2 }}>{body}</Typography>
                </Card>
            )}
        </Box>
    );
};

// ── NotesTab ────────────────────────────────────────────────────────
const NotesTab = ({ notes, setNotes }) => (
    <Box>
        <TextField
            fullWidth multiline rows={6}
            placeholder="Add notes for the interview panel..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
        />
    </Box>
);

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════
const ScheduleOnlineInterviewForm = ({ open, onClose, candidate, user }) => {

    // ── State ────────────────────────────────────────────────────────
    const [interviewers,         setInterviewers]         = useState([]);
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);
    const [templates,            setTemplates]            = useState([]);
    const [date,                 setDate]                 = useState("");
    const [startTime,            setStartTime]            = useState("");
    const [duration,             setDuration]             = useState(DURATIONS[2]); // 60 min default
    const [timezone,             setTimezone]             = useState(TIMEZONES[0]); // IST default
    const [platform,             setPlatform]             = useState("");
    const [tabValue,             setTabValue]             = useState(0);
    const [showAddInterviewer,   setShowAddInterviewer]   = useState(false);
    const [newInterviewer,       setNewInterviewer]       = useState({ name: "", email: "", phone: "" });
    const [showPreview,          setShowPreview]          = useState(false);
    const [subject,              setSubject]              = useState("");
    const [body,                 setBody]                 = useState("");
    const [notes,                setNotes]                = useState("");
    const [loading,              setLoading]              = useState(false);
    const [fetchingInterviewers, setFetchingInterviewers] = useState(false);
    const [selectedTemplate,     setSelectedTemplate]     = useState("");
    const [snackbar,             setSnackbar]             = useState({ open: false, message: "", severity: "success" });

    // ── Fetch interviewers & templates on open ───────────────────────
    useEffect(() => {
        if (!open) return;

        // Reset defaults
        const today = new Date();
        setDate(today.toISOString().split("T")[0]);
        const nextHour = new Date(today.getTime() + 3600000);
        setStartTime(nextHour.toTimeString().slice(0, 5));
        setSubject(`Online Interview Invitation - ${candidate.firstName} ${candidate.lastName}`);
        setBody("");
        setNotes("");
        setSelectedTemplate("");
        setSelectedInterviewers([]);
        setPlatform("");
        setShowPreview(false);
        setTabValue(0);

        // Fetch interviewers
        (async () => {
            setFetchingInterviewers(true);
            try {
                const res = await api.get("/interviewers");
                // API may return array directly or { data: [...] }
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.interviewers || []);
                setInterviewers(list);
            } catch (err) {
                toast("Failed to fetch interviewers", "error");
            } finally {
                setFetchingInterviewers(false);
            }
        })();

        // Fetch email templates
        (async () => {
            try {
                const res = await api.get("/email-templates");
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.templates || []);
                setTemplates(list);
            } catch {
                // Templates are optional — silently fall back to empty
                setTemplates([]);
            }
        })();

    }, [open, candidate]);

    const toast = (message, severity = "success") =>
        setSnackbar({ open: true, message, severity });

    // ── Validation ───────────────────────────────────────────────────
    const isValid = () =>
        date &&
        startTime &&
        selectedInterviewers.length > 0 &&
        subject &&
        body &&
        duration &&
        timezone &&
        platform &&
        selectedTemplate;

    // ── Add interviewer ──────────────────────────────────────────────
    const handleAddInterviewer = async () => {
        if (!newInterviewer.name || !newInterviewer.email) {
            toast("Name and email are required", "error");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/interviewers", {
                name:  newInterviewer.name,
                email: newInterviewer.email,
                phone: newInterviewer.phone || "",
            });
            const created = res.data?.data || res.data;
            setInterviewers(prev => [...prev, created]);
            setSelectedInterviewers(prev => [...prev, created._id]);
            setNewInterviewer({ name: "", email: "", phone: "" });
            setShowAddInterviewer(false);
            toast("Interviewer added!");
        } catch (err) {
            toast(err.response?.data?.message || "Failed to add interviewer", "error");
        } finally {
            setLoading(false);
        }
    };

    // ── Submit — matches working Postman payload exactly ────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            toast("Please fill all required fields", "error");
            return;
        }

        setLoading(true);
        try {
            // Build payload that matches Postman success format
            const payload = {
                candidate: {
                    id:    candidate._id,
                    name:  `${candidate.firstName} ${candidate.lastName}`,
                    email: candidate.email,
                },
                interviewerIds: selectedInterviewers,              // array of _id strings
                date,                                               // "YYYY-MM-DD"
                startTime,                                          // "HH:MM"
                duration:   duration?.value ?? duration,            // number e.g. 60
                timezone:   timezone?.value  ?? timezone,           // e.g. "America/New_York"
                platform:   platform,                               // already stored as API value e.g. "google_meet"
                templateId: selectedTemplate,                       // _id string
                notes:      notes || undefined,
            };

            // Remove undefined keys
            Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

            console.log("▶ Scheduling interview payload:", payload);

            await api.post("/interviews/schedule", payload);

            toast("Interview scheduled successfully!");
            setTimeout(() => { onClose(); }, 1200);

        } catch (err) {
            console.error("Schedule error:", err?.response?.data);
            toast(
                err?.response?.data?.message || err.message || "Failed to schedule interview",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Render ───────────────────────────────────────────────────────
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                aria-labelledby="schedule-dialog-title"
            >
                <DialogTitle id="schedule-dialog-title">
                    Schedule Online Interview with {candidate?.firstName} {candidate?.lastName}
                </DialogTitle>

                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate>

                        {/* ── Interviewer selection ────────────────────── */}
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Panel Members</Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} required>
                            <InputLabel id="interviewer-label">Select Interviewers</InputLabel>
                            <Select
                                labelId="interviewer-label"
                                label="Select Interviewers"
                                multiple
                                value={selectedInterviewers}
                                onChange={e => setSelectedInterviewers(e.target.value)}
                                disabled={loading || fetchingInterviewers}
                                renderValue={selected => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map(id => {
                                            const iv = interviewers.find(i => i._id === id);
                                            return iv ? (
                                                <Chip
                                                    key={id}
                                                    label={iv.name}
                                                    onDelete={() => setSelectedInterviewers(prev => prev.filter(x => x !== id))}
                                                    onMouseDown={e => e.stopPropagation()}
                                                />
                                            ) : null;
                                        })}
                                    </Box>
                                )}
                            >
                                {fetchingInterviewers ? (
                                    <MenuItem disabled>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CircularProgress size={18} />
                                            <Typography>Loading…</Typography>
                                        </Box>
                                    </MenuItem>
                                ) : interviewers.length > 0 ? (
                                    interviewers.map(iv => (
                                        <MenuItem key={iv._id} value={iv._id}>
                                            {iv.name} ({iv.email})
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No interviewers available</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        {/* ── Add interviewer toggle ───────────────────── */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button
                                size="small"
                                startIcon={showAddInterviewer ? <ExpandLessIcon /> : <AddIcon />}
                                onClick={() => setShowAddInterviewer(v => !v)}
                                disabled={loading}
                            >
                                {showAddInterviewer ? "Hide Form" : "Add Interviewer"}
                            </Button>
                        </Box>
                        <Collapse in={showAddInterviewer}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={4}>
                                    <TextField fullWidth label="Name" value={newInterviewer.name}
                                        onChange={e => setNewInterviewer(p => ({ ...p, name: e.target.value }))}
                                        required disabled={loading} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField fullWidth label="Email" type="email" value={newInterviewer.email}
                                        onChange={e => setNewInterviewer(p => ({ ...p, email: e.target.value }))}
                                        required disabled={loading} />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Phone" value={newInterviewer.phone}
                                        onChange={e => setNewInterviewer(p => ({ ...p, phone: e.target.value }))}
                                        disabled={loading} />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddInterviewer}
                                        sx={{ height: "100%" }}
                                        disabled={loading || !newInterviewer.name || !newInterviewer.email}
                                    >
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </Collapse>

                        {/* ── Date / Time / Duration / Timezone ────────── */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Interview Date</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant={date === new Date().toISOString().split("T")[0] ? "contained" : "outlined"}
                                        onClick={() => setDate(new Date().toISOString().split("T")[0])}
                                        size="small" disabled={loading}
                                    >Today</Button>
                                    <Button
                                        variant={date === new Date(Date.now() + 86400000).toISOString().split("T")[0] ? "contained" : "outlined"}
                                        onClick={() => setDate(new Date(Date.now() + 86400000).toISOString().split("T")[0])}
                                        size="small" disabled={loading}
                                    >Tomorrow</Button>
                                    <TextField
                                        type="date" value={date}
                                        onChange={e => setDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ flexGrow: 1 }} size="small" required
                                        inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                        disabled={loading}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Time & Duration</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField
                                        fullWidth type="time" label="Start Time"
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        size="small" required disabled={loading}
                                    />
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel>Duration</InputLabel>
                                        <Select
                                            value={duration}
                                            onChange={e => setDuration(e.target.value)}
                                            label="Duration"
                                            disabled={loading}
                                        >
                                            {DURATIONS.map(d => (
                                                <MenuItem key={d.value} value={d}>{d.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel>Timezone</InputLabel>
                                        <Select
                                            value={timezone}
                                            onChange={e => setTimezone(e.target.value)}
                                            label="Timezone"
                                            disabled={loading}
                                        >
                                            {TIMEZONES.map(tz => (
                                                <MenuItem key={tz.value} value={tz}>{tz.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* ── Platform ─────────────────────────────────── */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Meeting Platform</Typography>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel>Select Platform</InputLabel>
                                    <Select
                                        value={platform}
                                        onChange={e => setPlatform(e.target.value)}
                                        label="Select Platform"
                                        disabled={loading}
                                    >
                                        {PLATFORMS.map(p => (
                                            <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* ── Email / Notes tabs ───────────────────────── */}
                        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
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

                        {/* ── Action buttons ───────────────────────────── */}
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}>
                            <Button onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
                            <Button
                                variant="outlined"
                                startIcon={<PreviewIcon />}
                                onClick={() => setShowPreview(v => !v)}
                                disabled={loading || tabValue !== 0}
                            >
                                Preview Email
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? <><CircularProgress size={16} sx={{ mr: 1 }} />Scheduling…</> : "Schedule Interview"}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ScheduleOnlineInterviewForm;