// import React, { useState, useEffect } from 'react';
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, CircularProgress, Alert, Button, Avatar,
//   IconButton, Dialog, DialogContent, Grid, Card, Chip, Switch,
//   TextField, InputAdornment, MenuItem, Select, Tooltip, Snackbar,
//   FormControl, InputLabel, useMediaQuery, Stepper, Step, StepLabel
// } from '@mui/material';
// import {
//   Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
//   Visibility as VisibilityIcon, Search as SearchIcon,
//   CheckCircle as ActiveIcon, Cancel as InactiveIcon,
//   Refresh as RefreshIcon, TrendingUp as TrendingUpIcon,
//   People as PeopleIcon, Business as BusinessIcon,
//   Settings as SettingsIcon, Email as EmailIcon,
//   ContentCopy as CopyIcon, Close as CloseIcon,
//   MarkEmailRead as MailSentIcon, BarChart as BarChartIcon,
//   Phone as PhoneIcon, Language as LanguageIcon,
//   LocationOn as LocationIcon, Person as PersonIcon,
//   NavigateNext as NextIcon, NavigateBefore as PrevIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip as ChartTooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend
// } from 'recharts';
// import {
//   getTenants, createTenant, updateTenantStatus,
//   deleteTenant, resendWelcomeEmail
// } from '../../services/tenantService';
// import OrganizationForm from '../../components/OrganizationForm';

// /* ── Design tokens ────────────────────────────────────────────────────── */
// const T = {
//   navy:    '#0F172A',
//   slate:   '#334155',
//   muted:   '#64748B',
//   border:  '#E2E8F0',
//   bg:      '#F1F5F9',
//   card:    '#FFFFFF',
//   indigo:  '#4F46E5',
//   indigoL: '#818CF8',
//   emerald: '#10B981',
//   rose:    '#F43F5E',
//   amber:   '#F59E0B',
//   sky:     '#0EA5E9',
// };

// /* ── Stat Card ────────────────────────────────────────────────────────── */
// const StatCard = ({ title, value, icon, from, to, sub }) => (
//   <Card sx={{
//     p: 2.5, borderRadius: '20px', border: 'none', height: '100%',
//     background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
//     color: '#fff', position: 'relative', overflow: 'hidden',
//     boxShadow: `0 8px 28px ${from}55`,
//     transition: 'transform .22s, box-shadow .22s',
//     '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 14px 36px ${from}77` },
//   }}>
//     <Box sx={{ position:'absolute', top:-28, right:-28, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.10)' }} />
//     <Box sx={{ position:'relative', zIndex:1 , width:"250px"}}>
//       <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1.5 }}>
//         <Typography sx={{ fontSize:11, fontWeight:700, opacity:.8, letterSpacing:.8, textTransform:'uppercase' }}>{title}</Typography>
//         <Box sx={{ p:.7, borderRadius:'8px', background:'rgba(255,255,255,0.18)', display:'flex' }}>
//           {React.cloneElement(icon, { sx:{ fontSize:17 } })}
//         </Box>
//       </Box>
//       <Typography sx={{ fontSize:34, fontWeight:800, lineHeight:1, letterSpacing:-1, mb:1.2 }}>{value}</Typography>
//       <Box sx={{ display:'flex', alignItems:'center', gap:.5 }}>
//         <TrendingUpIcon sx={{ fontSize:13, opacity:.7 }} />
//         <Typography sx={{ fontSize:11, opacity:.8 }}>{sub}</Typography>
//       </Box>
//     </Box>
//   </Card>
// );

// /* ── Chart Tooltip ────────────────────────────────────────────────────── */
// const CTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <Box sx={{ background:T.navy, borderRadius:'10px', p:'8px 14px', boxShadow:'0 4px 20px rgba(0,0,0,.3)' }}>
//       <Typography sx={{ color:'#fff', fontSize:11, fontWeight:700, mb:.5 }}>{label}</Typography>
//       {payload.map((p,i) => (
//         <Typography key={i} sx={{ color:p.color, fontSize:11 }}>{p.name}: <b>{p.value}</b></Typography>
//       ))}
//     </Box>
//   );
// };

// /* ════════════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════ */
// const SuperAdminDashboard = () => {
//   const navigate = useNavigate();

//   /* ── State ──────────────────────────────────────────────────────── */
//   const [tenants,        setTenants]        = useState([]);
//   const [loading,        setLoading]        = useState(true);
//   const [error,          setError]          = useState(null);
//   const [refreshing,     setRefreshing]     = useState(false);
//   const [searchTerm,     setSearchTerm]     = useState('');
//   const [statusFilter,   setStatusFilter]   = useState('all');
//   const [snackbar,       setSnackbar]       = useState({ open:false, message:'', severity:'success' });

//   const [addOpen,        setAddOpen]        = useState(false);
//   const [successOpen,    setSuccessOpen]    = useState(false);
//   const [viewOpen,       setViewOpen]       = useState(false);
//   const [deleteOpen,     setDeleteOpen]     = useState(false);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [tenantToDelete, setTenantToDelete] = useState(null);
//   const [successData,    setSuccessData]    = useState(null);
//   const [submitting,     setSubmitting]     = useState(false);

//   /* ── New form state with all fields ─────────────────────────────── */
//   const emptyForm = {
//     // Company Information
//     name: '',
//     industry: '',
//     website: '',
//     companyPhone: '',
//     email: '',
//     gstNumber: '',
//     companyPan: '',
//     registrationNumber: '',
//     gstCertificate: null,
//     companyPanFile: null,
    
//     // Owner Information
//     ownerName: '',
//     ownerEmail: '',
//     ownerPhone: '',
//     ownerAadhar: '',
//     ownerPan: '',
//     aadharFile: null,
//     panFile: null,
    
//     // Bank Information
//     bankName: '',
//     accountHolderName: '',
//     accountNumber: '',
//     ifscCode: '',
//     branch: '',
//     cancelledCheque: null,
    
//     // Plan & Subscription
//     plan: '',
//     billingCycle: '',
//     startDate: '',
//     endDate: '',
    
//     // Admin Information
//     adminFirstName: '',
//     adminLastName: '',
//     adminEmail: '',
//     adminPhone: '',
//     adminPassword: '',
    
//     // Company Address (keeping for backward compatibility)
//     street: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: '',
//   };

//   const [form, setForm] = useState(emptyForm);
//   const [formErrors, setFormErrors] = useState({});

//   /* ── Fetch ──────────────────────────────────────────────────────── */
//   const fetchTenants = async () => {
//     try {
//       setLoading(true);
//       const r = await getTenants();
//       setTenants(r.data.tenants || []);
//     } catch(e) { 
//       setError(e.message); 
//     } finally { 
//       setLoading(false); 
//       setRefreshing(false); 
//     }
//   };
  
//   useEffect(() => { 
//     fetchTenants(); 
//   }, []);

//   const handleRefresh = () => { 
//     setRefreshing(true); 
//     fetchTenants(); 
//   };

//   /* ── Derived ────────────────────────────────────────────────────── */
//   const activeCount   = tenants.filter(t => t.isActive).length;
//   const inactiveCount = tenants.filter(t => !t.isActive).length;
//   const total         = tenants.length;

//   const filtered = tenants.filter(t => {
//     const s   = searchTerm.toLowerCase();
//     const ms  = t.name?.toLowerCase().includes(s) || t.domain?.toLowerCase().includes(s);
//     const mst = statusFilter === 'all'
//               || (statusFilter === 'active'   && t.isActive)
//               || (statusFilter === 'inactive' && !t.isActive);
//     return ms && mst;
//   });

//   const activityData = (() => {
//     const now    = new Date();
//     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     return Array.from({ length:6 }, (_,idx) => {
//       const mIdx = (now.getMonth() - 5 + idx + 12) % 12;
//       return {
//         name:     months[mIdx],
//         active:   tenants.filter(t => new Date(t.createdAt).getMonth()===mIdx &&  t.isActive).length,
//         inactive: tenants.filter(t => new Date(t.createdAt).getMonth()===mIdx && !t.isActive).length,
//       };
//     });
//   })();

//   const pieData  = [{ name:'Active', value:activeCount }, { name:'Inactive', value:inactiveCount }];
//   const PIE_CLR  = [T.emerald, T.rose];

//   /* ── Helpers ────────────────────────────────────────────────────── */
//   const toast = (message, severity='success') => setSnackbar({ open:true, message, severity });
//   const copy  = text => navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!'));

//   /* ── Tenant actions ─────────────────────────────────────────────── */
//   const toggleStatus = async (id, cur) => {
//     try {
//       await updateTenantStatus(id, !cur);
//       setTenants(ts => ts.map(t => t._id===id ? { ...t, isActive:!cur } : t));
//       toast(`Tenant ${!cur ? 'activated' : 'deactivated'}`);
//     } catch { 
//       toast('Failed to update status', 'error'); 
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteTenant(tenantToDelete._id);
//       setTenants(ts => ts.filter(t => t._id !== tenantToDelete._id));
//       setDeleteOpen(false);
//       toast('Tenant deleted successfully');
//     } catch { 
//       toast('Failed to delete tenant', 'error'); 
//     }
//   };

//   const handleResendEmail = async (tenant) => {
//     try {
//       await resendWelcomeEmail(tenant._id);
//       toast('Welcome email resent!');
//     } catch { 
//       toast('Failed to resend email', 'error'); 
//     }
//   };

//   /* ── Form validation ─────────────────────────────────────────────── */
//   const validateForm = () => {
//     const errors = {};

//     // Company Information
//     if (!form.name?.trim()) errors.name = 'Organisation name is required';
//     if (!form.industry) errors.industry = 'Industry is required';
//     if (!form.companyPhone?.trim()) errors.companyPhone = 'Company phone is required';
//     if (!form.email?.trim()) errors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address';
//     if (!form.companyPan?.trim()) errors.companyPan = 'Company PAN is required';
//     if (!form.gstCertificate) errors.gstCertificate = 'GST certificate is required';
//     if (!form.companyPanFile) errors.companyPanFile = 'Company PAN document is required';

//     // Owner Information
//     if (!form.ownerName?.trim()) errors.ownerName = 'Owner name is required';
//     if (!form.ownerEmail?.trim()) errors.ownerEmail = 'Owner email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) errors.ownerEmail = 'Invalid email address';
//     if (!form.ownerPhone?.trim()) errors.ownerPhone = 'Owner phone is required';
//     if (!form.ownerAadhar?.trim()) errors.ownerAadhar = 'Owner Aadhar is required';
//     if (!form.ownerPan?.trim()) errors.ownerPan = 'Owner PAN is required';
//     if (!form.aadharFile) errors.aadharFile = 'Aadhar document is required';
//     if (!form.panFile) errors.panFile = 'PAN document is required';

//     // Bank Information
//     if (!form.bankName?.trim()) errors.bankName = 'Bank name is required';
//     if (!form.accountHolderName?.trim()) errors.accountHolderName = 'Account holder name is required';
//     if (!form.accountNumber?.trim()) errors.accountNumber = 'Account number is required';
//     if (!form.ifscCode?.trim()) errors.ifscCode = 'IFSC code is required';
//     if (!form.cancelledCheque) errors.cancelledCheque = 'Cancelled cheque is required';

//     // Plan & Subscription
//     if (!form.plan) errors.plan = 'Plan is required';
//     if (!form.billingCycle) errors.billingCycle = 'Billing cycle is required';
//     if (!form.startDate) errors.startDate = 'Start date is required';
//     if (!form.endDate) errors.endDate = 'End date is required';

//     // Admin Information
//     if (!form.adminFirstName?.trim()) errors.adminFirstName = 'Admin first name is required';
//     if (!form.adminLastName?.trim()) errors.adminLastName = 'Admin last name is required';
//     if (!form.adminEmail?.trim()) errors.adminEmail = 'Admin email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) errors.adminEmail = 'Invalid email address';
//     if (!form.adminPhone?.trim()) errors.adminPhone = 'Admin phone is required';
//     if (!form.adminPassword) errors.adminPassword = 'Password is required';
//     else if (form.adminPassword.length < 8) errors.adminPassword = 'Minimum 8 characters';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const resetForm = () => {
//     setForm(emptyForm);
//     setFormErrors({});
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast('Please fill all required fields', 'error');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // Create FormData for file uploads
//       const formData = new FormData();
      
//       // Append all fields
//       Object.keys(form).forEach(key => {
//         if (form[key] !== null && form[key] !== undefined) {
//           formData.append(key, form[key]);
//         }
//       });

//       const res = await createTenant(formData);
//       setAddOpen(false);
//       setSuccessData({
//         name: form.name,
//         email: form.adminEmail,
//         domain: form.website || `${form.name.toLowerCase().replace(/\s+/g, '')}.com`,
//         loginLink: res?.data?.loginLink || `https://${form.name.toLowerCase().replace(/\s+/g, '')}.com/login`,
//       });
//       resetForm();
//       setSuccessOpen(true);
//       fetchTenants();
//     } catch(err) {
//       toast(err?.response?.data?.message || 'Failed to create organisation', 'error');
//     } finally { 
//       setSubmitting(false); 
//     }
//   };

//   /* ── Guard states ───────────────────────────────────────────────── */
//   if (loading && !refreshing) return (
//     <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', background:T.bg }}>
//       <Box textAlign="center">
//         <CircularProgress size={44} sx={{ color:T.indigo, mb:2 }} />
//         <Typography sx={{ color:T.muted, fontSize:13 }}>Loading dashboard…</Typography>
//       </Box>
//     </Box>
//   );
  
//   if (error) return (
//     <Alert severity="error" sx={{ m:3, borderRadius:'14px' }} onClose={() => setError(null)}>{error}</Alert>
//   );

//   /* ══════════════════════════════════════════════════════════════════
//      RENDER
//   ════════════════════════════════════════════════════════════════════ */
//   return (
//     <Box sx={{ minHeight:'100vh', background:T.bg, p:{ xs:1.5, sm:2.5, md:3  }, ml:"190px", mt:"60px" }}>

//       {/* ── Header ─────────────────────────────────────────────────── */}
//       <Box sx={{
//         display:'flex', justifyContent:'space-between', alignItems:'center',
//         mb:3, flexWrap:'wrap', gap:1.5, width:"1300px"
//       }}>
//         <Box sx={{ display:'flex', alignItems:'center', gap:1.5, ml:4 }}>
//           <Box sx={{ p:1, borderRadius:'12px', background:T.indigo, display:'flex', flexShrink:0 }}>
//             <BusinessIcon sx={{ color:'#fff', fontSize:22 }} />
//           </Box>
//           <Box>
//             <Typography sx={{
//               fontSize:{ xs:16, sm:20, md:23 }, fontWeight:800,
//               color:T.navy, lineHeight:1.2, letterSpacing:-.4, 
//             }}>
//               Organization Management
//             </Typography>
//             <Typography sx={{ fontSize:12, color:T.muted }}>
//               Manage tenants, credentials &amp; configurations
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display:'flex', gap:1 }}>
//           <Button onClick={handleRefresh} disabled={refreshing}
//             startIcon={<RefreshIcon sx={{ fontSize:'16px !important' }} />}
//             sx={{
//               borderRadius:'10px', textTransform:'none', fontWeight:600, fontSize:13,
//               color:T.slate, background:T.card, border:`1px solid ${T.border}`,
//               px:{ xs:1.5, sm:2 }, minWidth:0, '&:hover':{ background:T.bg }
//             }}>
//             <Box component="span" sx={{ display:{ xs:'none', sm:'inline' } }}>
//               {refreshing ? 'Refreshing…' : 'Refresh'}
//             </Box>
//           </Button>
//           <Button onClick={() => setAddOpen(true)}
//             startIcon={<AddIcon sx={{ fontSize:'16px !important' }} />}
//             variant="contained"
//             sx={{
//               borderRadius:'10px', textTransform:'none', fontWeight:700, fontSize:13,
//               background:T.indigo, px:{ xs:1.5, sm:2.5 },
//               boxShadow:`0 4px 16px ${T.indigo}50`,
//               '&:hover':{ background:T.indigoL }
//             }}>
//             <Box component="span" sx={{ display:{ xs:'none', sm:'inline' } }}>Add Organisation</Box>
//             <Box component="span" sx={{ display:{ xs:'inline', sm:'none' } }}>Add</Box>
//           </Button>
//         </Box>
//       </Box>

