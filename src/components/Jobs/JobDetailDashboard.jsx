

// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";

// import { useParams, useNavigate } from "react-router-dom";
// import { createNote,updateNote,fetchNotesByJob,deleteNote } from "../../services/Jobs/jobsService";
// import axios from "axios";
// import {
//   Box, Typography, Card, CardContent, Divider, Button,
//   TextField, Avatar, Stack, IconButton, Paper, LinearProgress,
//   Chip, useTheme, styled, alpha, CircularProgress,Alert
// } from "@mui/material";
// import {
//   AccessTime as TimeIcon,
//   RecordVoiceOver as InterviewIcon,
//   HowToReg as OfferIcon,
//   WorkOutline as PositionIcon,
//   People as CandidateIcon,
//   RateReview as ReviewIcon,
//   Description as JobDescIcon,
//   NoteAdd as NoteIcon,
//   ChevronRight as ArrowIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   CalendarToday as CalendarIcon,
//   CheckCircle as CheckCircleIcon,
//   Group as GroupIcon,
//   Timeline as TimelineIcon,
//   BarChart as BarChartIcon,
//   Assignment as AssignmentIcon,
//   Search as SearchIcon,
//   Notifications as NotificationsIcon,
//   AccountCircle as AccountIcon,
//   MoreVert as MoreIcon
// } from "@mui/icons-material";
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// // Custom styled components
// const GlassCard = styled(Card)(({ theme }) => ({
//   background: alpha(theme.palette.background.paper, 0.85),
//   backdropFilter: 'blur(12px)',
//   borderRadius: '16px',
//   border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//   boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
//     borderColor: alpha(theme.palette.primary.main, 0.3)
//   }
// }));

// const GradientButton = styled(Button)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//   color: theme.palette.common.white,
//   fontWeight: 600,
//   textTransform: 'none',
//   padding: '8px 20px',
//   borderRadius: '12px',
//   boxShadow: 'none',
//   '&:hover': {
//     background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
//     boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
//   }
// }));

// const Dashboard = () => {
//   const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState("");
//   const [showNoteForm, setShowNoteForm] = useState(false);
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const { id: jobId } = useParams();
//   const [job, setJob] = useState(null);
//   const [appliedCandidat, setAppliedCandidat] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]);
//   const [closedPosition, setClosedPosition] = useState(0);
//   const [acceptanceRate, setAcceptanceRate] = useState(0);
  
//   const [interviews, setInterviews] = useState({
//     online: 0,
//     offline: 0,
//     upcoming: 0,
//     upcomingInterviews: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("You haven't added any candidates for this position yet. Start building your talent pipeline by adding candidates now.");
//   const [notesLoading, setNotesLoading] = useState(false);
//   const theme = useTheme();
//   const navigate = useNavigate();

//   // Fetch notes from API
//   const fetchNotes = async () => {
//   try {
//     setNotesLoading(true);
//     const response = await fetchNotesByJob(jobId);
//     setNotes(response.notes);
//   } catch (err) {
//     console.error("Error fetching notes:", err);
//     // Handle unauthorized error specifically
//     if (err.message.includes('Unauthorized') || err.response?.status === 401) {
//       // You might want to redirect to login or show a message
//       console.log('Please log in again');
//     }
//   } finally {
//     setNotesLoading(false);
//   }
// };

//   useEffect(() => {
//     const fetchData = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     // Get token from wherever you store it (localStorage, context, etc.)
//     const token = localStorage.getItem('token'); // or from your auth context
    
//     // Fetch notes first
//     await fetchNotes();

//     if (jobId) {
//       const jobResponse = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job/${jobId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setJob(jobResponse.data.job);

//           // Fetch pipeline data
//           const pipelineResponse = await axios.get(`https://hire-onboardbackend-production.up.railway.app/api/stages/by-job/${jobId}`);
//           const candidates = pipelineResponse.data.candidates || [];
//           setAppliedCandidat(candidates);

//           // Process pipeline data
//           const stages = ['Sourced', 'Screening', 'Interview', 'Preboarding', 'Hired', 'Rejected', 'Archived'];
//           const stageCounts = {};

//           stages.forEach(stage => {
//             stageCounts[stage] = 0;
//           });

//           candidates.forEach(candidate => {
//             const stageName = candidate.stage?.name || 'Sourced';
//             stageCounts[stageName] = (stageCounts[stageName] || 0) + 1;
//           });

//           const processedData = stages.map(stage => ({
//             name: stage,
//             value: stageCounts[stage],
//             color: getStageColor(stage)
//           })).filter(item => item.value > 0);

//           setPipelineData(processedData);
//         }

//         const [onlineInterviewsRes, offlineInterviewsRes, upcomingInterviewsRes] = await Promise.all([
//           axios.get('https://hire-onboardbackend-production.up.railway.app/api/interviews/schedule'),
//           axios.get('https://hire-onboardbackend-production.up.railway.app/api/offline-interviews/get'),
//           axios.get('https://hire-onboardbackend-production.up.railway.app/api/interviews/upcoming')
//         ]);

//         const offlineInterviewsCount = offlineInterviewsRes.data.data ? offlineInterviewsRes.data.data.length : 0;

//         setInterviews({
//           online: onlineInterviewsRes.data.count || 0,
//           offline: offlineInterviewsCount,
//           upcoming: upcomingInterviewsRes.data.count || 0,
//           upcomingInterviews: upcomingInterviewsRes.data.data || []
//         });

//       } catch (err) {
//         {error && (
//           <Alert severity="info" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [jobId]);

//   function percentage(partialValue, totalValue) {
//     return (100 * partialValue) / totalValue;
//   }

//   useEffect(() => {
//     const hiredCount = appliedCandidat.filter(c => c.stage?.name === 'Hired').length;
//     setClosedPosition(hiredCount);
//     setAcceptanceRate(percentage(hiredCount, appliedCandidat.length));
//   }, [appliedCandidat]);

//  const handleAddNote = async () => {
//   if (!newNote.trim()) return;

//   try {
//     if (editingNoteId) {
//       await updateNote(editingNoteId, newNote);
//       setEditingNoteId(null);
//     } else {
//       await createNote(jobId, newNote);
//     }
//     setNewNote("");
//     setShowNoteForm(false);
//     fetchNotes(); // Refresh notes
//   } catch (err) {
//     console.error("Error saving note:", err);
//     // Handle unauthorized error
//     if (err.message.includes('Unauthorized') || err.response?.status === 401) {
//       // You might want to redirect to login or show a message
//       console.log('Please log in again');
//     }
//   }
// };

//   const handleEditNote = (note) => {
//     setNewNote(note.content);
//     setEditingNoteId(note._id);
//     setShowNoteForm(true);
//   };

//   const handleDeleteNote = async (id) => {
//   try {
//     await deleteNote(id);
//     fetchNotes(); // Refresh notes
//   } catch (err) {
//     console.error("Error deleting note:", err);
//     // Handle unauthorized error
//     if (err.message.includes('Unauthorized') || err.response?.status === 401) {
//       // You might want to redirect to login or show a message
//       console.log('Please log in again');
//     }
//   }
// };

// const handleUpdateJobPosting = () => {
//   if (!job) {
//     console.error('Job data not loaded yet');
//     return;
//   }
  
//   if (!job._id) {
//     console.error('Job ID is missing');
//     return;
//   }

//   console.log(`Navigating to /jobs/update/${job._id}`);
//   navigate(`/jobs/update/${job._id}`, {
//     state: { job }
//   });
// };

//   const handleCreateJobPosting = () => {
//   navigate('/dashboard/jobs/createJob');
// };

//   const handleViewJobCandidates = () => {
//     navigate(`/candidates`);
//   };

