

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box, Typography, Card, CardContent, Paper, Avatar, CircularProgress,
//   Chip, Button, IconButton, Divider, useTheme, styled, Collapse,
//   List, ListItem, ListItemIcon, ListItemText, Tooltip, Badge
// } from '@mui/material';
// import {
//   ArrowBack as BackIcon,
//   CalendarToday as CalendarIcon,
//   AccessTime as TimeIcon,
//   People as PeopleIcon,
//   VideoCall as VideoIcon,
//   Email as EmailIcon,
//   MoreVert as MoreIcon,
//   Notes as NotesIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   Person as PersonIcon,
//   Schedule as ScheduleIcon,
//   Language as LanguageIcon,
//   Description as DescriptionIcon,
//   EventNote as EventNoteIcon,
//   Work as WorkIcon,
//   Assignment as AssignmentIcon,
//   Refresh as RefreshIcon
// } from '@mui/icons-material';
// import axios from 'axios';

// const InterviewCard = styled(Card)(({ theme }) => ({
//   marginBottom: theme.spacing(3),
//   transition: 'all 0.3s ease',
//   borderLeft: `4px solid ${theme.palette.primary.main}`,
//   '&:hover': {
//     transform: 'translateY(-3px)',
//     boxShadow: theme.shadows[6],
//     borderColor: theme.palette.secondary.main
//   }
// }));

// const StatusBadge = styled(Chip)(({ theme, status }) => ({
//   fontWeight: 600,
//   textTransform: 'capitalize',
//   backgroundColor: status === 'scheduled'
//     ? `${theme.palette.info.light}20`
//     : status === 'completed'
//       ? `${theme.palette.success.light}20`
//       : `${theme.palette.warning.light}20`,
//   color: status === 'scheduled'
//     ? theme.palette.info.dark
//     : status === 'completed'
//       ? theme.palette.success.dark
//       : theme.palette.warning.dark,
// }));

// const PlatformIcon = ({ platform }) => {
//   switch (platform) {
//     case 'google_meet':
//       return <VideoIcon color="error" />;
//     case 'zoom':
//       return <VideoIcon color="primary" />;
//     case 'microsoft_teams':
//       return <VideoIcon color="info" />;
//     default:
//       return <VideoIcon />;
//   }
// };

// const OnlineInterviews = ({ searchTerm, statusFilter, selectedDate }) => {
//   const [interviews, setInterviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedInterview, setExpandedInterview] = useState(null);
//   const navigate = useNavigate();
//   const theme = useTheme();