//       {/* ── Stat Cards ─────────────────────────────────────────────── */}
//       <Box sx={{  pl: 4, pr: 0, mb: 2.5 }}> 
//         <Grid container spacing={2} >
//           {[
//             { title: 'Total Tenants', value: total, icon: <PeopleIcon />, from: '#4F46E5', to: '#7C3AED', sub: 'All registered' },
//             { title: 'Active Tenants', value: activeCount, icon: <ActiveIcon />, from: '#059669', to: '#10B981', sub: `${Math.round((activeCount / Math.max(total, 1)) * 100)}% of total` },
//             { title: 'Inactive', value: inactiveCount, icon: <InactiveIcon />, from: '#E11D48', to: '#F43F5E', sub: `${Math.round((inactiveCount / Math.max(total, 1)) * 100)}% of total` },
//             { title: 'Growth Rate', value: '+22%', icon: <BarChartIcon />, from: '#D97706', to: '#F59E0B', sub: 'Quarterly increase' },
//           ].map((s, i) => (
//             <Grid item key={i} xs={12} sm={6} md={3}>
//               <StatCard {...s} sx={{ height: '100%', width: '100%' }} />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* ── Main two-column grid ────────────────────────────────────── */}
//       <Grid container spacing={{ xs:2, sm:2.5 }}>

//         {/* ── Left column ─────────────────────────────────────────── */}
//         <Grid item xs={12} lg={8}>

//           {/* Charts */}
//           <Grid container spacing={{ xs:2, sm:2 }} sx={{ mb:2.5 }}>
//             <Grid item xs={12} md={7}>
//               <Card sx={{
//                 p:2.5, borderRadius:'20px', border:`1px solid ${T.border}`,
//                 boxShadow:'none', height:280, ml:4
//               }}>
//                 <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1.5,width:"350px" }}>
//                   <Box>
//                     <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy, }}>Tenant Activity</Typography>
//                     <Typography sx={{ fontSize:11, color:T.muted }}>Monthly active vs inactive</Typography>
//                   </Box>
//                   <Chip label="6 months" size="small"
//                     sx={{ fontSize:10, background:'#EEF2FF', color:T.indigo, fontWeight:700 }} />
//                 </Box>
//                 <ResponsiveContainer width="100%" height="80%">
//                   <AreaChart data={activityData} margin={{ left:-20, right:8 }}>
//                     <defs>
//                       <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%"  stopColor={T.emerald} stopOpacity={.28} />
//                         <stop offset="95%" stopColor={T.emerald} stopOpacity={0}  />
//                       </linearGradient>
//                       <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%"  stopColor={T.rose} stopOpacity={.28} />
//                         <stop offset="95%" stopColor={T.rose} stopOpacity={0}  />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
//                     <XAxis dataKey="name" tick={{ fill:T.muted, fontSize:10 }} axisLine={false} tickLine={false} />
//                     <YAxis tick={{ fill:T.muted, fontSize:10 }} axisLine={false} tickLine={false} />
//                     <ChartTooltip content={<CTooltip />} />
//                     <Area type="monotone" dataKey="active"   name="Active"   stroke={T.emerald} strokeWidth={2.5} fill="url(#gA)" />
//                     <Area type="monotone" dataKey="inactive" name="Inactive" stroke={T.rose}    strokeWidth={2.5} fill="url(#gI)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={5}>
//               <Card sx={{
//                 p:2.5, borderRadius:'20px', border:`1px solid ${T.border}`,
//                 boxShadow:'none', height:280
//               }}>
//                 <Box sx={{ mb:1, width:"350px" }}>
//                   <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Status Distribution</Typography>
//                   <Typography sx={{ fontSize:11, color:T.muted }}>Current tenant states</Typography>
//                 </Box>
//                 <Box sx={{ display:'flex', gap:2.5, mb:1 }}>
//                   {pieData.map((d,i) => (
//                     <Box key={d.name} sx={{ display:'flex', alignItems:'center', gap:.6 }}>
//                       <Box sx={{ width:8, height:8, borderRadius:'50%', background:PIE_CLR[i], flexShrink:0 }} />
//                       <Typography sx={{ fontSize:11, color:T.slate, fontWeight:500 }}>{d.name}: <b style={{ color:T.navy }}>{d.value}</b></Typography>
//                     </Box>
//                   ))}
//                 </Box>
//                 <ResponsiveContainer width="100%" height="75%">
//                   <PieChart margin={{ top:10, right:10, bottom:10, left:10 }}>
//                     <Pie
//                       data={pieData}
//                       cx="50%" cy="50%"
//                       innerRadius={42} outerRadius={60}
//                       paddingAngle={4}
//                       dataKey="value"
//                       isAnimationActive={true}
//                     >
//                       {pieData.map((_,i) => <Cell key={i} fill={PIE_CLR[i % PIE_CLR.length]} />)}
//                     </Pie>
//                     <ChartTooltip content={<CTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* Search & filter */}
//           <Card sx={{ p:2, mb:2, borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none' , ml:4}}>
//             <Grid container spacing={1.5} alignItems="center">
//               <Grid item xs={12} sm={6}>
//                 <TextField fullWidth size="small" placeholder="Search by name or domain…"
//                   value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color:T.muted, fontSize:17 }} /></InputAdornment>,
//                     sx: { borderRadius:'10px', background:T.bg, fontSize:13 }
//                   }}
//                   sx={{ '& fieldset':{ borderColor:T.border } }} />
//               </Grid>
//               <Grid item xs={6} sm={4}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel sx={{ fontSize:13 , ml:"400px"}}>Status</InputLabel>
//                   <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//                     label="Status" sx={{ borderRadius:'10px', fontSize:13, background:T.bg, ml:"400px" }}>
//                     <MenuItem value="all">All Status</MenuItem>
//                     <MenuItem value="active">Active</MenuItem>
//                     <MenuItem value="inactive">Inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={6} sm={2} sx={{ textAlign:'right' }}>
//                 <Typography sx={{ fontSize:12, color:T.muted }}>
//                   <b style={{ color:T.navy }}>{filtered.length}</b>/{total}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Card>

//           {/* Table */}
//           <Card sx={{ borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden', ml:4, width:"800px" }}>
//             <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
//               <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Tenant List</Typography>
//               <Chip label={`${filtered.length} results`} size="small"
//                 sx={{ fontSize:10, background:'#EEF2FF', color:T.indigo, fontWeight:700 }} />
//             </Box>
//             <Box sx={{ overflowX:'auto' }}>
//               <Table sx={{ minWidth:520 }}>
//                 <TableHead>
//                   <TableRow sx={{ background:T.bg }}>
//                     {['Tenant','Domain','Created','Status','Actions'].map((h,i) => (
//                       <TableCell key={h} align={i===4 ? 'right' : 'left'}
//                         sx={{
//                           fontWeight:700, fontSize:10, color:T.muted, textTransform:'uppercase',
//                           letterSpacing:.6, borderBottom:`1px solid ${T.border}`,
//                           py:1.2, px:i===0 ? 2.5 : 1.5, whiteSpace:'nowrap'
//                         }}>
//                         {h}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filtered.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={5} align="center" sx={{ py:6, color:T.muted, fontSize:13 }}>
//                         No tenants match your search
//                       </TableCell>
//                     </TableRow>
//                   )}
//                   {filtered.map(t => (
//                     <TableRow key={t._id} sx={{ '&:last-child td':{ border:0 }, '&:hover':{ background:'#F8FAFC' } }}>
//                       <TableCell sx={{ px:2.5, py:1.3 }}>
//                         <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
//                           <Avatar sx={{ width:34, height:34, background:T.indigo, fontSize:13, fontWeight:700 }}>
//                             {t.name?.charAt(0)}
//                           </Avatar>
//                           <Box>
//                             <Typography sx={{ fontWeight:600, fontSize:13, color:T.navy, lineHeight:1.3 }}>{t.name}</Typography>
//                             <Typography sx={{ fontSize:11, color:T.muted }}>{t.email}</Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ px:1.5, py:1.3 }}>
//                         <Chip label={t.domain} size="small"
//                           sx={{ fontSize:11, background:T.bg, color:T.slate, fontWeight:500, border:`1px solid ${T.border}` }} />
//                       </TableCell>
//                       <TableCell sx={{ px:1.5, py:1.3 }}>
//                         <Typography sx={{ fontSize:12, color:T.navy, whiteSpace:'nowrap' }}>
//                           {new Date(t.createdAt).toLocaleDateString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ px:1.5, py:1.3 }}>
//                         <Box sx={{ display:'flex', alignItems:'center', gap:.8 }}>
//                           <Switch checked={t.isActive} size="small" onChange={() => toggleStatus(t._id, t.isActive)}
//                             sx={{
//                               '& .MuiSwitch-thumb': { background: t.isActive ? T.emerald : T.rose },
//                               '& .MuiSwitch-track': { background: t.isActive ? `${T.emerald}40` : `${T.rose}40` }
//                             }} />
//                           <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
//                             sx={{
//                               fontSize:10, fontWeight:700, px:.3,
//                               background: t.isActive ? '#D1FAE5' : '#FFE4E6',
//                               color:      t.isActive ? '#065F46' : '#9F1239'
//                             }} />
//                         </Box>
//                       </TableCell>
//                       <TableCell align="right" sx={{ px:1.5, py:1.3 }}>
//                         <Box sx={{ display:'flex', justifyContent:'flex-end', gap:.5 }}>
//                           {[
//                             { tip:'Resend Email', icon:<EmailIcon />,      color:T.sky,    fn:() => handleResendEmail(t)                          },
//                             { tip:'View Details', icon:<VisibilityIcon />, color:T.indigo, fn:() => { setSelectedTenant(t); setViewOpen(true); }   },
//                             { tip:'Edit',         icon:<EditIcon />,       color:T.amber,  fn:() => navigate(`/superadmin/tenants/edit/${t._id}`)  },
//                             { tip:'Delete',       icon:<DeleteIcon />,     color:T.rose,   fn:() => { setTenantToDelete(t); setDeleteOpen(true); } },
//                           ].map(a => (
//                             <Tooltip key={a.tip} title={a.tip} arrow>
//                               <IconButton onClick={a.fn} size="small"
//                                 sx={{
//                                   borderRadius:'8px', p:.55, color:a.color, background:`${a.color}14`,
//                                   '&:hover':{ background:a.color, color:'#fff' }, transition:'all .15s'
//                                 }}>
//                                 {React.cloneElement(a.icon, { sx:{ fontSize:15 } })}
//                               </IconButton>
//                             </Tooltip>
//                           ))}
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Card>
//         </Grid>

//         {/* ── Right sidebar ───────────────────────────────────────── */}
//         <Grid item xs={12} lg={4}>
//           <Box sx={{ display:'flex', flexDirection:{ xs:'column', sm:'row', lg:'column' }, gap:2 }}>

//             {/* Recent Activity */}
//             <Card sx={{ flex:1, borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden' }}>
//               <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
//                 <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Recent Activity</Typography>
//               </Box>
//               <Box sx={{ maxHeight:{ xs:200, lg:290 }, overflowY:'auto', p:1.5, display:'flex', flexDirection:'column', gap:.8 }}>
//                 {[
//                   "Created new tenant 'Acme Corp'",
//                   "Updated 'Tech Solutions' settings",
//                   "Deactivated 'Global Enterprises'",
//                   "Admin logged in to dashboard",
//                   "Generated monthly report",
//                   "Added new admin user",
//                   "Password changed successfully",
//                   "Viewed tenant details",
//                 ].map((msg,i) => (
//                   <Box key={i} sx={{ display:'flex', gap:1.2, p:1.2, borderRadius:'10px', background:T.bg }}>
//                     <Avatar sx={{ width:28, height:28, background:T.indigo, fontSize:11, flexShrink:0 }}>U</Avatar>
//                     <Box sx={{ flex:1, minWidth:0 }}>
//                       <Box sx={{ display:'flex', justifyContent:'space-between' }}>
//                         <Typography sx={{ fontSize:11, fontWeight:600, color:T.navy }}>System</Typography>
//                         <Typography sx={{ fontSize:10, color:T.muted }}>{i+1}h ago</Typography>
//                       </Box>
//                       <Typography sx={{ fontSize:11, color:T.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//                         {msg}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 ))}
//               </Box>
//             </Card>

//             {/* Latest Tenants */}
//             <Card sx={{ flex:1, borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden' }}>
//               <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
//                 <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Latest Tenants</Typography>
//               </Box>
//               <Box sx={{ maxHeight:{ xs:200, lg:290 }, overflowY:'auto', p:1.5, display:'flex', flexDirection:'column', gap:.8 }}>
//                 {tenants.slice(0,6).map(t => (
//                   <Box key={t._id} sx={{ display:'flex', alignItems:'center', gap:1.2, p:1.2, borderRadius:'10px', background:T.bg }}>
//                     <Avatar sx={{ width:32, height:32, background:T.indigo, fontSize:12, fontWeight:700, flexShrink:0 }}>
//                       {t.name?.charAt(0)}
//                     </Avatar>
//                     <Box sx={{ flex:1, minWidth:0 }}>
//                       <Typography sx={{ fontSize:12, fontWeight:600, color:T.navy, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//                         {t.name}
//                       </Typography>
//                       <Typography sx={{ fontSize:10, color:T.muted }}>{t.domain}</Typography>
//                     </Box>
//                     <Box sx={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:.4, flexShrink:0 }}>
//                       <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
//                         sx={{
//                           fontSize:9, fontWeight:700, height:16, px:.2,
//                           background: t.isActive ? '#D1FAE5' : '#FFE4E6',
//                           color:      t.isActive ? '#065F46' : '#9F1239'
//                         }} />
//                       <Button size="small" onClick={() => { setSelectedTenant(t); setViewOpen(true); }}
//                         sx={{ fontSize:10, textTransform:'none', color:T.indigo, p:0, minWidth:'auto', fontWeight:600, lineHeight:1 }}>
//                         View
//                       </Button>
//                     </Box>
//                   </Box>
//                 ))}
//               </Box>
//             </Card>

//             {/* Quick Actions */}
//             <Card sx={{ borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden', width:"400px" }}>
//               <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
//                 <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Quick Actions</Typography>
//               </Box>
//               <Box sx={{ p:1.5, display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
//                 {[
//                   { label:'Add Tenant', icon:<AddIcon />,      variant:'filled',  fn:() => setAddOpen(true) },
//                   { label:'Settings',   icon:<SettingsIcon />, variant:'outline', fn:()=>{} },
//                   { label:'Users',      icon:<PeopleIcon />,   variant:'outline', fn:()=>{} },
//                   { label:'Reports',    icon:<BarChartIcon />, variant:'outline', fn:()=>{} },
//                 ].map(a => (
//                   <Button key={a.label} onClick={a.fn}
//                     startIcon={React.cloneElement(a.icon, { sx:{ fontSize:'15px !important' } })} fullWidth
//                     sx={{
//                       borderRadius:'10px', textTransform:'none', fontWeight:600, fontSize:12, py:1.1,
//                       ...(a.variant === 'filled'
//                         ? { background:T.indigo, color:'#fff', boxShadow:`0 3px 10px ${T.indigo}40`, '&:hover':{ background:T.indigoL } }
//                         : { background:T.bg, color:T.slate, border:`1px solid ${T.border}`, '&:hover':{ background:T.border } })
//                     }}>
//                     {a.label}
//                   </Button>
//                 ))}
//               </Box>
//             </Card>

//           </Box>
//         </Grid>
//       </Grid>

