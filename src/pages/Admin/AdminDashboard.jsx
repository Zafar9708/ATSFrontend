// import React, { useEffect, useState } from 'react';
// import { Link } from "react-router-dom";
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
//   Business as BusinessIcon, LocationOn as LocationIcon,
//   Badge as BadgeIcon,
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

// const INDUSTRIES = [
//   'Information Technology', 'Healthcare', 'Finance', 'Education',
//   'Retail', 'Manufacturing', 'Construction', 'Telecommunications',
//   'Transportation and Logistics', 'Marketing and Advertising',
//   'Legal Services', 'Human Resources / Staffing', 'Real Estate',
//   'Media and Entertainment', 'Government', 'Non-Profit',
//   'Energy and Utilities', 'Hospitality', 'Agriculture',
//   'Aerospace and Defense', 'E-commerce', 'Pharmaceuticals',
//   'Automotive', 'Insurance', 'Consulting', 'Other',
// ];

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
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
//   const [vendorInviteLoading,   setVendorInviteLoading]   = useState(false);
//   const [vendorInviteSuccess,   setVendorInviteSuccess]   = useState(false);
//   const [savedVendorEmail,      setSavedVendorEmail]      = useState('');
//   const [snackbar,              setSnackbar]              = useState({ open: false, message: '', severity: 'success' });
//   const [sidebarOpen,           setSidebarOpen]           = useState(true); // Assuming you have sidebar state management

//   const [vendorForm, setVendorForm] = useState({
//     firstName: '', lastName: '', email: '', phone: '',
//     designation: '', companyName: '', companyEmail: '',
//     companyPhone: '', companyAddress: '', industry: '',
//   });

//   const [newRecruiter, setNewRecruiter] = useState({
//     email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null,
//   });

//   /* ── responsive helper ───────────────────────────────────────────────── */
//   const getResponsiveValue = (mobile, tablet, laptop, desktop) => {
//     if (isMobile) return mobile;
//     if (isTablet) return tablet;
//     // For laptop and desktop, check if sidebar is open to adjust
//     if (sidebarOpen) {
//       return laptop; // When sidebar is open, use laptop values
//     }
//     return desktop; // When sidebar is closed, use desktop values
//   };

//   // Calculate main content width based on sidebar state
//   const getMainContentWidth = () => {
//     if (isMobile) return '100%';
//     if (isTablet) return '100%';
//     return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)'; // Adjust based on your sidebar widths
//   };

//   // Calculate grid column spans based on screen size
//   const getGridColumns = (defaultCols = 12) => {
//     if (isMobile) return 12;
//     if (isTablet) return 6;
//     return defaultCols;
//   };

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
//   const todayStr = (() => {
//     const d = new Date();
//     const yyyy = d.getFullYear();
//     const mm   = String(d.getMonth() + 1).padStart(2, '0');
//     const dd   = String(d.getDate()).padStart(2, '0');
//     return `${yyyy}-${mm}-${dd}`;
//   })();

//   const toDateStr = (val) => {
//     if (!val) return null;
//     const s = String(val).slice(0, 10);
//     return s.length === 10 ? s : null;
//   };

//   const activeJobs = jobs.filter(j => {
//     const ds = toDateStr(j.jobFormId?.targetHireDate);
//     if (!ds) return true;
//     return ds >= todayStr;
//   });

//   const closedJobs = jobs.filter(j => {
//     const ds = toDateStr(j.jobFormId?.targetHireDate);
//     if (!ds) return false;
//     return ds < todayStr;
//   });

//   const avgJobsPerRec = recruiters.length ? (jobs.length / recruiters.length).toFixed(1) : 0;
//   const jobStatusData = [
//     { name: 'Active', value: activeJobs.length },
//     { name: 'Closed', value: closedJobs.length },
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
//     const n = new Date();
//     if (timeFilter === 'weekly')  return { s: new Date(n - 7*86400000), e: n };
//     if (timeFilter === 'monthly') return { s: new Date(n.getFullYear(), n.getMonth()-1, n.getDate()), e: n };
//     if (timeFilter === 'yearly')  return { s: new Date(n.getFullYear()-1, n.getMonth(), n.getDate()), e: n };
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
//     return r ? r.username || r.email : 'Admin';
//   };

//   const isJobActive = (job) => {
//     const ds = toDateStr(job.jobFormId?.targetHireDate);
//     if (!ds) return true;
//     return ds >= todayStr;
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
//   const handleOpenVendorDialog = () => {
//     setVendorForm({
//       firstName: '', lastName: '', email: '', phone: '',
//       designation: '', companyName: '', companyEmail: '',
//       companyPhone: '', companyAddress: '', industry: '',
//     });
//     setVendorInviteSuccess(false);
//     setSavedVendorEmail('');
//     setOpenVendorDialog(true);
//   };

//   const handleCloseVendorDialog = () => {
//     if (vendorInviteLoading) return;
//     setOpenVendorDialog(false);
//     setTimeout(() => {
//       setVendorInviteSuccess(false);
//       setSavedVendorEmail('');
//     }, 250);
//   };

//   const handleRegisterVendor = async () => {
//     if (!vendorForm.firstName.trim()) { showSnackbar('First name is required', 'warning'); return; }
//     if (!vendorForm.lastName.trim())  { showSnackbar('Last name is required', 'warning'); return; }
//     if (!vendorForm.email.trim())     { showSnackbar('Email is required', 'warning'); return; }
//     if (!vendorForm.companyName.trim()) { showSnackbar('Company name is required', 'warning'); return; }
//     if (!vendorForm.industry)         { showSnackbar('Industry is required', 'warning'); return; }

//     setVendorInviteLoading(true);
//     try {
//       await inviteVendor(vendorForm);
//       setSavedVendorEmail(vendorForm.email);
//       setVendorInviteSuccess(true);
//       showSnackbar('Vendor registered successfully!', 'success');
//     } catch (err) {
//       showSnackbar(err.message || err.response?.data?.message || 'Error registering vendor', 'error');
//     } finally {
//       setVendorInviteLoading(false);
//     }
//   };

//   /* ── shared sx ────────────────────────────────────────────────────────── */
//   const cardSx = {
//     borderRadius: '16px', border: `1px solid ${T.border}`,
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: T.surface, overflow: 'hidden',
//   };

//   const fieldSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '10px', fontSize: { xs: 12, sm: 13, md: 13 },
//       background: T.bg,
//       '& fieldset': { borderColor: T.border },
//       '&:hover fieldset': { borderColor: '#94a3b8' },
//       '&.Mui-focused fieldset': { borderColor: T.primaryMid, borderWidth: 2 },
//     },
//     '& .MuiInputLabel-root': { fontSize: { xs: 12, sm: 13, md: 13 } },
//   };

//   const vendorFieldSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '10px', fontSize: { xs: 12, sm: 13, md: 13 },
//       background: T.bg,
//       '& fieldset': { borderColor: T.border },
//       '&:hover fieldset': { borderColor: '#94a3b8' },
//       '&.Mui-focused fieldset': { borderColor: T.purple, borderWidth: 2 },
//     },
//     '& .MuiInputLabel-root': { fontSize: { xs: 12, sm: 13, md: 13 } },
//     '& .MuiInputLabel-root.Mui-focused': { color: T.purple },
//   };

//   /* ── loading ──────────────────────────────────────────────────────────── */
//   if (loading && !refreshing) return (
//     <Box sx={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       justifyContent: 'center', 
//       minHeight: '100vh',
//       width: getMainContentWidth(),
//       ml: { xs: 0, sm: 0, md: sidebarOpen ? '240px' : '65px' },
//       transition: 'margin-left 0.3s ease',
//       gap: 2 
//     }}>
//       <Box sx={{ position: 'relative', width: { xs: 48, sm: 56, md: 64 }, height: { xs: 48, sm: 56, md: 64 } }}>
//         <CircularProgress size={isMobile ? 48 : isTablet ? 56 : 64} thickness={2} sx={{ color: T.primaryLight, position: 'absolute' }} variant="determinate" value={100} />
//         <CircularProgress size={isMobile ? 48 : isTablet ? 56 : 64} thickness={2} sx={{ color: T.primaryMid, position: 'absolute', animationDuration: '900ms' }} />
//         <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <DashboardIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: T.primaryMid }} />
//         </Box>
//       </Box>
//       <Typography sx={{ color: T.textSub, fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 700 }}>Loading Dashboard…</Typography>
//     </Box>
//   );

