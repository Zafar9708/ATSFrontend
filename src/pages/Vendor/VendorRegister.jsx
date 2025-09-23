import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  MenuItem,
  CircularProgress,
  Paper,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business,
  Person,
  LocationOn,
  Phone,
  Email,
  Lock,
  AssignmentInd,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #f8fbff)',
  margin: '0 auto',
  maxWidth: '1000px'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
  },
}));

const steps = ['Personal Details', 'Company Information', 'Account Setup'];

const VendorRegister = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    industry: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!token) {
      setErrorMsg('Invalid or missing registration token. Please use the link provided in your invitation email.');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Missing or invalid token.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/vendor/register?token=${token}`,
        formData
      );

      setSubmitted(true);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1 }} /> Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  onChange={handleChange}
                  value={formData.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  onChange={handleChange}
                  value={formData.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  select
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  sx={{ width: '300%' }}
                >
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Recruiter">Recruiter</MenuItem>
                </StyledTextField>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1 }} /> Company Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  onChange={handleChange}
                  value={formData.companyName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Company Email"
                  name="companyEmail"
                  type="email"
                  onChange={handleChange}
                  value={formData.companyEmail}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Company Phone"
                  name="companyPhone"
                  type="tel"
                  onChange={handleChange}
                  value={formData.companyPhone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Company Address"
                  name="companyAddress"
                  multiline
                  rows={2}
                  onChange={handleChange}
                  value={formData.companyAddress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  select
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  sx={{ width: '300%', }}
                >
                  <MenuItem value="">Select Industry</MenuItem>
                  <MenuItem value="Information Technology">Information Technology</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="Construction">Construction</MenuItem>
                  <MenuItem value="Telecommunications">Telecommunications</MenuItem>
                  <MenuItem value="Transportation and Logistics">Transportation and Logistics</MenuItem>
                  <MenuItem value="Marketing and Advertising">Marketing and Advertising</MenuItem>
                  <MenuItem value="Legal Services">Legal Services</MenuItem>
                  <MenuItem value="Human Resources / Staffing">Human Resources / Staffing</MenuItem>
                  <MenuItem value="Real Estate">Real Estate</MenuItem>
                  <MenuItem value="Media and Entertainment">Media and Entertainment</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                  <MenuItem value="Non-Profit">Non-Profit</MenuItem>
                  <MenuItem value="Energy and Utilities">Energy and Utilities</MenuItem>
                  <MenuItem value="Hospitality">Hospitality</MenuItem>
                  <MenuItem value="Agriculture">Agriculture</MenuItem>
                  <MenuItem value="Aerospace and Defense">Aerospace and Defense</MenuItem>
                  <MenuItem value="E-commerce">E-commerce</MenuItem>
                  <MenuItem value="Pharmaceuticals">Pharmaceuticals</MenuItem>
                  <MenuItem value="Automotive">Automotive</MenuItem>
                  <MenuItem value="Insurance">Insurance</MenuItem>
                  <MenuItem value="Consulting">Consulting</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </StyledTextField>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lock sx={{ mr: 1 }} /> Account Security
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={formData.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  Your account will require approval before you can access the system.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (submitted) {
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '60vh',
            justifyContent: 'center'
          }}
        >
          <Card sx={{ padding: 4, textAlign: 'center', borderRadius: '16px', maxWidth: '500px' }}>
            <CardContent>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom color="primary">
                Registration Successful
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                Thank you for registering as a vendor with <strong>Wrocus Technologies Pvt.Ltd ATS</strong>.
                Your account is pending approval and you will receive a confirmation email once it's activated.
              </Typography>
              <StyledButton 
                variant="contained" 
                color="primary"
                href="/vendor/login"
                fullWidth
              >
                Return to Login
              </StyledButton>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg" sx={{marginLeft:36}}>
        <StyledPaper elevation={0}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AssignmentInd color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography component="h1" variant="h4" gutterBottom color="primary" fontWeight="600">
              Vendor Registration
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Wrocus Technologies Pvt.Ltd ATS
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {errorMsg}
            </Alert>
          )}
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <StyledButton
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
              >
                Back
              </StyledButton>
              
              {activeStep === steps.length - 1 ? (
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
                </StyledButton>
              ) : (
                <StyledButton
                  onClick={handleNext}
                  variant="contained"
                >
                  Next
                </StyledButton>
              )}
            </Box>
          </form>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default VendorRegister;