//       {/* ════════════════════════════════════════════════════════════════
//           ADD ORGANISATION DIALOG — Single Form
//       ════════════════════════════════════════════════════════════════ */}
//       <Dialog
//         open={addOpen}
//         onClose={() => { setAddOpen(false); resetForm(); }}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '28px',
//             overflow: 'hidden',
//             p: 0,
//             boxShadow: '0 32px 80px rgba(15,23,42,0.28)',
//             maxHeight: '90vh'
//           }
//         }}
//       >
//         {/* Gradient header */}
//         <Box sx={{
//           background: `linear-gradient(135deg, #3730A3 0%, ${T.indigo} 45%, #7C3AED 100%)`,
//           px: 4,
//           pt: 3,
//           pb: 2,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box sx={{
//               p: 1.2,
//               borderRadius: '14px',
//               background: 'rgba(255,255,255,0.18)',
//               display: 'flex',
//               boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
//             }}>
//               <BusinessIcon sx={{ color: '#fff', fontSize: 26 }} />
//             </Box>
//             <Box>
//               <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#fff', lineHeight: 1.2, letterSpacing: -0.3 }}>
//                 New Organisation
//               </Typography>
//               <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', mt: 0.3 }}>
//                 Fill in all details to register a new organisation
//               </Typography>
//             </Box>
//           </Box>
//           <IconButton
//             onClick={() => { setAddOpen(false); resetForm(); }}
//             sx={{
//               color: 'rgba(255,255,255,0.75)',
//               p: 0.7,
//               borderRadius: '10px',
//               '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.15)' }
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {/* Form Container with Scroll */}
//         <Box sx={{
//           maxHeight: 'calc(90vh - 80px)',
//           overflowY: 'auto',
//           '&::-webkit-scrollbar': { width: 6 },
//           '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
//           '&::-webkit-scrollbar-thumb': {
//             background: T.indigo,
//             borderRadius: 3,
//             '&:hover': { background: T.indigoL }
//           }
//         }}>
//           <OrganizationForm
//             formData={form}
//             setFormData={setForm}
//             formErrors={formErrors}
//             setFormErrors={setFormErrors}
//             onSubmit={handleSubmit}
//             onCancel={() => { setAddOpen(false); resetForm(); }}
//             submitting={submitting}
//           />
//         </Box>
//       </Dialog>

//       {/* ════════════════════════════════════════════════════════════════
//           SUCCESS DIALOG
//       ════════════════════════════════════════════════════════════════ */}
//       <Dialog
//         open={successOpen}
//         onClose={() => setSuccessOpen(false)}
//         maxWidth="xs" 
//         fullWidth
//         PaperProps={{ sx:{ borderRadius:'24px', overflow:'hidden', p:0 } }}>
//         {/* Green gradient header */}
//         <Box sx={{
//           background:`linear-gradient(135deg, #059669 0%, ${T.emerald} 60%, #34D399 100%)`,
//           px:3, pt:3.5, pb:3, textAlign:'center', position:'relative', overflow:'hidden'
//         }}>
//           <Box sx={{ position:'absolute', top:-30, left:-30, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
//           <Box sx={{ position:'absolute', bottom:-20, right:-20, width:80,  height:80,  borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
//           <Box sx={{ position:'relative', zIndex:1 }}>
//             <Box sx={{
//               width:64, height:64, borderRadius:'50%',
//               background:'rgba(255,255,255,0.22)',
//               display:'flex', alignItems:'center', justifyContent:'center',
//               mx:'auto', mb:1.5,
//               boxShadow:'0 0 0 12px rgba(255,255,255,0.08)',
//             }}>
//               <ActiveIcon sx={{ color:'#fff', fontSize:34 }} />
//             </Box>
//             <Typography sx={{ fontWeight:800, fontSize:21, color:'#fff', mb:.5 }}>
//               Organisation Added! 🎉
//             </Typography>
//             <Typography sx={{ fontSize:13, color:'rgba(255,255,255,0.80)' }}>
//               Successfully registered and notified
//             </Typography>
//           </Box>
//         </Box>

//         {/* Body */}
//         <Box sx={{ px:3, py:2.5 }}>
//           <Box sx={{
//             display:'flex', alignItems:'center', gap:1.5,
//             p:1.8, background:'#F0FDF4', borderRadius:'14px',
//             border:'1px solid #BBF7D0', mb:2
//           }}>
//             <Avatar sx={{
//               width:42, height:42, fontWeight:800, fontSize:16, flexShrink:0,
//               background:`linear-gradient(135deg, #059669, ${T.emerald})`
//             }}>
//               {successData?.name?.charAt(0)}
//             </Avatar>
//             <Box sx={{ flex:1, minWidth:0 }}>
//               <Typography sx={{ fontWeight:700, fontSize:15, color:'#065F46', lineHeight:1.3 }}>
//                 {successData?.name}
//               </Typography>
//               <Typography sx={{ fontSize:12, color:'#047857' }}>{successData?.domain}</Typography>
//             </Box>
//             <Chip label="Active" size="small"
//               sx={{ background:'#D1FAE5', color:'#065F46', fontWeight:700, fontSize:10, flexShrink:0 }} />
//           </Box>

//           <Box sx={{
//             display:'flex', alignItems:'flex-start', gap:1.3,
//             p:1.8, background:'#EFF6FF', borderRadius:'14px',
//             border:'1px solid #BFDBFE', mb:2
//           }}>
//             <MailSentIcon sx={{ color:'#2563EB', fontSize:22, mt:.1, flexShrink:0 }} />
//             <Box>
//               <Typography sx={{ fontWeight:700, fontSize:13, color:'#1E40AF' }}>
//                 Credentials Sent!
//               </Typography>
//               <Typography sx={{ fontSize:12, color:'#3B82F6', mt:.3, lineHeight:1.5 }}>
//                 Login credentials have been sent to<br />
//                 <b>{successData?.email}</b>
//               </Typography>
//             </Box>
//           </Box>
//         </Box>

//         <Box sx={{ px:3, pb:3 }}>
//           <Button fullWidth onClick={() => setSuccessOpen(false)} variant="contained"
//             sx={{
//               borderRadius:'10px', textTransform:'none', fontWeight:700, py:1.2,
//               background:`linear-gradient(135deg, #059669, ${T.emerald})`,
//               boxShadow:'0 4px 16px rgba(16,185,129,0.4)',
//               '&:hover':{ opacity:.9 }
//             }}>
//             Done
//           </Button>
//         </Box>
//       </Dialog>

//       {/* ── View Tenant Dialog ──────────────────────────────────────── */}
//       <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="xs" fullWidth
//         PaperProps={{ sx:{ borderRadius:'20px', overflow:'hidden', p:0 } }}>
//         <Box sx={{ px:3, pt:2.5, pb:2, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:1.5 }}>
//           <Avatar sx={{ background:T.indigo, width:38, height:38, fontWeight:700 }}>
//             {selectedTenant?.name?.charAt(0)}
//           </Avatar>
//           <Box>
//             <Typography sx={{ fontWeight:800, fontSize:15, color:T.navy }}>{selectedTenant?.name}</Typography>
//             <Typography sx={{ fontSize:11, color:T.muted }}>Tenant Details</Typography>
//           </Box>
//           <IconButton onClick={() => setViewOpen(false)} size="small" sx={{ ml:'auto', color:T.muted }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//         <Box sx={{ px:3, py:2 }}>
//           {selectedTenant && [
//             ['Domain',       selectedTenant.domain],
//             ['Email',        selectedTenant.email],
//             ['Created',      new Date(selectedTenant.createdAt).toLocaleDateString()],
//             ['Last Updated', new Date(selectedTenant.updatedAt).toLocaleDateString()],
//           ].map(([k,v]) => (
//             <Box key={k} sx={{ display:'flex', justifyContent:'space-between', py:1, borderBottom:`1px solid ${T.border}` }}>
//               <Typography sx={{ fontSize:12, color:T.muted, fontWeight:600 }}>{k}</Typography>
//               <Typography sx={{ fontSize:12, color:T.navy, fontWeight:500 }}>{v}</Typography>
//             </Box>
//           ))}
//           <Box sx={{ display:'flex', justifyContent:'space-between', py:1 }}>
//             <Typography sx={{ fontSize:12, color:T.muted, fontWeight:600 }}>Status</Typography>
//             <Chip label={selectedTenant?.isActive ? 'Active' : 'Inactive'} size="small"
//               sx={{
//                 fontSize:10, fontWeight:700,
//                 background: selectedTenant?.isActive ? '#D1FAE5' : '#FFE4E6',
//                 color:      selectedTenant?.isActive ? '#065F46' : '#9F1239'
//               }} />
//           </Box>
//         </Box>
//         <Box sx={{ px:3, pb:3, display:'flex', gap:1 }}>
//           <Button fullWidth onClick={() => setViewOpen(false)}
//             sx={{ borderRadius:'10px', textTransform:'none', fontWeight:600, color:T.slate, border:`1px solid ${T.border}` }}>
//             Close
//           </Button>
//           <Button fullWidth variant="contained"
//             onClick={() => navigate(`/superadmin/tenants/edit/${selectedTenant?._id}`)}
//             sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:T.indigo, '&:hover':{ background:T.indigoL } }}>
//             Edit
//           </Button>
//         </Box>
//       </Dialog>

//       {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
//       <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
//         PaperProps={{ sx:{ borderRadius:'20px', overflow:'hidden', p:0 } }}>
//         <Box sx={{ px:3, pt:2.5, pb:2, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:1.2 }}>
//           <Box sx={{ p:.8, borderRadius:'10px', background:'#FFE4E6', display:'flex', flexShrink:0 }}>
//             <DeleteIcon sx={{ color:T.rose, fontSize:20 }} />
//           </Box>
//           <Typography sx={{ fontWeight:800, fontSize:16, color:T.navy }}>Delete Organisation</Typography>
//         </Box>
//         <Box sx={{ px:3, py:2.5 }}>
//           <Typography sx={{ fontSize:14, color:T.slate }}>
//             Are you sure you want to permanently delete{' '}
//             <b style={{ color:T.navy }}>{tenantToDelete?.name}</b>?
//           </Typography>
//           <Box sx={{ mt:1.5, p:1.5, borderRadius:'10px', background:'#FFF1F2', border:'1px solid #FECDD3' }}>
//             <Typography sx={{ fontSize:12, color:T.rose }}>
//               ⚠ This cannot be undone and removes all associated data.
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ px:3, pb:3, display:'flex', gap:1 }}>
//           <Button fullWidth onClick={() => setDeleteOpen(false)}
//             sx={{ borderRadius:'10px', textTransform:'none', fontWeight:600, color:T.slate, border:`1px solid ${T.border}` }}>
//             Cancel
//           </Button>
//           <Button fullWidth onClick={handleDelete} variant="contained"
//             sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:T.rose, '&:hover':{ background:'#E11D48' } }}>
//             Delete
//           </Button>
//         </Box>
//       </Dialog>

//       {/* ── Snackbar ───────────────────────────────────────────────── */}
//       <Snackbar
//         open={snackbar.open} 
//         autoHideDuration={4000}
//         onClose={() => setSnackbar(s => ({ ...s, open:false }))}
//         anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar(s => ({ ...s, open:false }))}
//           sx={{ borderRadius:'12px', fontWeight:600, boxShadow:'0 8px 24px rgba(0,0,0,.14)' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//     </Box>
//   );
// };

// export default SuperAdminDashboard;















// import React, { useState, useEffect } from 'react';
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, CircularProgress, Alert, Button, Avatar,
//   IconButton, Dialog, DialogContent, Grid, Card, Chip, Switch,
//   TextField, InputAdornment, MenuItem, Select, Tooltip, Snackbar,
//   FormControl, InputLabel, useMediaQuery, Stepper, Step, StepLabel
// } from '@mui/material';
// import {
//   Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
//   Visibility as VisibilityIcon, Search as SearchIcon,
//   CheckCircle as ActiveIcon, Cancel as InactiveIcon,
//   Refresh as RefreshIcon, TrendingUp as TrendingUpIcon,
//   People as PeopleIcon, Business as BusinessIcon,
//   Settings as SettingsIcon, Email as EmailIcon,
//   ContentCopy as CopyIcon, Close as CloseIcon,
//   MarkEmailRead as MailSentIcon, BarChart as BarChartIcon,
//   Phone as PhoneIcon, Language as LanguageIcon,
//   LocationOn as LocationIcon, Person as PersonIcon,
//   NavigateNext as NextIcon, NavigateBefore as PrevIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip as ChartTooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend
// } from 'recharts';
// import {
//   getTenants, createTenant, updateTenantStatus,
//   deleteTenant, resendWelcomeEmail
// } from '../../services/tenantService';
// import OrganizationForm from '../../components/OrganizationForm';

// /* ── Design tokens ────────────────────────────────────────────────────── */
// const T = {
//   navy:    '#0F172A',
//   slate:   '#334155',
//   muted:   '#64748B',
//   border:  '#E2E8F0',
//   bg:      '#F1F5F9',
//   card:    '#FFFFFF',
//   indigo:  '#4F46E5',
//   indigoL: '#818CF8',
//   emerald: '#10B981',
//   rose:    '#F43F5E',
//   amber:   '#F59E0B',
//   sky:     '#0EA5E9',
// };

// /* ── Stat Card ────────────────────────────────────────────────────────── */
// const StatCard = ({ title, value, icon, from, to, sub }) => (
//   <Card sx={{
//     p: 2.5, borderRadius: '20px', border: 'none', height: '100%',
//     background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
//     color: '#fff', position: 'relative', overflow: 'hidden',
//     boxShadow: `0 8px 28px ${from}55`,
//     transition: 'transform .22s, box-shadow .22s',
//     '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 14px 36px ${from}77` },
//   }}>
//     <Box sx={{ position: 'absolute', top: -28, right: -28, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
//     <Box sx={{ position: 'relative', zIndex: 1, width: "250px" }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
//         <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: .8, letterSpacing: .8, textTransform: 'uppercase' }}>{title}</Typography>
//         <Box sx={{ p: .7, borderRadius: '8px', background: 'rgba(255,255,255,0.18)', display: 'flex' }}>
//           {React.cloneElement(icon, { sx: { fontSize: 17 } })}
//         </Box>
//       </Box>
//       <Typography sx={{ fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: -1, mb: 1.2 }}>{value}</Typography>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
//         <TrendingUpIcon sx={{ fontSize: 13, opacity: .7 }} />
//         <Typography sx={{ fontSize: 11, opacity: .8 }}>{sub}</Typography>
//       </Box>
//     </Box>
//   </Card>
// );

// /* ── Chart Tooltip ────────────────────────────────────────────────────── */
// const CTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <Box sx={{ background: T.navy, borderRadius: '10px', p: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,.3)' }}>
//       <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700, mb: .5 }}>{label}</Typography>
//       {payload.map((p, i) => (
//         <Typography key={i} sx={{ color: p.color, fontSize: 11 }}>{p.name}: <b>{p.value}</b></Typography>
//       ))}
//     </Box>
//   );
// };

// /* ════════════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════ */
// const SuperAdminDashboard = () => {
//   const navigate = useNavigate();

//   /* ── State ──────────────────────────────────────────────────────── */
//   const [tenants,        setTenants]        = useState([]);
//   const [loading,        setLoading]        = useState(true);
//   const [error,          setError]          = useState(null);
//   const [refreshing,     setRefreshing]     = useState(false);
//   const [searchTerm,     setSearchTerm]     = useState('');
//   const [statusFilter,   setStatusFilter]   = useState('all');
//   const [snackbar,       setSnackbar]       = useState({ open: false, message: '', severity: 'success' });

//   const [addOpen,        setAddOpen]        = useState(false);
//   const [successOpen,    setSuccessOpen]    = useState(false);
//   const [viewOpen,       setViewOpen]       = useState(false);
//   const [deleteOpen,     setDeleteOpen]     = useState(false);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [tenantToDelete, setTenantToDelete] = useState(null);
//   const [successData,    setSuccessData]    = useState(null);
//   const [submitting,     setSubmitting]     = useState(false);

//   /* ── New form state with all fields ─────────────────────────────── */
//   const emptyForm = {
//     // Company Information
//     name: '',
//     industry: '',
//     website: '',
//     companyPhone: '',
//     email: '',
//     gstNumber: '',
//     companyPan: '',
//     registrationNumber: '',
//     gstCertificate: null,
//     companyPanFile: null,

//     // Owner Information
//     ownerName: '',
//     ownerEmail: '',
//     ownerPhone: '',
//     ownerAadhar: '',
//     ownerPan: '',
//     aadharFile: null,
//     panFile: null,

//     // Bank Information
//     bankName: '',
//     accountHolderName: '',
//     accountNumber: '',
//     ifscCode: '',
//     branch: '',
//     cancelledCheque: null,

//     // Plan & Subscription
//     plan: '',
//     billingCycle: '',
//     startDate: '',
//     endDate: '',

//     // Admin Information
//     adminFirstName: '',
//     adminLastName: '',
//     adminEmail: '',
//     adminPhone: '',
//     adminPassword: '',

//     // Company Address (keeping for backward compatibility)
//     street: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: '',
//   };

//   const [form, setForm] = useState(emptyForm);
//   const [formErrors, setFormErrors] = useState({});

//   /* ── Fetch ──────────────────────────────────────────────────────── */
//   const fetchTenants = async () => {
//     try {
//       setLoading(true);
//       const r = await getTenants();
//       setTenants(r.data.tenants || []);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => { fetchTenants(); }, []);

//   const handleRefresh = () => { setRefreshing(true); fetchTenants(); };

//   /* ── Derived ────────────────────────────────────────────────────── */
//   const activeCount   = tenants.filter(t => t.isActive).length;
//   const inactiveCount = tenants.filter(t => !t.isActive).length;
//   const total         = tenants.length;

//   const filtered = tenants.filter(t => {
//     const s   = searchTerm.toLowerCase();
//     const ms  = t.name?.toLowerCase().includes(s) || t.domain?.toLowerCase().includes(s);
//     const mst = statusFilter === 'all'
//       || (statusFilter === 'active'   && t.isActive)
//       || (statusFilter === 'inactive' && !t.isActive);
//     return ms && mst;
//   });

//   const activityData = (() => {
//     const now    = new Date();
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return Array.from({ length: 6 }, (_, idx) => {
//       const mIdx = (now.getMonth() - 5 + idx + 12) % 12;
//       return {
//         name:     months[mIdx],
//         active:   tenants.filter(t => new Date(t.createdAt).getMonth() === mIdx &&  t.isActive).length,
//         inactive: tenants.filter(t => new Date(t.createdAt).getMonth() === mIdx && !t.isActive).length,
//       };
//     });
//   })();

//   const pieData = [{ name: 'Active', value: activeCount }, { name: 'Inactive', value: inactiveCount }];
//   const PIE_CLR = [T.emerald, T.rose];

//   /* ── Helpers ────────────────────────────────────────────────────── */
//   const toast = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
//   const copy  = text => navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!'));

//   /* ── Tenant actions ─────────────────────────────────────────────── */
//   const toggleStatus = async (id, cur) => {
//     try {
//       await updateTenantStatus(id, !cur);
//       setTenants(ts => ts.map(t => t._id === id ? { ...t, isActive: !cur } : t));
//       toast(`Tenant ${!cur ? 'activated' : 'deactivated'}`);
//     } catch {
//       toast('Failed to update status', 'error');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteTenant(tenantToDelete._id);
//       setTenants(ts => ts.filter(t => t._id !== tenantToDelete._id));
//       setDeleteOpen(false);
//       toast('Tenant deleted successfully');
//     } catch {
//       toast('Failed to delete tenant', 'error');
//     }
//   };

//   const handleResendEmail = async (tenant) => {
//     try {
//       await resendWelcomeEmail(tenant._id);
//       toast('Welcome email resent!');
//     } catch {
//       toast('Failed to resend email', 'error');
//     }
//   };

//   /* ── Form validation ─────────────────────────────────────────────── */
//   const validateForm = () => {
//     const errors = {};

//     // Company Information
//     if (!form.name?.trim())         errors.name         = 'Organisation name is required';
//     if (!form.industry)             errors.industry     = 'Industry is required';
//     if (!form.companyPhone?.trim()) errors.companyPhone = 'Company phone is required';
//     if (!form.email?.trim())        errors.email        = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address';
//     if (!form.companyPan?.trim())   errors.companyPan   = 'Company PAN is required';
//     if (!form.gstCertificate)       errors.gstCertificate = 'GST certificate is required';
//     if (!form.companyPanFile)       errors.companyPanFile = 'Company PAN document is required';

//     // Owner Information
//     if (!form.ownerName?.trim())    errors.ownerName    = 'Owner name is required';
//     if (!form.ownerEmail?.trim())   errors.ownerEmail   = 'Owner email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) errors.ownerEmail = 'Invalid email address';
//     if (!form.ownerPhone?.trim())   errors.ownerPhone   = 'Owner phone is required';
//     if (!form.ownerAadhar?.trim())  errors.ownerAadhar  = 'Owner Aadhar is required';
//     if (!form.ownerPan?.trim())     errors.ownerPan     = 'Owner PAN is required';
//     if (!form.aadharFile)           errors.aadharFile   = 'Aadhar document is required';
//     if (!form.panFile)              errors.panFile      = 'PAN document is required';

//     // Bank Information
//     if (!form.bankName?.trim())           errors.bankName           = 'Bank name is required';
//     if (!form.accountHolderName?.trim())  errors.accountHolderName  = 'Account holder name is required';
//     if (!form.accountNumber?.trim())      errors.accountNumber      = 'Account number is required';
//     if (!form.ifscCode?.trim())           errors.ifscCode           = 'IFSC code is required';
//     if (!form.cancelledCheque)            errors.cancelledCheque    = 'Cancelled cheque is required';

//     // Plan & Subscription
//     if (!form.plan)         errors.plan         = 'Plan is required';
//     if (!form.billingCycle) errors.billingCycle = 'Billing cycle is required';
//     if (!form.startDate)    errors.startDate    = 'Start date is required';
//     if (!form.endDate)      errors.endDate      = 'End date is required';

//     // Admin Information
//     if (!form.adminFirstName?.trim()) errors.adminFirstName = 'Admin first name is required';
//     if (!form.adminLastName?.trim())  errors.adminLastName  = 'Admin last name is required';
//     if (!form.adminEmail?.trim())     errors.adminEmail     = 'Admin email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) errors.adminEmail = 'Invalid email address';
//     if (!form.adminPhone?.trim())     errors.adminPhone     = 'Admin phone is required';
//     if (!form.adminPassword)          errors.adminPassword  = 'Password is required';
//     else if (form.adminPassword.length < 8) errors.adminPassword = 'Minimum 8 characters';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const resetForm = () => { setForm(emptyForm); setFormErrors({}); };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast('Please fill all required fields', 'error');
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       Object.keys(form).forEach(key => {
//         if (form[key] !== null && form[key] !== undefined) {
//           formData.append(key, form[key]);
//         }
//       });
//       const res = await createTenant(formData);
//       setAddOpen(false);
//       setSuccessData({
//         name:      form.name,
//         email:     form.adminEmail,
//         domain:    form.website || `${form.name.toLowerCase().replace(/\s+/g, '')}.com`,
//         loginLink: res?.data?.loginLink || `https://${form.name.toLowerCase().replace(/\s+/g, '')}.com/login`,
//       });
//       resetForm();
//       setSuccessOpen(true);
//       fetchTenants();
//     } catch (err) {
//       toast(err?.response?.data?.message || 'Failed to create organisation', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ── Guard states ───────────────────────────────────────────────── */
//   if (loading && !refreshing) return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: T.bg }}>
//       <Box textAlign="center">
//         <CircularProgress size={44} sx={{ color: T.indigo, mb: 2 }} />
//         <Typography sx={{ color: T.muted, fontSize: 13 }}>Loading dashboard…</Typography>
//       </Box>
//     </Box>
//   );

//   if (error) return (
//     <Alert severity="error" sx={{ m: 3, borderRadius: '14px' }} onClose={() => setError(null)}>{error}</Alert>
//   );

//   /* ══════════════════════════════════════════════════════════════════
//      RENDER
//   ════════════════════════════════════════════════════════════════════ */
//   return (
//     <Box sx={{ minHeight: '100vh', background: T.bg, p: { xs: 1.5, sm: 2.5, md: 3 }, ml: "190px", mt: "60px" }}>

//       {/* ── Header ─────────────────────────────────────────────────── */}
//       <Box sx={{
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         mb: 3, flexWrap: 'wrap', gap: 1.5, width: "1300px"
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 4 }}>
//           <Box sx={{ p: 1, borderRadius: '12px', background: T.indigo, display: 'flex', flexShrink: 0 }}>
//             <BusinessIcon sx={{ color: '#fff', fontSize: 22 }} />
//           </Box>
//           <Box>
//             <Typography sx={{
//               fontSize: { xs: 16, sm: 20, md: 23 }, fontWeight: 800,
//               color: T.navy, lineHeight: 1.2, letterSpacing: -.4,
//             }}>
//               Organization Management
//             </Typography>
//             <Typography sx={{ fontSize: 12, color: T.muted }}>
//               Manage tenants, credentials &amp; configurations
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button onClick={handleRefresh} disabled={refreshing}
//             startIcon={<RefreshIcon sx={{ fontSize: '16px !important' }} />}
//             sx={{
//               borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: 13,
//               color: T.slate, background: T.card, border: `1px solid ${T.border}`,
//               px: { xs: 1.5, sm: 2 }, minWidth: 0, '&:hover': { background: T.bg }
//             }}>
//             <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
//               {refreshing ? 'Refreshing…' : 'Refresh'}
//             </Box>
//           </Button>
//           <Button onClick={() => setAddOpen(true)}
//             startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
//             variant="contained"
//             sx={{
//               borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: 13,
//               background: T.indigo, px: { xs: 1.5, sm: 2.5 },
//               boxShadow: `0 4px 16px ${T.indigo}50`,
//               '&:hover': { background: T.indigoL }
//             }}>
//             <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add Organisation</Box>
//             <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
//           </Button>
//         </Box>
//       </Box>

//       {/* ── Stat Cards ─────────────────────────────────────────────── */}
//       <Box sx={{ pl: 4, pr: 0, mb: 2.5 }}>
//         <Grid container spacing={2}>
//           {[
//             { title: 'Total Tenants',  value: total,        icon: <PeopleIcon />,   from: '#4F46E5', to: '#7C3AED', sub: 'All registered' },
//             { title: 'Active Tenants', value: activeCount,  icon: <ActiveIcon />,   from: '#059669', to: '#10B981', sub: `${Math.round((activeCount   / Math.max(total, 1)) * 100)}% of total` },
//             { title: 'Inactive',       value: inactiveCount, icon: <InactiveIcon />, from: '#E11D48', to: '#F43F5E', sub: `${Math.round((inactiveCount / Math.max(total, 1)) * 100)}% of total` },
//             { title: 'Growth Rate',    value: '+22%',        icon: <BarChartIcon />, from: '#D97706', to: '#F59E0B', sub: 'Quarterly increase' },
//           ].map((s, i) => (
//             <Grid item key={i} xs={12} sm={6} md={3}>
//               <StatCard {...s} sx={{ height: '100%', width: '100%' }} />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* ── Main two-column grid ────────────────────────────────────── */}
//       <Grid container spacing={{ xs: 2, sm: 2.5 }}>

//         {/* ── Left column ─────────────────────────────────────────── */}
//         <Grid item xs={12} lg={8}>

//           {/* Charts */}
//           <Grid container spacing={{ xs: 2, sm: 2 }} sx={{ mb: 2.5 }}>
//             <Grid item xs={12} md={7}>
//               <Card sx={{
//                 p: 2.5, borderRadius: '20px', border: `1px solid ${T.border}`,
//                 boxShadow: 'none', height: 280, ml: 4
//               }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, width: "350px" }}>
//                   <Box>
//                     <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Tenant Activity</Typography>
//                     <Typography sx={{ fontSize: 11, color: T.muted }}>Monthly active vs inactive</Typography>
//                   </Box>
//                   <Chip label="6 months" size="small"
//                     sx={{ fontSize: 10, background: '#EEF2FF', color: T.indigo, fontWeight: 700 }} />
//                 </Box>
//                 <ResponsiveContainer width="100%" height="80%">
//                   <AreaChart data={activityData} margin={{ left: -20, right: 8 }}>
//                     <defs>
//                       <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%"  stopColor={T.emerald} stopOpacity={.28} />
//                         <stop offset="95%" stopColor={T.emerald} stopOpacity={0} />
//                       </linearGradient>
//                       <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%"  stopColor={T.rose} stopOpacity={.28} />
//                         <stop offset="95%" stopColor={T.rose} stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
//                     <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
//                     <YAxis tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
//                     <ChartTooltip content={<CTooltip />} />
//                     <Area type="monotone" dataKey="active"   name="Active"   stroke={T.emerald} strokeWidth={2.5} fill="url(#gA)" />
//                     <Area type="monotone" dataKey="inactive" name="Inactive" stroke={T.rose}    strokeWidth={2.5} fill="url(#gI)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={5}>
//               <Card sx={{
//                 p: 2.5, borderRadius: '20px', border: `1px solid ${T.border}`,
//                 boxShadow: 'none', height: 280
//               }}>
//                 <Box sx={{ mb: 1, width: "350px" }}>
//                   <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Status Distribution</Typography>
//                   <Typography sx={{ fontSize: 11, color: T.muted }}>Current tenant states</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', gap: 2.5, mb: 1 }}>
//                   {pieData.map((d, i) => (
//                     <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: .6 }}>
//                       <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: PIE_CLR[i], flexShrink: 0 }} />
//                       <Typography sx={{ fontSize: 11, color: T.slate, fontWeight: 500 }}>{d.name}: <b style={{ color: T.navy }}>{d.value}</b></Typography>
//                     </Box>
//                   ))}
//                 </Box>
//                 <ResponsiveContainer width="100%" height="75%">
//                   <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
//                     <Pie
//                       data={pieData}
//                       cx="50%" cy="50%"
//                       innerRadius={42} outerRadius={60}
//                       paddingAngle={4}
//                       dataKey="value"
//                       isAnimationActive={true}
//                     >
//                       {pieData.map((_, i) => <Cell key={i} fill={PIE_CLR[i % PIE_CLR.length]} />)}
//                     </Pie>
//                     <ChartTooltip content={<CTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* Search & filter */}
//           <Card sx={{ p: 2, mb: 2, borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', ml: 4 }}>
//             <Grid container spacing={1.5} alignItems="center">
//               <Grid item xs={12} sm={6}>
//                 <TextField fullWidth size="small" placeholder="Search by name or domain…"
//                   value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: T.muted, fontSize: 17 }} /></InputAdornment>,
//                     sx: { borderRadius: '10px', background: T.bg, fontSize: 13 }
//                   }}
//                   sx={{ '& fieldset': { borderColor: T.border } }} />
//               </Grid>
//               <Grid item xs={6} sm={4}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel sx={{ fontSize: 13 }}>Status</InputLabel>
//                   <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//                     label="Status" sx={{ borderRadius: '10px', fontSize: 13, background: T.bg }}>
//                     <MenuItem value="all">All Status</MenuItem>
//                     <MenuItem value="active">Active</MenuItem>
//                     <MenuItem value="inactive">Inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
//                 <Typography sx={{ fontSize: 12, color: T.muted }}>
//                   <b style={{ color: T.navy }}>{filtered.length}</b>/{total}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Card>

//           {/* Table */}
//           <Card sx={{ borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', overflow: 'hidden', ml: 4, width: "800px" }}>
//             <Box sx={{ px: 2.5, py: 1.8, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Tenant List</Typography>
//               <Chip label={`${filtered.length} results`} size="small"
//                 sx={{ fontSize: 10, background: '#EEF2FF', color: T.indigo, fontWeight: 700 }} />
//             </Box>
//             <Box sx={{ overflowX: 'auto' }}>
//               <Table sx={{ minWidth: 520 }}>
//                 <TableHead>
//                   <TableRow sx={{ background: T.bg }}>
//                     {['Tenant', 'Domain', 'Created', 'Status', 'Actions'].map((h, i) => (
//                       <TableCell key={h} align={i === 4 ? 'right' : 'left'}
//                         sx={{
//                           fontWeight: 700, fontSize: 10, color: T.muted, textTransform: 'uppercase',
//                           letterSpacing: .6, borderBottom: `1px solid ${T.border}`,
//                           py: 1.2, px: i === 0 ? 2.5 : 1.5, whiteSpace: 'nowrap'
//                         }}>
//                         {h}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filtered.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={5} align="center" sx={{ py: 6, color: T.muted, fontSize: 13 }}>
//                         No tenants match your search
//                       </TableCell>
//                     </TableRow>
//                   )}
//                   {filtered.map(t => (
//                     <TableRow key={t._id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: '#F8FAFC' } }}>
//                       <TableCell sx={{ px: 2.5, py: 1.3 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                           <Avatar sx={{ width: 34, height: 34, background: T.indigo, fontSize: 13, fontWeight: 700 }}>
//                             {t.name?.charAt(0)}
//                           </Avatar>
//                           <Box>
//                             <Typography sx={{ fontWeight: 600, fontSize: 13, color: T.navy, lineHeight: 1.3 }}>{t.name}</Typography>
//                             <Typography sx={{ fontSize: 11, color: T.muted }}>{t.email}</Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ px: 1.5, py: 1.3 }}>
//                         <Chip label={t.domain} size="small"
//                           sx={{ fontSize: 11, background: T.bg, color: T.slate, fontWeight: 500, border: `1px solid ${T.border}` }} />
//                       </TableCell>
//                       <TableCell sx={{ px: 1.5, py: 1.3 }}>
//                         <Typography sx={{ fontSize: 12, color: T.navy, whiteSpace: 'nowrap' }}>
//                           {new Date(t.createdAt).toLocaleDateString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ px: 1.5, py: 1.3 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}>
//                           <Switch checked={t.isActive} size="small" onChange={() => toggleStatus(t._id, t.isActive)}
//                             sx={{
//                               '& .MuiSwitch-thumb': { background: t.isActive ? T.emerald : T.rose },
//                               '& .MuiSwitch-track': { background: t.isActive ? `${T.emerald}40` : `${T.rose}40` }
//                             }} />
//                           <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
//                             sx={{
//                               fontSize: 10, fontWeight: 700, px: .3,
//                               background: t.isActive ? '#D1FAE5' : '#FFE4E6',
//                               color:      t.isActive ? '#065F46' : '#9F1239'
//                             }} />
//                         </Box>
//                       </TableCell>
//                       <TableCell align="right" sx={{ px: 1.5, py: 1.3 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: .5 }}>
//                           {[
//                             { tip: 'Resend Email', icon: <EmailIcon />,      color: T.sky,    fn: () => handleResendEmail(t)                          },
//                             { tip: 'View Details', icon: <VisibilityIcon />, color: T.indigo, fn: () => { setSelectedTenant(t); setViewOpen(true); }   },
//                             { tip: 'Edit',         icon: <EditIcon />,       color: T.amber,  fn: () => navigate(`/superadmin/tenants/edit/${t._id}`)  },
//                             { tip: 'Delete',       icon: <DeleteIcon />,     color: T.rose,   fn: () => { setTenantToDelete(t); setDeleteOpen(true); } },
//                           ].map(a => (
//                             <Tooltip key={a.tip} title={a.tip} arrow>
//                               <IconButton onClick={a.fn} size="small"
//                                 sx={{
//                                   borderRadius: '8px', p: .55, color: a.color, background: `${a.color}14`,
//                                   '&:hover': { background: a.color, color: '#fff' }, transition: 'all .15s'
//                                 }}>
//                                 {React.cloneElement(a.icon, { sx: { fontSize: 15 } })}
//                               </IconButton>
//                             </Tooltip>
//                           ))}
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Card>
//         </Grid>

//         {/* ── Right sidebar ───────────────────────────────────────── */}
     
//       </Grid>

//       {/* ════════════════════════════════════════════════════════════════
//           ADD ORGANISATION DIALOG — OrganizationForm only, no extra header
//       ════════════════════════════════════════════════════════════════ */}
//       <Dialog
//         open={addOpen}
//         onClose={() => { setAddOpen(false); resetForm(); }}
//         maxWidth="md"
//         fullWidth
//         scroll="paper"
//         PaperProps={{
//           sx: {
//             borderRadius: '24px',
//             p: 0,
//             boxShadow: '0 32px 80px rgba(15,23,42,0.28)',
//             maxHeight: '90vh',
//             overflowY: 'auto',
//             '&::-webkit-scrollbar':       { width: 6 },
//             '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
//             '&::-webkit-scrollbar-thumb': { background: T.indigo, borderRadius: 3 },
//           }
//         }}
//       >
//         <OrganizationForm
//           formData={form}
//           setFormData={setForm}
//           formErrors={formErrors}
//           setFormErrors={setFormErrors}
//           onSubmit={handleSubmit}
//           onCancel={() => { setAddOpen(false); resetForm(); }}
//           submitting={submitting}
//         />
//       </Dialog>

//       {/* ════════════════════════════════════════════════════════════════
//           SUCCESS DIALOG
//       ════════════════════════════════════════════════════════════════ */}
//       <Dialog
//         open={successOpen}
//         onClose={() => setSuccessOpen(false)}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', p: 0 } }}>
//         {/* Green gradient header */}
//         <Box sx={{
//           background: `linear-gradient(135deg, #059669 0%, ${T.emerald} 60%, #34D399 100%)`,
//           px: 3, pt: 3.5, pb: 3, textAlign: 'center', position: 'relative', overflow: 'hidden'
//         }}>
//           <Box sx={{ position: 'absolute', top: -30, left: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
//           <Box sx={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
//           <Box sx={{ position: 'relative', zIndex: 1 }}>
//             <Box sx={{
//               width: 64, height: 64, borderRadius: '50%',
//               background: 'rgba(255,255,255,0.22)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               mx: 'auto', mb: 1.5,
//               boxShadow: '0 0 0 12px rgba(255,255,255,0.08)',
//             }}>
//               <ActiveIcon sx={{ color: '#fff', fontSize: 34 }} />
//             </Box>
//             <Typography sx={{ fontWeight: 800, fontSize: 21, color: '#fff', mb: .5 }}>
//               Organisation Added! 🎉
//             </Typography>
//             <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>
//               Successfully registered and notified
//             </Typography>
//           </Box>
//         </Box>

//         {/* Body */}
//         <Box sx={{ px: 3, py: 2.5 }}>
//           <Box sx={{
//             display: 'flex', alignItems: 'center', gap: 1.5,
//             p: 1.8, background: '#F0FDF4', borderRadius: '14px',
//             border: '1px solid #BBF7D0', mb: 2
//           }}>
//             <Avatar sx={{
//               width: 42, height: 42, fontWeight: 800, fontSize: 16, flexShrink: 0,
//               background: `linear-gradient(135deg, #059669, ${T.emerald})`
//             }}>
//               {successData?.name?.charAt(0)}
//             </Avatar>
//             <Box sx={{ flex: 1, minWidth: 0 }}>
//               <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#065F46', lineHeight: 1.3 }}>
//                 {successData?.name}
//               </Typography>
//               <Typography sx={{ fontSize: 12, color: '#047857' }}>{successData?.domain}</Typography>
//             </Box>
//             <Chip label="Active" size="small"
//               sx={{ background: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: 10, flexShrink: 0 }} />
//           </Box>

//           <Box sx={{
//             display: 'flex', alignItems: 'flex-start', gap: 1.3,
//             p: 1.8, background: '#EFF6FF', borderRadius: '14px',
//             border: '1px solid #BFDBFE', mb: 2
//           }}>
//             <MailSentIcon sx={{ color: '#2563EB', fontSize: 22, mt: .1, flexShrink: 0 }} />
//             <Box>
//               <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#1E40AF' }}>
//                 Credentials Sent!
//               </Typography>
//               <Typography sx={{ fontSize: 12, color: '#3B82F6', mt: .3, lineHeight: 1.5 }}>
//                 Login credentials have been sent to<br />
//                 <b>{successData?.email}</b>
//               </Typography>
//             </Box>
//           </Box>
//         </Box>

//         <Box sx={{ px: 3, pb: 3 }}>
//           <Button fullWidth onClick={() => setSuccessOpen(false)} variant="contained"
//             sx={{
//               borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.2,
//               background: `linear-gradient(135deg, #059669, ${T.emerald})`,
//               boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
//               '&:hover': { opacity: .9 }
//             }}>
//             Done
//           </Button>
//         </Box>
//       </Dialog>

//       {/* ── View Tenant Dialog ──────────────────────────────────────── */}
//       <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="xs" fullWidth
//         PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', p: 0 } }}>
//         <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
//           <Avatar sx={{ background: T.indigo, width: 38, height: 38, fontWeight: 700 }}>
//             {selectedTenant?.name?.charAt(0)}
//           </Avatar>
//           <Box>
//             <Typography sx={{ fontWeight: 800, fontSize: 15, color: T.navy }}>{selectedTenant?.name}</Typography>
//             <Typography sx={{ fontSize: 11, color: T.muted }}>Tenant Details</Typography>
//           </Box>
//           <IconButton onClick={() => setViewOpen(false)} size="small" sx={{ ml: 'auto', color: T.muted }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//         <Box sx={{ px: 3, py: 2 }}>
//           {selectedTenant && [
//             ['Domain',       selectedTenant.domain],
//             ['Email',        selectedTenant.email],
//             ['Created',      new Date(selectedTenant.createdAt).toLocaleDateString()],
//             ['Last Updated', new Date(selectedTenant.updatedAt).toLocaleDateString()],
//           ].map(([k, v]) => (
//             <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: `1px solid ${T.border}` }}>
//               <Typography sx={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{k}</Typography>
//               <Typography sx={{ fontSize: 12, color: T.navy, fontWeight: 500 }}>{v}</Typography>
//             </Box>
//           ))}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
//             <Typography sx={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Status</Typography>
//             <Chip label={selectedTenant?.isActive ? 'Active' : 'Inactive'} size="small"
//               sx={{
//                 fontSize: 10, fontWeight: 700,
//                 background: selectedTenant?.isActive ? '#D1FAE5' : '#FFE4E6',
//                 color:      selectedTenant?.isActive ? '#065F46' : '#9F1239'
//               }} />
//           </Box>
//         </Box>
//         <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 1 }}>
//           <Button fullWidth onClick={() => setViewOpen(false)}
//             sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: T.slate, border: `1px solid ${T.border}` }}>
//             Close
//           </Button>
//           <Button fullWidth variant="contained"
//             onClick={() => navigate(`/superadmin/tenants/edit/${selectedTenant?._id}`)}
//             sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, background: T.indigo, '&:hover': { background: T.indigoL } }}>
//             Edit
//           </Button>
//         </Box>
//       </Dialog>

//       {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
//       <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
//         PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', p: 0 } }}>
//         <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1.2 }}>
//           <Box sx={{ p: .8, borderRadius: '10px', background: '#FFE4E6', display: 'flex', flexShrink: 0 }}>
//             <DeleteIcon sx={{ color: T.rose, fontSize: 20 }} />
//           </Box>
//           <Typography sx={{ fontWeight: 800, fontSize: 16, color: T.navy }}>Delete Organisation</Typography>
//         </Box>
//         <Box sx={{ px: 3, py: 2.5 }}>
//           <Typography sx={{ fontSize: 14, color: T.slate }}>
//             Are you sure you want to permanently delete{' '}
//             <b style={{ color: T.navy }}>{tenantToDelete?.name}</b>?
//           </Typography>
//           <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '10px', background: '#FFF1F2', border: '1px solid #FECDD3' }}>
//             <Typography sx={{ fontSize: 12, color: T.rose }}>
//               ⚠ This cannot be undone and removes all associated data.
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 1 }}>
//           <Button fullWidth onClick={() => setDeleteOpen(false)}
//             sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: T.slate, border: `1px solid ${T.border}` }}>
//             Cancel
//           </Button>
//           <Button fullWidth onClick={handleDelete} variant="contained"
//             sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, background: T.rose, '&:hover': { background: '#E11D48' } }}>
//             Delete
//           </Button>
//         </Box>
//       </Dialog>

