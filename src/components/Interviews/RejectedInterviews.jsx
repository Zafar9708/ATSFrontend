import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  alpha,
  Card,
  CardContent,
  Divider,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  RestorePageOutlined as ReconsiderIcon,
  MailOutline as EmailIcon,
  SearchOff as NoDataIcon,
<<<<<<< HEAD
  ThumbDownOutlined as RejectedIcon
} from '@mui/icons-material';

const RejectedInterviews = ({ searchTerm = '', selectedDate = null }) => {
  const [interviews] = useState([]);
=======
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIconAlt
} from '@mui/icons-material';

// DUMMY DATA FOR TESTING
const DUMMY_REJECTIONS = [
  {
    id: 1,
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@email.com',
    jobTitle: 'Senior React Developer',
    jobCode: 'WR-001',
    interviewer: 'Sarah Wilson',
    rejectionDate: '2024-01-15',
    rejectionReason: 'Technical skills mismatch: Candidate struggled with system design questions.',
    interviewDate: '2024-01-10',
    status: 'rejected'
  },
  {
    id: 2,
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@email.com',
    jobTitle: 'Frontend Lead',
    jobCode: 'WR-002',
    interviewer: 'Mike Johnson',
    rejectionDate: '2024-01-12',
    rejectionReason: 'Cultural fit: Preferred a more collaborative environment.',
    interviewDate: '2024-01-08',
    status: 'rejected'
  },
  {
    id: 3,
    candidateName: 'Robert Brown',
    candidateEmail: 'robert.brown@email.com',
    jobTitle: 'Full Stack Engineer',
    jobCode: 'WR-003',
    interviewer: 'Emily Davis',
    rejectionDate: '2024-01-18',
    rejectionReason: 'Experience level below requirements for the senior grade.',
    interviewDate: '2024-01-14',
    status: 'rejected'
  },
  {
    id: 4,
    candidateName: 'Alice Johnson',
    candidateEmail: 'alice.j@email.com',
    jobTitle: 'UX Designer',
    jobCode: 'WR-004',
    interviewer: 'David Chen',
    rejectionDate: '2024-01-20',
    rejectionReason: 'Portfolio not matching industry standards for senior role.',
    interviewDate: '2024-01-18',
    status: 'rejected'
  }
];

const RejectedInterviews = ({ searchTerm = '', selectedDate = null }) => {
  const [interviews] = useState(DUMMY_REJECTIONS);
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844

  const filteredInterviews = interviews.filter(interview => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchStr) ||
<<<<<<< HEAD
      interview.jobTitle.toLowerCase().includes(searchStr);
=======
      interview.jobTitle.toLowerCase().includes(searchStr) ||
      interview.interviewer.toLowerCase().includes(searchStr) ||
      interview.candidateEmail.toLowerCase().includes(searchStr);

>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
    const matchesDate = !selectedDate || interview.rejectionDate === selectedDate;
    return matchesSearch && matchesDate;
  });

  const getAvatarColor = (name) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    return colors[name.length % colors.length];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Card Component for both Mobile and Tablet
  const InterviewCard = ({ interview }) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderColor: alpha('#3b82f6', 0.3),
          }
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1 }}>
          {/* Header with Avatar, Name and Status */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: getAvatarColor(interview.candidateName), 
                  width: { xs: 40, sm: 48 }, 
                  height: { xs: 40, sm: 48 },
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 700
                }}
              >
                {interview.candidateName.charAt(0)}
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  fontWeight={700} 
                  lineHeight={1.2}
                  sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                >
                  {interview.candidateName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  display="flex" 
                  alignItems="center" 
                  gap={0.5}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  <EmailIconAlt fontSize="inherit" />
                  {interview.candidateEmail.length > 25 
                    ? `${interview.candidateEmail.substring(0, 22)}...` 
                    : interview.candidateEmail}
                </Typography>
              </Box>
            </Stack>
            <Chip 
              label="Rejected" 
              size="small" 
              sx={{ 
                bgcolor: '#fee2e2', 
                color: '#b91c1c', 
                fontWeight: 700, 
                borderRadius: 1,
                height: { xs: 24, sm: 28 },
                '& .MuiChip-label': {
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  px: { xs: 1, sm: 1.5 }
                }
              }} 
            />
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          {/* Job Details */}
          <Stack spacing={1.5}>
            <Box>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
              >
                <WorkIcon fontSize="inherit" />
                JOB DETAILS
              </Typography>
              <Typography 
                variant="body2" 
                fontWeight={600}
                sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
              >
                {interview.jobTitle}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                Code: {interview.jobCode}
              </Typography>
            </Box>

            {/* Interviewer and Date - Grid layout for tablet */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  display="block"
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                >
                  Interviewer
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
                >
                  {interview.interviewer}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  display="block"
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                >
                  Interview Date
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
                >
                  {formatDate(interview.interviewDate)}
                </Typography>
              </Grid>
            </Grid>

            {/* Rejection Info */}
            <Box>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
              >
                <CalendarIcon fontSize="inherit" />
                REJECTED ON: {formatDate(interview.rejectionDate)}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: alpha('#fee2e2', 0.3),
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha('#ef4444', 0.2),
                }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    fontStyle: 'italic',
                    display: 'block'
                  }}
                >
                  "{interview.rejectionReason.length > 80 
                    ? `${interview.rejectionReason.substring(0, 77)}...` 
                    : interview.rejectionReason}"
                </Typography>
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="flex-end" 
              sx={{ mt: 2 }}
            >
              <Tooltip title="View Details" arrow>
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha('#3b82f6', 0.1), 
                    '&:hover': { bgcolor: alpha('#3b82f6', 0.2) }, 
                    color: '#2563eb',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 }
                  }}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reconsider" arrow>
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha('#8b5cf6', 0.1), 
                    '&:hover': { bgcolor: alpha('#8b5cf6', 0.2) }, 
                    color: '#7c3aed',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 }
                  }}
                >
                  <ReconsiderIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Contact" arrow>
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha('#10b981', 0.1), 
                    '&:hover': { bgcolor: alpha('#10b981', 0.2) }, 
                    color: '#059669',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 }
                  }}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

  if (filteredInterviews.length === 0) {
    return (
<<<<<<< HEAD
      <Paper
        variant="outlined"
        sx={{
          p: 8,
          textAlign: 'center',
          borderRadius: 4,
          borderStyle: 'dashed',
          borderColor: '#fca5a5',
          bgcolor: '#fff7f7'
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#fee2e2',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <RejectedIcon sx={{ fontSize: 36, color: '#ef4444' }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ mb: 1 }}>
          No Rejected Interviews
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {searchTerm || selectedDate
            ? 'No rejections match your current filters.'
            : 'There are no rejected interviews at this time.'}
=======
      <Paper 
        variant="outlined" 
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          textAlign: 'center', 
          borderRadius: 4, 
          bgcolor: '#f8fafc', 
          borderStyle: 'dashed',
          mx: { xs: 1, sm: 2 }
        }}
      >
        <NoDataIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'text.disabled', mb: 2 }} />
        <Typography variant={isMobile ? "body1" : "h6"} fontWeight={700}>
          No Rejected Interviews Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search or filter criteria
>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
        </Typography>
      </Paper>
    );
  }

  return (
<<<<<<< HEAD
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#1e293b">
=======
    <Box sx={{ width: '100%', mt: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header with count and info */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 0 }
        }}
      >
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          fontWeight={700} 
          color="#1e293b"
        >
>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
          Rejected Interviews ({filteredInterviews.length})
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          {isMobile ? `${filteredInterviews.length} items` : `Showing ${filteredInterviews.length} of ${interviews.length} interviews`}
        </Typography>
      </Stack>

<<<<<<< HEAD
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 3, overflow: 'auto', border: '1px solid #e2e8f0' }}
=======
      {/* Card Grid Layout - Same for Mobile and Tablet */}
      <Grid 
        container 
        spacing={{ xs: 2, sm: 2, md: 3 }}
        sx={{ 
          px: { xs: 1, sm: 0 }
        }}
>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
      >
        {filteredInterviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </Grid>

<<<<<<< HEAD
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>{interview.jobTitle}</Typography>
                  <Typography variant="caption" color="text.secondary">{interview.jobCode}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{interview.interviewer}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(interview.interviewDate).toLocaleDateString()}</Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label="Rejected"
                    size="small"
                    sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, borderRadius: 1 }}
                  />
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="View Details" arrow>
                      <IconButton size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), '&:hover': { bgcolor: alpha('#3b82f6', 0.2) }, color: '#2563eb' }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reconsider" arrow>
                      <IconButton size="small" sx={{ bgcolor: alpha('#8b5cf6', 0.1), '&:hover': { bgcolor: alpha('#8b5cf6', 0.2) }, color: '#7c3aed' }}>
                        <ReconsiderIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Contact" arrow>
                      <IconButton size="small" sx={{ bgcolor: alpha('#10b981', 0.1), '&:hover': { bgcolor: alpha('#10b981', 0.2) }, color: '#059669' }}>
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
=======
      {/* Show different column layout hint for tablet */}
      {isTablet && (
        <Typography 
          variant="caption" 
            color="text.secondary" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 3,
            fontStyle: 'italic'
          }}
        >
          Showing 2 cards per row for better readability
        </Typography>
      )}
>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
    </Box>
  );
};

export default RejectedInterviews;