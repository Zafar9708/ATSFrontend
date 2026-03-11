import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Alert, Button, Avatar,
  IconButton, Dialog, DialogContent, Grid, Card, Chip, Switch,
  TextField, InputAdornment, MenuItem, Select, Tooltip, Snackbar,
  FormControl, InputLabel, useMediaQuery, Stepper, Step, StepLabel
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as VisibilityIcon, Search as SearchIcon,
  CheckCircle as ActiveIcon, Cancel as InactiveIcon,
  Refresh as RefreshIcon, TrendingUp as TrendingUpIcon,
  People as PeopleIcon, Business as BusinessIcon,
  Settings as SettingsIcon, Email as EmailIcon,
  ContentCopy as CopyIcon, Close as CloseIcon,
  MarkEmailRead as MailSentIcon, BarChart as BarChartIcon,
  Phone as PhoneIcon, Language as LanguageIcon,
  LocationOn as LocationIcon, Person as PersonIcon,
  NavigateNext as NextIcon, NavigateBefore as PrevIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ChartTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  getTenants, createTenant, updateTenantStatus,
  deleteTenant, resendWelcomeEmail
} from '../../services/tenantService';

/* ── Design tokens ────────────────────────────────────────────────────── */
const T = {
  navy:    '#0F172A',
  slate:   '#334155',
  muted:   '#64748B',
  border:  '#E2E8F0',
  bg:      '#F1F5F9',
  card:    '#FFFFFF',
  indigo:  '#4F46E5',
  indigoL: '#818CF8',
  emerald: '#10B981',
  rose:    '#F43F5E',
  amber:   '#F59E0B',
  sky:     '#0EA5E9',
};

/* ── Stat Card ────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon, from, to, sub }) => (
  <Card sx={{
    p: 2.5, borderRadius: '20px', border: 'none', height: '100%',
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    color: '#fff', position: 'relative', overflow: 'hidden',
    boxShadow: `0 8px 28px ${from}55`,
    transition: 'transform .22s, box-shadow .22s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 14px 36px ${from}77` },
  }}>
    <Box sx={{ position:'absolute', top:-28, right:-28, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.10)' }} />
    <Box sx={{ position:'relative', zIndex:1 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1.5 }}>
        <Typography sx={{ fontSize:11, fontWeight:700, opacity:.8, letterSpacing:.8, textTransform:'uppercase' }}>{title}</Typography>
        <Box sx={{ p:.7, borderRadius:'8px', background:'rgba(255,255,255,0.18)', display:'flex' }}>
          {React.cloneElement(icon, { sx:{ fontSize:17 } })}
        </Box>
      </Box>
      <Typography sx={{ fontSize:34, fontWeight:800, lineHeight:1, letterSpacing:-1, mb:1.2 }}>{value}</Typography>
      <Box sx={{ display:'flex', alignItems:'center', gap:.5 }}>
        <TrendingUpIcon sx={{ fontSize:13, opacity:.7 }} />
        <Typography sx={{ fontSize:11, opacity:.8 }}>{sub}</Typography>
      </Box>
    </Box>
  </Card>
);

/* ── Chart Tooltip ────────────────────────────────────────────────────── */
const CTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background:T.navy, borderRadius:'10px', p:'8px 14px', boxShadow:'0 4px 20px rgba(0,0,0,.3)' }}>
      <Typography sx={{ color:'#fff', fontSize:11, fontWeight:700, mb:.5 }}>{label}</Typography>
      {payload.map((p,i) => (
        <Typography key={i} sx={{ color:p.color, fontSize:11 }}>{p.name}: <b>{p.value}</b></Typography>
      ))}
    </Box>
  );
};

/* ── Shared input style ───────────────────────────────────────────────── */
const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius:'10px', background:'#F8FAFC', fontSize:14 },
  '& .MuiInputLabel-root': { fontSize:14 },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: T.border },
};

