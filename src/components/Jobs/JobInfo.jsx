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
  Button,
  Container,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from "@mui/material";
import {
  ViewQuilt,
  TableChart,
  ArrowBackIosNew,
  LocationOnOutlined,
  WorkOutline,
  CalendarTodayOutlined,
  CurrencyExchangeOutlined,
  PeopleOutlined,
  InfoOutlined,
  HistoryOutlined
} from "@mui/icons-material";
import { getJobById } from "../../services/Jobs/jobsService";

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
  const [viewMode, setViewMode] = useState("detail"); // 'detail' or 'table'

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
      <CircularProgress thickness={5} size={45} sx={{ color: '#2563eb' }} />
    </Box>
  );

  const { jobTitle, department, experience, jobDesc, jobFormId } = job;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 ,ml:12 }}>
      {/* 1. TOP NAVIGATION */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', py: 1.5, position: 'sticky', top: 0, zIndex: 10 }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              startIcon={<ArrowBackIosNew sx={{ fontSize: '14px !important' }} />}
              onClick={() => navigate(-1)}
              sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#f1f5f9' } }}
            >
              Back to Pipeline
            </Button>
            <Stack direction="row" spacing={2} alignItems="center">
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, next) => next && setViewMode(next)}
                size="small"
                sx={{ bgcolor: '#f1f5f9', p: 0.5, border: 'none', '& .MuiToggleButton-root': { border: 'none', borderRadius: '6px', mx: 0.5 } }}
              >
                <ToggleButton value="detail">
                  <ViewQuilt sx={{ fontSize: 20, mr: 1 }} /> Detail
                </ToggleButton>
                <ToggleButton value="table">
                  <TableChart sx={{ fontSize: 20, mr: 1 }} /> Table
                </ToggleButton>
              </ToggleButtonGroup>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              {/* <Button variant="contained" disableElevation sx={{ borderRadius: '8px', textTransform: 'none', bgcolor: '#2563eb', fontWeight: 600 }}>
                Edit Posting
              </Button> */}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* 2. HEADER SECTION */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #e2e8f0', mb: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar 
                variant="rounded"
                sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, width: 64, height: 64, borderRadius: '16px', fontSize: '1.5rem' }}
              >
                {jobTitle.charAt(0)}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
                    {jobTitle}
                  </Typography>
                  <Chip 
                    label={jobFormId?.markPriority ? "High Priority" : "Standard"} 
                    size="small"
                    sx={{ 
                      fontWeight: 700, 
                      bgcolor: jobFormId?.markPriority ? '#fef2f2' : '#f8fafc',
                      color: jobFormId?.markPriority ? '#ef4444' : '#64748b',
                      border: `1px solid ${jobFormId?.markPriority ? '#fee2e2' : '#e2e8f0'}`
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={3} mt={1} flexWrap="wrap">
                  <MetaItem icon={<WorkOutline />} text={department} />
                  <MetaItem icon={<LocationOnOutlined />} text={jobFormId?.locations?.[0]?.name} />
                  <MetaItem icon={<PeopleOutlined />} text={`${jobFormId?.openings} Openings`} />
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        {/* 3. CONDITIONAL RENDER: DETAIL VS TABLE */}
        {viewMode === 'detail' ? (
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={<InfoOutlined />} title="Job Description" />
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
                  {jobDesc}
                </Typography>

                <Divider sx={{ my: 5 }} />

                <SectionHeader icon={<HistoryOutlined />} title="Hiring Workflow" />
                <Box sx={{ mt: 3 }}>
                  {jobFormId?.hiringFlow?.map((step, i) => (
                    <Stack key={i} direction="row" spacing={3} sx={{ position: 'relative', pb: i !== jobFormId.hiringFlow.length - 1 ? 4 : 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 36, height: 36, borderRadius: '10px', bgcolor: '#2563eb', 
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: 700, zIndex: 1, boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                        }}>
                          {i + 1}
                        </Box>
                        {i !== jobFormId.hiringFlow.length - 1 && (
                          <Box sx={{ width: '2px', flexGrow: 1, bgcolor: '#e2e8f0', my: 1 }} />
                        )}
                      </Box>
                      <Box pt={0.5}>
                        <Typography variant="subtitle1" fontWeight={700} color="#1e293b">{step}</Typography>
                        <Typography variant="caption" color="#64748b">Standard assessment phase</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Typography variant="h6" fontWeight={700} mb={3} color="#0f172a">Quick Stats</Typography>
                  <Stack spacing={3}>
                    <DetailBlock label="Experience" value={experience} icon={<WorkOutline />} />
                    <DetailBlock label="Job Type" value={jobFormId?.jobType} icon={<CalendarTodayOutlined />} />
                    <DetailBlock label="Salary Range" value={`${jobFormId?.currency} ${jobFormId?.amount}`} icon={<CurrencyExchangeOutlined />} />
                    <DetailBlock label="Target Date" value={new Date(jobFormId?.targetHireDate).toLocaleDateString()} icon={<CalendarTodayOutlined />} />
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          /* TABLE VIEW: Professional Data Grid */
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Attribute</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Status/Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover><TableCell fontWeight={600}>Internal Job ID</TableCell><TableCell>JOB-{jobId?.slice(-5) || '7721'}</TableCell><TableCell><Chip label="System ID" size="small" /></TableCell></TableRow>
                <TableRow hover><TableCell fontWeight={600}>Department</TableCell><TableCell>{department}</TableCell><TableCell><Chip label="Org Unit" size="small" variant="outlined" /></TableCell></TableRow>
                <TableRow hover><TableCell fontWeight={600}>Reapply Policy</TableCell><TableCell>{jobFormId?.allowReapply ? "Allowed" : "Restricted"}</TableCell><TableCell><Chip color={jobFormId?.allowReapply ? "success" : "warning"} label="Policy" size="small" /></TableCell></TableRow>
                <TableRow hover><TableCell fontWeight={600}>Total Hiring Stages</TableCell><TableCell>{jobFormId?.hiringFlow?.length} Steps</TableCell><TableCell><Chip label="Workflow" size="small" variant="outlined" /></TableCell></TableRow>
                <TableRow hover><TableCell fontWeight={600}>Created On</TableCell><TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell><TableCell><Chip label="Timestamp" size="small" /></TableCell></TableRow>
                <TableRow hover><TableCell fontWeight={600}>Last Modified</TableCell><TableCell>{new Date(job.updatedAt).toLocaleString()}</TableCell><TableCell><Chip label="Timestamp" size="small" /></TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

// --- HELPER COMPONENTS ---

const SectionHeader = ({ icon, title }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
    <Box sx={{ color: '#2563eb', display: 'flex' }}>{icon}</Box>
    <Typography variant="h6" fontWeight={700} color="#0f172a">{title}</Typography>
  </Stack>
);

const MetaItem = ({ icon, text }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {React.cloneElement(icon, { sx: { fontSize: 20, color: '#94a3b8' } })}
    <Typography variant="body2" color="#64748b" fontWeight={500}>
      {text}
    </Typography>
  </Stack>
);

const DetailBlock = ({ label, value, icon }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ p: 1.2, bgcolor: '#f1f5f9', borderRadius: '12px', display: 'flex', color: '#64748b' }}>
      {React.cloneElement(icon, { sx: { fontSize: 22 } })}
    </Box>
    <Box>
      <Typography variant="caption" fontWeight={700} color="#94a3b8" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={700} color="#1e293b">
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default JobInfo;