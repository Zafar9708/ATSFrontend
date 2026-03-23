import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  alpha,
  Card,
  CardContent,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  RestorePageOutlined as ReconsiderIcon,
  MailOutline as EmailIcon,
  SearchOff as NoDataIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIconAlt,
  EventBusy as EventBusyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';

// ── Axios instance with bearer token ─────────────────────────────
const api = axios.create({ baseURL: '/api/v1' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const RejectedInterviews = ({ searchTerm = '', selectedDate = null }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet  = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // ── Fetch rejected interviews from API ───────────────────────────
  const fetchRejected = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/interviews/schedule');
      // Filter only rejected ones from the schedule endpoint
      const all      = res.data?.data || [];
      const rejected = all.filter(iv => iv.status === 'rejected' || iv.status === 'cancelled');
      setInterviews(rejected);
    } catch (err) {
      console.error('Error fetching rejected interviews:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRejected(); }, []);

  // ── Helpers — identical to original ─────────────────────────────
  const getAvatarColor = (name = '') => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    return colors[name.length % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch { return '—'; }
  };

  // ── Filter — identical logic to original ─────────────────────────
  const filteredInterviews = interviews.filter(interview => {
    const candidateName  = interview.candidate?.name  || '';
    const candidateEmail = interview.candidate?.email || '';
    const jobTitle       = interview.jobId?.jobTitle  || '';
    const jobCode        = interview.jobId?.jobName   || '';
    const interviewers   = (interview.interviewers || []).map(i => i.name || '').join(' ');

    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      candidateName.toLowerCase().includes(searchStr)  ||
      candidateEmail.toLowerCase().includes(searchStr) ||
      jobTitle.toLowerCase().includes(searchStr)       ||
      jobCode.toLowerCase().includes(searchStr)        ||
      interviewers.toLowerCase().includes(searchStr);

    const matchesDate = !selectedDate ||
      (interview.date && new Date(interview.date).toISOString().slice(0, 10) === selectedDate);

    return matchesSearch && matchesDate;
  });

  // ── Card — identical JSX to original ────────────────────────────
  const InterviewCard = ({ interview }) => {
    const candidateName  = interview.candidate?.name  || 'Unknown Candidate';
    const candidateEmail = interview.candidate?.email || '';
    const jobTitle       = interview.jobId?.jobTitle  || '—';
    const jobCode        = interview.jobId?.jobName   || '—';
    const interviewer    = interview.interviewers?.[0]?.name || '—';
    const rejectionDate  = formatDate(interview.date);
    const interviewDate  = formatDate(interview.createdAt);
    const rejectionReason = interview.notes || 'No reason provided.';

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{
          height: '100%', display: 'flex', flexDirection: 'column',
          borderRadius: 3, border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderColor: alpha('#3b82f6', 0.3),
          },
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: getAvatarColor(candidateName), width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 700 }}>
                  {candidateName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    {candidateName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <EmailIconAlt fontSize="inherit" />
                    {candidateEmail.length > 25 ? `${candidateEmail.substring(0, 22)}...` : candidateEmail}
                  </Typography>
                </Box>
              </Stack>
              <Chip label="Rejected" size="small"
                sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, borderRadius: 1, height: { xs: 24, sm: 28 }, '& .MuiChip-label': { fontSize: { xs: '0.7rem', sm: '0.75rem' }, px: { xs: 1, sm: 1.5 } } }} />
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {/* Details */}
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5} sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                  <WorkIcon fontSize="inherit" /> JOB DETAILS
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>{jobTitle}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Code: {jobCode}</Typography>
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>Interviewer</Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{interviewer}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>Interview Date</Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{interviewDate}</Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5} sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                  <CalendarIcon fontSize="inherit" /> REJECTED ON: {rejectionDate}
                </Typography>
                <Paper elevation={0} sx={{ mt: 1, p: 1.5, bgcolor: alpha('#fee2e2', 0.3), borderRadius: 2, border: '1px solid', borderColor: alpha('#ef4444', 0.2) }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontStyle: 'italic', display: 'block' }}>
                    "{rejectionReason.length > 80 ? `${rejectionReason.substring(0, 77)}...` : rejectionReason}"
                  </Typography>
                </Paper>
              </Box>

              {/* Action buttons */}
              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Tooltip title="View Details" arrow>
                  <IconButton size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), '&:hover': { bgcolor: alpha('#3b82f6', 0.2) }, color: '#2563eb', width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reconsider" arrow>
                  <IconButton size="small" sx={{ bgcolor: alpha('#8b5cf6', 0.1), '&:hover': { bgcolor: alpha('#8b5cf6', 0.2) }, color: '#7c3aed', width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}>
                    <ReconsiderIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Contact" arrow>
                  <IconButton size="small" sx={{ bgcolor: alpha('#10b981', 0.1), '&:hover': { bgcolor: alpha('#10b981', 0.2) }, color: '#059669', width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}>
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // ── Loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  // ── Error state ───────────────────────────────────────────────────
  if (error) {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', borderStyle: 'dashed', mx: { xs: 1, sm: 2 } }}>
        <NoDataIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'text.disabled', mb: 2 }} />
        <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={700}>{error}</Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchRejected} sx={{ mt: 2, borderRadius: 2 }}>
          Try Again
        </Button>
      </Paper>
    );
  }

  // ── Empty state — no rejected interviews ──────────────────────────
  if (filteredInterviews.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 5, sm: 8 }, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', borderStyle: 'dashed', mx: { xs: 1, sm: 2 }, mt: { xs: 2, sm: 3 } }}>
        {/* Illustration circle */}
        <Box sx={{
          width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecdd3 100%)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3,
          boxShadow: '0 4px 20px rgba(239,68,68,0.15)',
        }}>
          <EventBusyIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: '#ef4444' }} />
        </Box>

        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={800} color="#1e293b" sx={{ mb: 1 }}>
          No Rejected Interviews
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto', lineHeight: 1.7 }}>
          {searchTerm || selectedDate
            ? 'No rejected interviews match your current filters. Try adjusting your search criteria.'
            : "Great news — there are no rejected interviews at the moment. Rejected interviews will appear here once available."}
        </Typography>

        {(searchTerm || selectedDate) && (
          <Chip
            label="Clear filters to see all"
            variant="outlined"
            size="small"
            sx={{ mt: 2, borderColor: alpha('#ef4444', 0.4), color: '#b91c1c', fontWeight: 600 }}
          />
        )}
      </Paper>
    );
  }

  // ── Main render — identical to original ──────────────────────────
  return (
    <Box sx={{ width: '100%', mt: { xs: 1, sm: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: { xs: 2, sm: 3 }, px: { xs: 1, sm: 0 } }}>
        <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={700} color="#1e293b">
          Rejected Interviews ({filteredInterviews.length})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isMobile ? `${filteredInterviews.length} items` : `Showing ${filteredInterviews.length} of ${interviews.length} interviews`}
        </Typography>
      </Stack>

      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ px: { xs: 1, sm: 0 } }}>
        {filteredInterviews.map((interview) => (
          <InterviewCard key={interview._id} interview={interview} />
        ))}
      </Grid>

      {isTablet && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3, fontStyle: 'italic' }}>
          Showing 2 cards per row for better readability
        </Typography>
      )}
    </Box>
  );
};

export default RejectedInterviews;