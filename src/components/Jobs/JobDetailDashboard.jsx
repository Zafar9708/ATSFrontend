import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Stack,
  IconButton,
  Paper,
  Chip,
  useTheme,
  styled,
  alpha,
  LinearProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Menu,
  MenuItem,
  Select,
  InputAdornment,
  Badge,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  HowToReg as HowToRegIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import AddCandidateForm from "../Candidates/AddCandidateForm";

// API Configuration
const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - please check your connection");
    }
    return Promise.reject(error);
  },
);

const apiService = {
  getJobDetails: async (jobId) => {
    const response = await api.get(`/v1/job/${jobId}`);
    return response.data;
  },
  getJobCandidates: async (jobId) => {
    const response = await api.get(`/v1/candidates/job/${jobId}`);
    return response.data;
  },
  getUpcomingInterviews: async () => {
    try {
      const response = await api.get(`/v1/interviews/upcoming`);
      return response.data;
    } catch (error) {
      console.error("Error fetching interviews:", error);
      return { data: [] };
    }
  },
  updateCandidateStage: async (candidateId, stage) => {
    const response = await api.patch(`/v1/candidates/${candidateId}/stage`, {
      stage,
    });
    return response.data;
  },
  deleteCandidate: async (candidateId) => {
    const response = await api.delete(`/v1/candidates/${candidateId}`);
    return response.data;
  },
};

