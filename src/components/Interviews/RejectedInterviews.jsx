import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  alpha
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  RestorePageOutlined as ReconsiderIcon,
  MailOutline as EmailIcon,
  SearchOff as NoDataIcon
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
  }
];

const RejectedInterviews = ({ searchTerm = '', selectedDate = null }) => {
  const [interviews] = useState(DUMMY_REJECTIONS);

  const filteredInterviews = interviews.filter(interview => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      interview.candidateName.toLowerCase().includes(searchStr) ||
      interview.jobTitle.toLowerCase().includes(searchStr);

    const matchesDate = !selectedDate || interview.rejectionDate === selectedDate;
    return matchesSearch && matchesDate;
  });

  const getAvatarColor = (name) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    return colors[name.length % colors.length];
  };

  if (filteredInterviews.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', borderStyle: 'dashed' }}>
        <NoDataIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" fontWeight={700}>No Records Found</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Table Header Meta */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#1e293b">
          Rejected Interviews ({filteredInterviews.length})
        </Typography>
      </Stack>

      <TableContainer 
        component={Paper} 
        variant="outlined" 
        sx={{ borderRadius: 3, overflow: 'auto', border: '1px solid #e2e8f0' }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>CANDIDATE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>JOB DETAILS</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>INTERVIEWER</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>DECISION</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#64748b', width: '180px' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: getAvatarColor(interview.candidateName), width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700 }}>
                      {interview.candidateName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{interview.candidateName}</Typography>
                      <Typography variant="caption" color="text.secondary">{interview.candidateEmail}</Typography>
                    </Box>
                  </Stack>
                </TableCell>

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

                {/* --- ACTION BUTTONS COLUMN --- */}
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="View Details" arrow>
                      <IconButton 
                        size="small" 
                        sx={{ bgcolor: alpha('#3b82f6', 0.1), '&:hover': { bgcolor: alpha('#3b82f6', 0.2) }, color: '#2563eb' }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Reconsider" arrow>
                      <IconButton 
                        size="small" 
                        sx={{ bgcolor: alpha('#8b5cf6', 0.1), '&:hover': { bgcolor: alpha('#8b5cf6', 0.2) }, color: '#7c3aed' }}
                      >
                        <ReconsiderIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Contact" arrow>
                      <IconButton 
                        size="small" 
                        sx={{ bgcolor: alpha('#10b981', 0.1), '&:hover': { bgcolor: alpha('#10b981', 0.2) }, color: '#059669' }}
                      >
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
    </Box>
  );
};

export default RejectedInterviews;