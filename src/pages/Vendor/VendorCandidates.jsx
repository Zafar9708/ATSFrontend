// components/VendorCandidatesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

const VendorCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [activeTab, setActiveTab] = useState('pending');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchCandidates = async (status = 'pending') => {
    try {
      setLoading(true);
      const token=localStorage.getItem('token')
      const response = await axios.get(
        `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/candidates?status=${status}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
        
      );
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching vendor candidates:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch vendor candidates',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(activeTab);
  }, [activeTab]);

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };

  const handleApprove = async () => {
    try {
      const response = await axios.patch(
        `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/candidates/${selectedCandidate._id}/approve`,
        {},
        getAuthHeaders()
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Candidate approved successfully',
          severity: 'success'
        });
        setApproveDialogOpen(false);
        setSelectedCandidate(null);
        fetchCandidates(activeTab);
      }
    } catch (error) {
      console.error('Error approving candidate:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to approve candidate',
        severity: 'error'
      });
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch(
        `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/candidates/${selectedCandidate._id}/reject`,
        { reason: rejectReason },
        getAuthHeaders()
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Candidate rejected successfully',
          severity: 'success'
        });
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedCandidate(null);
        fetchCandidates(activeTab);
      }
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to reject candidate',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'duplicate': return 'default';
      default: return 'default';
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width:1200}}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Vendor Submitted Candidates
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchCandidates(activeTab)}
            >
              Refresh
            </Button>
          </Box>

          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
            <Tab value="pending" label="Pending Review" />
            <Tab value="approved" label="Approved" />
            <Tab value="rejected" label="Rejected" />
            <Tab value="duplicate" label="Duplicates" />
          </Tabs>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate._id}>
                    <TableCell>{candidate.firstName} {candidate.lastName}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.vendorEmail}</TableCell>
                    <TableCell>{candidate.jobId?.jobTitle || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={candidate.status}
                        color={getStatusColor(candidate.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewCandidate(candidate)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      {candidate.status === 'pending' && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setApproveDialogOpen(true);
                            }}
                            color="success"
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setRejectDialogOpen(true);
                            }}
                            color="error"
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {candidates.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                No {activeTab} candidates found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* View Candidate Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Candidate Details - {selectedCandidate?.firstName} {selectedCandidate?.lastName}
        </DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{selectedCandidate.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Mobile</Typography>
                <Typography>{selectedCandidate.mobile || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Vendor</Typography>
                <Typography>{selectedCandidate.vendorEmail}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Job</Typography>
                <Typography>{selectedCandidate.jobId?.jobTitle || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Current CTC</Typography>
                <Typography>
                  {selectedCandidate.currentCTC ? 
                    `${selectedCandidate.currentCTC} ${selectedCandidate.currency}` : 'N/A'
                  }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Expected CTC</Typography>
                <Typography>
                  {selectedCandidate.expectedCTC ? 
                    `${selectedCandidate.expectedCTC} ${selectedCandidate.currency}` : 'N/A'
                  }
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Skills</Typography>
                <Typography>{selectedCandidate.skills || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Experience</Typography>
                <Typography>{selectedCandidate.experience || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Education</Typography>
                <Typography>{selectedCandidate.education || 'N/A'}</Typography>
              </Grid>
              {selectedCandidate.resume && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Resume</Typography>
                  <Button
                    variant="outlined"
                    href={selectedCandidate.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </Button>
                </Grid>
              )}
              {selectedCandidate.aiAnalysis && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">AI Analysis Score</Typography>
                  <Typography>
                    {selectedCandidate.aiAnalysis.matchPercentage || 0}% Match
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Candidate</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve {selectedCandidate?.firstName} {selectedCandidate?.lastName}?
            This will add them to the main candidate database.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reject Candidate</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to reject {selectedCandidate?.firstName} {selectedCandidate?.lastName}?
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorCandidatesPage;