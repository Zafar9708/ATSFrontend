

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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

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
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInterview, setExpandedInterview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token=localStorage.getItem("token")
        const response = await axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/offline/interviews',{
            headers:{
                Authorization:`Bearer ${token}`,
               'ngrok-skip-browser-warning': 'true'
            }
        });
        setInterviews(response.data.data);
      } catch (err) {
        setError('Failed to fetch offline interviews. Please try again.');
        console.error('Error fetching offline interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

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
        interview.scheduledBy?.toLowerCase().includes(term)
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
                        {interview.location?.address || 'No address'}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>

                <Collapse in={expandedInterview === interview._id} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pl: 1, pr: 1 }}>
                    <Divider sx={{ mb: 2 }} />
                    
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
                                secondary={interview.location.floor} 
                                secondaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          )}
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

                    {interview.emailDetails && (
                      <>
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
                              secondary={interview.emailDetails.subject} 
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
                                  {interview.emailDetails.body}
                                </Box>
                              } 
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>
                      </>
                    )}

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Scheduled by: {interview.scheduledBy}
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