//   const getStageColor = (stage) => {
//     switch (stage) {
//       case 'Sourced': return theme.palette.info.main;
//       case 'Screening': return theme.palette.warning.main;
//       case 'Interview': return theme.palette.primary.main;
//       case 'Preboarding': return theme.palette.secondary.main;
//       case 'Hired': return theme.palette.success.main;
//       case 'Rejected': return theme.palette.error.main;
//       case 'Archived': return theme.palette.grey[500];
//       default: return theme.palette.text.secondary;
//     }
//   };

//   const getPipelineData = () => {
//     if (pipelineData.length > 0) {
//       return pipelineData;
//     }

//     return [
//       { name: 'Sourced', value: 0, color: getStageColor('Sourced') },
//       { name: 'Screening', value: 0, color: getStageColor('Screening') },
//       { name: 'Interview', value: 0, color: getStageColor('Interview') },
//       { name: 'Hired', value: 0, color: getStageColor('Hired') },
//       { name: 'Rejected', value: 0, color: getStageColor('Rejected') }
//     ];
//   };

//   const stripHtmlTags = (html) => {
//     if (!html) return '';
//     return html.replace(/<[^>]*>/g, '');
//   };

//   if (loading) {
//     return (
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         background: alpha(theme.palette.background.default, 0.8),
//         backdropFilter: 'blur(8px)'
//       }}>
//         <CircularProgress size={60} thickness={4} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         flexDirection: 'column',
//         gap: 3,
//         textAlign: 'center',
//         p: 3
//       }}>
//         <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>
//           {error}
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => window.location.reload()}
//           sx={{ borderRadius: 2, px: 4, py: 1.5 }}
//         >
//           Retry
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: theme.palette.grey[50],
//         p: 0,
//         overflow: 'hidden'
//       }}
//     >
//       {/* Main Content */}
//       <Box sx={{
//         display: "flex",
//         flexDirection: { xs: "column", lg: "row" },
//         gap: 3,
//         p: 3,
//         flex: 1,
//         overflow: 'auto'
//       }}>
//         {/* Left Content - 70% */}
//         <Box sx={{
//           flex: { xs: 1, lg: 7 },
//           display: "flex",
//           flexDirection: "column",
//           gap: 3
//         }}>
//           {/* Header */}
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
//               {job?.jobTitle || "Job Title"}
//             </Typography>
//           </Box>

//           {/* Stats Grid */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "repeat(2, 1fr)",
//                 md: "repeat(4, 1fr)",
//               },
//               gap: 3,
//             }}
//           >
//             {[
//               {
//                 title: "Total Candidate Sourced",
//                 value: appliedCandidat.length,
//                 icon: <CandidateIcon />,
//                 color: theme.palette.warning.main,
//                 onClick: handleViewJobCandidates
//               },
//               {
//                 title: "Upcoming Interviews",
//                 value: interviews.upcoming,
//                 icon: <TimeIcon />,
//                 color: theme.palette.warning.main,
//                 onClick: () => navigate('/interviews/upcoming')
//               },
//               {
//                 title: "Acceptance Rate",
//                 value: `${acceptanceRate.toFixed(1)}%`,
//                 icon: <CheckCircleIcon />,
//                 color: theme.palette.success.main,
//               },
//               {
//                 title: "Positions",
//                 value: `${closedPosition}/${job?.jobFormId?.openings || 0}`,
//                 icon: <GroupIcon />,
//                 color: theme.palette.primary.main,
//               },
//             ].map((stat, index) => (
//               <GlassCard
//                 key={index}
//                 onClick={stat.onClick || undefined}
//                 sx={{
//                   cursor: stat.onClick ? 'pointer' : 'default',
//                   '&:hover': {
//                     transform: stat.onClick ? 'translateY(-4px)' : 'none',
//                     boxShadow: stat.onClick ? `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}` : 'none',
//                     borderColor: stat.onClick ? alpha(theme.palette.primary.main, 0.3) : 'none'
//                   }
//                 }}
//               >
//                 <CardContent sx={{ p: 2.5 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
//                       {stat.title}
//                     </Typography>
//                     {stat.change && (
//                       <Chip
//                         label={stat.change}
//                         size="small"
//                         sx={{
//                           height: 20,
//                           fontSize: '0.65rem',
//                           bgcolor: stat.trend === 'up' ? `${theme.palette.success.light}80` :
//                             stat.trend === 'down' ? `${theme.palette.error.light}80` :
//                               `${theme.palette.grey[300]}80`,
//                           color: stat.trend === 'up' ? theme.palette.success.dark :
//                             stat.trend === 'down' ? theme.palette.error.dark :
//                               theme.palette.text.secondary
//                         }}
//                       />
//                     )}
//                   </Box>
//                   <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
//                     {stat.value}
//                   </Typography>
//                   {stat.subtitle && (
//                     <Typography variant="caption" color="text.secondary">
//                       {stat.subtitle}
//                     </Typography>
//                   )}
//                   <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'flex-end',
//                     mt: 1
//                   }}>
//                     <Avatar sx={{
//                       bgcolor: `${stat.color}20`,
//                       color: stat.color,
//                       width: 36,
//                       height: 36
//                     }}>
//                       {stat.icon}
//                     </Avatar>
//                   </Box>
//                 </CardContent>
//               </GlassCard>
//             ))}
//           </Box>

//           {/* Upcoming Interviews List */}
//           {interviews.upcoming > 0 && (
//             <GlassCard>
//               <CardContent sx={{ p: 3 }}>
//                 <Box sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 3
//                 }}>
//                   <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                     <CalendarIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
//                     Upcoming Interviews
//                   </Typography>
//                   <GradientButton
//                     size="small"
//                     endIcon={<ArrowIcon />}
//                     onClick={() => navigate('/interviews/upcoming')}
//                   >
//                     View All
//                   </GradientButton>
//                 </Box>

//                 <Stack spacing={2}>
//                   {interviews.upcomingInterviews.slice(0, 3).map((interview) => (
//                     <Paper
//                       key={interview._id}
//                       elevation={0}
//                       sx={{
//                         p: 2.5,
//                         borderRadius: 2,
//                         background: alpha(theme.palette.background.paper, 0.7),
//                         border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                           transform: 'translateY(-2px)',
//                           boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
//                           borderColor: alpha(theme.palette.primary.main, 0.3)
//                         }
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
//                         <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//                           {interview.candidate?.name || 'No name'}
//                         </Typography>
//                         <Chip
//                           label={interview.status || 'scheduled'}
//                           size="small"
//                           sx={{
//                             fontWeight: 600,
//                             bgcolor: interview.status === 'scheduled' ?
//                               `${theme.palette.info.light}30` :
//                               `${theme.palette.success.light}30`,
//                             color: interview.status === 'scheduled' ?
//                               theme.palette.info.dark :
//                               theme.palette.success.dark
//                           }}
//                         />
//                       </Box>

//                       <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <CalendarIcon fontSize="small" sx={{
//                             mr: 1,
//                             color: theme.palette.text.secondary
//                           }} />
//                           <Typography variant="body2">
//                             {interview.date ? new Date(interview.date).toLocaleDateString() : 'No date'}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <TimeIcon fontSize="small" sx={{
//                             mr: 1,
//                             color: theme.palette.text.secondary
//                           }} />
//                           <Typography variant="body2">
//                             {interview.startTime || 'No time'} ({interview.timezone || 'UTC'})
//                           </Typography>
//                         </Box>
//                       </Box>

//                       <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
//                         {interview.interviewers?.map((interviewer) => (
//                           <Chip
//                             key={interviewer._id}
//                             avatar={<Avatar alt={interviewer.name} sx={{ width: 24, height: 24 }}>
//                               {interviewer.name?.charAt(0) || '?'}
//                             </Avatar>}
//                             label={interviewer.name || 'Interviewer'}
//                             size="small"
//                             sx={{
//                               borderRadius: 1,
//                               background: alpha(theme.palette.primary.light, 0.1)
//                             }}
//                           />
//                         ))}
//                       </Box>

//                       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           endIcon={<ArrowIcon />}
//                           sx={{
//                             textTransform: 'none',
//                             borderRadius: 2,
//                             px: 2,
//                             py: 0.5
//                           }}
//                           onClick={() => navigate(`/interviews/${interview._id}`)}
//                         >
//                           Details
//                         </Button>
//                       </Box>
//                     </Paper>
//                   ))}
//                 </Stack>
//               </CardContent>
//             </GlassCard>
//           )}

//           {/* Bottom Row */}
//           <Box sx={{
//             display: 'flex',
//             flexDirection: { xs: 'column', md: 'row' },
//             gap: 3
//           }}>
//             {/* Candidate Pipeline Pie Chart */}
//             <GlassCard sx={{ flex: 1 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//                   <TimelineIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
//                   Candidate Pipeline
//                 </Typography>
//                 <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', mt: 1 }}>
//                      No Pipeline data found for this position
//                   </Typography>
//                 <Box sx={{ height: 300 }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={getPipelineData()}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, value }) => `${name}: ${value}`}
//                       >
//                         {getPipelineData().map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value, name) => [value, name]}
//                       />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </Box>
//                 {pipelineData.length === 0 && (
//                   <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
//                     No data found for this position
//                   </Typography>
//                 )}
//               </CardContent>
//             </GlassCard>

//             {/* Job Details */}
//             <GlassCard sx={{ flex: 1 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//                   <AssignmentIcon sx={{ mr: 1.5, color: theme.palette.secondary.main }} />
//                   Job Details
//                 </Typography>

//                 {job && (
//                   <Box>
//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                         Job Title
//                       </Typography>
//                       <Typography variant="h5" sx={{ fontWeight: 700 }}>
//                         {job.jobTitle}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                           Department
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                           {job.department}
//                         </Typography>
//                       </Box>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                           Posted Date
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                           {new Date().toLocaleDateString()}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                         Description
//                       </Typography>
//                       <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
//                         {stripHtmlTags(job.jobDesc)}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         Status: Active
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         Type: Full-time
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         Location: On-site
//                       </Typography>
//                     </Box>
//                   </Box>
//                 )}
//               </CardContent>
//             </GlassCard>
//           </Box>
//         </Box>

//         {/* Right Sidebar - 30% */}
//         <Box sx={{
//           flex: { xs: 1, lg: 3 },
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//           minWidth: 320
//         }}>
//           {/* Notes Card */}
//           <GlassCard sx={{ flex: 1, mt: 9 }}>
//             <CardContent sx={{
//               p: 3,
//               flex: 1,
//               display: 'flex',
//               flexDirection: 'column'
//             }}>
//               <Box sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 3
//               }}>
//                 <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                   <NoteIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
//                   My Notes
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   onClick={() => {
//                     setNewNote("");
//                     setEditingNoteId(null);
//                     setShowNoteForm(true);
//                   }}
//                   sx={{
//                     background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                     color: theme.palette.common.white,
//                     '&:hover': {
//                       background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
//                     }
//                   }}
//                 >
//                   <AddIcon fontSize="small" />
//                 </IconButton>
//               </Box>

//               {showNoteForm && (
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     mb: 3,
//                     p: 2.5,
//                     borderRadius: 2,
//                     background: alpha(theme.palette.background.paper, 0.7),
//                     border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     value={newNote}
//                     onChange={(e) => setNewNote(e.target.value)}
//                     placeholder="Write your note here..."
//                     variant="outlined"
//                     sx={{ mb: 2 }}
//                     InputProps={{
//                       sx: {
//                         borderRadius: 1,
//                         background: theme.palette.background.paper
//                       }
//                     }}
//                   />
//                   <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
//                     <Button
//                       size="small"
//                       startIcon={<CloseIcon />}
//                       onClick={() => {
//                         setShowNoteForm(false);
//                         setEditingNoteId(null);
//                         setNewNote("");
//                       }}
//                       sx={{ textTransform: 'none' }}
//                     >
//                       Cancel
//                     </Button>
//                     <GradientButton
//                       size="small"
//                       startIcon={<NoteIcon />}
//                       onClick={handleAddNote}
//                     >
//                       {editingNoteId ? "Update Note" : "Save Note"}
//                     </GradientButton>
//                   </Box>
//                 </Paper>
//               )}

//               <Box sx={{
//                 flex: 1,
//                 overflowY: 'auto',
//                 pr: 1,
//                 '&::-webkit-scrollbar': {
//                   width: '6px',
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                   background: alpha(theme.palette.primary.main, 0.5),
//                   borderRadius: '3px',
//                 }
//               }}>
//                 {notesLoading ? (
//                   <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                     <CircularProgress />
//                   </Box>
//                 ) : notes.length > 0 ? (
//                   <Stack spacing={2}>
//                     {notes.map((note) => (
//                       <Paper
//                         key={note._id}
//                         elevation={0}
//                         sx={{
//                           p: 2.5,
//                           borderRadius: 2,
//                           background: alpha(theme.palette.background.paper, 0.7),
//                           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             transform: 'translateY(-2px)',
//                             boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
//                             borderColor: alpha(theme.palette.primary.main, 0.3)
//                           }
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ mb: 2 }}>
//                           {note.content}
//                         </Typography>
//                         <Box sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center'
//                         }}>
//                           <Box>
//                             <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
//                               {note.createdBy?.username || 'You'} • {new Date(note.createdAt).toLocaleDateString()}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </Typography>
//                           </Box>
//                           <Box>
//                             <IconButton
//                               size="small"
//                               onClick={() => handleEditNote(note)}
//                               sx={{
//                                 color: theme.palette.primary.main,
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.primary.main, 0.1)
//                                 }
//                               }}
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                             <IconButton
//                               size="small"
//                               onClick={() => handleDeleteNote(note._id)}
//                               sx={{
//                                 color: theme.palette.error.main,
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.error.main, 0.1)
//                                 }
//                               }}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     ))}
//                   </Stack>
//                 ) : (
//                   <Box sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     textAlign: 'center',
//                     p: 3,
//                     color: 'text.secondary'
//                   }}>
//                     <Box sx={{
//                       width: 80,
//                       height: 80,
//                       borderRadius: '50%',
//                       background: alpha(theme.palette.primary.main, 0.1),
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       mb: 2
//                     }}>
//                       <NoteIcon sx={{
//                         fontSize: 40,
//                         color: theme.palette.primary.main
//                       }} />
//                     </Box>
//                     <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
//                       No notes yet
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 2, maxWidth: '80%' }}>
//                       Add notes to track important information about candidates or hiring process
//                     </Typography>
//                     <GradientButton
//                       size="small"
//                       startIcon={<AddIcon />}
//                       onClick={() => setShowNoteForm(true)}
//                     >
//                       Add your first note
//                     </GradientButton>
//                   </Box>
//                 )}
//               </Box>
//             </CardContent>
//           </GlassCard>

//           {/* Quick Actions */}
//           <GlassCard>
//             <CardContent sx={{ p: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//                 Quick Actions
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                 <Button
//                   variant="outlined"
//                   size="medium"
//                   startIcon={<CalendarIcon />}
//                   onClick={() => navigate('/interviews/schedule')}
//                   sx={{
//                     justifyContent: 'flex-start',
//                     textTransform: 'none',
//                     p: 1.5,
//                     borderRadius: 2,
//                     borderColor: alpha(theme.palette.divider, 0.2),
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       background: alpha(theme.palette.primary.main, 0.05)
//                     }
//                   }}
//                 >
//                   Schedule Interview
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="medium"
//                   startIcon={<EditIcon />}
//                   onClick={handleUpdateJobPosting}
//                   sx={{
//                     justifyContent: 'flex-start',
//                     textTransform: 'none',
//                     p: 1.5,
//                     borderRadius: 2,
//                     borderColor: alpha(theme.palette.divider, 0.2),
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       background: alpha(theme.palette.primary.main, 0.05)
//                     }
//                   }}
//                 >
//                   Update Job Posting
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="medium"
//                   startIcon={<PositionIcon />}
//                   onClick={handleCreateJobPosting}
//                   sx={{
//                     justifyContent: 'flex-start',
//                     textTransform: 'none',
//                     p: 1.5,
//                     borderRadius: 2,
//                     borderColor: alpha(theme.palette.divider, 0.2),
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       background: alpha(theme.palette.primary.main, 0.05)
//                     }
//                   }}
//                 >
//                   Create New Position
//                 </Button>
//               </Box>
//             </CardContent>
//           </GlassCard>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;

