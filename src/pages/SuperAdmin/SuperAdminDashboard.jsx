import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  Chip,
  Switch,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Divider,
  Tooltip,
  useTheme,
  Badge,
  Snackbar,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  AccountBalance as BankIcon,
  Receipt as ComplianceIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Dummy data for tenants
const DUMMY_TENANTS = [
  {
    _id: '1',
    name: 'Acme Corporation',
    domain: 'acme.example.com',
    email: 'admin@acmecorp.com',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-01T14:20:00Z',
    companyName: 'Acme Corporation Ltd.',
    tradeName: 'Acme',
    companyType: 'Private Limited',
    industryType: 'Information Technology',
    companySize: '201-500',
    website: 'https://acmecorp.com',
    registeredAddress: '123 Tech Park, Silicon Valley, California',
    phone: '+1 (555) 123-4567',
    contactPerson: 'John Smith'
  },
  {
    _id: '2',
    name: 'Tech Innovators Inc',
    domain: 'techinnovators.example.com',
    email: 'admin@techinnovators.com',
    isActive: true,
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-03-05T11:45:00Z',
    companyName: 'Tech Innovators Inc.',
    tradeName: 'Tech Innovators',
    companyType: 'LLP',
    industryType: 'Software Services',
    companySize: '51-200',
    website: 'https://techinnovators.com',
    registeredAddress: '456 Innovation Drive, Austin, Texas',
    phone: '+1 (555) 987-6543',
    contactPerson: 'Sarah Johnson'
  },
  {
    _id: '3',
    name: 'Global Enterprises',
    domain: 'global.example.com',
    email: 'admin@globalenterprises.com',
    isActive: false,
    createdAt: '2024-01-28T16:45:00Z',
    updatedAt: '2024-02-20T10:10:00Z',
    companyName: 'Global Enterprises Pvt. Ltd.',
    tradeName: 'Global',
    companyType: 'Private Limited',
    industryType: 'Manufacturing',
    companySize: '1000+',
    website: 'https://globalenterprises.com',
    registeredAddress: '789 Industrial Area, Detroit, Michigan',
    phone: '+1 (555) 456-7890',
    contactPerson: 'Robert Chen'
  },
  {
    _id: '4',
    name: 'Digital Solutions',
    domain: 'digitalsolutions.example.com',
    email: 'admin@digitalsolutions.com',
    isActive: true,
    createdAt: '2024-03-01T08:20:00Z',
    updatedAt: '2024-03-10T15:30:00Z',
    companyName: 'Digital Solutions LLC',
    tradeName: 'Digital Solutions',
    companyType: 'LLC',
    industryType: 'Digital Marketing',
    companySize: '11-50',
    website: 'https://digitalsolutions.com',
    registeredAddress: '101 Digital Avenue, San Francisco, California',
    phone: '+1 (555) 234-5678',
    contactPerson: 'Emma Wilson'
  },
  {
    _id: '5',
    name: 'Medical Research Group',
    domain: 'medicalresearch.example.com',
    email: 'admin@medicalresearch.com',
    isActive: true,
    createdAt: '2024-02-15T13:10:00Z',
    updatedAt: '2024-03-08T09:25:00Z',
    companyName: 'Medical Research Group Inc.',
    tradeName: 'MedResearch',
    companyType: 'Public Limited',
    industryType: 'Healthcare',
    companySize: '501-1000',
    website: 'https://medicalresearch.com',
    registeredAddress: '222 Research Park, Boston, Massachusetts',
    phone: '+1 (555) 345-6789',
    contactPerson: 'Dr. Michael Brown'
  },
  {
    _id: '6',
    name: 'Eco Friendly Products',
    domain: 'ecofriendly.example.com',
    email: 'admin@ecofriendly.com',
    isActive: false,
    createdAt: '2024-02-05T11:55:00Z',
    updatedAt: '2024-02-25T14:40:00Z',
    companyName: 'Eco Friendly Products Co.',
    tradeName: 'EcoFriendly',
    companyType: 'Partnership',
    industryType: 'Retail',
    companySize: '1-10',
    website: 'https://ecofriendlyproducts.com',
    registeredAddress: '333 Green Street, Portland, Oregon',
    phone: '+1 (555) 567-8901',
    contactPerson: 'Lisa Miller'
  },
  {
    _id: '7',
    name: 'Financial Services Ltd',
    domain: 'financialservices.example.com',
    email: 'admin@financialservices.com',
    isActive: true,
    createdAt: '2024-01-20T14:25:00Z',
    updatedAt: '2024-03-12T10:15:00Z',
    companyName: 'Financial Services Limited',
    tradeName: 'FinServe',
    companyType: 'Private Limited',
    industryType: 'Finance',
    companySize: '201-500',
    website: 'https://financialservices.com',
    registeredAddress: '444 Wall Street, New York, New York',
    phone: '+1 (555) 678-9012',
    contactPerson: 'David Garcia'
  },
  {
    _id: '8',
    name: 'Educational Solutions',
    domain: 'educationalsolutions.example.com',
    email: 'admin@educationalsolutions.com',
    isActive: true,
    createdAt: '2024-03-05T09:40:00Z',
    updatedAt: '2024-03-15T16:20:00Z',
    companyName: 'Educational Solutions Inc.',
    tradeName: 'EduSolutions',
    companyType: 'NGO',
    industryType: 'Education',
    companySize: '51-200',
    website: 'https://educationalsolutions.com',
    registeredAddress: '555 Learning Lane, Chicago, Illinois',
    phone: '+1 (555) 789-0123',
    contactPerson: 'Jennifer Taylor'
  }
];

