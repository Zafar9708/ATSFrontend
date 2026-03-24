import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  LinearProgress,
  useTheme,
  useMediaQuery,
  Paper
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
  WorkHistory as ExperienceIcon,
  Menu as MenuOpenIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from '@mui/material/styles';
import { candidateService, externalServices } from '../../services/Candidates/candidatesDetailsSerivess';
import axios from 'axios';

// Styled components remain the same as before...
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
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {stars}
      <Typography variant="body2" ml={1}>({value})</Typography>
    </Box>
  );
};

// DUMMY DATA (keep as is)...
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

// API functions (keep as is)...
const fetchCandidateById = async (id) => {
  try {
    const response = await candidateService.getCandidate(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy candidate data:', error.message);
    return { candidate: DUMMY_CANDIDATE };
  }
};

const fetchCandidateStageHistory = async (id) => {
  try {
    const response = await candidateService.getStageHistory(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy stage history:', error.message);
    return DUMMY_STAGE_HISTORY;
  }
};

const fetchCandidateMessages = async (id) => {
  try {
    const response = await externalServices.getMessages(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy messages:', error.message);
    return { data: DUMMY_MESSAGES };
  }
};

const fetchCandidateRemarks = async (id) => {
  try {
    const response = await externalServices.getRemarks(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy remarks:', error.message);
    return DUMMY_REMARKS;
  }
};

const fetchCandidateNotes = async (id) => {
  try {
    const response = await candidateService.getNotes(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy notes:', error.message);
    return { data: { candidateNotes: DUMMY_NOTES } };
  }
};

const fetchCandidateFeedback = async (id) => {
  try {
    const response = await externalServices.getFeedback(id);
    return response.data;
  } catch (error) {
    console.warn('Using dummy feedback:', error.message);
    return { data: [DUMMY_FEEDBACK] };
  }
};

const createCandidateNote = async (noteData) => {
  try {
    const response = await candidateService.createNote(noteData);
    return response.data;
  } catch (error) {
    console.warn('Note creation failed, simulating success:', error.message);
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
    return { success: true };
  }
};

const deleteCandidateNote = async (id) => {
  try {
    const response = await candidateService.deleteNote(id);
    return response.data;
  } catch (error) {
    console.warn('Note deletion failed, simulating success:', error.message);
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
      `http://ats-env.eba-qmshqp3j.ap-south-1.elasticbeanstalk.com/api/v1/candidates/preview-resume/${id}`,
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
    const dummyBlob = new Blob(['Dummy PDF content'], { type: 'application/pdf' });
    return { data: dummyBlob };
  }
};

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
    staleTime: 1000 * 60 * 5,
    enabled: !useDummyData || id === 'dummy'
  });

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

    const resumeUrl = `http://ats-env.eba-qmshqp3j.ap-south-1.elasticbeanstalk.com/api/v1/candidates/preview-resume/${id}`;

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
      const phone = candidate.mobile.replace(/\D/g, '');
      const message = `Hi ${candidate.firstName}, ${newMessage}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

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
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleVideoCallClick = () => {
    setSnackbarMessage('Video call feature will be added soon!');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleToggleDummyData = () => {
    setUseDummyData(!useDummyData);
    setSnackbarMessage(`Switched to ${!useDummyData ? 'dummy' : 'real'} data mode`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Responsive container padding
  const getContainerPadding = () => {
    if (isMobile) return { xs: 1, sm: 2 };
    if (isTablet) return { xs: 2, sm: 3 };
    return { xs: 2, sm: 3, md: 4 };
  };

  // Responsive grid columns
  const getMainGridColumns = () => {
    if (isMobile || isTablet) return 12; // Full width for mobile and tablet
    return 8; // 8 columns for laptop and desktop
  };

  const getSidebarGridColumns = () => {
    if (isMobile || isTablet) return 12; // Full width for mobile and tablet
    return 4; // 4 columns for laptop and desktop
  };

  // Responsive spacing
  const getGridSpacing = () => {
    if (isMobile) return 2;
    if (isTablet) return 2.5;
    return 3;
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" p={2}>
        <Typography color="error" variant={isMobile ? "body1" : "h5"} align="center" gutterBottom>
          {error.message}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleBackClick}>
            Go Back
          </Button>
          <Button variant="outlined" onClick={handleToggleDummyData}>
            Use Dummy Data
          </Button>
        </Box>
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" p={2}>
        <Typography color="error" variant={isMobile ? "body1" : "h5"} align="center" gutterBottom>
          Candidate not found
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleBackClick}>
            Go Back
          </Button>
          <Button variant="outlined" onClick={handleToggleDummyData}>
            Use Dummy Data
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: isMobile ? 2 : 3, 
        px: getContainerPadding(),
        ml: isDesktop ? 25 : 0, // Sidebar margin only for desktop
        transition: 'margin-left 0.3s ease'
      }}
    >
                  <Box sx={{ mb: isMobile ? 1 : 2 }}>
                      <Button
                          startIcon={<ArrowBackIcon />}
                          onClick={handleBackClick}
                          sx={{
                              color: 'text.primary',
                              '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              },
                              fontSize: isMobile ? '0.9rem' : '1rem',
                              fontWeight: 500,
                              textTransform: 'none',
                              px: isMobile ? 1 : 2,
                              py: isMobile ? 0.5 : 1,
                          }}
                      >
                          Back 
                      </Button>
                  </Box>
      {/* Development Mode Indicator */}
      {useDummyData && (
        <Paper 
          sx={{ 
            mb: 2, 
            p: isMobile ? 1 : 2, 
            bgcolor: 'warning.light', 
            borderRadius: 1,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 1 : 0
          }}
        >
          <Typography variant="body2">
            <strong>⚠️ DEVELOPMENT MODE:</strong> Using dummy data
          </Typography>
          <Button 
            size={isMobile ? "small" : "medium"} 
            variant="outlined" 
            onClick={handleToggleDummyData}
            sx={{ ml: isMobile ? 0 : 2 }}
            fullWidth={isMobile}
          >
            Switch to Real Data
          </Button>
        </Paper>
      )}

      {/* Header with Back Button and Breadcrumbs */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        <IconButton onClick={handleBackClick} sx={{ mr: isMobile ? 0 : 1 }}>
          <BackIcon />
        </IconButton>
        <Breadcrumbs sx={{ flex: 1, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
          <Typography color="text.primary" noWrap sx={{ maxWidth: isMobile ? 150 : 'none' }}>
            {candidate.firstName} {candidate.lastName}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={getGridSpacing()}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} md={getMainGridColumns()}>
          <GradientCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: isMobile ? 2 : 3 
              }}>
                <Badge
                  overlap="circular"
                  badgeContent={
                    <Tooltip title="Verified profile">
                      <VerifiedIcon color="primary" sx={{ bgcolor: 'white', borderRadius: '50%', fontSize: isMobile ? 16 : 20 }} />
                    </Tooltip>
                  }
                >
                  <Avatar sx={{ 
                    width: isMobile ? 60 : 80, 
                    height: isMobile ? 60 : 80, 
                    fontSize: isMobile ? "1.5rem" : "2rem", 
                    border: '3px solid white' 
                  }}>
                    {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
                  </Avatar>
                </Badge>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: '100%' }}>
                  <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" sx={{ color: 'white' }}>
                    {candidate.firstName} {candidate.lastName}
                  </Typography>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: isMobile ? 'column' : 'row',
                    flexWrap: 'wrap', 
                    gap: isMobile ? 1 : 2, 
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    mt: 1
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {candidate.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{ mb: 2 }}
          >
            <StyledTab label={isMobile ? "" : "Profile"} icon={<PersonIcon />} iconPosition="start" />
            <StyledTab label={isMobile ? "" : "Resume"} icon={<DocumentIcon />} iconPosition="start" />
            <StyledTab label={isMobile ? "" : "Cooling Period"} icon={<TimelineIcon />} iconPosition="start" />
            {(candidate.stage?.name === 'Hired' || candidate.stage?.name === 'Rejected') && (
              <StyledTab label={isMobile ? "" : "Interview Feedback"} icon={<SelectedIcon />} iconPosition="start" />
            )}
            <StyledTab label={isMobile ? "" : "Messages"} icon={<MessageIcon />} iconPosition="start" />
          </StyledTabs>

          {/* Tab Content */}
          <Box sx={{ minHeight: isMobile ? 'auto' : '500px' }}>
            {tabValue === 0 && (
              <Box>
                <Card sx={{ mb: 3 }}>
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" /> Personal Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={isMobile ? 1 : 2}>
                      <Grid item xs={12} sm={6}>
                        <List dense={isMobile}>
                          <ListItem>
                            <ListItemIcon><DateIcon color="primary" /></ListItemIcon>
                          
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
                        <List dense={isMobile}>
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
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                            sx={{ borderRadius: 1, fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            size={isMobile ? "small" : "medium"}
                          />
                        ))
                      ) : (
                        <Typography>No skills listed</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EducationIcon color="primary" /> Education & Experience
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={isMobile ? 1 : 2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                          Education
                        </Typography>
                        <Typography variant={isMobile ? "body2" : "body1"}>
                          {candidate.education || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                          Experience
                        </Typography>
                        <Typography variant={isMobile ? "body2" : "body1"}>
                          {candidate.experience || 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {candidate.resume?.aiAnalysis && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BarChartIcon color="primary" /> AI Resume Analysis
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant={isMobile ? "body2" : "body1"}>Match Percentage</Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="bold">
                            {candidate.resume.aiAnalysis.matchPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={candidate.resume.aiAnalysis.matchPercentage} 
                          sx={{ height: isMobile ? 6 : 10, borderRadius: 5 }}
                          color={
                            candidate.resume.aiAnalysis.matchPercentage >= 80 ? 'success' :
                            candidate.resume.aiAnalysis.matchPercentage >= 60 ? 'warning' : 'error'
                          }
                        />
                      </Box>

                      <Grid container spacing={isMobile ? 1 : 3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Matching Skills
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                            {candidate.resume.aiAnalysis.matchingSkills.map((skill, index) => (
                              <SkillChip
                                key={index}
                                label={skill.skill}
                                level="high"
                                size={isMobile ? "small" : "small"}
                              />
                            ))}
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Missing Skills
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                            {candidate.resume.aiAnalysis.missingSkills.slice(0, 5).map((skill, index) => (
                              <SkillChip
                                key={index}
                                label={skill}
                                level="low"
                                size={isMobile ? "small" : "small"}
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
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Recommendation
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 2 }}>
                            {candidate.resume.aiAnalysis.recommendation}
                          </Typography>
                          
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Analysis
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"}>
                            {candidate.resume.aiAnalysis.analysis}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}

       
              </Box>
            )}

            {tabValue === 1 && (
              <Card>
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: isMobile ? 'stretch' : 'center', 
                    mb: 2,
                    gap: isMobile ? 1 : 0
                  }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">Resume</Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadResume}
                        disabled={!candidate?.resume || isResumeLoading}
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                      >
                        {isResumeLoading ? 'Loading...' : 'Download'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        onClick={handleShareClick}
                        disabled={!candidate?.resume}
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
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
                              <Typography variant={isMobile ? "body1" : "h6"} color="textSecondary">
                                Unable to display PDF
                              </Typography>
                              <Button 
                                variant="contained" 
                                onClick={handlePreviewResume}
                                sx={{ mt: 2 }}
                                size={isMobile ? "small" : "medium"}
                              >
                                Open in New Tab
                              </Button>
                            </Box>
                          </object>
                        )
                      ) : (
                        <Box textAlign="center" pt={4}>
                          <Typography variant={isMobile ? "body1" : "h6"} color="textSecondary">
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
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
                    Hiring Process - Cooling Period
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  {stageHistory?.success ? (
                    <>
                      <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant={isMobile ? "body1" : "subtitle1"} fontWeight="bold">
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
                              <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold">
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
                          <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold" gutterBottom>
                            Stage History
                          </Typography>
                          <List dense={isMobile}>
                            {stageHistory.history.map((historyItem, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={`From ${historyItem.from} to ${historyItem.to}`}
                                  secondary={`Changed on ${new Date(historyItem.changedAt).toLocaleDateString()} by ${historyItem.changedBy?.name || 'Unknown'}`}
                                  primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                                  secondaryTypographyProps={{ variant: isMobile ? 'caption' : 'body2' }}
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
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  {feedback ? (
                    <>
                      <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
                        Interview Feedback
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={isMobile ? 1 : 3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Interview Details
                          </Typography>
                          <List dense={isMobile}>
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
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Ratings
                          </Typography>
                          <List dense={isMobile}>
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
                          <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="bold" gutterBottom>
                            Overall Feedback
                          </Typography>
                          <Card variant="outlined" sx={{ p: 2, backgroundColor: 'background.paper' }}>
                            <Typography variant={isMobile ? "body2" : "body1"}>
                              {feedback.overallFeedback}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography variant={isMobile ? "body1" : "h6"} color="textSecondary">
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
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
                    Messages with {candidate.firstName}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{
                    height: isMobile ? '300px' : '400px',
                    overflowY: 'auto',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {messages.length > 0 ? (
                      messages.map((message, index) => (
                        <MessageBubble key={index} sent={message.sent}>
                          <Typography variant={isMobile ? "caption" : "body2"}>{message.content}</Typography>
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
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <MessageIcon color="primary" sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />,
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size={isMobile ? "small" : "medium"}
                    >
                      <SendIcon fontSize={isMobile ? "small" : "medium"} />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>

        {/* Right Column - Sidebar Content */}
        <Grid item xs={12} md={getSidebarGridColumns()}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Hiring Status Card */}
            <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">Hiring Status</Typography>
                  <StatusChip label={candidate.stage?.name} status={candidate.stage?.name} size={isMobile ? "small" : "medium"} />
                </Box>

                <Box sx={{ mb: 3, overflowX: 'auto', pb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'relative',
                    mb: 1,
                    minWidth: isMobile ? '500px' : 'auto'
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
                          width: isMobile ? 24 : 32,
                          height: isMobile ? 24 : 32,
                          borderRadius: '50%',
                          bgcolor: index <= currentStageIndex ? 'primary.main' : 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: index <= currentStageIndex ? 'common.white' : 'text.secondary',
                          mb: 0.5
                        }}>
                          {index < currentStageIndex ? (
                            <CheckCircleIcon fontSize={isMobile ? "small" : "small"} />
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
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>Quick Actions</Typography>
                <Grid container spacing={isMobile ? 0.5 : 1}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<ScheduleIcon />}
                      fullWidth
                      sx={{ py: isMobile ? 1 : 1.5 }}
                      onClick={handleScheduleClick}
                      size={isMobile ? "small" : "medium"}
                    >
                      {isMobile ? '' : 'Schedule'}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<MessageIcon />}
                      fullWidth
                      sx={{ py: isMobile ? 1 : 1.5 }}
                      onClick={handleMessageClick}
                      size={isMobile ? "small" : "medium"}
                    >
                      {isMobile ? '' : 'Message'}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoIcon />}
                      fullWidth
                      sx={{ py: isMobile ? 1 : 1.5 }}
                      onClick={handleVideoCallClick}
                      size={isMobile ? "small" : "medium"}
                    >
                      {isMobile ? '' : 'Video Call'}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      fullWidth
                      sx={{ py: isMobile ? 1 : 1.5 }}
                      onClick={handleWhatsAppClick}
                      size={isMobile ? "small" : "medium"}
                    >
                      {isMobile ? '' : 'WhatsApp'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* HR Remarks Card */}
            <Card>
            
               
                <List dense={isMobile} sx={{ mt: 2 }}>
                  {remarks?.comments?.length > 0 ? (
                    remarks.comments.map((remark, i) => (
                      <ListItem key={i} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <NotesIcon color="primary" fontSize={isMobile ? "small" : "small"} />
                        </ListItemIcon>
                        <ListItemText
                          primary={remark.text}
                          secondary={`${new Date(remark.date).toLocaleString()}`}
                          primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                          secondaryTypographyProps={{ variant: isMobile ? 'caption' : 'body2' }}
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

      <Dialog 
        open={shareDialogOpen} 
        onClose={handleShareDialogClose}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
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
              fullWidth
              size={isMobile ? "medium" : "large"}
            >
              Share via...
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileIcon />}
              onClick={() => handleShareResume('clipboard')}
              fullWidth
              size={isMobile ? "medium" : "large"}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Development Mode Fab */}
      <Fab 
        color="secondary" 
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'none', sm: 'flex' } // Hide on mobile, show on larger screens
        }}
        onClick={handleToggleDummyData}
        size={isMobile ? "small" : "medium"}
      >
        <Tooltip title={useDummyData ? "Switch to Real Data" : "Switch to Dummy Data"}>
          {useDummyData ? <CheckCircleIcon /> : <EditIcon />}
        </Tooltip>
      </Fab>
    </Container>
  );
};

export default CandidateDetailsPage;