//   /* ════════════════════════════════════════════════════════════════════════
//      RENDER
//   ════════════════════════════════════════════════════════════════════════ */
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{
//         width: getMainContentWidth(),
//         minHeight: '100vh',
        
//         p: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
//         ml: { xs: 0, sm: 0, md: sidebarOpen ? '200px' : '65px' },
//         transition: 'margin-left 0.3s ease, width 0.3s ease',
//         overflowX: 'hidden',
//         mt: { xs: 7, sm: 8, md: 9 }, // Adjust based on your header height
//       }}>

//         {/* ── HEADER ──────────────────────────────────────────────────────── */}
//         <Box sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', sm: 'column', md: 'row' },
//           justifyContent: 'space-between',
//           alignItems: { xs: 'stretch', sm: 'stretch', md: 'flex-start' },
//           mb: { xs: 2, sm: 2.5, md: 3 },
//           gap: { xs: 1.5, sm: 2, md: 2 },
//         }}>
//           <Box sx={{ width: '100%' }}>
//             <Typography sx={{
//               fontSize: { xs: 18, sm: 20, md: 22, lg: 24 },
//               fontWeight: 900,
//               color: T.text,
//               letterSpacing: '-0.5px',
//               lineHeight: 1.2,
//             }}>
//               Admin Dashboard
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
//               <DashboardIcon sx={{ fontSize: { xs: 11, sm: 12, md: 13 }, color: T.textMuted }} />
//               <Typography sx={{
//                 fontSize: { xs: 11, sm: 12, md: 12 },
//                 color: T.textMuted,
//                 fontWeight: 500
//               }}>
//                 Manage recruiters and job postings
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: { xs: 1, sm: 1, md: 1 },
//             flexWrap: 'wrap',
//             width: { xs: '100%', sm: '100%', md: 'auto' },
//             justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-end' },
//           }}>
//             <FormControl size="small" sx={{
//               minWidth: { xs: 100, sm: 120, md: 120 },
//               flex: { xs: 1, sm: 1, md: 0 },
//             }}>
//               <InputLabel sx={{ fontSize: { xs: 11, sm: 12, md: 12 } }}>Time Filter</InputLabel>
//               <Select
//                 value={timeFilter}
//                 onChange={e => setTimeFilter(e.target.value)}
//                 label="Time Filter"
//                 sx={{
//                   borderRadius: '9px',
//                   fontSize: { xs: 11, sm: 12, md: 12 },
//                   background: T.surface,
//                   '& fieldset': { borderColor: T.border }
//                 }}
//               >
//                 <MenuItem value="all" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>All Time</MenuItem>
//                 <MenuItem value="weekly" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Weekly</MenuItem>
//                 <MenuItem value="monthly" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Monthly</MenuItem>
//                 <MenuItem value="yearly" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Yearly</MenuItem>
//                 <MenuItem value="custom" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Custom</MenuItem>
//               </Select>
//             </FormControl>

//             {timeFilter === 'custom' && (
//               <Box sx={{
//                 display: 'flex',
//                 gap: 1,
//                 alignItems: 'center',
//                 flexDirection: { xs: 'row', sm: 'row', md: 'row' },
//                 width: { xs: '100%', sm: 'auto', md: 'auto' },
//               }}>
//                 <DatePicker
//                   label="Start"
//                   value={startDate}
//                   onChange={setStartDate}
//                   renderInput={p => <TextField {...p} size="small" sx={{
//                     width: { xs: '100%', sm: 120, md: 130 },
//                     ...fieldSx
//                   }} />}
//                 />
//                 <Typography sx={{ color: T.textMuted, display: { xs: 'none', sm: 'block', md: 'block' } }}>–</Typography>
//                 <DatePicker
//                   label="End"
//                   value={endDate}
//                   onChange={setEndDate}
//                   renderInput={p => <TextField {...p} size="small" sx={{
//                     width: { xs: '100%', sm: 120, md: 130 },
//                     ...fieldSx
//                   }} />}
//                 />
//               </Box>
//             )}

//             <Tooltip title="Refresh">
//               <IconButton
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 size="small"
//                 sx={{
//                   width: { xs: 32, sm: 34, md: 36 },
//                   height: { xs: 32, sm: 34, md: 36 },
//                   background: T.surface,
//                   border: `1px solid ${T.border}`,
//                   borderRadius: '9px',
//                   '&:hover': { background: T.primaryLight, borderColor: T.primaryMid }
//                 }}
//               >
//                 <RefreshIcon sx={{
//                   fontSize: { xs: 15, sm: 16, md: 17 },
//                   color: refreshing ? T.textMuted : T.primaryMid
//                 }} />
//               </IconButton>
//             </Tooltip>

//             <Box sx={{
//               display: 'flex',
//               gap: 1,
//               width: { xs: '100%', sm: '100%', md: 'auto' },
//               justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-end' },
//             }}>
//               {[
//                 {
//                   label: { xs: 'Add', sm: 'Recruiter', md: 'Add Recruiter' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//                   icon: <AddIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />,
//                   onClick: () => handleOpenDialog(),
//                   bg: T.primaryMid,
//                   hbg: T.primary,
//                   color: '#fff',
//                 },
//                 {
//                   label: { xs: 'Add', sm: 'Vendor', md: 'Add Vendor' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//                   icon: <EmailIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />,
//                   onClick: handleOpenVendorDialog,
//                   bg: T.purple,
//                   hbg: '#6d28d9',
//                   color: '#fff',
//                 },
//                 {
//                   label: { xs: 'Job', sm: 'Create', md: 'Create Job' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//                   icon: <WorkIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />,
//                   onClick: () => navigate('/dashboard/jobs/createJob'),
//                   bg: T.surface,
//                   hbg: T.bg,
//                   color: T.textSub,
//                   border: `1px solid ${T.border}`,
//                 },
//               ].map((btn, i) => (
//                 <Button
//                   key={i}
//                   startIcon={btn.icon}
//                   onClick={btn.onClick}
//                   sx={{
//                     flex: { xs: 1, sm: 1, md: 0 },
//                     background: btn.bg,
//                     color: btn.color,
//                     border: btn.border || 'none',
//                     borderRadius: '9px',
//                     px: { xs: 1, sm: 1.5, md: 2 },
//                     py: { xs: '6px', sm: '7px', md: '8px' },
//                     fontSize: { xs: 10, sm: 11, md: 13 },
//                     fontWeight: 700,
//                     textTransform: 'none',
//                     whiteSpace: 'nowrap',
//                     minWidth: 'auto',
//                     boxShadow: btn.border ? 'none' : '0 2px 8px rgba(0,0,0,0.14)',
//                     '&:hover': { background: btn.hbg, transform: 'translateY(-1px)' },
//                     transition: 'all 0.15s',
//                   }}
//                 >
//                   {btn.label}
//                 </Button>
//               ))}
//             </Box>
//           </Box>
//         </Box>

//         {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
//         <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ mb: { xs: 2, sm: 2.5, md: 2.5,} }}>
//           {[
//             {
//               label: { xs: 'Recruiters', sm: 'Total Recruiters', md: 'Total Recruiters' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//               value: recruiters.length,
//               sub: `+${Math.floor(recruiters.length * 0.12)} from last month`,
//               icon: <PeopleIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />,
//               color: T.primaryMid,
//               bg: T.primaryLight,
            
//             },
//             {
//               label: { xs: 'Jobs', sm: 'Total Jobs', md: 'Total Jobs' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//               value: jobs.length,
//               sub: `${Math.floor(jobs.length * 0.3)} new this month`,
//               icon: <WorkIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />,
//               color: T.success,
//               bg: T.successBg
//             },
//             {
//               label: { xs: 'Active', sm: 'Active Jobs', md: 'Active Jobs' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//               value: activeJobs.length,
//               sub: `${jobs.length > 0 ? Math.round(activeJobs.length / jobs.length * 100) : 0}% of total`,
//               icon: <ActiveIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />,
//               color: T.info,
//               bg: T.infoBg
//             },
//             {
//               label: { xs: 'Avg/Rec', sm: 'Avg Jobs/Rec', md: 'Avg Jobs/Recruiter' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
//               value: avgJobsPerRec,
//               sub: 'Across all recruiters',
//               icon: <BarChartIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />,
//               color: T.warning,
//               bg: T.warningBg
//             },
//           ].map((s, i) => (
//             <Grid item xs={6} md={3} key={i}>
//               <StatCard {...s} />
//             </Grid>
//           ))}
//         </Grid>

//         {/* ── RECRUITERS + JOBS ───────────────────────────────────────────── */}
//    {/*      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2 }}> */}
//           {/* Recruiters Table */}
//         {/*   <Grid item xs={12}>
//             <Card sx={{
//               ...cardSx,
//               height: '100%',
//               width: '1200px',
//               overflow: 'hidden',
//             }}>
//               <Box sx={{
//                 px: { xs: 1.5, sm: 2, md: 2.5 },
//                 py: { xs: 1.5, sm: 1.75, md: 2 },
//                 borderBottom: `1px solid ${T.border}`,
//                 display: 'flex',
//                 flexDirection: { xs: 'column', sm: 'row', md: 'row' },
//                 justifyContent: 'space-between',
//                 alignItems: { xs: 'stretch', sm: 'center', md: 'center' },
//                 gap: { xs: 1, sm: 1.5, md: 1.5 },
//               }}>
//                 <Typography sx={{ fontSize: { xs: 13, sm: 14, md: 15 }, fontWeight: 800, color: T.text }}>
//                   Recruiters
//                   <Box component="span" sx={{
//                     fontSize: { xs: 10, sm: 11, md: 12 },
//                     color: T.textMuted,
//                     fontWeight: 600,
//                     ml: 0.5
//                   }}>
//                     ({filteredRecruiters.length})
//                   </Box>
//                 </Typography>
//                 <TextField
//                   size="small"
//                   placeholder={isMobile ? "Search…" : isTablet ? "Search recruiters…" : "Search recruiters…"}
//                   value={searchRecruiter}
//                   onChange={e => setSearchRecruiter(e.target.value)}
//                   sx={{
//                     width: { xs: '100%', sm: 200, md: 220 },
//                     ...fieldSx
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: T.textMuted }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>
//               <TableContainer sx={{
//                 overflowX: 'auto',
//                 maxHeight: { xs: 400, sm: 450, md: 500 },
//               }}>
//                 <Table sx={{ minWidth: { xs: 480, sm: 500, md: 520 } }}>
//                   <TableHead>
//                     <TableRow sx={{ background: '#f8fafc' }}>
//                       {['Name', 'Email', 'Phone', 'Exp', 'Status', ''].map((h, i) => (
//                         <TableCell
//                           key={i}
//                           sx={{
//                             fontSize: { xs: 9, sm: 10, md: 10 },
//                             fontWeight: 800,
//                             color: T.textMuted,
//                             textTransform: 'uppercase',
//                             letterSpacing: 0.7,
//                             py: { xs: 1, sm: 1.25, md: 1.5 },
//                             px: { xs: 1, sm: 1.5, md: 2 },
//                             borderColor: T.border,
//                             whiteSpace: 'nowrap',
//                           }}
//                         >
//                           {h}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredRecruiters.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
//                           <Box sx={{
//                             width: { xs: 36, sm: 40, md: 44 },
//                             height: { xs: 36, sm: 40, md: 44 },
//                             borderRadius: '12px',
//                             background: T.primaryLight,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             mx: 'auto',
//                             mb: { xs: 1, sm: 1.25, md: 1.5 },
//                           }}>
//                             <PeopleIcon sx={{ color: T.primaryMid, fontSize: { xs: 18, sm: 20, md: 22 } }} />
//                           </Box>
//                           <Typography sx={{
//                             color: T.textMuted,
//                             fontSize: { xs: 12, sm: 13, md: 13 },
//                             fontWeight: 600,
//                             mb: { xs: 1, sm: 1.25, md: 1.5 }
//                           }}>
//                             No recruiters found
//                           </Typography>
//                           <Button
//                             startIcon={<AddIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />}
//                             onClick={() => handleOpenDialog()}
//                             size="small"
//                             sx={{
//                               borderRadius: '8px',
//                               textTransform: 'none',
//                               fontSize: { xs: 11, sm: 12, md: 12 },
//                               fontWeight: 700,
//                               background: T.primaryLight,
//                               color: T.primaryMid,
//                               '&:hover': { background: '#dbeafe' },
//                             }}
//                           >
//                             Add First Recruiter
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredRecruiters.map(r => (
//                         <TableRow
//                           key={r._id}
//                           hover
//                           sx={{ '&:hover': { background: '#fafbff' }, '& td': { borderColor: '#f1f5f9' } }}
//                         >
//                           <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 }, py: { xs: 1, sm: 1.25, md: 1.5 } }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.25, md: 1.5 } }}>
//                               <Avatar
//                                 src={r.profilePicture}
//                                 sx={{
//                                   width: { xs: 28, sm: 30, md: 34 },
//                                   height: { xs: 28, sm: 30, md: 34 },
//                                   fontSize: { xs: 10, sm: 11, md: 12 },
//                                   fontWeight: 900,
//                                   bgcolor: T.primaryMid,
//                                   flexShrink: 0,
//                                 }}
//                               >
//                                 {!r.profilePicture && (r.username?.charAt(0) || r.email.charAt(0)).toUpperCase()}
//                               </Avatar>
//                               <Typography sx={{
//                                 fontSize: { xs: 12, sm: 13, md: 13 },
//                                 fontWeight: 700,
//                                 color: T.text,
//                                 whiteSpace: 'nowrap',
//                               }}>
//                                 {r.username || '—'}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
//                             <Typography sx={{
//                               fontSize: { xs: 11, sm: 12, md: 12 },
//                               color: T.textSub,
//                               whiteSpace: 'nowrap',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               maxWidth: { xs: 90, sm: 110, md: 130 },
//                             }}>
//                               {r.email}
//                             </Typography>
//                           </TableCell>
//                           <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
//                             <Typography sx={{
//                               fontSize: { xs: 11, sm: 12, md: 12 },
//                               color: T.textSub,
//                               whiteSpace: 'nowrap',
//                             }}>
//                               {r.phoneNumber || '—'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
//                             <Chip
//                               label={`${r.experience || 0}y`}
//                               size="small"
//                               sx={{
//                                 fontSize: { xs: 9, sm: 10, md: 10 },
//                                 fontWeight: 700,
//                                 height: { xs: 18, sm: 19, md: 20 },
//                                 borderRadius: '5px',
//                                 background: T.infoBg,
//                                 color: T.info,
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
//                             <Chip
//                               label={r.isActive ? 'Active' : 'Inactive'}
//                               size="small"
//                               sx={{
//                                 fontSize: { xs: 9, sm: 10, md: 10 },
//                                 fontWeight: 800,
//                                 height: { xs: 18, sm: 19, md: 20 },
//                                 borderRadius: '5px',
//                                 background: r.isActive ? T.successBg : T.dangerBg,
//                                 color: r.isActive ? T.success : T.danger,
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell align="right" sx={{ px: { xs: 1, sm: 1.25, md: 1.5 } }}>
//                             <Box sx={{
//                               display: 'flex',
//                               gap: { xs: 0.25, sm: 0.5, md: 0.5 },
//                               justifyContent: 'flex-end',
//                             }}>
//                               <Tooltip title="Resend Welcome Email">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => handleResendWelcomeEmail(r._id)}
//                                   sx={{
//                                     width: { xs: 24, sm: 26, md: 28 },
//                                     height: { xs: 24, sm: 26, md: 28 },
//                                     borderRadius: '7px',
//                                     color: T.info,
//                                     '&:hover': { background: T.infoBg },
//                                   }}
//                                 >
//                                   <EmailIcon sx={{ fontSize: { xs: 13, sm: 14, md: 15 } }} />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Edit">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => handleOpenDialog(r)}
//                                   sx={{
//                                     width: { xs: 24, sm: 26, md: 28 },
//                                     height: { xs: 24, sm: 26, md: 28 },
//                                     borderRadius: '7px',
//                                     color: T.warning,
//                                     '&:hover': { background: T.warningBg },
//                                   }}
//                                 >
//                                   <EditIcon sx={{ fontSize: { xs: 13, sm: 14, md: 15 } }} />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => handleDelete(r._id)}
//                                   sx={{
//                                     width: { xs: 24, sm: 26, md: 28 },
//                                     height: { xs: 24, sm: 26, md: 28 },
//                                     borderRadius: '7px',
//                                     color: T.danger,
//                                     '&:hover': { background: T.dangerBg },
//                                   }}
//                                 >
//                                   <DeleteIcon sx={{ fontSize: { xs: 13, sm: 14, md: 15 } }} />
//                                 </IconButton>
//                               </Tooltip>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Card>
//           </Grid> */}

//           {/* Job postings - responsive cards grid */}
//           <Grid item xs={12}>
//             <Card sx={{
//               ...cardSx,
//               display: "flex",
//               flexDirection: "column",
//               width: '1200px',
            
//             }}>
//               <Box sx={{
//                 px: { xs: 1.5, sm: 2, md: 2.5 },
//                 py: { xs: 1.5, sm: 1.75, md: 2 },
//                 borderBottom: `1px solid ${T.border}`,
//                 display: "flex",
//                 flexDirection: { xs: 'column', sm: 'row', md: 'row' },
//                 justifyContent: "space-between",
//                 alignItems: { xs: 'stretch', sm: 'center', md: 'center' },
//                 gap: { xs: 1, sm: 1.5, md: 1.5 },
//                 mt:"10px"
//               }}>
//                 <Typography sx={{ fontSize: { xs: 13, sm: 14, md: 15 }, fontWeight: 800, color: T.text }}>
//                   Job Postings
//                   <Box component="span" sx={{
//                     fontSize: { xs: 10, sm: 11, md: 12 },
//                     color: T.textMuted,
//                     fontWeight: 600,
//                     ml: 0.5
//                   }}>
//                     ({filteredJobs.length})
//                   </Box>
//                 </Typography>

//                 <TextField
//                   size="small"
//                   placeholder={isMobile ? "Search…" : isTablet ? "Search jobs…" : "Search jobs…"}
//                   value={searchJob}
//                   onChange={(e) => setSearchJob(e.target.value)}
//                   sx={{
//                     width: { xs: '100%', sm: 180, md: 200 },
//                     ...fieldSx
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: T.textMuted }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>

//               <Box sx={{
//                 flex: 1,
//                 p: { xs: 1, sm: 1.25, md: 2 },
//               }}>
//                 {filteredJobs.length === 0 ? (
//                   <Box sx={{ textAlign: "center", py: { xs: 4, sm: 5, md: 6 } }}>
//                     <Typography sx={{ fontSize: { xs: 13, sm: 14, md: 14 }, color: T.textMuted }}>
//                       No jobs found
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Grid
//                     container
//                     spacing={{ xs: 1.5, sm: 2, md: 3 }}
//                     alignItems="stretch"
//                   >
//                     {filteredJobs.map((job) => {
//                       const rawTargetDate = job.jobFormId?.targetHireDate;
//                       const today = new Date();
//                       today.setHours(0, 0, 0, 0);

//                       const isExpired = rawTargetDate ? new Date(rawTargetDate) < today : false;
//                       const active = isJobActive(job) && !isExpired;

//                       const targetDateLabel = rawTargetDate
//                         ? new Date(rawTargetDate).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })
//                         : "Not set";

//                       const recruiterName = getRecruiterName(job.userId);

//                       return (
//                         <Grid
//                           item
//                           xs={12}
//                           sm={6}
//                           md={4}
//                           lg={sidebarOpen ? 3 : 4}
//                           xl={sidebarOpen ? 3 : 4}
//                           key={job._id}
//                           sx={{ display: "flex", flexDirection: "column" }}
//                         >
//                           <Card
//                             sx={{
//                               width: '100%',
//                               display: "flex",
//                               flexDirection: "column",
//                               borderRadius: "14px",
//                               border: `1px solid ${T.border}`,
//                               boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                               background: T.surface,
//                               overflow: "hidden",
//                               transition: "all 0.18s",
//                               height: '100%',
//                               "&:hover": {
//                                 transform: "translateY(-3px)",
//                                 boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
//                                 borderColor: "#cbd5e1",
//                               },
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 height: 4,
//                                 background: active
//                                   ? `linear-gradient(90deg, ${T.primaryMid}, #60a5fa)`
//                                   : `linear-gradient(90deg, #94a3b8, #cbd5e1)`,
//                               }}
//                             />

//                             <Box sx={{
//                               p: { xs: 1.5, sm: 1.75, md: 2 },
//                               display: "flex",
//                               flexDirection: "column",
//                               flex: 1,
//                             }}>
//                               <Box sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "flex-start",
//                                 mb: { xs: 1, sm: 1.1, md: 1.2 },
//                                 gap: 1,
//                               }}>
//                                 <Typography
//                                   sx={{
//                                     fontSize: { xs: 12, sm: 13, md: 13.5 },
//                                     fontWeight: 800,
//                                     color: T.text,
//                                     flex: 1,
//                                     display: "-webkit-box",
//                                     WebkitLineClamp: 2,
//                                     WebkitBoxOrient: "vertical",
//                                     overflow: "hidden",
//                                     lineHeight: 1.2,
//                                     minHeight: "2.4em",
//                                   }}
//                                 >
//                                   {job.jobTitle}
//                                 </Typography>

//                                 <Chip
//                                   label={active ? "Active" : isExpired ? "Expired" : "Closed"}
//                                   size="small"
//                                   sx={{
//                                     fontSize: { xs: 9, sm: 10, md: 10 },
//                                     fontWeight: 800,
//                                     height: { xs: 20, sm: 21, md: 22 },
//                                     borderRadius: "7px",
//                                     background: active ? T.successBg : T.dangerBg,
//                                     color: active ? T.success : T.danger,
//                                     flexShrink: 0,
//                                   }}
//                                 />
//                               </Box>

//                               <Box sx={{
//                                 display: "flex",
//                                 flexWrap: "wrap",
//                                 gap: { xs: 0.5, sm: 0.6, md: 0.7 },
//                                 mb: { xs: 1.5, sm: 1.6, md: 1.8 },
//                                 minHeight: { xs: 18, sm: 19, md: 20 },
//                               }}>
//                                 {job.department && (
//                                   <Chip
//                                     label={job.department}
//                                     size="small"
//                                     sx={{
//                                       fontSize: { xs: 9, sm: 10, md: 10 },
//                                       fontWeight: 700,
//                                       height: { xs: 18, sm: 19, md: 20 },
//                                       borderRadius: "5px",
//                                       background: T.primaryLight,
//                                       color: T.primaryMid,
//                                     }}
//                                   />
//                                 )}
//                                 <Chip
//                                   label={job.jobFormId?.jobType || "Full-time"}
//                                   size="small"
//                                   sx={{
//                                     fontSize: { xs: 9, sm: 10, md: 10 },
//                                     fontWeight: 700,
//                                     height: { xs: 18, sm: 19, md: 20 },
//                                     borderRadius: "5px",
//                                     background: T.purpleBg,
//                                     color: T.purple,
//                                   }}
//                                 />
//                               </Box>

//                               <Box sx={{ height: "1px", background: T.border, mb: { xs: 1.25, sm: 1.4, md: 1.5 } }} />

//                               <Box sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 gap: { xs: 0.75, sm: 0.9, md: 1 },
//                                 flexGrow: 1,
//                               }}>
//                                 <Typography sx={{
//                                   fontSize: { xs: 11, sm: 12, md: 12 },
//                                   fontWeight: 700,
//                                 }}>
//                                   Job ID: {job.jobName || "—"}
//                                 </Typography>
//                                 <Typography sx={{
//                                   fontSize: { xs: 11, sm: 12, md: 12 },
//                                   fontWeight: 700,
//                                 }}>
//                                   Openings: {job.jobFormId?.openings || 0}
//                                 </Typography>
//                                 <Typography
//                                   sx={{
//                                     fontSize: { xs: 11, sm: 12, md: 12 },
//                                     fontWeight: 700,
//                                     color: isExpired ? T.danger : "inherit"
//                                   }}
//                                 >
//                                   Target Hire: {targetDateLabel}
//                                 </Typography>
//                               </Box>

//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                   mt: { xs: 1.5, sm: 1.75, md: 2 },
//                                   pt: { xs: 1, sm: 1.1, md: 1.2 },
//                                   borderTop: `1px solid ${T.border}`,
//                                 }}
//                               >
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.6, md: 0.7 } }}>
//                                   <Avatar
//                                     sx={{
//                                       width: { xs: 18, sm: 20, md: 22 },
//                                       height: { xs: 18, sm: 20, md: 22 },
//                                       fontSize: { xs: 9, sm: 10, md: 10 },
//                                       fontWeight: 900,
//                                       bgcolor: T.primaryMid,
//                                     }}
//                                   >
//                                     {recruiterName !== "Unknown" ? recruiterName.charAt(0).toUpperCase() : "?"}
//                                   </Avatar>