/* ── Step Section Header ─────────────────────────────────────────────── */
const SectionHeader = ({ icon, title, subtitle, color = T.indigo }) => (
  <Box sx={{ display:'flex', alignItems:'center', gap:1.2, mb:2 }}>
    <Box sx={{ p:.7, borderRadius:'10px', background:`${color}15`, display:'flex', flexShrink:0 }}>
      {React.cloneElement(icon, { sx:{ fontSize:18, color } })}
    </Box>
    <Box>
      <Typography sx={{ fontWeight:700, fontSize:13, color:T.navy, lineHeight:1.2 }}>{title}</Typography>
      <Typography sx={{ fontSize:11, color:T.muted }}>{subtitle}</Typography>
    </Box>
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════ */
const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  /* ── State ──────────────────────────────────────────────────────── */
  const [tenants,        setTenants]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [refreshing,     setRefreshing]     = useState(false);
  const [searchTerm,     setSearchTerm]     = useState('');
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [snackbar,       setSnackbar]       = useState({ open:false, message:'', severity:'success' });

  const [addOpen,        setAddOpen]        = useState(false);
  const [successOpen,    setSuccessOpen]    = useState(false);
  const [viewOpen,       setViewOpen]       = useState(false);
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [successData,    setSuccessData]    = useState(null);

  /* ── Multi-step form state ──────────────────────────────────────── */
  const [activeStep, setActiveStep] = useState(0);

  const emptyForm = {
    // Company Info
    name: '',
    domain: '',
    email: '',
    companyPhone: '',
    website: '',
    industry: '',
    companySize: '',
    gstNumber: '',
    // Company Address
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    // Admin Info
    adminFirstName: '',
    adminLastName: '',
    adminPhone: '',
    adminPassword: '',
  };

  const [form,       setForm]       = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const STEPS = ['Company Info', 'Address', 'Admin Details'];

  const INDUSTRY_OPTIONS = ['IT', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Real Estate', 'Logistics', 'Other'];
  const SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  /* ── Fetch ──────────────────────────────────────────────────────── */
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const r = await getTenants();
      setTenants(r.data.tenants || []);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { fetchTenants(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchTenants(); };

  /* ── Derived ────────────────────────────────────────────────────── */
  const activeCount   = tenants.filter(t => t.isActive).length;
  const inactiveCount = tenants.filter(t => !t.isActive).length;
  const total         = tenants.length;

  const filtered = tenants.filter(t => {
    const s   = searchTerm.toLowerCase();
    const ms  = t.name?.toLowerCase().includes(s) || t.domain?.toLowerCase().includes(s);
    const mst = statusFilter === 'all'
              || (statusFilter === 'active'   && t.isActive)
              || (statusFilter === 'inactive' && !t.isActive);
    return ms && mst;
  });

  const activityData = (() => {
    const now    = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return Array.from({ length:6 }, (_,idx) => {
      const mIdx = (now.getMonth() - 5 + idx + 12) % 12;
      return {
        name:     months[mIdx],
        active:   tenants.filter(t => new Date(t.createdAt).getMonth()===mIdx &&  t.isActive).length,
        inactive: tenants.filter(t => new Date(t.createdAt).getMonth()===mIdx && !t.isActive).length,
      };
    });
  })();

  const pieData  = [{ name:'Active', value:activeCount }, { name:'Inactive', value:inactiveCount }];
  const PIE_CLR  = [T.emerald, T.rose];

  /* ── Helpers ────────────────────────────────────────────────────── */
  const toast = (message, severity='success') => setSnackbar({ open:true, message, severity });
  const copy  = text => navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!'));

  /* ── Tenant actions ─────────────────────────────────────────────── */
  const toggleStatus = async (id, cur) => {
    try {
      await updateTenantStatus(id, !cur);
      setTenants(ts => ts.map(t => t._id===id ? { ...t, isActive:!cur } : t));
      toast(`Tenant ${!cur ? 'activated' : 'deactivated'}`);
    } catch { toast('Failed to update status', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await deleteTenant(tenantToDelete._id);
      setTenants(ts => ts.filter(t => t._id !== tenantToDelete._id));
      setDeleteOpen(false);
      toast('Tenant deleted successfully');
    } catch { toast('Failed to delete tenant', 'error'); }
  };

  const handleResendEmail = async (tenant) => {
    try {
      await resendWelcomeEmail(tenant._id);
      toast('Welcome email resent!');
    } catch { toast('Failed to resend email', 'error'); }
  };

  /* ── Form ───────────────────────────────────────────────────────── */
  const handleInput = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    // Clear error on change
    if (formErrors[e.target.name]) {
      setFormErrors(p => ({ ...p, [e.target.name]: '' }));
    }
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim())         e.name         = 'Organisation name is required';
      if (!form.domain.trim())       e.domain       = 'Domain is required';
      if (!form.email.trim())        e.email        = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
      if (!form.companyPhone.trim()) e.companyPhone = 'Company phone is required';
      if (!form.industry)            e.industry     = 'Industry is required';
      if (!form.companySize)         e.companySize  = 'Company size is required';
    }
    if (step === 1) {
      if (!form.street.trim())  e.street  = 'Street is required';
      if (!form.city.trim())    e.city    = 'City is required';
      if (!form.state.trim())   e.state   = 'State is required';
      if (!form.country.trim()) e.country = 'Country is required';
      if (!form.zipCode.trim()) e.zipCode = 'Zip code is required';
    }
    if (step === 2) {
      if (!form.adminFirstName.trim()) e.adminFirstName = 'First name is required';
      if (!form.adminLastName.trim())  e.adminLastName  = 'Last name is required';
      if (!form.adminPhone.trim())     e.adminPhone     = 'Admin phone is required';
      if (!form.adminPassword)         e.adminPassword  = 'Password is required';
      else if (form.adminPassword.length < 8) e.adminPassword = 'Minimum 8 characters';
    }
    setFormErrors(prev => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep(s => s + 1);
  };

  const handleBack = () => setActiveStep(s => s - 1);

  const resetForm = () => {
    setForm(emptyForm);
    setFormErrors({});
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    try {
      const payload = {
        name:         form.name,
        domain:       form.domain,
        email:        form.email,
        companyPhone: form.companyPhone,
        website:      form.website,
        industry:     form.industry,
        companySize:  form.companySize,
        gstNumber:    form.gstNumber,
        companyAddress: {
          street:  form.street,
          city:    form.city,
          state:   form.state,
          country: form.country,
          zipCode: form.zipCode,
        },
        adminFirstName: form.adminFirstName,
        adminLastName:  form.adminLastName,
        adminPhone:     form.adminPhone,
        adminPassword:  form.adminPassword,
      };

      const res = await createTenant(payload);
      setAddOpen(false);
      setSuccessData({
        name:      form.name,
        email:     form.email,
        domain:    form.domain,
        loginLink: res?.data?.loginLink || `https://${form.domain}/login`,
      });
      resetForm();
      setSuccessOpen(true);
      fetchTenants();
    } catch(err) {
      toast(err?.response?.data?.message || 'Failed to create organisation', 'error');
    } finally { setSubmitting(false); }
  };

  /* ── Guard states ───────────────────────────────────────────────── */
  if (loading && !refreshing) return (
    <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', background:T.bg }}>
      <Box textAlign="center">
        <CircularProgress size={44} sx={{ color:T.indigo, mb:2 }} />
        <Typography sx={{ color:T.muted, fontSize:13 }}>Loading dashboard…</Typography>
      </Box>
    </Box>
  );
  if (error) return (
    <Alert severity="error" sx={{ m:3, borderRadius:'14px' }} onClose={() => setError(null)}>{error}</Alert>
  );

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <Box sx={{ minHeight:'100vh', background:T.bg, p:{ xs:1.5, sm:2.5, md:3 } }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        mb:3, flexWrap:'wrap', gap:1.5
      }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
          <Box sx={{ p:1, borderRadius:'12px', background:T.indigo, display:'flex', flexShrink:0 }}>
            <BusinessIcon sx={{ color:'#fff', fontSize:22 }} />
          </Box>
          <Box>
            <Typography sx={{
              fontSize:{ xs:16, sm:20, md:23 }, fontWeight:800,
              color:T.navy, lineHeight:1.2, letterSpacing:-.4
            }}>
              Organization Management
            </Typography>
            <Typography sx={{ fontSize:12, color:T.muted }}>
              Manage tenants, credentials &amp; configurations
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display:'flex', gap:1 }}>
          <Button onClick={handleRefresh} disabled={refreshing}
            startIcon={<RefreshIcon sx={{ fontSize:'16px !important' }} />}
            sx={{
              borderRadius:'10px', textTransform:'none', fontWeight:600, fontSize:13,
              color:T.slate, background:T.card, border:`1px solid ${T.border}`,
              px:{ xs:1.5, sm:2 }, minWidth:0, '&:hover':{ background:T.bg }
            }}>
            <Box component="span" sx={{ display:{ xs:'none', sm:'inline' } }}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Box>
          </Button>
          <Button onClick={() => setAddOpen(true)}
            startIcon={<AddIcon sx={{ fontSize:'16px !important' }} />}
            variant="contained"
            sx={{
              borderRadius:'10px', textTransform:'none', fontWeight:700, fontSize:13,
              background:T.indigo, px:{ xs:1.5, sm:2.5 },
              boxShadow:`0 4px 16px ${T.indigo}50`,
              '&:hover':{ background:T.indigoL }
            }}>
            <Box component="span" sx={{ display:{ xs:'none', sm:'inline' } }}>Add Organisation</Box>
            <Box component="span" sx={{ display:{ xs:'inline', sm:'none' } }}>Add</Box>
          </Button>
        </Box>
      </Box>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <Grid container spacing={{ xs:1.5, sm:2 }} sx={{ mb:2.5 }}>
        {[
          { title:'Total Tenants',    value:total,        icon:<PeopleIcon />,   from:'#4F46E5', to:'#7C3AED', sub:'All registered' },
          { title:'Active Tenants',   value:activeCount,  icon:<ActiveIcon />,   from:'#059669', to:'#10B981', sub:`${Math.round((activeCount/Math.max(total,1))*100)}% of total` },
          { title:'Inactive',         value:inactiveCount,icon:<InactiveIcon />, from:'#E11D48', to:'#F43F5E', sub:`${Math.round((inactiveCount/Math.max(total,1))*100)}% of total` },
          { title:'Growth Rate',      value:'+22%',       icon:<BarChartIcon />, from:'#D97706', to:'#F59E0B', sub:'Quarterly increase' },
        ].map((s,i) => (
          <Grid key={i} item xs={6} sm={6} md={3}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* ── Main two-column grid ────────────────────────────────────── */}
      <Grid container spacing={{ xs:2, sm:2.5 }}>

        {/* ── Left column ─────────────────────────────────────────── */}
        <Grid item xs={12} lg={8}>

          {/* Charts */}
          <Grid container spacing={{ xs:2, sm:2 }} sx={{ mb:2.5 }}>
            <Grid item xs={12} md={7}>
              <Card sx={{
                p:2.5, borderRadius:'20px', border:`1px solid ${T.border}`,
                boxShadow:'none', height:280
              }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1.5 }}>
                  <Box>
                    <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Tenant Activity</Typography>
                    <Typography sx={{ fontSize:11, color:T.muted }}>Monthly active vs inactive</Typography>
                  </Box>
                  <Chip label="6 months" size="small"
                    sx={{ fontSize:10, background:'#EEF2FF', color:T.indigo, fontWeight:700 }} />
                </Box>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={activityData} margin={{ left:-20, right:8 }}>
                    <defs>
                      <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.emerald} stopOpacity={.28} />
                        <stop offset="95%" stopColor={T.emerald} stopOpacity={0}  />
                      </linearGradient>
                      <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.rose} stopOpacity={.28} />
                        <stop offset="95%" stopColor={T.rose} stopOpacity={0}  />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill:T.muted, fontSize:10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:T.muted, fontSize:10 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<CTooltip />} />
                    <Area type="monotone" dataKey="active"   name="Active"   stroke={T.emerald} strokeWidth={2.5} fill="url(#gA)" />
                    <Area type="monotone" dataKey="inactive" name="Inactive" stroke={T.rose}    strokeWidth={2.5} fill="url(#gI)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{
                p:2.5, borderRadius:'20px', border:`1px solid ${T.border}`,
                boxShadow:'none', height:280
              }}>
                <Box sx={{ mb:1 }}>
                  <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Status Distribution</Typography>
                  <Typography sx={{ fontSize:11, color:T.muted }}>Current tenant states</Typography>
                </Box>
                <Box sx={{ display:'flex', gap:2.5, mb:1 }}>
                  {pieData.map((d,i) => (
                    <Box key={d.name} sx={{ display:'flex', alignItems:'center', gap:.6 }}>
                      <Box sx={{ width:8, height:8, borderRadius:'50%', background:PIE_CLR[i], flexShrink:0 }} />
                      <Typography sx={{ fontSize:11, color:T.slate, fontWeight:500 }}>{d.name}: <b style={{ color:T.navy }}>{d.value}</b></Typography>
                    </Box>
                  ))}
                </Box>
                <ResponsiveContainer width="100%" height="75%">
                  <PieChart margin={{ top:10, right:10, bottom:10, left:10 }}>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={42} outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={true}
                    >
                      {pieData.map((_,i) => <Cell key={i} fill={PIE_CLR[i % PIE_CLR.length]} />)}
                    </Pie>
                    <ChartTooltip content={<CTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Search & filter */}
          <Card sx={{ p:2, mb:2, borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none' }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" placeholder="Search by name or domain…"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color:T.muted, fontSize:17 }} /></InputAdornment>,
                    sx: { borderRadius:'10px', background:T.bg, fontSize:13 }
                  }}
                  sx={{ '& fieldset':{ borderColor:T.border } }} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize:13 }}>Status</InputLabel>
                  <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    label="Status" sx={{ borderRadius:'10px', fontSize:13, background:T.bg }}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={2} sx={{ textAlign:'right' }}>
                <Typography sx={{ fontSize:12, color:T.muted }}>
                  <b style={{ color:T.navy }}>{filtered.length}</b>/{total}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Table */}
          <Card sx={{ borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden' }}>
            <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Tenant List</Typography>
              <Chip label={`${filtered.length} results`} size="small"
                sx={{ fontSize:10, background:'#EEF2FF', color:T.indigo, fontWeight:700 }} />
            </Box>
            <Box sx={{ overflowX:'auto' }}>
              <Table sx={{ minWidth:520 }}>
                <TableHead>
                  <TableRow sx={{ background:T.bg }}>
                    {['Tenant','Domain','Created','Status','Actions'].map((h,i) => (
                      <TableCell key={h} align={i===4 ? 'right' : 'left'}
                        sx={{
                          fontWeight:700, fontSize:10, color:T.muted, textTransform:'uppercase',
                          letterSpacing:.6, borderBottom:`1px solid ${T.border}`,
                          py:1.2, px:i===0 ? 2.5 : 1.5, whiteSpace:'nowrap'
                        }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py:6, color:T.muted, fontSize:13 }}>
                        No tenants match your search
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map(t => (
                    <TableRow key={t._id} sx={{ '&:last-child td':{ border:0 }, '&:hover':{ background:'#F8FAFC' } }}>
                      <TableCell sx={{ px:2.5, py:1.3 }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                          <Avatar sx={{ width:34, height:34, background:T.indigo, fontSize:13, fontWeight:700 }}>
                            {t.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight:600, fontSize:13, color:T.navy, lineHeight:1.3 }}>{t.name}</Typography>
                            <Typography sx={{ fontSize:11, color:T.muted }}>{t.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ px:1.5, py:1.3 }}>
                        <Chip label={t.domain} size="small"
                          sx={{ fontSize:11, background:T.bg, color:T.slate, fontWeight:500, border:`1px solid ${T.border}` }} />
                      </TableCell>
                      <TableCell sx={{ px:1.5, py:1.3 }}>
                        <Typography sx={{ fontSize:12, color:T.navy, whiteSpace:'nowrap' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ px:1.5, py:1.3 }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:.8 }}>
                          <Switch checked={t.isActive} size="small" onChange={() => toggleStatus(t._id, t.isActive)}
                            sx={{
                              '& .MuiSwitch-thumb': { background: t.isActive ? T.emerald : T.rose },
                              '& .MuiSwitch-track': { background: t.isActive ? `${T.emerald}40` : `${T.rose}40` }
                            }} />
                          <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
                            sx={{
                              fontSize:10, fontWeight:700, px:.3,
                              background: t.isActive ? '#D1FAE5' : '#FFE4E6',
                              color:      t.isActive ? '#065F46' : '#9F1239'
                            }} />
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ px:1.5, py:1.3 }}>
                        <Box sx={{ display:'flex', justifyContent:'flex-end', gap:.5 }}>
                          {[
                            { tip:'Resend Email', icon:<EmailIcon />,      color:T.sky,    fn:() => handleResendEmail(t)                          },
                            { tip:'View Details', icon:<VisibilityIcon />, color:T.indigo, fn:() => { setSelectedTenant(t); setViewOpen(true); }   },
                            { tip:'Edit',         icon:<EditIcon />,       color:T.amber,  fn:() => navigate(`/superadmin/tenants/edit/${t._id}`)  },
                            { tip:'Delete',       icon:<DeleteIcon />,     color:T.rose,   fn:() => { setTenantToDelete(t); setDeleteOpen(true); } },
                          ].map(a => (
                            <Tooltip key={a.tip} title={a.tip} arrow>
                              <IconButton onClick={a.fn} size="small"
                                sx={{
                                  borderRadius:'8px', p:.55, color:a.color, background:`${a.color}14`,
                                  '&:hover':{ background:a.color, color:'#fff' }, transition:'all .15s'
                                }}>
                                {React.cloneElement(a.icon, { sx:{ fontSize:15 } })}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        {/* ── Right sidebar ───────────────────────────────────────── */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display:'flex', flexDirection:{ xs:'column', sm:'row', lg:'column' }, gap:2 }}>

            {/* Recent Activity */}
            <Card sx={{ flex:1, borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden' }}>
              <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
                <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Recent Activity</Typography>
              </Box>
              <Box sx={{ maxHeight:{ xs:200, lg:290 }, overflowY:'auto', p:1.5, display:'flex', flexDirection:'column', gap:.8 }}>
                {[
                  "Created new tenant 'Acme Corp'",
                  "Updated 'Tech Solutions' settings",
                  "Deactivated 'Global Enterprises'",
                  "Admin logged in to dashboard",
                  "Generated monthly report",
                  "Added new admin user",
                  "Password changed successfully",
                  "Viewed tenant details",
                ].map((msg,i) => (
                  <Box key={i} sx={{ display:'flex', gap:1.2, p:1.2, borderRadius:'10px', background:T.bg }}>
                    <Avatar sx={{ width:28, height:28, background:T.indigo, fontSize:11, flexShrink:0 }}>U</Avatar>
                    <Box sx={{ flex:1, minWidth:0 }}>
                      <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                        <Typography sx={{ fontSize:11, fontWeight:600, color:T.navy }}>System</Typography>
                        <Typography sx={{ fontSize:10, color:T.muted }}>{i+1}h ago</Typography>
                      </Box>
                      <Typography sx={{ fontSize:11, color:T.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {msg}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Latest Tenants */}
            <Card sx={{ flex:1, borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden' }}>
              <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
                <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Latest Tenants</Typography>
              </Box>
              <Box sx={{ maxHeight:{ xs:200, lg:290 }, overflowY:'auto', p:1.5, display:'flex', flexDirection:'column', gap:.8 }}>
                {tenants.slice(0,6).map(t => (
                  <Box key={t._id} sx={{ display:'flex', alignItems:'center', gap:1.2, p:1.2, borderRadius:'10px', background:T.bg }}>
                    <Avatar sx={{ width:32, height:32, background:T.indigo, fontSize:12, fontWeight:700, flexShrink:0 }}>
                      {t.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex:1, minWidth:0 }}>
                      <Typography sx={{ fontSize:12, fontWeight:600, color:T.navy, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {t.name}
                      </Typography>
                      <Typography sx={{ fontSize:10, color:T.muted }}>{t.domain}</Typography>
                    </Box>
                    <Box sx={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:.4, flexShrink:0 }}>
                      <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
                        sx={{
                          fontSize:9, fontWeight:700, height:16, px:.2,
                          background: t.isActive ? '#D1FAE5' : '#FFE4E6',
                          color:      t.isActive ? '#065F46' : '#9F1239'
                        }} />
                      <Button size="small" onClick={() => { setSelectedTenant(t); setViewOpen(true); }}
                        sx={{ fontSize:10, textTransform:'none', color:T.indigo, p:0, minWidth:'auto', fontWeight:600, lineHeight:1 }}>
                        View
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ borderRadius:'20px', border:`1px solid ${T.border}`, boxShadow:'none', overflow:'hidden' }}>
              <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
                <Typography sx={{ fontWeight:700, fontSize:14, color:T.navy }}>Quick Actions</Typography>
              </Box>
              <Box sx={{ p:1.5, display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
                {[
                  { label:'Add Tenant', icon:<AddIcon />,      variant:'filled',  fn:() => setAddOpen(true) },
                  { label:'Settings',   icon:<SettingsIcon />, variant:'outline', fn:()=>{} },
                  { label:'Users',      icon:<PeopleIcon />,   variant:'outline', fn:()=>{} },
                  { label:'Reports',    icon:<BarChartIcon />, variant:'outline', fn:()=>{} },
                ].map(a => (
                  <Button key={a.label} onClick={a.fn}
                    startIcon={React.cloneElement(a.icon, { sx:{ fontSize:'15px !important' } })} fullWidth
                    sx={{
                      borderRadius:'10px', textTransform:'none', fontWeight:600, fontSize:12, py:1.1,
                      ...(a.variant === 'filled'
                        ? { background:T.indigo, color:'#fff', boxShadow:`0 3px 10px ${T.indigo}40`, '&:hover':{ background:T.indigoL } }
                        : { background:T.bg, color:T.slate, border:`1px solid ${T.border}`, '&:hover':{ background:T.border } })
                    }}>
                    {a.label}
                  </Button>
                ))}
              </Box>
            </Card>

          </Box>
        </Grid>
      </Grid>

      {/* ════════════════════════════════════════════════════════════════
          ADD ORGANISATION DIALOG  — 3-step form
      ════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={addOpen}
        onClose={() => { setAddOpen(false); resetForm(); }}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:'24px', overflow:'hidden', p:0 } }}>

        {/* Gradient header */}
        <Box sx={{
          background:`linear-gradient(135deg, ${T.indigo} 0%, #7C3AED 100%)`,
          px:3, pt:3, pb:2.5
        }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:2 }}>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
              <Box sx={{ p:.9, borderRadius:'12px', background:'rgba(255,255,255,0.18)', display:'flex' }}>
                <BusinessIcon sx={{ color:'#fff', fontSize:22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight:800, fontSize:18, color:'#fff', lineHeight:1.2 }}>
                  New Organisation
                </Typography>
                <Typography sx={{ fontSize:12, color:'rgba(255,255,255,0.72)', mt:.2 }}>
                  Register a new tenant account
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => { setAddOpen(false); resetForm(); }}
              sx={{ color:'rgba(255,255,255,0.7)', p:.5, '&:hover':{ color:'#fff', background:'rgba(255,255,255,0.12)' } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{
            '& .MuiStepLabel-label': { color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600 },
            '& .MuiStepLabel-label.Mui-active': { color:'#fff', fontWeight:700 },
            '& .MuiStepLabel-label.Mui-completed': { color:'rgba(255,255,255,0.8)' },
            '& .MuiStepIcon-root': { color:'rgba(255,255,255,0.3)', fontSize:20 },
            '& .MuiStepIcon-root.Mui-active': { color:'#fff' },
            '& .MuiStepIcon-root.Mui-completed': { color:'rgba(255,255,255,0.8)' },
            '& .MuiStepConnector-line': { borderColor:'rgba(255,255,255,0.25)' },
            '& .MuiStepIcon-text': { fill: T.indigo, fontSize:10, fontWeight:700 },
          }}>
            {STEPS.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form body */}
        <Box sx={{ px:3, py:2.5, maxHeight:'60vh', overflowY:'auto' }}>

          {/* ── STEP 0: Company Info ─────────────────────────────── */}
          {activeStep === 0 && (
            <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
              <SectionHeader
                icon={<BusinessIcon />}
                title="Company Information"
                subtitle="Basic details about the organisation"
              />

              {/* Name + Domain */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Organisation Name" name="name"
                    value={form.name} onChange={handleInput}
                    error={!!formErrors.name} helperText={formErrors.name}
                    size="small" placeholder="e.g. Kludrac Group" sx={inputSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Domain" name="domain"
                    value={form.domain} onChange={handleInput}
                    error={!!formErrors.domain} helperText={formErrors.domain}
                    size="small" placeholder="e.g. kloudrac.com" sx={inputSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize:13, color:T.muted, lineHeight:1, userSelect:'none' }}>🌐</Typography></InputAdornment> }} />
                </Grid>
              </Grid>

              {/* Email + Phone */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Admin Email" name="email" type="email"
                    value={form.email} onChange={handleInput}
                    error={!!formErrors.email} helperText={formErrors.email}
                    size="small" placeholder="e.g. admin@kloudrac.com" sx={inputSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Phone" name="companyPhone"
                    value={form.companyPhone} onChange={handleInput}
                    error={!!formErrors.companyPhone} helperText={formErrors.companyPhone}
                    size="small" placeholder="e.g. 9876543210" sx={inputSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />
                </Grid>
              </Grid>

              {/* Website */}
              <TextField fullWidth label="Website (optional)" name="website"
                value={form.website} onChange={handleInput}
                size="small" placeholder="e.g. https://kloudrac.com" sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />

              {/* Industry + Company Size */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!formErrors.industry}>
                    <InputLabel sx={{ fontSize:14 }}>Industry</InputLabel>
                    <Select name="industry" value={form.industry}
                      onChange={e => { setForm(p => ({ ...p, industry: e.target.value })); if (formErrors.industry) setFormErrors(p => ({ ...p, industry: '' })); }}
                      label="Industry"
                      sx={{ borderRadius:'10px', background:'#F8FAFC', fontSize:14, '& .MuiOutlinedInput-notchedOutline':{ borderColor:T.border } }}>
                      {INDUSTRY_OPTIONS.map(o => <MenuItem key={o} value={o} sx={{ fontSize:13 }}>{o}</MenuItem>)}
                    </Select>
                    {formErrors.industry && <Typography sx={{ fontSize:11, color:'#d32f2f', mt:.3, ml:1.5 }}>{formErrors.industry}</Typography>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!formErrors.companySize}>
                    <InputLabel sx={{ fontSize:14 }}>Company Size</InputLabel>
                    <Select name="companySize" value={form.companySize}
                      onChange={e => { setForm(p => ({ ...p, companySize: e.target.value })); if (formErrors.companySize) setFormErrors(p => ({ ...p, companySize: '' })); }}
                      label="Company Size"
                      sx={{ borderRadius:'10px', background:'#F8FAFC', fontSize:14, '& .MuiOutlinedInput-notchedOutline':{ borderColor:T.border } }}>
                      {SIZE_OPTIONS.map(o => <MenuItem key={o} value={o} sx={{ fontSize:13 }}>{o}</MenuItem>)}
                    </Select>
                    {formErrors.companySize && <Typography sx={{ fontSize:11, color:'#d32f2f', mt:.3, ml:1.5 }}>{formErrors.companySize}</Typography>}
                  </FormControl>
                </Grid>
              </Grid>

              {/* GST Number */}
              <TextField fullWidth label="GST Number (optional)" name="gstNumber"
                value={form.gstNumber} onChange={handleInput}
                size="small" placeholder="e.g. 22AAAAA0000A1Z5" sx={inputSx} />
            </Box>
          )}

          {/* ── STEP 1: Company Address ──────────────────────────── */}
          {activeStep === 1 && (
            <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
              <SectionHeader
                icon={<LocationIcon />}
                title="Company Address"
                subtitle="Registered office address details"
                color={T.sky}
              />

              {/* Street */}
              <TextField fullWidth label="Street Address" name="street"
                value={form.street} onChange={handleInput}
                error={!!formErrors.street} helperText={formErrors.street}
                size="small" placeholder="e.g. Sector 62" sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />

              {/* City + State */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" name="city"
                    value={form.city} onChange={handleInput}
                    error={!!formErrors.city} helperText={formErrors.city}
                    size="small" placeholder="e.g. Noida" sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="State" name="state"
                    value={form.state} onChange={handleInput}
                    error={!!formErrors.state} helperText={formErrors.state}
                    size="small" placeholder="e.g. Uttar Pradesh" sx={inputSx} />
                </Grid>
              </Grid>

              {/* Country + Zip */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Country" name="country"
                    value={form.country} onChange={handleInput}
                    error={!!formErrors.country} helperText={formErrors.country}
                    size="small" placeholder="e.g. India" sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Zip / Postal Code" name="zipCode"
                    value={form.zipCode} onChange={handleInput}
                    error={!!formErrors.zipCode} helperText={formErrors.zipCode}
                    size="small" placeholder="e.g. 201301" sx={inputSx} />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ── STEP 2: Admin Details ────────────────────────────── */}
          {activeStep === 2 && (
            <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
              <SectionHeader
                icon={<PersonIcon />}
                title="Admin Details"
                subtitle="Primary administrator account credentials"
                color={T.emerald}
              />

              {/* First + Last name */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" name="adminFirstName"
                    value={form.adminFirstName} onChange={handleInput}
                    error={!!formErrors.adminFirstName} helperText={formErrors.adminFirstName}
                    size="small" placeholder="e.g. Atul" sx={inputSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" name="adminLastName"
                    value={form.adminLastName} onChange={handleInput}
                    error={!!formErrors.adminLastName} helperText={formErrors.adminLastName}
                    size="small" placeholder="e.g. Singhal" sx={inputSx} />
                </Grid>
              </Grid>

              {/* Admin Phone */}
              <TextField fullWidth label="Admin Phone" name="adminPhone"
                value={form.adminPhone} onChange={handleInput}
                error={!!formErrors.adminPhone} helperText={formErrors.adminPhone}
                size="small" placeholder="e.g. 9876543210" sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize:16, color:T.muted }} /></InputAdornment> }} />

              {/* Admin Password */}
              <TextField fullWidth label="Admin Password" name="adminPassword" type="password"
                value={form.adminPassword} onChange={handleInput}
                error={!!formErrors.adminPassword}
                helperText={formErrors.adminPassword || 'Minimum 8 characters'}
                size="small" sx={inputSx} />

              {/* Summary preview */}
              <Box sx={{ p:2, borderRadius:'12px', background:'#F0FDF4', border:'1px solid #BBF7D0', mt:.5 }}>
                <Typography sx={{ fontSize:11, fontWeight:700, color:'#065F46', mb:.8 }}>Review Summary</Typography>
                {[
                  ['Organisation', form.name],
                  ['Domain',       form.domain],
                  ['Email',        form.email],
                  ['Location',     [form.city, form.state, form.country].filter(Boolean).join(', ')],
                  ['Industry',     form.industry],
                ].map(([k,v]) => v && (
                  <Box key={k} sx={{ display:'flex', gap:1, mb:.3 }}>
                    <Typography sx={{ fontSize:11, color:'#047857', fontWeight:600, minWidth:80 }}>{k}:</Typography>
                    <Typography sx={{ fontSize:11, color:'#065F46' }}>{v}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer buttons */}
        <Box sx={{ px:3, pb:3, pt:1.5, borderTop:`1px solid ${T.border}`, display:'flex', gap:1.5 }}>
          <Button
            onClick={activeStep === 0 ? () => { setAddOpen(false); resetForm(); } : handleBack}
            fullWidth
            startIcon={activeStep > 0 ? <PrevIcon sx={{ fontSize:'16px !important' }} /> : null}
            sx={{
              borderRadius:'10px', textTransform:'none', fontWeight:600, py:1.1,
              color:T.slate, border:`1px solid ${T.border}`, '&:hover':{ background:T.bg }
            }}>
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          {activeStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} variant="contained" fullWidth
              endIcon={<NextIcon sx={{ fontSize:'16px !important' }} />}
              sx={{
                borderRadius:'10px', textTransform:'none', fontWeight:700, py:1.1,
                background:T.indigo, boxShadow:`0 4px 16px ${T.indigo}45`,
                '&:hover':{ background:T.indigoL }
              }}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained" fullWidth disabled={submitting}
              sx={{
                borderRadius:'10px', textTransform:'none', fontWeight:700, py:1.1,
                background:T.indigo, boxShadow:`0 4px 16px ${T.indigo}45`,
                '&:hover':{ background:T.indigoL },
                '&:disabled':{ background:`${T.indigo}60`, color:'rgba(255,255,255,0.6)' }
              }}>
              {submitting ? 'Creating…' : 'Register Organisation'}
            </Button>
          )}
        </Box>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════
          SUCCESS DIALOG
      ════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:'24px', overflow:'hidden', p:0 } }}>

        {/* Green gradient header */}
        <Box sx={{
          background:`linear-gradient(135deg, #059669 0%, ${T.emerald} 60%, #34D399 100%)`,
          px:3, pt:3.5, pb:3, textAlign:'center', position:'relative', overflow:'hidden'
        }}>
          <Box sx={{ position:'absolute', top:-30, left:-30, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
          <Box sx={{ position:'absolute', bottom:-20, right:-20, width:80,  height:80,  borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position:'relative', zIndex:1 }}>
            <Box sx={{
              width:64, height:64, borderRadius:'50%',
              background:'rgba(255,255,255,0.22)',
              display:'flex', alignItems:'center', justifyContent:'center',
              mx:'auto', mb:1.5,
              boxShadow:'0 0 0 12px rgba(255,255,255,0.08)',
            }}>
              <ActiveIcon sx={{ color:'#fff', fontSize:34 }} />
            </Box>
            <Typography sx={{ fontWeight:800, fontSize:21, color:'#fff', mb:.5 }}>
              Organisation Added! 🎉
            </Typography>
            <Typography sx={{ fontSize:13, color:'rgba(255,255,255,0.80)' }}>
              Successfully registered and notified
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ px:3, py:2.5 }}>
          <Box sx={{
            display:'flex', alignItems:'center', gap:1.5,
            p:1.8, background:'#F0FDF4', borderRadius:'14px',
            border:'1px solid #BBF7D0', mb:2
          }}>
            <Avatar sx={{
              width:42, height:42, fontWeight:800, fontSize:16, flexShrink:0,
              background:`linear-gradient(135deg, #059669, ${T.emerald})`
            }}>
              {successData?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex:1, minWidth:0 }}>
              <Typography sx={{ fontWeight:700, fontSize:15, color:'#065F46', lineHeight:1.3 }}>
                {successData?.name}
              </Typography>
              <Typography sx={{ fontSize:12, color:'#047857' }}>{successData?.domain}</Typography>
            </Box>
            <Chip label="Active" size="small"
              sx={{ background:'#D1FAE5', color:'#065F46', fontWeight:700, fontSize:10, flexShrink:0 }} />
          </Box>

          <Box sx={{
            display:'flex', alignItems:'flex-start', gap:1.3,
            p:1.8, background:'#EFF6FF', borderRadius:'14px',
            border:'1px solid #BFDBFE', mb:2
          }}>
            <MailSentIcon sx={{ color:'#2563EB', fontSize:22, mt:.1, flexShrink:0 }} />
            <Box>
              <Typography sx={{ fontWeight:700, fontSize:13, color:'#1E40AF' }}>
                Credentials Sent!
              </Typography>
              <Typography sx={{ fontSize:12, color:'#3B82F6', mt:.3, lineHeight:1.5 }}>
                Login credentials have been sent to<br />
                <b>{successData?.email}</b>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px:3, pb:3 }}>
          <Button fullWidth onClick={() => setSuccessOpen(false)} variant="contained"
            sx={{
              borderRadius:'10px', textTransform:'none', fontWeight:700, py:1.2,
              background:`linear-gradient(135deg, #059669, ${T.emerald})`,
              boxShadow:'0 4px 16px rgba(16,185,129,0.4)',
              '&:hover':{ opacity:.9 }
            }}>
            Done
          </Button>
        </Box>
      </Dialog>

      {/* ── View Tenant Dialog ──────────────────────────────────────── */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:'20px', overflow:'hidden', p:0 } }}>
        <Box sx={{ px:3, pt:2.5, pb:2, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:1.5 }}>
          <Avatar sx={{ background:T.indigo, width:38, height:38, fontWeight:700 }}>
            {selectedTenant?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight:800, fontSize:15, color:T.navy }}>{selectedTenant?.name}</Typography>
            <Typography sx={{ fontSize:11, color:T.muted }}>Tenant Details</Typography>
          </Box>
          <IconButton onClick={() => setViewOpen(false)} size="small" sx={{ ml:'auto', color:T.muted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ px:3, py:2 }}>
          {selectedTenant && [
            ['Domain',       selectedTenant.domain],
            ['Email',        selectedTenant.email],
            ['Created',      new Date(selectedTenant.createdAt).toLocaleDateString()],
            ['Last Updated', new Date(selectedTenant.updatedAt).toLocaleDateString()],
          ].map(([k,v]) => (
            <Box key={k} sx={{ display:'flex', justifyContent:'space-between', py:1, borderBottom:`1px solid ${T.border}` }}>
              <Typography sx={{ fontSize:12, color:T.muted, fontWeight:600 }}>{k}</Typography>
              <Typography sx={{ fontSize:12, color:T.navy, fontWeight:500 }}>{v}</Typography>
            </Box>
          ))}
          <Box sx={{ display:'flex', justifyContent:'space-between', py:1 }}>
            <Typography sx={{ fontSize:12, color:T.muted, fontWeight:600 }}>Status</Typography>
            <Chip label={selectedTenant?.isActive ? 'Active' : 'Inactive'} size="small"
              sx={{
                fontSize:10, fontWeight:700,
                background: selectedTenant?.isActive ? '#D1FAE5' : '#FFE4E6',
                color:      selectedTenant?.isActive ? '#065F46' : '#9F1239'
              }} />
          </Box>
        </Box>
        <Box sx={{ px:3, pb:3, display:'flex', gap:1 }}>
          <Button fullWidth onClick={() => setViewOpen(false)}
            sx={{ borderRadius:'10px', textTransform:'none', fontWeight:600, color:T.slate, border:`1px solid ${T.border}` }}>
            Close
          </Button>
          <Button fullWidth variant="contained"
            onClick={() => navigate(`/superadmin/tenants/edit/${selectedTenant?._id}`)}
            sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:T.indigo, '&:hover':{ background:T.indigoL } }}>
            Edit
          </Button>
        </Box>
      </Dialog>

      {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:'20px', overflow:'hidden', p:0 } }}>
        <Box sx={{ px:3, pt:2.5, pb:2, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:1.2 }}>
          <Box sx={{ p:.8, borderRadius:'10px', background:'#FFE4E6', display:'flex', flexShrink:0 }}>
            <DeleteIcon sx={{ color:T.rose, fontSize:20 }} />
          </Box>
          <Typography sx={{ fontWeight:800, fontSize:16, color:T.navy }}>Delete Organisation</Typography>
        </Box>
        <Box sx={{ px:3, py:2.5 }}>
          <Typography sx={{ fontSize:14, color:T.slate }}>
            Are you sure you want to permanently delete{' '}
            <b style={{ color:T.navy }}>{tenantToDelete?.name}</b>?
          </Typography>
          <Box sx={{ mt:1.5, p:1.5, borderRadius:'10px', background:'#FFF1F2', border:'1px solid #FECDD3' }}>
            <Typography sx={{ fontSize:12, color:T.rose }}>
              ⚠ This cannot be undone and removes all associated data.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px:3, pb:3, display:'flex', gap:1 }}>
          <Button fullWidth onClick={() => setDeleteOpen(false)}
            sx={{ borderRadius:'10px', textTransform:'none', fontWeight:600, color:T.slate, border:`1px solid ${T.border}` }}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleDelete} variant="contained"
            sx={{ borderRadius:'10px', textTransform:'none', fontWeight:700, background:T.rose, '&:hover':{ background:'#E11D48' } }}>
            Delete
          </Button>
        </Box>
      </Dialog>

      {/* ── Snackbar ───────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open:false }))}
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open:false }))}
          sx={{ borderRadius:'12px', fontWeight:600, boxShadow:'0 8px 24px rgba(0,0,0,.14)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default SuperAdminDashboard;