//   useEffect(() => {
//     const fetchInterviews = async () => {
//       try {
//         const token=localStorage.getItem("token")
//         const response = await axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/interviews/interviews/schedule',{
//             headers:{
//                 Authorization:`Bearer ${token}`
//             }
//         });
//         setInterviews(response.data.data);
//       } catch (err) {
//         setError('Failed to fetch interviews. Please try again.');
//         console.error('Error fetching interviews:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInterviews();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatTime = (timeString) => {
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const handleExpandClick = (interviewId) => {
//     setExpandedInterview(expandedInterview === interviewId ? null : interviewId);
//   };

//   const filterInterviews = () => {
//     let filtered = [...interviews];
  
//     // Apply search term filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(interview => (
//         interview.candidate?.name?.toLowerCase().includes(term) ||
//         interview.candidate?.email?.toLowerCase().includes(term) ||
//         interview.interviewers?.some(i => i.name?.toLowerCase().includes(term)) ||
//         interview.scheduledBy?.toLowerCase().includes(term) ||
//         (interview.jobId?.jobName && interview.jobId.jobName.toLowerCase().includes(term)) ||
//         (interview.jobId?.jobTitle && interview.jobId.jobTitle.toLowerCase().includes(term))
//       ));
//     }
  
//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(interview => interview.status === statusFilter);
//     }
  
//     // Apply date filter
//     if (selectedDate) {
//       const filterDate = new Date(selectedDate);
//       filterDate.setHours(0, 0, 0, 0);
      
//       filtered = filtered.filter(interview => {
//         const interviewDate = new Date(interview.date);
//         interviewDate.setHours(0, 0, 0, 0);
//         return interviewDate.getTime() === filterDate.getTime();
//       });
//     }
  
//     return filtered;
//   };

//   const filteredInterviews = filterInterviews();

//   if (loading) {
//     return (
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '60vh'
//       }}>
//         <CircularProgress size={60} thickness={4} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '50vh',
//         textAlign: 'center',
//         p: 3
//       }}>
//         <Typography variant="h6" color="error" sx={{ mb: 2 }}>
//           {error}
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => window.location.reload()}
//           startIcon={<RefreshIcon />}
//           sx={{ borderRadius: 2, px: 4 }}
//         >
//           Refresh
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
//       <Box sx={{
//         display: 'flex',
//         alignItems: 'center',
//         mb: 4,
//         justifyContent: 'space-between',
//         flexWrap: 'wrap',
//         gap: 2
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Tooltip title="Go back">
//             <IconButton
//               onClick={() => navigate(-1)}
//               sx={{
//                 mr: 2,
//                 backgroundColor: theme.palette.action.hover,
//                 '&:hover': {
//                   backgroundColor: theme.palette.action.selected
//                 }
//               }}
//             >
//               <BackIcon />
//             </IconButton>
//           </Tooltip>
//           <Typography variant="h4" sx={{ fontWeight: 700 }}>
//             Interview Schedule
//           </Typography>
//         </Box>
//         <Typography variant="subtitle1" color="text.secondary">
//           Showing {filteredInterviews.length} of {interviews.length} interviews
//         </Typography>
//       </Box>

//       {filteredInterviews.length === 0 ? (
//         <Paper
//           elevation={0}
//           sx={{
//             p: 6,
//             textAlign: 'center',
//             borderRadius: 3,
//             backgroundColor: theme.palette.background.paper,
//             border: `1px dashed ${theme.palette.divider}`
//           }}
//         >
//           <Box sx={{
//             width: 100,
//             height: 100,
//             borderRadius: '50%',
//             backgroundColor: theme.palette.action.hover,
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             mb: 3
//           }}>
//             <CalendarIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
//           </Box>
//           <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
//             No Interviews Found
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, margin: '0 auto' }}>
//             {interviews.length === 0
//               ? "You haven't scheduled any interviews yet. Click below to schedule your first interview."
//               : "No interviews match your current filters. Try adjusting your search criteria."}
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             startIcon={<CalendarIcon />}
//             onClick={() => navigate('/interviews/schedule')}
//             sx={{ borderRadius: 2, px: 4, py: 1.5 }}
//           >
//             Schedule Interview
//           </Button>
//         </Paper>
//       ) : (
//         <Box>
//           {filteredInterviews.map((interview) => (
//             <InterviewCard key={interview._id} elevation={2}>
//               <CardContent>
//                 <Box sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                   flexWrap: 'wrap',
//                   gap: 2,
//                   mb: 2
//                 }}>
//                   <Box>
//                     <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
//                       {interview.candidate?.name || 'No candidate name'}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
//                       <EmailIcon fontSize="small" sx={{ mr: 1 }} />
//                       {interview.candidate?.email || 'No email'}
//                     </Typography>
//                     {interview.jobId && (
//                       <>
//                         <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                           <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
//                           {interview.jobId.jobName || 'No job name'}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                           <WorkIcon fontSize="small" sx={{ mr: 1 }} />
//                           {interview.jobId.jobTitle || 'No job title'}
//                         </Typography>
//                       </>
//                     )}
//                   </Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <StatusBadge
//                       status={interview.status}
//                       label={interview.status}
//                       size="medium"
//                     />
//                     <IconButton
//                       size="small"
//                       onClick={() => handleExpandClick(interview._id)}
//                       sx={{
//                         transition: 'transform 0.3s',
//                         transform: expandedInterview === interview._id ? 'rotate(180deg)' : 'none'
//                       }}
//                     >
//                       {expandedInterview === interview._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                     </IconButton>
//                   </Box>
//                 </Box>

