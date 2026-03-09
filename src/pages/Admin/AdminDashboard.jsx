// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Button, Dialog, DialogContent,
//   TextField, CircularProgress, Grid, Snackbar, Alert,
//   Chip, Avatar, IconButton, Card, CardContent, InputAdornment,
//   Tooltip, useTheme, MenuItem, Select, FormControl, InputLabel,
//   useMediaQuery, LinearProgress,
// } from '@mui/material';
// import {
//   Add as AddIcon, Search as SearchIcon, Edit as EditIcon,
//   Delete as DeleteIcon, CheckCircle as ActiveIcon,
//   Refresh as RefreshIcon, People as PeopleIcon, Work as WorkIcon,
//   BarChart as BarChartIcon, TrendingUp as TrendingUpIcon,
//   Email as EmailIcon, Dashboard as DashboardIcon, Person as PersonIcon,
//   Phone as PhoneIcon, WorkHistory as ExperienceIcon,
//   Close as CloseIcon, CheckCircleOutline as SuccessCircleIcon,
//   MarkEmailRead as MailSentIcon, Send as SendIcon,
// } from '@mui/icons-material';
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
//   CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import adminService from '../../services/adminService';
// import { useNavigate } from 'react-router-dom';
// import { inviteVendor } from '../../services/Vendor/vendorService';

// /* ─────────────────────────────────────────────────────────────────────────────
//    DESIGN TOKENS
// ───────────────────────────────────────────────────────────────────────────── */
// const T = {
//   bg:          '#f0f4f8',
//   surface:     '#ffffff',
//   border:      '#e2e8f0',
//   primary:     '#1e40af',
//   primaryMid:  '#2563eb',
//   primaryLight:'#eff6ff',
//   text:        '#0f172a',
//   textSub:     '#475569',
//   textMuted:   '#94a3b8',
//   success:     '#059669',
//   successBg:   '#ecfdf5',
//   warning:     '#d97706',
//   warningBg:   '#fffbeb',
//   danger:      '#dc2626',
//   dangerBg:    '#fff1f2',
//   info:        '#0284c7',
//   infoBg:      '#f0f9ff',
//   purple:      '#7c3aed',
//   purpleBg:    '#faf5ff',
// };

// /* ─────────────────────────────────────────────────────────────────────────────
//    SMALL REUSABLES
// ───────────────────────────────────────────────────────────────────────────── */
// const DarkTip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <Box sx={{ background: '#1e293b', borderRadius: '10px', p: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
//       <Typography sx={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, mb: 0.5 }}>{label}</Typography>
//       {payload.map((p, i) => (
//         <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
//           <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
//           <Typography sx={{ color: '#f8fafc', fontSize: 12, fontWeight: 600 }}>{p.name}: {p.value}</Typography>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// const StatCard = ({ label, value, sub, icon, color, bg }) => (
//   <Card sx={{
//     borderRadius: '16px', border: `1px solid ${T.border}`,
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: T.surface,
//     overflow: 'hidden', position: 'relative',
//     transition: 'transform 0.15s, box-shadow 0.15s',
//     '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.09)' },
//   }}>
//     <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
//     <CardContent sx={{ pt: 2.5, pb: '18px !important', px: { xs: 2, sm: 2.5 } }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//         <Typography sx={{ fontSize: 11, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, lineHeight: 1.3 }}>
//           {label}
//         </Typography>
//         <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
//           {icon}
//         </Box>
//       </Box>
//       <Typography sx={{ fontSize: { xs: 28, sm: 34 }, fontWeight: 900, color: T.text, lineHeight: 1, mb: 1 }}>{value}</Typography>
//       <Typography sx={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>{sub}</Typography>
//     </CardContent>
//   </Card>
// );

// /* ─────────────────────────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────────────────────────────────── */
// const AdminDashboard = () => {
//   const theme    = useTheme();
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [recruiters,            setRecruiters]            = useState([]);
//   const [jobs,                  setJobs]                  = useState([]);
//   const [loading,               setLoading]               = useState(true);
//   const [openDialog,            setOpenDialog]            = useState(false);
//   const [saving,                setSaving]                = useState(false);
//   const [saveSuccess,           setSaveSuccess]           = useState(false);
//   const [savedRecruiterEmail,   setSavedRecruiterEmail]   = useState('');
//   const [editingId,             setEditingId]             = useState(null);
//   const [searchRecruiter,       setSearchRecruiter]       = useState('');
//   const [searchJob,             setSearchJob]             = useState('');
//   const [refreshing,            setRefreshing]            = useState(false);
//   const [timeFilter,            setTimeFilter]            = useState('all');
//   const [startDate,             setStartDate]             = useState(null);
//   const [endDate,               setEndDate]               = useState(null);
//   const [profileImage,          setProfileImage]          = useState(null);
//   const [profilePreview,        setProfilePreview]        = useState(null);
//   const [recruiterActivityData, setRecruiterActivityData] = useState([]);
//   const [openVendorDialog,      setOpenVendorDialog]      = useState(false);
//   const [vendorEmail,           setVendorEmail]           = useState('');
//   const [vendorInviteLoading,   setVendorInviteLoading]   = useState(false);
//   const [vendorInviteSuccess,   setVendorInviteSuccess]   = useState(false);
//   const [snackbar,              setSnackbar]              = useState({ open: false, message: '', severity: 'success' });
//   const [newRecruiter, setNewRecruiter] = useState({
//     email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null,
//   });

//   /* ── data ─────────────────────────────────────────────────────────────── */
//   const fetchRecruiters = async () => {
//     setLoading(true);
//     try {
//       const r = await adminService.getRecruiters();
//       setRecruiters(r.recruiters || r.recuiter || []);
//     } catch { showSnackbar('Failed to fetch recruiters', 'error'); setRecruiters([]); }
//     finally { setLoading(false); }
//   };

//   const fetchJobs = async () => {
//     try {
//       const r = await adminService.getAllJobs();
//       setJobs(r.jobs || []);
//     } catch { showSnackbar('Failed to fetch jobs', 'error'); setJobs([]); }
//   };

//   useEffect(() => { fetchRecruiters(); fetchJobs(); }, []);

//   useEffect(() => {
//     if (!recruiters.length) return;
//     const map = {};
//     recruiters.forEach(r => {
//       const d = new Date(r.createdAt);
//       const k = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
//       if (!map[k]) map[k] = { name: k, added: 0, active: 0 };
//       map[k].added++;
//       if (r.isActive) map[k].active++;
//     });
//     setRecruiterActivityData(Object.values(map).sort((a, b) => new Date(a.name) - new Date(b.name)).slice(-6));
//   }, [recruiters]);

//   /* ── computed ─────────────────────────────────────────────────────────── */
//   const activeJobs    = jobs.filter(j => j.status === 'Active' && new Date(j.jobFormId?.targetHireDate) >= new Date());
//   const avgJobsPerRec = recruiters.length ? (jobs.length / recruiters.length).toFixed(1) : 0;
//   const jobStatusData = [
//     { name: 'Active', value: activeJobs.length },
//     { name: 'Closed', value: jobs.filter(j => j.status === 'Closed').length },
//   ];
//   const PIE_COLORS = [T.success, T.danger];

//   const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchRecruiters();
//     fetchJobs().finally(() => setRefreshing(false));
//   };

//   /* ── date range ───────────────────────────────────────────────────────── */
//   const getDateRange = () => {
//     const now = new Date();
//     if (timeFilter === 'weekly')  return { s: new Date(now - 7*86400000), e: now };
//     if (timeFilter === 'monthly') return { s: new Date(now.getFullYear(), now.getMonth()-1, now.getDate()), e: now };
//     if (timeFilter === 'yearly')  return { s: new Date(now.getFullYear()-1, now.getMonth(), now.getDate()), e: now };
//     if (timeFilter === 'custom' && startDate && endDate) {
//       const e = new Date(endDate); e.setHours(23,59,59,999);
//       return { s: new Date(startDate), e };
//     }
//     return { s: null, e: null };
//   };

//   /* ── filtered data ────────────────────────────────────────────────────── */
//   const filteredRecruiters = recruiters.filter(r =>
//     r.email.toLowerCase().includes(searchRecruiter.toLowerCase()) ||
//     r.username?.toLowerCase().includes(searchRecruiter.toLowerCase())
//   );

//   const filteredJobs = jobs.filter(job => {
//     const q = searchJob.toLowerCase();
//     const hit = job.jobName?.toLowerCase().includes(q) || job.jobTitle?.toLowerCase().includes(q) || job.department?.toLowerCase().includes(q);
//     if (timeFilter === 'all') return hit;
//     const { s, e } = getDateRange();
//     if (!s || !e) return hit;
//     const d = new Date(job.createdAt);
//     return hit && d >= s && d <= e;
//   });

//   const getRecruiterName = id => {
//     const r = recruiters.find(x => x._id === id);
//     return r ? r.username || r.email : 'Unknown';
//   };

//   /* ── recruiter dialog ─────────────────────────────────────────────────── */
//   const handleOpenDialog = (recruiter = null) => {
//     setSaveSuccess(false); setSavedRecruiterEmail('');
//     if (recruiter) {
//       setEditingId(recruiter._id);
//       setNewRecruiter({ email: recruiter.email, password: '', username: recruiter.username||'', experience: recruiter.experience||0, phoneNumber: recruiter.phoneNumber||'', profilePicture: null });
//       setProfilePreview(recruiter.profilePicture || null);
//     } else {
//       setEditingId(null);
//       setNewRecruiter({ email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null });
//       setProfilePreview(null);
//     }
//     setProfileImage(null);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     if (saving) return;
//     setOpenDialog(false);
//     setTimeout(() => {
//       setEditingId(null); setSaveSuccess(false); setSavedRecruiterEmail('');
//       setNewRecruiter({ email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null });
//       setProfileImage(null); setProfilePreview(null);
//     }, 250);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setProfileImage(file);
//     setNewRecruiter(p => ({ ...p, profilePicture: file }));
//     const reader = new FileReader();
//     reader.onloadend = () => setProfilePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSaveRecruiter = async () => {
//     if (!newRecruiter.email.trim())    { showSnackbar('Email is required', 'warning'); return; }
//     if (!newRecruiter.username.trim()) { showSnackbar('Username is required', 'warning'); return; }
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append('email',       newRecruiter.email);
//       fd.append('password',    'temporary-password');
//       fd.append('username',    newRecruiter.username);
//       fd.append('experience',  newRecruiter.experience);
//       fd.append('phoneNumber', newRecruiter.phoneNumber);
//       if (newRecruiter.profilePicture) fd.append('profilePicture', newRecruiter.profilePicture);
//       await adminService.addRecruiter(fd);
//       setSavedRecruiterEmail(newRecruiter.email);
//       setSaveSuccess(true);
//       await fetchRecruiters();
//     } catch (err) {
//       showSnackbar(err.response?.data?.message || 'Error saving recruiter', 'error');
//     } finally { setSaving(false); }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this recruiter?')) return;
//     try {
//       await adminService.deleteRecruiter(id);
//       showSnackbar('Recruiter deleted', 'info');
//       fetchRecruiters();
//     } catch (err) { showSnackbar(err.response?.data?.message || 'Error deleting', 'error'); }
//   };

//   const handleResendWelcomeEmail = async (recruiterId) => {
//     try { await adminService.resendWelcomeEmail(recruiterId); showSnackbar('Welcome email resent!', 'success'); }
//     catch { showSnackbar('Failed to resend welcome email', 'error'); }
//   };

//   /* ── vendor ───────────────────────────────────────────────────────────── */
//   const handleInviteVendor = async () => {
//     if (!vendorEmail.trim()) { showSnackbar('Email is required', 'warning'); return; }
//     setVendorInviteLoading(true);
//     try {
//       await inviteVendor(vendorEmail);
//       showSnackbar('Vendor invitation sent!', 'success');
//       setVendorInviteSuccess(true);
//       setTimeout(() => { setOpenVendorDialog(false); setVendorEmail(''); setVendorInviteSuccess(false); }, 2500);
//     } catch (err) { showSnackbar(err.message || 'Error sending invitation', 'error'); }
//     finally { setVendorInviteLoading(false); }
//   };

//   /* ── shared sx ────────────────────────────────────────────────────────── */
//   const cardSx = {
//     borderRadius: '16px', border: `1px solid ${T.border}`,
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: T.surface, overflow: 'hidden',
//   };

//   const fieldSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '10px', fontSize: 13, background: T.bg,
//       '& fieldset': { borderColor: T.border },
//       '&:hover fieldset': { borderColor: '#94a3b8' },
//       '&.Mui-focused fieldset': { borderColor: T.primaryMid, borderWidth: 2 },
//     },
//     '& .MuiInputLabel-root': { fontSize: 13 },
//   };

//   /* ── loading ──────────────────────────────────────────────────────────── */
//   if (loading && !refreshing) return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 2 }}>
//       <Box sx={{ position: 'relative', width: 64, height: 64 }}>
//         <CircularProgress size={64} thickness={2} sx={{ color: T.primaryLight, position: 'absolute' }} variant="determinate" value={100} />
//         <CircularProgress size={64} thickness={2} sx={{ color: T.primaryMid, position: 'absolute', animationDuration: '900ms' }} />
//         <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <DashboardIcon sx={{ fontSize: 22, color: T.primaryMid }} />
//         </Box>
//       </Box>
//       <Typography sx={{ color: T.textSub, fontSize: 14, fontWeight: 700 }}>Loading Dashboard…</Typography>
//     </Box>
//   );

//   /* ════════════════════════════════════════════════════════════════════════
//      RENDER
//   ════════════════════════════════════════════════════════════════════════ */
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden', background: T.bg, minHeight: '100%', p: { xs: 1.5, sm: 2.5 } }}>

//         {/* ── HEADER ──────────────────────────────────────────────────────── */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
//           <Box>
//             <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 900, color: T.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
//               Admin Dashboard
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
//               <DashboardIcon sx={{ fontSize: 13, color: T.textMuted }} />
//               <Typography sx={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>Manage recruiters and job postings</Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
//             <FormControl size="small" sx={{ minWidth: 120 }}>
//               <InputLabel sx={{ fontSize: 12 }}>Time Filter</InputLabel>
//               <Select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} label="Time Filter"
//                 sx={{ borderRadius: '9px', fontSize: 12, background: T.surface, '& fieldset': { borderColor: T.border } }}>
//                 <MenuItem value="all"     sx={{ fontSize: 13 }}>All Time</MenuItem>
//                 <MenuItem value="weekly"  sx={{ fontSize: 13 }}>Weekly</MenuItem>
//                 <MenuItem value="monthly" sx={{ fontSize: 13 }}>Monthly</MenuItem>
//                 <MenuItem value="yearly"  sx={{ fontSize: 13 }}>Yearly</MenuItem>
//                 <MenuItem value="custom"  sx={{ fontSize: 13 }}>Custom</MenuItem>
//               </Select>
//             </FormControl>

//             {timeFilter === 'custom' && !isMobile && (
//               <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                 <DatePicker label="Start" value={startDate} onChange={setStartDate}
//                   renderInput={p => <TextField {...p} size="small" sx={{ width: 130, ...fieldSx }} />} />
//                 <Typography sx={{ color: T.textMuted }}>–</Typography>
//                 <DatePicker label="End" value={endDate} onChange={setEndDate}
//                   renderInput={p => <TextField {...p} size="small" sx={{ width: 130, ...fieldSx }} />} />
//               </Box>
//             )}

//             <Tooltip title="Refresh">
//               <IconButton onClick={handleRefresh} disabled={refreshing} size="small"
//                 sx={{ width: 36, height: 36, background: T.surface, border: `1px solid ${T.border}`, borderRadius: '9px', '&:hover': { background: T.primaryLight, borderColor: T.primaryMid } }}>
//                 <RefreshIcon sx={{ fontSize: 17, color: refreshing ? T.textMuted : T.primaryMid }} />
//               </IconButton>
//             </Tooltip>

//             {[
//               { label: isMobile ? 'Recruiter' : 'Add Recruiter', icon: <AddIcon sx={{ fontSize: 16 }} />,  onClick: () => handleOpenDialog(),        bg: T.primaryMid, hbg: T.primary,  color: '#fff'      },
//               { label: isMobile ? 'Vendor'    : 'Add Vendor',    icon: <EmailIcon sx={{ fontSize: 16 }} />, onClick: () => setOpenVendorDialog(true), bg: T.purple,     hbg: '#6d28d9',  color: '#fff'      },
//               { label: isMobile ? 'Job'       : 'Create Job',    icon: <WorkIcon sx={{ fontSize: 16 }} />,  onClick: () => navigate('/dashboard/jobs/createJob'), bg: T.surface, hbg: T.bg, color: T.textSub, border: `1px solid ${T.border}` },
//             ].map((btn, i) => (
//               <Button key={i} startIcon={btn.icon} onClick={btn.onClick}
//                 sx={{ background: btn.bg, color: btn.color, border: btn.border || 'none', borderRadius: '9px', px: { xs: 1.5, sm: 2 }, py: '8px', fontSize: { xs: 11, sm: 13 }, fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap', boxShadow: btn.border ? 'none' : '0 2px 8px rgba(0,0,0,0.14)', '&:hover': { background: btn.hbg, transform: 'translateY(-1px)' }, transition: 'all 0.15s' }}>
//                 {btn.label}
//               </Button>
//             ))}
//           </Box>
//         </Box>

//         {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
//         <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2.5 }}>
//           {[
//             { label: 'Total Recruiters',   value: recruiters.length, sub: `+${Math.floor(recruiters.length * 0.12)} from last month`, icon: <PeopleIcon sx={{ fontSize: 20 }} />,   color: T.primaryMid, bg: T.primaryLight },
//             { label: 'Total Jobs',         value: jobs.length,        sub: `${Math.floor(jobs.length * 0.3)} new this month`,          icon: <WorkIcon sx={{ fontSize: 20 }} />,      color: T.success,    bg: T.successBg    },
//             { label: 'Active Jobs',        value: activeJobs.length,  sub: `${jobs.length > 0 ? Math.round(activeJobs.length/jobs.length*100) : 0}% of total`, icon: <ActiveIcon sx={{ fontSize: 20 }} />, color: T.info, bg: T.infoBg },
//             { label: 'Avg Jobs/Recruiter', value: avgJobsPerRec,      sub: 'Across all recruiters', icon: <BarChartIcon sx={{ fontSize: 20 }} />, color: T.warning, bg: T.warningBg },
//           ].map((s, i) => (
//             <Grid item xs={6} md={3} key={i}><StatCard {...s} /></Grid>
//           ))}
//         </Grid>

//         {/* ── CHARTS ──────────────────────────────────────────────────────── */}
//         <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2.5 }}>
//           <Grid item xs={12} md={7}>
//             <Card sx={cardSx}>
//               <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>Recruiter Activity</Typography>
//                 <Chip label="Last 6 months" size="small" sx={{ fontSize: 10, fontWeight: 700, height: 22, background: T.primaryLight, color: T.primaryMid, borderRadius: '6px' }} />
//               </Box>
//               <Box sx={{ p: { xs: '12px 6px', sm: '20px 16px' } }}>
//                 <ResponsiveContainer width="100%" height={isMobile ? 180 : 230}>
//                   <BarChart data={recruiterActivityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
//                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: T.textMuted, fontSize: 11, fontWeight: 600 }} />
//                     <YAxis axisLine={false} tickLine={false} tick={{ fill: T.textMuted, fontSize: 11 }} />
//                     <ChartTooltip content={<DarkTip />} />
//                     <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 8 }} />
//                     <Bar dataKey="added"  name="Recruiters Added"  fill={T.success}    radius={[4,4,0,0]} />
//                     <Bar dataKey="active" name="Active Recruiters" fill={T.primaryMid} radius={[4,4,0,0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={5}>
//             <Card sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
//               <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}` }}>
//                 <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>Job Status</Typography>
//               </Box>
//               <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2.5, pt: 1, pb: 2.5 }}>
//                 {jobStatusData.some(d => d.value > 0) ? (
//                   <>
//                     {/*
//                       KEY FIX: outerRadius must be <= (height/2 - margin).
//                       Height=220, margin top+bottom=30 each → max radius = (220/2)-30 = 80.
//                       We use 75 to be safe. ResponsiveContainer must have a fixed px height.
//                     */}
//                     <ResponsiveContainer width="100%" height={220}>
//                       <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
//                         <Pie
//                           data={jobStatusData}
//                           cx="50%" cy="50%"
//                           innerRadius={48} outerRadius={75}
//                           dataKey="value" paddingAngle={4}
//                         >
//                           {jobStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
//                         </Pie>
//                         <ChartTooltip
//                           contentStyle={{ borderRadius: 8, fontSize: 12, background: '#1e293b', border: 'none' }}
//                           itemStyle={{ color: '#fff' }}
//                           formatter={(v, n) => [`${v} jobs`, n]}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>

//                     {/* legend */}
//                     <Box sx={{ width: '100%' }}>
//                       {jobStatusData.map((d, i) => (
//                         <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25, px: 0.5 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
//                             <Box sx={{ width: 12, height: 12, borderRadius: '4px', background: PIE_COLORS[i], flexShrink: 0 }} />
//                             <Typography sx={{ fontSize: 13, color: T.textSub, fontWeight: 600 }}>{d.name}</Typography>
//                           </Box>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Typography sx={{ fontSize: 16, fontWeight: 900, color: T.text }}>{d.value}</Typography>
//                             {jobs.length > 0 && (
//                               <Typography sx={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>
//                                 ({Math.round(d.value / jobs.length * 100)}%)
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       ))}
//                     </Box>
//                   </>
//                 ) : (
//                   <Typography sx={{ color: T.textMuted, fontSize: 13 }}>No job data available</Typography>
//                 )}
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* ── RECRUITERS + JOBS ───────────────────────────────────────────── */}
//         <Grid container spacing={{ xs: 1.5, sm: 2 }}>
//           {/* Recruiters */}
//           <Grid item xs={12} lg={6}>
//             <Card sx={{ ...cardSx, height: '100%' }}>
//               <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
//                 <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>
//                   Recruiters <Box component="span" sx={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>({filteredRecruiters.length})</Box>
//                 </Typography>
//                 <TextField size="small" placeholder="Search recruiters…" value={searchRecruiter}
//                   onChange={e => setSearchRecruiter(e.target.value)}
//                   sx={{ width: { xs: '100%', sm: 220 }, ...fieldSx }}
//                   InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//               </Box>
//               <TableContainer sx={{ overflowX: 'auto' }}>
//                 <Table sx={{ minWidth: 520 }}>
//                   <TableHead>
//                     <TableRow sx={{ background: '#f8fafc' }}>
//                       {['Name','Email','Phone','Exp','Status',''].map((h,i) => (
//                         <TableCell key={i} sx={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.7, py: 1.5, px: 2, borderColor: T.border, whiteSpace: 'nowrap' }}>{h}</TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredRecruiters.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
//                           <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: T.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
//                             <PeopleIcon sx={{ color: T.primaryMid, fontSize: 22 }} />
//                           </Box>
//                           <Typography sx={{ color: T.textMuted, fontSize: 13, fontWeight: 600, mb: 1.5 }}>No recruiters found</Typography>
//                           <Button startIcon={<AddIcon />} onClick={() => handleOpenDialog()} size="small"
//                             sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 12, fontWeight: 700, background: T.primaryLight, color: T.primaryMid, '&:hover': { background: '#dbeafe' } }}>
//                             Add First Recruiter
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ) : filteredRecruiters.map(r => (
//                       <TableRow key={r._id} hover sx={{ '&:hover': { background: '#fafbff' }, '& td': { borderColor: '#f1f5f9' } }}>
//                         <TableCell sx={{ px: 2, py: 1.5 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                             <Avatar src={r.profilePicture} sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 900, bgcolor: T.primaryMid, flexShrink: 0 }}>
//                               {!r.profilePicture && (r.username?.charAt(0) || r.email.charAt(0)).toUpperCase()}
//                             </Avatar>
//                             <Typography sx={{ fontSize: 13, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{r.username || '—'}</Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell sx={{ px: 2 }}>
//                           <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{r.email}</Typography>
//                         </TableCell>
//                         <TableCell sx={{ px: 2 }}>
//                           <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap' }}>{r.phoneNumber || '—'}</Typography>
//                         </TableCell>
//                         <TableCell sx={{ px: 2 }}>
//                           <Chip label={`${r.experience || 0}y`} size="small" sx={{ fontSize: 10, fontWeight: 700, height: 20, borderRadius: '5px', background: T.infoBg, color: T.info }} />
//                         </TableCell>
//                         <TableCell sx={{ px: 2 }}>
//                           <Chip label={r.isActive ? 'Active' : 'Inactive'} size="small" sx={{ fontSize: 10, fontWeight: 800, height: 20, borderRadius: '5px', background: r.isActive ? T.successBg : T.dangerBg, color: r.isActive ? T.success : T.danger }} />
//                         </TableCell>
//                         <TableCell align="right" sx={{ px: 1.5 }}>
//                           <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
//                             <Tooltip title="Resend Welcome Email">
//                               <IconButton size="small" onClick={() => handleResendWelcomeEmail(r._id)} sx={{ width: 28, height: 28, borderRadius: '7px', color: T.info, '&:hover': { background: T.infoBg } }}>
//                                 <EmailIcon sx={{ fontSize: 15 }} />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Edit">
//                               <IconButton size="small" onClick={() => handleOpenDialog(r)} sx={{ width: 28, height: 28, borderRadius: '7px', color: T.warning, '&:hover': { background: T.warningBg } }}>
//                                 <EditIcon sx={{ fontSize: 15 }} />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Delete">
//                               <IconButton size="small" onClick={() => handleDelete(r._id)} sx={{ width: 28, height: 28, borderRadius: '7px', color: T.danger, '&:hover': { background: T.dangerBg } }}>
//                                 <DeleteIcon sx={{ fontSize: 15 }} />
//                               </IconButton>
//                             </Tooltip>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Card>
//           </Grid>

//           {/* Job postings */}
//           <Grid item xs={12} lg={6}>
//             <Card sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
//               <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
//                 <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>
//                   Job Postings <Box component="span" sx={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>({filteredJobs.length})</Box>
//                 </Typography>
//                 <TextField size="small" placeholder="Search jobs…" value={searchJob}
//                   onChange={e => setSearchJob(e.target.value)}
//                   sx={{ width: { xs: '100%', sm: 200 }, ...fieldSx }}
//                   InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//               </Box>
//               <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 1.5, sm: 2 } }}>
//                 {filteredJobs.length === 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: T.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
//                       <WorkIcon sx={{ color: T.success, fontSize: 22 }} />
//                     </Box>
//                     <Typography sx={{ color: T.textMuted, fontSize: 13, fontWeight: 600 }}>No jobs found</Typography>
//                   </Box>
//                 ) : (
//                   <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="stretch">
//                     {filteredJobs.map(job => {
//                       const targetDate    = job.jobFormId?.targetHireDate ? new Date(job.jobFormId.targetHireDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : 'Not set';
//                       const isActive      = job.status === 'Active' && (!job.jobFormId?.targetHireDate || new Date(job.jobFormId.targetHireDate) >= new Date());
//                       const recruiterName = getRecruiterName(job.userId);

//                       return (
//                         <Grid item xs={12} sm={6} key={job._id} sx={{ display: 'flex' }}>
//                           <Card sx={{
//                             width: '100%',          /* fill grid cell */
//                             display: 'flex',
//                             flexDirection: 'column',
//                             borderRadius: '14px',
//                             border: `1px solid ${T.border}`,   /* SAME border for all cards */
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//                             background: T.surface,
//                             overflow: 'hidden',
//                             transition: 'all 0.18s',
//                             '&:hover': {
//                               transform: 'translateY(-3px)',
//                               boxShadow: '0 10px 28px rgba(0,0,0,0.10)',
//                               borderColor: '#cbd5e1',
//                             },
//                           }}>
//                             {/* neutral top stripe — same colour for all */}
//                             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${T.primaryMid}, #60a5fa)`, flexShrink: 0 }} />

//                             <Box sx={{ p: { xs: 1.75, sm: 2.25 }, display: 'flex', flexDirection: 'column', flex: 1 }}>

//                               {/* title + status chip */}
//                               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25, gap: 1 }}>
//                                 <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: T.text, lineHeight: 1.35, flex: 1 }}>
//                                   {job.jobTitle}
//                                 </Typography>
//                                 {/* status chip — green for active, RED only for closed */}
//                                 <Chip label={isActive ? 'Active' : 'Closed'} size="small"
//                                   sx={{
//                                     fontSize: 10, fontWeight: 800, height: 22, borderRadius: '7px', flexShrink: 0,
//                                     background: isActive ? T.successBg : T.dangerBg,
//                                     color:      isActive ? T.success   : T.danger,
//                                     border: `1px solid ${isActive ? T.success+'30' : T.danger+'30'}`,
//                                   }} />
//                               </Box>

//                               {/* tag chips */}
//                               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
//                                 {job.department && (
//                                   <Chip label={job.department} size="small"
//                                     sx={{ fontSize: 10, fontWeight: 700, height: 20, borderRadius: '5px', background: T.primaryLight, color: T.primaryMid }} />
//                                 )}
//                                 <Chip label={job.jobFormId?.jobType || 'Full-time'} size="small"
//                                   sx={{ fontSize: 10, fontWeight: 700, height: 20, borderRadius: '5px', background: T.purpleBg, color: T.purple }} />
//                               </Box>

//                               <Box sx={{ height: '1px', background: T.border, mb: 1.75 }} />

//                               {/* info rows */}
//                               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1, flex: 1 }}>
//                                 {[
//                                   { icon: <WorkIcon sx={{ fontSize: 13, color: T.primaryMid }} />, iconBg: T.primaryLight, label: 'Job ID',      val: job.jobName || '—'                   },
//                                   { icon: <PeopleIcon sx={{ fontSize: 13, color: T.success }} />,   iconBg: T.successBg,    label: 'Openings',    val: `${job.jobFormId?.openings || 0} positions` },
//                                   { icon: <ActiveIcon sx={{ fontSize: 13, color: T.warning }} />,   iconBg: T.warningBg,    label: 'Target Hire', val: targetDate                           },
//                                 ].map(row => (
//                                   <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
//                                     <Box sx={{ width: 26, height: 26, borderRadius: '7px', background: row.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                                       {row.icon}
//                                     </Box>
//                                     <Box sx={{ minWidth: 0 }}>
//                                       <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1 }}>
//                                         {row.label}
//                                       </Typography>
//                                       <Typography sx={{ fontSize: 12, fontWeight: 700, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                                         {row.val}
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 ))}
//                               </Box>