//                                   <Typography
//                                     sx={{
//                                       fontSize: { xs: 10, sm: 11, md: 11.5 },
//                                       color: T.textSub,
//                                       fontWeight: 600,
//                                       maxWidth: { xs: 80, sm: 90, md: 100 },
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                   >
//                                     {recruiterName}
//                                   </Typography>
//                                 </Box>

//                                 <Typography sx={{
//                                   fontSize: { xs: 9, sm: 10, md: 10.5 },
//                                   color: T.textMuted,
//                                 }}>
//                                   {new Date(job.createdAt).toLocaleDateString("en-US", {
//                                     month: "short",
//                                     day: "numeric",
//                                     year: "numeric",
//                                   })}
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
//  <div className="text-right mr-5 mb-3">
//   <Link
//     to="/jobs"
//     className="text-blue-600 font-semibold px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
//   >
//     View All Jobs →
//   </Link>
// </div>
//             </Card>
          
//           </Grid>
//        {/*  </Grid> */}

//         {/* ════════════════════════════════════════════════════════════════════
//             ADD / EDIT RECRUITER DIALOG (unchanged)
//         ════════════════════════════════════════════════════════════════════ */}
//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           maxWidth="sm"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: '20px',
//               overflow: 'hidden',
//               background: T.surface,
//               boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
//               m: { xs: 1.5, sm: 'auto' },
//               width: { xs: 'calc(100% - 32px)', sm: '100%' },
//             }
//           }}
//         >
//           <Box sx={{ background: `linear-gradient(135deg, ${T.primaryMid} 0%, ${T.primary} 100%)`, px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
//             <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -35, right: 70, pointerEvents: 'none' }} />
//             <Box sx={{ position: 'absolute', width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, right: 20, pointerEvents: 'none' }} />
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
//               <Box sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
//                 <PeopleIcon sx={{ color: '#fff', fontSize: { xs: 20, sm: 23 } }} />
//               </Box>
//               <Box>
//                 <Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
//                   {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>
//                   {editingId ? 'Update recruiter information' : 'Register a new recruiter account'}
//                 </Typography>
//               </Box>
//             </Box>
//             <IconButton onClick={handleCloseDialog} disabled={saving}
//               sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: { xs: 30, sm: 34 }, height: { xs: 30, sm: 34 }, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
//               <CloseIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
//             </IconButton>
//           </Box>