// Styled Components - Smaller cards
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: "10px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.08),
  transition: "all 0.2s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: "10px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.06),
  height: "100%",
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "6px",
  padding: "6px 16px",
  fontSize: "0.8rem",
  "&:hover": {
    background: theme.palette.primary.dark,
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  background: theme.palette.grey[100],
  color: theme.palette.text.primary,
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "6px",
  padding: "6px 16px",
  fontSize: "0.8rem",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  "&:hover": {
    background: theme.palette.grey[200],
    borderColor: alpha(theme.palette.divider, 0.3),
  },
}));

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    interviewsToday: 0,
    positionsFilled: 0,
    acceptanceRate: 0,
  });
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);

  useEffect(() => {
    if (jobId) fetchAllData();
  }, [jobId]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobResponse, candidatesResponse, interviewsResponse] =
        await Promise.all([
          apiService.getJobDetails(jobId),
          apiService.getJobCandidates(jobId),
          apiService.getUpcomingInterviews(),
        ]);
      setJob(jobResponse.job);
      const transformedCandidates = transformCandidates(
        candidatesResponse.candidates || [],
      );
      setCandidates(transformedCandidates);
      setInterviews(interviewsResponse.data || []);
      setPipelineData(calculatePipelineData(transformedCandidates));
      setWeeklyData(generateWeeklyData(transformedCandidates));
      const totalCandidates = transformedCandidates.length;
      const interviewsToday =
        interviewsResponse.data?.filter(
          (i) => new Date(i.date).toDateString() === new Date().toDateString(),
        ).length || 0;
      const positionsFilled = transformedCandidates.filter(
        (c) => c.stage === "Hired" || c.status === "hired",
      ).length;
      const acceptanceRate =
        totalCandidates > 0
          ? ((positionsFilled / totalCandidates) * 100).toFixed(1)
          : 0;
      setStats({
        totalCandidates,
        interviewsToday,
        positionsFilled,
        acceptanceRate: parseFloat(acceptanceRate),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const transformCandidates = (apiCandidates) =>
    (apiCandidates || []).map((c) => ({
      id: c._id,
      name:
        c.fullName ||
        `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
        "Unknown",
      email: c.email || "No email",
      phone: c.mobile || "No phone",
      stage: c.stage?.name || "Sourced",
      status: c.resume?.status || "active",
      appliedDate: c.createdAt
        ? new Date(c.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown",
      experience: c.experience || "Not specified",
      avatarColor: getRandomColor(c._id),
      lastActivity: getRelativeTime(
        c.updatedAt ? new Date(c.updatedAt) : new Date(),
      ),
      currentCTC: c.currentCTC
        ? `${c.currency || "INR"} ${c.currentCTC}`
        : "Not specified",
      expectedCTC: c.expectedCTC
        ? `${c.currency || "INR"} ${c.expectedCTC}`
        : "Not specified",
      skills: c.skills || [],
      matchingScore:
        c.resume?.matchingScore || Math.floor(Math.random() * 30) + 60,
    }));

  const calculatePipelineData = (candidates) => {
    const stages = [
      "Sourced",
      "Screening",
      "Interview",
      "Offer",
      "Hired",
      "Rejected",
    ];
    const colors = [
      "#2196F3",
      "#FF9800",
      "#9C27B0",
      "#4CAF50",
      "#00C853",
      "#F44336",
    ];
    return stages
      .map((stage, i) => ({
        name: stage,
        value: candidates.filter((c) => c.stage === stage).length,
        color: colors[i],
      }))
      .filter((item) => item.value > 0);
  };

  const generateWeeklyData = (candidates) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const applications = candidates.filter(
        (c) =>
          c.createdAt &&
          new Date(c.createdAt).toDateString() === date.toDateString(),
      ).length;
      return {
        day: dayName,
        applications,
        interviews: Math.floor(applications * 0.3),
      };
    });
  };

  const getRandomColor = (seed) => {
    const colors = [
      "#2196F3",
      "#FF9800",
      "#4CAF50",
      "#9C27B0",
      "#F44336",
      "#009688",
      "#673AB7",
    ];
    return colors[
      (seed?.split("").reduce((a, c) => a + c.charCodeAt(0), 0) || 0) %
        colors.length
    ];
  };

  const getRelativeTime = (date) => {
    const diff = new Date() - date;
    const m = Math.floor(diff / 60000),
      h = Math.floor(diff / 3600000),
      d = Math.floor(diff / 86400000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  const getStageColor = (stage) =>
    ({
      Sourced: "#2196F3",
      Screening: "#FF9800",
      Interview: "#9C27B0",
      Offer: "#4CAF50",
      Hired: "#00C853",
      Rejected: "#F44336",
    })[stage] || "#757575";
  const getStatusColor = (s) =>
    ({
      shortlisted: "success",
      "under review": "info",
      rejected: "error",
      "on hold": "warning",
    })[s?.toLowerCase()] || "default";

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills?.some((sk) =>
        sk.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return (
      matchesSearch &&
      (stageFilter === "all" || c.stage === stageFilter) &&
      (statusFilter === "all" || c.status?.toLowerCase() === statusFilter)
    );
  });

  const weeklyPieData = [
    {
      name: "Applications",
      value: weeklyData.reduce((s, d) => s + d.applications, 0),
      color: theme.palette.primary.main,
    },
    {
      name: "Interviews",
      value: weeklyData.reduce((s, d) => s + d.interviews, 0),
      color: theme.palette.secondary.main,
    },
  ].filter((d) => d.value > 0);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={50} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchAllData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        ml: "170px",
        p: 2,
        minHeight: "100vh",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 0.5, color: theme.palette.text.primary }}
          >
            {job?.jobTitle || "Job Details"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              size="small"
              icon={<BusinessIcon sx={{ fontSize: 12 }} />}
              label={job?.department || "Department"}
              sx={{ fontWeight: 500, height: 24, fontSize: "0.7rem" }}
            />
            <Chip
              size="small"
              icon={<LocationIcon sx={{ fontSize: 12 }} />}
              label={job?.jobFormId?.locations?.[0]?.name || "Remote"}
              sx={{ fontWeight: 500, height: 24, fontSize: "0.7rem" }}
            />
            <Chip
              size="small"
              icon={<MoneyIcon sx={{ fontSize: 12 }} />}
              label={`${job?.jobFormId?.currency || "INR"} ${job?.jobFormId?.amount || "N/A"}`}
              sx={{ fontWeight: 500, height: 24, fontSize: "0.7rem" }}
            />
            <Chip
              size="small"
              icon={<WorkIcon sx={{ fontSize: 12 }} />}
              label={job?.jobFormId?.jobType || "Full-time"}
              sx={{ fontWeight: 500, height: 24, fontSize: "0.7rem" }}
            />
            <Chip
              size="small"
              label={`ID: ${job?.jobName || job?._id?.slice(-6) || "N/A"}`}
              variant="outlined"
              sx={{ fontWeight: 500, height: 24, fontSize: "0.7rem" }}
            />
          </Box>
        </Box>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search candidates..."
            size="small"
            sx={{
              width: "35%",
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontSize: "0.8rem",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SecondaryButton
            startIcon={<FilterIcon sx={{ fontSize: 18 }} />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{ fontSize: "0.75rem", py: 0.5 }}
          >
            Filter
          </SecondaryButton>
          <SecondaryButton
            startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
            onClick={fetchAllData}
            sx={{ fontSize: "0.75rem", py: 0.5 }}
          >
            Refresh
          </SecondaryButton>
        </Box>

        {/* Stats Cards - Smaller size */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            {
              label: "Total Candidates",
              value: stats.totalCandidates,
              sub: `${candidates.filter((c) => c.status === "shortlisted").length} shortlisted`,
              icon: <PeopleIcon sx={{ fontSize: 24 }} />,
              mainColor: "#1976d2",
              gradientStart: "#1976d2",
              gradientEnd: "#1565c0",
              progress:
                (candidates.filter((c) => c.status === "shortlisted").length /
                  (stats.totalCandidates || 1)) *
                100,
            },
            {
              label: "Interviews Today",
              value: stats.interviewsToday,
              sub: `${interviews.length} total`,
              icon: <ScheduleIcon sx={{ fontSize: 24 }} />,
              mainColor: "#0288d1",
              gradientStart: "#0288d1",
              gradientEnd: "#0277bd",
            },
            {
              label: "Positions Filled",
              value: stats.positionsFilled || 0,
              sub: `${(job?.jobFormId?.openings || 0) - (stats.positionsFilled || 0)} left`,
              icon: <HowToRegIcon sx={{ fontSize: 24 }} />,
              mainColor: "#0277bd",
              gradientStart: "#0277bd",
              gradientEnd: "#01579b",
            },
            {
              label: "Acceptance Rate",
              value: `${stats.acceptanceRate}%`,
              sub: "Above avg",
              icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
              mainColor: "#01579b",
              gradientStart: "#01579b",
              gradientEnd: "#002171",
            },
          ].map((s, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <StatCard
                sx={{
                  height: "100%",
                  background: `linear-gradient(145deg, ${s.gradientStart} 0%, ${s.gradientEnd} 100%)`,
                  borderRadius: 3,
                  boxShadow: `0 2px 8px rgba(${i === 0 ? "25, 118, 210" : i === 1 ? "2, 136, 209" : i === 2 ? "2, 119, 189" : "1, 87, 155"}, 0.2)`,
                  transition: "all 0.2s ease",
                  border: "none",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)",
                    pointerEvents: "none",
                  },
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px rgba(${i === 0 ? "25, 118, 210" : i === 1 ? "2, 136, 209" : i === 2 ? "2, 119, 189" : "1, 87, 155"}, 0.3)`,
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                          fontSize: "0.65rem",
                          mb: 1,
                        }}
                      >
                        {s.label}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: "#ffffff",
                          fontSize: { xs: "2rem", md: "2.2rem" },
                          lineHeight: 1.1,
                          mb: 0.5,
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {s.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontSize: "0.7rem",
                          "& svg": {
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        {s.sub}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        ml: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          width: 48,
                          height: 48,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.2s ease",
                          border: "1.5px solid rgba(255, 255, 255, 0.3)",
                          "&:hover": {
                            transform: "scale(1.05)",
                            bgcolor: "rgba(255, 255, 255, 0.25)",
                          },
                        }}
                      >
                        {s.icon}
                      </Avatar>
                    </Box>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content - Smaller cards */}
      <Grid container spacing={2}>
        {/* Pipeline Donut */}
        <Grid item xs={12} lg={3}>
          <DashboardCard>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Candidate Pipeline
                </Typography>
                <Chip
                  label={`${candidates.length} total`}
                  size="small"
                  sx={{ height: 22, fontSize: "0.7rem" }}
                />
              </Box>
              {pipelineData.length > 0 ? (
                <>
                  <Box sx={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pipelineData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          label={renderCustomLabel}
                        >
                          {pipelineData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: "6px", fontSize: "0.7rem", padding: "4px 8px" }}
                          formatter={(v, n) => [`${v} candidates`, n]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.4,
                    }}
                  >
                    {pipelineData.map((e, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: e.color,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            {e.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: e.color, fontSize: "0.7rem" }}
                        >
                          {e.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <PeopleIcon
                    sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    No pipeline data yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12} lg={4}>
          <DashboardCard>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, fontSize: "0.9rem" }}>
                Upcoming Interviews
              </Typography>
              {interviews.length > 0 ? (
                <Stack spacing={1.5}>
                  {interviews.slice(0, 3).map((interview) => (
                    <Paper
                      key={interview._id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: "6px",
                        borderColor: alpha(theme.palette.divider, 0.2),
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.02,
                          ),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                        >
                          {interview.candidateName}
                        </Typography>
                        <Chip
                          label={interview.type}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            height: 20,
                            fontSize: "0.65rem",
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon
                            sx={{
                              fontSize: 12,
                              mr: 0.5,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                            {interview.date
                              ? new Date(interview.date).toLocaleDateString()
                              : "Date TBD"}
                            , {interview.time || "Time TBD"}
                          </Typography>
                        </Box>
                        <Chip
                          label={interview.platform || "In Person"}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <ScheduleIcon
                    sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    No upcoming interviews scheduled
                  </Typography>
                </Box>
              )}
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Weekly Activity Donut */}
        <Grid item xs={12} lg={5}>
          <DashboardCard>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Weekly Activity
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  Last 7 days
                </Typography>
              </Box>
              {weeklyPieData.length > 0 ? (
                <>
                  <Box sx={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={weeklyPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          labelLine={false}
                          label={renderCustomLabel}
                        >
                          {weeklyPieData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: "6px", fontSize: "0.7rem", padding: "4px 8px" }}
                          formatter={(v, n) => [`${v}`, n]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box
                    sx={{
                      mt: 1,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                    }}
                  >
                    {weeklyPieData.map((e, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 1,
                          borderRadius: "6px",
                          bgcolor: alpha(e.color, 0.08),
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: e.color,
                            mb: 0.5,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: e.color,
                            lineHeight: 1.2,
                            fontSize: "1rem",
                          }}
                        >
                          {e.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                          {e.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <BarChartIcon
                    sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    No activity this week
                  </Typography>
                </Box>
              )}
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Candidates Table */}
        <Grid item xs={12}>
          <DashboardCard>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, fontSize: "0.9rem" }}>
                Candidates ({filteredCandidates.length})
              </Typography>
              <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                <Table sx={{ minWidth: 1000 }}>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}
                    >
                      {[
                        "Candidate",
                        "Contact",
                        "Stage",
                        "Applied",
                        "Score",
                        "CTC",
                        "Status",
                        "Activity",
                        "Actions",
                      ].map((h, i) => (
                        <TableCell key={h} align={i === 8 ? "right" : "left"} sx={{ fontSize: "0.75rem", py: 1 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCandidates.slice(0, 5).map((candidate) => (
                      <TableRow
                        key={candidate.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.02,
                            ),
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1.5,
                                bgcolor: candidate.avatarColor,
                                fontSize: "0.8rem",
                              }}
                            >
                              {candidate.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                {candidate.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.65rem" }}
                              >
                                {candidate.experience}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                            {candidate.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                            {candidate.phone}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={candidate.stage}
                            size="small"
                            sx={{
                              bgcolor: alpha(
                                getStageColor(candidate.stage),
                                0.1,
                              ),
                              color: getStageColor(candidate.stage),
                              fontWeight: 500,
                              height: 22,
                              fontSize: "0.65rem",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                            {candidate.appliedDate}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Box sx={{ width: 50 }}>
                              <LinearProgress
                                variant="determinate"
                                value={candidate.matchingScore}
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1,
                                  ),
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor:
                                      candidate.matchingScore >= 80
                                        ? "success.main"
                                        : candidate.matchingScore >= 60
                                          ? "warning.main"
                                          : "error.main",
                                  },
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                            >
                              {candidate.matchingScore}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="caption" display="block" sx={{ fontSize: "0.65rem" }}>
                            {candidate.currentCTC}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
                            {candidate.expectedCTC}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={candidate.status}
                            size="small"
                            color={getStatusColor(candidate.status)}
                            variant="outlined"
                            sx={{ height: 22, fontSize: "0.65rem" }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            {candidate.lastActivity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <Tooltip title="View Profile">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/candidates/${candidate.id}`)
                              }
                              sx={{ padding: 0.5 }}
                            >
                              <VisibilityIcon fontSize="small" sx={{ fontSize: "0.9rem" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCandidates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                          <PeopleIcon
                            sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            No candidates found
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, fontSize: "0.7rem", py: 0.5 }}
                            onClick={() => setAddCandidateOpen(true)}
                          >
                            Add your first candidate
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Add Candidate Dialog */}
      <Dialog
        open={addCandidateOpen}
        onClose={() => setAddCandidateOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", pt: 1, px: 1 }}
        >
          <IconButton onClick={() => setAddCandidateOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ pt: 0 }}>
          <AddCandidateForm
            onClose={() => setAddCandidateOpen(false)}
            onSubmit={() => {
              setAddCandidateOpen(false);
              fetchAllData();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;