//                 <Box sx={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: 3,
//                   mb: 2,
//                   '& > div': {
//                     display: 'flex',
//                     alignItems: 'center'
//                   }
//                 }}>
//                   <Tooltip title="Interview Date">
//                     <Box>
//                       <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                       <Typography variant="body2">
//                         {formatDate(interview.date)}
//                       </Typography>
//                     </Box>
//                   </Tooltip>
//                   <Tooltip title="Start Time">
//                     <Box>
//                       <TimeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                       <Typography variant="body2">
//                         {formatTime(interview.startTime)} ({interview.timezone})
//                       </Typography>
//                     </Box>
//                   </Tooltip>
//                   <Tooltip title="Duration">
//                     <Box>
//                       <ScheduleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                       <Typography variant="body2">
//                         {interview.duration} minutes
//                       </Typography>
//                     </Box>
//                   </Tooltip>
//                   <Tooltip title="Platform">
//                     <Box>
//                       <PlatformIcon platform={interview.platform} sx={{ mr: 1 }} />
//                       <Typography variant="body2">
//                         {interview.platform.replace('_', ' ')}
//                       </Typography>
//                     </Box>
//                   </Tooltip>
//                 </Box>

//                 <Collapse in={expandedInterview === interview._id} timeout="auto" unmountOnExit>
//                   <Box sx={{ mt: 2, pl: 1, pr: 1 }}>
//                     <Divider sx={{ mb: 2 }} />

//                     {/* Job Details Section */}
//                     {interview.jobId && (
//                       <>
//                         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
//                           <WorkIcon sx={{ mr: 1 }} /> Job Details
//                         </Typography>
//                         <Box sx={{
//                           display: 'flex',
//                           flexDirection: 'column',
//                           gap: 1,
//                           mb: 3,
//                           p: 2,
//                           borderRadius: 2,
//                           backgroundColor: theme.palette.background.default
//                         }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             {interview.jobId.jobTitle || 'No job specified'}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {interview.jobId.jobName || 'No job name'}
//                           </Typography>
//                           {interview.jobId._id && (
//                             <Button
//                               size="small"
//                               variant="text"
//                               onClick={() => navigate(`/jobs/${interview.jobId._id}`)}
//                               sx={{
//                                 alignSelf: 'flex-start',
//                                 textTransform: 'none',
//                                 color: theme.palette.primary.main
//                               }}
//                             >
//                               View Job Details
//                             </Button>
//                           )}
//                         </Box>
//                       </>
//                     )}

//                     <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
//                       <PeopleIcon sx={{ mr: 1 }} /> Interviewers
//                     </Typography>
//                     <Box sx={{
//                       display: 'flex',
//                       flexWrap: 'wrap',
//                       gap: 1,
//                       mb: 3
//                     }}>
//                       {interview.interviewers?.map((interviewer) => (
//                         <Chip
//                           key={interviewer._id}
//                           avatar={<Avatar alt={interviewer.name} sx={{ width: 24, height: 24 }}>{interviewer.name.charAt(0)}</Avatar>}
//                           label={interviewer.name}
//                           variant="outlined"
//                           size="medium"
//                           sx={{
//                             borderRadius: 1,
//                             backgroundColor: theme.palette.action.hover
//                           }}
//                           onClick={() => console.log('View interviewer profile')}
//                         />
//                       ))}
//                     </Box>

//                     {interview.meetingLink && (
//                       <>
//                         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
//                           <VideoIcon sx={{ mr: 1 }} /> Meeting Link
//                         </Typography>
//                         <Button
//                           variant="outlined"
//                           startIcon={<PlatformIcon platform={interview.platform} />}
//                           href={interview.meetingLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           sx={{
//                             mb: 3,
//                             borderRadius: 2,
//                             textTransform: 'none'
//                           }}
//                         >
//                           Join {interview.platform.replace('_', ' ')} Meeting
//                         </Button>
//                       </>
//                     )}

//                     {interview.notes && (
//                       <>
//                         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
//                           <NotesIcon sx={{ mr: 1 }} /> Notes
//                         </Typography>
//                         <Paper
//                           elevation={0}
//                           sx={{
//                             p: 2,
//                             mb: 3,
//                             borderRadius: 2,
//                             backgroundColor: theme.palette.background.default,
//                             whiteSpace: 'pre-wrap'
//                           }}
//                         >
//                           {interview.notes}
//                         </Paper>
//                       </>
//                     )}

//                     <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
//                       <EventNoteIcon sx={{ mr: 1 }} /> Email Details
//                     </Typography>
//                     <List dense sx={{ mb: 2 }}>
//                       <ListItem>
//                         <ListItemIcon sx={{ minWidth: 36 }}>
//                           <DescriptionIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText
//                           primary="Subject"
//                           secondary={interview.subject}
//                           secondaryTypographyProps={{ variant: 'body2' }}
//                         />
//                       </ListItem>
//                       <ListItem>
//                         <ListItemIcon sx={{ minWidth: 36 }}>
//                           <DescriptionIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText
//                           primary="Email Body"
//                           secondary={
//                             <Box
//                               component="div"
//                               sx={{
//                                 maxHeight: 100,
//                                 overflow: 'auto',
//                                 whiteSpace: 'pre-wrap'
//                               }}
//                             >
//                               {interview.emailBody}
//                             </Box>
//                           }
//                           secondaryTypographyProps={{ variant: 'body2' }}
//                         />
//                       </ListItem>
//                     </List>

//                     <Box sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       mt: 2
//                     }}>
//                       <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
//                         <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
//                         Scheduled by: {interview.scheduledBy}
//                       </Typography>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           startIcon={<EmailIcon />}
//                           onClick={() => console.log('Resend email')}
//                           sx={{ borderRadius: 2 }}
//                         >
//                           Resend
//                         </Button>
//                         <Button
//                           size="small"
//                           variant="contained"
//                           endIcon={<MoreIcon />}
//                           onClick={() => navigate(`/interviews/${interview._id}`)}
//                           sx={{ borderRadius: 2 }}
//                         >
//                           Details
//                         </Button>
//                       </Box>
//                     </Box>
//                   </Box>
//                 </Collapse>
//               </CardContent>
//             </InterviewCard>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default OnlineInterviews;

//---

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
  VideoCall as VideoIcon,
  Email as EmailIcon,
  MoreVert as MoreIcon,
  Notes as NotesIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  EventNote as EventNoteIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

const InterviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
    borderColor: theme.palette.secondary.main
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

const PlatformIcon = ({ platform }) => {
  switch (platform) {
    case 'google_meet':
      return <VideoIcon color="error" />;
    case 'zoom':
      return <VideoIcon color="primary" />;
    case 'microsoft_teams':
      return <VideoIcon color="info" />;
    default:
      return <VideoIcon />;
  }
};

