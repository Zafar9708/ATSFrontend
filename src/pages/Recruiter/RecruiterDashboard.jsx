import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Button,
  IconButton, TextField, InputAdornment, MenuItem, Select,
  LinearProgress, Tooltip, Dialog, Divider, Stack, Fade, Modal, useTheme,
  useMediaQuery, Menu, Alert, CircularProgress, Avatar,
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
  Business as BusinessIcon, Email as EmailIcon, Phone as PhoneIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import axios from 'axios';

// API Configuration
const API_BASE_URL = '/api/v1';
const getAuthToken = () => localStorage.getItem('token'); // Adjust based on your token storage

// API Service
const apiService = {
  getJobs: async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/job`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getCandidates: async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/candidates`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteJob: async (jobId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${API_BASE_URL}/job/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateJob: async (jobId, jobData) => {
    const token = getAuthToken();
    const response = await axios.put(`${API_BASE_URL}/job/${jobId}`, jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const STATUS_META = {
  Active: { label: 'Active', bg: '#dcfce7', color: '#15803d' },
  'On Hold': { label: 'On Hold', bg: '#fef9c3', color: '#a16207' },
  Closed: { label: 'Closed', bg: '#f1f5f9', color: '#64748b' },
};

const PRIORITY_META = {
  high: { label: 'High', bg: '#fee2e2', color: '#b91c1c' },
  medium: { label: 'Med', bg: '#fef3c7', color: '#b45309' },
  low: { label: 'Low', bg: '#f0fdf4', color: '#15803d' },
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

// Custom Tooltip for charts
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for data
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [actionMenu, setActionMenu] = useState({ anchor: null, job: null });
  const [editForm, setEditForm] = useState({
    jobTitle: '',
    department: '',
    experience: '',
    status: 'Active',
    jobFormId: {
      jobType: '',
      openings: 1,
      locations: []
    }
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsResponse, candidatesResponse] = await Promise.all([
        apiService.getJobs(),
        apiService.getCandidates()
      ]);

      // Transform jobs data to match the expected format
      const transformedJobs = jobsResponse.jobs.map(job => ({
        id: job._id,
        title: job.jobTitle,
        company: job.jobFormId?.Client?.name || 'N/A',
        department: job.department,
        experience: job.experience,
        type: job.jobFormId?.jobType || 'Full-time',
        location: job.jobFormId?.locations?.[0]?.name || 'Remote',
        salary: job.jobFormId?.amount ? `$${job.jobFormId.amount}` : 'Not specified',
        status: job.status,
        priority: job.jobFormId?.markPriority ? 'high' : 'medium',
        candidates: 0, // Will be updated from candidates data
        openings: job.jobFormId?.openings || 1,
        postedDate: new Date(job.createdAt).toLocaleDateString(),
        deadline: job.jobFormId?.targetHireDate ? new Date(job.jobFormId.targetHireDate).toLocaleDateString() : 'N/A',
        recruiter: job.assignedRecruiters?.[0] || 'Unassigned',
        progress: calculateProgress(job),
        jobFormId: job.jobFormId
      }));

      // Count candidates per job
      const jobCandidateCounts = {};
      candidatesResponse.candidates.forEach(candidate => {
        if (candidate.jobId?._id) {
          jobCandidateCounts[candidate.jobId._id] = (jobCandidateCounts[candidate.jobId._id] || 0) + 1;
        }
      });

      // Update candidate counts
      transformedJobs.forEach(job => {
        job.candidates = jobCandidateCounts[job.id] || 0;
      });

      setJobs(transformedJobs);
      setCandidates(candidatesResponse.candidates);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (job) => {
    // Calculate based on time elapsed vs target hire date
    if (!job.createdAt || !job.jobFormId?.targetHireDate) return 0;
    
    const start = new Date(job.createdAt).getTime();
    const end = new Date(job.jobFormId.targetHireDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  // Generate trend data from actual jobs
  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        month: months[d.getMonth()],
        applications: 0,
        interviews: 0,
        hired: 0
      });
    }

    // Count candidates by month
    candidates.forEach(candidate => {
      const created = new Date(candidate.createdAt);
      const monthDiff = (now.getMonth() - created.getMonth() + 12) % 12;
      if (monthDiff < 6 && created.getFullYear() === now.getFullYear() - (monthDiff > now.getMonth() ? 1 : 0)) {
        const index = 5 - monthDiff;
        if (index >= 0 && index < 6) {
          last6Months[index].applications++;
          // You can add logic for interviews and hired based on candidate stage
        }
      }
    });

    return last6Months;
  };

  // Generate status distribution
  const getStatusDistribution = () => {
    const active = jobs.filter(j => j.status === 'Active').length;
    const onHold = jobs.filter(j => j.status === 'On Hold').length;
    const closed = jobs.filter(j => j.status === 'Closed').length;
    const total = jobs.length || 1;

    return [
      { name: 'Active', value: Math.round((active / total) * 100), color: C.primary },
      { name: 'On Hold', value: Math.round((onHold / total) * 100), color: C.warning },
      { name: 'Closed', value: Math.round((closed / total) * 100), color: C.border },
    ];
  };

  // Generate department data
  const getDepartmentData = () => {
    const deptCount = {};
    jobs.forEach(job => {
      deptCount[job.department] = (deptCount[job.department] || 0) + 1;
    });

    const colors = [C.primary, C.accent, C.warning, C.success, C.primaryMid];
    return Object.entries(deptCount).slice(0, 5).map(([dept, count], index) => ({
      dept: dept.substring(0, 3),
      jobs: count,
      fill: colors[index % colors.length]
    }));
  };

  // Generate recent activities
  const getRecentActivities = () => {
    const activities = [];
    
    // Add job activities
    jobs.slice(0, 3).forEach(job => {
      activities.push({
        text: `Job "${job.title}" posted`,
        time: 'Recently',
        type: 'job',
        dot: C.primary
      });
    });

    // Add candidate activities
    candidates.slice(0, 3).forEach(candidate => {
      activities.push({
        text: `Candidate ${candidate.firstName} ${candidate.lastName} applied`,
        time: 'Recently',
        type: 'candidate',
        dot: C.success
      });
    });

    return activities.slice(0, 6);
  };

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'Active').length,
    candidates: candidates.length,
    openings: jobs.reduce((s, j) => s + j.openings, 0),
  };

  const filtered = jobs.filter(j => {
    const q = searchTerm.toLowerCase();
    return (j.title?.toLowerCase().includes(q) || 
            j.company?.toLowerCase().includes(q) || 
            j.department?.toLowerCase().includes(q))
      && (statusFilter === 'all' || j.status === statusFilter)
      && (priorityFilter === 'all' || j.priority === priorityFilter);
  });

  const openEdit = (job) => {
    setJobToEdit(job);
    setEditForm({
      jobTitle: job.title,
      department: job.department,
      experience: job.experience,
      status: job.status,
      jobFormId: {
        jobType: job.type,
        openings: job.openings,
        locations: [{ name: job.location }]
      }
    });
    setEditModalOpen(true);
    setActionMenu({ anchor: null, job: null });
  };

  const saveEdit = async () => {
    try {
      await apiService.updateJob(jobToEdit.id, editForm);
      await fetchData(); // Refresh data
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job');
    }
  };

  const openDelete = (job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
    setActionMenu({ anchor: null, job: null });
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteJob(selectedJob.id);
      await fetchData(); // Refresh data
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job');
    }
  };

  const handleResendEmail = (job) => {
    // Implement email functionality
    console.log('Resend email for job:', job.id);
  };

  // Shared card style
  const cardSx = {
    borderRadius: 3,
    border: `1px solid ${C.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    background: C.surface,
    overflow: 'hidden',
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      ml: { xs: 0, sm: '-30px' },
      minHeight: '100vh',
      p: { xs: 2, sm: 3 },
      boxSizing: 'border-box',
      width: { xs: '100%', sm: 'calc(100vw - 180px)' },
      maxWidth: '100%',
      overflowX: 'hidden',
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
    }}>

      {/* ── TOP HEADER ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 800, color: C.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Recruiter Dashboard

          </Typography>
          <Typography sx={{ fontSize: 13, color: C.textSub, mt: 0.5, fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {stats.active} active openings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <IconButton size="small" sx={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 2 }} onClick={fetchData}>
            <NotifIcon sx={{ fontSize: 18, color: C.textSub }} />
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
            }}
          >
            {isMobile ? 'New Job' : 'Create Job'}
          </Button>
        </Box>
      </Box>

      {/* ── STAT CARDS ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: 3 }}>
        {[
          {
            label: "Total Jobs",
            value: stats.total,
            sub: "All postings",
            icon: <WorkIcon sx={{ fontSize: 20 }} />,
            color: C.primary,
            bg: C.primaryLight,
            up: true,
            trend: "+12%",
          },
          {
            label: "Active Jobs",
            value: stats.active,
            sub: "Currently open",
            icon: <CheckIcon sx={{ fontSize: 20 }} />,
            color: C.success,
            bg: "#f0fdf4",
            up: true,
            trend: `${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}%`,
          },
          {
            label: "Total Candidates",
            value: stats.candidates,
            sub: "Across all jobs",
            icon: <PeopleIcon sx={{ fontSize: 20 }} />,
            color: C.accent,
            bg: "#faf5ff",
            up: true,
            trend: "+24%",
          },
          {
            label: "Open Positions",
            value: stats.openings,
            sub: "Seats to fill",
            icon: <CalendarIcon sx={{ fontSize: 20 }} />,
            color: C.warning,
            bg: "#fffbeb",
            up: false,
            trend: "-2 this week",
          },
        ].map((s, i) => (
          <Grid item xs={6} sm={6} md={3} key={i}>
            <Card sx={{ ...cardSx, p: 0, transition: 'transform 0.18s, box-shadow 0.18s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.09)' } }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {s.label}
                  </Typography>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </Box>
                </Box>
                <Typography sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 900, color: C.text, lineHeight: 1, mb: 1 }}>
                  {s.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography sx={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
                    {s.sub}
                  </Typography>
                  <StatChip value={s.trend} up={s.up} label="" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── CHARTS ROW ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: 3 }}>
        {/* Area Chart — Application Trends */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ ...cardSx, height: '100%' }}>
            <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>
                  Application Trends
                </Typography>
                <Typography sx={{ fontSize: 11, color: C.textMuted, mt: 0.25 }}>
                  Last 6 months · applications, interviews & hires
                </Typography>
              </Box>
              <Chip label="6M" size="small" sx={{ fontSize: 11, fontWeight: 700, background: C.primaryLight, color: C.primary, height: 24 }} />
            </Box>
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 } }}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={generateTrendData()} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
                  <Area type="monotone" dataKey="applications" name="Applications" stroke={C.primary} strokeWidth={2} fill="url(#gApp)" />
                  <Area type="monotone" dataKey="interviews" name="Interviews" stroke={C.accent} strokeWidth={2} fill="url(#gInt)" />
                  <Area type="monotone" dataKey="hired" name="Hired" stroke={C.success} strokeWidth={2} fill="url(#gHire)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Right column: Pie + Activity */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ height: '100%' }}>
            {/* Donut */}
            <Card sx={{ ...cardSx }}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>
                  Job Status
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 110, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie data={getStatusDistribution()} cx="50%" cy="50%" innerRadius={30} outerRadius={48} dataKey="value" paddingAngle={3}>
                        {getStatusDistribution().map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <ChartTooltip contentStyle={{ borderRadius: 8, fontSize: 12, background: '#1e293b', border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Stack spacing={1} sx={{ flex: 1 }}>
                  {getStatusDistribution().map((s) => (
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
            <Card sx={{ ...cardSx, flex: 1 }}>
              <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>
                  By Department
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.5 }}>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={getDepartmentData()} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: C.textMuted, fontSize: 10, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: C.textMuted, fontSize: 10 }} />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Bar dataKey="jobs" name="Jobs" radius={[4, 4, 0, 0]}>
                      {getDepartmentData().map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
            {/* Table Header */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Job Postings</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small" placeholder="Search…" value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  sx={{ width: { xs: '100%', sm: 180 }, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13, background: C.bg, '& fieldset': { borderColor: C.border } } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: C.textMuted }} /></InputAdornment> }}
                />
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} size="small" displayEmpty
                  sx={{ borderRadius: 2, fontSize: 12, fontWeight: 700, minWidth: 110, background: C.bg, '& fieldset': { borderColor: C.border } }}>
                  <MenuItem value="all" sx={{ fontSize: 13 }}>All Status</MenuItem>
                  <MenuItem value="Active" sx={{ fontSize: 13 }}>Active</MenuItem>
                  <MenuItem value="On Hold" sx={{ fontSize: 13 }}>On Hold</MenuItem>
                  <MenuItem value="Closed" sx={{ fontSize: 13 }}>Closed</MenuItem>
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
                    const sm = STATUS_META[job.status] || STATUS_META.Active;
                    const pm = PRIORITY_META[job.priority] || PRIORITY_META.medium;
                    return (
                      <TableRow key={job.id} hover sx={{ cursor: 'pointer', '&:hover': { background: '#fafbff' }, '& td': { borderColor: '#f1f5f9' } }}>
                        <TableCell sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <WorkIcon sx={{ fontSize: 16, color: C.primary }} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: 120, sm: 160, md: 'unset' } }}>{job.title}</Typography>
                              <Typography sx={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{job.company} · {job.id}</Typography>
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
                              sx={{
                                flex: 1, height: 5, borderRadius: 3, background: '#f1f5f9',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 3,
                                  background: job.progress === 100 ? C.success : job.progress >= 70 ? C.primary : C.warning
                                }
                              }} />
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
                        <Typography sx={{ color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No jobs match your filters</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Showing {filtered.length} of {jobs.length} jobs</Typography>
              <Button size="small" sx={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: 'none' }} onClick={() => navigate('/dashboard/jobs')}>
                View all
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Right: Quick Actions + Activity */}
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
                    sx={{
                      background: C.primary, color: '#fff', borderRadius: 2, py: 1.2, fontSize: 13, fontWeight: 700, textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(29,78,216,0.2)', '&:hover': { background: '#1e40af' }, justifyContent: 'flex-start', gap: 0.5
                    }}>
                    Create New Job Posting
                  </Button>
                  <Button fullWidth startIcon={<PeopleIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate('/all/candidates')}
                    variant="outlined"
                    sx={{
                      borderRadius: 2, py: 1.2, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.textSub,
                      '&:hover': { borderColor: C.primary, color: C.primary, background: C.primaryLight }, justifyContent: 'flex-start'
                    }}>
                    View All Candidates
                  </Button>
                  <Button fullWidth startIcon={<DownloadIcon sx={{ fontSize: 16 }} />} variant="outlined"
                    onClick={() => {
                      // Implement export functionality
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "Job Title,Company,Department,Location,Status,Candidates\n" +
                        filtered.map(j => `${j.title},${j.company},${j.department},${j.location},${j.status},${j.candidates}`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "jobs_report.csv");
                      document.body.appendChild(link);
                      link.click();
                    }}
                    sx={{
                      borderRadius: 2, py: 1.2, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.textSub,
                      '&:hover': { borderColor: C.success, color: C.success, background: '#f0fdf4' }, justifyContent: 'flex-start'
                    }}>
                    Export Report (CSV)
                  </Button>
                </Stack>
              </Box>
            </Card>

            {/* Activity Feed */}
           {/* Activity Feed */}
<Card sx={cardSx}>
  <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Recent Activity</Typography>
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.primary, cursor: 'pointer' }}>View all</Typography>
  </Box>
  <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
    <Stack>
      {getRecentActivities().map((a, i) => {
        // Determine border based on index
        const activitiesList = getRecentActivities();
        const isLast = i === activitiesList.length - 1;
        
        return (
          <Box 
            key={i} 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              py: 1.5, 
              borderBottom: !isLast ? `1px solid ${C.border}` : 'none', 
              alignItems: 'flex-start' 
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, mt: 0.7, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
                {a.text}
              </Typography>
              <Typography sx={{ fontSize: 11, color: C.textMuted, mt: 0.3, fontWeight: 500 }}>
                {a.time}
              </Typography>
            </Box>
          </Box>
        );
      })}
      
      {/* Show message if no activities */}
      {getRecentActivities().length === 0 && (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 12, color: C.textMuted }}>
            No recent activities
          </Typography>
        </Box>
      )}
    </Stack>
  </Box>
</Card>
          </Stack>
        </Grid>
      </Grid>

      {/* ── ACTION MENU ── */}
      <Menu
        anchorEl={actionMenu.anchor}
        open={Boolean(actionMenu.anchor)}
        onClose={() => setActionMenu({ anchor: null, job: null })}
        PaperProps={{ sx: { borderRadius: 2.5, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: `1px solid ${C.border}`, minWidth: 160 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate(`/dashboard/jobs/${actionMenu.job?.id}`); setActionMenu({ anchor: null, job: null }); }}
          sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2 }}>
          <VisibilityIcon sx={{ fontSize: 17, color: C.primary }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => openEdit(actionMenu.job)} sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2 }}>
          <EditIcon sx={{ fontSize: 17, color: C.warning }} /> Edit Job
        </MenuItem>
        <MenuItem onClick={() => handleResendEmail(actionMenu.job)} sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2 }}>
          <EmailIcon sx={{ fontSize: 17, color: C.primary }} /> Resend Email
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => openDelete(actionMenu.job)} sx={{ fontSize: 13, fontWeight: 600, gap: 1.5, py: 1.2, color: C.danger }}>
          <DeleteIcon sx={{ fontSize: 17 }} /> Delete
        </MenuItem>
      </Menu>

      {/* ── EDIT MODAL ── */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Fade in={editModalOpen}>
          <Card sx={{
            width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', borderRadius: 3,
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)', background: C.surface, border: `1px solid ${C.border}`
          }}>
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
                <Grid item xs={12}>
                  <TextField fullWidth label="Job Title" value={editForm.jobTitle}
                    onChange={e => setEditForm(p => ({ ...p, jobTitle: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Department" value={editForm.department}
                    onChange={e => setEditForm(p => ({ ...p, department: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Experience" value={editForm.experience}
                    onChange={e => setEditForm(p => ({ ...p, experience: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Job Type" value={editForm.jobFormId?.jobType}
                    onChange={e => setEditForm(p => ({ ...p, jobFormId: { ...p.jobFormId, jobType: e.target.value } }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }}>
                    <MenuItem value="Full-time" sx={{ fontSize: 13 }}>Full-time</MenuItem>
                    <MenuItem value="Part-time" sx={{ fontSize: 13 }}>Part-time</MenuItem>
                    <MenuItem value="Contract" sx={{ fontSize: 13 }}>Contract</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Openings" type="number" value={editForm.jobFormId?.openings}
                    onChange={e => setEditForm(p => ({ ...p, jobFormId: { ...p.jobFormId, openings: parseInt(e.target.value) } }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Status" value={editForm.status}
                    onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }}>
                    <MenuItem value="Active" sx={{ fontSize: 13 }}>Active</MenuItem>
                    <MenuItem value="On Hold" sx={{ fontSize: 13 }}>On Hold</MenuItem>
                    <MenuItem value="Closed" sx={{ fontSize: 13 }}>Closed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Priority" value={editForm.priority}
                    onChange={e => setEditForm(p => ({ ...p, priority: e.target.value }))}
                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& label': { fontSize: 13 } }}>
                    <MenuItem value="high" sx={{ fontSize: 13 }}>High</MenuItem>
                    <MenuItem value="medium" sx={{ fontSize: 13 }}>Medium</MenuItem>
                    <MenuItem value="low" sx={{ fontSize: 13 }}>Low</MenuItem>
                  </TextField>
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

      {/* ── DELETE DIALOG ── */}
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
    </Box>
  );
};

export default RecruiterDashboard;

// Missing import fix
function ArrowUpRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );
}