//       {/* ── Snackbar ───────────────────────────────────────────────── */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar(s => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar(s => ({ ...s, open: false }))}
//           sx={{ borderRadius: '12px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,.14)' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//     </Box>
//   );
// };

// export default SuperAdminDashboard;









import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, CircularProgress, Alert, Button, Avatar,
  IconButton, Dialog, Grid, Card, Chip, Switch,
  TextField, InputAdornment, MenuItem, Select, Tooltip, Snackbar,
  FormControl, InputLabel, useMediaQuery, useTheme, Collapse,
  ToggleButton, ToggleButtonGroup, Divider,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as VisibilityIcon, Search as SearchIcon,
  CheckCircle as ActiveIcon, Cancel as InactiveIcon,
  Refresh as RefreshIcon, TrendingUp as TrendingUpIcon,
  People as PeopleIcon, Business as BusinessIcon,
  Email as EmailIcon, Close as CloseIcon,
  MarkEmailRead as MailSentIcon, BarChart as BarChartIcon,
  FilterList as FilterIcon,
  TableRows as TableIcon, GridView as GridIcon,
  Phone as PhoneIcon, Language as LanguageIcon,
  AccountBalance as BankIcon, CalendarToday as CalendarIcon,
  LocationOn as LocationIcon, Badge as BadgeIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ChartTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  getTenants, createTenant, updateTenant, updateTenantStatus,
  deleteTenant, resendWelcomeEmail
} from '../../services/tenantService';
import OrganizationForm from '../../components/OrganizationForm';

/* ── Tokens ─────────────────────────────────────────────────────── */
const T = {
  navy:'#0F172A', slate:'#334155', muted:'#64748B', border:'#E2E8F0',
  bg:'#F1F5F9', card:'#FFFFFF', indigo:'#4F46E5', indigoL:'#818CF8',
  indigoS:'#EEF2FF', emerald:'#10B981', emeraldS:'#D1FAE5',
  rose:'#F43F5E', roseS:'#FFE4E6', amber:'#F59E0B', amberS:'#FEF3C7',
  sky:'#0EA5E9', skyS:'#E0F2FE', purple:'#8B5CF6', purpleS:'#EDE9FE',
};

/* ── Normalize — handles both old schema (name/email) and new (companyName/companyEmail) ── */
const N = (t = {}) => ({
  ...t,
  _name:    t.companyName  || t.name        || '—',
  _email:   t.companyEmail || t.email       || '—',
  _phone:   t.companyPhone || '—',
  _domain:  t.domain       || '—',
  _industry:t.industry     || '—',
  _size:    t.companySize  || '—',
  _address: t.companyAddress || '—',
  _website: t.website      || '',
  _gst:     t.gstNumber    || '—',
  _pan:     t.companyPan   || '—',
  _reg:     t.registrationNumber || '—',
  _vendor:  t.vendorType   || '—',
  _firstName:  t.firstName  || '',
  _lastName:   t.lastName   || '',
  _designation:t.designation|| '—',
  _ownerPhone: t.phone      || '—',
  _aadhar:  t.aadharNumber  || '—',
  _ownerPan:t.panNumber     || '—',
  _bankName:   t.bankDetails?.bankName          || '—',
  _bankHolder: t.bankDetails?.accountHolderName || '—',
  _bankAccount:t.bankDetails?.accountNumber     || '—',
  _ifsc:       t.bankDetails?.ifscCode          || '—',
  _branch:     t.bankDetails?.branch            || '—',
  _billing: t.billingCycle || '—',
  _payment: t.paymentTerms || '—',
  _start:   t.contractStartDate ? new Date(t.contractStartDate).toLocaleDateString() : '—',
  _end:     t.contractEndDate   ? new Date(t.contractEndDate).toLocaleDateString()   : '—',
  _credit:  t.creditLimit   != null ? `₹${Number(t.creditLimit).toLocaleString()}` : '—',
  _charge:  t.serviceCharge != null ? `${t.serviceCharge}%` : '—',
});

const PALETTE = ['#4F46E5','#059669','#D97706','#DC2626','#7C3AED','#0284C7','#BE185D'];
const aColor  = (name='') => PALETTE[name.charCodeAt(0) % PALETTE.length];

/* ── StatCard ───────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon, from, to, sub }) => (
  <Card sx={{ p:{xs:2,sm:2.5}, borderRadius:'16px', border:'none', height:'100%',
    background:`linear-gradient(135deg,${from} 0%,${to} 100%)`, color:'#fff',
    position:'relative', overflow:'hidden', boxShadow:`0 6px 20px ${from}44`,
    transition:'transform .2s,box-shadow .2s',
    '&:hover':{transform:'translateY(-2px)',boxShadow:`0 12px 32px ${from}66`} }}>
    <Box sx={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.10)'}}/>
    <Box sx={{position:'relative',zIndex:1}}>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',mb:1.5}}>
        <Typography sx={{fontSize:10,fontWeight:700,opacity:.75,letterSpacing:1,textTransform:'uppercase'}}>{title}</Typography>
        <Box sx={{p:.6,borderRadius:'8px',background:'rgba(255,255,255,0.18)',display:'flex'}}>
          {React.cloneElement(icon,{sx:{fontSize:16}})}
        </Box>
      </Box>
      <Typography sx={{fontSize:{xs:28,sm:32},fontWeight:800,lineHeight:1,letterSpacing:-1,mb:1}}>{value}</Typography>
      <Box sx={{display:'flex',alignItems:'center',gap:.5}}>
        <TrendingUpIcon sx={{fontSize:12,opacity:.7}}/>
        <Typography sx={{fontSize:11,opacity:.8}}>{sub}</Typography>
      </Box>
    </Box>
  </Card>
);

/* ── ChartTooltip ───────────────────────────────────────────────── */
const CTooltip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <Box sx={{background:T.navy,borderRadius:'10px',p:'8px 14px',boxShadow:'0 4px 20px rgba(0,0,0,.3)'}}>
      <Typography sx={{color:'#fff',fontSize:11,fontWeight:700,mb:.5}}>{label}</Typography>
      {payload.map((p,i)=><Typography key={i} sx={{color:p.color,fontSize:11}}>{p.name}: <b>{p.value}</b></Typography>)}
    </Box>
  );
};