const OnlineInterviews = ({ searchTerm, statusFilter, selectedDate }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInterview, setExpandedInterview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Token from localStorage:', token ? 'Found' : 'Not found');
        
        const response = await axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/interviews/interviews/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'


          }
        });
        
        console.log('Full API Response:', response);
        console.log('Response data:', response.data);
        
        if (response.data.success) {
          if (response.data.data && response.data.data.length > 0) {
            setInterviews(response.data.data);
          } else {
            console.log('No interviews found in response');
            setInterviews([]);
          }
        } else {
          setError('API returned unsuccessful response');
        }
      } catch (err) {
        console.error('Error fetching interviews:', err);
        console.error('Error response:', err.response);
        setError(`Failed to fetch interviews: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', dateString);
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', timeString);
      return 'Invalid time';
    }
  };

  const handleExpandClick = (interviewId) => {
    setExpandedInterview(expandedInterview === interviewId ? null : interviewId);
  };

  const filterInterviews = () => {
    let filtered = [...interviews];
  
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(interview => {
        const candidateName = interview.candidate?.name || '';
        const candidateEmail = interview.candidate?.email || '';
        const jobName = interview.jobId?.jobName || '';
        const jobTitle = interview.jobId?.jobTitle || '';
        const interviewers = interview.interviewers || [];
        
        return (
          candidateName.toLowerCase().includes(term) ||
          candidateEmail.toLowerCase().includes(term) ||
          jobName.toLowerCase().includes(term) ||
          jobTitle.toLowerCase().includes(term) ||
          interviewers.some(i => i.name?.toLowerCase().includes(term)) ||
          interviewers.some(i => i.email?.toLowerCase().includes(term))
        );
      });
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
        try {
          const interviewDate = new Date(interview.date);
          interviewDate.setHours(0, 0, 0, 0);
          return interviewDate.getTime() === filterDate.getTime();
        } catch (error) {
          console.error('Error filtering by date:', interview.date);
          return false;
        }
      });
    }
  
    return filtered;
  };

  const filteredInterviews = filterInterviews();

  // Mock data for testing - REMOVE THIS IN PRODUCTION
  const mockInterviews = [
    {
      candidate: {
        id: "68b368fefc43b0e3ade4302f",
        name: "Jitendra Vishwakarma",
        email: "jitendra7518888@gmail.com"
      },
      _id: "68b54487c5dff0026666eaa5",
      interviewers: [
        {
          _id: "6891b8e1e03d7b6b49f32e9b",
          name: "Ankit Yadav",
          email: "ankit@kloudrac.com"
        }
      ],
      date: "2025-09-04T00:00:00.000Z",
      startTime: "12:30",
      duration: 30,
      timezone: "UTC+05:30",
      platform: "google_meet",
      meetingLink: "https://meet.google.com/tsf-fzcx-uvi",
      templateUsed: {
        _id: "683fef3fdad9b531c3f24ef7",
        name: "Technical Interview"
      },
      subject: "Technical Interview Invitation - Jitendra Vishwakarma",
      emailBody: "Dear Jitendra Vishwakarma,\n\nYour interview is scheduled for 4/9/2025 at 12:30 (UTC+05:30).\n\nDuration: 30 minutes",
      notes: "",
      scheduledBy: {
        _id: "68b3444b14385f12118874c3",
        email: "abc@gmail.com"
      },
      tenantId: "68b3444b14385f12118874c1",
      status: "scheduled",
      jobId: {
        _id: "68b367203626ac3acdbf0a72",
        jobName: "WR002",
        jobTitle: "React Developer"
      },
      createdAt: "2025-09-01T07:00:23.650Z",
      __v: 0,
      feedbackStatus: {
        submitted: 0,
        total: 1
      }
    }
  ];

  // For testing: Uncomment the line below to use mock data
  // const filteredInterviews = mockInterviews;

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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Check browser console for detailed error information.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
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
            Interview Schedule
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Showing {filteredInterviews.length} of {interviews.length} interviews
        </Typography>
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
            <CalendarIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
          </Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            No Interviews Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, margin: '0 auto' }}>
            {interviews.length === 0
              ? "You haven't scheduled any interviews yet. Click below to schedule your first interview."
              : "No interviews match your current filters. Try adjusting your search criteria."}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/interviews/schedule')}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Schedule Interview
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
                      {interview.candidate?.name || 'No candidate name'}
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
                        {formatTime(interview.startTime)} ({interview.timezone})
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
                  <Tooltip title="Platform">
                    <Box>
                      <PlatformIcon platform={interview.platform} sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {interview.platform?.replace('_', ' ') || 'No platform'}
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
                          label={interviewer.name || 'Unknown'}
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

                    {interview.meetingLink && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <VideoIcon sx={{ mr: 1 }} /> Meeting Link
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<PlatformIcon platform={interview.platform} />}
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            mb: 3,
                            borderRadius: 2,
                            textTransform: 'none'
                          }}
                        >
                          Join {interview.platform?.replace('_', ' ') || 'Meeting'}
                        </Button>
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
                        Scheduled by: {interview.scheduledBy?.email || 'Unknown'}
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
                          endIcon={<MoreIcon />}
                          onClick={() => navigate(`/interviews/${interview._id}`)}
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

export default OnlineInterviews;