//--------

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { createNote, updateNote, fetchNotesByJob, deleteNote } from "../../services/Jobs/jobsService";
// import axios from "axios";
// import {
//   Box, Typography, Card, CardContent, Divider, Button,
//   TextField, Avatar, Stack, IconButton, Paper, LinearProgress,
//   Chip, useTheme, styled, alpha, CircularProgress, Alert
// } from "@mui/material";
// import {
//   AccessTime as TimeIcon,
//   RecordVoiceOver as InterviewIcon,
//   HowToReg as OfferIcon,
//   WorkOutline as PositionIcon,
//   People as CandidateIcon,
//   RateReview as ReviewIcon,
//   Description as JobDescIcon,
//   NoteAdd as NoteIcon,
//   ChevronRight as ArrowIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   CalendarToday as CalendarIcon,
//   CheckCircle as CheckCircleIcon,
//   Group as GroupIcon,
//   Timeline as TimelineIcon,
//   BarChart as BarChartIcon,
//   Assignment as AssignmentIcon,
//   Search as SearchIcon,
//   Notifications as NotificationsIcon,
//   AccountCircle as AccountIcon,
//   MoreVert as MoreIcon
// } from "@mui/icons-material";
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// // Custom styled components
// const GlassCard = styled(Card)(({ theme }) => ({
//   background: alpha(theme.palette.background.paper, 0.85),
//   backdropFilter: 'blur(12px)',
//   borderRadius: '16px',
//   border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//   boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
//     borderColor: alpha(theme.palette.primary.main, 0.3)
//   }
// }));

// const GradientButton = styled(Button)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//   color: theme.palette.common.white,
//   fontWeight: 600,
//   textTransform: 'none',
//   padding: '8px 20px',
//   borderRadius: '12px',
//   boxShadow: 'none',
//   '&:hover': {
//     background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
//     boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
//   }
// }));

// const Dashboard = () => {
//   const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState("");
//   const [showNoteForm, setShowNoteForm] = useState(false);
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const { id: jobId } = useParams();
//   const [job, setJob] = useState(null);
//   const [appliedCandidates, setAppliedCandidates] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]);
//   const [closedPosition, setClosedPosition] = useState(0);
//   const [acceptanceRate, setAcceptanceRate] = useState(0);
//   const [totalCandidates, setTotalCandidates] = useState(0);
  
//   const [interviews, setInterviews] = useState({
//     online: 0,
//     offline: 0,
//     upcoming: 0,
//     upcomingInterviews: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [notesLoading, setNotesLoading] = useState(false);
//   const theme = useTheme();
//   const navigate = useNavigate();

//   // Fetch notes from API
//   const fetchNotes = async () => {
//     try {
//       setNotesLoading(true);
//       const response = await fetchNotesByJob(jobId);
//       setNotes(response.notes);
//     } catch (err) {
//       console.error("Error fetching notes:", err);
//     } finally {
//       setNotesLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
        
//         // Fetch notes first
//         await fetchNotes();

//         if (jobId) {
//           // Fetch job details
//           try {
//             const jobResponse = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job/${jobId}`, {
//               headers: {
//                 'Authorization': `Bearer ${token}`
//               }
//             });
//             setJob(jobResponse.data.job);
//           } catch (err) {
//             console.error("Error fetching job details:", err);
//           }

//           // Fetch total candidates for this job
//           try {
//             const candidatesResponse = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/job/${jobId}`, {
//               headers: {
//                 'Authorization': `Bearer ${token}`
//               }
//             });
//             setTotalCandidates(candidatesResponse.data.count);
//             setAppliedCandidates(candidatesResponse.data.candidates || []);

//             // Process pipeline data
//             const stages = ['Sourced', 'Screening', 'Interview', 'Preboarding', 'Hired', 'Rejected', 'Archived'];
//             const stageCounts = {};

//             stages.forEach(stage => {
//               stageCounts[stage] = 0;
//             });

//             candidatesResponse.data.candidates.forEach(candidate => {
//               const stageName = candidate.stage?.name || 'Sourced';
//               stageCounts[stageName] = (stageCounts[stageName] || 0) + 1;
//             });

//             const processedData = stages.map(stage => ({
//               name: stage,
//               value: stageCounts[stage],
//               color: getStageColor(stage)
//             })).filter(item => item.value > 0);

//             setPipelineData(processedData);
//           } catch (err) {
//             console.error("Error fetching candidates:", err);
//             setError("Unable to load candidate data. Please try again later.");
//           }
//         }

//         // Try to fetch interview data but don't fail if it's not available
//         try {
//           const token= localStorage.getItem('token');
//           const [onlineInterviewsRes, offlineInterviewsRes, upcomingInterviewsRes] = await Promise.all([
//             axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/interviews/upcoming',{
//               headers:{
//                 Authorization:`Bearer ${token}`
//               }
//             }),
//             axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/offline/interviews/upcoming',{
//               headers:{
//                 Authorization:`Bearer ${token}`
//               }
//             }),
//             axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/interviews/upcoming',{
//               headers: {
//                 Authorization: `Bearer ${token}`
//               }
//             })
//           ]);

//           const offlineInterviewsCount = offlineInterviewsRes.data.data ? offlineInterviewsRes.data.data.length : 0;

//           setInterviews({
//             online: onlineInterviewsRes.data.count || 0,
//             offline: offlineInterviewsCount,
//             upcoming: upcomingInterviewsRes.data.count || 0,
//             upcomingInterviews: upcomingInterviewsRes.data.data || []
//           });
//         } catch (err) {
//           console.log("Interview data not available, continuing without it");
//         }

//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load some data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [jobId]);

//   function percentage(partialValue, totalValue) {
//     if (!totalValue) return 0;
//     return (100 * partialValue) / totalValue;
//   }

//   useEffect(() => {
//     const hiredCount = appliedCandidates.filter(c => c.stage?.name === 'Hired').length;
//     setClosedPosition(hiredCount);
//     setAcceptanceRate(percentage(hiredCount, appliedCandidates.length));
//   }, [appliedCandidates]);

//   const handleAddNote = async () => {
//     if (!newNote.trim()) return;

//     try {
//       if (editingNoteId) {
//         await updateNote(editingNoteId, newNote);
//         setEditingNoteId(null);
//       } else {
//         await createNote(jobId, newNote);
//       }
//       setNewNote("");
//       setShowNoteForm(false);
//       fetchNotes();
//     } catch (err) {
//       console.error("Error saving note:", err);
//     }
//   };

//   const handleEditNote = (note) => {
//     setNewNote(note.content);
//     setEditingNoteId(note._id);
//     setShowNoteForm(true);
//   };

//   const handleDeleteNote = async (id) => {
//     try {
//       await deleteNote(id);
//       fetchNotes();
//     } catch (err) {
//       console.error("Error deleting note:", err);
//     }
//   };

//   const handleUpdateJobPosting = () => {
//     if (!job) {
//       console.error('Job data not loaded yet');
//       return;
//     }
    
//     if (!job._id) {
//       console.error('Job ID is missing');
//       return;
//     }

//     navigate(`/jobs/update/${job._id}`, {
//       state: { job }
//     });
//   };

//   const handleCreateJobPosting = () => {
//     navigate('/dashboard/jobs/createJob');
//   };

//   const handleViewJobCandidates = () => {
//     navigate(`/candidates`);
//   };

//   const getStageColor = (stage) => {
//     switch (stage) {
//       case 'Sourced': return theme.palette.info.main;
//       case 'Screening': return theme.palette.warning.main;
//       case 'Interview': return theme.palette.primary.main;
//       case 'Preboarding': return theme.palette.secondary.main;
//       case 'Hired': return theme.palette.success.main;
//       case 'Rejected': return theme.palette.error.main;
//       case 'Archived': return theme.palette.grey[500];
//       default: return theme.palette.text.secondary;
//     }
//   };

//   const getPipelineData = () => {
//     if (pipelineData.length > 0) {
//       return pipelineData;
//     }

//     return [
//       { name: 'Sourced', value: 0, color: getStageColor('Sourced') },
//       { name: 'Screening', value: 0, color: getStageColor('Screening') },
//       { name: 'Interview', value: 0, color: getStageColor('Interview') },
//       { name: 'Hired', value: 0, color: getStageColor('Hired') },
//       { name: 'Rejected', value: 0, color: getStageColor('Rejected') }
//     ];
//   };

//   const stripHtmlTags = (html) => {
//     if (!html) return '';
//     return html.replace(/<[^>]*>/g, '');
//   };

//   if (loading) {
//     return (
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         background: alpha(theme.palette.background.default, 0.8),
//         backdropFilter: 'blur(8px)'
//       }}>
//         <CircularProgress size={60} thickness={4} />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: theme.palette.grey[50],
//         p: 0,
//         overflow: 'hidden'
//       }}
//     >
//       {/* Main Content */}
//       <Box sx={{
//         display: "flex",
//         flexDirection: { xs: "column", lg: "row" },
//         gap: 3,
//         p: 3,
//         flex: 1,
//         overflow: 'auto'
//       }}>
//         {/* Left Content - 70% */}
//         <Box sx={{
//           flex: { xs: 1, lg: 7 },
//           display: "flex",
//           flexDirection: "column",
//           gap: 3
//         }}>
//           {/* Header */}
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
//               {job?.jobTitle || "Job Title"}
//             </Typography>
//             {error && (
//               <Alert severity="warning" sx={{ mt: 1 }}>
//                 {error}
//               </Alert>
//             )}
//           </Box>

//           {/* Stats Grid */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "repeat(2, 1fr)",
//                 md: "repeat(4, 1fr)",
//               },
//               gap: 3,
//             }}
//           >
//             {[
//               {
//                 title: "Total Candidate Sourced",
//                 value: totalCandidates,
//                 icon: <CandidateIcon />,
//                 color: theme.palette.warning.main,
//                 onClick: handleViewJobCandidates
//               },
//               {
//                 title: "Upcoming Interviews",
//                 value: interviews.upcoming,
//                 icon: <TimeIcon />,
//                 color: theme.palette.warning.main,
//                 onClick: () => navigate('/interviews/upcoming')
//               },
//               {
//                 title: "Acceptance Rate",
//                 value: `${acceptanceRate.toFixed(1)}%`,
//                 icon: <CheckCircleIcon />,
//                 color: theme.palette.success.main,
//               },
//               {
//                 title: "Positions",
//                 value: `${closedPosition}/${job?.jobFormId?.openings || 0}`,
//                 icon: <GroupIcon />,
//                 color: theme.palette.primary.main,
//               },
//             ].map((stat, index) => (
//               <GlassCard
//                 key={index}
//                 onClick={stat.onClick || undefined}
//                 sx={{
//                   cursor: stat.onClick ? 'pointer' : 'default',
//                   '&:hover': {
//                     transform: stat.onClick ? 'translateY(-4px)' : 'none',
//                     boxShadow: stat.onClick ? `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}` : 'none',
//                     borderColor: stat.onClick ? alpha(theme.palette.primary.main, 0.3) : 'none'
//                   }
//                 }}
//               >
//                 <CardContent sx={{ p: 2.5 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
//                       {stat.title}
//                     </Typography>
//                   </Box>
//                   <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
//                     {stat.value}
//                   </Typography>
//                   <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'flex-end',
//                     mt: 1
//                   }}>
//                     <Avatar sx={{
//                       bgcolor: `${stat.color}20`,
//                       color: stat.color,
//                       width: 36,
//                       height: 36
//                     }}>
//                       {stat.icon}
//                     </Avatar>
//                   </Box>
//                 </CardContent>
//               </GlassCard>
//             ))}
//           </Box>

//           {/* Upcoming Interviews List - Only show if we have data */}
//           {interviews.upcoming > 0 && (
//             <GlassCard>
//               <CardContent sx={{ p: 3 }}>
//                 <Box sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 3
//                 }}>
//                   <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                     <CalendarIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
//                     Upcoming Interviews
//                   </Typography>
//                   <GradientButton
//                     size="small"
//                     endIcon={<ArrowIcon />}
//                     onClick={() => navigate('/interviews/upcoming')}
//                   >
//                     View All
//                   </GradientButton>
//                 </Box>

//                 <Stack spacing={2}>
//                   {interviews.upcomingInterviews.slice(0, 3).map((interview) => (
//                     <Paper
//                       key={interview._id}
//                       elevation={0}
//                       sx={{
//                         p: 2.5,
//                         borderRadius: 2,
//                         background: alpha(theme.palette.background.paper, 0.7),
//                         border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                           transform: 'translateY(-2px)',
//                           boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
//                           borderColor: alpha(theme.palette.primary.main, 0.3)
//                         }
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
//                         <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//                           {interview.candidate?.name || 'No name'}
//                         </Typography>
//                         <Chip
//                           label={interview.status || 'scheduled'}
//                           size="small"
//                           sx={{
//                             fontWeight: 600,
//                             bgcolor: interview.status === 'scheduled' ?
//                               `${theme.palette.info.light}30` :
//                               `${theme.palette.success.light}30`,
//                             color: interview.status === 'scheduled' ?
//                               theme.palette.info.dark :
//                               theme.palette.success.dark
//                           }}
//                         />
//                       </Box>

//                       <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <CalendarIcon fontSize="small" sx={{
//                             mr: 1,
//                             color: theme.palette.text.secondary
//                           }} />
//                           <Typography variant="body2">
//                             {interview.date ? new Date(interview.date).toLocaleDateString() : 'No date'}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <TimeIcon fontSize="small" sx={{
//                             mr: 1,
//                             color: theme.palette.text.secondary
//                           }} />
//                           <Typography variant="body2">
//                             {interview.startTime || 'No time'} ({interview.timezone || 'UTC'})
//                           </Typography>
//                         </Box>
//                       </Box>

//                       <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
//                         {interview.interviewers?.map((interviewer) => (
//                           <Chip
//                             key={interviewer._id}
//                             avatar={<Avatar alt={interviewer.name} sx={{ width: 24, height: 24 }}>
//                               {interviewer.name?.charAt(0) || '?'}
//                             </Avatar>}
//                             label={interviewer.name || 'Interviewer'}
//                             size="small"
//                             sx={{
//                               borderRadius: 1,
//                               background: alpha(theme.palette.primary.light, 0.1)
//                             }}
//                           />
//                         ))}
//                       </Box>

//                       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           endIcon={<ArrowIcon />}
//                           sx={{
//                             textTransform: 'none',
//                             borderRadius: 2,
//                             px: 2,
//                             py: 0.5
//                           }}
//                           onClick={() => navigate(`/interviews/${interview._id}`)}
//                         >
//                           Details
//                         </Button>
//                       </Box>
//                     </Paper>
//                   ))}
//                 </Stack>
//               </CardContent>
//             </GlassCard>
//           )}

