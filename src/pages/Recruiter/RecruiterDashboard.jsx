  import React, { useState } from 'react';
  import {
    Box, Typography, Grid, Card, CardContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Button,
    IconButton, TextField, InputAdornment, MenuItem, Select,
    LinearProgress, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Divider, Stack, Fade, Modal, useTheme,
    useMediaQuery, Avatar, Badge, Menu, ListItemIcon, ListItemText
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
    Timeline as TimelineIcon, Assessment as AssessmentIcon
  } from '@mui/icons-material';
  import { useNavigate } from 'react-router-dom';
  import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area, Legend
  } from 'recharts';

  // ─── DATA ────────────────────────────────────────────────────────────────────
  const staticJobsData = [
    { id:'JOB-001', title:'Senior Frontend Developer', company:'TechCorp Inc.', department:'Engineering', experience:'5+ years', type:'Full-time', location:'San Francisco, CA', salary:'$120K–$150K', status:'active', priority:'high', candidates:24, openings:3, postedDate:'2024-01-15', deadline:'2024-02-28', recruiter:'Sarah Johnson', progress:75 },
    { id:'JOB-002', title:'UX/UI Designer', company:'DesignStudio', department:'Design', experience:'3+ years', type:'Full-time', location:'Remote', salary:'$90K–$110K', status:'active', priority:'medium', candidates:18, openings:2, postedDate:'2024-01-20', deadline:'2024-03-10', recruiter:'Michael Chen', progress:60 },
    { id:'JOB-003', title:'DevOps Engineer', company:'CloudSystems', department:'Operations', experience:'4+ years', type:'Contract', location:'New York, NY', salary:'$130K–$160K', status:'active', priority:'high', candidates:32, openings:1, postedDate:'2024-01-10', deadline:'2024-02-20', recruiter:'David Wilson', progress:90 },
    { id:'JOB-004', title:'Product Manager', company:'ProductLabs', department:'Product', experience:'6+ years', type:'Full-time', location:'Austin, TX', salary:'$140K–$180K', status:'on-hold', priority:'medium', candidates:15, openings:1, postedDate:'2024-01-05', deadline:'2024-02-15', recruiter:'Emma Davis', progress:40 },
    { id:'JOB-005', title:'Data Scientist', company:'DataInsights', department:'Analytics', experience:'3+ years', type:'Full-time', location:'Seattle, WA', salary:'$110K–$140K', status:'active', priority:'low', candidates:28, openings:2, postedDate:'2024-01-25', deadline:'2024-03-05', recruiter:'Robert Garcia', progress:50 },
    { id:'JOB-006', title:'Backend Developer', company:'CodeCraft', department:'Engineering', experience:'4+ years', type:'Full-time', location:'Remote', salary:'$115K–$145K', status:'closed', priority:'medium', candidates:42, openings:0, postedDate:'2023-12-15', deadline:'2024-01-30', recruiter:'James Miller', progress:100 },
    { id:'JOB-007', title:'Marketing Specialist', company:'GrowthHack', department:'Marketing', experience:'2+ years', type:'Full-time', location:'Los Angeles, CA', salary:'$70K–$90K', status:'active', priority:'low', candidates:22, openings:2, postedDate:'2024-01-30', deadline:'2024-03-15', recruiter:'Lisa Thompson', progress:30 },
    { id:'JOB-008', title:'QA Engineer', company:'QualityFirst', department:'QA', experience:'3+ years', type:'Contract', location:'Boston, MA', salary:'$85K–$105K', status:'active', priority:'medium', candidates:19, openings:3, postedDate:'2024-01-18', deadline:'2024-02-25', recruiter:'Thomas Lee', progress:65 },
  ];

  const trendData = [
    { month:'Aug', applications:95, interviews:32, hired:8 },
    { month:'Sep', applications:120, interviews:45, hired:12 },
    { month:'Oct', applications:180, interviews:65, hired:18 },
    { month:'Nov', applications:150, interviews:55, hired:14 },
    { month:'Dec', applications:130, interviews:48, hired:11 },
    { month:'Jan', applications:220, interviews:85, hired:24 },
  ];

  const statusDist = [
    { name:'Active', value:65, color:'#1d4ed8' },
    { name:'On Hold', value:15, color:'#f59e0b' },
    { name:'Closed', value:20, color:'#e2e8f0' },
  ];

  const deptData = [
    { dept:'Eng', jobs:8, fill:'#1d4ed8' },
    { dept:'Design', jobs:4, fill:'#3b82f6' },
    { dept:'Product', jobs:3, fill:'#60a5fa' },
    { dept:'Marketing', jobs:2, fill:'#93c5fd' },
    { dept:'Ops', jobs:2, fill:'#bfdbfe' },
  ];

  const activities = [
    { text:'New application for Senior Developer', time:'2h ago', type:'application', dot:'#1d4ed8' },
    { text:'Interview scheduled — UX Designer', time:'4h ago', type:'interview', dot:'#7c3aed' },
    { text:'"Data Scientist" posting published', time:'1d ago', type:'publish', dot:'#059669' },
    { text:'Candidate Michael Chen hired', time:'2d ago', type:'hire', dot:'#059669' },
    { text:'"DevOps Engineer" created', time:'3d ago', type:'create', dot:'#1d4ed8' },
    { text:'"Backend Developer" closed', time:'4d ago', type:'close', dot:'#dc2626' },
  ];

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
    active:   { label:'Active',   bg:'#dcfce7', color:'#15803d' },
    'on-hold':{ label:'On Hold',  bg:'#fef9c3', color:'#a16207' },
    closed:   { label:'Closed',   bg:'#f1f5f9', color:'#64748b' },
  };
  const PRIORITY_META = {
    high:   { label:'High',   bg:'#fee2e2', color:'#b91c1c' },
    medium: { label:'Med',    bg:'#fef3c7', color:'#b45309' },
    low:    { label:'Low',    bg:'#f0fdf4', color:'#15803d' },
  };

  function StatChip({ label, value, up }) {
    return (
      <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
        {up ? <UpIcon sx={{ fontSize:13, color:C.success }}/> : <DownIcon sx={{ fontSize:13, color:C.danger }}/>}
        <Typography variant="caption" sx={{ color: up ? C.success : C.danger, fontWeight:700, fontSize:11 }}>{value}</Typography>
        <Typography variant="caption" sx={{ color:C.textMuted, fontSize:11 }}>{label}</Typography>
      </Box>
    );
  }

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <Box sx={{ background:'#1e293b', borderRadius:2, p:1.5, boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
        <Typography sx={{ color:'#94a3b8', fontSize:11, fontWeight:700, mb:0.5 }}>{label}</Typography>
        {payload.map((p,i) => (
          <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Box sx={{ width:8, height:8, borderRadius:'50%', background:p.color }}/>
            <Typography sx={{ color:'#fff', fontSize:12, fontWeight:600 }}>{p.name}: {p.value}</Typography>
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
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [jobs, setJobs] = useState(staticJobsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);
    const [actionMenu, setActionMenu] = useState({ anchor: null, job: null });
    const [editForm, setEditForm] = useState({ title:'', company:'', department:'', experience:'', location:'', salary:'', status:'active', priority:'medium', openings:1 });

    const stats = {
      total: jobs.length,
      active: jobs.filter(j => j.status === 'active').length,
      candidates: jobs.reduce((s, j) => s + j.candidates, 0),
      openings: jobs.reduce((s, j) => s + j.openings, 0),
    };

    const filtered = jobs.filter(j => {
      const q = searchTerm.toLowerCase();
      return (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.department.toLowerCase().includes(q))
        && (statusFilter === 'all' || j.status === statusFilter)
        && (priorityFilter === 'all' || j.priority === priorityFilter);
    });

    const openEdit = (job) => {
      setJobToEdit(job);
      setEditForm({ title:job.title, company:job.company, department:job.department, experience:job.experience, location:job.location, salary:job.salary, status:job.status, priority:job.priority, openings:job.openings });
      setEditModalOpen(true);
      setActionMenu({ anchor:null, job:null });
    };

    const saveEdit = () => {
      setJobs(jobs.map(j => j.id === jobToEdit.id ? { ...j, ...editForm } : j));
      setEditModalOpen(false);
    };

    const openDelete = (job) => {
      setSelectedJob(job);
      setDeleteDialogOpen(true);
      setActionMenu({ anchor:null, job:null });
    };

    const confirmDelete = () => {
      setJobs(jobs.filter(j => j.id !== selectedJob.id));
      setDeleteDialogOpen(false);
    };

    // Shared card style
    const cardSx = {
      borderRadius: 3,
      border: `1px solid ${C.border}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      background: C.surface,
      overflow: 'hidden',
    };

    return (
      <Box sx={{
       ml:'190px',
        minHeight: '100vh',
        background: C.bg,
        p: { xs: 2, sm: 3 },
        boxSizing: 'border-box',
        width: { xs: '100%', sm: 'calc(100vw - 180px)' },
        maxWidth: '100%',
        overflowX: 'hidden',
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
        mt:'60px'
      }}>

        {/* ── TOP HEADER ── */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:3, gap:2, flexWrap:'wrap' }}>
          <Box>
            <Typography sx={{ fontSize:{ xs:20, sm:24 }, fontWeight:800, color:C.text, letterSpacing:'-0.5px', lineHeight:1.2 }}>
              Recruiter Dashboard
            </Typography>
            <Typography sx={{ fontSize:13, color:C.textSub, mt:0.5, fontWeight:500 }}>
              Thursday, March 2026 · {stats.active} active openings
            </Typography>
          </Box>
          <Box sx={{ display:'flex', gap:1.5, alignItems:'center' }}>
            <IconButton size="small" sx={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:2 }}>
              <NotifIcon sx={{ fontSize:18, color:C.textSub }}/>
            </IconButton>
            <Button
              startIcon={<AddIcon sx={{ fontSize:16 }}/>}
              onClick={() => navigate('/dashboard/jobs/createJob')}
              sx={{
                background: C.primary, color:'#fff', borderRadius:2, px:2.5, py:1,
                fontSize:13,marginRight:2, fontWeight:700, textTransform:'none', letterSpacing:0,
                boxShadow: '0 2px 8px rgba(29,78,216,0.25)',
                '&:hover': { background:'#1e40af', boxShadow:'0 4px 14px rgba(29,78,216,0.35)' },
                transition:'all 0.18s',
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
      trend: `${Math.round((stats.active / stats.total) * 100)}%`,
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
      <Card
        sx={{
          ...cardSx,
          width: "20vw",
          p: 0,
          transition: "transform 0.18s, box-shadow 0.18s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5 },
            "&:last-child": { pb: { xs: 2, sm: 2.5 } },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: C.textSub,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {s.label}
            </Typography>

            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
              }}
            >
              {s.icon}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 26, sm: 30 },
              fontWeight: 900,
              color: C.text,
              lineHeight: 1,
              mb: 1,
            }}
          >
            {s.value}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: C.textMuted,
                fontWeight: 500,
              }}
            >
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
        <Grid container spacing={{ xs:2, sm:2.5 }} sx={{ mb:3 }}>

          {/* Area Chart — Application Trends */}
       <Grid item xs={12} lg={8}>
  <Card sx={{ ...cardSx, height: "100%", width: "52.5vw" }}>
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>
          Application Trends
        </Typography>
        <Typography
          sx={{ fontSize: 11, color: C.textMuted, mt: 0.25 }}
        >
          Last 6 months · applications, interviews & hires
        </Typography>
      </Box>

      <Chip
        label="6M"
        size="small"
        sx={{
          fontSize: 11,
          fontWeight: 700,
          background: C.primaryLight,
          color: C.primary,
          height: 24,
        }}
      />
    </Box>

    <Box sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 } }}>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={trendData}
          margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
        >
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

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: C.textMuted, fontSize: 11, fontWeight: 600 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: C.textMuted, fontSize: 11 }}
          />

          <ChartTooltip content={<CustomTooltip />} />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: 12,
              fontWeight: 600,
              paddingTop: 8,
            }}
          />

          <Area
            type="monotone"
            dataKey="applications"
            name="Applications"
            stroke={C.primary}
            strokeWidth={2}
            fill="url(#gApp)"
          />

          <Area
            type="monotone"
            dataKey="interviews"
            name="Interviews"
            stroke={C.accent}
            strokeWidth={2}
            fill="url(#gInt)"
          />

          <Area
            type="monotone"
            dataKey="hired"
            name="Hired"
            stroke={C.success}
            strokeWidth={2}
            fill="url(#gHire)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Card>
</Grid>

          {/* Right column: Pie + Activity */}
         <Grid item xs={12} lg={4}>
  <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ height: "100%" }}>

    {/* Donut */}
    <Card sx={{ ...cardSx, width: "30vw" }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>
          Job Status
        </Typography>
      </Box>

      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ width: 110, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie
                data={statusDist}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={48}
                dataKey="value"
                paddingAngle={3}
              >
                {statusDist.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>

              <ChartTooltip
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 12,
                  background: "#1e293b",
                  border: "none",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Stack spacing={1} sx={{ flex: 1 }}>
          {statusDist.map((s) => (
            <Box
              key={s.name}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: s.color,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{ fontSize: 12, color: C.textSub, fontWeight: 600 }}
                >
                  {s.name}
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 13, fontWeight: 800, color: C.text }}>
                {s.value}%
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Card>

    {/* Department Bar */}
    <Card sx={{ ...cardSx, flex: 1, width: "30vw" }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${C.border}` }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>
          By Department
        </Typography>
      </Box>

      <Box sx={{ px: 2, py: 1.5 }}>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart
            data={deptData}
            margin={{ top: 0, right: 0, bottom: 0, left: -30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="dept"
              axisLine={false}
              tickLine={false}
              tick={{ fill: C.textMuted, fontSize: 10, fontWeight: 600 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: C.textMuted, fontSize: 10 }}
            />

            <ChartTooltip content={<CustomTooltip />} />

            <Bar dataKey="jobs" name="Jobs" radius={[4, 4, 0, 0]}>
              {deptData.map((d, i) => (
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
        <Grid container spacing={{ xs:2, sm:2.5 }}>

          {/* Jobs Table */}
          <Grid item xs={12} xl={8}>
            <Card sx={cardSx}>
              {/* Table Header */}
              <Box sx={{ p:{ xs:2, sm:2.5 }, borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:2 }}>
                <Typography sx={{ fontSize:14, fontWeight:800, color:C.text }}>Job Postings</Typography>
                <Box sx={{ display:'flex', gap:1.5, alignItems:'center', flexWrap:'wrap' }}>
                  <TextField
                    size="small" placeholder="Search…" value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{ width:{ xs:'100%', sm:180 }, '& .MuiOutlinedInput-root':{ borderRadius:2, fontSize:13, background:C.bg, '& fieldset':{ borderColor:C.border } } }}
                    InputProps={{ startAdornment:<InputAdornment position="start"><SearchIcon sx={{ fontSize:16, color:C.textMuted }}/></InputAdornment> }}
                  />
                  <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} size="small" displayEmpty
                    sx={{ borderRadius:2, fontSize:12, fontWeight:700, minWidth:110, background:C.bg, '& fieldset':{ borderColor:C.border } }}>
                    <MenuItem value="all" sx={{ fontSize:13 }}>All Status</MenuItem>
                    <MenuItem value="active" sx={{ fontSize:13 }}>Active</MenuItem>
                    <MenuItem value="on-hold" sx={{ fontSize:13 }}>On Hold</MenuItem>
                    <MenuItem value="closed" sx={{ fontSize:13 }}>Closed</MenuItem>
                  </Select>
                  <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} size="small" displayEmpty
                    sx={{ borderRadius:2, fontSize:12, fontWeight:700, minWidth:110, background:C.bg, '& fieldset':{ borderColor:C.border }, display:{ xs:'none', sm:'flex' } }}>
                    <MenuItem value="all" sx={{ fontSize:13 }}>All Priority</MenuItem>
                    <MenuItem value="high" sx={{ fontSize:13 }}>High</MenuItem>
                    <MenuItem value="medium" sx={{ fontSize:13 }}>Medium</MenuItem>
                    <MenuItem value="low" sx={{ fontSize:13 }}>Low</MenuItem>
                  </Select>
                </Box>
              </Box>

              <TableContainer sx={{ overflowX:'auto' }}>
                <Table sx={{ minWidth:640 }}>
                  <TableHead>
                    <TableRow sx={{ background:'#fafafa' }}>
                      {['Job', 'Dept', 'Location', 'Candidates', 'Progress', 'Status', ''].map(h => (
                        <TableCell key={h} sx={{ fontSize:11, fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.7, py:1.5, px:{ xs:1.5, sm:2 }, borderColor:C.border, whiteSpace:'nowrap' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map(job => {
                      const sm = STATUS_META[job.status];
                      const pm = PRIORITY_META[job.priority];
                      return (
                        <TableRow key={job.id} hover sx={{ cursor:'pointer', '&:hover':{ background:'#fafbff' }, '& td':{ borderColor:'#f1f5f9' } }}>
                          <TableCell sx={{ px:{ xs:1.5, sm:2 }, py:1.5 }}>
                            <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                              <Box sx={{ width:36, height:36, borderRadius:2, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <WorkIcon sx={{ fontSize:16, color:C.primary }}/>
                              </Box>
                              <Box sx={{ minWidth:0 }}>
                                <Typography sx={{ fontSize:13, fontWeight:800, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:{ xs:120, sm:160, md:'unset' } }}>{job.title}</Typography>
                                <Typography sx={{ fontSize:11, color:C.textMuted, fontWeight:500 }}>{job.company} · {job.id}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px:{ xs:1.5, sm:2 } }}>
                            <Typography sx={{ fontSize:12, fontWeight:700, color:C.primary, background:C.primaryLight, px:1.2, py:0.4, borderRadius:1.5, display:'inline-block', whiteSpace:'nowrap' }}>{job.department}</Typography>
                          </TableCell>
                          <TableCell sx={{ px:{ xs:1.5, sm:2 } }}>
                            <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                              <LocationIcon sx={{ fontSize:13, color:C.textMuted }}/>
                              <Typography sx={{ fontSize:12, color:C.textSub, whiteSpace:'nowrap', fontWeight:500 }}>{job.location}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px:{ xs:1.5, sm:2 } }}>
                            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                              <Box sx={{ width:28, height:28, borderRadius:'50%', background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <PeopleIcon sx={{ fontSize:14, color:C.primary }}/>
                              </Box>
                              <Typography sx={{ fontSize:13, fontWeight:800, color:C.text }}>{job.candidates}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px:{ xs:1.5, sm:2 }, minWidth:120 }}>
                            <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                              <LinearProgress variant="determinate" value={job.progress}
                                sx={{ flex:1, height:5, borderRadius:3, background:'#f1f5f9',
                                  '& .MuiLinearProgress-bar':{ borderRadius:3, background: job.progress === 100 ? C.success : job.progress >= 70 ? C.primary : C.warning }}}/>
                              <Typography sx={{ fontSize:11, fontWeight:800, color:C.textSub, minWidth:30 }}>{job.progress}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px:{ xs:1.5, sm:2 } }}>
                            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                              <Chip label={sm.label} size="small" sx={{ fontSize:11, fontWeight:700, height:22, background:sm.bg, color:sm.color, borderRadius:1.5 }}/>
                              <Chip label={pm.label} size="small" sx={{ fontSize:10, fontWeight:700, height:20, background:pm.bg, color:pm.color, borderRadius:1.5, display:{ xs:'none', md:'flex' } }}/>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ px:{ xs:1, sm:1.5 } }}>
                            <IconButton size="small"
                              onClick={e => { e.stopPropagation(); setActionMenu({ anchor:e.currentTarget, job }); }}
                              sx={{ borderRadius:1.5, '&:hover':{ background:C.primaryLight } }}>
                              <MoreVertIcon sx={{ fontSize:18, color:C.textMuted }}/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py:6 }}>
                          <Typography sx={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>No jobs match your filters</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ px:{ xs:2, sm:2.5 }, py:1.5, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Typography sx={{ fontSize:12, color:C.textMuted, fontWeight:600 }}>Showing {filtered.length} of {jobs.length} jobs</Typography>
                <Button size="small" sx={{ fontSize:12, fontWeight:700, color:C.primary, textTransform:'none' }} endIcon={<ArrowUpRight sx={{ fontSize:14 }}/>} onClick={() => navigate('/dashboard/jobs')}>
                  View all
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Right: Quick Actions + Activity */}
          <Grid item xs={12} xl={4}>
            <Stack spacing={{ xs:2, sm:2.5 }}>

              {/* Quick Actions */}
              <Card sx={cardSx}>
                <Box sx={{ p:{ xs:2, sm:2.5 }, borderBottom:`1px solid ${C.border}` }}>
                  <Typography sx={{ fontSize:14, fontWeight:800, color:C.text }}>Quick Actions</Typography>
                </Box>
                <Box sx={{ p:{ xs:2, sm:2.5 } }}>
                  <Stack spacing={1.5}>
                    <Button fullWidth startIcon={<AddIcon sx={{ fontSize:16 }}/>}
                      onClick={() => navigate('/dashboard/jobs/createJob')}
                      sx={{ background:C.primary, color:'#fff', borderRadius:2, py:1.2, fontSize:13, fontWeight:700, textTransform:'none',
                        boxShadow:'0 2px 8px rgba(29,78,216,0.2)', '&:hover':{ background:'#1e40af' }, justifyContent:'flex-start', gap:0.5 }}>
                      Create New Job Posting
                    </Button>
                    <Button fullWidth startIcon={<PeopleIcon sx={{ fontSize:16 }}/>}
                      onClick={() => navigate('/candidates')}
                      variant="outlined"
                      sx={{ borderRadius:2, py:1.2, fontSize:13, fontWeight:700, textTransform:'none', borderColor:C.border, color:C.textSub,
                        '&:hover':{ borderColor:C.primary, color:C.primary, background:C.primaryLight }, justifyContent:'flex-start' }}>
                      View All Candidates
                    </Button>
                    <Button fullWidth startIcon={<DownloadIcon sx={{ fontSize:16 }}/>} variant="outlined"
                      sx={{ borderRadius:2, py:1.2, fontSize:13, fontWeight:700, textTransform:'none', borderColor:C.border, color:C.textSub,
                        '&:hover':{ borderColor:C.success, color:C.success, background:'#f0fdf4' }, justifyContent:'flex-start' }}>
                      Export Report (CSV)
                    </Button>
                  </Stack>
                </Box>
              </Card>

              {/* Activity Feed */}
              <Card sx={cardSx}>
                <Box sx={{ p:{ xs:2, sm:2.5 }, borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <Typography sx={{ fontSize:14, fontWeight:800, color:C.text }}>Recent Activity</Typography>
                  <Typography sx={{ fontSize:11, fontWeight:700, color:C.primary, cursor:'pointer' }}>View all</Typography>
                </Box>
                <Box sx={{ p:{ xs:1.5, sm:2 } }}>
                  <Stack>
                    {activities.map((a, i) => (
                      <Box key={i} sx={{ display:'flex', gap:2, py:1.5, borderBottom: i < activities.length-1 ? `1px solid ${C.border}` : 'none', alignItems:'flex-start' }}>
                        <Box sx={{ width:8, height:8, borderRadius:'50%', background:a.dot, mt:0.7, flexShrink:0 }}/>
                        <Box sx={{ flex:1, minWidth:0 }}>
                          <Typography sx={{ fontSize:12, fontWeight:600, color:C.text, lineHeight:1.4 }}>{a.text}</Typography>
                          <Typography sx={{ fontSize:11, color:C.textMuted, mt:0.3, fontWeight:500 }}>{a.time}</Typography>
                        </Box>
                      </Box>
                    ))}
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
          onClose={() => setActionMenu({ anchor:null, job:null })}
          PaperProps={{ sx:{ borderRadius:2.5, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', border:`1px solid ${C.border}`, minWidth:160 } }}
          transformOrigin={{ horizontal:'right', vertical:'top' }}
          anchorOrigin={{ horizontal:'right', vertical:'bottom' }}
        >
          <MenuItem onClick={() => { navigate(`/dashboard/jobs/${actionMenu.job?.id}`); setActionMenu({ anchor:null, job:null }); }}
            sx={{ fontSize:13, fontWeight:600, gap:1.5, py:1.2 }}>
            <VisibilityIcon sx={{ fontSize:17, color:C.primary }}/> View Details
          </MenuItem>
          <MenuItem onClick={() => openEdit(actionMenu.job)} sx={{ fontSize:13, fontWeight:600, gap:1.5, py:1.2 }}>
            <EditIcon sx={{ fontSize:17, color:C.warning }}/> Edit Job
          </MenuItem>
          <Divider sx={{ my:0.5 }}/>
          <MenuItem onClick={() => openDelete(actionMenu.job)} sx={{ fontSize:13, fontWeight:600, gap:1.5, py:1.2, color:C.danger }}>
            <DeleteIcon sx={{ fontSize:17 }}/> Delete
          </MenuItem>
        </Menu>

        {/* ── EDIT MODAL ── */}
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}
          sx={{ display:'flex', alignItems:'center', justifyContent:'center', p:2 }}>
          <Fade in={editModalOpen}>
            <Card sx={{ width:'100%', maxWidth:520, maxHeight:'92vh', overflowY:'auto', borderRadius:3,
              boxShadow:'0 24px 64px rgba(0,0,0,0.18)', background:C.surface, border:`1px solid ${C.border}` }}>
              <Box sx={{ p:3, borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Box>
                  <Typography sx={{ fontSize:17, fontWeight:800, color:C.text }}>Edit Job</Typography>
                  <Typography sx={{ fontSize:12, color:C.textMuted, mt:0.25 }}>{jobToEdit?.id}</Typography>
                </Box>
                <IconButton onClick={() => setEditModalOpen(false)} size="small" sx={{ borderRadius:2, '&:hover':{ background:C.bg } }}>
                  <CloseIcon sx={{ fontSize:18 }}/>
                </IconButton>
              </Box>
              <Box sx={{ p:3 }}>
                <Grid container spacing={2}>
                  {[
                    { label:'Job Title', key:'title', xs:12 },
                    { label:'Company', key:'company', xs:12 },
                    { label:'Department', key:'department', xs:6 },
                    { label:'Experience', key:'experience', xs:6 },
                    { label:'Location', key:'location', xs:6 },
                    { label:'Salary', key:'salary', xs:6 },
                  ].map(f => (
                    <Grid item xs={f.xs} key={f.key}>
                      <TextField fullWidth label={f.label} value={editForm[f.key]}
                        onChange={e => setEditForm(p => ({ ...p, [f.key]:e.target.value }))}
                        size="small" sx={{ '& .MuiOutlinedInput-root':{ borderRadius:2, fontSize:13 }, '& label':{ fontSize:13 } }}/>
                    </Grid>
                  ))}
                  <Grid item xs={6}>
                    <TextField select fullWidth label="Status" value={editForm.status}
                      onChange={e => setEditForm(p => ({ ...p, status:e.target.value }))}
                      size="small" sx={{ '& .MuiOutlinedInput-root':{ borderRadius:2, fontSize:13 }, '& label':{ fontSize:13 } }}>
                      <MenuItem value="active" sx={{ fontSize:13 }}>Active</MenuItem>
                      <MenuItem value="on-hold" sx={{ fontSize:13 }}>On Hold</MenuItem>
                      <MenuItem value="closed" sx={{ fontSize:13 }}>Closed</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField select fullWidth label="Priority" value={editForm.priority}
                      onChange={e => setEditForm(p => ({ ...p, priority:e.target.value }))}
                      size="small" sx={{ '& .MuiOutlinedInput-root':{ borderRadius:2, fontSize:13 }, '& label':{ fontSize:13 } }}>
                      <MenuItem value="high" sx={{ fontSize:13 }}>High</MenuItem>
                      <MenuItem value="medium" sx={{ fontSize:13 }}>Medium</MenuItem>
                      <MenuItem value="low" sx={{ fontSize:13 }}>Low</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Open Positions" type="number" value={editForm.openings}
                      onChange={e => setEditForm(p => ({ ...p, openings:e.target.value }))}
                      size="small" sx={{ '& .MuiOutlinedInput-root':{ borderRadius:2, fontSize:13 }, '& label':{ fontSize:13 } }}/>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ px:3, pb:3, display:'flex', justifyContent:'flex-end', gap:1.5 }}>
                <Button onClick={() => setEditModalOpen(false)} variant="outlined"
                  sx={{ borderRadius:2, px:3, fontSize:13, fontWeight:700, textTransform:'none', borderColor:C.border, color:C.textSub, '&:hover':{ borderColor:C.primary, color:C.primary } }}>
                  Cancel
                </Button>
                <Button onClick={saveEdit} variant="contained"
                  sx={{ borderRadius:2, px:3, fontSize:13, fontWeight:700, textTransform:'none', background:C.primary, boxShadow:'0 2px 8px rgba(29,78,216,0.2)', '&:hover':{ background:'#1e40af' } }}>
                  Save Changes
                </Button>
              </Box>
            </Card>
          </Fade>
        </Modal>

        {/* ── DELETE DIALOG ── */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ sx:{ borderRadius:3, p:3, width:'100%', maxWidth:400, background:C.surface, boxShadow:'0 24px 64px rgba(0,0,0,0.15)', border:`1px solid ${C.border}` } }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:2 }}>
            <Box sx={{ width:44, height:44, borderRadius:2, background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <DeleteIcon sx={{ color:C.danger, fontSize:20 }}/>
            </Box>
            <Box>
              <Typography sx={{ fontSize:16, fontWeight:800, color:C.text }}>Delete Job?</Typography>
              <Typography sx={{ fontSize:12, color:C.textMuted }}>This action cannot be undone</Typography>
            </Box>
          </Box>
          <Divider sx={{ mb:2 }}/>
          <Typography sx={{ fontSize:13, color:C.textSub, mb:1.5 }}>
            You're about to delete <Box component="strong" sx={{ color:C.text }}>{selectedJob?.title}</Box>. All associated candidate data will be permanently removed.
          </Typography>
          <Box sx={{ display:'flex', gap:1.5, justifyContent:'flex-end', mt:2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined"
              sx={{ borderRadius:2, px:3, fontSize:13, fontWeight:700, textTransform:'none', borderColor:C.border, color:C.textSub }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="contained"
              sx={{ borderRadius:2, px:3, fontSize:13, fontWeight:700, textTransform:'none', background:C.danger, boxShadow:'0 2px 8px rgba(220,38,38,0.2)', '&:hover':{ background:'#b91c1c' } }}>
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
        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
      </svg>
    );
  }