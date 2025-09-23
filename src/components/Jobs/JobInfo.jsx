
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
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
  Dialog, // Added Button component
} from "@mui/material";
import { ViewModule, ViewList, ArrowBack } from "@mui/icons-material"; // Added ArrowBack icon
// import jobService from "../../services/jobService";
import { getJobById } from "../../services/Jobs/jobsService";

import { useSelector } from "react-redux";

// Function to strip HTML tags and clean up text
const stripHtml = (html) => {
  if (!html) return '';
  
  // Replace <br> tags with newlines
  let text = html.replace(/<br\s*\/?>/gi, '\n');
  // Replace <p> tags with newlines
  text = text.replace(/<p\b[^>]*>/gi, '\n');
  // Remove all other HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  // Replace multiple spaces with single space
  text = text.replace(/\s+/g, ' ');
  // Replace multiple newlines with single newline
  text = text.replace(/\n+/g, '\n');
  // Trim whitespace
  return text.trim();
};

const InfoItem = ({ label, value }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
      {value || "—"}
    </Typography>
  </Box>
);

const JobInfo = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate(); // Initialize navigate function
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("card");

  useEffect(() => {
    const fetchJobById = async () => {
      try {
        const response = await getJobById(jobId);
        // Clean the job description before setting state
        const jobData = response.job;
        if (jobData.jobDesc) {
          jobData.jobDesc = stripHtml(jobData.jobDesc);
        }
        setJob(jobData);
        setError(null);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error.message || "Failed to load job data");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJobById();
  }, [jobId]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleBack = () => {
    navigate(-1); // Go back one step in history
  };

  const handleVendor=()=>{

  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography align="center" mt={6} color="error">
          {error}
        </Typography>
      </Box>
      
      
      
    );
  }

  if (!job) {
    return (
      <Box p={2}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography align="center" mt={6} color="error">
          Job not found.
        </Typography>
      </Box>
    );
  }

  const {
    jobTitle,
    department,
    experience,
    jobDesc,
    jobFormId,
    createdAt,
    updatedAt,
  } = job;

  return (
    <Box p={2} maxWidth="full" mx="auto">
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      {/* <Box display="flex" justifyContent="flex-end" sx={{mb:4}}>
        <Button variant="outlined" onClick={handleVendor}>
          Vendors
        </Button>
      </Box> */}

      <Dialog>
        
      </Dialog>
      
      <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
        <Stack spacing={3}>
          {/* Main Heading */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                JOB OVERVIEW
              </Typography>
              <Typography variant="h6" color="text.primary">
                {jobTitle}
              </Typography>
            </Box>

            <Box>
              <IconButton
                color={view === "table" ? "primary" : "default"}
                onClick={() => handleViewChange("table")}
              >
                <ViewList /> 
              </IconButton>
              <IconButton
                color={view === "card" ? "primary" : "default"}
                onClick={() => handleViewChange("card")}
              >
                <ViewModule /> 
              </IconButton>
            </Box>
          </Box>

          <Divider />

          {view === "card" ? (
            // Card View
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Basic Info
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <InfoItem label="Department" value={department} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem label="Experience" value={experience} />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem label="Job Description" value={jobDesc} />
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="subtitle1" fontWeight={600} mt={2} gutterBottom>
                Job Details
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <InfoItem 
                    label="Location" 
                    value={jobFormId?.locations?.map(loc => loc.name).join(", ")} 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem label="Job Type" value={jobFormId?.jobType} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem label="Openings" value={jobFormId?.openings} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    label="Target Hire Date"
                    value={new Date(jobFormId?.targetHireDate).toLocaleDateString()}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="subtitle1" fontWeight={600} mt={2} gutterBottom>
                Compensation & Options
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    label="Compensation"
                    value={`${jobFormId?.currency || ""} ${jobFormId?.amount || ""}`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    label="Reapply Allowed"
                    value={jobFormId?.allowReapply ? "Yes" : "No"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    label="Priority"
                    value={jobFormId?.markPriority ? "Yes" : "No"}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="subtitle1" fontWeight={600} mt={2} gutterBottom>
                Hiring Flow
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {jobFormId?.hiringFlow?.length > 0 ? (
                  jobFormId.hiringFlow.map((stage, index) => (
                    <Chip key={index} label={stage} color="primary" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hiring stages defined.
                  </Typography>
                )}
              </Stack>

              <Divider />
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                JOB INFO 
              </Typography>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Field</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Job Title</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{jobTitle}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Department</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{department}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Experience</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{experience}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Job Description</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd", whiteSpace: 'pre-line' }}>
                      {jobDesc}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Location</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {jobFormId?.locations?.map(loc => loc.name).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Job Type</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{jobFormId?.jobType}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Openings</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{jobFormId?.openings}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Target Hire Date</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {new Date(jobFormId?.targetHireDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Compensation</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {`${jobFormId?.currency || ""} ${jobFormId?.amount || ""}`}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Reapply Allowed</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {jobFormId?.allowReapply ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Priority</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {jobFormId?.markPriority ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Hiring Flow</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {jobFormId?.hiringFlow?.length > 0 ? (
                        jobFormId.hiringFlow.join(", ")
                      ) : (
                        "No stages defined."
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          )}

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(createdAt).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(updatedAt).toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default JobInfo;