import React from "react";

const ReportsPage = () => {
<<<<<<< HEAD
=======
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
          `http://ats-env.eba-qmshqp3j.ap-south-1.elasticbeanstalk.com/api/v1/reports`,
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

>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#f8fafc",
      textAlign: "center",
      padding: "24px",
      marginLeft:400
    }}>
      {/* Icon */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 18,
        background: "#eff6ff",
        border: "1px solid #dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
          stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      </div>

      {/* Badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#fffbeb",
        border: "1px solid #fde68a",
        color: "#b45309",
        fontSize: 11.5,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 20,
        marginBottom: 16,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Coming Soon
      </div>

      {/* Heading */}
      <h1 style={{
        fontSize: 26,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: "-0.4px",
        margin: "0 0 10px",
      }}>
        Reports Page
      </h1>

      {/* Subtext */}
      <p style={{
        fontSize: 15,
        color: "#64748b",
        fontWeight: 500,
        maxWidth: 380,
        lineHeight: 1.6,
        margin: "0 0 28px",
      }}>
        We're working on the Reports page. It will be available soon.
      </p>

      {/* Divider with dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: i === 0 ? "#2563eb" : i === 1 ? "#93c5fd" : "#dbeafe",
          }} />
        ))}
      </div>

      {/* Footer note */}
      <p style={{
        fontSize: 12.5,
        color: "#94a3b8",
        fontWeight: 500,
      }}>
        Check back later — we'll notify you when it's ready.
      </p>
    </div>
  );
};

export default ReportsPage;