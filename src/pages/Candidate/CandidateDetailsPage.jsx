

// import React from "react";
// import {
//   Box,
//   Avatar,
//   Typography,
//   Divider,
//   Chip,
//   Tabs,
//   Tab,
//   Button,
//   Container,
//   Card,
//   CardContent,
//   TextField,
//   Grid,
//   CircularProgress,
//   Badge,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Breadcrumbs,
//   Link,
//   Tooltip,
//   Fab,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent,
//   Menu,
//   MenuItem
// } from "@mui/material";
// import {
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Work as WorkIcon,
//   LocationOn as LocationIcon,
//   CalendarToday as DateIcon,
//   Person as PersonIcon,
//   Description as NotesIcon,
//   ArrowBack as BackIcon,
//   Schedule as ScheduleIcon,
//   Chat as MessageIcon,
//   WhatsApp as WhatsAppIcon,
//   Edit as EditIcon,
//   Share as ShareIcon,
//   Verified as VerifiedIcon,
//   MonetizationOn as SalaryIcon,
//   Flag as NoticePeriodIcon,
//   NoteAdd as NoteAddIcon,
//   Description as DocumentIcon,
//   VideoCall as VideoIcon,
//   Timeline as TimelineIcon,
//   BarChart as BarChartIcon,
//   CheckCircle as HiredIcon,
//   Delete as RejectIcon,
//   Error as OnHoldIcon,
//   GetApp as DownloadIcon,
//   InsertDriveFile as FileIcon,
//   PictureAsPdf as PdfIcon,
//   Send as SendIcon,
//   Close as CloseIcon,
//   ThumbUp as SelectedIcon,
//   ThumbDown as RejectedIcon,
//   Star as StarIcon,
//   StarHalf as StarHalfIcon,
//   StarBorder as StarBorderIcon,
//   CheckCircle as CheckCircleIcon,
//   MoreVert as MoreIcon,
//   Delete as DeleteIcon,
//   Update as UpdateIcon
// } from "@mui/icons-material";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { styled } from '@mui/material/styles';

// const GradientCard = styled(Card)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//   color: theme.palette.common.white,
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: theme.shadows[6],
// }));

// const StyledTabs = styled(Tabs)({
//   '& .MuiTabs-indicator': {
//     height: 4,
//     borderRadius: 2,
//   },
// });

// const StyledTab = styled(Tab)(({ theme }) => ({
//   textTransform: 'none',
//   fontWeight: theme.typography.fontWeightMedium,
//   fontSize: theme.typography.pxToRem(15),
//   marginRight: theme.spacing(1),
//   color: theme.palette.text.secondary,
//   '&.Mui-selected': {
//     color: theme.palette.primary.main,
//     fontWeight: theme.typography.fontWeightBold,
//   },
// }));

// const StatusChip = styled(Chip)(({ theme, status }) => {
//   let color;
//   switch (status) {
//     case 'Hired': color = theme.palette.success.main; break;
//     case 'Interview': color = theme.palette.info.main; break;
//     case 'Rejected': color = theme.palette.error.main; break;
//     case 'On Hold': color = theme.palette.warning.main; break;
//     case 'Archived': color = theme.palette.text.disabled; break;
//     case 'Selected': color = theme.palette.success.main; break;
//     case 'Preboarding': color = theme.palette.info.main; break;
//     case 'Screening': color = theme.palette.info.main; break;
//     case 'Sourced': color = theme.palette.info.main; break;
//     default: color = theme.palette.primary.main;
//   }
//   return {
//     backgroundColor: color,
//     color: theme.palette.common.white,
//     fontWeight: 'bold',
//     borderRadius: theme.shape.borderRadius,
//   };
// });

// const ResumeViewer = styled(Box)({
//   height: '500px',
//   border: '1px solid #e0e0e0',
//   borderRadius: '8px',
//   overflow: 'hidden',
//   display: 'flex',
//   flexDirection: 'column'
// });

// const ResumeToolbar = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: theme.spacing(1),
//   backgroundColor: theme.palette.grey[100],
//   borderBottom: '1px solid #e0e0e0'
// }));

// const ResumeContent = styled(Box)({
//   flex: 1,
//   overflow: 'auto',
//   padding: '20px',
//   backgroundColor: '#fff',
//   backgroundImage: 'linear-gradient(#f5f5f5 1px, transparent 1px), linear-gradient(90deg, #f5f5f5 1px, transparent 1px)',
//   backgroundSize: '20px 20px'
// });

// const MessageBubble = styled(Box)(({ theme, sent }) => ({
//   maxWidth: '70%',
//   padding: theme.spacing(1.5),
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: sent ? theme.palette.primary.main : theme.palette.grey[200],
//   color: sent ? theme.palette.common.white : theme.palette.text.primary,
//   alignSelf: sent ? 'flex-end' : 'flex-start',
//   marginBottom: theme.spacing(1),
//   wordBreak: 'break-word',
// }));

// const RatingStars = ({ value }) => {
//   const stars = [];
//   const fullStars = Math.floor(value);
//   const hasHalfStar = value % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//   for (let i = 0; i < fullStars; i++) {
//     stars.push(<StarIcon key={`full-${i}`} color="primary" />);
//   }

//   if (hasHalfStar) {
//     stars.push(<StarHalfIcon key="half" color="primary" />);
//   }

//   for (let i = 0; i < emptyStars; i++) {
//     stars.push(<StarBorderIcon key={`empty-${i}`} color="primary" />);
//   }

//   return (
//     <Box display="flex" alignItems="center">
//       {stars}
//       <Typography variant="body2" ml={1}>({value})</Typography>
//     </Box>
//   );
// };

// const fetchCandidateById = async (id) => {
//   const token = localStorage.getItem("token");

//   const response = await axios.get(
//     `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data;
// };

// const fetchCandidateStageHistory = async (id) => {
//   const token = localStorage.getItem("token");
  
//   const response = await axios.get(
//     `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/${id}/stage-history`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
  
//   return response.data;
// };

// const fetchCandidateMessages = async (id) => {
//   const response = await axios.get(`https://hire-onboardbackend-production.up.railway.app/api/messages/${id}`);
//   return response.data;
// };

// const fetchCandidateRemarks = async (id) => {
//   console.log("Fetching remarks for ID:", id);

//   const response = await axios.get(`https://hire-onboardbackend-production.up.railway.app/api/candidate-comments/${id}`);
//   console.log(response)
//   return response.data;
// };

// const fetchCandidateNotes = async (id) => {
//   const response = await axios.get(`https://hire-onboardbackend-production.up.railway.app/api/candidate-notes/candidate/${id}`);
//   return response.data;
// };

// const createCandidateNote = async (noteData) => {
//   const response = await axios.post(`https://hire-onboardbackend-production.up.railway.app/api/candidate-notes`, noteData);
//   return response.data;
// };

// const updateCandidateNote = async ({ id, noteData }) => {
//   const response = await axios.put(`https://hire-onboardbackend-production.up.railway.app/api/candidate-notes/${id}`, noteData);
//   return response.data;
// };

// const deleteCandidateNote = async (id) => {
//   const response = await axios.delete(`https://hire-onboardbackend-production.up.railway.app/api/candidate-notes/${id}`);
//   return response.data;
// };

// const downloadCandidateResume = async (id) => {
//   const token = localStorage.getItem("token");
  
//   const response = await axios.get(
//     `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/download-resume/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       responseType: 'blob'
//     }
//   );
  
//   return response;
// };

// const previewCandidateResume = async (id) => {
//   const token = localStorage.getItem("token");
  
//   const response = await axios.get(
//     `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/preview-resume/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       responseType: 'blob'
//     }
//   );
  
//   return response;
// };

// const CandidateDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [tabValue, setTabValue] = React.useState(0);
//   const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
//   const [snackbarOpen, setSnackbarOpen] = React.useState(false);
//   const [snackbarMessage, setSnackbarMessage] = React.useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
//   const [resumeBlobUrl, setResumeBlobUrl] = React.useState(null);
//   const [isResumeLoading, setIsResumeLoading] = React.useState(false);
//   const [newMessage, setNewMessage] = React.useState('');
//   const [newRemark, setNewRemark] = React.useState('');
//   const [newNote, setNewNote] = React.useState('');
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [selectedNote, setSelectedNote] = React.useState(null);
//   const [editNoteId, setEditNoteId] = React.useState(null);
//   const [editNoteText, setEditNoteText] = React.useState('');

//   const hiringStages = ['Sourced', 'Screening', 'Interview', 'Preboarding', 'Hired', 'Rejected', 'Archived'];

//   const { data: candidate, isLoading, error } = useQuery({
//     queryKey: ['candidate', id],
//     queryFn: () => fetchCandidateById(id),
//   });

//   const { data: stageHistoryData } = useQuery({
//     queryKey: ['candidateStageHistory', id],
//     queryFn: () => fetchCandidateStageHistory(id),
//     enabled: tabValue === 2 // Only fetch when cooling period tab is active
//   });

//   const { data: messagesData } = useQuery({
//     queryKey: ['candidateMessages', id],
//     queryFn: () => fetchCandidateMessages(id),
//     enabled: tabValue === 4 // Only fetch when messages tab is active
//   });

//   const {
//     data: remarksData,
//   } = useQuery({
//     queryKey: ['candidateRemarks', id],
//     queryFn: () => fetchCandidateRemarks(id),
//     enabled: !!id,
//   });

//   const { data: notesData } = useQuery({
//     queryKey: ['candidateNotes', id],
//     queryFn: () => fetchCandidateNotes(id),
//   });

//   const { data: feedbackData } = useQuery({
//     queryKey: ['candidateFeedback', id],
//     queryFn: () => axios.get(`https://hire-onboardbackend-production.up.railway.app/api/feedback/candidate/${id}`).then(res => res.data),
//     enabled: !!candidate && (candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected')
//   });

//   const createNoteMutation = useMutation({
//     mutationFn: createCandidateNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['candidateNotes', id]);
//       setNewNote('');
//       setSnackbarMessage('Note added successfully!');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     },
//     onError: (error) => {
//       setSnackbarMessage(error.response?.data?.message || 'Failed to add note');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   });

//   const updateNoteMutation = useMutation({
//     mutationFn: updateCandidateNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['candidateNotes', id]);
//       setEditNoteId(null);
//       setEditNoteText('');
//       setSnackbarMessage('Note updated successfully!');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     },
//     onError: (error) => {
//       setSnackbarMessage(error.response?.data?.message || 'Failed to update note');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   });

//   const deleteNoteMutation = useMutation({
//     mutationFn: deleteCandidateNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['candidateNotes', id]);
//       setSnackbarMessage('Note deleted successfully!');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     },
//     onError: (error) => {
//       setSnackbarMessage(error.response?.data?.message || 'Failed to delete note');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   });

//   const feedback = feedbackData?.data?.[0];
//   const messages = messagesData?.data || [];
//   const remarks = remarksData || [];
//   const notes = notesData || [];
//   const stageHistory = stageHistoryData || {};
//   const currentStageIndex = hiringStages.indexOf(candidate?.stage?.name || 'Sourced');

//   React.useEffect(() => {
//     const loadResumePreview = async () => {
//       if (candidate?.resume?.path && tabValue === 1) {
//         setIsResumeLoading(true);
//         try {
//           const response = await previewCandidateResume(id);
//           const blob = new Blob([response.data], { type: response.headers['content-type'] });
//           const url = window.URL.createObjectURL(blob);
//           setResumeBlobUrl(url);
//         } catch (err) {
//           console.error("Failed to load resume preview:", err);
//           setResumeBlobUrl(null);
//           setSnackbarMessage(err.response?.data?.error || 'Failed to load resume preview');
//           setSnackbarSeverity('error');
//           setSnackbarOpen(true);
//         } finally {
//           setIsResumeLoading(false);
//         }
//       }
//     };

//     loadResumePreview();

//     return () => {
//       if (resumeBlobUrl) {
//         URL.revokeObjectURL(resumeBlobUrl);
//       }
//     };
//   }, [candidate, tabValue, id]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleDownloadResume = async () => {
//     if (!candidate?.resume) {
//       setSnackbarMessage('No resume available to download');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     setIsResumeLoading(true);
//     try {
//       const response = await downloadCandidateResume(candidate._id);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;

//       const contentDisposition = response.headers['content-disposition'];
//       let filename = `${candidate.firstName}_${candidate.lastName}_Resume.pdf`;
      
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename=(.+)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }

//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       setTimeout(() => window.URL.revokeObjectURL(url), 100);

//       setSnackbarMessage('Download started');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error('Download error:', error);
//       setSnackbarMessage(error.response?.data?.error || 'Failed to download resume');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     } finally {
//       setIsResumeLoading(false);
//     }
//   };

//   const handlePreviewResume = async () => {
//     if (!candidate?.resume) {
//       setSnackbarMessage('No resume available to preview');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     setIsResumeLoading(true);
//     try {
//       const response = await previewCandidateResume(candidate._id);
//       const blob = new Blob([response.data], { type: response.headers['content-type'] });
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, '_blank');
//     } catch (error) {
//       console.error('Preview error:', error);
//       setSnackbarMessage(error.response?.data?.error || 'Failed to preview resume');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     } finally {
//       setIsResumeLoading(false);
//     }
//   };

//   const handleShareClick = () => {
//     setShareDialogOpen(true);
//   };

//   const handleShareDialogClose = () => {
//     setShareDialogOpen(false);
//   };

//   const handleShareResume = async (method = 'clipboard') => {
//     if (!candidate?.resume) {
//       setSnackbarMessage('No resume available to share');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     const resumeUrl = `https://hire-onboardbackend-production.up.railway.app/api/resumes/${candidate._id}`;

//     try {
//       if (method === 'native' && navigator.share) {
//         await navigator.share({
//           title: `${candidate.firstName} ${candidate.lastName}'s Resume`,
//           text: `Check out ${candidate.firstName}'s resume`,
//           url: resumeUrl,
//         });
//       } else {
//         await navigator.clipboard.writeText(resumeUrl);
//         setSnackbarMessage('Resume link copied to clipboard!');
//         setSnackbarSeverity('success');
//         setSnackbarOpen(true);
//       }
//       setShareDialogOpen(false);
//     } catch (err) {
//       console.error('Error sharing:', err);
//       setSnackbarMessage('Failed to share resume');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       // Send message via WhatsApp
//       const phone = candidate.mobile.replace(/\D/g, '');
//       const message = `Hi ${candidate.firstName}, ${newMessage}`;
//       const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
//       window.open(url, '_blank');

//       // Save message to database
//       await axios.post(`https://hire-onboardbackend-production.up.railway.app/api/messages`, {
//         candidateId: id,
//         content: newMessage,
//         sender: 'Admin',
//         sent: true
//       });

//       setNewMessage('');
//       setSnackbarMessage('Message sent via WhatsApp!');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setSnackbarMessage('Failed to send message');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const handleAddNote = () => {
//     if (!newNote.trim()) return;
//     createNoteMutation.mutate({
//       candidateId: id,
//       note: newNote
//     });
//   };

//   const handleUpdateNote = () => {
//     if (!editNoteText.trim()) return;
//     updateNoteMutation.mutate({
//       id: editNoteId,
//       noteData: { note: editNoteText }
//     });
//   };

//   const handleDeleteNote = (noteId) => {
//     deleteNoteMutation.mutate(noteId);
//     setAnchorEl(null);
//   };

//   const handleMenuOpen = (event, note) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedNote(note);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedNote(null);
//   };

//   const handleEditNote = () => {
//     setEditNoteId(selectedNote._id);
//     setEditNoteText(selectedNote.note);
//     handleMenuClose();
//   };

//   const handleCancelEdit = () => {
//     setEditNoteId(null);
//     setEditNoteText('');
//   };

//   const handleWhatsAppClick = () => {
//     if (!candidate?.mobile) {
//       setSnackbarMessage('No phone number available');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     const phone = candidate.mobile.replace(/\D/g, '');
//     const message = `Hi ${candidate.firstName}, regarding your application...`;
//     const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
//     window.open(url, '_blank');
//   };

//   const handleScheduleClick = () => {
//     setSnackbarMessage('Scheduling feature will be added soon!');
//     setSnackbarSeverity('info');
//     setSnackbarOpen(true);
//   };

//   const handleMessageClick = () => {
//     setTabValue(4);
//   };

//   const handleVideoCallClick = () => {
//     setSnackbarMessage('Video call feature will be added soon!');
//     setSnackbarSeverity('info');
//     setSnackbarOpen(true);
//   };

//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <Typography color="error" variant="h5">
//           {error.message}
//         </Typography>
//       </Box>
//     );
//   }

//   if (!candidate) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <Typography color="error" variant="h5">
//           Candidate not found
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
//       <Breadcrumbs sx={{ mb: 2 }}>
//         <Link color="inherit" onClick={() => navigate('/')}>Dashboard</Link>
//         <Link color="inherit" onClick={() => navigate('/candidates')}>Candidates</Link>
//         <Typography color="text.primary">{candidate.firstName} {candidate.lastName}</Typography>
//       </Breadcrumbs>

//       <Grid container spacing={3}>
//         {/* Left Column - Main Content */}
//         <Grid item xs={12} md={8}>
//           <GradientCard sx={{ mb: 3 }}>
//             <CardContent>
//               <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center", gap: 3 }}>
//                 <Badge
//                   overlap="circular"
//                   badgeContent={
//                     <Tooltip title="Verified profile">
//                       <VerifiedIcon color="primary" sx={{ bgcolor: 'white', borderRadius: '50%' }} />
//                     </Tooltip>
//                   }
//                 >
//                   <Avatar sx={{ width: 80, height: 80, fontSize: "2rem", border: '3px solid white' }}>
//                     {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
//                   </Avatar>
//                 </Badge>
//                 <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
//                   <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
//                     {candidate.firstName} {candidate.lastName}
//                   </Typography>
//                   <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
//                       <EmailIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
//                       <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
//                         {candidate.email}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
//                       <PhoneIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
//                       <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
//                         {candidate.mobile}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               </Box>
//             </CardContent>
//           </GradientCard>

//           <StyledTabs value={tabValue} onChange={handleTabChange} variant="scrollable" sx={{ mb: 2 }}>
//             <StyledTab label="Profile" icon={<PersonIcon />} iconPosition="start" />
//             <StyledTab label="Resume" icon={<DocumentIcon />} iconPosition="start" />
//             <StyledTab label="Cooling Period" icon={<TimelineIcon />} iconPosition="start" />
//             {(candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected') && (
//               <StyledTab label="Interview Feedback" icon={<SelectedIcon />} iconPosition="start" />
//             )}
//             <StyledTab label="Messages" icon={<MessageIcon />} iconPosition="start" />
//           </StyledTabs>

//           {tabValue === 0 && (
//             <Box>
//               <Card sx={{ mb: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <PersonIcon color="primary" /> Personal Details
//                   </Typography>
//                   <Divider sx={{ my: 2 }} />
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <List dense>
//                         <ListItem>
//                           <ListItemIcon><DateIcon color="primary" /></ListItemIcon>
//                           <ListItemText
//                             primary="Date of Birth"
//                             secondary={
//                               candidate.dob
//                                 ? new Date(candidate.dob).toLocaleDateString(undefined, {
//                                   year: 'numeric',
//                                   month: 'long',
//                                   day: 'numeric'
//                                 })
//                                 : 'Not specified'
//                             }
//                           />
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
//                           <ListItemText primary="Location" secondary={candidate.currentLocation?.name || 'Not specified'} />
//                         </ListItem>
//                       </List>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <List dense>
//                         <ListItem>
//                           <ListItemIcon><NoticePeriodIcon color="primary" /></ListItemIcon>
//                           <ListItemText primary="Notice Period" secondary={`${candidate.availableToJoin || '0'} days`} />
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon><SalaryIcon color="primary" /></ListItemIcon>
//                           <ListItemText primary="Current Salary" secondary={candidate.currentSalary || 'Not specified'} />
//                         </ListItem>
//                       </List>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               <Card sx={{ mb: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <BarChartIcon color="primary" /> Skills & Expertise
//                   </Typography>
//                   <Divider sx={{ my: 2 }} />
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                     {Array.isArray(candidate.skills)
//                       ? candidate.skills.map((skill, index) => (
//                         <Chip
//                           key={index}
//                           label={skill}
//                           color={index % 2 === 0 ? "primary" : "secondary"}
//                           variant={index % 3 === 0 ? "filled" : "outlined"}
//                           sx={{ borderRadius: 1 }}
//                         />
//                       ))
//                       : <Typography>No skills listed</Typography>}
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           )}

//           {tabValue === 1 && (
//             <Card>
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                   <Typography variant="h6" fontWeight="bold">Resume</Typography>
//                   <Box sx={{ display: 'flex', gap: 1 }}>
//                     <Button
//                       variant="contained"
//                       startIcon={<DownloadIcon />}
//                       onClick={handleDownloadResume}
//                       disabled={!candidate?.resume || isResumeLoading}
//                     >
//                       {isResumeLoading ? 'Loading...' : 'Download'}
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       startIcon={<ShareIcon />}
//                       onClick={handleShareClick}
//                       disabled={!candidate?.resume}
//                     >
//                       Share
//                     </Button>
//                   </Box>
//                 </Box>

//                 <ResumeViewer>
//                   <ResumeToolbar>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         startIcon={<FileIcon />}
//                         onClick={handleDownloadResume}
//                         disabled={!candidate?.resume || isResumeLoading}
//                       >
//                         {isResumeLoading ? 'Loading...' : 'Download'}
//                       </Button>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         startIcon={<PdfIcon />}
//                         onClick={handlePreviewResume}
//                         disabled={!candidate?.resume || isResumeLoading}
//                       >
//                         {isResumeLoading ? 'Loading...' : 'Preview'}
//                       </Button>
//                     </Box>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton
//                         size="small"
//                         onClick={handleDownloadResume}
//                         disabled={!candidate?.resume || isResumeLoading}
//                       >
//                         <DownloadIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         onClick={handleShareClick}
//                         disabled={!candidate?.resume}
//                       >
//                         <ShareIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </ResumeToolbar>
//                   <ResumeContent>
//                     {candidate?.resume ? (
//                       isResumeLoading ? (
//                         <Box display="flex" justifyContent="center" alignItems="center" height="100%">
//                           <CircularProgress />
//                         </Box>
//                       ) : (
//                         <iframe
//                           src={`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/preview-resume/${candidate._id}`}
//                           style={{ width: '100%', height: '100%', border: 'none' }}
//                           title="Resume Viewer"
//                         />
//                       )
//                     ) : (
//                       <Box textAlign="center" pt={4}>
//                         <Typography variant="h6" color="textSecondary">
//                           No resume available for this candidate
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary" mt={2}>
//                           Upload a resume to view it here
//                         </Typography>
//                       </Box>
//                     )}
//                   </ResumeContent>
//                 </ResumeViewer>
//               </CardContent>
//             </Card>
//           )}

//           {tabValue === 2 && (
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom>
//                   Hiring Process - Cooling Period
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />
                
//                 {stageHistory.success ? (
//                   <>
//                     <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         Current Stage: {stageHistory.currentStage}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         In this stage since: {stageHistory.currentStageSince ? 
//                           new Date(stageHistory.currentStageSince).toLocaleDateString() : 
//                           'Not available'}
//                       </Typography>
//                     </Box>
                    
//                     <Stepper activeStep={currentStageIndex} orientation="vertical">
//                       {hiringStages.map((stage, index) => (
//                         <Step key={stage}>
//                           <StepLabel>
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               {stage}
//                             </Typography>
//                           </StepLabel>
//                           <StepContent>
//                             <Typography variant="body2">
//                               {index < currentStageIndex ? (
//                                 `Completed`
//                               ) : index === currentStageIndex ? (
//                                 `Currently in this stage since ${new Date(stageHistory.currentStageSince).toLocaleDateString()}`
//                               ) : (
//                                 'Pending'
//                               )}
//                             </Typography>
//                           </StepContent>
//                         </Step>
//                       ))}
//                     </Stepper>
                    
//                     {stageHistory.history && stageHistory.history.length > 0 && (
//                       <Box sx={{ mt: 3 }}>
//                         <Typography variant="h6" fontWeight="bold" gutterBottom>
//                           Stage History
//                         </Typography>
//                         <List>
//                           {stageHistory.history.map((historyItem, index) => (
//                             <ListItem key={index}>
//                               <ListItemText
//                                 primary={`From ${historyItem.from} to ${historyItem.to}`}
//                                 secondary={`Changed on ${new Date(historyItem.changedAt).toLocaleDateString()} by ${historyItem.changedBy?.name || 'Unknown'}`}
//                               />
//                             </ListItem>
//                           ))}
//                         </List>
//                       </Box>
//                     )}
//                   </>
//                 ) : (
//                   <Box textAlign="center" py={4}>
//                     <Typography variant="body1" color="text.secondary">
//                       No stage history available
//                     </Typography>
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           )}

//           {tabValue === 3 && (candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected') && (
//             <Card>
//               <CardContent>
//                 {feedback ? (
//                   <>
//                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                       Interview Feedback
//                     </Typography>
//                     <Divider sx={{ mb: 3 }} />

//                     <Grid container spacing={3}>
//                       <Grid item xs={12} md={6}>
//                         <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                           Interview Details
//                         </Typography>
//                         <List dense>
//                           <ListItem>
//                             <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
//                             <ListItemText
//                               primary="Interviewer"
//                               secondary={feedback.interviewerId?.name || 'Not specified'}
//                             />
//                           </ListItem>
//                           <ListItem>
//                             <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
//                             <ListItemText
//                               primary="Job Position"
//                               secondary={feedback.jobId?.jobName || 'Not specified'}
//                             />
//                           </ListItem>
//                           <ListItem>
//                             <ListItemIcon><DateIcon color="primary" /></ListItemIcon>
//                             <ListItemText
//                               primary="Submitted On"
//                               secondary={new Date(feedback.submittedAt).toLocaleString()}
//                             />
//                           </ListItem>
//                           <ListItem>
//                             <ListItemIcon>
//                               {feedback.status === 'Selected' ? (
//                                 <SelectedIcon color="success" />
//                               ) : (
//                                 <RejectedIcon color="error" />
//                               )}
//                             </ListItemIcon>
//                             <ListItemText
//                               primary="Final Decision"
//                               secondary={
//                                 <StatusChip
//                                   label={feedback.status}
//                                   status={feedback.status}
//                                   size="small"
//                                 />
//                               }
//                             />
//                           </ListItem>
//                         </List>
//                       </Grid>

//                       <Grid item xs={12} md={6}>
//                         <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                           Ratings
//                         </Typography>
//                         <List dense>
//                           <ListItem>
//                             <ListItemText
//                               primary="Technical Skills"
//                               secondary={<RatingStars value={feedback.technicalSkills} />}
//                             />
//                           </ListItem>
//                           <ListItem>
//                             <ListItemText
//                               primary="Communication Skills"
//                               secondary={<RatingStars value={feedback.communicationSkills} />}
//                             />
//                           </ListItem>
//                           <ListItem>
//                             <ListItemText
//                               primary="Problem Solving"
//                               secondary={<RatingStars value={feedback.problemSolving} />}
//                             />
//                           </ListItem>
//                           <ListItem>
//                             <ListItemText
//                               primary="Cultural Fit"
//                               secondary={<RatingStars value={feedback.culturalFit} />}
//                             />
//                           </ListItem>
//                         </List>
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                           Overall Feedback
//                         </Typography>
//                         <Card variant="outlined" sx={{ p: 2, backgroundColor: 'background.paper' }}>
//                           <Typography variant="body1">
//                             {feedback.overallFeedback}
//                           </Typography>
//                         </Card>
//                       </Grid>
//                     </Grid>
//                   </>
//                 ) : (
//                   <Box textAlign="center" py={4}>
//                     <Typography variant="h6" color="textSecondary">
//                       No feedback available yet
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary" mt={2}>
//                       Feedback will appear here once submitted by the interviewer
//                     </Typography>
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           )}

//           {tabValue === 4 && (
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom>
//                   Messages with {candidate.firstName}
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />

//                 <Box sx={{
//                   height: '400px',
//                   overflowY: 'auto',
//                   p: 2,
//                   bgcolor: 'background.default',
//                   borderRadius: 1,
//                   mb: 2
//                 }}>
//                   {messages.length > 0 ? (
//                     messages.map((message, index) => (
//                       <MessageBubble key={index} sent={message.sent}>
//                         <Typography variant="body2">{message.content}</Typography>
//                         <Typography variant="caption" display="block" textAlign="right" mt={1}>
//                           {new Date(message.timestamp).toLocaleString()} • {message.sender}
//                         </Typography>
//                       </MessageBubble>
//                     ))
//                   ) : (
//                     <Box textAlign="center" py={4}>
//                       <Typography color="text.secondary">
//                         No messages yet with this candidate
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>

//                 <Box sx={{ display: 'flex', gap: 1 }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Type your message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     InputProps={{
//                       startAdornment: <MessageIcon color="primary" sx={{ mr: 1 }} />,
//                     }}
//                   />
//                   <Button
//                     variant="contained"
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim()}
//                   >
//                     <SendIcon />
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Grid>

//         {/* Right Column - Sidebar Content */}
//         <Grid item xs={12} md={4}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             {/* Hiring Status Card */}
//             <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                   <Typography variant="h6" fontWeight="bold">Hiring Status</Typography>
//                   <StatusChip label={candidate.stage?.name} status={candidate.stage?.name} />
//                 </Box>

//                 <Box sx={{ mb: 3 }}>
//                   <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     position: 'relative',
//                     mb: 1
//                   }}>
//                     <Box sx={{
//                       position: 'absolute',
//                       top: '50%',
//                       left: 0,
//                       right: 0,
//                       height: 4,
//                       bgcolor: 'grey.200',
//                       transform: 'translateY(-50%)',
//                       zIndex: 0
//                     }} />

//                     <Box sx={{
//                       position: 'absolute',
//                       top: '50%',
//                       left: 0,
//                       width: `${(currentStageIndex + 1) / hiringStages.length * 100}%`,
//                       height: 4,
//                       bgcolor: 'primary.main',
//                       transform: 'translateY(-50%)',
//                       zIndex: 1,
//                       transition: 'width 0.5s ease'
//                     }} />

//                     {hiringStages.map((stage, index) => (
//                       <Box key={stage} sx={{
//                         position: 'relative',
//                         zIndex: 2,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center'
//                       }}>
//                         <Box sx={{
//                           width: 32,
//                           height: 32,
//                           borderRadius: '50%',
//                           bgcolor: index <= currentStageIndex ? 'primary.main' : 'grey.300',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           color: index <= currentStageIndex ? 'common.white' : 'text.secondary',
//                           mb: 0.5
//                         }}>
//                           {index < currentStageIndex ? (
//                             <CheckCircleIcon fontSize="small" />
//                           ) : (
//                             <Typography variant="caption" fontWeight="bold">
//                               {index + 1}
//                             </Typography>
//                           )}
//                         </Box>
//                         <Typography variant="caption" fontWeight={index === currentStageIndex ? 'bold' : 'normal'}>
//                           {stage}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>

//                   <Typography variant="caption" color="text.secondary">
//                     {currentStageIndex + 1} of {hiringStages.length} stages completed
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Quick Actions Card */}
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Actions</Typography>
//                 <Grid container spacing={1}>
//                   <Grid item xs={6}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<ScheduleIcon />}
//                       fullWidth
//                       sx={{ py: 1.5 }}
//                       onClick={handleScheduleClick}
//                     >
//                       Schedule
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<MessageIcon />}
//                       fullWidth
//                       sx={{ py: 1.5 }}
//                       onClick={handleMessageClick}
//                     >
//                       Message
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<VideoIcon />}
//                       fullWidth
//                       sx={{ py: 1.5 }}
//                       onClick={handleVideoCallClick}
//                     >
//                       Video Call
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<WhatsAppIcon />}
//                       fullWidth
//                       sx={{ py: 1.5 }}
//                       onClick={handleWhatsAppClick}
//                     >
//                       WhatsApp
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* Notes Card */}
//             <Card>
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                   <Typography variant="h6" fontWeight="bold">Notes</Typography>
//                 </Box>

//                 {editNoteId ? (
//                   <>
//                     <TextField
//                       multiline
//                       rows={3}
//                       fullWidth
//                       value={editNoteText}
//                       onChange={(e) => setEditNoteText(e.target.value)}
//                       sx={{ mb: 2 }}
//                     />
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Button
//                         variant="contained"
//                         onClick={handleUpdateNote}
//                         disabled={!editNoteText.trim() || updateNoteMutation.isLoading}
//                       >
//                         {updateNoteMutation.isLoading ? 'Updating...' : 'Update'}
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         onClick={handleCancelEdit}
//                       >
//                         Cancel
//                       </Button>
//                     </Box>
//                   </>
//                 ) : (
//                   <>
//                     <TextField
//                       multiline
//                       rows={3}
//                       fullWidth
//                       placeholder="Add your notes..."
//                       variant="outlined"
//                       value={newNote}
//                       onChange={(e) => setNewNote(e.target.value)}
//                       sx={{ mb: 2 }}
//                       InputProps={{
//                         startAdornment: <NotesIcon color="primary" sx={{ mr: 1 }} />,
//                       }}
//                     />
//                     <Button
//                       variant="contained"
//                       fullWidth
//                       onClick={handleAddNote}
//                       disabled={!newNote.trim() || createNoteMutation.isLoading}
//                     >
//                       {createNoteMutation.isLoading ? 'Saving...' : 'Save Note'}
//                     </Button>
//                   </>
//                 )}

//                 <List sx={{ mt: 2 }}>
//                   {notes.length > 0 ? (
//                     notes.map((note) => (
//                       <ListItem key={note._id} sx={{ px: 0 }}>
//                         <ListItemIcon sx={{ minWidth: 32 }}><NotesIcon color="primary" fontSize="small" /></ListItemIcon>
//                         <ListItemText
//                           primary={note.note}
//                           secondary={
//                             <>
                              
//                               {` ${new Date(note.createdAt).toLocaleString()}`}
//                             </>
//                           }
//                         />
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleMenuOpen(e, note)}
//                         >
//                           <MoreIcon />
//                         </IconButton>
//                       </ListItem>
//                     ))
//                   ) : (
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
//                       No notes added yet
//                     </Typography>
//                   )}
//                 </List>
//               </CardContent>
//             </Card>

//             {/* HR Remarks Card */}
//             <Card>
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                   <Typography variant="h6" fontWeight="bold">HR Team Comments for this Candidate</Typography>
//                 </Box>
               
//                 <List sx={{ mt: 2 }}>
//                   {remarksData?.comments?.length > 0 ? (
//                     remarksData.comments.map((remark, i) => (
//                       <ListItem key={i} sx={{ px: 0 }}>
//                         <ListItemIcon sx={{ minWidth: 32 }}>
//                           <NotesIcon color="primary" fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={remark.text}
//                           secondary={
//                             <>
                            
//                               {` ${new Date(remark.date).toLocaleString()}`}
//                             </>
//                           }
//                         />
//                       </ListItem>
//                     ))
//                   ) : isLoading ? (
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
//                       Loading remarks...
//                     </Typography>
//                   ) : (
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
//                       No remarks yet from HR team
//                     </Typography>
//                   )}

//                 </List>

//               </CardContent>
//             </Card>
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Note Actions Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleEditNote}>
//           <ListItemIcon>
//             <UpdateIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Edit</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => handleDeleteNote(selectedNote._id)}>
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>

//      <Dialog open={shareDialogOpen} onClose={handleShareDialogClose}>
//   <DialogTitle>Share Resume</DialogTitle>
//   <DialogContent>
//     <Typography variant="body1" gutterBottom>
//       Choose how you want to share {candidate.firstName}'s resume:
//     </Typography>
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//       <Button
//         variant="contained"
//         startIcon={<ShareIcon />}
//         onClick={() => handleShareResume('native')}
//         disabled={!navigator.share}
//       >
//         Share via...
//       </Button>
//       <Button
//         variant="outlined"
//         startIcon={<FileIcon />}
//         onClick={() => handleShareResume('clipboard')}
//       >
//         Copy Link to Clipboard
//       </Button>
//     </Box>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleShareDialogClose}>Cancel</Button>
//   </DialogActions>
// </Dialog>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>

//       <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
//         <EditIcon />
//       </Fab>
//     </Container>
//   );
// };

// export default CandidateDetailsPage;


import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Chip,
  Tabs,
  Tab,
  Button,
  Container,
  Card,
  CardContent,
  TextField,
  Grid,
  CircularProgress,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  Tooltip,
  Fab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Menu,
  MenuItem,
  LinearProgress
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Description as NotesIcon,
  ArrowBack as BackIcon,
  Schedule as ScheduleIcon,
  Chat as MessageIcon,
  WhatsApp as WhatsAppIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  MonetizationOn as SalaryIcon,
  Flag as NoticePeriodIcon,
  NoteAdd as NoteAddIcon,
  Description as DocumentIcon,
  VideoCall as VideoIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  CheckCircle as HiredIcon,
  Delete as RejectIcon,
  Error as OnHoldIcon,
  GetApp as DownloadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Send as SendIcon,
  Close as CloseIcon,
  ThumbUp as SelectedIcon,
  ThumbDown as RejectedIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  School as EducationIcon,
  WorkHistory as ExperienceIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from '@mui/material/styles';
import { candidateService, externalServices } from '../../services/Candidates/candidatesDetailsSerivess';
import axios from 'axios';

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[6],
}));

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: 2,
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case 'Hired': color = theme.palette.success.main; break;
    case 'Interview': color = theme.palette.info.main; break;
    case 'Rejected': color = theme.palette.error.main; break;
    case 'On Hold': color = theme.palette.warning.main; break;
    case 'Archived': color = theme.palette.text.disabled; break;
    case 'Selected': color = theme.palette.success.main; break;
    case 'Preboarding': color = theme.palette.info.main; break;
    case 'Screening': color = theme.palette.info.main; break;
    case 'Sourced': color = theme.palette.info.main; break;
    default: color = theme.palette.primary.main;
  }
  return {
    backgroundColor: color,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    borderRadius: theme.shape.borderRadius,
  };
});

const ResumeViewer = styled(Box)({
  height: '500px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
});

const ResumeToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderBottom: '1px solid #e0e0e0'
}));

const ResumeContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  padding: '20px',
  backgroundColor: '#fff',
  backgroundImage: 'linear-gradient(#f5f5f5 1px, transparent 1px), linear-gradient(90deg, #f5f5f5 1px, transparent 1px)',
  backgroundSize: '20px 20px'
});

const MessageBubble = styled(Box)(({ theme, sent }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: sent ? theme.palette.primary.main : theme.palette.grey[200],
  color: sent ? theme.palette.common.white : theme.palette.text.primary,
  alignSelf: sent ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
  wordBreak: 'break-word',
}));

const SkillChip = styled(Chip)(({ theme, level }) => {
  let color;
  switch (level) {
    case 'high': color = theme.palette.success.main; break;
    case 'medium': color = theme.palette.warning.main; break;
    case 'low': color = theme.palette.error.main; break;
    default: color = theme.palette.primary.main;
  }
  return {
    backgroundColor: color,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    borderRadius: theme.shape.borderRadius,
  };
});

const RatingStars = ({ value }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} color="primary" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalfIcon key="half" color="primary" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarBorderIcon key={`empty-${i}`} color="primary" />);
  }

  return (
    <Box display="flex" alignItems="center">
      {stars}
      <Typography variant="body2" ml={1}>({value})</Typography>
    </Box>
  );
};

const fetchCandidateById = async (id) => {
  const response = await candidateService.getCandidate(id);
  return response.data;
};

const fetchCandidateStageHistory = async (id) => {
  const response = await candidateService.getStageHistory(id);
  return response.data;
};

const fetchCandidateMessages = async (id) => {
  const response = await externalServices.getMessages(id);
  return response.data;
};

const fetchCandidateRemarks = async (id) => {
  const response = await externalServices.getRemarks(id);
  return response.data;
};

const fetchCandidateNotes = async (id) => {
  const response = await candidateService.getNotes(id);
  return response.data;
};

const createCandidateNote = async (noteData) => {
  const response = await candidateService.createNote(noteData);
  return response.data;
};

const updateCandidateNote = async ({ id, noteData }) => {
  const response = await candidateService.updateNote(id, noteData);
  return response.data;
};

const deleteCandidateNote = async (id) => {
  const response = await candidateService.deleteNote(id);
  return response.data;
};

const downloadCandidateResume = async (id) => {
  const response = await candidateService.downloadResume(id);
  return response;
};

const previewCandidateResume = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/preview-resume/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      responseType: "blob", 
    }
  );

  return response;
};

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = React.useState(0);
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [resumeBlobUrl, setResumeBlobUrl] = React.useState(null);
  const [isResumeLoading, setIsResumeLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [newRemark, setNewRemark] = React.useState('');
  const [newNote, setNewNote] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNote, setSelectedNote] = React.useState(null);
  const [editNoteId, setEditNoteId] = React.useState(null);
  const [editNoteText, setEditNoteText] = React.useState('');

  const hiringStages = ['Sourced', 'Screening', 'Interview','Rejected', 'Preboarding', 'Hired',  'Archived'];

  const { data: candidateData, isLoading, error } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => fetchCandidateById(id),
  });

  const candidate = candidateData?.candidate;

  const { data: stageHistoryData } = useQuery({
    queryKey: ['candidateStageHistory', id],
    queryFn: () => fetchCandidateStageHistory(id),
    enabled: tabValue === 2
  });

  const { data: messagesData } = useQuery({
    queryKey: ['candidateMessages', id],
    queryFn: () => fetchCandidateMessages(id),
    enabled: tabValue === 4
  });

  const { data: remarksData } = useQuery({
    queryKey: ['candidateRemarks', id],
    queryFn: () => fetchCandidateRemarks(id),
    enabled: !!id,
  });

  const { data: notesData } = useQuery({
    queryKey: ['candidateNotes', id],
    queryFn: () => fetchCandidateNotes(id),
  });

  const { data: feedbackData } = useQuery({
    queryKey: ['candidateFeedback', id],
    queryFn: () => externalServices.getFeedback(id).then(res => res.data),
    enabled: !!candidate && (candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected')
  });

  const createNoteMutation = useMutation({
    mutationFn: createCandidateNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['candidateNotes', id]);
      setNewNote('');
      setSnackbarMessage('Note added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    },
    onError: (error) => {
      setSnackbarMessage(error.response?.data?.message || 'Failed to add note');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateCandidateNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['candidateNotes', id]);
      setEditNoteId(null);
      setEditNoteText('');
      setSnackbarMessage('Note updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    },
    onError: (error) => {
      setSnackbarMessage(error.response?.data?.message || 'Failed to update note');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteCandidateNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['candidateNotes', id]);
      setSnackbarMessage('Note deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    },
    onError: (error) => {
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete note');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  });

  const feedback = feedbackData?.data?.[0];
  const messages = messagesData?.data || [];
  const remarks = remarksData || [];
  const notes = notesData?.data?.candidateNotes || [];
  const stageHistory = stageHistoryData || {};
  const currentStageIndex = hiringStages.indexOf(candidate?.stage?.name || 'Sourced');

  React.useEffect(() => {
    const loadResumePreview = async () => {
      if (candidate?.resume?.url && tabValue === 1) {
        setIsResumeLoading(true);
        try {
          const response = await previewCandidateResume(id);
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          setResumeBlobUrl(url);
        } catch (err) {
          console.error("Failed to load resume preview:", err);
          setResumeBlobUrl(null);
          setSnackbarMessage(err.response?.data?.error || 'Failed to load resume preview');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } finally {
          setIsResumeLoading(false);
        }
      }
    };

    loadResumePreview();

    return () => {
      if (resumeBlobUrl) {
        URL.revokeObjectURL(resumeBlobUrl);
      }
    };
  }, [candidate, tabValue, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownloadResume = async () => {
    if (!candidate?.resume) {
      setSnackbarMessage('No resume available to download');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsResumeLoading(true);
    try {
      const response = await downloadCandidateResume(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `${candidate.firstName}_${candidate.lastName}_Resume.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      setSnackbarMessage('Download started');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Download error:', error);
      setSnackbarMessage(error.response?.data?.error || 'Failed to download resume');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsResumeLoading(false);
    }
  };

  const handlePreviewResume = async () => {
  setIsResumeLoading(true);
  try {
    const response = await previewCandidateResume(id);

    // create blob URL
    const blob = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(blob);

    // open in new tab
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Preview error:", error);
    setSnackbarMessage("Failed to preview resume");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setIsResumeLoading(false);
  }
};

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleShareResume = async (method = 'clipboard') => {
    if (!candidate?.resume) {
      setSnackbarMessage('No resume available to share');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const resumeUrl = `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/preview-resume/${id}`;

    try {
      if (method === 'native' && navigator.share) {
        await navigator.share({
          title: `${candidate.firstName} ${candidate.lastName}'s Resume`,
          text: `Check out ${candidate.firstName}'s resume`,
          url: resumeUrl,
        });
      } else {
        await navigator.clipboard.writeText(resumeUrl);
        setSnackbarMessage('Resume link copied to clipboard!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
      setShareDialogOpen(false);
    } catch (err) {
      console.error('Error sharing:', err);
      setSnackbarMessage('Failed to share resume');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Send message via WhatsApp
      const phone = candidate.mobile.replace(/\D/g, '');
      const message = `Hi ${candidate.firstName}, ${newMessage}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

      // Save message to database
      await axios.post(`https://hire-onboardbackend-production.up.railway.app/api/messages`, {
        candidateId: id,
        content: newMessage,
        sender: 'Admin',
        sent: true
        
      });

      setNewMessage('');
      setSnackbarMessage('Message sent via WhatsApp!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbarMessage('Failed to send message');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    createNoteMutation.mutate({
      candidateId: id,
      note: newNote
    });
  };

  const handleUpdateNote = () => {
    if (!editNoteText.trim()) return;
    updateNoteMutation.mutate({
      id: editNoteId,
      noteData: { note: editNoteText }
    });
  };

  const handleDeleteNote = (noteId) => {
    deleteNoteMutation.mutate(noteId);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, note) => {
    setAnchorEl(event.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const handleEditNote = () => {
    setEditNoteId(selectedNote._id);
    setEditNoteText(selectedNote.note);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setEditNoteId(null);
    setEditNoteText('');
  };

  const handleWhatsAppClick = () => {
    if (!candidate?.mobile) {
      setSnackbarMessage('No phone number available');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const phone = candidate.mobile.replace(/\D/g, '');
    const message = `Hi ${candidate.firstName}, regarding your application...`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleScheduleClick = () => {
    setSnackbarMessage('Scheduling feature will be added soon!');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleMessageClick = () => {
    setTabValue(4);
  };

  const handleVideoCallClick = () => {
    setSnackbarMessage('Video call feature will be added soon!');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h5">
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h5">
          Candidate not found
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Dashboard</Link>
        <Link color="inherit" onClick={() => navigate('/candidates')} sx={{ cursor: 'pointer' }}>Candidates</Link>
        <Typography color="text.primary">{candidate.firstName} {candidate.lastName}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} md={8}>
          <GradientCard sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center", gap: 3 }}>
                <Badge
                  overlap="circular"
                  badgeContent={
                    <Tooltip title="Verified profile">
                      <VerifiedIcon color="primary" sx={{ bgcolor: 'white', borderRadius: '50%' }} />
                    </Tooltip>
                  }
                >
                  <Avatar sx={{ width: 80, height: 80, fontSize: "2rem", border: '3px solid white' }}>
                    {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
                  </Avatar>
                </Badge>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {candidate.firstName} {candidate.lastName}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {candidate.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                      <PhoneIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {candidate.mobile}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </GradientCard>

          <StyledTabs value={tabValue} onChange={handleTabChange} variant="scrollable" sx={{ mb: 2 }}>
            <StyledTab label="Profile" icon={<PersonIcon />} iconPosition="start" />
            <StyledTab label="Resume" icon={<DocumentIcon />} iconPosition="start" />
            <StyledTab label="Cooling Period" icon={<TimelineIcon />} iconPosition="start" />
            {(candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected') && (
              <StyledTab label="Interview Feedback" icon={<SelectedIcon />} iconPosition="start" />
            )}
            <StyledTab label="Messages" icon={<MessageIcon />} iconPosition="start" />
          </StyledTabs>

          {tabValue === 0 && (
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" /> Personal Details
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><DateIcon color="primary" /></ListItemIcon>
                          <ListItemText
                            primary="Date of Birth"
                            secondary={
                              candidate.dob
                                ? new Date(candidate.dob).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                                : 'Not specified'
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Current Location" 
                            secondary={candidate.currentLocation?.name || 'Not specified'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Preferred Location" 
                            secondary={candidate.preferredLocation?.name || 'Not specified'} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><NoticePeriodIcon color="primary" /></ListItemIcon>
                          <ListItemText primary="Notice Period" secondary={`${candidate.availableToJoin || '0'} days`} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><SalaryIcon color="primary" /></ListItemIcon>
                          <ListItemText primary="Current Salary" secondary={candidate.currentSalary || 'Not specified'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
                          <ListItemText primary="Source" secondary={candidate.source?.name || 'Not specified'} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon color="primary" /> Skills & Expertise
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {candidate.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color={index % 2 === 0 ? "primary" : "secondary"}
                          variant={index % 3 === 0 ? "filled" : "outlined"}
                          sx={{ borderRadius: 1 }}
                        />
                      ))
                    ) : (
                      <Typography>No skills listed</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EducationIcon color="primary" /> Education & Experience
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Education
                      </Typography>
                      <Typography variant="body1">
                        {candidate.education || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Experience
                      </Typography>
                      <Typography variant="body1">
                        {candidate.experience || 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {candidate.resume?.aiAnalysis && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BarChartIcon color="primary" /> AI Resume Analysis
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">Match Percentage</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {candidate.resume.aiAnalysis.matchPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={candidate.resume.aiAnalysis.matchPercentage} 
                        sx={{ height: 10, borderRadius: 5 }}
                        color={
                          candidate.resume.aiAnalysis.matchPercentage >= 80 ? 'success' :
                          candidate.resume.aiAnalysis.matchPercentage >= 60 ? 'warning' : 'error'
                        }
                      />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Matching Skills
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                          {candidate.resume.aiAnalysis.matchingSkills.map((skill, index) => (
                            <SkillChip
                              key={index}
                              label={skill.skill}
                              level="high"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Missing Skills
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                          {candidate.resume.aiAnalysis.missingSkills.slice(0, 5).map((skill, index) => (
                            <SkillChip
                              key={index}
                              label={skill}
                              level="low"
                              size="small"
                            />
                          ))}
                          {candidate.resume.aiAnalysis.missingSkills.length > 5 && (
                            <Typography variant="body2" color="text.secondary">
                              +{candidate.resume.aiAnalysis.missingSkills.length - 5} more
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Recommendation
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {candidate.resume.aiAnalysis.recommendation}
                        </Typography>
                        
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Analysis
                        </Typography>
                        <Typography variant="body1">
                          {candidate.resume.aiAnalysis.analysis}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Notes Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Notes</Typography>
                  </Box>

                  {editNoteId ? (
                    <>
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          onClick={handleUpdateNote}
                          disabled={!editNoteText.trim() || updateNoteMutation.isLoading}
                        >
                          {updateNoteMutation.isLoading ? 'Updating...' : 'Update'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Add your notes..."
                        variant="outlined"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: <NotesIcon color="primary" sx={{ mr: 1 }} />,
                        }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || createNoteMutation.isLoading}
                        startIcon={<NoteAddIcon />}
                      >
                        {createNoteMutation.isLoading ? 'Saving...' : 'Save Note'}
                      </Button>
                    </>
                  )}

                  <List sx={{ mt: 2 }}>
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <ListItem key={note._id} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}><NotesIcon color="primary" fontSize="small" /></ListItemIcon>
                          <ListItemText
                            primary={note.note}
                            secondary={
                              <>
                                {` ${new Date(note.createdAt).toLocaleString()}`}
                              </>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, note)}
                          >
                            <MoreIcon />
                          </IconButton>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        No notes added yet
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}

         {tabValue === 1 && (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Resume</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadResume}
            disabled={!candidate?.resume || isResumeLoading}
          >
            {isResumeLoading ? 'Loading...' : 'Download'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareClick}
            disabled={!candidate?.resume}
          >
            Share
          </Button>
        </Box>
      </Box>

      <ResumeViewer>
        <ResumeToolbar>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FileIcon />}
              onClick={handleDownloadResume}
              disabled={!candidate?.resume || isResumeLoading}
            >
              {isResumeLoading ? 'Loading...' : 'Download'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={handlePreviewResume}
              disabled={!candidate?.resume || isResumeLoading}
            >
              {isResumeLoading ? 'Loading...' : 'Preview'}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleDownloadResume}
              disabled={!candidate?.resume || isResumeLoading}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleShareClick}
              disabled={!candidate?.resume}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
        </ResumeToolbar>
        <ResumeContent>
          {candidate?.resume ? (
            isResumeLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              // Use object tag instead of iframe for better PDF handling
              <object
                // data={`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/preview-resume/${candidate._id}#toolbar=1&navpanes=0&scrollbar=1`}
                // data={"Click on Preview Button to Preview Candidate Resume"}

                type="application/pdf"
                style={{ width: '100%', height: '100%' }}
                
              >
                <Box textAlign="center" pt={4}>
                  <Typography variant="h6" color="textSecondary">
                    Unable to display PDF
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={handlePreviewResume}
                    sx={{ mt: 2 }}
                  >
                    Open in New Tab
                  </Button>
                </Box>
              </object>
            )
          ) : (
            <Box textAlign="center" pt={4}>
              <Typography variant="h6" color="textSecondary">
                No resume available for this candidate
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={2}>
                Upload a resume to view it here
              </Typography>
            </Box>
          )}
        </ResumeContent>
      </ResumeViewer>
    </CardContent>
  </Card>
)}

          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Hiring Process - Cooling Period
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {stageHistory.success ? (
                  <>
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Current Stage: {stageHistory.currentStage}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        In this stage since: {stageHistory.currentStageSince ? 
                          new Date(stageHistory.currentStageSince).toLocaleDateString() : 
                          'Not available'}
                      </Typography>
                    </Box>
                    
                    <Stepper activeStep={currentStageIndex} orientation="vertical">
                      {hiringStages.map((stage, index) => (
                        <Step key={stage}>
                          <StepLabel>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {stage}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            <Typography variant="body2">
                              {index < currentStageIndex ? (
                                `Completed`
                              ) : index === currentStageIndex ? (
                                `Currently in this stage since ${new Date(stageHistory.currentStageSince).toLocaleDateString()}`
                              ) : (
                                'Pending'
                              )}
                            </Typography>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                    
                    {stageHistory.history && stageHistory.history.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Stage History
                        </Typography>
                        <List>
                          {stageHistory.history.map((historyItem, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={`From ${historyItem.from} to ${historyItem.to}`}
                                secondary={`Changed on ${new Date(historyItem.changedAt).toLocaleDateString()} by ${historyItem.changedBy?.name || 'Unknown'}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      No stage history available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {tabValue === 3 && (candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected') && (
            <Card>
              <CardContent>
                {feedback ? (
                  <>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Interview Feedback
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Interview Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                            <ListItemText
                              primary="Interviewer"
                              secondary={feedback.interviewerId?.name || 'Not specified'}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
                            <ListItemText
                              primary="Job Position"
                              secondary={feedback.jobId?.jobName || 'Not specified'}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><DateIcon color="primary" /></ListItemIcon>
                            <ListItemText
                              primary="Submitted On"
                              secondary={new Date(feedback.submittedAt).toLocaleString()}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              {feedback.status === 'Selected' ? (
                                <SelectedIcon color="success" />
                              ) : (
                                <RejectedIcon color="error" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary="Final Decision"
                              secondary={
                                <StatusChip
                                  label={feedback.status}
                                  status={feedback.status}
                                  size="small"
                                />
                              }
                            />
                          </ListItem>
                        </List>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Ratings
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Technical Skills"
                              secondary={<RatingStars value={feedback.technicalSkills} />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Communication Skills"
                              secondary={<RatingStars value={feedback.communicationSkills} />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Problem Solving"
                              secondary={<RatingStars value={feedback.problemSolving} />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Cultural Fit"
                              secondary={<RatingStars value={feedback.culturalFit} />}
                            />
                          </ListItem>
                        </List>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Overall Feedback
                        </Typography>
                        <Card variant="outlined" sx={{ p: 2, backgroundColor: 'background.paper' }}>
                          <Typography variant="body1">
                            {feedback.overallFeedback}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="textSecondary">
                      No feedback available yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={2}>
                      Feedback will appear here once submitted by the interviewer
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {tabValue === 4 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Messages with {candidate.firstName}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{
                  height: '400px',
                  overflowY: 'auto',
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  mb: 2
                }}>
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <MessageBubble key={index} sent={message.sent}>
                        <Typography variant="body2">{message.content}</Typography>
                        <Typography variant="caption" display="block" textAlign="right" mt={1}>
                          {new Date(message.timestamp).toLocaleString()} • {message.sender}
                        </Typography>
                      </MessageBubble>
                    ))
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography color="text.secondary">
                        No messages yet with this candidate
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    InputProps={{
                      startAdornment: <MessageIcon color="primary" sx={{ mr: 1 }} />,
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Sidebar Content */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Hiring Status Card */}
            <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Hiring Status</Typography>
                  <StatusChip label={candidate.stage?.name} status={candidate.stage?.name} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'relative',
                    mb: 1
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: 'grey.200',
                      transform: 'translateY(-50%)',
                      zIndex: 0
                    }} />

                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      width: `${(currentStageIndex + 1) / hiringStages.length * 100}%`,
                      height: 4,
                      bgcolor: 'primary.main',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      transition: 'width 0.5s ease'
                    }} />

                    {hiringStages.map((stage, index) => (
                      <Box key={stage} sx={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: index <= currentStageIndex ? 'primary.main' : 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: index <= currentStageIndex ? 'common.white' : 'text.secondary',
                          mb: 0.5
                        }}>
                          {index < currentStageIndex ? (
                            <CheckCircleIcon fontSize="small" />
                          ) : (
                            <Typography variant="caption" fontWeight="bold">
                              {index + 1}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="caption" fontWeight={index === currentStageIndex ? 'bold' : 'normal'}>
                          {stage}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {currentStageIndex + 1} of {hiringStages.length} stages completed
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Actions</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<ScheduleIcon />}
                      fullWidth
                      sx={{ py: 1.5 }}
                      onClick={handleScheduleClick}
                    >
                      Schedule
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<MessageIcon />}
                      fullWidth
                      sx={{ py: 1.5 }}
                      onClick={handleMessageClick}
                    >
                      Message
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoIcon />}
                      fullWidth
                      sx={{ py: 1.5 }}
                      onClick={handleVideoCallClick}
                    >
                      Video Call
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      fullWidth
                      sx={{ py: 1.5 }}
                      onClick={handleWhatsAppClick}
                    >
                      WhatsApp
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* HR Remarks Card */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">HR Team Comments for this Candidate</Typography>
                </Box>
               
                <List sx={{ mt: 2 }}>
                  {remarksData?.comments?.length > 0 ? (
                    remarksData.comments.map((remark, i) => (
                      <ListItem key={i} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <NotesIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={remark.text}
                          secondary={
                            <>
                              {` ${new Date(remark.date).toLocaleString()}`}
                            </>
                          }
                        />
                      </ListItem>
                    ))
                  ) : isLoading ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      Loading remarks...
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      No remarks yet from HR team
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Note Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditNote}>
          <ListItemIcon>
            <UpdateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteNote(selectedNote._id)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={shareDialogOpen} onClose={handleShareDialogClose}>
        <DialogTitle>Share Resume</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Choose how you want to share {candidate.firstName}'s resume:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={() => handleShareResume('native')}
              disabled={!navigator.share}
            >
              Share via...
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileIcon />}
              onClick={() => handleShareResume('clipboard')}
            >
              Copy Link to Clipboard
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <EditIcon />
      </Fab>
    </Container>
  );
};

export default CandidateDetailsPage;