//           {saving && <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#93c5fd' } }} />}

//           <DialogContent sx={{ p: 0 }}>
//             {saveSuccess ? (
//               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 4 } }}>
//                 <Box sx={{
//                   width: { xs: 64, sm: 84 }, height: { xs: 64, sm: 84 }, borderRadius: '50%',
//                   background: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
//                   border: `3px solid ${T.success}25`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
//                   boxShadow: `0 8px 28px ${T.success}20`,
//                   animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)',
//                   '@keyframes pop': { '0%': { transform: 'scale(0.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
//                 }}>
//                   <SuccessCircleIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: T.success }} />
//                 </Box>
//                 <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>
//                   Recruiter Added Successfully!
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 320 }}>
//                   The recruiter account has been created and is ready to use.
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left', background: `linear-gradient(135deg, ${T.primaryLight} 0%, #dbeafe 100%)`, border: `1.5px solid ${T.primaryMid}20`, borderRadius: '14px', px: { xs: 1.5, sm: 2.5 }, py: { xs: 1.5, sm: 2 }, maxWidth: 370, width: '100%', boxShadow: `0 4px 16px ${T.primaryMid}12` }}>
//                   <Box sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, borderRadius: '11px', background: T.primaryMid, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.primaryMid}30` }}>
//                     <MailSentIcon sx={{ color: '#fff', fontSize: { xs: 18, sm: 21 } }} />
//                   </Box>
//                   <Box>
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, fontWeight: 800, color: T.primaryMid, mb: 0.4 }}>Login credentials sent!</Typography>
//                     <Typography sx={{ fontSize: { xs: 11, sm: 12.5 }, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
//                       An email with login details has been delivered to{' '}
//                       <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedRecruiterEmail}</Box>
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Button onClick={handleCloseDialog} variant="contained"
//                   sx={{ mt: 4, borderRadius: '11px', px: { xs: 4, sm: 5 }, py: 1.3, fontSize: { xs: 13, sm: 14 }, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 4px 14px ${T.primaryMid}35`, '&:hover': { background: T.primary } }}>
//                   Done
//                 </Button>
//               </Box>
//             ) : (
//               <Box sx={{ p: { xs: 2, sm: 3 } }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: 2.75, p: { xs: '12px', sm: '14px 16px' }, background: T.bg, borderRadius: '12px', border: `1px solid ${T.border}` }}>
//                   <Box sx={{ position: 'relative', flexShrink: 0 }}>
//                     <Avatar src={profilePreview} sx={{ width: { xs: 48, sm: 58 }, height: { xs: 48, sm: 58 }, bgcolor: T.primaryMid, fontSize: { xs: 18, sm: 22 }, fontWeight: 900, boxShadow: `0 4px 14px ${T.primaryMid}28` }}>
//                       {!profilePreview && <PersonIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
//                     </Avatar>
//                     {profilePreview && (
//                       <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: { xs: 14, sm: 18 }, height: { xs: 14, sm: 18 }, borderRadius: '50%', background: T.success, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff' }}>
//                         <SuccessCircleIcon sx={{ fontSize: { xs: 8, sm: 11 }, color: '#fff' }} />
//                       </Box>
//                     )}
//                   </Box>
//                   <Box sx={{ minWidth: 0 }}>
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 700, color: T.text, mb: 0.5 }}>Profile Photo</Typography>
//                     <Button component="label" size="small" variant="outlined" disabled={saving}
//                       sx={{ borderRadius: '8px', fontSize: { xs: 10, sm: 11 }, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, py: 0.55, px: { xs: 1, sm: 1.5 }, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
//                       {profilePreview ? 'Change Photo' : 'Upload Photo'}
//                       <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                     </Button>
//                     {profileImage && (
//                       <Typography sx={{ fontSize: { xs: 9, sm: 10 }, color: T.textMuted, mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: { xs: 140, sm: 180 } }}>
//                         {profileImage.name}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Box>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Username *" value={newRecruiter.username}
//                       onChange={e => setNewRecruiter(p => ({ ...p, username: e.target.value }))}
//                       disabled={saving} sx={fieldSx}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Email Address *" type="email" value={newRecruiter.email}
//                       onChange={e => setNewRecruiter(p => ({ ...p, email: e.target.value }))}
//                       disabled={saving} sx={fieldSx}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Phone Number" type="tel" value={newRecruiter.phoneNumber}
//                       onChange={e => setNewRecruiter(p => ({ ...p, phoneNumber: e.target.value }))}
//                       disabled={saving} sx={fieldSx}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth size="small" label="Experience (years)" type="number" value={newRecruiter.experience}
//                       onChange={e => setNewRecruiter(p => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
//                       disabled={saving} sx={fieldSx} inputProps={{ min: 0, max: 50 }}
//                       InputProps={{ startAdornment: <InputAdornment position="start"><ExperienceIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                   </Grid>
//                 </Grid>
//                 <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, p: '11px 14px', background: T.primaryLight, borderRadius: '10px', border: `1px solid ${T.primaryMid}20` }}>
//                   <MailSentIcon sx={{ fontSize: { xs: 15, sm: 17 }, color: T.primaryMid, flexShrink: 0 }} />
//                   <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: T.primaryMid, fontWeight: 600, lineHeight: 1.5 }}>
//                     Login credentials will be automatically emailed to the recruiter after registration.
//                   </Typography>
//                 </Box>
//               </Box>
//             )}
//           </DialogContent>

