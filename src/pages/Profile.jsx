import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  alpha,
  Fade,
  useTheme
} from '@mui/material';
import { Edit, Save, Cancel, Person, Email, Badge } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
  const { user, updateUser } = useUser();
  const muiTheme = useTheme(); // Using MUI's useTheme hook as a fallback
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
  });

  // Safe theme access with fallbacks
  const getTheme = () => {
    try {
      // Try to use the custom theme context if available
      const { useAppTheme } = require('../context/ThemeContext');
      const { currentTheme } = useAppTheme();
      return currentTheme || muiTheme;
    } catch (error) {
      // Fall back to MUI's default theme if custom context is not available
      return muiTheme;
    }
  };

  const theme = getTheme();

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...formData };
      updateUser(updatedUser);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      username: user.username || '',
    });
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette?.primary?.main || '#4e54c8', 0.1)} 0%, ${alpha(theme.palette?.secondary?.main || '#8e54c9', 0.1)} 100%)`,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Safe color values with fallbacks
  const primaryColor = theme.palette?.primary?.main || '#4e54c8';
  const secondaryColor = theme.palette?.secondary?.main || '#8e54c9';

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        pt: 10,
        marginLeft:12,
        minHeight: '100vh',
        // background: `linear-gradient(135deg, ${alpha(primaryColor, 0.05)} 0%, ${alpha(secondaryColor, 0.05)} 100%)`,
      }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
         

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderRadius: 4,
                overflow: 'hidden',
                background: `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.7)} 100%)`,
                color: 'white',
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  p: 4,
                  textAlign: 'center'
                }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'white',
                      color: primaryColor,
                      fontSize: '2.5rem',
                      mb: 3,
                      border: '4px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    {getInitials(user.name || user.username)}
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: '600' }}>
                    {user.name || user.username}
                  </Typography>
                  <Box sx={{
                    px: 2,
                    py: 1,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    mt: 1,
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {user.role}
                  </Box>
                  
                  <Divider sx={{ width: '80%', my: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, fontSize: '20px' }} />
                    <Typography variant="body2">
                      {user.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge sx={{ mr: 1, fontSize: '20px' }} />
                    <Typography variant="body2">
                      @{user.username}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 4,
                background: 'white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 4,
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Typography variant="h4" sx={{ fontWeight: '600' }}>
                    Personal Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                      sx={{ 
                        borderRadius: 3,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: '600'
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={isLoading}
                        sx={{ 
                          borderRadius: 3,
                          px: 3,
                          textTransform: 'none',
                          fontWeight: '600'
                        }}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        sx={{ 
                          borderRadius: 3,
                          px: 3,
                          textTransform: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                {successMessage && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errorMessage}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                   
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Account Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Type"
                        value={user.role}
                        disabled
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 3, bgcolor: 'grey.50' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Member Since"
                        value={new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        disabled
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 3, bgcolor: 'grey.50' }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fade>
  );
};

export default Profile;