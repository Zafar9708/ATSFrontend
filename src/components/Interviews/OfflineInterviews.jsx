import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Paper, Avatar, CircularProgress,
  Chip, Button, IconButton, Divider, useTheme, styled, Collapse,
  List, ListItem, ListItemIcon, ListItemText, Tooltip, Badge
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  MoreVert as MoreIcon,
  Notes as NotesIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  EventNote as EventNoteIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// Dummy data for offline interviews
const DUMMY_OFFLINE_INTERVIEWS = [
  {
    _id: "68b54487c5dff0026666eab1",
    candidate: {
      id: "68b368fefc43b0e3ade43035",
      name: "Michael Johnson",
      email: "michael.johnson@email.com"
    },
    interviewers: [
      {
        _id: "6891b8e1e03d7b6b49f32ea1",
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        role: "Technical Director"
      },
      {
        _id: "6891b8e1e03d7b6b49f32ea2",
        name: "Robert Chen",
        email: "robert.chen@company.com",
        role: "Engineering Manager"
      }
    ],
    date: "2024-12-20T00:00:00.000Z",
    startTime: "10:00",
    duration: 90,
    timezone: "UTC+05:30",
    location: {
      address: "123 Tech Park, Sector 5",
      building: "Innovation Tower",
      floor: "8th Floor",
      room: "Conference Room B",
      city: "Bangalore",
      country: "India"
    },
    platform: "in_person",
    meetingLink: null,
    templateUsed: {
      _id: "683fef3fdad9b531c3f24efb",
      name: "On-site Interview"
    },
    subject: "On-site Interview Invitation - Michael Johnson",
    emailBody: "Dear Michael Johnson,\n\nWe are pleased to invite you for an on-site interview at our Bangalore office.\n\n**Interview Details:**\n📅 Date: December 20, 2024\n⏰ Time: 10:00 AM (IST)\n⏱ Duration: 1.5 hours\n📍 Location: Innovation Tower, 8th Floor, Conference Room B\n🗺️ Address: 123 Tech Park, Sector 5, Bangalore\n👥 Interviewers: Sarah Wilson, Robert Chen\n\nPlease bring your resume and any relevant portfolio items.\n\nBest regards,\nHiring Team",
    notes: "Candidate has 8 years of experience. Focus on system architecture and leadership skills. Provide office map and visitor pass at reception.",
    scheduledBy: "recruiter@company.com",
    tenantId: "68b3444b14385f12118874c1",
    status: "scheduled",
    jobId: {
      _id: "68b367203626ac3acdbf0a76",
      jobName: "ARCH001",
      jobTitle: "Senior Architect"
    },
    createdAt: "2024-12-10T09:45:30.150Z",
    __v: 0,
    feedbackStatus: {
      submitted: 0,
      total: 2
    }
  },
  {
    _id: "68b54487c5dff0026666eab2",
    candidate: {
      id: "68b368fefc43b0e3ade43036",
      name: "Emma Davis",
      email: "emma.davis@email.com"
    },
    interviewers: [
      {
        _id: "6891b8e1e03d7b6b49f32ea3",
        name: "David Miller",
        email: "david.miller@company.com",
        role: "HR Director"
      }
    ],
    date: "2024-12-12T00:00:00.000Z",
    startTime: "14:30",
    duration: 60,
    timezone: "UTC-05:00",
    location: {
      address: "456 Corporate Avenue",
      building: "Main Office Building",
      floor: "3rd Floor",
      room: "HR Conference Room",
      city: "New York",
      country: "USA"
    },
    platform: "in_person",
    meetingLink: null,
    templateUsed: {
      _id: "683fef3fdad9b531c3f24efc",
      name: "Final Round On-site"
    },
    subject: "Final Round On-site Interview - Emma Davis",
    emailBody: "Hello Emma Davis,\n\nCongratulations on reaching the final round! We'd like to invite you for an in-person interview at our New York office.\n\n**Interview Details:**\n📅 Date: December 12, 2024\n⏰ Time: 2:30 PM (EST)\n⏱ Duration: 1 hour\n📍 Location: Main Office Building, 3rd Floor\n🗺️ Address: 456 Corporate Avenue, New York\n👥 Interviewer: David Miller\n\nPlease arrive 15 minutes early for security clearance.\n\nLooking forward to meeting you!\n\nBest regards,\nHR Team",
    notes: "Final interview with HR director. Discuss compensation package and benefits. Candidate should meet with team members after formal interview.",
    scheduledBy: "hr.director@company.com",
    tenantId: "68b3444b14385f12118874c1",
    status: "completed",
    jobId: {
      _id: "68b367203626ac3acdbf0a77",
      jobName: "HR004",
      jobTitle: "Senior HR Manager"
    },
    createdAt: "2024-12-01T11:20:45.300Z",
    __v: 0,
    feedbackStatus: {
      submitted: 1,
      total: 1
    }
  },
  {
    _id: "68b54487c5dff0026666eab3",
    candidate: {
      id: "68b368fefc43b0e3ade43037",
      name: "Alex Thompson",
      email: "alex.thompson@email.com"
    },
    interviewers: [
      {
        _id: "6891b8e1e03d7b6b49f32ea4",
        name: "Lisa Brown",
        email: "lisa.brown@company.com",
        role: "Design Lead"
      },
      {
        _id: "6891b8e1e03d7b6b49f32ea5",
        name: "Mark Wilson",
        email: "mark.wilson@company.com",
        role: "Product Manager"
      },
      {
        _id: "6891b8e1e03d7b6b49f32ea6",
        name: "Rachel Green",
        email: "rachel.green@company.com",
        role: "Creative Director"
      }
    ],
    date: "2024-12-25T00:00:00.000Z",
    startTime: "11:00",
    duration: 120,
    timezone: "UTC+01:00",
    location: {
      address: "789 Design Street",
      building: "Creative Hub",
      floor: "Ground Floor",
      room: "Design Studio",
      city: "London",
      country: "UK"
    },
    platform: "in_person",
    meetingLink: null,
    templateUsed: {
      _id: "683fef3fdad9b531c3f24efd",
      name: "Design Portfolio Review"
    },
    subject: "Design Portfolio Review - Alex Thompson",
    emailBody: "Dear Alex Thompson,\n\nWe're excited to invite you for a design portfolio review at our London studio.\n\n**Interview Details:**\n📅 Date: December 25, 2024\n⏰ Time: 11:00 AM (GMT)\n⏱ Duration: 2 hours\n📍 Location: Creative Hub, Ground Floor\n🗺️ Address: 789 Design Street, London\n👥 Interview Panel: Lisa Brown, Mark Wilson, Rachel Green\n\nPlease bring your portfolio (digital or physical) and be prepared for a design challenge.\n\nBest regards,\nDesign Team",
    notes: "Portfolio review and design challenge. Provide drawing materials and workspace. Candidate should present 3-5 best projects.",
    scheduledBy: "design@company.com",
    tenantId: "68b3444b14385f12118874c1",
    status: "scheduled",
    jobId: {
      _id: "68b367203626ac3acdbf0a78",
      jobName: "DSGN001",
      jobTitle: "Senior UI/UX Designer"
    },
    createdAt: "2024-12-15T15:10:20.500Z",
    __v: 0,
    feedbackStatus: {
      submitted: 0,
      total: 3
    }
  },
  {
    _id: "68b54487c5dff0026666eab4",
    candidate: {
      id: "68b368fefc43b0e3ade43038",
      name: "Sophia Martinez",
      email: "sophia.martinez@email.com"
    },
    interviewers: [
      {
        _id: "6891b8e1e03d7b6b49f32ea7",
        name: "James Wilson",
        email: "james.wilson@company.com",
        role: "CTO"
      }
    ],
    date: "2024-12-08T00:00:00.000Z",
    startTime: "09:00",
    duration: 45,
    timezone: "UTC+08:00",
    location: {
      address: "101 Innovation Road",
      building: "Tech Center",
      floor: "12th Floor",
      room: "Executive Suite",
      city: "Singapore",
      country: "Singapore"
    },
    platform: "in_person",
    meetingLink: null,
    templateUsed: {
      _id: "683fef3fdad9b531c3f24efe",
      name: "Executive Interview"
    },
    subject: "Executive Interview Invitation - Sophia Martinez",
    emailBody: "Hello Sophia Martinez,\n\nWe would like to invite you for an executive interview at our Singapore office.\n\n**Interview Details:**\n📅 Date: December 8, 2024\n⏰ Time: 9:00 AM (SGT)\n⏱ Duration: 45 minutes\n📍 Location: Tech Center, 12th Floor\n🗺️ Address: 101 Innovation Road, Singapore\n👥 Interviewer: James Wilson (CTO)\n\nThis will be a strategic discussion about leadership and vision.\n\nBest regards,\nExecutive Office",
    notes: "Executive interview with CTO. Focus on strategic thinking and leadership philosophy. Coffee will be served.",
    scheduledBy: "executive.assistant@company.com",
    tenantId: "68b3444b14385f12118874c1",
    status: "cancelled",
    jobId: {
      _id: "68b367203626ac3acdbf0a79",
      jobName: "EXEC001",
      jobTitle: "VP of Engineering"
    },
    createdAt: "2024-11-30T08:45:15.750Z",
    __v: 0,
    feedbackStatus: {
      submitted: 0,
      total: 1
    }
  }
];

const InterviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  borderLeft: `4px solid ${theme.palette.secondary.main}`,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
    borderColor: theme.palette.primary.main
  }
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  textTransform: 'capitalize',
  backgroundColor: status === 'scheduled' 
    ? `${theme.palette.info.light}20`
    : status === 'completed'
    ? `${theme.palette.success.light}20`
    : `${theme.palette.warning.light}20`,
  color: status === 'scheduled' 
    ? theme.palette.info.dark
    : status === 'completed'
    ? theme.palette.success.dark
    : theme.palette.warning.dark,
}));

const OfflineInterviews = ({ searchTerm, statusFilter, selectedDate }) => {
  const [interviews, setInterviews] = useState(DUMMY_OFFLINE_INTERVIEWS);
  const [loading, setLoading] = useState(false); // Changed to false since we have dummy data
  const [error, setError] = useState(null);
  const [expandedInterview, setExpandedInterview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleExpandClick = (interviewId) => {
    setExpandedInterview(expandedInterview === interviewId ? null : interviewId);
  };

  const filterInterviews = () => {
    let filtered = [...interviews];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(interview => 
        interview.candidate?.name?.toLowerCase().includes(term) ||
        interview.candidate?.email?.toLowerCase().includes(term) ||
        interview.interviewers?.some(i => i.name?.toLowerCase().includes(term)) ||
        interview.scheduledBy?.toLowerCase().includes(term) ||
        interview.jobId?.jobTitle?.toLowerCase().includes(term) ||
        interview.jobId?.jobName?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(interview => interview.status === statusFilter);
    }

    // Apply date filter
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filterDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(interview => {
        const interviewDate = new Date(interview.date);
        interviewDate.setHours(0, 0, 0, 0);
        return interviewDate.getTime() === filterDate.getTime();
      });
    }

    return filtered;
  };

  const filteredInterviews = filterInterviews();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        textAlign: 'center',
        p: 3
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => window.location.reload()}
          sx={{ borderRadius: 2, px: 4 }}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Go back">
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ 
                mr: 2,
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected
                }
              }}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Offline Interviews
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Showing {filteredInterviews.length} of {interviews.length} interviews
          </Typography>
          <Badge 
            badgeContent={interviews.length} 
            color="secondary"
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: '0.9rem', 
                height: 26, 
                minWidth: 26,
                borderRadius: 13,
                padding: '0 8px'
              } 
            }}
          >
            
          </Badge>
        </Box>
      </Box>

      {filteredInterviews.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Box sx={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            backgroundColor: theme.palette.action.hover,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}>
            <LocationIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
          </Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {interviews.length === 0 ? 'No Offline Interviews Scheduled' : 'No Interviews Match Filters'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, margin: '0 auto' }}>
            {interviews.length === 0 
              ? "You haven't scheduled any offline interviews yet. Click below to schedule an in-person interview."
              : "No offline interviews match your current filters. Try adjusting your search criteria."}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/interviews/schedule-offline')}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Schedule Offline Interview
          </Button>
        </Paper>
      ) : (
        <Box>
          {filteredInterviews.map((interview) => (
            <InterviewCard key={interview._id} elevation={2}>
              <CardContent>
               <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 2
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {interview.candidate?.name || 'Candidate'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                      {interview.candidate?.email || 'No email'}
                    </Typography>
                    {interview.jobId && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                          {interview.jobId.jobName || 'No job name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                          {interview.jobId.jobTitle || 'No job title'}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <StatusBadge 
                      status={interview.status} 
                      label={interview.status} 
                      size="medium"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleExpandClick(interview._id)}
                      sx={{
                        transition: 'transform 0.3s',
                        transform: expandedInterview === interview._id ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {expandedInterview === interview._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3, 
                  mb: 2,
                  '& > div': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}>
                  <Tooltip title="Interview Date">
                    <Box>
                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        {formatDate(interview.date)}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Start Time">
                    <Box>
                      <TimeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        {formatTime(interview.startTime)} ({interview.timezone || 'UTC'})
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Duration">
                    <Box>
                      <ScheduleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        {interview.duration} minutes
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Location">
                    <Box>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        {interview.location?.city || 'No location'}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>

                <Collapse in={expandedInterview === interview._id} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pl: 1, pr: 1 }}>
                    <Divider sx={{ mb: 2 }} />
                    
                    {/* Job Details Section */}
                    {interview.jobId && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <WorkIcon sx={{ mr: 1 }} /> Job Details
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          mb: 3,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.default
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {interview.jobId.jobTitle || 'No job specified'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {interview.jobId.jobName || 'No job name'}
                          </Typography>
                          {interview.jobId._id && (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => navigate(`/jobs/${interview.jobId._id}`)}
                              sx={{
                                alignSelf: 'flex-start',
                                textTransform: 'none',
                                color: theme.palette.primary.main
                              }}
                            >
                              View Job Details
                            </Button>
                          )}
                        </Box>
                      </>
                    )}

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ mr: 1 }} /> Interviewers
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      mb: 3 
                    }}>
                      {interview.interviewers?.map((interviewer) => (
                        <Chip
                          key={interviewer._id}
                          avatar={<Avatar alt={interviewer.name} sx={{ width: 24, height: 24 }}>{interviewer.name?.charAt(0) || '?'}</Avatar>}
                          label={interviewer.name || 'Interviewer'}
                          variant="outlined"
                          size="medium"
                          sx={{ 
                            borderRadius: 1,
                            backgroundColor: theme.palette.action.hover
                          }}
                          onClick={() => console.log('View interviewer profile')}
                        />
                      ))}
                    </Box>

                    {interview.location && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1 }} /> Location Details
                        </Typography>
                        <List dense sx={{ mb: 3 }}>
                          <ListItem>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <LocationIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Address" 
                              secondary={interview.location.address} 
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          {interview.location.building && (
                            <ListItem>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <LocationIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Building" 
                                secondary={interview.location.building} 
                                secondaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          )}
                          {interview.location.floor && (
                            <ListItem>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <LocationIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Floor" 
                                secondary={`${interview.location.floor}, ${interview.location.room || ''}`} 
                                secondaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          )}
                          <ListItem>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <LocationIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="City/Country" 
                              secondary={`${interview.location.city}, ${interview.location.country}`} 
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>
                      </>
                    )}

                    {interview.notes && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <NotesIcon sx={{ mr: 1 }} /> Notes
                        </Typography>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.default,
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {interview.notes}
                        </Paper>
                      </>
                    )}

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <EventNoteIcon sx={{ mr: 1 }} /> Email Details
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <DescriptionIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Subject" 
                          secondary={interview.subject || 'No subject'} 
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <DescriptionIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email Body" 
                          secondary={
                            <Box 
                              component="div" 
                              sx={{ 
                                maxHeight: 100, 
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap'
                              }}
                            >
                              {interview.emailBody || 'No email body'}
                            </Box>
                          } 
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </List>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Scheduled by: {interview.scheduledBy || 'Unknown'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EmailIcon />}
                          onClick={() => console.log('Resend email')}
                          sx={{ borderRadius: 2 }}
                        >
                          Resend
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          endIcon={<MoreIcon />}
                          onClick={() => navigate(`/interviews/offline/${interview._id}`)}
                          sx={{ borderRadius: 2 }}
                        >
                          Details
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
            </InterviewCard>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OfflineInterviews;