/* ── Detail row for view dialog ─────────────────────────────────── */
const DR = ({ icon, label, value, accent=T.indigo }) => (
  <Box sx={{display:'flex',alignItems:'flex-start',gap:1.5,py:1.1,borderBottom:`1px solid ${T.border}`}}>
    <Box sx={{p:.55,borderRadius:'7px',background:`${accent}14`,flexShrink:0,mt:.2}}>
      {React.cloneElement(icon,{sx:{fontSize:14,color:accent}})}
    </Box>
    <Box sx={{flex:1,minWidth:0}}>
      <Typography sx={{fontSize:10,color:T.muted,fontWeight:600,textTransform:'uppercase',letterSpacing:.5}}>{label}</Typography>
      <Typography sx={{fontSize:13,color:T.navy,fontWeight:500,wordBreak:'break-word',mt:.15}}>{value||'—'}</Typography>
    </Box>
  </Box>
);

const SH = ({ label, accent }) => (
  <Box sx={{display:'flex',alignItems:'center',gap:1,mt:2,mb:.5}}>
    <Box sx={{width:3,height:14,borderRadius:2,background:accent,flexShrink:0}}/>
    <Typography sx={{fontSize:10,fontWeight:800,color:accent,textTransform:'uppercase',letterSpacing:1}}>{label}</Typography>
  </Box>
);

/* ── View Dialog ────────────────────────────────────────────────── */
const ViewDialog = ({ open, onClose, tenant, onEdit, onDelete }) => {
  if (!tenant) return null;
  const n  = N(tenant);
  const ac = aColor(n._name);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{sx:{borderRadius:'20px',overflow:'hidden',p:0,maxHeight:'92vh'}}}>
      {/* Header */}
      <Box sx={{background:`linear-gradient(135deg,${ac},${ac}bb)`,px:3,pt:3,pb:2.5,position:'relative',overflow:'hidden'}}>
        <Box sx={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.10)'}}/>
        <IconButton onClick={onClose} size="small"
          sx={{position:'absolute',top:10,right:10,color:'rgba(255,255,255,0.8)','&:hover':{background:'rgba(255,255,255,0.15)'}}}>
          <CloseIcon fontSize="small"/>
        </IconButton>
        <Box sx={{display:'flex',alignItems:'center',gap:2,position:'relative',zIndex:1}}>
          <Avatar sx={{width:54,height:54,background:'rgba(255,255,255,0.25)',fontSize:22,fontWeight:800,border:'2px solid rgba(255,255,255,0.4)'}}>
            {n._name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{fontWeight:800,fontSize:18,color:'#fff',lineHeight:1.2}}>{n._name}</Typography>
            <Typography sx={{fontSize:12,color:'rgba(255,255,255,0.82)',mt:.3}}>{n._email}</Typography>
            <Box sx={{display:'flex',gap:1,mt:.8,flexWrap:'wrap'}}>
              <Chip label={tenant.isActive?'Active':'Inactive'} size="small"
                sx={{fontSize:10,fontWeight:700,background:tenant.isActive?'rgba(16,185,129,0.25)':'rgba(244,63,94,0.25)',color:'#fff',border:`1px solid ${tenant.isActive?T.emerald:T.rose}55`}}/>
              <Chip label={tenant.subscriptionPlan||'free'} size="small"
                sx={{fontSize:10,fontWeight:700,background:'rgba(255,255,255,0.2)',color:'#fff',textTransform:'capitalize'}}/>
              {n._vendor!=='—' && <Chip label={n._vendor} size="small" sx={{fontSize:10,fontWeight:700,background:'rgba(255,255,255,0.18)',color:'#fff'}}/>}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Scrollable body */}
      <Box sx={{px:3,py:1.5,overflowY:'auto',maxHeight:'calc(92vh - 220px)'}}>
        <SH label="Company Information" accent={T.indigo}/>
        <DR icon={<LanguageIcon/>}  label="Domain"             value={n._domain}   accent={T.indigo}/>
        <DR icon={<PhoneIcon/>}     label="Phone"              value={n._phone}    accent={T.indigo}/>
        {n._website&&<DR icon={<LanguageIcon/>} label="Website" value={n._website} accent={T.indigo}/>}
        <DR icon={<BusinessIcon/>}  label="Industry"           value={n._industry} accent={T.indigo}/>
        <DR icon={<PeopleIcon/>}    label="Company Size"       value={n._size}     accent={T.indigo}/>
        <DR icon={<BusinessIcon/>}  label="Vendor Type"        value={n._vendor}   accent={T.indigo}/>
        <DR icon={<BadgeIcon/>}     label="GST Number"         value={n._gst}      accent={T.indigo}/>
        <DR icon={<BadgeIcon/>}     label="Company PAN"        value={n._pan}      accent={T.indigo}/>
        <DR icon={<BadgeIcon/>}     label="Registration No."   value={n._reg}      accent={T.indigo}/>
        <DR icon={<LocationIcon/>}  label="Address"            value={n._address}  accent={T.indigo}/>

        {(n._firstName||n._lastName) && <>
          <SH label="Owner / Contact" accent={T.emerald}/>
          <DR icon={<PeopleIcon/>}  label="Name"        value={`${n._firstName} ${n._lastName}`.trim()} accent={T.emerald}/>
          <DR icon={<BadgeIcon/>}   label="Designation" value={n._designation} accent={T.emerald}/>
          <DR icon={<PhoneIcon/>}   label="Phone"       value={n._ownerPhone}  accent={T.emerald}/>
          <DR icon={<BadgeIcon/>}   label="Aadhar"      value={n._aadhar}      accent={T.emerald}/>
          <DR icon={<BadgeIcon/>}   label="PAN"         value={n._ownerPan}    accent={T.emerald}/>
        </>}

        {n._bankName!=='—'&&<>
          <SH label="Bank Details" accent={T.amber}/>
          <DR icon={<BankIcon/>}      label="Bank Name"   value={n._bankName}    accent={T.amber}/>
          <DR icon={<BankIcon/>}      label="Holder"      value={n._bankHolder}  accent={T.amber}/>
          <DR icon={<BankIcon/>}      label="Account No." value={n._bankAccount} accent={T.amber}/>
          <DR icon={<BankIcon/>}      label="IFSC"        value={n._ifsc}        accent={T.amber}/>
          <DR icon={<LocationIcon/>}  label="Branch"      value={n._branch}      accent={T.amber}/>
        </>}

        <SH label="Billing & Contract" accent={T.sky}/>
        <DR icon={<CalendarIcon/>}  label="Billing Cycle"  value={n._billing}  accent={T.sky}/>
        <DR icon={<CalendarIcon/>}  label="Payment Terms"  value={n._payment}  accent={T.sky}/>
        <DR icon={<CalendarIcon/>}  label="Contract Start" value={n._start}    accent={T.sky}/>
        <DR icon={<CalendarIcon/>}  label="Contract End"   value={n._end}      accent={T.sky}/>
        <DR icon={<BadgeIcon/>}     label="Credit Limit"   value={n._credit}   accent={T.sky}/>
        <DR icon={<BadgeIcon/>}     label="Service Charge" value={n._charge}   accent={T.sky}/>

        {tenant.customNotes?.length>0&&<>
          <SH label="Custom Notes" accent={T.purple}/>
          {tenant.customNotes.map((note,i)=>(
            <Box key={i} sx={{p:1.5,mb:1,borderRadius:'10px',background:T.purpleS,border:`1px solid ${T.purple}30`}}>
              <Typography sx={{fontSize:10,fontWeight:700,color:T.purple,textTransform:'uppercase',letterSpacing:.5}}>{note.label}</Typography>
              <Typography sx={{fontSize:13,color:T.navy,mt:.3}}>{note.value}</Typography>
            </Box>
          ))}
        </>}
        <Box sx={{pb:1}}/>
      </Box>

      {/* Footer */}
      <Box sx={{px:3,py:2,borderTop:`1px solid ${T.border}`,display:'flex',gap:1.5}}>
        <Button fullWidth onClick={onClose} variant="outlined"
          sx={{borderRadius:'10px',textTransform:'none',fontWeight:600,borderColor:T.border,color:T.slate}}>Close</Button>
        <Button fullWidth onClick={onDelete} variant="outlined"
          sx={{borderRadius:'10px',textTransform:'none',fontWeight:600,borderColor:T.rose,color:T.rose,'&:hover':{background:T.roseS}}}>Delete</Button>
        <Button fullWidth onClick={onEdit} variant="contained"
          sx={{borderRadius:'10px',textTransform:'none',fontWeight:700,background:T.indigo,'&:hover':{background:T.indigoL}}}>Edit</Button>
      </Box>
    </Dialog>
  );
};

