import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Divider,
  Chip,
  Paper,
  Stack,
  IconButton,
  Button,
  Container,
  Avatar,
  Tab,
  Tabs,
} from "@mui/material";
import { 
  ViewQuilt, 
  ViewStream, 
  ArrowBackIosNew, 
  LocationOnOutlined, 
  WorkOutline, 
  CalendarTodayOutlined,
  CurrencyExchangeOutlined,
  PeopleOutlined
} from "@mui/icons-material";
import { getJobById } from "../../services/Jobs/jobsService";

// DUMMY DATA FOR FALLBACK
const dummyJob = {
  jobTitle: "Senior Frontend Developer (React)",
  department: "Product Engineering",
  experience: "5-8 Years",
  jobDesc: "We are looking for a rockstar React developer to join our team. You will be responsible for building the core UI components and ensuring the performance of the web platform.\n\nRequirements:\n- Strong knowledge of React & Redux.\n- Experience with MUI and Styled Components.\n- Understanding of RESTful APIs.",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-02-01T14:30:00Z",
  jobFormId: {
    locations: [{ name: "New York, NY" }, { name: "Remote" }],
    jobType: "Permanent / Full-Time",
    openings: 5,
    targetHireDate: "2024-05-20",
    currency: "USD",
    amount: "140,000 - 180,000",
    allowReapply: true,
    markPriority: true,
    hiringFlow: ["Initial Screen", "Technical Assessment", "System Design", "Cultural Fit", "Offer"],
  },
};

const JobInfo = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // For Detail vs Table view

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(jobId);
        setJob(response?.job || dummyJob);
      } catch (err) {
        setJob(dummyJob);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <CircularProgress thickness={4} size={40} sx={{ color: '#2563eb' }} />
    </Box>
  );

  const { jobTitle, department, experience, jobDesc, jobFormId } = job;

  // Metadata Component for the Summary Bar
  const MetaItem = ({ icon, text }) => (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {React.cloneElement(icon, { sx: { fontSize: 18, color: 'text.secondary' } })}
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {text}
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', pb: 10,marginLeft:10 }}>
      {/* 1. TOP NAVIGATION BAR */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', py: 1.5 }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button 
              startIcon={<ArrowBackIosNew sx={{ fontSize: '14px !important' }} />} 
              onClick={() => navigate(-1)}
              sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
            >
              Back to Pipeline
            </Button>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>Share</Button>
              <Button variant="contained" sx={{ borderRadius: '8px', textTransform: 'none', bgcolor: '#2563eb' }}>Edit Posting</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* 2. HEADER CARD */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, width: 56, height: 56 }}>
                  {jobTitle.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
                    {jobTitle}
                  </Typography>
                  <Stack direction="row" spacing={3} mt={0.5}>
                    <MetaItem icon={<WorkOutline />} text={department} />
                    <MetaItem icon={<LocationOnOutlined />} text={jobFormId?.locations?.[0]?.name} />
                    <MetaItem icon={<PeopleOutlined />} text={`${jobFormId?.openings} Openings`} />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
              <Chip 
                label={jobFormId?.markPriority ? "High Priority" : "Standard"} 
                color={jobFormId?.markPriority ? "error" : "default"}
                sx={{ fontWeight: 700, px: 1 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 3. SUB-NAV TABS */}
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ minHeight: 0 }}>
            <Tab label="Overview" icon={<ViewQuilt />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Structured Data" icon={<ViewStream />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Paper>

        {/* 4. MAIN CONTENT AREA */}
        <Grid container spacing={3}>
          {activeTab === 0 ? (
            <>
              {/* Left Column: Rich Description */}
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>Job Description</Typography>
                  <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {jobDesc}
                  </Typography>

                  <Typography variant="h6" fontWeight={700} mt={5} mb={3}>Hiring Workflow</Typography>
                  <Box sx={{ position: 'relative' }}>
                    {jobFormId?.hiringFlow?.map((step, i) => (
                      <Stack key={i} direction="row" spacing={3} mb={2} alignItems="center">
                        <Box sx={{ 
                          width: 32, height: 32, borderRadius: '50%', bgcolor: '#2563eb', 
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 700, zIndex: 1
                        }}>
                          {i + 1}
                        </Box>
                        <Typography variant="body1" fontWeight={500} color="#1e293b">{step}</Typography>
                        {i !== jobFormId.hiringFlow.length - 1 && (
                          <Box sx={{ position: 'absolute', left: 15, top: 32, width: 2, height: 20, bgcolor: '#cbd5e1' }} />
                        )}
                      </Stack>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column: Key Metrics */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3}>Quick Stats</Typography>
                  <Stack spacing={3}>
                    <DetailBlock label="Experience" value={experience} icon={<WorkOutline />} />
                    <DetailBlock label="Job Type" value={jobFormId?.jobType} icon={<CalendarTodayOutlined />} />
                    <DetailBlock label="Salary Range" value={`${jobFormId?.currency} ${jobFormId?.amount}`} icon={<CurrencyExchangeOutlined />} />
                    <DetailBlock label="Target Hire Date" value={new Date(jobFormId?.targetHireDate).toLocaleDateString()} icon={<CalendarTodayOutlined />} />
                  </Stack>
                </Paper>
              </Grid>
            </>
          ) : (
            /* Structured View (Professional Alternative to Table) */
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#64748b">SYSTEM DATA ATTRIBUTES</Typography>
                </Box>
                <Grid container>
                  <DataRow label="Internal Job ID" value={`JOB-${jobId?.slice(-5) || '7721'}`} />
                  <DataRow label="Department Code" value={department.toUpperCase().slice(0,4)} />
                  <DataRow label="Reapply Status" value={jobFormId?.allowReapply ? "Allowed" : "Restricted"} />
                  <DataRow label="Hiring Stage Count" value={jobFormId?.hiringFlow?.length} />
                  <DataRow label="Posting Date" value={new Date(job.createdAt).toLocaleString()} />
                  <DataRow label="Last Activity" value={new Date(job.updatedAt).toLocaleString()} />
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

// Internal Components for Cleanliness
const DetailBlock = ({ label, value, icon }) => (
  <Stack direction="row" spacing={2}>
    <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: '8px', display: 'flex' }}>
      {React.cloneElement(icon, { sx: { fontSize: 20, color: '#64748b' } })}
    </Box>
    <Box>
      <Typography variant="caption" fontWeight={600} color="#94a3b8" display="block">{label}</Typography>
      <Typography variant="body2" fontWeight={600} color="#1e293b">{value}</Typography>
    </Box>
  </Stack>
);

const DataRow = ({ label, value }) => (
  <Grid item xs={12} sm={6} sx={{ p: 3, borderBottom: '1px solid #f1f5f9', borderRight: { sm: '1px solid #f1f5f9' } }}>
    <Typography variant="caption" fontWeight={700} color="#94a3b8" sx={{ textTransform: 'uppercase' }}>{label}</Typography>
    <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>{value}</Typography>
  </Grid>
);

export default JobInfo;