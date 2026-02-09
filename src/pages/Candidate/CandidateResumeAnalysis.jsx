import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  Button,
  DialogActions,
  Paper,
  CircularProgress,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  Download as DownloadIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const CandidateResumeAnalysis = ({ 
  open, 
  onClose, 
  candidate, 
  analysisData, 
  loading = false 
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Create safe candidate data
  const getSafeCandidateData = () => {
    const candidateData = candidate || {};
    return {
      name: candidateData.name || `${candidateData.firstName || ''} ${candidateData.lastName || ''}`.trim() || 'Candidate Name',
      firstName: candidateData.firstName || 'John',
      lastName: candidateData.lastName || 'Smith',
      email: candidateData.email || 'john.smith@email.com',
      phone: candidateData.mobile || candidateData.phone || '+1 (555) 123-4567',
      currentStage: candidateData.stage?.name || candidateData.stage || 'Interview',
      experience: candidateData.experience || '5 years'
    };
  };

  // Dummy analysis data
  const getSafeAnalysisData = () => {
    const safeCandidate = getSafeCandidateData();
    return {
      candidate: safeCandidate,
      resumeAnalysis: {
        matchPercentage: 78,
        matchingScore: 8.5,
        status: 'Shortlisted',
        recommendation: 'Strong match for Senior Frontend Developer position. Excellent React and TypeScript skills with relevant industry experience.',
        skills: {
          matching: [
            { skill: 'React.js', confidence: 0.95 },
            { skill: 'TypeScript', confidence: 0.88 },
            { skill: 'JavaScript', confidence: 0.92 },
            { skill: 'HTML5', confidence: 0.85 },
            { skill: 'CSS3', confidence: 0.83 },
            { skill: 'Redux', confidence: 0.78 },
            { skill: 'Git', confidence: 0.90 },
            { skill: 'REST APIs', confidence: 0.75 },
            { skill: 'Node.js', confidence: 0.65 },
            { skill: 'Webpack', confidence: 0.70 }
          ],
          missing: [
            'GraphQL',
            'AWS',
            'Docker',
            'Jest',
            'CI/CD'
          ]
        },
        analysis: {
          overall: 'Candidate demonstrates strong expertise in modern frontend development with 5+ years of experience in React ecosystem. Shows good understanding of software architecture and best practices. Portfolio includes several production applications with significant user bases.',
          experience: '5 years of professional experience with React.js, including 2 years in senior roles. Worked on large-scale enterprise applications with 100k+ users. Led frontend team of 3 developers in previous role.',
          education: 'Bachelor of Science in Computer Science from Stanford University. Additional certifications in Frontend Development and Web Performance Optimization.'
        },
        parsedAt: '2024-01-20T10:30:00Z',
        lastUpdated: '2024-01-20T10:30:00Z'
      }
    };
  };

  // Use provided analysisData or dummy data
  const data = analysisData && analysisData.candidate 
    ? analysisData 
    : getSafeAnalysisData();

  const safeCandidate = data.candidate || getSafeCandidateData();
  const safeResumeAnalysis = data.resumeAnalysis || getSafeAnalysisData().resumeAnalysis;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Not available';
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 75) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <ThumbUpIcon color="success" />;
      case 'Rejected':
        return <ThumbDownIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const handleDownloadResume = async () => {
    try {
      // Simulate download
      setSnackbar({
        open: true,
        message: 'Starting resume download...',
        severity: 'info'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create dummy PDF blob
      const dummyPdfContent = `Resume for ${safeCandidate.name}`;
      const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${safeCandidate.name.replace(/\s+/g, '_')}_resume.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: 'Resume downloaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Download failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download resume',
        severity: 'error'
      });
    }
  };

  const handlePreviewResume = async () => {
    try {
      // Simulate preview
      setSnackbar({
        open: true,
        message: 'Opening resume preview...',
        severity: 'info'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create dummy PDF for preview
      const dummyPdfContent = `Resume Preview for ${safeCandidate.name}\n\nExperience: ${safeCandidate.experience}\nSkills: React, TypeScript, JavaScript\nEducation: BS Computer Science`;
      const blob = new Blob([dummyPdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab for preview
      window.open(url, '_blank');
      
      setSnackbar({
        open: true,
        message: 'Resume preview opened',
        severity: 'success'
      });
    } catch (error) {
      console.error('Preview failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to preview resume',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTakeAction = () => {
    setSnackbar({
      open: true,
      message: 'Candidate shortlisted successfully',
      severity: 'success'
    });
  };

  // Safely get data with defaults
  const { 
    matchPercentage = 0,
    matchingScore = 0,
    status = 'Pending Review',
    recommendation = 'Not available',
    skills = { matching: [], missing: [] },
    analysis = { overall: '', experience: '', education: '' },
    parsedAt,
    lastUpdated
  } = safeResumeAnalysis;

  const { matching = [], missing = [] } = skills;
  const { overall = '', experience = '', education = '' } = analysis;

  if (!open) return null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <AssessmentIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Resume Analysis - {safeCandidate.name}
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            bgcolor: theme.palette.grey[100],
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Tab label="Summary" icon={<AssessmentIcon />} />
          <Tab label="Skills Analysis" icon={<CodeIcon />} />
          <Tab label="Detailed Report" icon={<DescriptionIcon />} />
        </Tabs>

        <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px'
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  {/* Candidate Info */}
                  <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            mr: 2,
                            width: 56,
                            height: 56,
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}>
                            {safeCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'JS'}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {safeCandidate.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {safeCandidate.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Current Stage: {safeCandidate.currentStage}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <TimelineIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Application Status" 
                              secondary={
                                <Chip 
                                  label={status}
                                  icon={getStatusIcon(status)}
                                  size="small"
                                  color={getMatchColor(matchPercentage)}
                                  sx={{ fontWeight: 600 }}
                                />
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AccessTimeIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Last Analyzed" 
                              secondary={formatDate(parsedAt)}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <StarIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Matching Score" 
                              secondary={`${matchingScore}/10`}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Match Score */}
                  <Grid item xs={12} md={7}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <StarIcon color="primary" sx={{ mr: 1 }} />
                          Candidate Match Score
                        </Typography>
                        
                        <Box display="flex" alignItems="center" mb={3}>
                          <Box width="100%" mr={2}>
                            <LinearProgress 
                              variant="determinate" 
                              value={matchPercentage} 
                              sx={{ 
                                height: 12, 
                                borderRadius: 6,
                                backgroundColor: theme.palette.grey[200]
                              }}
                              color={getMatchColor(matchPercentage)}
                            />
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {matchPercentage}%
                          </Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ 
                          p: 2, 
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: 2,
                          mb: 2
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 18 }} />
                            Recommendation
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {recommendation}
                          </Typography>
                        </Paper>

                        <Box display="flex" gap={2}>
                          <Button 
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<VisibilityIcon />}
                            onClick={handlePreviewResume}
                          >
                            Preview Resume
                          </Button>
                          <Button 
                            variant="outlined"
                            color="primary"
                            fullWidth
                            startIcon={<DownloadIcon />}
                            onClick={handleDownloadResume}
                          >
                            Download Resume
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={3}>
                  {/* Matching Skills */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Badge badgeContent={matching.length} color="success" sx={{ mr: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                              Matching Skills ({matching.length})
                            </Typography>
                          </Badge>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {matching.length > 0 ? (
                          <Grid container spacing={1}>
                            {matching.map((skill, index) => (
                              <Grid item key={index} xs={6} sm={4}>
                                <Tooltip title={`Confidence: ${Math.round((skill.confidence || 0.8) * 100)}%`}>
                                  <Chip
                                    label={skill.skill}
                                    size="medium"
                                    color="success"
                                    variant="outlined"
                                    sx={{ 
                                      fontWeight: 500,
                                      width: '100%'
                                    }}
                                  />
                                </Tooltip>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                            No matching skills found
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Missing Skills */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Badge badgeContent={missing.length} color="error" sx={{ mr: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              <WarningIcon color="error" sx={{ mr: 1 }} />
                              Missing Skills ({missing.length})
                            </Typography>
                          </Badge>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {missing.length > 0 ? (
                          <Grid container spacing={1}>
                            {missing.map((skill, index) => (
                              <Grid item key={index} xs={6} sm={4}>
                                <Chip
                                  label={skill}
                                  size="medium"
                                  color="error"
                                  variant="outlined"
                                  sx={{ 
                                    fontWeight: 500,
                                    width: '100%'
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                            No missing skills identified
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                      Detailed Analysis Report
                    </Typography>
                    
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      mb: 3, 
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 2
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Overall Assessment
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {overall}
                      </Typography>
                    </Paper>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ 
                          p: 3, 
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: 2,
                          height: '100%'
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <BuildIcon color="primary" sx={{ mr: 1 }} />
                            Experience Analysis
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {experience}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ 
                          p: 3, 
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: 2,
                          height: '100%'
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <SchoolIcon color="primary" sx={{ mr: 1 }} />
                            Education Analysis
                          </Typography>
                          <Typography variant="body1">
                            {education}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleTakeAction}
          >
            Shortlist Candidate
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CandidateResumeAnalysis;