/* ── Grid Card ─────────────────────────────────────────────────── */
const GridCard = ({ t, onToggle, onView, onEdit, onDelete, onEmail }) => {
  const n  = N(t);
  const ac = aColor(n._name);
  return (
    <Card sx={{borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',
      overflow:'hidden',height:'100%',display:'flex',flexDirection:'column',
      transition:'all .2s','&:hover':{boxShadow:'0 8px 28px rgba(0,0,0,0.10)',borderColor:T.indigo,transform:'translateY(-2px)'}}}>
      <Box sx={{height:4,background:`linear-gradient(90deg,${ac},${ac}77)`}}/>
      <Box sx={{p:2,flex:1}}>
        <Box sx={{display:'flex',alignItems:'flex-start',gap:1.5,mb:1.5}}>
          <Avatar sx={{width:42,height:42,background:ac,fontSize:16,fontWeight:800,flexShrink:0}}>
            {n._name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{flex:1,minWidth:0}}>
            <Typography sx={{fontWeight:700,fontSize:13,color:T.navy,lineHeight:1.3}} noWrap>{n._name}</Typography>
            <Typography sx={{fontSize:11,color:T.muted,mt:.2}} noWrap>{n._email}</Typography>
          </Box>
          <Chip label={t.isActive?'Active':'Inactive'} size="small"
            sx={{fontSize:9,fontWeight:700,flexShrink:0,background:t.isActive?T.emeraldS:T.roseS,color:t.isActive?'#065F46':'#9F1239'}}/>
        </Box>
        <Divider sx={{mb:1.5}}/>
        <Box sx={{display:'flex',flexDirection:'column',gap:.9}}>
          {[[<LanguageIcon/>,n._domain],[<PhoneIcon/>,n._phone],[<BusinessIcon/>,n._industry!=='—'?n._industry:n._vendor]].map(([icon,val],i)=>(
            <Box key={i} sx={{display:'flex',alignItems:'center',gap:1}}>
              {React.cloneElement(icon,{sx:{fontSize:13,color:T.muted,flexShrink:0}})}
              <Typography sx={{fontSize:12,color:T.slate}} noWrap>{val}</Typography>
            </Box>
          ))}
          <Box sx={{display:'flex',alignItems:'center',gap:1}}>
            <CalendarIcon sx={{fontSize:13,color:T.muted,flexShrink:0}}/>
            <Typography sx={{fontSize:12,color:T.slate}}>{new Date(t.createdAt).toLocaleDateString()}</Typography>
          </Box>
          {n._billing!=='—'&&(
            <Box sx={{display:'flex',alignItems:'center',gap:1}}>
              <BankIcon sx={{fontSize:13,color:T.muted,flexShrink:0}}/>
              <Typography sx={{fontSize:12,color:T.slate}}>{n._billing} · {n._payment}</Typography>
            </Box>
          )}
        </Box>
        {t.customNotes?.length>0&&(
          <Chip label={`${t.customNotes.length} note${t.customNotes.length>1?'s':''}`} size="small"
            sx={{mt:1.5,fontSize:10,background:T.purpleS,color:T.purple,fontWeight:600}}/>
        )}
      </Box>
      <Box sx={{px:2,py:1.2,borderTop:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:T.bg}}>
        <Box sx={{display:'flex',alignItems:'center',gap:.8}}>
          <Switch checked={t.isActive} size="small" onChange={()=>onToggle(t._id,t.isActive)}
            sx={{'& .MuiSwitch-thumb':{background:t.isActive?T.emerald:T.rose},'& .MuiSwitch-track':{background:t.isActive?`${T.emerald}40`:`${T.rose}40`}}}/>
          <Typography sx={{fontSize:11,color:T.muted}}>{t.isActive?'Active':'Inactive'}</Typography>
        </Box>
        <Box sx={{display:'flex',gap:.5}}>
          {[{tip:'Email',icon:<EmailIcon/>,color:T.sky,fn:onEmail},{tip:'View',icon:<VisibilityIcon/>,color:T.indigo,fn:onView},
            {tip:'Edit',icon:<EditIcon/>,color:T.amber,fn:onEdit},{tip:'Delete',icon:<DeleteIcon/>,color:T.rose,fn:onDelete}
          ].map(a=>(
            <Tooltip key={a.tip} title={a.tip} arrow>
              <IconButton onClick={a.fn} size="small"
                sx={{borderRadius:'7px',p:.5,color:a.color,background:`${a.color}14`,'&:hover':{background:a.color,color:'#fff'},transition:'all .15s'}}>
                {React.cloneElement(a.icon,{sx:{fontSize:14}})}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Card>
  );
};

/* ════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════ */
export default function SuperAdminDashboard() {
  const navigate  = useNavigate();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet  = useMediaQuery(theme.breakpoints.between('sm','lg'));

  const [tenants,      setTenants]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [refreshing,   setRefreshing]   = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters,  setShowFilters]  = useState(false);
  const [viewMode,     setViewMode]     = useState('table');
  const [snackbar,     setSnackbar]     = useState({open:false,message:'',severity:'success'});

  const [addOpen,    setAddOpen]    = useState(false);
  const [editOpen,   setEditOpen]   = useState(false);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [successOpen,setSuccessOpen]= useState(false);

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [successData,    setSuccessData]    = useState(null);
  const [submitting,     setSubmitting]     = useState(false);

  const emptyForm = {
    name:'',domain:'',email:'',companyPhone:'',website:'',industry:'',companySize:'',
    gstNumber:'',companyAddress:'',vendorType:'',companyPan:'',registrationNumber:'',
    firstName:'',lastName:'',designation:'',phone:'',aadharNumber:'',panNumber:'',
    bankName:'',accountHolderName:'',accountNumber:'',ifscCode:'',branch:'',
    billingCycle:'',paymentTerms:'',contractStartDate:'',contractEndDate:'',
    creditLimit:'',serviceCharge:'',aadharFile:null,panFile:null,cancelledCheque:null,customNotes:[]
  };
  const [form,       setForm]       = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  /* fetch */
  const fetchTenants = async () => {
    try { setLoading(true); const r=await getTenants(); setTenants(r.data.tenants||[]); }
    catch(e){ setError(e.message); } finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(()=>{fetchTenants();},[]);
  const handleRefresh=()=>{setRefreshing(true);fetchTenants();};

  const activeCount   = tenants.filter(t=>t.isActive).length;
  const inactiveCount = tenants.filter(t=>!t.isActive).length;
  const total         = tenants.length;

  const filtered = tenants.filter(t=>{
    const n=N(t), s=searchTerm.toLowerCase();
    const ms=n._name.toLowerCase().includes(s)||n._domain.toLowerCase().includes(s)||n._email.toLowerCase().includes(s);
    const mst=statusFilter==='all'||(statusFilter==='active'&&t.isActive)||(statusFilter==='inactive'&&!t.isActive);
    return ms&&mst;
  });

  const activityData=(()=>{
    const now=new Date();
    const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return Array.from({length:6},(_,idx)=>{
      const mIdx=(now.getMonth()-5+idx+12)%12;
      return {name:mo[mIdx],
        active:  tenants.filter(t=>new Date(t.createdAt).getMonth()===mIdx&&t.isActive).length,
        inactive:tenants.filter(t=>new Date(t.createdAt).getMonth()===mIdx&&!t.isActive).length};
    });
  })();

  const pieData=[{name:'Active',value:activeCount},{name:'Inactive',value:inactiveCount}];
  const PIE_CLR=[T.emerald,T.rose];
  const toast=(msg,sev='success')=>setSnackbar({open:true,message:msg,severity:sev});

  const toggleStatus=async(id,cur)=>{
    try{ await updateTenantStatus(id,!cur); setTenants(ts=>ts.map(t=>t._id===id?{...t,isActive:!cur}:t)); toast(`Tenant ${!cur?'activated':'deactivated'}`); }
    catch{ toast('Failed to update status','error'); }
  };

  const handleDelete=async()=>{
    try{ await deleteTenant(tenantToDelete._id); setTenants(ts=>ts.filter(t=>t._id!==tenantToDelete._id)); setDeleteOpen(false); setViewOpen(false); toast('Tenant deleted'); }
    catch{ toast('Failed to delete','error'); }
  };

  const handleResendEmail=async(tenant)=>{
    try{ await resendWelcomeEmail(tenant._id); toast('Welcome email resent!'); }
    catch{ toast('Failed to resend email','error'); }
  };

  /* open edit — prefill form */
  const openEdit=(tenant)=>{
    const n=N(tenant);
    const fmtDate=(d)=>d?new Date(d).toISOString().split('T')[0]:'';
    setForm({
      name:n._name!=='—'?n._name:'', domain:n._domain!=='—'?n._domain:'', email:n._email!=='—'?n._email:'',
      companyPhone:n._phone!=='—'?n._phone:'', website:n._website||'',
      industry:tenant.industry||'', companySize:tenant.companySize||'',
      gstNumber:n._gst!=='—'?n._gst:'', companyAddress:n._address!=='—'?n._address:'',
      vendorType:tenant.vendorType||'', companyPan:n._pan!=='—'?n._pan:'',
      registrationNumber:n._reg!=='—'?n._reg:'',
      firstName:n._firstName||'', lastName:n._lastName||'',
      designation:n._designation!=='—'?n._designation:'',
      phone:n._ownerPhone!=='—'?n._ownerPhone:'',
      aadharNumber:n._aadhar!=='—'?n._aadhar:'', panNumber:n._ownerPan!=='—'?n._ownerPan:'',
      bankName:n._bankName!=='—'?n._bankName:'', accountHolderName:n._bankHolder!=='—'?n._bankHolder:'',
      accountNumber:n._bankAccount!=='—'?n._bankAccount:'', ifscCode:n._ifsc!=='—'?n._ifsc:'',
      branch:n._branch!=='—'?n._branch:'',
      billingCycle:tenant.billingCycle||'', paymentTerms:tenant.paymentTerms||'',
      contractStartDate:fmtDate(tenant.contractStartDate), contractEndDate:fmtDate(tenant.contractEndDate),
      creditLimit:tenant.creditLimit!=null?String(tenant.creditLimit):'',
      serviceCharge:tenant.serviceCharge!=null?String(tenant.serviceCharge):'',
      aadharFile:null,panFile:null,cancelledCheque:null,
      customNotes:tenant.customNotes||[],
    });
    setFormErrors({}); setSelectedTenant(tenant); setViewOpen(false); setEditOpen(true);
  };

  const validateForm=(isEdit=false)=>{
    const e={};
    if(!form.name?.trim())  e.name='Required';
    if(!form.domain?.trim())e.domain='Required';
    if(!form.email?.trim()) e.email='Required';
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email';
    if(!isEdit){
      if(!form.companyPhone?.trim())       e.companyPhone='Required';
      if(!form.industry)                   e.industry='Required';
      if(!form.companySize)                e.companySize='Required';
      if(!form.gstNumber?.trim())          e.gstNumber='Required';
      if(!form.companyAddress?.trim())     e.companyAddress='Required';
      if(!form.vendorType)                 e.vendorType='Required';
      if(!form.companyPan?.trim())         e.companyPan='Required';
      if(!form.registrationNumber?.trim()) e.registrationNumber='Required';
      if(!form.firstName?.trim())          e.firstName='Required';
      if(!form.lastName?.trim())           e.lastName='Required';
      if(!form.designation?.trim())        e.designation='Required';
      if(!form.phone?.trim())              e.phone='Required';
      if(!form.aadharNumber?.trim())       e.aadharNumber='Required';
      if(!form.panNumber?.trim())          e.panNumber='Required';
      if(!form.bankName?.trim())           e.bankName='Required';
      if(!form.accountHolderName?.trim())  e.accountHolderName='Required';
      if(!form.accountNumber?.trim())      e.accountNumber='Required';
      if(!form.ifscCode?.trim())           e.ifscCode='Required';
      if(!form.billingCycle)               e.billingCycle='Required';
      if(!form.paymentTerms)               e.paymentTerms='Required';
      if(!form.contractStartDate)          e.contractStartDate='Required';
      if(!form.contractEndDate)            e.contractEndDate='Required';
    }
    setFormErrors(e); return Object.keys(e).length===0;
  };

  const resetForm=()=>{setForm(emptyForm);setFormErrors({});};

  const buildPayload=(isEdit=false)=>{
    const cleanDomain=form.domain.trim().replace(/^https?:\/\//,'').replace(/^www\./,'').split('.')[0];
    const p={
      name:form.name.trim(), domain:cleanDomain, email:form.email.trim(),
      companyPhone:form.companyPhone?.trim()||undefined, website:form.website?.trim()||undefined,
      industry:form.industry||undefined, companySize:form.companySize||undefined,
      gstNumber:form.gstNumber?.trim()||undefined, companyAddress:form.companyAddress?.trim()||undefined,
      vendorType:form.vendorType||undefined, companyPan:form.companyPan?.trim()||undefined,
      registrationNumber:form.registrationNumber?.trim()||undefined,
      firstName:form.firstName?.trim()||undefined, lastName:form.lastName?.trim()||undefined,
      designation:form.designation?.trim()||undefined, phone:form.phone?.trim()||undefined,
      aadharNumber:form.aadharNumber?.trim()||undefined, panNumber:form.panNumber?.trim()||undefined,
      bankName:form.bankName?.trim()||undefined, accountHolderName:form.accountHolderName?.trim()||undefined,
      accountNumber:form.accountNumber?.trim()||undefined, ifscCode:form.ifscCode?.trim()||undefined,
      branch:form.branch?.trim()||undefined,
      billingCycle:form.billingCycle||undefined, paymentTerms:form.paymentTerms||undefined,
      contractStartDate:form.contractStartDate||undefined, contractEndDate:form.contractEndDate||undefined,
      creditLimit:form.creditLimit?Number(form.creditLimit):undefined,
      serviceCharge:form.serviceCharge?Number(form.serviceCharge):undefined,
      customNotes:form.customNotes||[],
    };
    Object.keys(p).forEach(k=>p[k]===undefined&&delete p[k]);
    return p;
  };

  const handleSubmit=async()=>{
    if(!validateForm(false)){toast('Please fill all required fields','error');return;}
    setSubmitting(true);
    try{
      const payload=buildPayload(false);
      const res=await createTenant(payload);
      setAddOpen(false);
      setSuccessData({name:form.name,email:form.email,domain:payload.domain});
      resetForm(); setSuccessOpen(true); fetchTenants();
      toast('Organisation created successfully!');
    }catch(err){toast(err?.response?.data?.message||err?.message||'Failed to create','error');}
    finally{setSubmitting(false);}
  };

  const handleEditSubmit=async()=>{
    if(!validateForm(true)){toast('Please check required fields','error');return;}
    setSubmitting(true);
    try{
      const payload=buildPayload(true);
      await updateTenant(selectedTenant._id,payload);
      setEditOpen(false); resetForm(); fetchTenants();
      toast('Organisation updated successfully!');
    }catch(err){toast(err?.response?.data?.message||err?.message||'Failed to update','error');}
    finally{setSubmitting(false);}
  };

  if(loading&&!refreshing) return (
    <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'80vh',background:T.bg}}>
      <Box textAlign="center"><CircularProgress size={44} sx={{color:T.indigo,mb:2}}/><Typography sx={{color:T.muted,fontSize:13}}>Loading dashboard…</Typography></Box>
    </Box>
  );
  if(error) return <Alert severity="error" sx={{m:3,borderRadius:'14px'}} onClose={()=>setError(null)}>{error}</Alert>;

  const pageML=isMobile?0:isTablet?'72px':'190px';
  const pageMT=isMobile?'56px':'60px';

  const ah=(t)=>({
    onToggle:toggleStatus,
    onView:  ()=>{setSelectedTenant(t);setViewOpen(true);},
    onEdit:  ()=>openEdit(t),
    onDelete:()=>{setTenantToDelete(t);setDeleteOpen(true);},
    onEmail: ()=>handleResendEmail(t),
  });

  return (
    <Box sx={{minHeight:'100vh',background:T.bg,p:{xs:1.5,sm:2,md:2.5},ml:pageML,mt:pageMT,boxSizing:'border-box',width:`calc(100% - ${pageML})`}}>

      {/* Header */}
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2.5,flexWrap:'wrap',gap:1.5}}>
        <Box sx={{display:'flex',alignItems:'center',gap:1.5}}>
          <Box sx={{p:.85,borderRadius:'12px',background:T.indigo,display:'flex',flexShrink:0}}>
            <BusinessIcon sx={{color:'#fff',fontSize:{xs:18,sm:20}}}/>
          </Box>
          <Box>
            <Typography sx={{fontSize:{xs:15,sm:19,md:22},fontWeight:800,color:T.navy,lineHeight:1.2,letterSpacing:-.4}}>Organization Management</Typography>
            <Typography sx={{fontSize:12,color:T.muted}}>{isMobile?'Manage tenants & configs':'Manage tenants, credentials & configurations'}</Typography>
          </Box>
        </Box>
        <Box sx={{display:'flex',gap:1}}>
          <IconButton onClick={handleRefresh} disabled={refreshing}
            sx={{borderRadius:'10px',color:T.slate,background:T.card,border:`1px solid ${T.border}`,p:{xs:.8,sm:1},'&:hover':{background:T.bg}}}>
            <RefreshIcon sx={{fontSize:{xs:17,sm:19},animation:refreshing?'spin 1s linear infinite':'none','@keyframes spin':{from:{transform:'rotate(0deg)'},to:{transform:'rotate(360deg)'}}}}/>
          </IconButton>
          <Button onClick={()=>setAddOpen(true)} startIcon={<AddIcon/>} variant="contained"
            sx={{borderRadius:'10px',textTransform:'none',fontWeight:700,fontSize:{xs:12,sm:13},background:T.indigo,px:{xs:1.5,sm:2.5},boxShadow:`0 4px 14px ${T.indigo}44`,'&:hover':{background:T.indigoL},whiteSpace:'nowrap'}}>
            {isMobile?'Add':'Add Organisation'}
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={{xs:1.5,sm:2}} sx={{mb:2.5}}>
        {[
          {title:'Total Tenants',  value:total,         icon:<PeopleIcon/>,   from:'#4F46E5',to:'#7C3AED',sub:'All registered'},
          {title:'Active Tenants', value:activeCount,   icon:<ActiveIcon/>,   from:'#059669',to:'#10B981',sub:`${Math.round((activeCount/Math.max(total,1))*100)}% of total`},
          {title:'Inactive',       value:inactiveCount, icon:<InactiveIcon/>, from:'#E11D48',to:'#F43F5E',sub:`${Math.round((inactiveCount/Math.max(total,1))*100)}% of total`},
          {title:'Growth Rate',    value:'+22%',        icon:<BarChartIcon/>, from:'#D97706',to:'#F59E0B',sub:'Quarterly increase'},
        ].map((s,i)=><Grid item key={i} xs={6} sm={6} md={3}><StatCard {...s}/></Grid>)}
      </Grid>

      {/* Main layout */}
      <Grid container spacing={{xs:1.5,sm:2}} alignItems="flex-start">
        <Grid item xs={12} lg={8} sx={{display:'flex',flexDirection:'column',gap:{xs:1.5,sm:2}}}>

          {/* Charts */}
          <Grid container spacing={{xs:1.5,sm:2}}>
            <Grid item xs={12} sm={7}>
              <Card sx={{p:{xs:2,sm:2.5},borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',height:{xs:230,sm:260}}}>
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',mb:1.5}}>
                  <Box><Typography sx={{fontWeight:700,fontSize:13,color:T.navy}}>Tenant Activity</Typography><Typography sx={{fontSize:11,color:T.muted}}>Monthly active vs inactive</Typography></Box>
                  <Chip label="6 months" size="small" sx={{fontSize:10,background:T.indigoS,color:T.indigo,fontWeight:700}}/>
                </Box>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={activityData} margin={{left:-22,right:4}}>
                    <defs>
                      <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.emerald} stopOpacity={.25}/><stop offset="95%" stopColor={T.emerald} stopOpacity={0}/></linearGradient>
                      <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.rose} stopOpacity={.25}/><stop offset="95%" stopColor={T.rose} stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                    <XAxis dataKey="name" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
                    <ChartTooltip content={<CTooltip/>}/>
                    <Area type="monotone" dataKey="active"   name="Active"   stroke={T.emerald} strokeWidth={2} fill="url(#gA)"/>
                    <Area type="monotone" dataKey="inactive" name="Inactive" stroke={T.rose}    strokeWidth={2} fill="url(#gI)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Card sx={{p:{xs:2,sm:2.5},borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',height:{xs:230,sm:260}}}>
                <Box sx={{mb:1}}><Typography sx={{fontWeight:700,fontSize:13,color:T.navy}}>Status Distribution</Typography><Typography sx={{fontSize:11,color:T.muted}}>Current tenant states</Typography></Box>
                <Box sx={{display:'flex',gap:2,mb:1}}>
                  {pieData.map((d,i)=><Box key={d.name} sx={{display:'flex',alignItems:'center',gap:.5}}><Box sx={{width:8,height:8,borderRadius:'50%',background:PIE_CLR[i]}}/><Typography sx={{fontSize:11,color:T.slate}}>{d.name}: <b style={{color:T.navy}}>{d.value}</b></Typography></Box>)}
                </Box>
                <ResponsiveContainer width="100%" height="76%">
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={isMobile?34:40} outerRadius={isMobile?52:58} paddingAngle={4} dataKey="value" isAnimationActive>
                    {pieData.map((_,i)=><Cell key={i} fill={PIE_CLR[i]}/>)}
                  </Pie><ChartTooltip content={<CTooltip/>}/></PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Toolbar */}
          <Card sx={{p:{xs:1.5,sm:2},borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none'}}>
            <Box sx={{display:'flex',alignItems:'center',gap:1,flexWrap:'wrap'}}>
              <TextField size="small" placeholder={isMobile?'Search…':'Search name, domain or email…'}
                value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                InputProps={{startAdornment:<InputAdornment position="start"><SearchIcon sx={{color:T.muted,fontSize:16}}/></InputAdornment>,sx:{borderRadius:'10px',background:T.bg,fontSize:13}}}
                sx={{flex:1,minWidth:140,'& fieldset':{borderColor:T.border}}}/>
              {isMobile?(
                <IconButton size="small" onClick={()=>setShowFilters(f=>!f)}
                  sx={{borderRadius:'10px',border:`1px solid ${statusFilter!=='all'?T.indigo:T.border}`,background:statusFilter!=='all'?T.indigoS:T.bg,color:statusFilter!=='all'?T.indigo:T.muted,p:.85}}>
                  <FilterIcon sx={{fontSize:17}}/>
                </IconButton>
              ):(
                <FormControl size="small" sx={{minWidth:130}}>
                  <InputLabel sx={{fontSize:13}}>Status</InputLabel>
                  <Select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} label="Status" sx={{borderRadius:'10px',fontSize:13,background:T.bg}}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
              <ToggleButtonGroup value={viewMode} exclusive onChange={(_,v)=>v&&setViewMode(v)} size="small"
                sx={{background:T.bg,borderRadius:'10px','& .MuiToggleButton-root':{border:`1px solid ${T.border}`,borderRadius:'8px !important',px:1.2,py:.6,'&.Mui-selected':{background:T.indigo,color:'#fff','&:hover':{background:T.indigoL}}}}}>
                <ToggleButton value="table"><TableIcon sx={{fontSize:16}}/></ToggleButton>
                <ToggleButton value="grid"><GridIcon sx={{fontSize:16}}/></ToggleButton>
              </ToggleButtonGroup>
              <Typography sx={{fontSize:12,color:T.muted,whiteSpace:'nowrap'}}><b style={{color:T.navy}}>{filtered.length}</b>/{total}</Typography>
            </Box>
            {isMobile&&<Collapse in={showFilters}><Box sx={{mt:1.5,pt:1.5,borderTop:`1px solid ${T.border}`}}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{fontSize:13}}>Status</InputLabel>
                <Select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} label="Status" sx={{borderRadius:'10px',fontSize:13,background:T.bg}}>
                  <MenuItem value="all">All</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box></Collapse>}
          </Card>

          {/* Grid view */}
          {viewMode==='grid'&&(
            <Box>
              <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:1.5}}>
                <Typography sx={{fontWeight:700,fontSize:14,color:T.navy}}>All Tenants</Typography>
                <Chip label={`${filtered.length} results`} size="small" sx={{fontSize:10,background:T.indigoS,color:T.indigo,fontWeight:700}}/>
              </Box>
              {filtered.length===0
                ?<Card sx={{borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',p:5,textAlign:'center'}}><Typography sx={{color:T.muted,fontSize:13}}>No tenants found</Typography></Card>
                :<Grid container spacing={{xs:1.5,sm:2}}>{filtered.map(t=><Grid item key={t._id} xs={12} sm={6}><GridCard t={t} {...ah(t)}/></Grid>)}</Grid>
              }
            </Box>
          )}

          {/* Table view */}
          {viewMode==='table'&&(
            <Card sx={{borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',overflow:'hidden'}}>
              <Box sx={{px:2.5,py:1.8,borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography sx={{fontWeight:700,fontSize:14,color:T.navy}}>Tenant List</Typography>
                <Chip label={`${filtered.length} results`} size="small" sx={{fontSize:10,background:T.indigoS,color:T.indigo,fontWeight:700}}/>
              </Box>
              <Box sx={{overflowX:'auto'}}>
                <Table sx={{minWidth:600}}>
                  <TableHead>
                    <TableRow sx={{background:T.bg}}>
                      {['Tenant','Domain','Industry','Phone','Created','Status','Actions'].map((h,i)=>(
                        <TableCell key={h} align={i===6?'right':'left'}
                          sx={{fontWeight:700,fontSize:10,color:T.muted,textTransform:'uppercase',letterSpacing:.6,borderBottom:`1px solid ${T.border}`,py:1.2,px:i===0?2.5:1.5,whiteSpace:'nowrap'}}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.length===0&&<TableRow><TableCell colSpan={7} align="center" sx={{py:5,color:T.muted,fontSize:13}}>No tenants found</TableCell></TableRow>}
                    {filtered.map(t=>{
                      const n=N(t), ac=aColor(n._name);
                      return (
                        <TableRow key={t._id} sx={{'&:last-child td':{border:0},'&:hover':{background:'#F8FAFC'},cursor:'pointer'}}
                          onClick={()=>{setSelectedTenant(t);setViewOpen(true);}}>
                          <TableCell sx={{px:2.5,py:1.3}} onClick={e=>e.stopPropagation()}>
                            <Box sx={{display:'flex',alignItems:'center',gap:1.5}}>
                              <Avatar sx={{width:34,height:34,background:ac,fontSize:13,fontWeight:700}}>{n._name.charAt(0)}</Avatar>
                              <Box>
                                <Typography sx={{fontWeight:600,fontSize:13,color:T.navy,lineHeight:1.3}}>{n._name}</Typography>
                                <Typography sx={{fontSize:11,color:T.muted}}>{n._email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{px:1.5,py:1.3}}>
                            <Chip label={n._domain} size="small" sx={{fontSize:11,background:T.bg,color:T.slate,border:`1px solid ${T.border}`}}/>
                          </TableCell>
                          <TableCell sx={{px:1.5,py:1.3}}><Typography sx={{fontSize:12,color:T.slate}}>{n._industry}</Typography></TableCell>
                          <TableCell sx={{px:1.5,py:1.3}}><Typography sx={{fontSize:12,color:T.slate,whiteSpace:'nowrap'}}>{n._phone}</Typography></TableCell>
                          <TableCell sx={{px:1.5,py:1.3}}><Typography sx={{fontSize:12,color:T.navy,whiteSpace:'nowrap'}}>{new Date(t.createdAt).toLocaleDateString()}</Typography></TableCell>
                          <TableCell sx={{px:1.5,py:1.3}} onClick={e=>e.stopPropagation()}>
                            <Box sx={{display:'flex',alignItems:'center',gap:.8}}>
                              <Switch checked={t.isActive} size="small" onChange={()=>toggleStatus(t._id,t.isActive)}
                                sx={{'& .MuiSwitch-thumb':{background:t.isActive?T.emerald:T.rose},'& .MuiSwitch-track':{background:t.isActive?`${T.emerald}40`:`${T.rose}40`}}}/>
                              <Chip label={t.isActive?'Active':'Inactive'} size="small"
                                sx={{fontSize:10,fontWeight:700,background:t.isActive?T.emeraldS:T.roseS,color:t.isActive?'#065F46':'#9F1239'}}/>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{px:1.5,py:1.3}} onClick={e=>e.stopPropagation()}>
                            <Box sx={{display:'flex',justifyContent:'flex-end',gap:.5}}>
                              {[{tip:'Email',icon:<EmailIcon/>,color:T.sky,fn:()=>handleResendEmail(t)},
                                {tip:'View',icon:<VisibilityIcon/>,color:T.indigo,fn:()=>{setSelectedTenant(t);setViewOpen(true);}},
                                {tip:'Edit',icon:<EditIcon/>,color:T.amber,fn:()=>openEdit(t)},
                                {tip:'Delete',icon:<DeleteIcon/>,color:T.rose,fn:()=>{setTenantToDelete(t);setDeleteOpen(true);}},
                              ].map(a=>(
                                <Tooltip key={a.tip} title={a.tip} arrow>
                                  <IconButton onClick={a.fn} size="small"
                                    sx={{borderRadius:'8px',p:.5,color:a.color,background:`${a.color}12`,'&:hover':{background:a.color,color:'#fff'},transition:'all .15s'}}>
                                    {React.cloneElement(a.icon,{sx:{fontSize:14}})}
                                  </IconButton>
                                </Tooltip>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{display:'flex',flexDirection:{xs:'row',sm:'row',lg:'column'},gap:{xs:1.5,sm:2},flexWrap:{xs:'wrap',sm:'nowrap'}}}>
            <Card sx={{p:{xs:2,sm:2.5},borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',flex:{xs:'1 1 calc(50% - 8px)',sm:'1 1 50%',lg:'0 0 auto'},width:{lg:'100%'}}}>
              <Typography sx={{fontWeight:700,fontSize:14,color:T.navy,mb:2}}>Quick Stats</Typography>
              <Box sx={{display:'flex',flexDirection:'column',gap:1.8}}>
                {[{label:'Total Tenants',value:total,color:T.indigo,pct:100},
                  {label:'Active Rate',value:`${Math.round((activeCount/Math.max(total,1))*100)}%`,color:T.emerald,pct:Math.round((activeCount/Math.max(total,1))*100)},
                  {label:'Inactive Rate',value:`${Math.round((inactiveCount/Math.max(total,1))*100)}%`,color:T.rose,pct:Math.round((inactiveCount/Math.max(total,1))*100)},
                ].map(s=>(
                  <Box key={s.label}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:.5}}>
                      <Typography sx={{fontSize:12,color:T.slate}}>{s.label}</Typography>
                      <Typography sx={{fontWeight:800,fontSize:16,color:s.color}}>{s.value}</Typography>
                    </Box>
                    <Box sx={{height:4,borderRadius:'99px',background:T.border,overflow:'hidden'}}>
                      <Box sx={{height:'100%',borderRadius:'99px',background:s.color,width:`${s.pct}%`,transition:'width 1s ease'}}/>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
            <Card sx={{p:{xs:2,sm:2.5},borderRadius:'16px',border:`1px solid ${T.border}`,boxShadow:'none',flex:{xs:'1 1 calc(50% - 8px)',sm:'1 1 50%',lg:'0 0 auto'},width:{lg:'100%'}}}>
              <Typography sx={{fontWeight:700,fontSize:14,color:T.navy,mb:2}}>Recent Activity</Typography>
              <Box sx={{display:'flex',flexDirection:'column',gap:1.5}}>
                {tenants.length===0
                  ?<Typography sx={{fontSize:12,color:T.muted,textAlign:'center',py:2}}>No tenants yet</Typography>
                  :tenants.slice(0,5).map((t,i)=>{
                    const n=N(t);
                    return(
                      <Box key={i} sx={{display:'flex',alignItems:'center',gap:1.5,cursor:'pointer',borderRadius:'10px',p:.5,'&:hover':{background:T.bg}}}
                        onClick={()=>{setSelectedTenant(t);setViewOpen(true);}}>
                        <Avatar sx={{width:30,height:30,background:aColor(n._name),fontSize:12,flexShrink:0}}>{n._name.charAt(0)}</Avatar>
                        <Box sx={{flex:1,minWidth:0}}>
                          <Typography sx={{fontSize:12,fontWeight:600,color:T.navy}} noWrap>{n._name}</Typography>
                          <Typography sx={{fontSize:10,color:T.muted}}>{new Date(t.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                        <Chip label={t.isActive?'Active':'Inactive'} size="small"
                          sx={{fontSize:9,flexShrink:0,background:t.isActive?T.emeraldS:T.roseS,color:t.isActive?'#065F46':'#9F1239',fontWeight:600}}/>
                      </Box>
                    );
                  })}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* ── DIALOGS ── */}

      {/* ADD */}
      <Dialog open={addOpen} onClose={()=>{setAddOpen(false);resetForm();}} maxWidth="md" fullWidth fullScreen={isMobile} scroll="paper"
        PaperProps={{sx:{borderRadius:isMobile?0:'20px',p:0,boxShadow:'0 24px 64px rgba(15,23,42,0.28)',maxHeight:isMobile?'100vh':'92vh','&::-webkit-scrollbar':{width:5},'&::-webkit-scrollbar-thumb':{background:T.indigo,borderRadius:3}}}}>
        <OrganizationForm formData={form} setFormData={setForm} formErrors={formErrors} setFormErrors={setFormErrors}
          onSubmit={handleSubmit} onCancel={()=>{setAddOpen(false);resetForm();}} submitting={submitting} mode="add"/>
      </Dialog>

      {/* EDIT */}
      <Dialog open={editOpen} onClose={()=>{setEditOpen(false);resetForm();}} maxWidth="md" fullWidth fullScreen={isMobile} scroll="paper"
        PaperProps={{sx:{borderRadius:isMobile?0:'20px',p:0,boxShadow:'0 24px 64px rgba(15,23,42,0.28)',maxHeight:isMobile?'100vh':'92vh','&::-webkit-scrollbar':{width:5},'&::-webkit-scrollbar-thumb':{background:T.amber,borderRadius:3}}}}>
        <OrganizationForm formData={form} setFormData={setForm} formErrors={formErrors} setFormErrors={setFormErrors}
          onSubmit={handleEditSubmit} onCancel={()=>{setEditOpen(false);resetForm();}} submitting={submitting} mode="edit"/>
      </Dialog>

      {/* VIEW */}
      <ViewDialog open={viewOpen} onClose={()=>setViewOpen(false)} tenant={selectedTenant}
        onEdit={()=>openEdit(selectedTenant)}
        onDelete={()=>{setTenantToDelete(selectedTenant);setViewOpen(false);setDeleteOpen(true);}}/>

      {/* SUCCESS */}
      <Dialog open={successOpen} onClose={()=>setSuccessOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{sx:{borderRadius:'20px',overflow:'hidden',p:0,mx:{xs:2,sm:'auto'}}}}>
        <Box sx={{background:`linear-gradient(135deg,#059669,${T.emerald})`,px:3,pt:3.5,pb:3,textAlign:'center',position:'relative',overflow:'hidden'}}>
          <Box sx={{position:'absolute',top:-30,left:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
          <Box sx={{position:'relative',zIndex:1}}>
            <Box sx={{width:60,height:60,borderRadius:'50%',background:'rgba(255,255,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center',mx:'auto',mb:1.5,boxShadow:'0 0 0 10px rgba(255,255,255,0.08)'}}>
              <ActiveIcon sx={{color:'#fff',fontSize:30}}/>
            </Box>
            <Typography sx={{fontWeight:800,fontSize:20,color:'#fff',mb:.5}}>Organisation Added! 🎉</Typography>
            <Typography sx={{fontSize:13,color:'rgba(255,255,255,0.80)'}}>Successfully registered and notified</Typography>
          </Box>
        </Box>
        <Box sx={{px:3,py:2.5}}>
          <Box sx={{display:'flex',alignItems:'center',gap:1.5,p:1.8,background:'#F0FDF4',borderRadius:'12px',border:'1px solid #BBF7D0',mb:2}}>
            <Avatar sx={{width:40,height:40,fontWeight:800,fontSize:15,background:`linear-gradient(135deg,#059669,${T.emerald})`}}>{successData?.name?.charAt(0)}</Avatar>
            <Box sx={{flex:1,minWidth:0}}>
              <Typography sx={{fontWeight:700,fontSize:14,color:'#065F46'}} noWrap>{successData?.name}</Typography>
              <Typography sx={{fontSize:12,color:'#047857'}} noWrap>{successData?.domain}</Typography>
            </Box>
            <Chip label="Active" size="small" sx={{background:T.emeraldS,color:'#065F46',fontWeight:700,fontSize:10}}/>
          </Box>
          <Box sx={{display:'flex',alignItems:'flex-start',gap:1.3,p:1.8,background:'#EFF6FF',borderRadius:'12px',border:'1px solid #BFDBFE',mb:2}}>
            <MailSentIcon sx={{color:'#2563EB',fontSize:20,mt:.2,flexShrink:0}}/>
            <Box>
              <Typography sx={{fontWeight:700,fontSize:13,color:'#1E40AF'}}>Credentials Sent!</Typography>
              <Typography sx={{fontSize:12,color:'#3B82F6',mt:.3}}>Login credentials sent to <b>{successData?.email}</b></Typography>
            </Box>
          </Box>
          <Button fullWidth onClick={()=>setSuccessOpen(false)} variant="contained"
            sx={{borderRadius:'10px',textTransform:'none',fontWeight:700,py:1.2,background:`linear-gradient(135deg,#059669,${T.emerald})`,boxShadow:'0 4px 14px rgba(16,185,129,0.4)','&:hover':{opacity:.9}}}>
            Done
          </Button>
        </Box>
      </Dialog>

      {/* DELETE */}
      <Dialog open={deleteOpen} onClose={()=>setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{sx:{borderRadius:'18px',overflow:'hidden',p:0,mx:{xs:2,sm:'auto'}}}}>
        <Box sx={{px:3,pt:2.5,pb:2,borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:1.2}}>
          <Box sx={{p:.8,borderRadius:'10px',background:T.roseS}}><DeleteIcon sx={{color:T.rose,fontSize:20}}/></Box>
          <Typography sx={{fontWeight:800,fontSize:15,color:T.navy}}>Delete Organisation</Typography>
        </Box>
        <Box sx={{px:3,py:2.5}}>
          <Typography sx={{fontSize:14,color:T.slate}}>Permanently delete <b style={{color:T.navy}}>{N(tenantToDelete||{})._name}</b>?</Typography>
          <Box sx={{mt:1.5,p:1.5,borderRadius:'10px',background:'#FFF1F2',border:'1px solid #FECDD3'}}>
            <Typography sx={{fontSize:12,color:T.rose}}>⚠ This cannot be undone and removes all associated data.</Typography>
          </Box>
        </Box>
        <Box sx={{px:3,pb:3,display:'flex',gap:1}}>
          <Button fullWidth onClick={()=>setDeleteOpen(false)} sx={{borderRadius:'10px',textTransform:'none',fontWeight:600,color:T.slate,border:`1px solid ${T.border}`}}>Cancel</Button>
          <Button fullWidth onClick={handleDelete} variant="contained"
            sx={{borderRadius:'10px',textTransform:'none',fontWeight:700,background:T.rose,'&:hover':{background:'#E11D48'}}}>Delete</Button>
        </Box>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={()=>setSnackbar(s=>({...s,open:false}))} anchorOrigin={{vertical:'bottom',horizontal:'center'}}>
        <Alert severity={snackbar.severity} onClose={()=>setSnackbar(s=>({...s,open:false}))} sx={{borderRadius:'12px',fontWeight:600,boxShadow:'0 8px 24px rgba(0,0,0,.14)'}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}