// Mock API functions
const getTenants = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          tenants: DUMMY_TENANTS
        }
      });
    }, 500);
  });
};

const createTenant = async (tenantData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTenant = {
        _id: (DUMMY_TENANTS.length + 1).toString(),
        name: tenantData.companyName,
        domain: tenantData.companyName.toLowerCase().replace(/\s+/g, '') + '.example.com',
        email: tenantData.email,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...tenantData
      };
      
      DUMMY_TENANTS.unshift(newTenant);
      
      resolve({
        status: 'success',
        data: {
          loginLink: `https://app.example.com/login/${tenantData.email}`
        }
      });
    }, 1000);
  });
};

const updateTenantStatus = async (tenantId, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tenant = DUMMY_TENANTS.find(t => t._id === tenantId);
      if (tenant) {
        tenant.isActive = status;
        tenant.updatedAt = new Date().toISOString();
      }
      resolve({ success: true });
    }, 500);
  });
};

const deleteTenant = async (tenantId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = DUMMY_TENANTS.findIndex(t => t._id === tenantId);
      if (index > -1) {
        DUMMY_TENANTS.splice(index, 1);
      }
      resolve({ success: true });
    }, 500);
  });
};

const resendWelcomeEmail = async (tenantId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tenant = DUMMY_TENANTS.find(t => t._id === tenantId);
      resolve({
        data: {
          loginLink: `https://app.example.com/login/${tenant?.email}`
        }
      });
    }, 500);
  });
};