//           {!saveSuccess && (
//             <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
//               <Button onClick={handleCloseDialog} disabled={saving} variant="outlined"
//                 sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 }, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSaveRecruiter} disabled={saving} variant="contained"
//                 sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 }, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 3px 10px ${T.primaryMid}35`, '&:hover': { background: T.primary }, minWidth: { xs: 130, sm: 152 }, transition: 'all 0.15s' }}>
//                 {saving ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
//                     <CircularProgress size={15} sx={{ color: '#fff' }} />
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 700, color: '#fff' }}>Registering…</Typography>
//                   </Box>
//                 ) : editingId ? 'Update Recruiter' : 'Add Recruiter'}
//               </Button>
//             </Box>
//           )}
//         </Dialog>

//         {/* ════════════════════════════════════════════════════════════════════
//             VENDOR REGISTRATION DIALOG (unchanged)
//         ════════════════════════════════════════════════════════════════════ */}
//         <Dialog
//           open={openVendorDialog}
//           onClose={handleCloseVendorDialog}
//           maxWidth="md"
//           fullWidth
//           PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', background: T.surface, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', m: { xs: 1.5, sm: 'auto' }, width: { xs: 'calc(100% - 32px)', sm: '100%' } } }}
//         >
//           <Box sx={{ background: `linear-gradient(135deg, ${T.purple} 0%, #5b21b6 100%)`, px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
//             <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -35, right: 80, pointerEvents: 'none' }} />
//             <Box sx={{ position: 'absolute', width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, right: 20, pointerEvents: 'none' }} />
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
//               <Box sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
//                 <BusinessIcon sx={{ color: '#fff', fontSize: { xs: 20, sm: 23 } }} />
//               </Box>
//               <Box>
//                 <Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Register Vendor</Typography>
//                 <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>Add a new vendor to the platform</Typography>
//               </Box>
//             </Box>
//             <IconButton onClick={handleCloseVendorDialog} disabled={vendorInviteLoading}
//               sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: { xs: 30, sm: 34 }, height: { xs: 30, sm: 34 }, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
//               <CloseIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
//             </IconButton>
//           </Box>

//           {vendorInviteLoading && <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#c4b5fd' } }} />}

//           <DialogContent sx={{ p: 0 }}>
//             {vendorInviteSuccess ? (
//               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 4 } }}>
//                 <Box sx={{
//                   width: { xs: 64, sm: 84 }, height: { xs: 64, sm: 84 }, borderRadius: '50%',
//                   background: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
//                   border: `3px solid ${T.success}25`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
//                   boxShadow: `0 8px 28px ${T.success}20`,
//                   animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)',
//                   '@keyframes pop': { '0%': { transform: 'scale(0.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
//                 }}>
//                   <SuccessCircleIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: T.success }} />
//                 </Box>

//                 <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>
//                   Vendor Registered Successfully!
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 340 }}>
//                   The vendor account has been created and is ready to use.
//                 </Typography>

//                 <Box sx={{
//                   display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left',
//                   background: `linear-gradient(135deg, ${T.purpleBg} 0%, #ede9fe 100%)`,
//                   border: `1.5px solid ${T.purple}20`, borderRadius: '14px',
//                   px: { xs: 1.5, sm: 2.5 }, py: { xs: 1.5, sm: 2 }, maxWidth: 400, width: '100%',
//                   boxShadow: `0 4px 16px ${T.purple}12`,
//                 }}>
//                   <Box sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, borderRadius: '11px', background: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.purple}30` }}>
//                     <MailSentIcon sx={{ color: '#fff', fontSize: { xs: 18, sm: 21 } }} />
//                   </Box>
//                   <Box>
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, fontWeight: 800, color: T.purple, mb: 0.4 }}>
//                       Login credentials sent!
//                     </Typography>
//                     <Typography sx={{ fontSize: { xs: 11, sm: 12.5 }, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
//                       An email with login details has been delivered to{' '}
//                       <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedVendorEmail}</Box>
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Button onClick={handleCloseVendorDialog} variant="contained"
//                   sx={{ mt: 4, borderRadius: '11px', px: { xs: 4, sm: 5 }, py: 1.3, fontSize: { xs: 13, sm: 14 }, fontWeight: 800, textTransform: 'none', background: T.purple, boxShadow: `0 4px 14px ${T.purple}35`, '&:hover': { background: '#6d28d9' } }}>
//                   Done
//                 </Button>
//               </Box>
//             ) : (
//               <Box sx={{ p: { xs: 2, sm: 3 } }}>
//                 <Box sx={{ mb: 2.5 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
//                     <Box sx={{ width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 }, borderRadius: '8px', background: T.purpleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <PersonIcon sx={{ fontSize: { xs: 13, sm: 15 }, color: T.purple }} />
//                     </Box>
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 800, color: T.text }}>Contact Person</Typography>
//                   </Box>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="First Name *" value={vendorForm.firstName}
//                         onChange={e => setVendorForm(p => ({ ...p, firstName: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Last Name *" value={vendorForm.lastName}
//                         onChange={e => setVendorForm(p => ({ ...p, lastName: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Email Address *" type="email" value={vendorForm.email}
//                         onChange={e => setVendorForm(p => ({ ...p, email: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Phone" type="tel" value={vendorForm.phone}
//                         onChange={e => setVendorForm(p => ({ ...p, phone: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Designation" value={vendorForm.designation}
//                         onChange={e => setVendorForm(p => ({ ...p, designation: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ height: '1px', background: T.border, mb: 2.5 }} />

//                 <Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
//                     <Box sx={{ width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 }, borderRadius: '8px', background: T.purpleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <BusinessIcon sx={{ fontSize: { xs: 13, sm: 15 }, color: T.purple }} />
//                     </Box>
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 800, color: T.text }}>Company Details</Typography>
//                   </Box>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Company Name *" value={vendorForm.companyName}
//                         onChange={e => setVendorForm(p => ({ ...p, companyName: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Company Email" type="email" value={vendorForm.companyEmail}
//                         onChange={e => setVendorForm(p => ({ ...p, companyEmail: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField fullWidth size="small" label="Company Phone" type="tel" value={vendorForm.companyPhone}
//                         onChange={e => setVendorForm(p => ({ ...p, companyPhone: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <FormControl fullWidth size="small" sx={vendorFieldSx} disabled={vendorInviteLoading}>
//                         <InputLabel>Industry *</InputLabel>
//                         <Select
//                           value={vendorForm.industry}
//                           onChange={e => setVendorForm(p => ({ ...p, industry: e.target.value }))}
//                           label="Industry *"
//                           MenuProps={{ PaperProps: { sx: { maxHeight: 280, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } } }}
//                         >
//                           {INDUSTRIES.map(ind => (
//                             <MenuItem key={ind} value={ind} sx={{ fontSize: { xs: 12, sm: 13 } }}>{ind}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField fullWidth size="small" label="Company Address" value={vendorForm.companyAddress}
//                         onChange={e => setVendorForm(p => ({ ...p, companyAddress: e.target.value }))}
//                         disabled={vendorInviteLoading} sx={vendorFieldSx}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, p: '11px 14px', background: T.purpleBg, borderRadius: '10px', border: `1px solid ${T.purple}20` }}>
//                   <MailSentIcon sx={{ fontSize: { xs: 15, sm: 17 }, color: T.purple, flexShrink: 0 }} />
//                   <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: T.purple, fontWeight: 600, lineHeight: 1.5 }}>
//                     Login credentials will be automatically emailed to the vendor after registration.
//                   </Typography>
//                 </Box>
//               </Box>
//             )}
//           </DialogContent>

