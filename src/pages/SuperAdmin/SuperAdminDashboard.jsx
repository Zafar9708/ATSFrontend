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
import OrganizationForm from '../../components/OrganizationForm';

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
    <Box sx={{ position: 'absolute', top: -28, right: -28, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
    <Box sx={{ position: 'relative', zIndex: 1, width: "250px" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: .8, letterSpacing: .8, textTransform: 'uppercase' }}>{title}</Typography>
        <Box sx={{ p: .7, borderRadius: '8px', background: 'rgba(255,255,255,0.18)', display: 'flex' }}>
          {React.cloneElement(icon, { sx: { fontSize: 17 } })}
        </Box>
      </Box>
      <Typography sx={{ fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: -1, mb: 1.2 }}>{value}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
        <TrendingUpIcon sx={{ fontSize: 13, opacity: .7 }} />
        <Typography sx={{ fontSize: 11, opacity: .8 }}>{sub}</Typography>
      </Box>
    </Box>
  </Card>
);

/* ── Chart Tooltip ────────────────────────────────────────────────────── */
const CTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: T.navy, borderRadius: '10px', p: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,.3)' }}>
      <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700, mb: .5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ color: p.color, fontSize: 11 }}>{p.name}: <b>{p.value}</b></Typography>
      ))}
    </Box>
  );
};

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
  const [snackbar,       setSnackbar]       = useState({ open: false, message: '', severity: 'success' });

  const [addOpen,        setAddOpen]        = useState(false);
  const [successOpen,    setSuccessOpen]    = useState(false);
  const [viewOpen,       setViewOpen]       = useState(false);
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [successData,    setSuccessData]    = useState(null);
  const [submitting,     setSubmitting]     = useState(false);

  /* ── New form state with all fields ─────────────────────────────── */
  const emptyForm = {
    // Company Information
    name: '',
    industry: '',
    website: '',
    companyPhone: '',
    email: '',
    gstNumber: '',
    companyPan: '',
    registrationNumber: '',
    gstCertificate: null,
    companyPanFile: null,

    // Owner Information
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAadhar: '',
    ownerPan: '',
    aadharFile: null,
    panFile: null,

    // Bank Information
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    cancelledCheque: null,

    // Plan & Subscription
    plan: '',
    billingCycle: '',
    startDate: '',
    endDate: '',

    // Admin Information
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',

    // Company Address (keeping for backward compatibility)
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  /* ── Fetch ──────────────────────────────────────────────────────── */
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const r = await getTenants();
      setTenants(r.data.tenants || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: 6 }, (_, idx) => {
      const mIdx = (now.getMonth() - 5 + idx + 12) % 12;
      return {
        name:     months[mIdx],
        active:   tenants.filter(t => new Date(t.createdAt).getMonth() === mIdx &&  t.isActive).length,
        inactive: tenants.filter(t => new Date(t.createdAt).getMonth() === mIdx && !t.isActive).length,
      };
    });
  })();

  const pieData = [{ name: 'Active', value: activeCount }, { name: 'Inactive', value: inactiveCount }];
  const PIE_CLR = [T.emerald, T.rose];

  /* ── Helpers ────────────────────────────────────────────────────── */
  const toast = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const copy  = text => navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!'));

  /* ── Tenant actions ─────────────────────────────────────────────── */
  const toggleStatus = async (id, cur) => {
    try {
      await updateTenantStatus(id, !cur);
      setTenants(ts => ts.map(t => t._id === id ? { ...t, isActive: !cur } : t));
      toast(`Tenant ${!cur ? 'activated' : 'deactivated'}`);
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTenant(tenantToDelete._id);
      setTenants(ts => ts.filter(t => t._id !== tenantToDelete._id));
      setDeleteOpen(false);
      toast('Tenant deleted successfully');
    } catch {
      toast('Failed to delete tenant', 'error');
    }
  };

  const handleResendEmail = async (tenant) => {
    try {
      await resendWelcomeEmail(tenant._id);
      toast('Welcome email resent!');
    } catch {
      toast('Failed to resend email', 'error');
    }
  };

  /* ── Form validation ─────────────────────────────────────────────── */
  const validateForm = () => {
    const errors = {};

    // Company Information
    if (!form.name?.trim())         errors.name         = 'Organisation name is required';
    if (!form.industry)             errors.industry     = 'Industry is required';
    if (!form.companyPhone?.trim()) errors.companyPhone = 'Company phone is required';
    if (!form.email?.trim())        errors.email        = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address';
    if (!form.companyPan?.trim())   errors.companyPan   = 'Company PAN is required';
    if (!form.gstCertificate)       errors.gstCertificate = 'GST certificate is required';
    if (!form.companyPanFile)       errors.companyPanFile = 'Company PAN document is required';

    // Owner Information
    if (!form.ownerName?.trim())    errors.ownerName    = 'Owner name is required';
    if (!form.ownerEmail?.trim())   errors.ownerEmail   = 'Owner email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) errors.ownerEmail = 'Invalid email address';
    if (!form.ownerPhone?.trim())   errors.ownerPhone   = 'Owner phone is required';
    if (!form.ownerAadhar?.trim())  errors.ownerAadhar  = 'Owner Aadhar is required';
    if (!form.ownerPan?.trim())     errors.ownerPan     = 'Owner PAN is required';
    if (!form.aadharFile)           errors.aadharFile   = 'Aadhar document is required';
    if (!form.panFile)              errors.panFile      = 'PAN document is required';

    // Bank Information
    if (!form.bankName?.trim())           errors.bankName           = 'Bank name is required';
    if (!form.accountHolderName?.trim())  errors.accountHolderName  = 'Account holder name is required';
    if (!form.accountNumber?.trim())      errors.accountNumber      = 'Account number is required';
    if (!form.ifscCode?.trim())           errors.ifscCode           = 'IFSC code is required';
    if (!form.cancelledCheque)            errors.cancelledCheque    = 'Cancelled cheque is required';

    // Plan & Subscription
    if (!form.plan)         errors.plan         = 'Plan is required';
    if (!form.billingCycle) errors.billingCycle = 'Billing cycle is required';
    if (!form.startDate)    errors.startDate    = 'Start date is required';
    if (!form.endDate)      errors.endDate      = 'End date is required';

    // Admin Information
    if (!form.adminFirstName?.trim()) errors.adminFirstName = 'Admin first name is required';
    if (!form.adminLastName?.trim())  errors.adminLastName  = 'Admin last name is required';
    if (!form.adminEmail?.trim())     errors.adminEmail     = 'Admin email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) errors.adminEmail = 'Invalid email address';
    if (!form.adminPhone?.trim())     errors.adminPhone     = 'Admin phone is required';
    if (!form.adminPassword)          errors.adminPassword  = 'Password is required';
    else if (form.adminPassword.length < 8) errors.adminPassword = 'Minimum 8 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => { setForm(emptyForm); setFormErrors({}); };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast('Please fill all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      const res = await createTenant(formData);
      setAddOpen(false);
      setSuccessData({
        name:      form.name,
        email:     form.adminEmail,
        domain:    form.website || `${form.name.toLowerCase().replace(/\s+/g, '')}.com`,
        loginLink: res?.data?.loginLink || `https://${form.name.toLowerCase().replace(/\s+/g, '')}.com/login`,
      });
      resetForm();
      setSuccessOpen(true);
      fetchTenants();
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to create organisation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Guard states ───────────────────────────────────────────────── */
  if (loading && !refreshing) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: T.bg }}>
      <Box textAlign="center">
        <CircularProgress size={44} sx={{ color: T.indigo, mb: 2 }} />
        <Typography sx={{ color: T.muted, fontSize: 13 }}>Loading dashboard…</Typography>
      </Box>
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ m: 3, borderRadius: '14px' }} onClose={() => setError(null)}>{error}</Alert>
  );

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <Box sx={{ minHeight: '100vh', background: T.bg, p: { xs: 1.5, sm: 2.5, md: 3 }, ml: "190px", mt: "60px" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: 3, flexWrap: 'wrap', gap: 1.5, width: "1300px"
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 4 }}>
          <Box sx={{ p: 1, borderRadius: '12px', background: T.indigo, display: 'flex', flexShrink: 0 }}>
            <BusinessIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{
              fontSize: { xs: 16, sm: 20, md: 23 }, fontWeight: 800,
              color: T.navy, lineHeight: 1.2, letterSpacing: -.4,
            }}>
              Organization Management
            </Typography>
            <Typography sx={{ fontSize: 12, color: T.muted }}>
              Manage tenants, credentials &amp; configurations
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleRefresh} disabled={refreshing}
            startIcon={<RefreshIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: 13,
              color: T.slate, background: T.card, border: `1px solid ${T.border}`,
              px: { xs: 1.5, sm: 2 }, minWidth: 0, '&:hover': { background: T.bg }
            }}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Box>
          </Button>
          <Button onClick={() => setAddOpen(true)}
            startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
            variant="contained"
            sx={{
              borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: 13,
              background: T.indigo, px: { xs: 1.5, sm: 2.5 },
              boxShadow: `0 4px 16px ${T.indigo}50`,
              '&:hover': { background: T.indigoL }
            }}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add Organisation</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
          </Button>
        </Box>
      </Box>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <Box sx={{ pl: 4, pr: 0, mb: 2.5 }}>
        <Grid container spacing={2}>
          {[
            { title: 'Total Tenants',  value: total,        icon: <PeopleIcon />,   from: '#4F46E5', to: '#7C3AED', sub: 'All registered' },
            { title: 'Active Tenants', value: activeCount,  icon: <ActiveIcon />,   from: '#059669', to: '#10B981', sub: `${Math.round((activeCount   / Math.max(total, 1)) * 100)}% of total` },
            { title: 'Inactive',       value: inactiveCount, icon: <InactiveIcon />, from: '#E11D48', to: '#F43F5E', sub: `${Math.round((inactiveCount / Math.max(total, 1)) * 100)}% of total` },
            { title: 'Growth Rate',    value: '+22%',        icon: <BarChartIcon />, from: '#D97706', to: '#F59E0B', sub: 'Quarterly increase' },
          ].map((s, i) => (
            <Grid item key={i} xs={12} sm={6} md={3}>
              <StatCard {...s} sx={{ height: '100%', width: '100%' }} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Main two-column grid ────────────────────────────────────── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>

        {/* ── Left column ─────────────────────────────────────────── */}
        <Grid item xs={12} lg={8}>

          {/* Charts */}
          <Grid container spacing={{ xs: 2, sm: 2 }} sx={{ mb: 2.5 }}>
            <Grid item xs={12} md={7}>
              <Card sx={{
                p: 2.5, borderRadius: '20px', border: `1px solid ${T.border}`,
                boxShadow: 'none', height: 280, ml: 4
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, width: "350px" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Tenant Activity</Typography>
                    <Typography sx={{ fontSize: 11, color: T.muted }}>Monthly active vs inactive</Typography>
                  </Box>
                  <Chip label="6 months" size="small"
                    sx={{ fontSize: 10, background: '#EEF2FF', color: T.indigo, fontWeight: 700 }} />
                </Box>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={activityData} margin={{ left: -20, right: 8 }}>
                    <defs>
                      <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.emerald} stopOpacity={.28} />
                        <stop offset="95%" stopColor={T.emerald} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.rose} stopOpacity={.28} />
                        <stop offset="95%" stopColor={T.rose} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<CTooltip />} />
                    <Area type="monotone" dataKey="active"   name="Active"   stroke={T.emerald} strokeWidth={2.5} fill="url(#gA)" />
                    <Area type="monotone" dataKey="inactive" name="Inactive" stroke={T.rose}    strokeWidth={2.5} fill="url(#gI)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{
                p: 2.5, borderRadius: '20px', border: `1px solid ${T.border}`,
                boxShadow: 'none', height: 280
              }}>
                <Box sx={{ mb: 1, width: "350px" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Status Distribution</Typography>
                  <Typography sx={{ fontSize: 11, color: T.muted }}>Current tenant states</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2.5, mb: 1 }}>
                  {pieData.map((d, i) => (
                    <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: .6 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: PIE_CLR[i], flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 11, color: T.slate, fontWeight: 500 }}>{d.name}: <b style={{ color: T.navy }}>{d.value}</b></Typography>
                    </Box>
                  ))}
                </Box>
                <ResponsiveContainer width="100%" height="75%">
                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={42} outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={true}
                    >
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_CLR[i % PIE_CLR.length]} />)}
                    </Pie>
                    <ChartTooltip content={<CTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Search & filter */}
          <Card sx={{ p: 2, mb: 2, borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', ml: 4 }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" placeholder="Search by name or domain…"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: T.muted, fontSize: 17 }} /></InputAdornment>,
                    sx: { borderRadius: '10px', background: T.bg, fontSize: 13 }
                  }}
                  sx={{ '& fieldset': { borderColor: T.border } }} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: 13 }}>Status</InputLabel>
                  <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    label="Status" sx={{ borderRadius: '10px', fontSize: 13, background: T.bg }}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 12, color: T.muted }}>
                  <b style={{ color: T.navy }}>{filtered.length}</b>/{total}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Table */}
          <Card sx={{ borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', overflow: 'hidden', ml: 4, width: "800px" }}>
            <Box sx={{ px: 2.5, py: 1.8, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Tenant List</Typography>
              <Chip label={`${filtered.length} results`} size="small"
                sx={{ fontSize: 10, background: '#EEF2FF', color: T.indigo, fontWeight: 700 }} />
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 520 }}>
                <TableHead>
                  <TableRow sx={{ background: T.bg }}>
                    {['Tenant', 'Domain', 'Created', 'Status', 'Actions'].map((h, i) => (
                      <TableCell key={h} align={i === 4 ? 'right' : 'left'}
                        sx={{
                          fontWeight: 700, fontSize: 10, color: T.muted, textTransform: 'uppercase',
                          letterSpacing: .6, borderBottom: `1px solid ${T.border}`,
                          py: 1.2, px: i === 0 ? 2.5 : 1.5, whiteSpace: 'nowrap'
                        }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: T.muted, fontSize: 13 }}>
                        No tenants match your search
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map(t => (
                    <TableRow key={t._id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: '#F8FAFC' } }}>
                      <TableCell sx={{ px: 2.5, py: 1.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, background: T.indigo, fontSize: 13, fontWeight: 700 }}>
                            {t.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: 13, color: T.navy, lineHeight: 1.3 }}>{t.name}</Typography>
                            <Typography sx={{ fontSize: 11, color: T.muted }}>{t.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Chip label={t.domain} size="small"
                          sx={{ fontSize: 11, background: T.bg, color: T.slate, fontWeight: 500, border: `1px solid ${T.border}` }} />
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Typography sx={{ fontSize: 12, color: T.navy, whiteSpace: 'nowrap' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}>
                          <Switch checked={t.isActive} size="small" onChange={() => toggleStatus(t._id, t.isActive)}
                            sx={{
                              '& .MuiSwitch-thumb': { background: t.isActive ? T.emerald : T.rose },
                              '& .MuiSwitch-track': { background: t.isActive ? `${T.emerald}40` : `${T.rose}40` }
                            }} />
                          <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
                            sx={{
                              fontSize: 10, fontWeight: 700, px: .3,
                              background: t.isActive ? '#D1FAE5' : '#FFE4E6',
                              color:      t.isActive ? '#065F46' : '#9F1239'
                            }} />
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1.5, py: 1.3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: .5 }}>
                          {[
                            { tip: 'Resend Email', icon: <EmailIcon />,      color: T.sky,    fn: () => handleResendEmail(t)                          },
                            { tip: 'View Details', icon: <VisibilityIcon />, color: T.indigo, fn: () => { setSelectedTenant(t); setViewOpen(true); }   },
                            { tip: 'Edit',         icon: <EditIcon />,       color: T.amber,  fn: () => navigate(`/superadmin/tenants/edit/${t._id}`)  },
                            { tip: 'Delete',       icon: <DeleteIcon />,     color: T.rose,   fn: () => { setTenantToDelete(t); setDeleteOpen(true); } },
                          ].map(a => (
                            <Tooltip key={a.tip} title={a.tip} arrow>
                              <IconButton onClick={a.fn} size="small"
                                sx={{
                                  borderRadius: '8px', p: .55, color: a.color, background: `${a.color}14`,
                                  '&:hover': { background: a.color, color: '#fff' }, transition: 'all .15s'
                                }}>
                                {React.cloneElement(a.icon, { sx: { fontSize: 15 } })}
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', lg: 'column' }, gap: 2 }}>

            {/* Recent Activity */}
            <Card sx={{ flex: 1, borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 1.8, borderBottom: `1px solid ${T.border}` }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Recent Activity</Typography>
              </Box>
              <Box sx={{ maxHeight: { xs: 200, lg: 290 }, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: .8 }}>
                {[
                  "Created new tenant 'Acme Corp'",
                  "Updated 'Tech Solutions' settings",
                  "Deactivated 'Global Enterprises'",
                  "Admin logged in to dashboard",
                  "Generated monthly report",
                  "Added new admin user",
                  "Password changed successfully",
                  "Viewed tenant details",
                ].map((msg, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.2, p: 1.2, borderRadius: '10px', background: T.bg }}>
                    <Avatar sx={{ width: 28, height: 28, background: T.indigo, fontSize: 11, flexShrink: 0 }}>U</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: T.navy }}>System</Typography>
                        <Typography sx={{ fontSize: 10, color: T.muted }}>{i + 1}h ago</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 11, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Latest Tenants */}
            <Card sx={{ flex: 1, borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 1.8, borderBottom: `1px solid ${T.border}` }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Latest Tenants</Typography>
              </Box>
              <Box sx={{ maxHeight: { xs: 200, lg: 290 }, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: .8 }}>
                {tenants.slice(0, 6).map(t => (
                  <Box key={t._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1.2, borderRadius: '10px', background: T.bg }}>
                    <Avatar sx={{ width: 32, height: 32, background: T.indigo, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {t.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.name}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: T.muted }}>{t.domain}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: .4, flexShrink: 0 }}>
                      <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small"
                        sx={{
                          fontSize: 9, fontWeight: 700, height: 16, px: .2,
                          background: t.isActive ? '#D1FAE5' : '#FFE4E6',
                          color:      t.isActive ? '#065F46' : '#9F1239'
                        }} />
                      <Button size="small" onClick={() => { setSelectedTenant(t); setViewOpen(true); }}
                        sx={{ fontSize: 10, textTransform: 'none', color: T.indigo, p: 0, minWidth: 'auto', fontWeight: 600, lineHeight: 1 }}>
                        View
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ borderRadius: '20px', border: `1px solid ${T.border}`, boxShadow: 'none', overflow: 'hidden', width: "400px" }}>
              <Box sx={{ px: 2.5, py: 1.8, borderBottom: `1px solid ${T.border}` }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: T.navy }}>Quick Actions</Typography>
              </Box>
              <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  { label: 'Add Tenant', icon: <AddIcon />,      variant: 'filled',  fn: () => setAddOpen(true) },
                  { label: 'Settings',   icon: <SettingsIcon />, variant: 'outline', fn: () => {} },
                  { label: 'Users',      icon: <PeopleIcon />,   variant: 'outline', fn: () => {} },
                  { label: 'Reports',    icon: <BarChartIcon />, variant: 'outline', fn: () => {} },
                ].map(a => (
                  <Button key={a.label} onClick={a.fn}
                    startIcon={React.cloneElement(a.icon, { sx: { fontSize: '15px !important' } })} fullWidth
                    sx={{
                      borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: 12, py: 1.1,
                      ...(a.variant === 'filled'
                        ? { background: T.indigo, color: '#fff', boxShadow: `0 3px 10px ${T.indigo}40`, '&:hover': { background: T.indigoL } }
                        : { background: T.bg, color: T.slate, border: `1px solid ${T.border}`, '&:hover': { background: T.border } })
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
          ADD ORGANISATION DIALOG — OrganizationForm only, no extra header
      ════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={addOpen}
        onClose={() => { setAddOpen(false); resetForm(); }}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 0,
            boxShadow: '0 32px 80px rgba(15,23,42,0.28)',
            maxHeight: '90vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar':       { width: 6 },
            '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: T.indigo, borderRadius: 3 },
          }
        }}
      >
        <OrganizationForm
          formData={form}
          setFormData={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          onSubmit={handleSubmit}
          onCancel={() => { setAddOpen(false); resetForm(); }}
          submitting={submitting}
        />
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════
          SUCCESS DIALOG
      ════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', p: 0 } }}>
        {/* Green gradient header */}
        <Box sx={{
          background: `linear-gradient(135deg, #059669 0%, ${T.emerald} 60%, #34D399 100%)`,
          px: 3, pt: 3.5, pb: 3, textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: -30, left: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <Box sx={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 1.5,
              boxShadow: '0 0 0 12px rgba(255,255,255,0.08)',
            }}>
              <ActiveIcon sx={{ color: '#fff', fontSize: 34 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 21, color: '#fff', mb: .5 }}>
              Organisation Added! 🎉
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>
              Successfully registered and notified
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            p: 1.8, background: '#F0FDF4', borderRadius: '14px',
            border: '1px solid #BBF7D0', mb: 2
          }}>
            <Avatar sx={{
              width: 42, height: 42, fontWeight: 800, fontSize: 16, flexShrink: 0,
              background: `linear-gradient(135deg, #059669, ${T.emerald})`
            }}>
              {successData?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#065F46', lineHeight: 1.3 }}>
                {successData?.name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#047857' }}>{successData?.domain}</Typography>
            </Box>
            <Chip label="Active" size="small"
              sx={{ background: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: 10, flexShrink: 0 }} />
          </Box>

          <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1.3,
            p: 1.8, background: '#EFF6FF', borderRadius: '14px',
            border: '1px solid #BFDBFE', mb: 2
          }}>
            <MailSentIcon sx={{ color: '#2563EB', fontSize: 22, mt: .1, flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#1E40AF' }}>
                Credentials Sent!
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#3B82F6', mt: .3, lineHeight: 1.5 }}>
                Login credentials have been sent to<br />
                <b>{successData?.email}</b>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          <Button fullWidth onClick={() => setSuccessOpen(false)} variant="contained"
            sx={{
              borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.2,
              background: `linear-gradient(135deg, #059669, ${T.emerald})`,
              boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
              '&:hover': { opacity: .9 }
            }}>
            Done
          </Button>
        </Box>
      </Dialog>

      {/* ── View Tenant Dialog ──────────────────────────────────────── */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', p: 0 } }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ background: T.indigo, width: 38, height: 38, fontWeight: 700 }}>
            {selectedTenant?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: T.navy }}>{selectedTenant?.name}</Typography>
            <Typography sx={{ fontSize: 11, color: T.muted }}>Tenant Details</Typography>
          </Box>
          <IconButton onClick={() => setViewOpen(false)} size="small" sx={{ ml: 'auto', color: T.muted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, py: 2 }}>
          {selectedTenant && [
            ['Domain',       selectedTenant.domain],
            ['Email',        selectedTenant.email],
            ['Created',      new Date(selectedTenant.createdAt).toLocaleDateString()],
            ['Last Updated', new Date(selectedTenant.updatedAt).toLocaleDateString()],
          ].map(([k, v]) => (
            <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: `1px solid ${T.border}` }}>
              <Typography sx={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{k}</Typography>
              <Typography sx={{ fontSize: 12, color: T.navy, fontWeight: 500 }}>{v}</Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography sx={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Status</Typography>
            <Chip label={selectedTenant?.isActive ? 'Active' : 'Inactive'} size="small"
              sx={{
                fontSize: 10, fontWeight: 700,
                background: selectedTenant?.isActive ? '#D1FAE5' : '#FFE4E6',
                color:      selectedTenant?.isActive ? '#065F46' : '#9F1239'
              }} />
          </Box>
        </Box>
        <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 1 }}>
          <Button fullWidth onClick={() => setViewOpen(false)}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: T.slate, border: `1px solid ${T.border}` }}>
            Close
          </Button>
          <Button fullWidth variant="contained"
            onClick={() => navigate(`/superadmin/tenants/edit/${selectedTenant?._id}`)}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, background: T.indigo, '&:hover': { background: T.indigoL } }}>
            Edit
          </Button>
        </Box>
      </Dialog>

      {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', p: 0 } }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{ p: .8, borderRadius: '10px', background: '#FFE4E6', display: 'flex', flexShrink: 0 }}>
            <DeleteIcon sx={{ color: T.rose, fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: T.navy }}>Delete Organisation</Typography>
        </Box>
        <Box sx={{ px: 3, py: 2.5 }}>
          <Typography sx={{ fontSize: 14, color: T.slate }}>
            Are you sure you want to permanently delete{' '}
            <b style={{ color: T.navy }}>{tenantToDelete?.name}</b>?
          </Typography>
          <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '10px', background: '#FFF1F2', border: '1px solid #FECDD3' }}>
            <Typography sx={{ fontSize: 12, color: T.rose }}>
              ⚠ This cannot be undone and removes all associated data.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 1 }}>
          <Button fullWidth onClick={() => setDeleteOpen(false)}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: T.slate, border: `1px solid ${T.border}` }}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleDelete} variant="contained"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, background: T.rose, '&:hover': { background: '#E11D48' } }}>
            Delete
          </Button>
        </Box>
      </Dialog>

      {/* ── Snackbar ───────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ borderRadius: '12px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,.14)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default SuperAdminDashboard;