//           {/* Bottom Row */}
//           <Box sx={{
//             display: 'flex',
//             flexDirection: { xs: 'column', md: 'row' },
//             gap: 3
//           }}>
//             {/* Candidate Pipeline Pie Chart */}
//             <GlassCard sx={{ flex: 1 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//                   <TimelineIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
//                   Candidate Pipeline
//                 </Typography>
//                 <Box sx={{ height: 300 }}>
//                   {pipelineData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={getPipelineData()}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, value }) => `${name}: ${value}`}
//                         >
//                           {getPipelineData().map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip
//                           formatter={(value, name) => [value, name]}
//                         />
//                         <Legend />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <Box sx={{ 
//                       display: 'flex', 
//                       justifyContent: 'center', 
//                       alignItems: 'center', 
//                       height: '100%',
//                       flexDirection: 'column'
//                     }}>
//                       <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
//                         No pipeline data available
//                       </Typography>
//                       <Button 
//                         variant="outlined" 
//                         onClick={handleViewJobCandidates}
//                         startIcon={<CandidateIcon />}
//                       >
//                         View Candidates
//                       </Button>
//                     </Box>
//                   )}
//                 </Box>
//               </CardContent>
//             </GlassCard>

//             {/* Job Details */}
//             <GlassCard sx={{ flex: 1 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//                   <AssignmentIcon sx={{ mr: 1.5, color: theme.palette.secondary.main }} />
//                   Job Details
//                 </Typography>

//                 {job ? (
//                   <Box>
//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                         Job Title
//                       </Typography>
//                       <Typography variant="h5" sx={{ fontWeight: 700 }}>
//                         {job.jobTitle}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                           Department
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                           {job.department}
//                         </Typography>
//                       </Box>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                           Posted Date
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                           {new Date().toLocaleDateString()}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
//                         Description
//                       </Typography>
//                       <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
//                         {stripHtmlTags(job.jobDesc)}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         Status: Active
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         Type: Full-time
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         Location: On-site
//                       </Typography>
//                     </Box>
//                   </Box>
//                 ) : (
//                   <Typography variant="body2" color="text.secondary">
//                     Job details not available
//                   </Typography>
//                 )}
//               </CardContent>
//             </GlassCard>
//           </Box>
//         </Box>

//         {/* Right Sidebar - 30% */}
//         <Box sx={{
//           flex: { xs: 1, lg: 3 },
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//           minWidth: 320
//         }}>
//           {/* Notes Card */}
//           <GlassCard sx={{ flex: 1, mt: 9 }}>
//             <CardContent sx={{
//               p: 3,
//               flex: 1,
//               display: 'flex',
//               flexDirection: 'column'
//             }}>
//               <Box sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 3
//               }}>
//                 <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                   <NoteIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
//                   My Notes
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   onClick={() => {
//                     setNewNote("");
//                     setEditingNoteId(null);
//                     setShowNoteForm(true);
//                   }}
//                   sx={{
//                     background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                     color: theme.palette.common.white,
//                     '&:hover': {
//                       background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
//                     }
//                   }}
//                 >
//                   <AddIcon fontSize="small" />
//                 </IconButton>
//               </Box>

//               {showNoteForm && (
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     mb: 3,
//                     p: 2.5,
//                     borderRadius: 2,
//                     background: alpha(theme.palette.background.paper, 0.7),
//                     border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     value={newNote}
//                     onChange={(e) => setNewNote(e.target.value)}
//                     placeholder="Write your note here..."
//                     variant="outlined"
//                     sx={{ mb: 2 }}
//                     InputProps={{
//                       sx: {
//                         borderRadius: 1,
//                         background: theme.palette.background.paper
//                       }
//                     }}
//                   />
//                   <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
//                     <Button
//                       size="small"
//                       startIcon={<CloseIcon />}
//                       onClick={() => {
//                         setShowNoteForm(false);
//                         setEditingNoteId(null);
//                         setNewNote("");
//                       }}
//                       sx={{ textTransform: 'none' }}
//                     >
//                       Cancel
//                     </Button>
//                     <GradientButton
//                       size="small"
//                       startIcon={<NoteIcon />}
//                       onClick={handleAddNote}
//                     >
//                       {editingNoteId ? "Update Note" : "Save Note"}
//                     </GradientButton>
//                   </Box>
//                 </Paper>
//               )}

//               <Box sx={{
//                 flex: 1,
//                 overflowY: 'auto',
//                 pr: 1,
//                 '&::-webkit-scrollbar': {
//                   width: '6px',
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                   background: alpha(theme.palette.primary.main, 0.5),
//                   borderRadius: '3px',
//                 }
//               }}>
//                 {notesLoading ? (
//                   <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                     <CircularProgress />
//                   </Box>
//                 ) : notes.length > 0 ? (
//                   <Stack spacing={2}>
//                     {notes.map((note) => (
//                       <Paper
//                         key={note._id}
//                         elevation={0}
//                         sx={{
//                           p: 2.5,
//                           borderRadius: 2,
//                           background: alpha(theme.palette.background.paper, 0.7),
//                           border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             transform: 'translateY(-2px)',
//                             boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
//                             borderColor: alpha(theme.palette.primary.main, 0.3)
//                           }
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ mb: 2 }}>
//                           {note.content}
//                         </Typography>
//                         <Box sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center'
//                         }}>
//                           <Box>
//                             <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
//                               {note.createdBy?.username || 'You'} • {new Date(note.createdAt).toLocaleDateString()}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </Typography>
//                           </Box>
//                           <Box>
//                             <IconButton
//                               size="small"
//                               onClick={() => handleEditNote(note)}
//                               sx={{
//                                 color: theme.palette.primary.main,
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.primary.main, 0.1)
//                                 }
//                               }}
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                             <IconButton
//                               size="small"
//                               onClick={() => handleDeleteNote(note._id)}
//                               sx={{
//                                 color: theme.palette.error.main,
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.error.main, 0.1)
//                                 }
//                               }}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     ))}
//                   </Stack>
//                 ) : (
//                   <Box sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     textAlign: 'center',
//                     p: 3,
//                     color: 'text.secondary'
//                   }}>
//                     <Box sx={{
//                       width: 80,
//                       height: 80,
//                       borderRadius: '50%',
//                       background: alpha(theme.palette.primary.main, 0.1),
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       mb: 2
//                     }}>
//                       <NoteIcon sx={{
//                         fontSize: 40,
//                         color: theme.palette.primary.main
//                       }} />
//                     </Box>
//                     <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
//                       No notes yet
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 2, maxWidth: '80%' }}>
//                       Add notes to track important information about candidates or hiring process
//                     </Typography>
//                     <GradientButton
//                       size="small"
//                       startIcon={<AddIcon />}
//                       onClick={() => setShowNoteForm(true)}
//                     >
//                       Add your first note
//                     </GradientButton>
//                   </Box>
//                 )}
//               </Box>
//             </CardContent>
//           </GlassCard>

//           {/* Quick Actions */}
//           <GlassCard>
//             <CardContent sx={{ p: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//                 Quick Actions
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                 <Button
//                   variant="outlined"
//                   size="medium"
//                   startIcon={<CalendarIcon />}
//                   onClick={() => navigate('/interviews/schedule')}
//                   sx={{
//                     justifyContent: 'flex-start',
//                     textTransform: 'none',
//                     p: 1.5,
//                     borderRadius: 2,
//                     borderColor: alpha(theme.palette.divider, 0.2),
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       background: alpha(theme.palette.primary.main, 0.05)
//                     }
//                   }}
//                 >
//                   Schedule Interview
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="medium"
//                   startIcon={<EditIcon />}
//                   onClick={handleUpdateJobPosting}
//                   sx={{
//                     justifyContent: 'flex-start',
//                     textTransform: 'none',
//                     p: 1.5,
//                     borderRadius: 2,
//                     borderColor: alpha(theme.palette.divider, 0.2),
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       background: alpha(theme.palette.primary.main, 0.05)
//                     }
//                   }}
//                 >
//                   Update Job Posting
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="medium"
//                   startIcon={<PositionIcon />}
//                   onClick={handleCreateJobPosting}
//                   sx={{
//                     justifyContent: 'flex-start',
//                     textTransform: 'none',
//                     p: 1.5,
//                     borderRadius: 2,
//                     borderColor: alpha(theme.palette.divider, 0.2),
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       background: alpha(theme.palette.primary.main, 0.05)
//                     }
//                   }}
//                 >
//                   Create New Position
//                 </Button>
//               </Box>
//             </CardContent>
//           </GlassCard>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;


//----------


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNote, updateNote, fetchNotesByJob, deleteNote } from "../../services/Jobs/jobsService";
import axios from "axios";
import {
  Box, Typography, Card, CardContent, Divider, Button,
  TextField, Avatar, Stack, IconButton, Paper, LinearProgress,
  Chip, useTheme, styled, alpha, CircularProgress, Alert
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  RecordVoiceOver as InterviewIcon,
  HowToReg as OfferIcon,
  WorkOutline as PositionIcon,
  People as CandidateIcon,
  RateReview as ReviewIcon,
  Description as JobDescIcon,
  NoteAdd as NoteIcon,
  ChevronRight as ArrowIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  MoreVert as MoreIcon,
  Videocam as OnlineIcon,
  MeetingRoom as OfflineIcon
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {  ArrowBack } from "@mui/icons-material"; // Added ArrowBack icon

import MainLayout from "../../layout/MainLayout";

// Custom styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3)
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: 'none',
  padding: '8px 20px',
  borderRadius: '12px',
  boxShadow: 'none',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
  }
}));

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [closedPosition, setClosedPosition] = useState(0);
  const [acceptanceRate, setAcceptanceRate] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  
  const [interviews, setInterviews] = useState({
    online: 0,
    offline: 0,
    total: 0,
    upcomingInterviews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();



    const handleBack = () => {
    navigate(-1); // Go back one step in history
  };
  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      const response = await fetchNotesByJob(jobId);
      setNotes(response.notes);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        
        // Fetch notes first
        await fetchNotes();

        if (jobId) {
          // Fetch job details
          try {
            const jobResponse = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job/${jobId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                 'ngrok-skip-browser-warning': 'true'

              }
            });
            setJob(jobResponse.data.job);
          } catch (err) {
            console.error("Error fetching job details:", err);
          }

          // Fetch total candidates for this job
          try {
            const candidatesResponse = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/job/${jobId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                 'ngrok-skip-browser-warning': 'true'
              }
            });
            setTotalCandidates(candidatesResponse.data.count);
            setAppliedCandidates(candidatesResponse.data.candidates || []);

            // Process pipeline data
            const stages = ['Sourced', 'Screening', 'Interview', 'Preboarding', 'Hired', 'Rejected', 'Archived'];
            const stageCounts = {};

            stages.forEach(stage => {
              stageCounts[stage] = 0;
            });

            candidatesResponse.data.candidates.forEach(candidate => {
              const stageName = candidate.stage?.name || 'Sourced';
              stageCounts[stageName] = (stageCounts[stageName] || 0) + 1;
            });

            const processedData = stages.map(stage => ({
              name: stage,
              value: stageCounts[stage],
              color: getStageColor(stage)
            })).filter(item => item.value > 0);

            setPipelineData(processedData);
          } catch (err) {
            console.error("Error fetching candidates:", err);
            setError("Unable to load candidate data. Please try again later.");
          }
        }

        // Fetch both online and offline interviews
        try {
          const token = localStorage.getItem('token');
          const [onlineInterviewsRes, offlineInterviewsRes] = await Promise.all([
            axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/interviews/upcoming', {
              headers: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'

              }
            }),
            axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/offline/interviews/upcoming', {
              headers: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'

              }
            })
          ]);

          // Process online interviews
          const onlineInterviews = onlineInterviewsRes.data.data || [];
          const onlineCount = onlineInterviewsRes.data.count || onlineInterviews.length;
          
          // Process offline interviews
          const offlineInterviews = offlineInterviewsRes.data.data || [];
          const offlineCount = offlineInterviewsRes.data.count || offlineInterviews.length;
          
          // Combine all interviews and sort by date
          const allInterviews = [...onlineInterviews, ...offlineInterviews]
            .map(interview => ({
              ...interview,
              type: interview.platform ? 'online' : 'offline',
              interviewDate: interview.date ? new Date(interview.date) : new Date()
            }))
            .sort((a, b) => a.interviewDate - b.interviewDate);

          setInterviews({
            online: onlineCount,
            offline: offlineCount,
            total: onlineCount + offlineCount,
            upcomingInterviews: allInterviews
          });
        } catch (err) {
          console.log("Interview data not available, continuing without it");
          setInterviews({
            online: 0,
            offline: 0,
            total: 0,
            upcomingInterviews: []
          });
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load some data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  function percentage(partialValue, totalValue) {
    if (!totalValue) return 0;
    return (100 * partialValue) / totalValue;
  }

  useEffect(() => {
    const hiredCount = appliedCandidates.filter(c => c.stage?.name === 'Hired').length;
    setClosedPosition(hiredCount);
    setAcceptanceRate(percentage(hiredCount, appliedCandidates.length));
  }, [appliedCandidates]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      if (editingNoteId) {
        await updateNote(editingNoteId, newNote);
        setEditingNoteId(null);
      } else {
        await createNote(jobId, newNote);
      }
      setNewNote("");
      setShowNoteForm(false);
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleEditNote = (note) => {
    setNewNote(note.content);
    setEditingNoteId(note._id);
    setShowNoteForm(true);
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleUpdateJobPosting = () => {
    if (!job) {
      console.error('Job data not loaded yet');
      return;
    }
    
    if (!job._id) {
      console.error('Job ID is missing');
      return;
    }

    navigate(`/jobs/update/${job._id}`, {
      state: { job }
    });
  };

  const handleCreateJobPosting = () => {
    navigate('/dashboard/jobs/createJob');
  };

  const handleViewJobCandidates = () => {
    navigate(`/candidates`);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Sourced': return theme.palette.info.main;
      case 'Screening': return theme.palette.warning.main;
      case 'Interview': return theme.palette.primary.main;
      case 'Preboarding': return theme.palette.secondary.main;
      case 'Hired': return theme.palette.success.main;
      case 'Rejected': return theme.palette.error.main;
      case 'Archived': return theme.palette.grey[500];
      default: return theme.palette.text.secondary;
    }
  };

  const getPipelineData = () => {
    if (pipelineData.length > 0) {
      return pipelineData;
    }

    return [
      { name: 'Sourced', value: 0, color: getStageColor('Sourced') },
      { name: 'Screening', value: 0, color: getStageColor('Screening') },
      { name: 'Interview', value: 0, color: getStageColor('Interview') },
      { name: 'Hired', value: 0, color: getStageColor('Hired') },
      { name: 'Rejected', value: 0, color: getStageColor('Rejected') }
    ];
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const getInterviewTypeIcon = (type) => {
    return type === 'online' ? 
      <OnlineIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} /> : 
      <OfflineIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} />;
  };

  const getInterviewTypeLabel = (type) => {
    return type === 'online' ? 'Online' : 'In-Person';
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(8px)'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
      
    );
  }

  return (
    
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
        p: 0,
        overflow: 'hidden'
      }}
    >
       
      {/* Main Content */}
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 3,
        p: 3,
        flex: 1,
        overflow: 'auto'
      }} 
      
      >
        
        
        {/* Left Content - 70% */}
        <Box sx={{
          flex: { xs: 1, lg: 7 },
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}>
          {/* Header */}
      
          <Box>
            
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {job?.jobTitle || "Job Title"}
            </Typography>
            {error && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}
          </Box>
          

          {/* Stats Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {[
              {
                title: "Total Candidate Sourced",
                value: totalCandidates,
                icon: <CandidateIcon />,
                color: theme.palette.warning.main,
                onClick: handleViewJobCandidates
              },
              {
                title: "Total Interviews",
                value: interviews.total,
                icon: <InterviewIcon />,
                color: theme.palette.info.main,
                onClick: () => navigate('/interviews')
              },
              // {
              //   title: "Online Interviews",
              //   value: interviews.online,
              //   icon: <OnlineIcon />,
              //   color: theme.palette.primary.main,
              //   onClick: () => navigate('/interviews/upcoming')
              // },
              // {
              //   title: "Offline Interviews",
              //   value: interviews.offline,
              //   icon: <OfflineIcon />,
              //   color: theme.palette.secondary.main,
              //   onClick: () => navigate('/offline-interviews/upcoming')
              // },
              {
                title: "Acceptance Rate",
                value: `${acceptanceRate.toFixed(1)}%`,
                icon: <CheckCircleIcon />,
                color: theme.palette.success.main,
              },
              {
                title: "Positions",
                value: `${closedPosition}/${job?.jobFormId?.openings || 0}`,
                icon: <GroupIcon />,
                color: theme.palette.primary.main,
              },
            ].map((stat, index) => (
              <GlassCard
                key={index}
                onClick={stat.onClick || undefined}
                sx={{
                  cursor: stat.onClick ? 'pointer' : 'default',
                  '&:hover': {
                    transform: stat.onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: stat.onClick ? `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}` : 'none',
                    borderColor: stat.onClick ? alpha(theme.palette.primary.main, 0.3) : 'none'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1
                  }}>
                    <Avatar sx={{
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                      width: 36,
                      height: 36
                    }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </GlassCard>
            ))}
          </Box>

          {/* Upcoming Interviews List - Only show if we have data */}
          {interviews.upcomingInterviews.length > 0 && (
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    <CalendarIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                    Upcoming Interviews
                  </Typography>
                  <GradientButton
                    size="small"
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/interviews')}
                  >
                    View All
                  </GradientButton>
                </Box>

                <Stack spacing={2}>
                  {interviews.upcomingInterviews.slice(0, 3).map((interview) => (
                    <Paper
                      key={interview._id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.3)
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {interview.candidate?.name || 'No name'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getInterviewTypeIcon(interview.type)}
                            <Typography variant="body2" color="text.secondary">
                              {getInterviewTypeLabel(interview.type)}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={interview.status || 'scheduled'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: interview.status === 'scheduled' ?
                              `${theme.palette.info.light}30` :
                              `${theme.palette.success.light}30`,
                            color: interview.status === 'scheduled' ?
                              theme.palette.info.dark :
                              theme.palette.success.dark
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon fontSize="small" sx={{
                            mr: 1,
                            color: theme.palette.text.secondary
                          }} />
                          <Typography variant="body2">
                            {interview.date ? new Date(interview.date).toLocaleDateString() : 'No date'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon fontSize="small" sx={{
                            mr: 1,
                            color: theme.palette.text.secondary
                          }} />
                          <Typography variant="body2">
                            {interview.startTime || 'No time'} ({interview.timezone || 'UTC'})
                          </Typography>
                        </Box>
                      </Box>

                      {/* Show meeting link for online interviews or location for offline */}
                      {interview.type === 'online' && interview.meetingLink && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Meeting Link:
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                            {interview.meetingLink}
                          </Typography>
                        </Box>
                      )}

                      {interview.type === 'offline' && interview.location && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Location:
                          </Typography>
                          <Typography variant="body2">
                            {interview.location.building}, {interview.location.address}, Floor {interview.location.floor}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                        {interview.interviewers?.map((interviewer) => (
                          <Chip
                            key={interviewer._id}
                            avatar={<Avatar alt={interviewer.name} sx={{ width: 24, height: 24 }}>
                              {interviewer.name?.charAt(0) || '?'}
                            </Avatar>}
                            label={interviewer.name || 'Interviewer'}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              background: alpha(theme.palette.primary.light, 0.1)
                            }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowIcon />}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 2,
                            py: 0.5
                          }}
                          onClick={() => navigate(`/interviews/${interview._id}`)}
                        >
                          Details
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </GlassCard>
          )}

          {/* Bottom Row */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            {/* Candidate Pipeline Pie Chart */}
            <GlassCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  <TimelineIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
                  Candidate Pipeline
                </Typography>
                <Box sx={{ height: 300 }}>
                  {pipelineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPipelineData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {getPipelineData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%',
                      flexDirection: 'column'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                        No pipeline data available
                      </Typography>
                      <Button 
                        variant="outlined" 
                        onClick={handleViewJobCandidates}
                        startIcon={<CandidateIcon />}
                      >
                        View Candidates
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </GlassCard>

            {/* Job Details */}
            <GlassCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  <AssignmentIcon sx={{ mr: 1.5, color: theme.palette.secondary.main }} />
                  Job Details
                </Typography>

                {job ? (
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Job Title
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {job.jobTitle}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Department
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {job.department}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Posted Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {stripHtmlTags(job.jobDesc)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Status: Active
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Type: Full-time
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Location: On-site
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Job details not available
                  </Typography>
                )}
              </CardContent>
            </GlassCard>
          </Box>
        </Box>

        {/* Right Sidebar - 30% */}
        <Box sx={{
          flex: { xs: 1, lg: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: 320
        }}>
          {/* Notes Card */}
          <GlassCard sx={{ flex: 1, mt: 9 }}>
            <CardContent sx={{
              p: 3,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  <NoteIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
                  My Notes
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setNewNote("");
                    setEditingNoteId(null);
                    setShowNoteForm(true);
                  }}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: theme.palette.common.white,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
                    }
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {showNoteForm && (
                <Paper
                  elevation={0}
                  sx={{
                    mb: 3,
                    p: 2.5,
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write your note here..."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputProps={{
                      sx: {
                        borderRadius: 1,
                        background: theme.palette.background.paper
                      }
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                    <Button
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setShowNoteForm(false);
                        setEditingNoteId(null);
                        setNewNote("");
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <GradientButton
                      size="small"
                      startIcon={<NoteIcon />}
                      onClick={handleAddNote}
                    >
                      {editingNoteId ? "Update Note" : "Save Note"}
                    </GradientButton>
                  </Box>
                </Paper>
              )}

              <Box sx={{
                flex: 1,
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: alpha(theme.palette.primary.main, 0.5),
                  borderRadius: '3px',
                }
              }}>
                {notesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : notes.length > 0 ? (
                  <Stack spacing={2}>
                    {notes.map((note) => (
                      <Paper
                        key={note._id}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          background: alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                            borderColor: alpha(theme.palette.primary.main, 0.3)
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {note.content}
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {note.createdBy?.username || 'You'} • {new Date(note.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleEditNote(note)}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteNote(note._id)}
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    color: 'text.secondary'
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}>
                      <NoteIcon sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main
                      }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      No notes yet
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, maxWidth: '80%' }}>
                      Add notes to track important information about candidates or hiring process
                    </Typography>
                    <GradientButton
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setShowNoteForm(true)}
                    >
                      Add your first note
                    </GradientButton>
                  </Box>
                )}
              </Box>
            </CardContent>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate('/interviews/schedule')}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    p: 1.5,
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.divider, 0.2),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  Schedule Interview
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<EditIcon />}
                  onClick={handleUpdateJobPosting}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    p: 1.5,
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.divider, 0.2),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  Update Job Posting
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<PositionIcon />}
                  onClick={handleCreateJobPosting}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    p: 1.5,
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.divider, 0.2),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  Create New Position
                </Button>
              </Box>
            </CardContent>
          </GlassCard>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;