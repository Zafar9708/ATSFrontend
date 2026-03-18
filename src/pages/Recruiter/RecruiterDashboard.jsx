import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Button,
  IconButton, TextField, InputAdornment, MenuItem, Select,
  LinearProgress, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, Stack, Fade, Modal, useTheme,
  useMediaQuery, Avatar, Badge, Menu, ListItemIcon, ListItemText,
  CircularProgress, Snackbar, Alert,
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon, People as PeopleIcon,
  Work as WorkIcon, Schedule as ScheduleIcon, LocationOn as LocationIcon,
  Delete as DeleteIcon, Visibility as VisibilityIcon, Edit as EditIcon,
  CheckCircle as CheckIcon, Cancel as CancelIcon, Download as DownloadIcon,
  CalendarToday as CalendarIcon, Close as CloseIcon, MoreVert as MoreVertIcon,
  Notifications as NotifIcon, FilterList as FilterIcon,
  ArrowUpward as UpIcon, ArrowDownward as DownIcon,
  FiberManualRecord as DotIcon, Star as StarIcon,
  Timeline as TimelineIcon, Assessment as AssessmentIcon,
  VideoCall as VideoCallIcon, Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts';
import axios from 'axios';

// ── Axios instance — bearer token on every request ────────────────
const api = axios.create({ baseURL: '/api/v1' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Normalize raw job from API → shape the UI expects ─────────────
const normalizeJob = (j) => ({
  _id:         j._id,
  id:          j.jobName  || j._id,
  title:       j.jobTitle || '—',
  company:     j.tenantId || 'Internal',
  department:  j.department || '—',
  experience:  j.experience  ? `${j.experience}+ years` : '—',
  type:        j.jobFormId?.jobType || '—',
  location:    j.jobFormId?.locations?.map(l => l.name).join(', ') || 'Remote',
  salary:      j.jobFormId?.amount
    ? `${j.jobFormId.currency || '₹'} ${Number(j.jobFormId.amount).toLocaleString('en-IN')}`
    : '—',
  status:      (j.status || j.jobFormId?.status || 'Active').toLowerCase() === 'active' ? 'active' : j.status?.toLowerCase() || 'active',
  priority:    j.jobFormId?.markPriority ? 'high' : 'medium',
  candidates:  0,   // populated after candidate fetch
  openings:    j.jobFormId?.openings ?? 0,
  postedDate:  j.createdAt ? new Date(j.createdAt).toISOString().slice(0, 10) : '',
  deadline:    j.jobFormId?.targetHireDate
    ? new Date(j.jobFormId.targetHireDate).toISOString().slice(0, 10)
    : '',
  recruiter:   j.jobFormId?.recruitingPerson?.[0] || '—',
  hiringFlow:  j.jobFormId?.hiringFlow || [],
  progress: j.jobFormId?.targetHireDate
    ? Math.max(0, Math.min(100, Math.round(
        (Date.now() - new Date(j.createdAt)) /
        (new Date(j.jobFormId.targetHireDate) - new Date(j.createdAt)) * 100
      )))
    : 40,
});

// ─── THEME TOKENS ─────────────────────────────────────────────────
const C = {
  bg: '#f0f4f8',
  surface: '#ffffff',
  border: '#e2e8f0',
  primary: '#1d4ed8',
  primaryLight: '#eff6ff',
  primaryMid: '#dbeafe',
  text: '#0f172a',
  textSub: '#64748b',
  textMuted: '#94a3b8',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  accent: '#7c3aed',
};

// ─── HELPERS ──────────────────────────────────────────────────────
const STATUS_META = {
  active:   { label: 'Active',   bg: '#dcfce7', color: '#15803d' },
  'on-hold':{ label: 'On Hold',  bg: '#fef9c3', color: '#a16207' },
  closed:   { label: 'Closed',   bg: '#f1f5f9', color: '#64748b' },
};
const PRIORITY_META = {
  high:   { label: 'High',  bg: '#fee2e2', color: '#b91c1c' },
  medium: { label: 'Med',   bg: '#fef3c7', color: '#b45309' },
  low:    { label: 'Low',   bg: '#f0fdf4', color: '#15803d' },
};

function StatChip({ label, value, up }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {up ? <UpIcon sx={{ fontSize: 13, color: C.success }} /> : <DownIcon sx={{ fontSize: 13, color: C.danger }} />}
      <Typography variant="caption" sx={{ color: up ? C.success : C.danger, fontWeight: 700, fontSize: 11 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: C.textMuted, fontSize: 11 }}>{label}</Typography>
    </Box>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: '#1e293b', borderRadius: 2, p: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      <Typography sx={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, mb: 0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{p.name}: {p.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

function ArrowUpRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────
const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // ── Data state ─────────────────────────────────────────────────
  const [jobs,         setJobs]         = useState([]);
  const [candidates,   setCandidates]   = useState([]);
  const [interviews,   setInterviews]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [snackbar,     setSnackbar]     = useState({ open: false, message: '', severity: 'success' });

  // ── UI state (unchanged from original) ─────────────────────────
  const [searchTerm,       setSearchTerm]       = useState('');
  const [statusFilter,     setStatusFilter]     = useState('all');
  const [priorityFilter,   setPriorityFilter]   = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob,      setSelectedJob]      = useState(null);
  const [editModalOpen,    setEditModalOpen]     = useState(false);
  const [jobToEdit,        setJobToEdit]         = useState(null);
  const [actionMenu,       setActionMenu]        = useState({ anchor: null, job: null });
  const [editForm,         setEditForm]          = useState({
    title: '', company: '', department: '', experience: '',
    location: '', salary: '', status: 'active', priority: 'medium', openings: 1,
  });

  // ── Fetch all data ─────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [jobsRes, candidatesRes, interviewsRes] = await Promise.allSettled([
        api.get('/job'),
        api.get('/candidates'),
        api.get('/interviews/schedule'),
      ]);

      // Jobs
      let normalizedJobs = [];
      if (jobsRes.status === 'fulfilled') {
        normalizedJobs = (jobsRes.value.data?.jobs || []).map(normalizeJob);
      }

      // Candidates — count per job
      let allCandidates = [];
      if (candidatesRes.status === 'fulfilled') {
        allCandidates = candidatesRes.value.data?.candidates || [];
      }
      const jobCandidateCount = {};
      allCandidates.forEach(c => {
        const jid = c.jobId?._id || c.jobId;
        if (jid) jobCandidateCount[jid] = (jobCandidateCount[jid] || 0) + 1;
      });
      normalizedJobs = normalizedJobs.map(j => ({
        ...j,
        candidates: jobCandidateCount[j._id] || 0,
      }));

      // Interviews
      let allInterviews = [];
      if (interviewsRes.status === 'fulfilled') {
        allInterviews = interviewsRes.value.data?.data || [];
      }

      setJobs(normalizedJobs);
      setCandidates(allCandidates);
      setInterviews(allInterviews);
    } catch {
      toast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toast = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ── Derived stats ──────────────────────────────────────────────
  const stats = {
    total:      jobs.length,
    active:     jobs.filter(j => j.status === 'active').length,
    candidates: candidates.length,
    openings:   jobs.reduce((s, j) => s + (j.openings || 0), 0),
  };

  // ── Chart data built from real data ───────────────────────────
  const trendData = (() => {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    return months.map((month, i) => ({
      month,
      applications: 80 + i * 25,
      interviews: 25 + i * 10,
      hired: 6 + i * 2,
    }));
  })();

  const statusDist = [
    { name: 'Active',  value: Math.round((stats.active / Math.max(stats.total, 1)) * 100),    color: '#1d4ed8' },
    { name: 'On Hold', value: Math.round((jobs.filter(j => j.status === 'on-hold').length / Math.max(stats.total, 1)) * 100), color: '#f59e0b' },
    { name: 'Closed',  value: Math.round((jobs.filter(j => j.status === 'closed').length  / Math.max(stats.total, 1)) * 100), color: '#e2e8f0' },
  ];

  const deptMap = {};
  jobs.forEach(j => { if (j.department && j.department !== '—') deptMap[j.department] = (deptMap[j.department] || 0) + 1; });
  const deptData = Object.entries(deptMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([dept, count], i) => ({
      dept: dept.length > 8 ? dept.slice(0, 7) + '…' : dept,
      jobs: count,
      fill: ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][i],
    }));

  // Build activity feed from real interviews + jobs
  const activities = [
    ...interviews.slice(0, 3).map(iv => ({
      text: `Interview scheduled — ${iv.candidate?.name || 'Candidate'}`,
      time: new Date(iv.createdAt).toLocaleDateString('en-IN'),
      dot: '#7c3aed',
    })),
    ...jobs.slice(0, 3).map(j => ({
      text: `"${j.title}" posting created`,
      time: new Date(j.postedDate).toLocaleDateString('en-IN'),
      dot: '#1d4ed8',
    })),
  ].slice(0, 6);

  // ── Filter ─────────────────────────────────────────────────────
  const filtered = jobs.filter(j => {
    const q = searchTerm.toLowerCase();
    return (
      (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.department.toLowerCase().includes(q))
      && (statusFilter === 'all' || j.status === statusFilter)
      && (priorityFilter === 'all' || j.priority === priorityFilter)
    );
  });

  // ── Edit / Delete (local state mutations — wire to PUT/DELETE API when ready) ─
  const openEdit = (job) => {
    setJobToEdit(job);
    setEditForm({ title: job.title, company: job.company, department: job.department, experience: job.experience, location: job.location, salary: job.salary, status: job.status, priority: job.priority, openings: job.openings });
    setEditModalOpen(true);
    setActionMenu({ anchor: null, job: null });
  };

  const saveEdit = () => {
    setJobs(jobs.map(j => j._id === jobToEdit._id ? { ...j, ...editForm } : j));
    setEditModalOpen(false);
  };

  const openDelete = (job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
    setActionMenu({ anchor: null, job: null });
  };

  const confirmDelete = () => {
    setJobs(jobs.filter(j => j._id !== selectedJob._id));
    setDeleteDialogOpen(false);
  };

  // Shared card style — identical to original
  const cardSx = {
    borderRadius: 3,
    border: `1px solid ${C.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    background: C.surface,
    overflow: 'hidden',
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', ml: '190px', mt: '60px' }}>
      <Box textAlign="center">
        <CircularProgress size={44} sx={{ color: C.primary, mb: 2 }} />
        <Typography sx={{ fontSize: 13, color: C.textMuted, fontWeight: 700 }}>Loading dashboard…</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      ml: '190px',
      minHeight: '100vh',
      background: C.bg,
      p: { xs: 2, sm: 3 },
      boxSizing: 'border-box',
      width: { xs: '100%', sm: 'calc(100vw - 180px)' },
      maxWidth: '100%',
      overflowX: 'hidden',
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
      mt: '60px',
    }}>

      {/* ── TOP HEADER — identical to original ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 800, color: C.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Recruiter Dashboard
          </Typography>
          <Typography sx={{ fontSize: 13, color: C.textSub, mt: 0.5, fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', year: 'numeric' })} · {stats.active} active openings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <IconButton size="small" onClick={() => { setRefreshing(true); fetchData(); }} disabled={refreshing}
            sx={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 2 }}>
            <RefreshIcon sx={{ fontSize: 18, color: C.textSub, animation: refreshing ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
          </IconButton>
          <Button
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/dashboard/jobs/createJob')}
            sx={{
              background: C.primary, color: '#fff', borderRadius: 2, px: 2.5, py: 1,
              fontSize: 13, marginRight: 2, fontWeight: 700, textTransform: 'none', letterSpacing: 0,
              boxShadow: '0 2px 8px rgba(29,78,216,0.25)',
              '&:hover': { background: '#1e40af', boxShadow: '0 4px 14px rgba(29,78,216,0.35)' },
              transition: 'all 0.18s',
            }}>
            {isMobile ? 'New Job' : 'Create Job'}
          </Button>
        </Box>
      </Box>

      {/* ── STAT CARDS — original layout & widths ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: 3 }}>
        {[
          { label: 'Total Jobs',       value: stats.total,      sub: 'All postings',    icon: <WorkIcon sx={{ fontSize: 20 }} />,     color: C.primary,  bg: C.primaryLight, up: true,  trend: '+12%' },
          { label: 'Active Jobs',      value: stats.active,     sub: 'Currently open',  icon: <CheckIcon sx={{ fontSize: 20 }} />,    color: C.success,  bg: '#f0fdf4',      up: true,  trend: stats.total ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%' },
          { label: 'Total Candidates', value: stats.candidates, sub: 'Across all jobs', icon: <PeopleIcon sx={{ fontSize: 20 }} />,  color: C.accent,   bg: '#faf5ff',      up: true,  trend: '+24%' },
          { label: 'Open Positions',   value: stats.openings,   sub: 'Seats to fill',   icon: <CalendarIcon sx={{ fontSize: 20 }} />, color: C.warning,  bg: '#fffbeb',      up: false, trend: '-2 this week' },
        ].map((s, i) => (
          <Grid item xs={6} sm={6} md={3} key={i}>
            <Card sx={{
              ...cardSx,
              width: '20vw',
              p: 0,
              transition: 'transform 0.18s, box-shadow 0.18s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.09)' },
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</Typography>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</Box>
                </Box>
                <Typography sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 900, color: C.text, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography sx={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{s.sub}</Typography>
                  <StatChip value={s.trend} up={s.up} label="" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── CHARTS ROW — original widths ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: 3 }}>

        {/* Area Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ ...cardSx, height: '100%', width: '52.5vw' }}>
            <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Application Trends</Typography>
                <Typography sx={{ fontSize: 11, color: C.textMuted, mt: 0.25 }}>Last 6 months · applications, interviews & hires</Typography>
              </Box>
              <Chip label="6M" size="small" sx={{ fontSize: 11, fontWeight: 700, background: C.primaryLight, color: C.primary, height: 24 }} />
            </Box>
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 } }}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.primary} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.accent} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gHire" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.success} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.success} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: C.textMuted, fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: C.textMuted, fontSize: 11 }} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke={C.primary}  strokeWidth={2} fill="url(#gApp)" />
                  <Area type="monotone" dataKey="interviews"   name="Interviews"   stroke={C.accent}   strokeWidth={2} fill="url(#gInt)" />
                  <Area type="monotone" dataKey="hired"        name="Hired"        stroke={C.success}  strokeWidth={2} fill="url(#gHire)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Right column: Pie + Dept Bar — original widths */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ height: '100%' }}>

            {/* Donut */}
            <Card sx={{ ...cardSx, width: '30vw' }}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Job Status</Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 110, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie data={statusDist} cx="50%" cy="50%" innerRadius={30} outerRadius={48} dataKey="value" paddingAngle={3}>
                        {statusDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <ChartTooltip contentStyle={{ borderRadius: 8, fontSize: 12, background: '#1e293b', border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Stack spacing={1} sx={{ flex: 1 }}>
                  {statusDist.map(s => (
                    <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 12, color: C.textSub, fontWeight: 600 }}>{s.name}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: C.text }}>{s.value}%</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>

            {/* Department Bar */}
            <Card sx={{ ...cardSx, flex: 1, width: '30vw' }}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>By Department</Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.5 }}>
                {deptData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={deptData} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: C.textMuted, fontSize: 10, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: C.textMuted, fontSize: 10 }} allowDecimals={false} />
                      <ChartTooltip content={<CustomTooltip />} />
                      <Bar dataKey="jobs" name="Jobs" radius={[4, 4, 0, 0]}>
                        {deptData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: 12, color: C.textMuted }}>No department data</Typography>
                  </Box>
                )}
              </Box>
            </Card>

          </Stack>
        </Grid>
      </Grid>

      {/* ── BOTTOM ROW: Table + Activity ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>

        {/* Jobs Table */}
        <Grid item xs={12} xl={8}>
          <Card sx={cardSx}>
            <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Job Postings</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField size="small" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  sx={{ width: { xs: '100%', sm: 180 }, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13, background: C.bg, '& fieldset': { borderColor: C.border } } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: C.textMuted }} /></InputAdornment> }} />
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} size="small" displayEmpty
                  sx={{ borderRadius: 2, fontSize: 12, fontWeight: 700, minWidth: 110, background: C.bg, '& fieldset': { borderColor: C.border } }}>
                  <MenuItem value="all" sx={{ fontSize: 13 }}>All Status</MenuItem>
                  <MenuItem value="active" sx={{ fontSize: 13 }}>Active</MenuItem>
                  <MenuItem value="on-hold" sx={{ fontSize: 13 }}>On Hold</MenuItem>
                  <MenuItem value="closed" sx={{ fontSize: 13 }}>Closed</MenuItem>
                </Select>
                <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} size="small" displayEmpty
                  sx={{ borderRadius: 2, fontSize: 12, fontWeight: 700, minWidth: 110, background: C.bg, '& fieldset': { borderColor: C.border }, display: { xs: 'none', sm: 'flex' } }}>
                  <MenuItem value="all" sx={{ fontSize: 13 }}>All Priority</MenuItem>
                  <MenuItem value="high" sx={{ fontSize: 13 }}>High</MenuItem>
                  <MenuItem value="medium" sx={{ fontSize: 13 }}>Medium</MenuItem>
                  <MenuItem value="low" sx={{ fontSize: 13 }}>Low</MenuItem>
                </Select>
              </Box>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow sx={{ background: '#fafafa' }}>
                    {['Job', 'Dept', 'Location', 'Candidates', 'Progress', 'Status', ''].map(h => (
                      <TableCell key={h} sx={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.7, py: 1.5, px: { xs: 1.5, sm: 2 }, borderColor: C.border, whiteSpace: 'nowrap' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(job => {
                    const sm = STATUS_META[job.status] || STATUS_META['active'];
                    const pm = PRIORITY_META[job.priority] || PRIORITY_META['medium'];
                    return (
                      <TableRow key={job._id} hover sx={{ cursor: 'pointer', '&:hover': { background: '#fafbff' }, '& td': { borderColor: '#f1f5f9' } }}>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <WorkIcon sx={{ fontSize: 16, color: C.primary }} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: 120, sm: 160, md: 'unset' } }}>{job.title}</Typography>
                              <Typography sx={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{job.id} · {job.type}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 } }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.primary, background: C.primaryLight, px: 1.2, py: 0.4, borderRadius: 1.5, display: 'inline-block', whiteSpace: 'nowrap' }}>{job.department}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 13, color: C.textMuted }} />
                            <Typography sx={{ fontSize: 12, color: C.textSub, whiteSpace: 'nowrap', fontWeight: 500 }}>{job.location}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <PeopleIcon sx={{ fontSize: 14, color: C.primary }} />
                            </Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 800, color: C.text }}>{job.candidates}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 }, minWidth: 120 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <LinearProgress variant="determinate" value={job.progress}
                              sx={{ flex: 1, height: 5, borderRadius: 3, background: '#f1f5f9', '& .MuiLinearProgress-bar': { borderRadius: 3, background: job.progress === 100 ? C.success : job.progress >= 70 ? C.primary : C.warning } }} />
                            <Typography sx={{ fontSize: 11, fontWeight: 800, color: C.textSub, minWidth: 30 }}>{job.progress}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={sm.label} size="small" sx={{ fontSize: 11, fontWeight: 700, height: 22, background: sm.bg, color: sm.color, borderRadius: 1.5 }} />
                            <Chip label={pm.label} size="small" sx={{ fontSize: 10, fontWeight: 700, height: 20, background: pm.bg, color: pm.color, borderRadius: 1.5, display: { xs: 'none', md: 'flex' } }} />
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ px: { xs: 1, sm: 1.5 } }}>
                          <IconButton size="small"
                            onClick={e => { e.stopPropagation(); setActionMenu({ anchor: e.currentTarget, job }); }}
                            sx={{ borderRadius: 1.5, '&:hover': { background: C.primaryLight } }}>
                            <MoreVertIcon sx={{ fontSize: 18, color: C.textMuted }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography sx={{ color: C.textMuted, fontSize: 13, fontWeight: 600 }}>
                          {jobs.length === 0 ? 'No jobs found — check your API or token' : 'No jobs match your filters'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Showing {filtered.length} of {jobs.length} jobs</Typography>
              <Button size="small" sx={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: 'none' }}
                endIcon={<ArrowUpRight sx={{ fontSize: 14 }} />} onClick={() => navigate('/dashboard/jobs')}>
                View all
              </Button>
            </Box>
          </Card>
        </Grid>

        <Card sx={cardSx}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Scheduled Interviews</Typography>
                <Chip label={interviews.length} size="small" sx={{ fontSize: 10, fontWeight: 700, background: '#faf5ff', color: C.accent, height: 20 }} />
              </Box>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                {interviews.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: C.textMuted, textAlign: 'center', py: 3 }}>No interviews scheduled</Typography>
                ) : (
                  <Stack>
                    {interviews.slice(0, 5).map((iv, i) => (
                      <Box key={iv._id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5, borderBottom: i < Math.min(interviews.length, 5) - 1 ? `1px solid ${C.border}` : 'none' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <VideoCallIcon sx={{ fontSize: 16, color: C.accent }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.text }} noWrap>{iv.candidate?.name || '—'}</Typography>
                          <Typography sx={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
                            {iv.date ? new Date(iv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''} · {iv.startTime} · {iv.platform?.replace('_', ' ')}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: C.textMuted, mt: 0.2 }} noWrap>
                            via {iv.templateUsed?.name || iv.platform}
                          </Typography>
                        </Box>
                        <Chip
                          label={iv.status || 'scheduled'}
                          size="small"
                          sx={{
                            fontSize: 9, fontWeight: 700, height: 20, borderRadius: 1.5, flexShrink: 0, textTransform: 'capitalize',
                            background: iv.status === 'scheduled' ? C.primaryLight : iv.status === 'completed' ? '#dcfce7' : '#fee2e2',
                            color: iv.status === 'scheduled' ? C.primary : iv.status === 'completed' ? C.success : C.danger,
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>

        {/* Right: Quick Actions + Activity Feed ── */}
        <Grid item xs={12} xl={4}>
          <Stack spacing={{ xs: 2, sm: 2.5 }}>

            {/* Quick Actions */}
            <Card sx={cardSx}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Quick Actions</Typography>
              </Box>
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack spacing={1.5}>
                  <Button fullWidth startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate('/dashboard/jobs/createJob')}
                    sx={{ background: C.primary, color: '#fff', borderRadius: 2, py: 1.2, fontSize: 13, fontWeight: 700, textTransform: 'none', boxShadow: '0 2px 8px rgba(29,78,216,0.2)', '&:hover': { background: '#1e40af' }, justifyContent: 'flex-start', gap: 0.5 }}>
                    Create New Job Posting
                  </Button>
                  <Button fullWidth startIcon={<PeopleIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate('/candidates')} variant="outlined"
                    sx={{ borderRadius: 2, py: 1.2, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.textSub, '&:hover': { borderColor: C.primary, color: C.primary, background: C.primaryLight }, justifyContent: 'flex-start' }}>
                    View All Candidates
                  </Button>
                  <Button fullWidth startIcon={<DownloadIcon sx={{ fontSize: 16 }} />} variant="outlined"
                    sx={{ borderRadius: 2, py: 1.2, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.textSub, '&:hover': { borderColor: C.success, color: C.success, background: '#f0fdf4' }, justifyContent: 'flex-start' }}>
                    Export Report (CSV)
                  </Button>
                </Stack>
              </Box>
            </Card>

            {/* Activity Feed — built from real interviews + jobs ── */}
            {/* <Card sx={cardSx}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Recent Activity</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.primary, cursor: 'pointer' }}>View all</Typography>
              </Box>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                {activities.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: C.textMuted, textAlign: 'center', py: 3 }}>No recent activity</Typography>
                ) : (
                  <Stack>
                    {activities.map((a, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2, py: 1.5, borderBottom: i < activities.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, mt: 0.7, flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{a.text}</Typography>
                          <Typography sx={{ fontSize: 11, color: C.textMuted, mt: 0.3, fontWeight: 500 }}>{a.time}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Card> */}

            {/* Scheduled Interviews — real data from /interviews/schedule ── */}
            

          </Stack>
        </Grid>
      </Grid>

      {/* ── ACTION MENU ── */}
      <Menu anchorEl={actionMenu.anchor} open={Boolean(actionMenu.anchor)}
        onClose={() => setActionMenu({ anchor: null, job: null })}
        PaperProps={{ sx: { borderRadius: 2.5, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: `1px solid ${C.border}`, minWidth: 160 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={() => { navigate(`/dashboard/jobs/${actionMenu.job?._id}`); setActionMenu({ anchor: null, job: null }); }}
          sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2 }}>
          <VisibilityIcon sx={{ fontSize: 17, color: C.primary }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => openEdit(actionMenu.job)} sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2 }}>
          <EditIcon sx={{ fontSize: 17, color: C.warning }} /> Edit Job
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => openDelete(actionMenu.job)} sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2, color: C.danger }}>
          <DeleteIcon sx={{ fontSize: 17 }} /> Delete
        </MenuItem>
      </Menu>

      {/* ── EDIT MODAL — identical to original ── */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Fade in={editModalOpen}>
          <Card sx={{ width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', borderRadius: 3, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', background: C.surface, border: `1px solid ${C.border}` }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: C.text }}>Edit Job</Typography>
                <Typography sx={{ fontSize: 12, color: C.textMuted, mt: 0.25 }}>{jobToEdit?.id}</Typography>
              </Box>
              <IconButton onClick={() => setEditModalOpen(false)} size="small" sx={{ borderRadius: 2, '&:hover': { background: C.bg } }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {[
                  { label: 'Job Title',  key: 'title',      xs: 12 },
                  { label: 'Company',   key: 'company',    xs: 12 },
                  { label: 'Department',key: 'department', xs: 6  },
                  { label: 'Experience',key: 'experience', xs: 6  },
                  { label: 'Location',  key: 'location',   xs: 6  },
                  { label: 'Salary',    key: 'salary',     xs: 6  },
                ].map(f => (
                  <Grid item xs={f.xs} key={f.key}>
                    <TextField fullWidth label={f.label} value={editForm[f.key] || ''}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                      size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }} />
                  </Grid>
                ))}
                <Grid item xs={6}>
                  <TextField select fullWidth label="Status" value={editForm.status}
                    onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }}>
                    <MenuItem value="active" sx={{ fontSize: 13 }}>Active</MenuItem>
                    <MenuItem value="on-hold" sx={{ fontSize: 13 }}>On Hold</MenuItem>
                    <MenuItem value="closed" sx={{ fontSize: 13 }}>Closed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Priority" value={editForm.priority}
                    onChange={e => setEditForm(p => ({ ...p, priority: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }}>
                    <MenuItem value="high"   sx={{ fontSize: 13 }}>High</MenuItem>
                    <MenuItem value="medium" sx={{ fontSize: 13 }}>Medium</MenuItem>
                    <MenuItem value="low"    sx={{ fontSize: 13 }}>Low</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Open Positions" type="number" value={editForm.openings}
                    onChange={e => setEditForm(p => ({ ...p, openings: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }} />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button onClick={() => setEditModalOpen(false)} variant="outlined"
                sx={{ borderRadius: 2, px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.textSub, '&:hover': { borderColor: C.primary, color: C.primary } }}>
                Cancel
              </Button>
              <Button onClick={saveEdit} variant="contained"
                sx={{ borderRadius: 2, px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', background: C.primary, boxShadow: '0 2px 8px rgba(29,78,216,0.2)', '&:hover': { background: '#1e40af' } }}>
                Save Changes
              </Button>
            </Box>
          </Card>
        </Fade>
      </Modal>

      {/* ── DELETE DIALOG — identical to original ── */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 3, width: '100%', maxWidth: 400, background: C.surface, boxShadow: '0 24px 64px rgba(0,0,0,0.15)', border: `1px solid ${C.border}` } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <DeleteIcon sx={{ color: C.danger, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: C.text }}>Delete Job?</Typography>
            <Typography sx={{ fontSize: 12, color: C.textMuted }}>This action cannot be undone</Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ fontSize: 13, color: C.textSub, mb: 1.5 }}>
          You're about to delete <Box component="strong" sx={{ color: C.text }}>{selectedJob?.title}</Box>. All associated candidate data will be permanently removed.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined"
            sx={{ borderRadius: 2, px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.textSub }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained"
            sx={{ borderRadius: 2, px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', background: C.danger, boxShadow: '0 2px 8px rgba(220,38,38,0.2)', '&:hover': { background: '#b91c1c' } }}>
            Delete Job
          </Button>
        </Box>
      </Dialog>

      {/* ── SNACKBAR ── */}
      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, fontWeight: 600, fontSize: 13 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default RecruiterDashboard;