//                               {/* footer */}
//                               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: `1px solid ${T.border}` }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
//                                   <Avatar sx={{ width: 22, height: 22, fontSize: 10, fontWeight: 900, bgcolor: T.primaryMid }}>
//                                     {recruiterName !== 'Unknown' ? recruiterName.charAt(0).toUpperCase() : '?'}
//                                   </Avatar>
//                                   <Typography sx={{ fontSize: 11.5, color: T.textSub, fontWeight: 600, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                                     {recruiterName}
//                                   </Typography>
//                                 </Box>
//                                 <Typography sx={{ fontSize: 10.5, color: T.textMuted, fontWeight: 500 }}>
//                                   {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                                 </Typography>
//                               </Box>

//                             </Box>
//                           </Card>
//                         </Grid>
//                       );
//                     })}
//                   </Grid>
//                 )}
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* ════════════════════════════════════════════════════════════════════
//             ADD / EDIT RECRUITER DIALOG
//         ════════════════════════════════════════════════════════════════════ */}
//         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
//           PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', background: T.surface, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', m: { xs: 1.5, sm: 'auto' } } }}>

//           {/* gradient header */}
//           <Box sx={{ background: `linear-gradient(135deg, ${T.primaryMid} 0%, ${T.primary} 100%)`, px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
//             <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -35, right: 70, pointerEvents: 'none' }} />
//             <Box sx={{ position: 'absolute', width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, right: 20, pointerEvents: 'none' }} />
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
//               <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
//                 <PeopleIcon sx={{ color: '#fff', fontSize: 23 }} />
//               </Box>
//               <Box>
//                 <Typography sx={{ fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
//                   {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>
//                   {editingId ? 'Update recruiter information' : 'Register a new recruiter account'}
//                 </Typography>
//               </Box>
//             </Box>
//             <IconButton onClick={handleCloseDialog} disabled={saving}
//               sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: 34, height: 34, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
//               <CloseIcon sx={{ fontSize: 18 }} />
//             </IconButton>
//           </Box>

//           {saving && <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#93c5fd' } }} />}

//           <DialogContent sx={{ p: 0 }}>
//             {/* ── SUCCESS STATE ── */}
//             {saveSuccess ? (
//               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 5, px: 4 }}>
//                 {/* animated success icon */}
//                 <Box sx={{
//                   width: 84, height: 84, borderRadius: '50%',
//                   background: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
//                   border: `3px solid ${T.success}25`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
//                   boxShadow: `0 8px 28px ${T.success}20`,
//                   animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)',
//                   '@keyframes pop': {
//                     '0%':   { transform: 'scale(0.4)', opacity: 0 },
//                     '100%': { transform: 'scale(1)',   opacity: 1 },
//                   },
//                 }}>
//                   <SuccessCircleIcon sx={{ fontSize: 48, color: T.success }} />
//                 </Box>

//                 <Typography sx={{ fontSize: 22, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>
//                   Recruiter Added Successfully!
//                 </Typography>
//                 <Typography sx={{ fontSize: 13.5, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 320 }}>
//                   The recruiter account has been created and is ready to use.
//                 </Typography>

//                 {/* email-sent pill */}
//                 <Box sx={{
//                   display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left',
//                   background: `linear-gradient(135deg, ${T.primaryLight} 0%, #dbeafe 100%)`,
//                   border: `1.5px solid ${T.primaryMid}20`, borderRadius: '14px',
//                   px: 2.5, py: 2, maxWidth: 370, width: '100%',
//                   boxShadow: `0 4px 16px ${T.primaryMid}12`,
//                 }}>
//                   <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: T.primaryMid, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.primaryMid}30` }}>
//                     <MailSentIcon sx={{ color: '#fff', fontSize: 21 }} />
//                   </Box>
//                   <Box>
//                     <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: T.primaryMid, mb: 0.4 }}>
//                       Login credentials sent!
//                     </Typography>
//                     <Typography sx={{ fontSize: 12.5, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
//                       An email with login details has been delivered to{' '}
//                       <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedRecruiterEmail}</Box>
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Button onClick={handleCloseDialog} variant="contained"
//                   sx={{ mt: 4, borderRadius: '11px', px: 5, py: 1.3, fontSize: 14, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 4px 14px ${T.primaryMid}35`, '&:hover': { background: T.primary } }}>
//                   Done
//                 </Button>
//               </Box>

//             ) : (
//               /* ── FORM STATE ── */
//               <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
//                 {/* avatar upload */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.75, p: '14px 16px', background: T.bg, borderRadius: '12px', border: `1px solid ${T.border}` }}>
//                   <Box sx={{ position: 'relative', flexShrink: 0 }}>
//                     <Avatar src={profilePreview} sx={{ width: 58, height: 58, bgcolor: T.primaryMid, fontSize: 22, fontWeight: 900, boxShadow: `0 4px 14px ${T.primaryMid}28` }}>
//                       {!profilePreview && <PersonIcon sx={{ fontSize: 30 }} />}
//                     </Avatar>
//                     {profilePreview && (
//                       <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: T.success, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff' }}>
//                         <SuccessCircleIcon sx={{ fontSize: 11, color: '#fff' }} />
//                       </Box>
//                     )}
//                   </Box>
//                   <Box sx={{ minWidth: 0 }}>
//                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: T.text, mb: 0.5 }}>Profile Photo</Typography>
//                     <Button component="label" size="small" variant="outlined" disabled={saving}
//                       sx={{ borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, py: 0.55, px: 1.5, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
//                       {profilePreview ? 'Change Photo' : 'Upload Photo'}
//                       <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                     </Button>
//                     {profileImage && (
//                       <Typography sx={{ fontSize: 10, color: T.textMuted, mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
//                         {profileImage.name}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Box>

//                 {/* fields */}
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Username *" value={newRecruiter.username}
//                       onChange={e => setNewRecruiter(p => ({ ...p, username: e.target.value }))}
//                       disabled={saving} sx={fieldSx}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Email Address *" type="email" value={newRecruiter.email}
//                       onChange={e => setNewRecruiter(p => ({ ...p, email: e.target.value }))}
//                       disabled={saving} sx={fieldSx}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Phone Number" type="tel" value={newRecruiter.phoneNumber}
//                       onChange={e => setNewRecruiter(p => ({ ...p, phoneNumber: e.target.value }))}
//                       disabled={saving} sx={fieldSx}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Experience (years)" type="number" value={newRecruiter.experience}
//                       onChange={e => setNewRecruiter(p => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
//                       disabled={saving} sx={fieldSx} inputProps={{ min: 0, max: 50 }}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><ExperienceIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                 </Grid>

//                 {/* info note */}
//                 <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, p: '11px 14px', background: T.primaryLight, borderRadius: '10px', border: `1px solid ${T.primaryMid}20` }}>
//                   <MailSentIcon sx={{ fontSize: 17, color: T.primaryMid, flexShrink: 0 }} />
//                   <Typography sx={{ fontSize: 12, color: T.primaryMid, fontWeight: 600, lineHeight: 1.5 }}>
//                     Login credentials will be automatically emailed to the recruiter after registration.
//                   </Typography>
//                 </Box>
//               </Box>
//             )}
//           </DialogContent>

//           {!saveSuccess && (
//             <Box sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
//               <Button onClick={handleCloseDialog} disabled={saving} variant="outlined"
//                 sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSaveRecruiter} disabled={saving} variant="contained"
//                 sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 3px 10px ${T.primaryMid}35`, '&:hover': { background: T.primary }, minWidth: 152, transition: 'all 0.15s' }}>
//                 {saving ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
//                     <CircularProgress size={15} sx={{ color: '#fff' }} />
//                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Registering…</Typography>
//                   </Box>
//                 ) : editingId ? 'Update Recruiter' : 'Add Recruiter'}
//               </Button>
//             </Box>
//           )}
//         </Dialog>

//         {/* ════════════════════════════════════════════════════════════════════
//             INVITE VENDOR DIALOG
//         ════════════════════════════════════════════════════════════════════ */}
//         <Dialog open={openVendorDialog} onClose={() => !vendorInviteLoading && setOpenVendorDialog(false)} maxWidth="sm" fullWidth
//           PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', background: T.surface, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', m: { xs: 1.5, sm: 'auto' } } }}>

//           <Box sx={{ background: `linear-gradient(135deg, ${T.purple} 0%, #5b21b6 100%)`, px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
//             <Box sx={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -30, right: 60, pointerEvents: 'none' }} />
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
//               <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <SendIcon sx={{ color: '#fff', fontSize: 22 }} />
//               </Box>
//               <Box>
//                 <Typography sx={{ fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Invite Vendor</Typography>
//                 <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>Send a registration invitation</Typography>
//               </Box>
//             </Box>
//             <IconButton onClick={() => !vendorInviteLoading && setOpenVendorDialog(false)} disabled={vendorInviteLoading}
//               sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: 34, height: 34, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
//               <CloseIcon sx={{ fontSize: 18 }} />
//             </IconButton>
//           </Box>

//           {vendorInviteLoading && <LinearProgress sx={{ height: 2.5 }} />}

//           <DialogContent sx={{ p: 3 }}>
//             {vendorInviteSuccess ? (
//               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 3 }}>
//                 <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: T.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: `0 6px 20px ${T.success}20` }}>
//                   <SuccessCircleIcon sx={{ fontSize: 42, color: T.success }} />
//                 </Box>
//                 <Typography sx={{ fontSize: 18, fontWeight: 900, color: T.text, mb: 0.75 }}>Invitation Sent!</Typography>
//                 <Typography sx={{ fontSize: 13, color: T.textSub, fontWeight: 500, maxWidth: 280, lineHeight: 1.65 }}>
//                   The vendor will receive registration instructions at <strong>{vendorEmail}</strong>
//                 </Typography>
//               </Box>
//             ) : (
//               <>
//                 <Typography sx={{ fontSize: 13, color: T.textSub, mb: 2.5, lineHeight: 1.7, fontWeight: 500 }}>
//                   Enter the vendor's email address. They'll receive an invitation link to register on the platform.
//                 </Typography>
//                 <TextField fullWidth size="small" label="Vendor Email Address" type="email" value={vendorEmail}
//                   onChange={e => setVendorEmail(e.target.value)} disabled={vendorInviteLoading}
//                   placeholder="vendor@company.com" sx={fieldSx}
//                   InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
//               </>
//             )}
//           </DialogContent>