//           {!vendorInviteSuccess && (
//             <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
//               <Button onClick={handleCloseVendorDialog} disabled={vendorInviteLoading} variant="outlined"
//                 sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 }, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, '&:hover': { borderColor: T.purple, color: T.purple, background: T.purpleBg } }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleRegisterVendor} disabled={vendorInviteLoading} variant="contained"
//                 sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 }, fontWeight: 800, textTransform: 'none', background: T.purple, boxShadow: `0 3px 10px ${T.purple}35`, '&:hover': { background: '#6d28d9' }, minWidth: { xs: 140, sm: 160 }, transition: 'all 0.15s' }}>
//                 {vendorInviteLoading ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
//                     <CircularProgress size={15} sx={{ color: '#fff' }} />
//                     <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 700, color: '#fff' }}>Registering…</Typography>
//                   </Box>
//                 ) : 'Register Vendor'}
//               </Button>
//             </Box>
//           )}
//         </Dialog>

//         {/* ── SNACKBAR ──────────────────────────────────────────────────────── */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={5000}
//           onClose={() => setSnackbar(p => ({ ...p, open: false }))}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar(p => ({ ...p, open: false }))}
//             sx={{
//               borderRadius: '12px',
//               boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
//               fontWeight: 600,
//               fontSize: { xs: 12, sm: 13, md: 13 },
//               width: '100%',
//             }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>

