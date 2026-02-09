import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Stack,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MoneyIcon,
  LocationOn as LocationIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  FileCopy as ReportIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  MoreVert as MoreIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// DUMMY DATA FOR REPORTS
const DUMMY_REPORTS = {
  overview: {
    totalCandidates: 245,
    activeJobs: 18,
    avgTimeToHire: 45,
    totalHires: 42,
    conversionRate: 17.1,
    avgCostPerHire: 8500,
    diversityRatio: 38,
    candidateSatisfaction: 4.2
  },
  monthlyTrends: [
    { month: 'Jan', hires: 8, candidates: 45, avgTime: 42, cost: 7800 },
    { month: 'Feb', hires: 10, candidates: 52, avgTime: 44, cost: 8100 },
    { month: 'Mar', hires: 12, candidates: 61, avgTime: 41, cost: 7900 },
    { month: 'Apr', hires: 9, candidates: 58, avgTime: 46, cost: 8300 },
    { month: 'May', hires: 11, candidates: 67, avgTime: 43, cost: 8200 },
    { month: 'Jun', hires: 14, candidates: 72, avgTime: 40, cost: 8000 },
    { month: 'Jul', hires: 13, candidates: 65, avgTime: 42, cost: 8100 },
    { month: 'Aug', hires: 15, candidates: 78, avgTime: 39, cost: 7900 },
    { month: 'Sep', hires: 12, candidates: 71, avgTime: 41, cost: 8000 },
    { month: 'Oct', hires: 16, candidates: 84, avgTime: 38, cost: 7800 },
    { month: 'Nov', hires: 14, candidates: 76, avgTime: 40, cost: 7900 },
    { month: 'Dec', hires: 18, candidates: 92, avgTime: 37, cost: 7700 }
  ],
  sourceAnalytics: [
    { name: 'LinkedIn', value: 35, color: '#0077B5' },
    { name: 'Indeed', value: 22, color: '#2164F3' },
    { name: 'Referrals', value: 18, color: '#FF6B6B' },
    { name: 'Career Site', value: 12, color: '#4ECDC4' },
    { name: 'Job Boards', value: 8, color: '#FFD166' },
    { name: 'Other', value: 5, color: '#9D9D9D' }
  ],
  departmentMetrics: [
    { department: 'Engineering', hires: 18, openPositions: 6, avgTime: 38, cost: 9200 },
    { department: 'Sales', hires: 12, openPositions: 4, avgTime: 32, cost: 7500 },
    { department: 'Marketing', hires: 8, openPositions: 3, avgTime: 45, cost: 6800 },
    { department: 'Operations', hires: 6, openPositions: 2, avgTime: 51, cost: 6200 },
    { department: 'Product', hires: 5, openPositions: 3, avgTime: 49, cost: 8900 },
    { department: 'HR', hires: 3, openPositions: 0, avgTime: 42, cost: 5800 }
  ],
  stageAnalytics: [
    { stage: 'Sourced', candidates: 245, conversion: 100 },
    { stage: 'Screening', candidates: 192, conversion: 78.4 },
    { stage: 'Interview', candidates: 126, conversion: 65.6 },
    { stage: 'Offered', candidates: 58, conversion: 46 },
    { stage: 'Hired', candidates: 42, conversion: 72.4 }
  ],
  recruiterPerformance: [
    { name: 'Alex Johnson', hires: 12, avgTime: 36, candidates: 48, satisfaction: 4.5 },
    { name: 'Sarah Miller', hires: 10, avgTime: 41, candidates: 42, satisfaction: 4.3 },
    { name: 'Mike Chen', hires: 8, avgTime: 44, candidates: 35, satisfaction: 4.1 },
    { name: 'Emma Davis', hires: 7, avgTime: 39, candidates: 31, satisfaction: 4.6 },
    { name: 'James Wilson', hires: 5, avgTime: 47, candidates: 28, satisfaction: 3.9 }
  ],
  costAnalysis: [
    { category: 'Job Boards', amount: 24500, percentage: 32 },
    { category: 'Agency Fees', amount: 18500, percentage: 24 },
    { category: 'Software Tools', amount: 12800, percentage: 17 },
    { category: 'Events/Ads', amount: 9800, percentage: 13 },
    { category: 'Referral Bonus', amount: 7500, percentage: 10 },
    { category: 'Other', amount: 3900, percentage: 4 }
  ],
  recentActivity: [
    { id: 1, action: 'New candidate added', user: 'Alex Johnson', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Job posted: Senior Developer', user: 'System', time: '4 hours ago', type: 'info' },
    { id: 3, action: 'Candidate rejected', user: 'Sarah Miller', time: '1 day ago', type: 'warning' },
    { id: 4, action: 'Hiring goal achieved', user: 'System', time: '2 days ago', type: 'success' },
    { id: 5, action: 'Report exported', user: 'Mike Chen', time: '3 days ago', type: 'info' },
    { id: 6, action: 'Budget alert', user: 'System', time: '4 days ago', type: 'error' }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ReportsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: subMonths(new Date(), 6),
    end: new Date()
  });
  const [department, setDepartment] = useState('all');
  const [recruiter, setRecruiter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [useDummyData, setUseDummyData] = useState(true);
  const [reports, setReports] = useState(DUMMY_REPORTS);
  const [exporting, setExporting] = useState(false);

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Performance', value: 'performance' },
    { label: 'Financial', value: 'financial' },
    { label: 'Custom Reports', value: 'custom' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Recruitment Overview' },
    { value: 'monthly', label: 'Monthly Trends' },
    { value: 'department', label: 'Department Metrics' },
    { value: 'source', label: 'Source Analysis' },
    { value: 'cost', label: 'Cost Analysis' },
    { value: 'performance', label: 'Recruiter Performance' }
  ];

  useEffect(() => {
    fetchReports();
  }, [dateRange, department, recruiter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      if (!useDummyData) {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/reports`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              startDate: format(dateRange.start, 'yyyy-MM-dd'),
              endDate: format(dateRange.end, 'yyyy-MM-dd'),
              department: department !== 'all' ? department : undefined,
              recruiter: recruiter !== 'all' ? recruiter : undefined
            }
          }
        );
        setReports(response.data);
      } else {
        // Use dummy data
        setReports(DUMMY_REPORTS);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSnackbar({
        open: true,
        message: 'Using demo data. Backend connection failed.',
        severity: 'info'
      });
      setUseDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    setExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSnackbar({
        open: true,
        message: `Report exported as ${format.toUpperCase()} successfully`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Export failed',
        severity: 'error'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleShareReport = () => {
    setSnackbar({
      open: true,
      message: 'Report sharing feature coming soon',
      severity: 'info'
    });
  };

  const StatCard = ({ title, value, icon, change, subtitle, color }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {change && (
              <Box display="flex" alignItems="center" mt={1}>
                {change > 0 ? (
                  <ArrowUpIcon fontSize="small" color="success" />
                ) : (
                  <ArrowDownIcon fontSize="small" color="error" />
                )}
                <Typography
                  variant="body2"
                  color={change > 0 ? 'success.main' : 'error.main'}
                  ml={0.5}
                >
                  {Math.abs(change)}% from last period
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: alpha(color, 0.1),
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, unit, trend, icon }) => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            {value}
            {unit && <Typography component="span" variant="h6" color="text.secondary"> {unit}</Typography>}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              {trend > 0 ? (
                <TrendingUpIcon color="success" fontSize="small" />
              ) : (
                <TrendingDownIcon color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={trend > 0 ? 'success.main' : 'error.main'}
                ml={0.5}
              >
                {trend > 0 ? '+' : ''}{trend}%
              </Typography>
            </Box>
          )}
        </Box>
        {icon}
      </Box>
    </Paper>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'success': return <SuccessIcon color="success" />;
        case 'error': return <ErrorIcon color="error" />;
        case 'warning': return <WarningIcon color="warning" />;
        default: return <ReportIcon color="info" />;
      }
    };

    const getColor = () => {
      switch (activity.type) {
        case 'success': return theme.palette.success.main;
        case 'error': return theme.palette.error.main;
        case 'warning': return theme.palette.warning.main;
        default: return theme.palette.info.main;
      }
    };

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          '&:last-child': { borderBottom: 'none' }
        }}
      >
        <Box sx={{ mr: 2, color: getColor() }}>
          {getIcon()}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {activity.action}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            By {activity.user} • {activity.time}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Recruitment Analytics & Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive insights and analytics for your recruitment process
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchReports}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportReport('pdf')}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(date) => setDateRange({ ...dateRange, start: date })}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(date) => setDateRange({ ...dateRange, end: date })}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={department}
                    label="Department"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="engineering">Engineering</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                    <MenuItem value="operations">Operations</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Recruiter</InputLabel>
                  <Select
                    value={recruiter}
                    label="Recruiter"
                    onChange={(e) => setRecruiter(e.target.value)}
                  >
                    <MenuItem value="all">All Recruiters</MenuItem>
                    <MenuItem value="alex">Alex Johnson</MenuItem>
                    <MenuItem value="sarah">Sarah Miller</MenuItem>
                    <MenuItem value="mike">Mike Chen</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  fullWidth
                  onClick={() => {
                    setDateRange({ start: subMonths(new Date(), 6), end: new Date() });
                    setDepartment('all');
                    setRecruiter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.value}
                label={tab.label}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 60
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <>
            {/* Key Metrics */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Candidates"
                  value={reports.overview.totalCandidates}
                  icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
                  change={12.5}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Jobs"
                  value={reports.overview.activeJobs}
                  icon={<WorkIcon sx={{ color: theme.palette.info.main }} />}
                  change={-3.2}
                  color={theme.palette.info.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Avg Time to Hire"
                  value={reports.overview.avgTimeToHire}
                  icon={<ScheduleIcon sx={{ color: theme.palette.warning.main }} />}
                  subtitle="days"
                  change={-8.7}
                  color={theme.palette.warning.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Hires"
                  value={reports.overview.totalHires}
                  icon={<SuccessIcon sx={{ color: theme.palette.success.main }} />}
                  change={15.3}
                  color={theme.palette.success.main}
                />
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        Monthly Hiring Trends
                      </Typography>
                      <Chip label="Last 12 Months" size="small" />
                    </Box>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={reports.monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                          <YAxis stroke={theme.palette.text.secondary} />
                          <RechartsTooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="hires"
                            name="Hires"
                            stroke={theme.palette.success.main}
                            fill={alpha(theme.palette.success.main, 0.1)}
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="candidates"
                            name="Candidates"
                            stroke={theme.palette.info.main}
                            fill={alpha(theme.palette.info.main, 0.1)}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Candidate Sources
                    </Typography>
                    <Box height={250}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reports.sourceAnalytics}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {reports.sourceAnalytics.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={2}>
                      {reports.sourceAnalytics.map((source, index) => (
                        <Chip
                          key={index}
                          label={source.name}
                          size="small"
                          sx={{ bgcolor: alpha(source.color, 0.1), color: source.color }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Department Metrics */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Department Performance
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell align="right">Hires</TableCell>
                        <TableCell align="right">Open Positions</TableCell>
                        <TableCell align="right">Avg Time (Days)</TableCell>
                        <TableCell align="right">Avg Cost</TableCell>
                        <TableCell align="right">Conversion Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.departmentMetrics.map((dept, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ bgcolor: COLORS[index % COLORS.length], width: 32, height: 32 }}>
                                {dept.department.charAt(0)}
                              </Avatar>
                              <Typography fontWeight="medium">{dept.department}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">{dept.hires}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={dept.openPositions}
                              size="small"
                              color={dept.openPositions > 3 ? 'error' : 'success'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <ScheduleIcon fontSize="small" color="action" />
                              <Typography>{dept.avgTime}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <MoneyIcon fontSize="small" color="action" />
                              <Typography>${dept.cost.toLocaleString()}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <LinearProgress
                                variant="determinate"
                                value={(dept.hires / (dept.hires + dept.openPositions * 3)) * 100}
                                sx={{ width: 60, height: 6 }}
                              />
                              <Typography>
                                {Math.round((dept.hires / (dept.hires + dept.openPositions * 3)) * 100)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 1 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Pipeline Conversion Rates
                    </Typography>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reports.stageAnalytics}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="stage" stroke={theme.palette.text.secondary} />
                          <YAxis stroke={theme.palette.text.secondary} />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="candidates" name="Candidates" fill={theme.palette.primary.main} />
                          <Bar dataKey="conversion" name="Conversion %" fill={theme.palette.success.main} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Cost Analysis Breakdown
                    </Typography>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reports.costAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="category" stroke={theme.palette.text.secondary} />
                          <YAxis stroke={theme.palette.text.secondary} />
                          <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                          <Bar dataKey="amount" name="Cost ($)" fill={theme.palette.warning.main} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === 2 && (
          <>
            <Grid container spacing={3} mb={3}>
              {reports.recruiterPerformance.map((recruiter, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                            {recruiter.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">{recruiter.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Senior Recruiter
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={`#${index + 1}`}
                          color={index === 0 ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Grid container spacing={2} mt={2}>
                        <Grid item xs={6}>
                          <MetricCard
                            title="Hires"
                            value={recruiter.hires}
                            trend={recruiter.hires > 8 ? 12 : recruiter.hires > 5 ? 5 : -3}
                            icon={<PeopleIcon color="primary" />}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MetricCard
                            title="Avg Time"
                            value={recruiter.avgTime}
                            unit="days"
                            trend={recruiter.avgTime < 40 ? -8 : recruiter.avgTime < 45 ? -2 : 5}
                            icon={<ScheduleIcon color="warning" />}
                          />
                        </Grid>
                      </Grid>
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Candidate Satisfaction
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Rating
                            value={recruiter.satisfaction}
                            readOnly
                            precision={0.5}
                            size="small"
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {recruiter.satisfaction}/5
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Financial Tab */}
        {activeTab === 3 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Recruitment Cost Trends
                    </Typography>
                    <Box height={350}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={reports.monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                          <YAxis stroke={theme.palette.text.secondary} />
                          <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="cost"
                            name="Cost per Hire"
                            stroke={theme.palette.warning.main}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="avgTime"
                            name="Time to Hire (Days)"
                            stroke={theme.palette.info.main}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Key Financial Metrics
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Average Cost per Hire
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" color="warning.main">
                          ${reports.overview.avgCostPerHire.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          -2.4% from last quarter
                        </Typography>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Recruitment Spend
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          ${(reports.overview.avgCostPerHire * reports.overview.totalHires).toLocaleString()}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ROI per Hire
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          4.2x
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Based on first-year productivity
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* Custom Reports Tab */}
        {activeTab === 4 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" fontWeight="bold">
                        Build Custom Report
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={() => handleExportReport('pdf')}
                        >
                          Print
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<EmailIcon />}
                          onClick={handleShareReport}
                        >
                          Email
                        </Button>
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Report Type</InputLabel>
                          <Select
                            value={reportType}
                            label="Report Type"
                            onChange={(e) => setReportType(e.target.value)}
                          >
                            {reportTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Format</InputLabel>
                          <Select defaultValue="pdf" label="Format">
                            <MenuItem value="pdf">PDF Document</MenuItem>
                            <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                            <MenuItem value="csv">CSV File</MenuItem>
                            <MenuItem value="ppt">PowerPoint</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Report Description"
                          placeholder="Add description or notes for this report..."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          fullWidth
                          size="large"
                          onClick={() => handleExportReport(reportType)}
                          disabled={exporting}
                        >
                          {exporting ? 'Generating Report...' : 'Generate & Download Report'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Recent Activity
                    </Typography>
                    <Box>
                      {reports.recentActivity.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* Report Actions */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareReport}
          >
            Share Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleExportReport('pdf')}
            disabled={exporting}
          >
            Export Full Report
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsPage;