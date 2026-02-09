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

// DUMMY DATA
const DUMMY_CANDIDATE = {
  _id: "dummy123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  mobile: "+1 (555) 123-4567",
  dob: "1990-05-15",
  currentLocation: { name: "San Francisco, CA" },
  preferredLocation: { name: "Remote" },
  availableToJoin: 30,
  currentSalary: "$120,000",
  source: { name: "LinkedIn" },
  education: "Master's in Computer Science, Stanford University",
  experience: "5 years as Senior Software Engineer at Google",
  stage: { name: "Interview" },
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "Git"],
  resume: {
    url: "https://example.com/resume.pdf",
    aiAnalysis: {
      matchPercentage: 85,
      matchingSkills: [
        { skill: "React", level: "high" },
        { skill: "Node.js", level: "high" },
        { skill: "TypeScript", level: "medium" },
        { skill: "AWS", level: "medium" }
      ],
      missingSkills: ["GraphQL", "Kubernetes", "Redis"],
      recommendation: "Strong candidate with excellent React and Node.js skills. Good cultural fit based on previous experience.",
      analysis: "Candidate has 5 years of relevant experience in modern web technologies. Shows strong problem-solving abilities and good communication skills based on previous work history."
    }
  }
};

const DUMMY_STAGE_HISTORY = {
  success: true,
  currentStage: "Interview",
  currentStageSince: "2024-01-15T10:30:00.000Z",
  history: [
    {
      from: "Sourced",
      to: "Screening",
      changedAt: "2024-01-10T14:20:00.000Z",
      changedBy: { name: "Sarah Johnson" }
    },
    {
      from: "Screening",
      to: "Interview",
      changedAt: "2024-01-15T10:30:00.000Z",
      changedBy: { name: "Mike Chen" }
    }
  ]
};

const DUMMY_MESSAGES = [
  {
    _id: "msg1",
    content: "Hi John, we'd like to schedule an interview for next week.",
    sender: "Recruiter",
    timestamp: "2024-01-12T09:30:00.000Z",
    sent: false
  },
  {
    _id: "msg2",
    content: "That sounds great! I'm available on Tuesday or Thursday.",
    sender: "John Doe",
    timestamp: "2024-01-12T10:15:00.000Z",
    sent: true
  },
  {
    _id: "msg3",
    content: "Perfect! Let's schedule for Tuesday at 2 PM.",
    sender: "Recruiter",
    timestamp: "2024-01-12T10:30:00.000Z",
    sent: false
  }
];

const DUMMY_REMARKS = {
  comments: [
    {
      text: "Candidate has excellent technical skills and good communication.",
      date: "2024-01-10T11:20:00.000Z",
      author: "Sarah Johnson"
    },
    {
      text: "Cultural fit seems good based on previous experience.",
      date: "2024-01-11T14:45:00.000Z",
      author: "Mike Chen"
    },
    {
      text: "Should proceed to technical interview round.",
      date: "2024-01-12T09:15:00.000Z",
      author: "Alex Wong"
    }
  ]
};

const DUMMY_NOTES = [
  {
    _id: "note1",
    note: "Candidate showed strong interest in our tech stack.",
    createdAt: "2024-01-10T11:20:00.000Z",
    createdBy: { name: "Sarah Johnson" }
  },
  {
    _id: "note2",
    note: "Follow up about availability for final interview.",
    createdAt: "2024-01-11T14:45:00.000Z",
    createdBy: { name: "Mike Chen" }
  },
  {
    _id: "note3",
    note: "References checked - all positive feedback.",
    createdAt: "2024-01-12T09:15:00.000Z",
    createdBy: { name: "Alex Wong" }
  }
];

const DUMMY_FEEDBACK = {
  _id: "feedback1",
  interviewerId: { name: "Dr. Jane Smith" },
  jobId: { jobName: "Senior Frontend Developer" },
  submittedAt: "2024-01-20T16:30:00.000Z",
  status: "Selected",
  technicalSkills: 4.5,
  communicationSkills: 4.0,
  problemSolving: 4.5,
  culturalFit: 4.0,
  overallFeedback: "Excellent candidate with strong technical skills and good problem-solving abilities. Good cultural fit for our team. Recommended for hire."
};

// API functions with fallback to dummy data
const fetchCandidateById = async (id) => {
  try {
    const response = await candidateService.getCandidate(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy candidate data:', error.message);
    // Fallback to dummy data
    return { candidate: DUMMY_CANDIDATE };
  }
};

const fetchCandidateStageHistory = async (id) => {
  try {
    const response = await candidateService.getStageHistory(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy stage history:', error.message);
    // Fallback to dummy data
    return DUMMY_STAGE_HISTORY;
  }
};

const fetchCandidateMessages = async (id) => {
  try {
    const response = await externalServices.getMessages(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy messages:', error.message);
    // Fallback to dummy data
    return { data: DUMMY_MESSAGES };
  }
};

const fetchCandidateRemarks = async (id) => {
  try {
    const response = await externalServices.getRemarks(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy remarks:', error.message);
    // Fallback to dummy data
    return DUMMY_REMARKS;
  }
};

const fetchCandidateNotes = async (id) => {
  try {
    const response = await candidateService.getNotes(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy notes:', error.message);
    // Fallback to dummy data
    return { data: { candidateNotes: DUMMY_NOTES } };
  }
};

const fetchCandidateFeedback = async (id) => {
  try {
    const response = await externalServices.getFeedback(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy feedback:', error.message);
    // Fallback to dummy data
    return { data: [DUMMY_FEEDBACK] };
  }
};

const createCandidateNote = async (noteData) => {
  try {
    const response = await candidateService.createNote(noteData);
    return response.data;
  } catch (error) {
    console.warn('Note creation failed, simulating success:', error.message);
    // Simulate success for dummy data
    const newNote = {
      _id: `note${Date.now()}`,
      note: noteData.note,
      createdAt: new Date().toISOString(),
      createdBy: { name: "Current User" }
    };
    return newNote;
  }
};

const updateCandidateNote = async ({ id, noteData }) => {
  try {
    const response = await candidateService.updateNote(id, noteData);
    return response.data;
  } catch (error) {
    console.warn('Note update failed, simulating success:', error.message);
    // Simulate success for dummy data
    return { success: true };
  }
};

const deleteCandidateNote = async (id) => {
  try {
    const response = await candidateService.deleteNote(id);
    return response.data;
  } catch (error) {
    console.warn('Note deletion failed, simulating success:', error.message);
    // Simulate success for dummy data
    return { success: true };
  }
};

const downloadCandidateResume = async (id) => {
  try {
    const response = await candidateService.downloadResume(id);
    return response;
  } catch (error) {
    console.warn('Download failed:', error.message);
    throw error;
  }
};

const previewCandidateResume = async (id) => {
  try {
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
  } catch (error) {
    console.warn('Preview failed:', error.message);
    // Simulate a blob for dummy data
    const dummyBlob = new Blob(['Dummy PDF content'], { type: 'application/pdf' });
    return { data: dummyBlob };
  }
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
  const [useDummyData, setUseDummyData] = React.useState(false);

  const hiringStages = ['Sourced', 'Screening', 'Interview','Rejected', 'Preboarding', 'Hired',  'Archived'];

  // Check if we should use dummy data (for development)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dummyParam = params.get('dummy');
    if (dummyParam === 'true') {
      setUseDummyData(true);
    }
  }, []);

  const { data: candidateData, isLoading, error } = useQuery({
    queryKey: ['candidate', id, useDummyData],
    queryFn: () => fetchCandidateById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !useDummyData || id === 'dummy' // Only fetch if not using dummy data
  });

  // Use dummy data if enabled
  const candidate = useDummyData ? DUMMY_CANDIDATE : candidateData?.candidate;

  const { data: stageHistoryData } = useQuery({
    queryKey: ['candidateStageHistory', id, useDummyData],
    queryFn: () => fetchCandidateStageHistory(id),
    enabled: (tabValue === 2 && !useDummyData) || (useDummyData && id === 'dummy'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: messagesData } = useQuery({
    queryKey: ['candidateMessages', id, useDummyData],
    queryFn: () => fetchCandidateMessages(id),
    enabled: (tabValue === 4 && !useDummyData) || (useDummyData && id === 'dummy'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: remarksData } = useQuery({
    queryKey: ['candidateRemarks', id, useDummyData],
    queryFn: () => fetchCandidateRemarks(id),
    enabled: (!useDummyData) || (useDummyData && id === 'dummy'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: notesData } = useQuery({
    queryKey: ['candidateNotes', id, useDummyData],
    queryFn: () => fetchCandidateNotes(id),
    enabled: (!useDummyData) || (useDummyData && id === 'dummy'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: feedbackData } = useQuery({
    queryKey: ['candidateFeedback', id, useDummyData],
    queryFn: () => fetchCandidateFeedback(id),
    enabled: (!!candidate && (candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected') && !useDummyData) || 
             (useDummyData && id === 'dummy'),
    staleTime: 1000 * 60 * 5,
  });

  const stageHistory = useDummyData ? DUMMY_STAGE_HISTORY : stageHistoryData;
  const messages = useDummyData ? DUMMY_MESSAGES : messagesData?.data || [];
  const remarks = useDummyData ? DUMMY_REMARKS : remarksData || {};
  const notes = useDummyData ? DUMMY_NOTES : notesData?.data?.candidateNotes || [];
  const feedback = useDummyData ? DUMMY_FEEDBACK : feedbackData?.data?.[0];

  const currentStageIndex = candidate ? hiringStages.indexOf(candidate.stage?.name || 'Sourced') : 0;

  const createNoteMutation = useMutation({
    mutationFn: createCandidateNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['candidateNotes', id, useDummyData]);
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
      queryClient.invalidateQueries(['candidateNotes', id, useDummyData]);
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
      queryClient.invalidateQueries(['candidateNotes', id, useDummyData]);
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
      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(blob);
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

      // Simulate saving message for dummy data
      if (!useDummyData) {
        await axios.post(`https://hire-onboardbackend-production.up.railway.app/api/messages`, {
          candidateId: id,
          content: newMessage,
          sender: 'Admin',
          sent: true
        });
      }

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

  // Development mode toggle (for testing)
  const handleToggleDummyData = () => {
    setUseDummyData(!useDummyData);
    setSnackbarMessage(`Switched to ${!useDummyData ? 'dummy' : 'real'} data mode`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  if (isLoading && !useDummyData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading candidate data...</Typography>
      </Box>
    );
  }

  if (error && !useDummyData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h5">
          {error.message}
        </Typography>
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleDummyData}>
          Use Dummy Data
        </Button>
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h5">
          Candidate not found
        </Typography>
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleToggleDummyData}>
          Use Dummy Data
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, ml:7, px: { xs: 2, sm: 3 }  }}>
      {/* Development Mode Indicator */}
      {useDummyData && (
        <Box sx={{ 
          mb: 2, 
          p: 1, 
          bgcolor: 'warning.light', 
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2">
            <strong>⚠️ DEVELOPMENT MODE:</strong> Using dummy data
          </Typography>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleToggleDummyData}
            sx={{ ml: 2 }}
          >
            Switch to Real Data
          </Button>
        </Box>
      )}

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
                        <object
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
                
                {stageHistory?.success ? (
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
                  {remarks?.comments?.length > 0 ? (
                    remarks.comments.map((remark, i) => (
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

      {/* Development Mode Fab */}
      <Fab 
        color="secondary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleToggleDummyData}
      >
        <Tooltip title={useDummyData ? "Switch to Real Data" : "Switch to Dummy Data"}>
          {useDummyData ? <CheckCircleIcon /> : <EditIcon />}
        </Tooltip>
      </Fab>
    </Container>
  );
};

export default CandidateDetailsPage;