//           {!vendorInviteSuccess && (
//             <Box sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
//               <Button onClick={() => setOpenVendorDialog(false)} disabled={vendorInviteLoading} variant="outlined"
//                 sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleInviteVendor} disabled={vendorInviteLoading || !vendorEmail.trim()} variant="contained"
//                 sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 800, textTransform: 'none', background: T.purple, boxShadow: `0 3px 10px ${T.purple}35`, '&:hover': { background: '#6d28d9' }, minWidth: 150 }}>
//                 {vendorInviteLoading ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
//                     <CircularProgress size={15} sx={{ color: '#fff' }} />
//                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Sending…</Typography>
//                   </Box>
//                 ) : 'Send Invitation'}
//               </Button>
//             </Box>
//           )}
//         </Dialog>

//         {/* ── SNACKBAR ──────────────────────────────────────────────────────── */}
//         <Snackbar open={snackbar.open} autoHideDuration={5000}
//           onClose={() => setSnackbar(p => ({ ...p, open: false }))}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
//           <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))}
//             sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', fontWeight: 600, fontSize: 13 }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>

//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogContent,
  TextField, CircularProgress, Grid, Snackbar, Alert,
  Chip, Avatar, IconButton, Card, CardContent, InputAdornment,
  Tooltip, useTheme, MenuItem, Select, FormControl, InputLabel,
  useMediaQuery, LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Edit as EditIcon,
  Delete as DeleteIcon, CheckCircle as ActiveIcon,
  Refresh as RefreshIcon, People as PeopleIcon, Work as WorkIcon,
  BarChart as BarChartIcon, TrendingUp as TrendingUpIcon,
  Email as EmailIcon, Dashboard as DashboardIcon, Person as PersonIcon,
  Phone as PhoneIcon, WorkHistory as ExperienceIcon,
  Close as CloseIcon, CheckCircleOutline as SuccessCircleIcon,
  MarkEmailRead as MailSentIcon, Send as SendIcon,
  Business as BusinessIcon, LocationOn as LocationIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import adminService from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { inviteVendor } from '../../services/Vendor/vendorService';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const T = {
  bg:          '#f0f4f8',
  surface:     '#ffffff',
  border:      '#e2e8f0',
  primary:     '#1e40af',
  primaryMid:  '#2563eb',
  primaryLight:'#eff6ff',
  text:        '#0f172a',
  textSub:     '#475569',
  textMuted:   '#94a3b8',
  success:     '#059669',
  successBg:   '#ecfdf5',
  warning:     '#d97706',
  warningBg:   '#fffbeb',
  danger:      '#dc2626',
  dangerBg:    '#fff1f2',
  info:        '#0284c7',
  infoBg:      '#f0f9ff',
  purple:      '#7c3aed',
  purpleBg:    '#faf5ff',
};

