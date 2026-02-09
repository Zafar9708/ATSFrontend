import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Stepper,
  Step,
  StepLabel,
  Container,
  InputAdornment,
  GlobalStyles
} from "@mui/material";
import {
  LockResetOutlined,
  EmailOutlined,
  VpnKeyOutlined,
  LockOutlined,
  ChevronLeftOutlined
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyOTP, resetPassword } from "../services/authService";

const recruitTheme = createTheme({
  palette: {
    primary: { main: "#3b82f6" }, // Blue-500
    secondary: { main: "#f50057" },
    background: { default: "#ffffff" },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h5: { fontWeight: 800, color: "#1e293b" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
          padding: "10px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          "&.Mui-active": { color: "#3b82f6" },
          "&.Mui-completed": { color: "#10b981" }, // Green for completed steps
        },
      },
    },
  },
});

const steps = ['Email', 'Verify', 'Reset'];

const ForgotPasswordForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  // Your existing handlers (kept exactly as they were)
  const handleEmailSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await forgotPassword({ email: values.email });
      setEmail(values.email);
      setSuccessMessage("OTP sent to your email!");
      setActiveStep(1);
    } catch (error) {
      setErrorMessage(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const data = await verifyOTP({ email, otp: values.otp });
      setResetToken(data.resetToken);
      setActiveStep(2);
    } catch (error) {
      setErrorMessage(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await resetPassword(resetToken, {
        password: values.password,
        passwordConfirm: values.passwordConfirm
      });
      setSuccessMessage("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.message || "Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      await forgotPassword({ email });
      setSuccessMessage("OTP resent to your email!");
    } catch (error) {
      setErrorMessage(error.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Your validation schemas (kept exactly as they were)
  const emailValidationSchema = Yup.object({ email: Yup.string().email("Invalid email").required("Required") });
  const otpValidationSchema = Yup.object({ otp: Yup.string().length(6, "Must be 6 digits").matches(/^\d+$/, "Numbers only").required("Required") });
  const passwordValidationSchema = Yup.object({
    password: Yup.string().min(6, "Min 6 characters").required("Required"),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Required"),
  });

  return (
    <ThemeProvider theme={recruitTheme}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0, padding: 0 } }} />

      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
              backgroundColor: "white",
            }}
          >
            <Box textAlign="center" mb={4}>
              <Box sx={{ display: "inline-flex", p: 1.5, borderRadius: "12px", bgcolor: "#eff6ff", mb: 2 }}>
                <LockResetOutlined color="primary" fontSize="large" />
              </Box>
              <Typography variant="h5">Reset Password</Typography>
              
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {errorMessage && <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: "10px" }}>{successMessage}</Alert>}

            {activeStep === 0 && (
              <Formik initialValues={{ email: "" }} validationSchema={emailValidationSchema} onSubmit={handleEmailSubmit}>
                {({ errors, touched }) => (
                  <Form>
                    <Box mb={3}>
                      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Email Address</Typography>
                      <Field as={TextField} fullWidth name="email" placeholder="name@company.com" error={touched.email && !!errors.email} helperText={touched.email && errors.email}
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ fontSize: 20 }} /></InputAdornment> }} />
                    </Box>
                    <Button fullWidth type="submit" variant="contained" disabled={isLoading}>{isLoading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}</Button>
                  </Form>
                )}
              </Formik>
            )}

            {activeStep === 1 && (
              <Formik initialValues={{ otp: "" }} validationSchema={otpValidationSchema} onSubmit={handleOTPSubmit}>
                {({ errors, touched }) => (
                  <Form>
                    <Box mb={3}>
                      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>6-Digit Code</Typography>
                      <Field as={TextField} fullWidth name="otp" placeholder="123456" error={touched.otp && !!errors.otp} helperText={touched.otp && errors.otp}
                        InputProps={{ startAdornment: <InputAdornment position="start"><VpnKeyOutlined sx={{ fontSize: 20 }} /></InputAdornment> }} />
                      <Box textAlign="right" mt={1}>
                        <Link href="#" onClick={handleResendOTP} sx={{ fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>Resend OTP?</Link>
                      </Box>
                    </Box>
                    <Button fullWidth type="submit" variant="contained" disabled={isLoading}>{isLoading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}</Button>
                  </Form>
                )}
              </Formik>
            )}

            {activeStep === 2 && (
              <Formik initialValues={{ password: "", passwordConfirm: "" }} validationSchema={passwordValidationSchema} onSubmit={handlePasswordSubmit}>
                {({ errors, touched }) => (
                  <Form>
                    <Box mb={2}>
                      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>New Password</Typography>
                      <Field as={TextField} fullWidth name="password" type="password" placeholder="••••••••" error={touched.password && !!errors.password} helperText={touched.password && errors.password}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 20 }} /></InputAdornment> }} />
                    </Box>
                    <Box mb={3}>
                      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Confirm Password</Typography>
                      <Field as={TextField} fullWidth name="passwordConfirm" type="password" placeholder="••••••••" error={touched.passwordConfirm && !!errors.passwordConfirm} helperText={touched.passwordConfirm && errors.passwordConfirm}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 20 }} /></InputAdornment> }} />
                    </Box>
                    <Button fullWidth type="submit" variant="contained" disabled={isLoading}>{isLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}</Button>
                  </Form>
                )}
              </Formik>
            )}

            <Box mt={4} textAlign="center">
              <Link
                href="/login"
                onClick={(e) => { e.preventDefault(); navigate("/login"); }}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: "#64748b",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: "none",
                  '&:hover': { color: "#3b82f6" }
                }}
              >
                <ChevronLeftOutlined sx={{ fontSize: 18, mr: 0.5 }} />
                Back to Sign In
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPasswordForm;