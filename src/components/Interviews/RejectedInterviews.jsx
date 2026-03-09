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
  SearchOff as NoDataIcon,
  ThumbDownOutlined as RejectedIcon
} from '@mui/icons-material';

const RejectedInterviews = ({ searchTerm = '', selectedDate = null }) => {
  const [interviews] = useState([]);

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
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
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
    </Box>
  );
};

export default RejectedInterviews;