const INDUSTRIES = [
  'Information Technology', 'Healthcare', 'Finance', 'Education',
  'Retail', 'Manufacturing', 'Construction', 'Telecommunications',
  'Transportation and Logistics', 'Marketing and Advertising',
  'Legal Services', 'Human Resources / Staffing', 'Real Estate',
  'Media and Entertainment', 'Government', 'Non-Profit',
  'Energy and Utilities', 'Hospitality', 'Agriculture',
  'Aerospace and Defense', 'E-commerce', 'Pharmaceuticals',
  'Automotive', 'Insurance', 'Consulting', 'Other',
];

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL REUSABLES
───────────────────────────────────────────────────────────────────────────── */
const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: '#1e293b', borderRadius: '10px', p: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      <Typography sx={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, mb: 0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
          <Typography sx={{ color: '#f8fafc', fontSize: 12, fontWeight: 600 }}>{p.name}: {p.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const StatCard = ({ label, value, sub, icon, color, bg }) => (
  <Card sx={{
    borderRadius: '16px', border: `1px solid ${T.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: T.surface,
    overflow: 'hidden', position: 'relative',
    transition: 'transform 0.15s, box-shadow 0.15s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.09)' },
  }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
    <CardContent sx={{ pt: 2.5, pb: '18px !important', px: { xs: 2, sm: 2.5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, lineHeight: 1.3 }}>
          {label}
        </Typography>
        <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          {icon}
        </Box>
      </Box>
      <Typography sx={{ fontSize: { xs: 28, sm: 34 }, fontWeight: 900, color: T.text, lineHeight: 1, mb: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>{sub}</Typography>
    </CardContent>
  </Card>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const theme    = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [recruiters,            setRecruiters]            = useState([]);
  const [jobs,                  setJobs]                  = useState([]);
  const [loading,               setLoading]               = useState(true);
  const [openDialog,            setOpenDialog]            = useState(false);
  const [saving,                setSaving]                = useState(false);
  const [saveSuccess,           setSaveSuccess]           = useState(false);
  const [savedRecruiterEmail,   setSavedRecruiterEmail]   = useState('');
  const [editingId,             setEditingId]             = useState(null);
  const [searchRecruiter,       setSearchRecruiter]       = useState('');
  const [searchJob,             setSearchJob]             = useState('');
  const [refreshing,            setRefreshing]            = useState(false);
  const [timeFilter,            setTimeFilter]            = useState('all');
  const [startDate,             setStartDate]             = useState(null);
  const [endDate,               setEndDate]               = useState(null);
  const [profileImage,          setProfileImage]          = useState(null);
  const [profilePreview,        setProfilePreview]        = useState(null);
  const [recruiterActivityData, setRecruiterActivityData] = useState([]);
  const [openVendorDialog,      setOpenVendorDialog]      = useState(false);
  const [vendorInviteLoading,   setVendorInviteLoading]   = useState(false);
  const [vendorInviteSuccess,   setVendorInviteSuccess]   = useState(false);
  const [savedVendorEmail,      setSavedVendorEmail]      = useState('');
  const [snackbar,              setSnackbar]              = useState({ open: false, message: '', severity: 'success' });

  const [vendorForm, setVendorForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    designation: '', companyName: '', companyEmail: '',
    companyPhone: '', companyAddress: '', industry: '',
  });

  const [newRecruiter, setNewRecruiter] = useState({
    email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null,
  });

  /* ── data ─────────────────────────────────────────────────────────────── */
  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const r = await adminService.getRecruiters();
      setRecruiters(r.recruiters || r.recuiter || []);
    } catch { showSnackbar('Failed to fetch recruiters', 'error'); setRecruiters([]); }
    finally { setLoading(false); }
  };

  const fetchJobs = async () => {
    try {
      const r = await adminService.getAllJobs();
      setJobs(r.jobs || []);
    } catch { showSnackbar('Failed to fetch jobs', 'error'); setJobs([]); }
  };

  useEffect(() => { fetchRecruiters(); fetchJobs(); }, []);

  useEffect(() => {
    if (!recruiters.length) return;
    const map = {};
    recruiters.forEach(r => {
      const d = new Date(r.createdAt);
      const k = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      if (!map[k]) map[k] = { name: k, added: 0, active: 0 };
      map[k].added++;
      if (r.isActive) map[k].active++;
    });
    setRecruiterActivityData(Object.values(map).sort((a, b) => new Date(a.name) - new Date(b.name)).slice(-6));
  }, [recruiters]);

  /* ── computed ─────────────────────────────────────────────────────────── */
  // Get today's date as a plain YYYY-MM-DD string (local timezone, no time component).
  // This avoids UTC-vs-local timezone bugs when comparing ISO date strings.
  const todayStr = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // e.g. "2026-03-08"
  })();

  // Normalize any date value to a YYYY-MM-DD string for safe comparison.
  const toDateStr = (val) => {
    if (!val) return null;
    // If already looks like YYYY-MM-DD (first 10 chars), use directly
    const s = String(val).slice(0, 10);
    return s.length === 10 ? s : null;
  };

  // A job is ACTIVE if targetHireDate >= today (or no date set).
  // A job is CLOSED if targetHireDate < today (strictly in the past).
  const activeJobs = jobs.filter(j => {
    const ds = toDateStr(j.jobFormId?.targetHireDate);
    if (!ds) return true;          // no date → active
    return ds >= todayStr;         // "2026-03-10" >= "2026-03-08" → active
  });

  const closedJobs = jobs.filter(j => {
    const ds = toDateStr(j.jobFormId?.targetHireDate);
    if (!ds) return false;         // no date → not closed
    return ds < todayStr;          // "2026-03-05" < "2026-03-08" → closed
  });

  const avgJobsPerRec = recruiters.length ? (jobs.length / recruiters.length).toFixed(1) : 0;
  const jobStatusData = [
    { name: 'Active', value: activeJobs.length },
    { name: 'Closed', value: closedJobs.length },
  ];
  const PIE_COLORS = [T.success, T.danger];

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecruiters();
    fetchJobs().finally(() => setRefreshing(false));
  };

  /* ── date range ───────────────────────────────────────────────────────── */
  const getDateRange = () => {
    const n = new Date();
    if (timeFilter === 'weekly')  return { s: new Date(n - 7*86400000), e: n };
    if (timeFilter === 'monthly') return { s: new Date(n.getFullYear(), n.getMonth()-1, n.getDate()), e: n };
    if (timeFilter === 'yearly')  return { s: new Date(n.getFullYear()-1, n.getMonth(), n.getDate()), e: n };
    if (timeFilter === 'custom' && startDate && endDate) {
      const e = new Date(endDate); e.setHours(23,59,59,999);
      return { s: new Date(startDate), e };
    }
    return { s: null, e: null };
  };

  /* ── filtered data ────────────────────────────────────────────────────── */
  const filteredRecruiters = recruiters.filter(r =>
    r.email.toLowerCase().includes(searchRecruiter.toLowerCase()) ||
    r.username?.toLowerCase().includes(searchRecruiter.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => {
    const q = searchJob.toLowerCase();
    const hit = job.jobName?.toLowerCase().includes(q) || job.jobTitle?.toLowerCase().includes(q) || job.department?.toLowerCase().includes(q);
    if (timeFilter === 'all') return hit;
    const { s, e } = getDateRange();
    if (!s || !e) return hit;
    const d = new Date(job.createdAt);
    return hit && d >= s && d <= e;
  });

  const getRecruiterName = id => {
    const r = recruiters.find(x => x._id === id);
    return r ? r.username || r.email : 'Admin';
  };

  /* ── helper: is job active ────────────────────────────────────────────── */
  const isJobActive = (job) => {
    const ds = toDateStr(job.jobFormId?.targetHireDate);
    if (!ds) return true;       // no date → active
    return ds >= todayStr;      // target >= today → active; target < today → closed
  };

  /* ── recruiter dialog ─────────────────────────────────────────────────── */
  const handleOpenDialog = (recruiter = null) => {
    setSaveSuccess(false); setSavedRecruiterEmail('');
    if (recruiter) {
      setEditingId(recruiter._id);
      setNewRecruiter({ email: recruiter.email, password: '', username: recruiter.username||'', experience: recruiter.experience||0, phoneNumber: recruiter.phoneNumber||'', profilePicture: null });
      setProfilePreview(recruiter.profilePicture || null);
    } else {
      setEditingId(null);
      setNewRecruiter({ email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null });
      setProfilePreview(null);
    }
    setProfileImage(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;
    setOpenDialog(false);
    setTimeout(() => {
      setEditingId(null); setSaveSuccess(false); setSavedRecruiterEmail('');
      setNewRecruiter({ email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null });
      setProfileImage(null); setProfilePreview(null);
    }, 250);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setNewRecruiter(p => ({ ...p, profilePicture: file }));
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveRecruiter = async () => {
    if (!newRecruiter.email.trim())    { showSnackbar('Email is required', 'warning'); return; }
    if (!newRecruiter.username.trim()) { showSnackbar('Username is required', 'warning'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('email',       newRecruiter.email);
      fd.append('password',    'temporary-password');
      fd.append('username',    newRecruiter.username);
      fd.append('experience',  newRecruiter.experience);
      fd.append('phoneNumber', newRecruiter.phoneNumber);
      if (newRecruiter.profilePicture) fd.append('profilePicture', newRecruiter.profilePicture);
      await adminService.addRecruiter(fd);
      setSavedRecruiterEmail(newRecruiter.email);
      setSaveSuccess(true);
      await fetchRecruiters();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error saving recruiter', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recruiter?')) return;
    try {
      await adminService.deleteRecruiter(id);
      showSnackbar('Recruiter deleted', 'info');
      fetchRecruiters();
    } catch (err) { showSnackbar(err.response?.data?.message || 'Error deleting', 'error'); }
  };

  const handleResendWelcomeEmail = async (recruiterId) => {
    try { await adminService.resendWelcomeEmail(recruiterId); showSnackbar('Welcome email resent!', 'success'); }
    catch { showSnackbar('Failed to resend welcome email', 'error'); }
  };

  /* ── vendor ───────────────────────────────────────────────────────────── */
  const handleOpenVendorDialog = () => {
    setVendorForm({
      firstName: '', lastName: '', email: '', phone: '',
      designation: '', companyName: '', companyEmail: '',
      companyPhone: '', companyAddress: '', industry: '',
    });
    setVendorInviteSuccess(false);
    setSavedVendorEmail('');
    setOpenVendorDialog(true);
  };

  const handleCloseVendorDialog = () => {
    if (vendorInviteLoading) return;
    setOpenVendorDialog(false);
    setTimeout(() => {
      setVendorInviteSuccess(false);
      setSavedVendorEmail('');
    }, 250);
  };

  const handleRegisterVendor = async () => {
    if (!vendorForm.firstName.trim()) { showSnackbar('First name is required', 'warning'); return; }
    if (!vendorForm.lastName.trim())  { showSnackbar('Last name is required', 'warning'); return; }
    if (!vendorForm.email.trim())     { showSnackbar('Email is required', 'warning'); return; }
    if (!vendorForm.companyName.trim()) { showSnackbar('Company name is required', 'warning'); return; }
    if (!vendorForm.industry)         { showSnackbar('Industry is required', 'warning'); return; }

    setVendorInviteLoading(true);
    try {
      await inviteVendor(vendorForm);
      setSavedVendorEmail(vendorForm.email);
      setVendorInviteSuccess(true);
      showSnackbar('Vendor registered successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || err.response?.data?.message || 'Error registering vendor', 'error');
    } finally {
      setVendorInviteLoading(false);
    }
  };

  /* ── shared sx ────────────────────────────────────────────────────────── */
  const cardSx = {
    borderRadius: '16px', border: `1px solid ${T.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: T.surface, overflow: 'hidden',
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px', fontSize: 13, background: T.bg,
      '& fieldset': { borderColor: T.border },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: T.primaryMid, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { fontSize: 13 },
  };

  const vendorFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px', fontSize: 13, background: T.bg,
      '& fieldset': { borderColor: T.border },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: T.purple, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { fontSize: 13 },
    '& .MuiInputLabel-root.Mui-focused': { color: T.purple },
  };

  /* ── loading ──────────────────────────────────────────────────────────── */
  if (loading && !refreshing) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 2 }}>
      <Box sx={{ position: 'relative', width: 64, height: 64 }}>
        <CircularProgress size={64} thickness={2} sx={{ color: T.primaryLight, position: 'absolute' }} variant="determinate" value={100} />
        <CircularProgress size={64} thickness={2} sx={{ color: T.primaryMid, position: 'absolute', animationDuration: '900ms' }} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DashboardIcon sx={{ fontSize: 22, color: T.primaryMid }} />
        </Box>
      </Box>
      <Typography sx={{ color: T.textSub, fontSize: 14, fontWeight: 700 }}>Loading Dashboard…</Typography>
    </Box>
  );

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden', minHeight: '100%', p: { xs: 1.5, sm: 2.5 } }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 900, color: T.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <DashboardIcon sx={{ fontSize: 13, color: T.textMuted }} />
              <Typography sx={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>Manage recruiters and job postings</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: 12 }}>Time Filter</InputLabel>
              <Select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} label="Time Filter"
                sx={{ borderRadius: '9px', fontSize: 12, background: T.surface, '& fieldset': { borderColor: T.border } }}>
                <MenuItem value="all"     sx={{ fontSize: 13 }}>All Time</MenuItem>
                <MenuItem value="weekly"  sx={{ fontSize: 13 }}>Weekly</MenuItem>
                <MenuItem value="monthly" sx={{ fontSize: 13 }}>Monthly</MenuItem>
                <MenuItem value="yearly"  sx={{ fontSize: 13 }}>Yearly</MenuItem>
                <MenuItem value="custom"  sx={{ fontSize: 13 }}>Custom</MenuItem>
              </Select>
            </FormControl>

            {timeFilter === 'custom' && !isMobile && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <DatePicker label="Start" value={startDate} onChange={setStartDate}
                  renderInput={p => <TextField {...p} size="small" sx={{ width: 130, ...fieldSx }} />} />
                <Typography sx={{ color: T.textMuted }}>–</Typography>
                <DatePicker label="End" value={endDate} onChange={setEndDate}
                  renderInput={p => <TextField {...p} size="small" sx={{ width: 130, ...fieldSx }} />} />
              </Box>
            )}

            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={refreshing} size="small"
                sx={{ width: 36, height: 36, background: T.surface, border: `1px solid ${T.border}`, borderRadius: '9px', '&:hover': { background: T.primaryLight, borderColor: T.primaryMid } }}>
                <RefreshIcon sx={{ fontSize: 17, color: refreshing ? T.textMuted : T.primaryMid }} />
              </IconButton>
            </Tooltip>

            {[
              { label: isMobile ? 'Recruiter' : 'Add Recruiter', icon: <AddIcon sx={{ fontSize: 16 }} />,  onClick: () => handleOpenDialog(),         bg: T.primaryMid, hbg: T.primary,  color: '#fff'      },
              { label: isMobile ? 'Vendor'    : 'Add Vendor',    icon: <EmailIcon sx={{ fontSize: 16 }} />, onClick: handleOpenVendorDialog,            bg: T.purple,     hbg: '#6d28d9',  color: '#fff'      },
              { label: isMobile ? 'Job'       : 'Create Job',    icon: <WorkIcon sx={{ fontSize: 16 }} />,  onClick: () => navigate('/dashboard/jobs/createJob'), bg: T.surface, hbg: T.bg, color: T.textSub, border: `1px solid ${T.border}` },
            ].map((btn, i) => (
              <Button key={i} startIcon={btn.icon} onClick={btn.onClick}
                sx={{ background: btn.bg, color: btn.color, border: btn.border || 'none', borderRadius: '9px', px: { xs: 1.5, sm: 2 }, py: '8px', fontSize: { xs: 11, sm: 13 }, fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap', boxShadow: btn.border ? 'none' : '0 2px 8px rgba(0,0,0,0.14)', '&:hover': { background: btn.hbg, transform: 'translateY(-1px)' }, transition: 'all 0.15s' }}>
                {btn.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2.5 }}>
          {[
            { label: 'Total Recruiters',   value: recruiters.length,  sub: `+${Math.floor(recruiters.length * 0.12)} from last month`, icon: <PeopleIcon sx={{ fontSize: 20 }} />,   color: T.primaryMid, bg: T.primaryLight },
            { label: 'Total Jobs',         value: jobs.length,         sub: `${Math.floor(jobs.length * 0.3)} new this month`,          icon: <WorkIcon sx={{ fontSize: 20 }} />,      color: T.success,    bg: T.successBg    },
            { label: 'Active Jobs',        value: activeJobs.length,   sub: `${jobs.length > 0 ? Math.round(activeJobs.length/jobs.length*100) : 0}% of total`, icon: <ActiveIcon sx={{ fontSize: 20 }} />, color: T.info, bg: T.infoBg },
            { label: 'Avg Jobs/Recruiter', value: avgJobsPerRec,       sub: 'Across all recruiters', icon: <BarChartIcon sx={{ fontSize: 20 }} />, color: T.warning, bg: T.warningBg },
          ].map((s, i) => (
            <Grid item xs={6} md={3} key={i}><StatCard {...s} /></Grid>
          ))}
        </Grid>

        {/* ── CHARTS ──────────────────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2.5 }}>
          <Grid item xs={12} md={7}>
            <Card sx={cardSx}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>Recruiter Activity</Typography>
                <Chip label="Last 6 months" size="small" sx={{ fontSize: 10, fontWeight: 700, height: 22, background: T.primaryLight, color: T.primaryMid, borderRadius: '6px' }} />
              </Box>
              <Box sx={{ p: { xs: '12px 6px', sm: '20px 16px' } }}>
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 230}>
                  <BarChart data={recruiterActivityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: T.textMuted, fontSize: 11, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: T.textMuted, fontSize: 11 }} />
                    <ChartTooltip content={<DarkTip />} />
                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 8 }} />
                    <Bar dataKey="added"  name="Recruiters Added"  fill={T.success}    radius={[4,4,0,0]} />
                    <Bar dataKey="active" name="Active Recruiters" fill={T.primaryMid} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}` }}>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>Job Status</Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2.5, pt: 1, pb: 2.5 }}>
                {jobStatusData.some(d => d.value > 0) ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                        <Pie
                          data={jobStatusData}
                          cx="50%" cy="50%"
                          innerRadius={48} outerRadius={75}
                          dataKey="value" paddingAngle={4}
                        >
                          {jobStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <ChartTooltip
                          contentStyle={{ borderRadius: 8, fontSize: 12, background: '#1e293b', border: 'none' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(v, n) => [`${v} jobs`, n]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ width: '100%' }}>
                      {jobStatusData.map((d, i) => (
                        <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25, px: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '4px', background: PIE_COLORS[i], flexShrink: 0 }} />
                            <Typography sx={{ fontSize: 13, color: T.textSub, fontWeight: 600 }}>{d.name}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: 16, fontWeight: 900, color: T.text }}>{d.value}</Typography>
                            {jobs.length > 0 && (
                              <Typography sx={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>
                                ({Math.round(d.value / jobs.length * 100)}%)
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Typography sx={{ color: T.textMuted, fontSize: 13 }}>No job data available</Typography>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ── RECRUITERS + JOBS ───────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 1.5, sm: 2 , }}>
          {/* Recruiters — full width */}
          <Grid item xs={12}>
            <Card sx={{ ...cardSx, height: '100%', width:"1250px" , ml:"10px"}}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', }}>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>
                  Recruiters <Box component="span" sx={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>({filteredRecruiters.length})</Box>
                </Typography>
                <TextField size="small" placeholder="Search recruiters…" value={searchRecruiter}
                  onChange={e => setSearchRecruiter(e.target.value)}
                  sx={{ width: { xs: '100%', sm: 220 }, ...fieldSx }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
              </Box>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 520 }}>
                  <TableHead>
                    <TableRow sx={{ background: '#f8fafc' }}>
                      {['Name','Email','Phone','Exp','Status',''].map((h,i) => (
                        <TableCell key={i} sx={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.7, py: 1.5, px: 2, borderColor: T.border, whiteSpace: 'nowrap' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecruiters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: T.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                            <PeopleIcon sx={{ color: T.primaryMid, fontSize: 22 }} />
                          </Box>
                          <Typography sx={{ color: T.textMuted, fontSize: 13, fontWeight: 600, mb: 1.5 }}>No recruiters found</Typography>
                          <Button startIcon={<AddIcon />} onClick={() => handleOpenDialog()} size="small"
                            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 12, fontWeight: 700, background: T.primaryLight, color: T.primaryMid, '&:hover': { background: '#dbeafe' } }}>
                            Add First Recruiter
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : filteredRecruiters.map(r => (
                      <TableRow key={r._id} hover sx={{ '&:hover': { background: '#fafbff' }, '& td': { borderColor: '#f1f5f9' } }}>
                        <TableCell sx={{ px: 2, py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={r.profilePicture} sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 900, bgcolor: T.primaryMid, flexShrink: 0 }}>
                              {!r.profilePicture && (r.username?.charAt(0) || r.email.charAt(0)).toUpperCase()}
                            </Avatar>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{r.username || '—'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{r.email}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap' }}>{r.phoneNumber || '—'}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>
                          <Chip label={`${r.experience || 0}y`} size="small" sx={{ fontSize: 10, fontWeight: 700, height: 20, borderRadius: '5px', background: T.infoBg, color: T.info }} />
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>
                          <Chip label={r.isActive ? 'Active' : 'Inactive'} size="small" sx={{ fontSize: 10, fontWeight: 800, height: 20, borderRadius: '5px', background: r.isActive ? T.successBg : T.dangerBg, color: r.isActive ? T.success : T.danger }} />
                        </TableCell>
                        <TableCell align="right" sx={{ px: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Resend Welcome Email">
                              <IconButton size="small" onClick={() => handleResendWelcomeEmail(r._id)} sx={{ width: 28, height: 28, borderRadius: '7px', color: T.info, '&:hover': { background: T.infoBg } }}>
                                <EmailIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog(r)} sx={{ width: 28, height: 28, borderRadius: '7px', color: T.warning, '&:hover': { background: T.warningBg } }}>
                                <EditIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDelete(r._id)} sx={{ width: 28, height: 28, borderRadius: '7px', color: T.danger, '&:hover': { background: T.dangerBg } }}>
                                <DeleteIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

  {/* Job postings — full width, 4 cards per row */}
<Grid item xs={12}>
  <Card sx={{ ...cardSx, display: "flex", flexDirection: "column", ml: "10px" }}>
    {/* Header */}
    <Box
      sx={{
        px: 2.5,
        py: 2,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
      }}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text }}>
        Job Postings
        <Box component="span" sx={{ fontSize: 12, color: T.textMuted, fontWeight: 600, ml: 0.5 }}>
          ({filteredJobs.length})
        </Box>
      </Typography>

      <TextField
        size="small"
        placeholder="Search jobs…"
        value={searchJob}
        onChange={(e) => setSearchJob(e.target.value)}
        sx={{ width: { xs: "100%", sm: 200 }, ...fieldSx }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: T.textMuted }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

    {/* Body */}
    <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 } }}>
      {filteredJobs.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography>No jobs found</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {filteredJobs.map((job) => {
            // --- DATE LOGIC START ---
            const rawTargetDate = job.jobFormId?.targetHireDate;
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to start of day for fair comparison

            const isExpired = rawTargetDate ? new Date(rawTargetDate) < today : false;
            
            // Job is only active if the original check is true AND it's not expired
            const active = isJobActive(job) && !isExpired;

            const targetDateLabel = rawTargetDate
              ? new Date(rawTargetDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Not set";
            // --- DATE LOGIC END ---

            const recruiterName = getRecruiterName(job.userId);

            return (
              <Grid item xs={12} sm={6} md={3} key={job._id} sx={{ display: "flex", flexDirection: "column" }}>
                <Card
                  sx={{
                    width: "250px",
                    ml:"15px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "14px",
                    border: `1px solid ${T.border}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    background: T.surface,
                    overflow: "hidden",
                    transition: "all 0.18s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
                      borderColor: "#cbd5e1",
                    },
                  }}
                >
                  {/* Top Stripe */}
                  <Box
                    sx={{
                      height: 4,
                      background: active 
                        ? `linear-gradient(90deg, ${T.primaryMid}, #60a5fa)`
                        : `linear-gradient(90deg, #94a3b8, #cbd5e1)`,
                    }}
                  />

                  <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Title Section */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.2, gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 13.5,
                          fontWeight: 800,
                          color: T.text,
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.2,
                          minHeight: "2.4em",
                        }}
                      >
                        {job.jobTitle}
                      </Typography>

                      <Chip
                        label={active ? "Active" : isExpired ? "Expired" : "Closed"}
                        size="small"
                        sx={{
                          fontSize: 10,
                          fontWeight: 800,
                          height: 22,
                          borderRadius: "7px",
                          background: active ? T.successBg : T.dangerBg,
                          color: active ? T.success : T.danger,
                        }}
                      />
                    </Box>

                    {/* Chips Section */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mb: 1.8, minHeight: 20 }}>
                      {job.department && (
                        <Chip
                          label={job.department}
                          size="small"
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            height: 20,
                            borderRadius: "5px",
                            background: T.primaryLight,
                            color: T.primaryMid,
                          }}
                        />
                      )}
                      <Chip
                        label={job.jobFormId?.jobType || "Full-time"}
                        size="small"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          height: 20,
                          borderRadius: "5px",
                          background: T.purpleBg,
                          color: T.purple,
                        }}
                      />
                    </Box>

                    <Box sx={{ height: "1px", background: T.border, mb: 1.5 }} />

                    {/* Info Section */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        Job ID: {job.jobName || "—"}
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        Openings: {job.jobFormId?.openings || 0}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontSize: 12, 
                          fontWeight: 700, 
                          color: isExpired ? T.danger : "inherit" 
                        }}
                      >
                        Target Hire: {targetDateLabel}
                      </Typography>
                    </Box>

                    {/* Footer */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                        pt: 1.2,
                        borderTop: `1px solid ${T.border}`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                        <Avatar
                          sx={{
                            width: 22,
                            height: 22,
                            fontSize: 10,
                            fontWeight: 900,
                            bgcolor: T.primaryMid,
                          }}
                        >
                          {recruiterName !== "Unknown" ? recruiterName.charAt(0).toUpperCase() : "?"}
                        </Avatar>

                        <Typography
                          sx={{
                            fontSize: 11.5,
                            color: T.textSub,
                            fontWeight: 600,
                            maxWidth: 100,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {recruiterName}
                        </Typography>
                      </Box>

                      <Typography sx={{ fontSize: 10.5, color: T.textMuted }}>
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  </Card>
</Grid>
        </Grid>

        {/* ════════════════════════════════════════════════════════════════════
            ADD / EDIT RECRUITER DIALOG
        ════════════════════════════════════════════════════════════════════ */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', background: T.surface, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', m: { xs: 1.5, sm: 'auto' } } }}>

          <Box sx={{ background: `linear-gradient(135deg, ${T.primaryMid} 0%, ${T.primary} 100%)`, px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -35, right: 70, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, right: 20, pointerEvents: 'none' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <PeopleIcon sx={{ color: '#fff', fontSize: 23 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                  {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>
                  {editingId ? 'Update recruiter information' : 'Register a new recruiter account'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseDialog} disabled={saving}
              sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: 34, height: 34, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {saving && <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#93c5fd' } }} />}

          <DialogContent sx={{ p: 0 }}>
            {saveSuccess ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 5, px: 4 }}>
                <Box sx={{
                  width: 84, height: 84, borderRadius: '50%',
                  background: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
                  border: `3px solid ${T.success}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
                  boxShadow: `0 8px 28px ${T.success}20`,
                  animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  '@keyframes pop': { '0%': { transform: 'scale(0.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
                }}>
                  <SuccessCircleIcon sx={{ fontSize: 48, color: T.success }} />
                </Box>
                <Typography sx={{ fontSize: 22, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>
                  Recruiter Added Successfully!
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 320 }}>
                  The recruiter account has been created and is ready to use.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left', background: `linear-gradient(135deg, ${T.primaryLight} 0%, #dbeafe 100%)`, border: `1.5px solid ${T.primaryMid}20`, borderRadius: '14px', px: 2.5, py: 2, maxWidth: 370, width: '100%', boxShadow: `0 4px 16px ${T.primaryMid}12` }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: T.primaryMid, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.primaryMid}30` }}>
                    <MailSentIcon sx={{ color: '#fff', fontSize: 21 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: T.primaryMid, mb: 0.4 }}>Login credentials sent!</Typography>
                    <Typography sx={{ fontSize: 12.5, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
                      An email with login details has been delivered to{' '}
                      <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedRecruiterEmail}</Box>
                    </Typography>
                  </Box>
                </Box>
                <Button onClick={handleCloseDialog} variant="contained"
                  sx={{ mt: 4, borderRadius: '11px', px: 5, py: 1.3, fontSize: 14, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 4px 14px ${T.primaryMid}35`, '&:hover': { background: T.primary } }}>
                  Done
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.75, p: '14px 16px', background: T.bg, borderRadius: '12px', border: `1px solid ${T.border}` }}>
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar src={profilePreview} sx={{ width: 58, height: 58, bgcolor: T.primaryMid, fontSize: 22, fontWeight: 900, boxShadow: `0 4px 14px ${T.primaryMid}28` }}>
                      {!profilePreview && <PersonIcon sx={{ fontSize: 30 }} />}
                    </Avatar>
                    {profilePreview && (
                      <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: T.success, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff' }}>
                        <SuccessCircleIcon sx={{ fontSize: 11, color: '#fff' }} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: T.text, mb: 0.5 }}>Profile Photo</Typography>
                    <Button component="label" size="small" variant="outlined" disabled={saving}
                      sx={{ borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, py: 0.55, px: 1.5, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
                      {profilePreview ? 'Change Photo' : 'Upload Photo'}
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                    {profileImage && (
                      <Typography sx={{ fontSize: 10, color: T.textMuted, mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                        {profileImage.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Username *" value={newRecruiter.username}
                      onChange={e => setNewRecruiter(p => ({ ...p, username: e.target.value }))}
                      disabled={saving} sx={fieldSx}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Email Address *" type="email" value={newRecruiter.email}
                      onChange={e => setNewRecruiter(p => ({ ...p, email: e.target.value }))}
                      disabled={saving} sx={fieldSx}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Phone Number" type="tel" value={newRecruiter.phoneNumber}
                      onChange={e => setNewRecruiter(p => ({ ...p, phoneNumber: e.target.value }))}
                      disabled={saving} sx={fieldSx}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Experience (years)" type="number" value={newRecruiter.experience}
                      onChange={e => setNewRecruiter(p => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
                      disabled={saving} sx={fieldSx} inputProps={{ min: 0, max: 50 }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><ExperienceIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, p: '11px 14px', background: T.primaryLight, borderRadius: '10px', border: `1px solid ${T.primaryMid}20` }}>
                  <MailSentIcon sx={{ fontSize: 17, color: T.primaryMid, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12, color: T.primaryMid, fontWeight: 600, lineHeight: 1.5 }}>
                    Login credentials will be automatically emailed to the recruiter after registration.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          {!saveSuccess && (
            <Box sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button onClick={handleCloseDialog} disabled={saving} variant="outlined"
                sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
                Cancel
              </Button>
              <Button onClick={handleSaveRecruiter} disabled={saving} variant="contained"
                sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 3px 10px ${T.primaryMid}35`, '&:hover': { background: T.primary }, minWidth: 152, transition: 'all 0.15s' }}>
                {saving ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <CircularProgress size={15} sx={{ color: '#fff' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Registering…</Typography>
                  </Box>
                ) : editingId ? 'Update Recruiter' : 'Add Recruiter'}
              </Button>
            </Box>
          )}
        </Dialog>

        {/* ════════════════════════════════════════════════════════════════════
            VENDOR REGISTRATION DIALOG
        ════════════════════════════════════════════════════════════════════ */}
        <Dialog
          open={openVendorDialog}
          onClose={handleCloseVendorDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', background: T.surface, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', m: { xs: 1.5, sm: 'auto' } } }}
        >
          {/* gradient header */}
          <Box sx={{ background: `linear-gradient(135deg, ${T.purple} 0%, #5b21b6 100%)`, px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -35, right: 80, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, right: 20, pointerEvents: 'none' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <BusinessIcon sx={{ color: '#fff', fontSize: 23 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Register Vendor</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>Add a new vendor to the platform</Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseVendorDialog} disabled={vendorInviteLoading}
              sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: 34, height: 34, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {vendorInviteLoading && <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#c4b5fd' } }} />}

          <DialogContent sx={{ p: 0 }}>
            {vendorInviteSuccess ? (
              /* ── SUCCESS STATE ── */
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 5, px: 4 }}>
                <Box sx={{
                  width: 84, height: 84, borderRadius: '50%',
                  background: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
                  border: `3px solid ${T.success}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
                  boxShadow: `0 8px 28px ${T.success}20`,
                  animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  '@keyframes pop': { '0%': { transform: 'scale(0.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
                }}>
                  <SuccessCircleIcon sx={{ fontSize: 48, color: T.success }} />
                </Box>

                <Typography sx={{ fontSize: 22, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>
                  Vendor Registered Successfully!
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 340 }}>
                  The vendor account has been created and is ready to use.
                </Typography>

                {/* email-sent pill */}
                <Box sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left',
                  background: `linear-gradient(135deg, ${T.purpleBg} 0%, #ede9fe 100%)`,
                  border: `1.5px solid ${T.purple}20`, borderRadius: '14px',
                  px: 2.5, py: 2, maxWidth: 400, width: '100%',
                  boxShadow: `0 4px 16px ${T.purple}12`,
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.purple}30` }}>
                    <MailSentIcon sx={{ color: '#fff', fontSize: 21 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: T.purple, mb: 0.4 }}>
                      Login credentials sent!
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
                      An email with login details has been delivered to{' '}
                      <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedVendorEmail}</Box>
                    </Typography>
                  </Box>
                </Box>

                <Button onClick={handleCloseVendorDialog} variant="contained"
                  sx={{ mt: 4, borderRadius: '11px', px: 5, py: 1.3, fontSize: 14, fontWeight: 800, textTransform: 'none', background: T.purple, boxShadow: `0 4px 14px ${T.purple}35`, '&:hover': { background: '#6d28d9' } }}>
                  Done
                </Button>
              </Box>
            ) : (
              /* ── VENDOR FORM ── */
              <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                {/* Section: Personal Info */}
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: T.purpleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PersonIcon sx={{ fontSize: 15, color: T.purple }} />
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: T.text }}>Contact Person</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="First Name *" value={vendorForm.firstName}
                        onChange={e => setVendorForm(p => ({ ...p, firstName: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Last Name *" value={vendorForm.lastName}
                        onChange={e => setVendorForm(p => ({ ...p, lastName: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Email Address *" type="email" value={vendorForm.email}
                        onChange={e => setVendorForm(p => ({ ...p, email: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Phone" type="tel" value={vendorForm.phone}
                        onChange={e => setVendorForm(p => ({ ...p, phone: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Designation" value={vendorForm.designation}
                        onChange={e => setVendorForm(p => ({ ...p, designation: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                  </Grid>
                </Box>

                {/* Divider */}
                <Box sx={{ height: '1px', background: T.border, mb: 2.5 }} />

                {/* Section: Company Info */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: T.purpleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 15, color: T.purple }} />
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: T.text }}>Company Details</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Company Name *" value={vendorForm.companyName}
                        onChange={e => setVendorForm(p => ({ ...p, companyName: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Company Email" type="email" value={vendorForm.companyEmail}
                        onChange={e => setVendorForm(p => ({ ...p, companyEmail: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Company Phone" type="tel" value={vendorForm.companyPhone}
                        onChange={e => setVendorForm(p => ({ ...p, companyPhone: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Industry Dropdown */}
                      <FormControl fullWidth size="small" sx={vendorFieldSx} disabled={vendorInviteLoading}>
                        <InputLabel>Industry *</InputLabel>
                        <Select
                          value={vendorForm.industry}
                          onChange={e => setVendorForm(p => ({ ...p, industry: e.target.value }))}
                          label="Industry *"
                          MenuProps={{ PaperProps: { sx: { maxHeight: 280, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } } }}
                        >
                          {INDUSTRIES.map(ind => (
                            <MenuItem key={ind} value={ind} sx={{ fontSize: 13 }}>{ind}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth size="small" label="Company Address" value={vendorForm.companyAddress}
                        onChange={e => setVendorForm(p => ({ ...p, companyAddress: e.target.value }))}
                        disabled={vendorInviteLoading} sx={vendorFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ fontSize: 16, color: T.textMuted }} /></InputAdornment> }} />
                    </Grid>
                  </Grid>
                </Box>

                {/* info note */}
                <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, p: '11px 14px', background: T.purpleBg, borderRadius: '10px', border: `1px solid ${T.purple}20` }}>
                  <MailSentIcon sx={{ fontSize: 17, color: T.purple, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12, color: T.purple, fontWeight: 600, lineHeight: 1.5 }}>
                    Login credentials will be automatically emailed to the vendor after registration.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          {!vendorInviteSuccess && (
            <Box sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button onClick={handleCloseVendorDialog} disabled={vendorInviteLoading} variant="outlined"
                sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, '&:hover': { borderColor: T.purple, color: T.purple, background: T.purpleBg } }}>
                Cancel
              </Button>
              <Button onClick={handleRegisterVendor} disabled={vendorInviteLoading} variant="contained"
                sx={{ borderRadius: '10px', px: 3, fontSize: 13, fontWeight: 800, textTransform: 'none', background: T.purple, boxShadow: `0 3px 10px ${T.purple}35`, '&:hover': { background: '#6d28d9' }, minWidth: 160, transition: 'all 0.15s' }}>
                {vendorInviteLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <CircularProgress size={15} sx={{ color: '#fff' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Registering…</Typography>
                  </Box>
                ) : 'Register Vendor'}
              </Button>
            </Box>
          )}
        </Dialog>

        {/* ── SNACKBAR ──────────────────────────────────────────────────────── */}
        <Snackbar open={snackbar.open} autoHideDuration={5000}
          onClose={() => setSnackbar(p => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))}
            sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', fontWeight: 600, fontSize: 13 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;