//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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
// import VendorForm from '../../components/VendorForm';
import VendorForm from '../../components/Vendorform';

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
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
  const [sidebarOpen,           setSidebarOpen]           = useState(true);

  /* ── Vendor form state ───────────────────────────────────────────── */
  const emptyVendorForm = {
    firstName: '', lastName: '', email: '', phone: '',
    designation: '', companyName: '', companyEmail: '',
    companyPhone: '', companyAddress: '', industry: '',
  };
  const [vendorForm,       setVendorForm]       = useState(emptyVendorForm);
  const [vendorFormErrors, setVendorFormErrors] = useState({});

  const [newRecruiter, setNewRecruiter] = useState({
    email: '', password: '', username: '', experience: 0, phoneNumber: '', profilePicture: null,
  });

  /* ── responsive helper ───────────────────────────────────────────────── */
  const getMainContentWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '100%';
    return sidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)';
  };

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
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const toDateStr = (val) => {
    if (!val) return null;
    const s = String(val).slice(0, 10);
    return s.length === 10 ? s : null;
  };

  const activeJobs  = jobs.filter(j => { const ds = toDateStr(j.jobFormId?.targetHireDate); return !ds || ds >= todayStr; });
  const closedJobs  = jobs.filter(j => { const ds = toDateStr(j.jobFormId?.targetHireDate); return ds && ds < todayStr; });
  const avgJobsPerRec = recruiters.length ? (jobs.length / recruiters.length).toFixed(1) : 0;

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

  const isJobActive = (job) => {
    const ds = toDateStr(job.jobFormId?.targetHireDate);
    return !ds || ds >= todayStr;
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
    setVendorForm(emptyVendorForm);
    setVendorFormErrors({});
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
      setVendorForm(emptyVendorForm);
      setVendorFormErrors({});
    }, 250);
  };

  const validateVendorForm = () => {
    const errors = {};
    if (!vendorForm.firstName.trim())  errors.firstName  = 'First name is required';
    if (!vendorForm.lastName.trim())   errors.lastName   = 'Last name is required';
    if (!vendorForm.email.trim())      errors.email      = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorForm.email)) errors.email = 'Invalid email address';
    if (!vendorForm.companyName.trim()) errors.companyName = 'Company name is required';
    if (!vendorForm.industry)          errors.industry   = 'Industry is required';
    setVendorFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterVendor = async () => {
    if (!validateVendorForm()) {
      showSnackbar('Please fill all required fields', 'warning');
      return;
    }
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
      borderRadius: '10px', fontSize: { xs: 12, sm: 13, md: 13 },
      background: T.bg,
      '& fieldset': { borderColor: T.border },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: T.primaryMid, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { fontSize: { xs: 12, sm: 13, md: 13 } },
  };

  /* ── loading ──────────────────────────────────────────────────────────── */
  if (loading && !refreshing) return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', width: getMainContentWidth(),
      ml: { xs: 0, sm: 0, md: sidebarOpen ? '240px' : '65px' },
      transition: 'margin-left 0.3s ease', gap: 2,
    }}>
      <Box sx={{ position: 'relative', width: { xs: 48, sm: 56, md: 64 }, height: { xs: 48, sm: 56, md: 64 } }}>
        <CircularProgress size={isMobile ? 48 : isTablet ? 56 : 64} thickness={2} sx={{ color: T.primaryLight, position: 'absolute' }} variant="determinate" value={100} />
        <CircularProgress size={isMobile ? 48 : isTablet ? 56 : 64} thickness={2} sx={{ color: T.primaryMid, position: 'absolute', animationDuration: '900ms' }} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DashboardIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: T.primaryMid }} />
        </Box>
      </Box>
      <Typography sx={{ color: T.textSub, fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 700 }}>Loading Dashboard…</Typography>
    </Box>
  );

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        width: getMainContentWidth(),
        minHeight: '100vh',
        p: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
        ml: { xs: 0, sm: 0, md: sidebarOpen ? '200px' : '65px' },
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        overflowX: 'hidden',
        mt: { xs: 7, sm: 8, md: 9 },
      }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'stretch', md: 'flex-start' },
          mb: { xs: 2, sm: 2.5, md: 3 },
          gap: { xs: 1.5, sm: 2, md: 2 },
        }}>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ fontSize: { xs: 18, sm: 20, md: 22, lg: 24 }, fontWeight: 900, color: T.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <DashboardIcon sx={{ fontSize: { xs: 11, sm: 12, md: 13 }, color: T.textMuted }} />
              <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 12 }, color: T.textMuted, fontWeight: 500 }}>
                Manage recruiters and job postings
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1, md: 1 },
            flexWrap: 'wrap', width: { xs: '100%', sm: '100%', md: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-end' },
          }}>
            <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120, md: 120 }, flex: { xs: 1, sm: 1, md: 0 } }}>
              <InputLabel sx={{ fontSize: { xs: 11, sm: 12, md: 12 } }}>Time Filter</InputLabel>
              <Select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} label="Time Filter"
                sx={{ borderRadius: '9px', fontSize: { xs: 11, sm: 12, md: 12 }, background: T.surface, '& fieldset': { borderColor: T.border } }}>
                <MenuItem value="all"    sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>All Time</MenuItem>
                <MenuItem value="weekly" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Weekly</MenuItem>
                <MenuItem value="monthly"sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Monthly</MenuItem>
                <MenuItem value="yearly" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Yearly</MenuItem>
                <MenuItem value="custom" sx={{ fontSize: { xs: 12, sm: 13, md: 13 } }}>Custom</MenuItem>
              </Select>
            </FormControl>

            {timeFilter === 'custom' && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: { xs: '100%', sm: 'auto', md: 'auto' } }}>
                <DatePicker label="Start" value={startDate} onChange={setStartDate}
                  renderInput={p => <TextField {...p} size="small" sx={{ width: { xs: '100%', sm: 120, md: 130 }, ...fieldSx }} />} />
                <Typography sx={{ color: T.textMuted, display: { xs: 'none', sm: 'block' } }}>–</Typography>
                <DatePicker label="End" value={endDate} onChange={setEndDate}
                  renderInput={p => <TextField {...p} size="small" sx={{ width: { xs: '100%', sm: 120, md: 130 }, ...fieldSx }} />} />
              </Box>
            )}

            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={refreshing} size="small"
                sx={{ width: { xs: 32, sm: 34, md: 36 }, height: { xs: 32, sm: 34, md: 36 }, background: T.surface, border: `1px solid ${T.border}`, borderRadius: '9px', '&:hover': { background: T.primaryLight, borderColor: T.primaryMid } }}>
                <RefreshIcon sx={{ fontSize: { xs: 15, sm: 16, md: 17 }, color: refreshing ? T.textMuted : T.primaryMid }} />
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: '100%', md: 'auto' }, justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-end' } }}>
              {[
                {
                  label: { xs: 'Add', sm: 'Recruiter', md: 'Add Recruiter' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
                  icon: <AddIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />,
                  onClick: () => handleOpenDialog(),
                  bg: T.primaryMid, hbg: T.primary, color: '#fff',
                },
                {
                  label: { xs: 'Add', sm: 'Vendor', md: 'Add Vendor' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
                  icon: <EmailIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />,
                  onClick: handleOpenVendorDialog,
                  bg: T.purple, hbg: '#6d28d9', color: '#fff',
                },
                {
                  label: { xs: 'Job', sm: 'Create', md: 'Create Job' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'],
                  icon: <WorkIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />,
                  onClick: () => navigate('/dashboard/jobs/createJob'),
                  bg: T.surface, hbg: T.bg, color: T.textSub, border: `1px solid ${T.border}`,
                },
              ].map((btn, i) => (
                <Button key={i} startIcon={btn.icon} onClick={btn.onClick}
                  sx={{
                    flex: { xs: 1, sm: 1, md: 0 }, background: btn.bg, color: btn.color,
                    border: btn.border || 'none', borderRadius: '9px',
                    px: { xs: 1, sm: 1.5, md: 2 }, py: { xs: '6px', sm: '7px', md: '8px' },
                    fontSize: { xs: 10, sm: 11, md: 13 }, fontWeight: 700, textTransform: 'none',
                    whiteSpace: 'nowrap', minWidth: 'auto',
                    boxShadow: btn.border ? 'none' : '0 2px 8px rgba(0,0,0,0.14)',
                    '&:hover': { background: btn.hbg, transform: 'translateY(-1px)' },
                    transition: 'all 0.15s',
                  }}>
                  {btn.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ mb: { xs: 2, sm: 2.5, md: 2.5 } }}>
          {[
            { label: { xs: 'Recruiters', sm: 'Total Recruiters', md: 'Total Recruiters' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'], value: recruiters.length, sub: `+${Math.floor(recruiters.length * 0.12)} from last month`, icon: <PeopleIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />, color: T.primaryMid, bg: T.primaryLight },
            { label: { xs: 'Jobs', sm: 'Total Jobs', md: 'Total Jobs' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'], value: jobs.length, sub: `${Math.floor(jobs.length * 0.3)} new this month`, icon: <WorkIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />, color: T.success, bg: T.successBg },
            { label: { xs: 'Active', sm: 'Active Jobs', md: 'Active Jobs' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'], value: activeJobs.length, sub: `${jobs.length > 0 ? Math.round(activeJobs.length / jobs.length * 100) : 0}% of total`, icon: <ActiveIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />, color: T.info, bg: T.infoBg },
            { label: { xs: 'Avg/Rec', sm: 'Avg Jobs/Rec', md: 'Avg Jobs/Recruiter' }[isMobile ? 'xs' : isTablet ? 'sm' : 'md'], value: avgJobsPerRec, sub: 'Across all recruiters', icon: <BarChartIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 } }} />, color: T.warning, bg: T.warningBg },
          ].map((s, i) => (
            <Grid item xs={6} md={3} key={i}><StatCard {...s} /></Grid>
          ))}
        </Grid>

        {/* ── JOB POSTINGS ────────────────────────────────────────────────── */}
        <Grid item xs={12}>
          <Card sx={{ ...cardSx, display: 'flex', flexDirection: 'column', width: '1200px' }}>
            <Box sx={{
              px: { xs: 1.5, sm: 2, md: 2.5 }, py: { xs: 1.5, sm: 1.75, md: 2 },
              borderBottom: `1px solid ${T.border}`,
              display: 'flex', flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center', md: 'center' },
              gap: { xs: 1, sm: 1.5, md: 1.5 }, mt: '10px',
            }}>
              <Typography sx={{ fontSize: { xs: 13, sm: 14, md: 15 }, fontWeight: 800, color: T.text }}>
                Job Postings
                <Box component="span" sx={{ fontSize: { xs: 10, sm: 11, md: 12 }, color: T.textMuted, fontWeight: 600, ml: 0.5 }}>
                  ({filteredJobs.length})
                </Box>
              </Typography>
              <TextField size="small"
                placeholder={isMobile ? 'Search…' : 'Search jobs…'}
                value={searchJob} onChange={e => setSearchJob(e.target.value)}
                sx={{ width: { xs: '100%', sm: 180, md: 200 }, ...fieldSx }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: T.textMuted }} /></InputAdornment> }}
              />
            </Box>

            <Box sx={{ flex: 1, p: { xs: 1, sm: 1.25, md: 2 } }}>
              {filteredJobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5, md: 6 } }}>
                  <Typography sx={{ fontSize: { xs: 13, sm: 14, md: 14 }, color: T.textMuted }}>No jobs found</Typography>
                </Box>
              ) : (
                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} alignItems="stretch">
                  {filteredJobs.map(job => {
                    const rawTargetDate = job.jobFormId?.targetHireDate;
                    const today = new Date(); today.setHours(0,0,0,0);
                    const isExpired = rawTargetDate ? new Date(rawTargetDate) < today : false;
                    const active = isJobActive(job) && !isExpired;
                    const targetDateLabel = rawTargetDate
                      ? new Date(rawTargetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Not set';
                    const recruiterName = getRecruiterName(job.userId);

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={sidebarOpen ? 3 : 4} xl={sidebarOpen ? 3 : 4} key={job._id} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Card sx={{
                          width: '100%', display: 'flex', flexDirection: 'column',
                          borderRadius: '14px', border: `1px solid ${T.border}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: T.surface,
                          overflow: 'hidden', transition: 'all 0.18s', height: '100%',
                          '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(0,0,0,0.10)', borderColor: '#cbd5e1' },
                        }}>
                          <Box sx={{ height: 4, background: active ? `linear-gradient(90deg, ${T.primaryMid}, #60a5fa)` : `linear-gradient(90deg, #94a3b8, #cbd5e1)` }} />
                          <Box sx={{ p: { xs: 1.5, sm: 1.75, md: 2 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, sm: 1.1, md: 1.2 }, gap: 1 }}>
                              <Typography sx={{ fontSize: { xs: 12, sm: 13, md: 13.5 }, fontWeight: 800, color: T.text, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.2, minHeight: '2.4em' }}>
                                {job.jobTitle}
                              </Typography>
                              <Chip label={active ? 'Active' : isExpired ? 'Expired' : 'Closed'} size="small"
                                sx={{ fontSize: { xs: 9, sm: 10, md: 10 }, fontWeight: 800, height: { xs: 20, sm: 21, md: 22 }, borderRadius: '7px', background: active ? T.successBg : T.dangerBg, color: active ? T.success : T.danger, flexShrink: 0 }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 0.6, md: 0.7 }, mb: { xs: 1.5, sm: 1.6, md: 1.8 }, minHeight: { xs: 18, sm: 19, md: 20 } }}>
                              {job.department && <Chip label={job.department} size="small" sx={{ fontSize: { xs: 9, sm: 10, md: 10 }, fontWeight: 700, height: { xs: 18, sm: 19, md: 20 }, borderRadius: '5px', background: T.primaryLight, color: T.primaryMid }} />}
                              <Chip label={job.jobFormId?.jobType || 'Full-time'} size="small" sx={{ fontSize: { xs: 9, sm: 10, md: 10 }, fontWeight: 700, height: { xs: 18, sm: 19, md: 20 }, borderRadius: '5px', background: T.purpleBg, color: T.purple }} />
                            </Box>
                            <Box sx={{ height: '1px', background: T.border, mb: { xs: 1.25, sm: 1.4, md: 1.5 } }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, sm: 0.9, md: 1 }, flexGrow: 1 }}>
                              <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 12 }, fontWeight: 700 }}>Job ID: {job.jobName || '—'}</Typography>
                              <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 12 }, fontWeight: 700 }}>Openings: {job.jobFormId?.openings || 0}</Typography>
                              <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 12 }, fontWeight: 700, color: isExpired ? T.danger : 'inherit' }}>Target Hire: {targetDateLabel}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: { xs: 1.5, sm: 1.75, md: 2 }, pt: { xs: 1, sm: 1.1, md: 1.2 }, borderTop: `1px solid ${T.border}` }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.6, md: 0.7 } }}>
                                <Avatar sx={{ width: { xs: 18, sm: 20, md: 22 }, height: { xs: 18, sm: 20, md: 22 }, fontSize: { xs: 9, sm: 10, md: 10 }, fontWeight: 900, bgcolor: T.primaryMid }}>
                                  {recruiterName !== 'Unknown' ? recruiterName.charAt(0).toUpperCase() : '?'}
                                </Avatar>
                                <Typography sx={{ fontSize: { xs: 10, sm: 11, md: 11.5 }, color: T.textSub, fontWeight: 600, maxWidth: { xs: 80, sm: 90, md: 100 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {recruiterName}
                                </Typography>
                              </Box>
                              <Typography sx={{ fontSize: { xs: 9, sm: 10, md: 10.5 }, color: T.textMuted }}>
                                {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
            <div className="text-right mr-5 mb-3">
              <Link to="/jobs" className="text-blue-600 font-semibold px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                View All Jobs →
              </Link>
            </div>
          </Card>
        </Grid>

        {/* ════════════════════════════════════════════════════════════════════
            ADD / EDIT RECRUITER DIALOG (unchanged)
        ════════════════════════════════════════════════════════════════════ */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', background: T.surface, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', m: { xs: 1.5, sm: 'auto' }, width: { xs: 'calc(100% - 32px)', sm: '100%' } } }}>
          <Box sx={{ background: `linear-gradient(135deg, ${T.primaryMid} 0%, ${T.primary} 100%)`, px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -35, right: 70, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, right: 20, pointerEvents: 'none' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative', zIndex: 1 }}>
              <Box sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: '12px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <PeopleIcon sx={{ color: '#fff', fontSize: { xs: 20, sm: 23 } }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                  {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
                </Typography>
                <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: 'rgba(255,255,255,0.72)', mt: 0.2 }}>
                  {editingId ? 'Update recruiter information' : 'Register a new recruiter account'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseDialog} disabled={saving}
              sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.85)', borderRadius: '9px', width: { xs: 30, sm: 34 }, height: { xs: 30, sm: 34 }, '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
              <CloseIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          </Box>

          {saving && <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#93c5fd' } }} />}

          <DialogContent sx={{ p: 0 }}>
            {saveSuccess ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 4 } }}>
                <Box sx={{ width: { xs: 64, sm: 84 }, height: { xs: 64, sm: 84 }, borderRadius: '50%', background: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`, border: `3px solid ${T.success}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, boxShadow: `0 8px 28px ${T.success}20`, animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)', '@keyframes pop': { '0%': { transform: 'scale(0.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } } }}>
                  <SuccessCircleIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: T.success }} />
                </Box>
                <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>Recruiter Added Successfully!</Typography>
                <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 320 }}>The recruiter account has been created and is ready to use.</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left', background: `linear-gradient(135deg, ${T.primaryLight} 0%, #dbeafe 100%)`, border: `1.5px solid ${T.primaryMid}20`, borderRadius: '14px', px: { xs: 1.5, sm: 2.5 }, py: { xs: 1.5, sm: 2 }, maxWidth: 370, width: '100%', boxShadow: `0 4px 16px ${T.primaryMid}12` }}>
                  <Box sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, borderRadius: '11px', background: T.primaryMid, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.primaryMid}30` }}>
                    <MailSentIcon sx={{ color: '#fff', fontSize: { xs: 18, sm: 21 } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, fontWeight: 800, color: T.primaryMid, mb: 0.4 }}>Login credentials sent!</Typography>
                    <Typography sx={{ fontSize: { xs: 11, sm: 12.5 }, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
                      An email with login details has been delivered to <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedRecruiterEmail}</Box>
                    </Typography>
                  </Box>
                </Box>
                <Button onClick={handleCloseDialog} variant="contained"
                  sx={{ mt: 4, borderRadius: '11px', px: { xs: 4, sm: 5 }, py: 1.3, fontSize: { xs: 13, sm: 14 }, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 4px 14px ${T.primaryMid}35`, '&:hover': { background: T.primary } }}>
                  Done
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: 2.75, p: { xs: '12px', sm: '14px 16px' }, background: T.bg, borderRadius: '12px', border: `1px solid ${T.border}` }}>
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar src={profilePreview} sx={{ width: { xs: 48, sm: 58 }, height: { xs: 48, sm: 58 }, bgcolor: T.primaryMid, fontSize: { xs: 18, sm: 22 }, fontWeight: 900, boxShadow: `0 4px 14px ${T.primaryMid}28` }}>
                      {!profilePreview && <PersonIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
                    </Avatar>
                    {profilePreview && (
                      <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: { xs: 14, sm: 18 }, height: { xs: 14, sm: 18 }, borderRadius: '50%', background: T.success, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff' }}>
                        <SuccessCircleIcon sx={{ fontSize: { xs: 8, sm: 11 }, color: '#fff' }} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 700, color: T.text, mb: 0.5 }}>Profile Photo</Typography>
                    <Button component="label" size="small" variant="outlined" disabled={saving}
                      sx={{ borderRadius: '8px', fontSize: { xs: 10, sm: 11 }, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, py: 0.55, px: { xs: 1, sm: 1.5 }, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
                      {profilePreview ? 'Change Photo' : 'Upload Photo'}
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                    {profileImage && (
                      <Typography sx={{ fontSize: { xs: 9, sm: 10 }, color: T.textMuted, mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: { xs: 140, sm: 180 } }}>
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
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Email Address *" type="email" value={newRecruiter.email}
                      onChange={e => setNewRecruiter(p => ({ ...p, email: e.target.value }))}
                      disabled={saving} sx={fieldSx}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Phone Number" type="tel" value={newRecruiter.phoneNumber}
                      onChange={e => setNewRecruiter(p => ({ ...p, phoneNumber: e.target.value }))}
                      disabled={saving} sx={fieldSx}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Experience (years)" type="number" value={newRecruiter.experience}
                      onChange={e => setNewRecruiter(p => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
                      disabled={saving} sx={fieldSx} inputProps={{ min: 0, max: 50 }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><ExperienceIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: T.textMuted }} /></InputAdornment> }} />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, p: '11px 14px', background: T.primaryLight, borderRadius: '10px', border: `1px solid ${T.primaryMid}20` }}>
                  <MailSentIcon sx={{ fontSize: { xs: 15, sm: 17 }, color: T.primaryMid, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: T.primaryMid, fontWeight: 600, lineHeight: 1.5 }}>
                    Login credentials will be automatically emailed to the recruiter after registration.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          {!saveSuccess && (
            <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 2, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button onClick={handleCloseDialog} disabled={saving} variant="outlined"
                sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 }, fontWeight: 700, textTransform: 'none', borderColor: T.border, color: T.textSub, '&:hover': { borderColor: T.primaryMid, color: T.primaryMid, background: T.primaryLight } }}>
                Cancel
              </Button>
              <Button onClick={handleSaveRecruiter} disabled={saving} variant="contained"
                sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 }, fontWeight: 800, textTransform: 'none', background: T.primaryMid, boxShadow: `0 3px 10px ${T.primaryMid}35`, '&:hover': { background: T.primary }, minWidth: { xs: 130, sm: 152 }, transition: 'all 0.15s' }}>
                {saving ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <CircularProgress size={15} sx={{ color: '#fff' }} />
                    <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 700, color: '#fff' }}>Registering…</Typography>
                  </Box>
                ) : editingId ? 'Update Recruiter' : 'Add Recruiter'}
              </Button>
            </Box>
          )}
        </Dialog>

        {/* ════════════════════════════════════════════════════════════════════
            VENDOR REGISTRATION DIALOG — uses VendorForm component
        ════════════════════════════════════════════════════════════════════ */}
        <Dialog
          open={openVendorDialog}
          onClose={handleCloseVendorDialog}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: '24px',
              p: 0,
              boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar':       { width: 6 },
              '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
              '&::-webkit-scrollbar-thumb': { background: '#8B5CF6', borderRadius: 3 },
            }
          }}
        >
          {vendorInviteLoading && (
            <LinearProgress sx={{ height: 2.5, '& .MuiLinearProgress-bar': { background: '#c4b5fd' } }} />
          )}

          {vendorInviteSuccess ? (
            /* ── Success state ─────────────────────────────────────────── */
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 4 } }}>
              <Box sx={{
                width: { xs: 64, sm: 84 }, height: { xs: 64, sm: 84 }, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: `3px solid ${T.success}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
                boxShadow: `0 8px 28px ${T.success}20`,
                animation: 'pop 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                '@keyframes pop': { '0%': { transform: 'scale(0.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
              }}>
                <SuccessCircleIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: T.success }} />
              </Box>
              <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 900, color: T.text, mb: 0.75, letterSpacing: '-0.3px' }}>
                Vendor Registered Successfully!
              </Typography>
              <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: T.textSub, mb: 3.5, fontWeight: 500, lineHeight: 1.6, maxWidth: 340 }}>
                The vendor account has been created and is ready to use.
              </Typography>
              <Box sx={{
                display: 'flex', alignItems: 'flex-start', gap: 1.75, textAlign: 'left',
                background: `linear-gradient(135deg, ${T.purpleBg} 0%, #ede9fe 100%)`,
                border: `1.5px solid ${T.purple}20`, borderRadius: '14px',
                px: { xs: 1.5, sm: 2.5 }, py: { xs: 1.5, sm: 2 }, maxWidth: 400, width: '100%',
                boxShadow: `0 4px 16px ${T.purple}12`,
              }}>
                <Box sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, borderRadius: '11px', background: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2, boxShadow: `0 3px 10px ${T.purple}30` }}>
                  <MailSentIcon sx={{ color: '#fff', fontSize: { xs: 18, sm: 21 } }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, fontWeight: 800, color: T.purple, mb: 0.4 }}>Login credentials sent!</Typography>
                  <Typography sx={{ fontSize: { xs: 11, sm: 12.5 }, color: T.textSub, fontWeight: 500, lineHeight: 1.6 }}>
                    An email with login details has been delivered to{' '}
                    <Box component="strong" sx={{ color: T.text, fontWeight: 800 }}>{savedVendorEmail}</Box>
                  </Typography>
                </Box>
              </Box>
              <Button onClick={handleCloseVendorDialog} variant="contained"
                sx={{ mt: 4, borderRadius: '11px', px: { xs: 4, sm: 5 }, py: 1.3, fontSize: { xs: 13, sm: 14 }, fontWeight: 800, textTransform: 'none', background: T.purple, boxShadow: `0 4px 14px ${T.purple}35`, '&:hover': { background: '#6d28d9' } }}>
                Done
              </Button>
            </Box>
          ) : (
            /* ── VendorForm ───────────────────────────────────────────── */
            <VendorForm
              formData={vendorForm}
              setFormData={setVendorForm}
              formErrors={vendorFormErrors}
              setFormErrors={setVendorFormErrors}
              onSubmit={handleRegisterVendor}
              onCancel={handleCloseVendorDialog}
              submitting={vendorInviteLoading}
            />
          )}
        </Dialog>

        {/* ── SNACKBAR ──────────────────────────────────────────────────────── */}
        <Snackbar
          open={snackbar.open} autoHideDuration={5000}
          onClose={() => setSnackbar(p => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))}
            sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', fontWeight: 600, fontSize: { xs: 12, sm: 13, md: 13 }, width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;