const SuperAdminDashboard = () => {
  const theme = useTheme();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [newTenantLink, setNewTenantLink] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewTenantDialogOpen, setViewTenantDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState('basic');
  const navigate = useNavigate();

  // Initialize new tenant with all fields
  const [newTenant, setNewTenant] = useState({
    // Basic Information
    companyName: '',
    tradeName: '',
    companyType: '',
    industryType: '',
    companySize: '',
    website: '',
    
    // Contact Information
    registeredAddress: '',
    corporateAddress: '',
    state: '',
    city: '',
    pincode: '',
    email: '',
    phone: '',
    contactPerson: '',
    
    // Statutory Information
    pan: '',
    gstin: '',
    cin: '',
    tan: '',
    msmeUdyam: '',
    shopEstablishment: '',
    pfRegistration: '',
    esiRegistration: '',
    
    // Banking & Billing
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    billingAddress: '',
    billingEmail: '',
    gstBillingState: '',
    
    // Admin credentials
    adminPassword: ''
  });

  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Generate real-time data from tenants
  const generateActivityData = () => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.slice(0, 6).map((month, index) => {
      const monthIndex = (now.getMonth() - 5 + index + 12) % 12;
      const activeCount = tenants.filter(t => {
        const created = new Date(t.createdAt);
        return created.getMonth() === monthIndex && t.isActive;
      }).length;
      
      const inactiveCount = tenants.filter(t => {
        const created = new Date(t.createdAt);
        return created.getMonth() === monthIndex && !t.isActive;
      }).length;
      
      return {
        name: months[monthIndex],
        active: activeCount,
        inactive: inactiveCount
      };
    });
  };

  const statusData = [
    { name: 'Active', value: tenants.filter(t => t.isActive).length },
    { name: 'Inactive', value: tenants.filter(t => !t.isActive).length },
  ];

  const COLORS = [theme.palette.success.main, theme.palette.error.main];

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await getTenants();
      setTenants(response.data.tenants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTenants();
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                        (statusFilter === 'active' && tenant.isActive) || 
                        (statusFilter === 'inactive' && !tenant.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.isActive).length;
  const inactiveTenants = tenants.filter(t => !t.isActive).length;

  const handleEditTenant = (tenantId) => {
    navigate(`/superadmin/tenants/edit/${tenantId}`);
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setViewTenantDialogOpen(true);
  };

  const confirmDelete = (tenant) => {
    setTenantToDelete(tenant);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTenant = async () => {
    try {
      await deleteTenant(tenantToDelete._id);
      setDeleteDialogOpen(false);
      setTenants(tenants.filter(t => t._id !== tenantToDelete._id));
      setSnackbar({ open: true, message: 'Tenant deleted successfully', severity: 'success' });
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: 'Failed to delete tenant', severity: 'error' });
    }
  };

  const toggleStatus = async (tenantId, currentStatus) => {
    try {
      await updateTenantStatus(tenantId, !currentStatus);
      setTenants(tenants.map(tenant => 
        tenant._id === tenantId ? { ...tenant, isActive: !currentStatus } : tenant
      ));
      setSnackbar({ open: true, message: `Tenant ${!currentStatus ? 'activated' : 'deactivated'} successfully`, severity: 'success' });
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: 'Failed to update tenant status', severity: 'error' });
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
    setExpandedAccordion('basic');
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewTenant({
      companyName: '',
      tradeName: '',
      companyType: '',
      industryType: '',
      companySize: '',
      website: '',
      registeredAddress: '',
      corporateAddress: '',
      state: '',
      city: '',
      pincode: '',
      email: '',
      phone: '',
      contactPerson: '',
      pan: '',
      gstin: '',
      cin: '',
      tan: '',
      msmeUdyam: '',
      shopEstablishment: '',
      pfRegistration: '',
      esiRegistration: '',
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      billingAddress: '',
      billingEmail: '',
      gstBillingState: '',
      adminPassword: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTenant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Basic Information validation
    if (!newTenant.companyName.trim()) errors.companyName = 'Company Name is required';
    if (!newTenant.companyType) errors.companyType = 'Company Type is required';
    if (!newTenant.industryType) errors.industryType = 'Industry Type is required';
    if (!newTenant.companySize) errors.companySize = 'Company Size is required';
    
    // Contact Information validation
    if (!newTenant.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTenant.email)) {
      errors.email = 'Email is invalid';
    }
    if (!newTenant.phone.trim()) errors.phone = 'Phone is required';
    if (!newTenant.registeredAddress.trim()) errors.registeredAddress = 'Registered Address is required';
    if (!newTenant.state.trim()) errors.state = 'State is required';
    if (!newTenant.city.trim()) errors.city = 'City is required';
    if (!newTenant.pincode.trim()) errors.pincode = 'Pincode is required';
    
    // Admin password validation
    if (!newTenant.adminPassword) {
      errors.adminPassword = 'Password is required';
    } else if (newTenant.adminPassword.length < 8) {
      errors.adminPassword = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await createTenant(newTenant);
        
        if (response.status === 'success') {
          setSnackbar({ 
            open: true, 
            message: 'Tenant created successfully. Welcome email sent!', 
            severity: 'success' 
          });
          
          // Show welcome dialog with login link
          setNewTenantLink(response.data.loginLink);
          setShowWelcomeDialog(true);
        } else if (response.status === 'partial_success') {
          setSnackbar({ 
            open: true, 
            message: 'Tenant created but welcome email failed to send', 
            severity: 'warning' 
          });
          
          // Show dialog with manual link
          setNewTenantLink(response.data.loginLink);
          setShowWelcomeDialog(true);
        }
        
        handleAddDialogClose();
        fetchTenants();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create tenant');
        setSnackbar({ open: true, message: 'Failed to create tenant', severity: 'error' });
      }
    }
  };

  const handleResendWelcomeEmail = async (tenant) => {
    try {
      const response = await resendWelcomeEmail(tenant._id);
      setSnackbar({ 
        open: true, 
        message: 'Welcome email resent successfully', 
        severity: 'success' 
      });
      setNewTenantLink(response.data.loginLink);
      setShowWelcomeDialog(true);
      
      // Open email client with pre-filled email
      window.location.href = `mailto:${tenant.email}?subject=Welcome to Our Platform&body=Hello, here is your login link: ${response.data.loginLink}`;
    } catch (err) {
      console.error('Error resending welcome email:', err);
      setSnackbar({ 
        open: true, 
        message: 'Failed to resend welcome email', 
        severity: 'error' 
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Link copied to clipboard', severity: 'success' });
    });
  };

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3, mx: 3 }} onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 0.5 }}>
            Organization Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" />
            Manage all admin accounts and configurations
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: theme.palette.grey[300] }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDialogOpen}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { backgroundColor: theme.palette.primary.dark },
              boxShadow: theme.shadows[2]
            }}
          >
            ADD ADMIN 
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} width={'100%'} m={0}>
        {/* Left Column - 70% width */}
        <Grid item xs={12} lg={8} width={'100%'}>
          {/* Stats Cards */}
          <Grid container spacing={3} width={'100%'} sx={{ mb: 3 }}>
            {[
              { title: 'Total Tenants', value: totalTenants, color: 'primary', icon: <TrendingUpIcon />, trend: '+12% from last month' },
              { title: 'Active Tenants', value: activeTenants, color: 'success', icon: <ActiveIcon />, trend: `${Math.round((activeTenants/totalTenants)*100)}% of total` },
              { title: 'Inactive Tenants', value: inactiveTenants, color: 'error', icon: <InactiveIcon />, trend: `${Math.round((inactiveTenants/totalTenants)*100)}% of total` },
              { title: 'Growth Rate', value: '+22%', color: 'warning', icon: <BarChartIcon />, trend: 'Quarterly increase' }
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  p: 2, height: '100%', borderRadius: 3,
                  background: `linear-gradient(195deg, ${theme.palette[stat.color].main}, ${theme.palette[stat.color].dark})`,
                  color: 'white', boxShadow: theme.shadows[4], position: 'relative', overflow: 'hidden',
                  '&:before': {
                    content: '""', position: 'absolute', top: '-50px', right: '-50px',
                    width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)'
                  }
                }}>
                  <Box position="relative" zIndex={1}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>{stat.title}</Typography>
                    <Typography variant="h3" fontWeight="700" sx={{ mt: 1, mb: 2 }}>{stat.value}</Typography>
                    <Box display="flex" alignItems="center">
                      {stat.icon}
                      <Typography variant="body2" sx={{ ml: 1 }}>{stat.trend}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Search and Filter Row */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: theme.shadows[1], backgroundColor: theme.palette.background.paper }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  placeholder="Search tenants by name or domain..."
                  variant="outlined" 
                  size="small" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                    style: { borderRadius: 8, backgroundColor: theme.palette.background.default }
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Time Filter</InputLabel>
                  <Select 
                    value={timeFilter} 
                    onChange={(e) => setTimeFilter(e.target.value)} 
                    label="Time Filter" 
                    sx={{ borderRadius: 8 }}
                  >
                    <MenuItem value="24h">Last 24 Hours</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                    <MenuItem value="all">All Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status Filter</InputLabel>
                  <Select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)} 
                    label="Status Filter" 
                    sx={{ borderRadius: 8 }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="inactive">Inactive Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>

          {/* Activity Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                height: { xs: 'auto', md: 320 }, 
                minHeight: 320,
                borderRadius: 3, 
                boxShadow: theme.shadows[1], 
                backgroundColor: theme.palette.background.paper 
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="600">Tenant Activity</Typography>
                  <Box display="flex" alignItems="center">
                    <Chip label="Monthly" size="small" sx={{ mr: 1, backgroundColor: theme.palette.action.selected }} />
                    <IconButton size="small"><MoreIcon /></IconButton>
                  </Box>
                </Box>
                <Box sx={{ width: '100%', height: { xs: 250, md: '85%' } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateActivityData()}>
                      <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorInactive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="name" stroke={theme.palette.text.secondary} tickLine={false} axisLine={false} />
                      <YAxis stroke={theme.palette.text.secondary} tickLine={false} axisLine={false} />
                      <ChartTooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          backgroundColor: theme.palette.background.paper, 
                          border: `1px solid ${theme.palette.divider}` 
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="active" 
                        name="Active" 
                        stroke={theme.palette.success.main} 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorActive)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="inactive" 
                        name="Inactive" 
                        stroke={theme.palette.error.main} 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorInactive)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                height: { xs: 'auto', md: 320 }, 
                minHeight: 320,
                borderRadius: 3, 
                boxShadow: theme.shadows[1], 
                backgroundColor: theme.palette.background.paper 
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="600">Status Distribution</Typography>
                  <Box display="flex" alignItems="center">
                    <Chip label="Current" size="small" sx={{ mr: 1, backgroundColor: theme.palette.action.selected }} />
                    <IconButton size="small"><MoreIcon /></IconButton>
                  </Box>
                </Box>
                <Box sx={{ width: '100%', height: { xs: 250, md: '85%' } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={statusData} 
                        cx="50%" 
                        cy="50%" 
                        labelLine={false} 
                        outerRadius={80} 
                        fill="#8884d8" 
                        dataKey="value" 
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          backgroundColor: theme.palette.background.paper, 
                          border: `1px solid ${theme.palette.divider}` 
                        }} 
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center" 
                        wrapperStyle={{ paddingTop: '20px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Tenants Table */}
          <Card sx={{ 
            p: 0, 
            borderRadius: 3, 
            boxShadow: theme.shadows[1], 
            backgroundColor: theme.palette.background.paper, 
            overflow: 'hidden',
            width: '100%'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight="600">Tenant List</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredTenants.length} of {tenants.length} tenants
                </Typography>
                <Chip 
                  label={`${Math.round((filteredTenants.length/tenants.length)*100)}%`} 
                  size="small" 
                  sx={{ backgroundColor: theme.palette.action.selected, fontWeight: 500 }} 
                />
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 500, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                    <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Domain</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow 
                      key={tenant._id} 
                      hover 
                      sx={{ 
                        '&:last-child td': { borderBottom: 0 }, 
                        opacity: tenant.isActive ? 1 : 0.9, 
                        '&:hover': { backgroundColor: theme.palette.action.hover } 
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Badge 
                            overlap="circular" 
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
                            badgeContent={
                              tenant.isActive ? (
                                <ActiveIcon sx={{ 
                                  color: theme.palette.success.main, 
                                  fontSize: '1rem', 
                                  backgroundColor: theme.palette.background.paper, 
                                  borderRadius: '50%' 
                                }} />
                              ) : (
                                <InactiveIcon sx={{ 
                                  color: theme.palette.error.main, 
                                  fontSize: '1rem', 
                                  backgroundColor: theme.palette.background.paper, 
                                  borderRadius: '50%' 
                                }} />
                              )
                            }
                          >
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40, 
                              mr: 2, 
                              boxShadow: theme.shadows[1], 
                              backgroundColor: theme.palette.primary.main 
                            }}>
                              {tenant.name.charAt(0)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography fontWeight="600">{tenant.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{tenant.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={tenant.domain} 
                          size="small" 
                          sx={{ 
                            backgroundColor: theme.palette.grey[200], 
                            fontWeight: 500, 
                            '& .MuiChip-label': { px: 1.5 } 
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(tenant.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Tooltip title={tenant.isActive ? 'Active' : 'Inactive'}>
                            <Switch 
                              checked={tenant.isActive} 
                              onChange={() => toggleStatus(tenant._id, tenant.isActive)} 
                              color={tenant.isActive ? 'success' : 'error'} 
                              sx={{ 
                                '& .MuiSwitch-thumb': { 
                                  backgroundColor: tenant.isActive ? theme.palette.success.main : theme.palette.error.main 
                                } 
                              }} 
                            />
                          </Tooltip>
                          <Chip 
                            label={tenant.isActive ? 'Active' : 'Inactive'} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              backgroundColor: tenant.isActive ? theme.palette.success.light : theme.palette.error.light, 
                              color: tenant.isActive ? theme.palette.success.dark : theme.palette.error.dark, 
                              fontWeight: 500 
                            }} 
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={1} flexWrap="wrap">
                          <Tooltip title="Resend Welcome Email">
                            <IconButton 
                              onClick={() => handleResendWelcomeEmail(tenant)} 
                              size="small" 
                              sx={{ 
                                backgroundColor: theme.palette.action.hover, 
                                color: theme.palette.info.main, 
                                '&:hover': { backgroundColor: theme.palette.info.main, color: 'white' } 
                              }}
                            >
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleViewTenant(tenant)} 
                              size="small" 
                              sx={{ 
                                backgroundColor: theme.palette.action.hover, 
                                color: theme.palette.primary.main, 
                                '&:hover': { backgroundColor: theme.palette.primary.main, color: 'white' } 
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Tenant">
                            <IconButton 
                              onClick={() => handleEditTenant(tenant._id)} 
                              size="small" 
                              sx={{ 
                                backgroundColor: theme.palette.action.hover, 
                                color: theme.palette.secondary.main, 
                                '&:hover': { backgroundColor: theme.palette.secondary.main, color: 'white' } 
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Tenant">
                            <IconButton 
                              onClick={() => confirmDelete(tenant)} 
                              size="small" 
                              sx={{ 
                                backgroundColor: theme.palette.action.hover, 
                                color: theme.palette.error.main, 
                                '&:hover': { backgroundColor: theme.palette.error.main, color: 'white' } 
                              }}
                            >
                              <DeleteIcon fontSize="small" />
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

        {/* Right Column - 30% width */}
        <Grid item xs={12} lg={4} width={'100%'}>
          {/* Recent Activity */}
          <Card sx={{ 
            p: 0, 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: theme.shadows[1], 
            backgroundColor: theme.palette.background.paper 
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight="600">Recent Activity</Typography>
              <IconButton size="small"><MoreIcon /></IconButton>
            </Box>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 2 }}>
              {[
                { time: '1h ago', action: 'Created new tenant "Acme Corp"', user: 'Admin' },
                { time: '2h ago', action: 'Updated settings for "Tech Solutions"', user: 'Super Admin' },
                { time: '3h ago', action: 'Deactivated tenant "Global Enterprises"', user: 'Admin' },
                { time: '4h ago', action: 'Logged in to dashboard', user: 'System' },
                { time: '5h ago', action: 'Generated monthly report', user: 'Admin' },
                { time: '6h ago', action: 'Added new admin user', user: 'Super Admin' },
                { time: '7h ago', action: 'Changed password', user: 'User' },
                { time: '8h ago', action: 'Viewed tenant details', user: 'Admin' }
              ].map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.background.default, 
                    transition: 'all 0.2s', 
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[1] } 
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1.5, 
                      backgroundColor: theme.palette.primary.main, 
                      color: 'white' 
                    }}>
                      {item.user.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="500">{item.user}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {item.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.action}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Latest Tenants */}
          <Card sx={{ 
            p: 0, 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: theme.shadows[1], 
            backgroundColor: theme.palette.background.paper 
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight="600">Latest Tenants</Typography>
              <IconButton size="small"><MoreIcon /></IconButton>
            </Box>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 2 }}>
              {tenants.slice(0, 5).map((tenant) => (
                <Box 
                  key={tenant._id} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.background.default, 
                    transition: 'all 0.2s', 
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[1] } 
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Badge 
                      overlap="circular" 
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
                      badgeContent={
                        tenant.isActive ? (
                          <ActiveIcon sx={{ 
                            color: theme.palette.success.main, 
                            fontSize: '0.8rem', 
                            backgroundColor: theme.palette.background.paper, 
                            borderRadius: '50%' 
                          }} />
                        ) : (
                          <InactiveIcon sx={{ 
                            color: theme.palette.error.main, 
                            fontSize: '0.8rem', 
                            backgroundColor: theme.palette.background.paper, 
                            borderRadius: '50%' 
                          }} />
                        )
                      }
                    >
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2, 
                        boxShadow: theme.shadows[1], 
                        backgroundColor: theme.palette.primary.main, 
                        color: 'white' 
                      }}>
                        {tenant.name.charAt(0)}
                      </Avatar>
                    </Badge>
                    <Box flexGrow={1}>
                      <Typography fontWeight="600">{tenant.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{tenant.domain}</Typography>
                    </Box>
                    <Chip 
                      label={tenant.isActive ? 'Active' : 'Inactive'} 
                      size="small" 
                      sx={{
                        backgroundColor: tenant.isActive ? theme.palette.success.light : theme.palette.error.light,
                        color: tenant.isActive ? theme.palette.success.dark : theme.palette.error.dark, 
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(tenant.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => handleViewTenant(tenant)} 
                      sx={{ 
                        textTransform: 'none', 
                        color: theme.palette.primary.main, 
                        fontWeight: 500 
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ 
            p: 0, 
            borderRadius: 3, 
            boxShadow: theme.shadows[1], 
            backgroundColor: theme.palette.background.paper 
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight="600">Quick Actions</Typography>
              <IconButton size="small"><MoreIcon /></IconButton>
            </Box>
            <Grid container spacing={1} sx={{ p: 2 }}>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddDialogOpen} 
                  sx={{ 
                    mb: 1, 
                    py: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.primary.main, 
                    '&:hover': { backgroundColor: theme.palette.primary.dark }, 
                    boxShadow: theme.shadows[1] 
                  }}
                >
                  Add Tenant
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<FilterIcon />} 
                  sx={{ 
                    mb: 1, 
                    py: 1.5, 
                    borderRadius: 2, 
                    borderColor: theme.palette.divider, 
                    '&:hover': { backgroundColor: theme.palette.action.hover, borderColor: theme.palette.primary.main } 
                  }}
                >
                  Filter
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<SettingsIcon />} 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    borderColor: theme.palette.divider, 
                    '&:hover': { backgroundColor: theme.palette.action.hover, borderColor: theme.palette.primary.main } 
                  }}
                >
                  Settings
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<PeopleIcon />} 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    borderColor: theme.palette.divider, 
                    '&:hover': { backgroundColor: theme.palette.action.hover, borderColor: theme.palette.primary.main } 
                  }}
                >
                  Users
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Add Tenant Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={handleAddDialogClose} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3, p: 3, maxHeight: '90vh' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 3 }}>Register New Company</DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 0, maxHeight: '60vh', overflowY: 'auto' }}>
            {/* Basic Information Accordion */}
            <Accordion expanded={expandedAccordion === 'basic'} onChange={handleAccordionChange('basic')} sx={{ mb: 2, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="600">1. Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Company Name (Legal Name)*" 
                      name="companyName" 
                      value={newTenant.companyName} 
                      onChange={handleInputChange} 
                      error={!!formErrors.companyName} 
                      helperText={formErrors.companyName} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Trade Name / Brand Name" 
                      name="tradeName" 
                      value={newTenant.tradeName} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                   <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.companyType}>
                      <InputLabel>Company Type*</InputLabel>
                      <Select 
                        name="companyType" 
                        value={newTenant.companyType} 
                        onChange={handleInputChange} 
                        label="Company Type*" 
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="Private Limited">Private Limited</MenuItem>
                        <MenuItem value="LLP">LLP (Limited Liability Partnership)</MenuItem>
                        <MenuItem value="Proprietorship">Proprietorship</MenuItem>
                        <MenuItem value="Partnership">Partnership</MenuItem>
                        <MenuItem value="Public Limited">Public Limited</MenuItem>
                        <MenuItem value="NGO">NGO (Non-Governmental Organization)</MenuItem>
                        <MenuItem value="Trust">Trust</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {formErrors.companyType && <Typography variant="caption" color="error">{formErrors.companyType}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.industryType}>
                      <InputLabel>Industry Type*</InputLabel>
                      <Select 
                        name="industryType" 
                        value={newTenant.industryType} 
                        onChange={handleInputChange} 
                        label="Industry Type*" 
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="IT">Information Technology</MenuItem>
                        <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                        <MenuItem value="Services">Services</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                        <MenuItem value="Education">Education</MenuItem>
                        <MenuItem value="Finance">Finance & Banking</MenuItem>
                        <MenuItem value="Retail">Retail</MenuItem>
                        <MenuItem value="Hospitality">Hospitality</MenuItem>
                        <MenuItem value="Real Estate">Real Estate</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {formErrors.industryType && <Typography variant="caption" color="error">{formErrors.industryType}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.companySize}>
                      <InputLabel>Company Size (No. of employees)*</InputLabel>
                      <Select 
                        name="companySize" 
                        value={newTenant.companySize} 
                        onChange={handleInputChange} 
                        label="Company Size (No. of employees)*" 
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="1-10">1-10</MenuItem>
                        <MenuItem value="11-50">11-50</MenuItem>
                        <MenuItem value="51-200">51-200</MenuItem>
                        <MenuItem value="201-500">201-500</MenuItem>
                        <MenuItem value="501-1000">501-1000</MenuItem>
                        <MenuItem value="1000+">1000+</MenuItem>
                      </Select>
                      {formErrors.companySize && <Typography variant="caption" color="error">{formErrors.companySize}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Website" 
                      name="website" 
                      value={newTenant.website} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ 
                        sx: { borderRadius: 2 }, 
                        startAdornment: <InputAdornment position="start">https://</InputAdornment> 
                      }} 
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            {/* Contact Information Accordion */}
            <Accordion expanded={expandedAccordion === 'contact'} onChange={handleAccordionChange('contact')} sx={{ mb: 2, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="600">2. Contact Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Registered Office Address*" 
                      name="registeredAddress" 
                      value={newTenant.registeredAddress} 
                      onChange={handleInputChange} 
                      error={!!formErrors.registeredAddress} 
                      helperText={formErrors.registeredAddress} 
                      variant="outlined" 
                      multiline 
                      rows={3} 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Corporate Office Address (if different)" 
                      name="corporateAddress" 
                      value={newTenant.corporateAddress} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      multiline 
                      rows={3} 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="State*" 
                      name="state" 
                      value={newTenant.state} 
                      onChange={handleInputChange} 
                      error={!!formErrors.state} 
                      helperText={formErrors.state} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="City*" 
                      name="city" 
                      value={newTenant.city} 
                      onChange={handleInputChange} 
                      error={!!formErrors.city} 
                      helperText={formErrors.city} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Pincode*" 
                      name="pincode" 
                      value={newTenant.pincode} 
                      onChange={handleInputChange} 
                      error={!!formErrors.pincode} 
                      helperText={formErrors.pincode} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Phone / Mobile Number*" 
                      name="phone" 
                      value={newTenant.phone} 
                      onChange={handleInputChange} 
                      error={!!formErrors.phone} 
                      helperText={formErrors.phone} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Company Email*" 
                      name="email" 
                      type="email" 
                      value={newTenant.email} 
                      onChange={handleInputChange} 
                      error={!!formErrors.email} 
                      helperText={formErrors.email} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Primary Contact Person*" 
                      name="contactPerson" 
                      value={newTenant.contactPerson} 
                      onChange={handleInputChange} 
                      error={!!formErrors.contactPerson} 
                      helperText={formErrors.contactPerson} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            {/* Statutory Information Accordion */}
            <Accordion expanded={expandedAccordion === 'statutory'} onChange={handleAccordionChange('statutory')} sx={{ mb: 2, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="600">3. Statutory Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="PAN (Permanent Account Number)" 
                      name="pan" 
                      value={newTenant.pan} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="GSTIN" 
                      name="gstin" 
                      value={newTenant.gstin} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="CIN (Corporate Identification Number)" 
                      name="cin" 
                      value={newTenant.cin} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="TAN (Tax Deduction Account Number)" 
                      name="tan" 
                      value={newTenant.tan} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="MSME / Udyam Registration Number" 
                      name="msmeUdyam" 
                      value={newTenant.msmeUdyam} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Shop & Establishment Number" 
                      name="shopEstablishment" 
                      value={newTenant.shopEstablishment} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="PF Registration Number" 
                      name="pfRegistration" 
                      value={newTenant.pfRegistration} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="ESI Registration Number" 
                      name="esiRegistration" 
                      value={newTenant.esiRegistration} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            {/* Banking & Billing Accordion */}
            <Accordion expanded={expandedAccordion === 'banking'} onChange={handleAccordionChange('banking')} sx={{ mb: 2, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="600">4. Banking & Billing</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Bank Name" 
                      name="bankName" 
                      value={newTenant.bankName} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Account Holder Name" 
                      name="accountHolderName" 
                      value={newTenant.accountHolderName} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Account Number" 
                      name="accountNumber" 
                      value={newTenant.accountNumber} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="IFSC Code" 
                      name="ifscCode" 
                      value={newTenant.ifscCode} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Billing Address" 
                      name="billingAddress" 
                      value={newTenant.billingAddress} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      multiline 
                      rows={3} 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Billing Contact Email" 
                      name="billingEmail" 
                      type="email" 
                      value={newTenant.billingEmail} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="GST Billing State" 
                      name="gstBillingState" 
                      value={newTenant.gstBillingState} 
                      onChange={handleInputChange} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            {/* Admin Access Accordion */}
            <Accordion expanded={expandedAccordion === 'admin'} onChange={handleAccordionChange('admin')} sx={{ mb: 2, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="600">5. Admin Access</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Set up the administrator account for this company. This user will have full access to manage their company's account.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Admin Password*" 
                      name="adminPassword" 
                      type="password" 
                      value={newTenant.adminPassword} 
                      onChange={handleInputChange} 
                      error={!!formErrors.adminPassword} 
                      helperText={formErrors.adminPassword} 
                      variant="outlined" 
                      InputProps={{ sx: { borderRadius: 2 } }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          
          <DialogActions sx={{ p: 0, mt: 3, justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleAddDialogClose} 
              variant="outlined" 
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                px: 3, 
                py: 1, 
                mr: 2, 
                borderColor: theme.palette.divider 
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                px: 3, 
                py: 1, 
                backgroundColor: theme.palette.primary.main 
              }}
            >
              Register Company
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Tenant Details Dialog */}
      <Dialog 
        open={viewTenantDialogOpen} 
        onClose={() => setViewTenantDialogOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3, p: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon color="primary" />
          {selectedTenant?.name} Details
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          {selectedTenant && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Company Name</Typography>
                <Typography variant="body1" gutterBottom>{selectedTenant.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Domain</Typography>
                <Typography variant="body1" gutterBottom>{selectedTenant.domain}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Email</Typography>
                <Typography variant="body1" gutterBottom>{selectedTenant.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Status</Typography>
                <Chip 
                  label={selectedTenant.isActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  sx={{
                    backgroundColor: selectedTenant.isActive ? theme.palette.success.light : theme.palette.error.light,
                    color: selectedTenant.isActive ? theme.palette.success.dark : theme.palette.error.dark, 
                    fontWeight: 500 
                  }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Created Date</Typography>
                <Typography variant="body1" gutterBottom>{new Date(selectedTenant.createdAt).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Last Updated</Typography>
                <Typography variant="body1" gutterBottom>{new Date(selectedTenant.updatedAt).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Additional Information</Typography>
                <Typography variant="body2" color="text.secondary">
                  This tenant has been active since {new Date(selectedTenant.createdAt).toLocaleDateString()}. 
                  {selectedTenant.isActive ? ' Currently active and receiving services.' : ' Currently inactive and not receiving services.'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          <Button 
            onClick={() => setViewTenantDialogOpen(false)} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              px: 3, 
              py: 1, 
              borderColor: theme.palette.divider, 
              '&:hover': { borderColor: theme.palette.primary.main } 
            }}
          >
            Close
          </Button>
          <Button 
            onClick={() => handleEditTenant(selectedTenant?._id)} 
            variant="contained" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              px: 3, 
              py: 1 
            }}
          >
            Edit Tenant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Welcome Dialog with Login Link */}
      <Dialog 
        open={showWelcomeDialog} 
        onClose={() => setShowWelcomeDialog(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3, p: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.success.main }}>
          <CheckCircleIcon color="success" />
          Tenant Created Successfully!
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body1" gutterBottom>A welcome email with login instructions has been sent to the admin's email address.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>You can also share this direct login link if needed:</Typography>
          <Box sx={{ 
            p: 2, 
            mt: 2, 
            backgroundColor: theme.palette.grey[100], 
            borderRadius: 2, 
            border: `1px solid ${theme.palette.divider}`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 1 }}>
              {newTenantLink}
            </Typography>
            <Tooltip title="Copy link">
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(newTenantLink)} 
                sx={{ color: theme.palette.primary.main }}
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          <Button 
            onClick={() => setShowWelcomeDialog(false)} 
            variant="contained" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              px: 3, 
              py: 1 
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        PaperProps={{ sx: { borderRadius: 3, padding: 3, minWidth: 500 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 2 }}>Confirm Tenant Deletion</DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography>
            Are you sure you want to permanently delete <strong>{tenantToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" mt={2}>
            <strong>Warning:</strong> This action cannot be undone and will remove all associated data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              px: 3, 
              py: 1, 
              borderColor: theme.palette.divider, 
              '&:hover': { borderColor: theme.palette.primary.main } 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteTenant} 
            variant="contained" 
            color="error" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              px: 3, 
              py: 1 
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminDashboard;