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
  Container,
  InputAdornment,
  GlobalStyles
} from "@mui/material";
import {
  BusinessOutlined,
  PersonOutline,
  EmailOutlined,
  LockOutlined,
  BadgeOutlined
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Using the same professional theme as Login
const recruitTheme = createTheme({
  palette: {
    primary: { main: "#3b82f6" }, // Blue-500
    background: { default: "#ffffff" },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h5: { fontWeight: 800, color: "#1e293b", fontSize: "1.5rem" },
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
  },
});

const RegisterForm = ({ userRole, tenantId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const isSuperAdminRegistering = userRole === "superadmin";
  const isAdminRegistering = userRole === "admin";

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    ...(isSuperAdminRegistering && {
      tenantName: Yup.string().required("Tenant name is required"),
      tenantDomain: Yup.string().required("Tenant domain is required"),
    }),
    ...(isAdminRegistering && {
      username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
    }),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let endpoint = "";
      let payload = {};

      if (isSuperAdminRegistering) {
        endpoint = "/api/v1/tenants";
        payload = {
          name: values.tenantName,
          domain: values.tenantDomain,
          adminEmail: values.email,
          adminPassword: values.password
        };
      } else if (isAdminRegistering) {
        endpoint = "/api/v1/tenants/recruiters";
        payload = {
          email: values.email,
          password: values.password,
          username: values.username,
          tenantId: tenantId
        };
      } else {
        endpoint = "/user/register";
        payload = values;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate(isSuperAdminRegistering ? "/tenants" : "/recruiters");
        }, 2000);
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          px: 2
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
              backgroundColor: "white",
              maxHeight: '95vh',
              overflowY: 'auto' // Local scroll only if form is very long on mobile
            }}
          >
            <Box textAlign="center" mb={3}>
              <Box sx={{ display: "inline-flex", p: 1.5, borderRadius: "12px", bgcolor: "#eff6ff", mb: 2 }}>
                {isSuperAdminRegistering ? 
                  <BusinessOutlined color="primary" fontSize="large" /> : 
                  <PersonOutline color="primary" fontSize="large" />
                }
              </Box>
              <Typography variant="h5">
                {isSuperAdminRegistering ? "Create New Tenant" : 
                 isAdminRegistering ? "Add New Recruiter" : "Register Account"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
                Fill in the details below to proceed
              </Typography>
            </Box>

            {isSuccess ? (
              <Box textAlign="center" py={4}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: "12px" }}>
                  Registration successful!
                </Alert>
                <CircularProgress size={32} />
                <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
                  Redirecting to your dashboard...
                </Typography>
              </Box>
            ) : (
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  confirmPassword: "",
                  tenantName: "",
                  tenantDomain: "",
                  username: ""
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                  <Form>
                    {errorMessage && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                        {errorMessage}
                      </Alert>
                    )}

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      {isSuperAdminRegistering && (
                        <>
                          <Box>
                            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Tenant Name</Typography>
                            <TextField
                              fullWidth size="small" name="tenantName" placeholder="Company Name"
                              value={values.tenantName} onChange={handleChange} onBlur={handleBlur}
                              error={touched.tenantName && Boolean(errors.tenantName)}
                              helperText={touched.tenantName && errors.tenantName}
                              InputProps={{ startAdornment: <InputAdornment position="start"><BusinessOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Tenant Domain</Typography>
                            <TextField
                              fullWidth size="small" name="tenantDomain" placeholder="company.com"
                              value={values.tenantDomain} onChange={handleChange} onBlur={handleBlur}
                              error={touched.tenantDomain && Boolean(errors.tenantDomain)}
                              helperText={touched.tenantDomain && errors.tenantDomain}
                              InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                            />
                          </Box>
                        </>
                      )}

                      {isAdminRegistering && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                          <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Username</Typography>
                          <TextField
                            fullWidth size="small" name="username" placeholder="john_doe"
                            value={values.username} onChange={handleChange} onBlur={handleBlur}
                            error={touched.username && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutline sx={{ fontSize: 18 }} /></InputAdornment> }}
                          />
                        </Box>
                      )}

                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Email Address</Typography>
                        <TextField
                          fullWidth size="small" name="email" placeholder="email@example.com"
                          value={values.email} onChange={handleChange} onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Password</Typography>
                        <TextField
                          fullWidth size="small" name="password" type="password" placeholder="••••••••"
                          value={values.password} onChange={handleChange} onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>Confirm Password</Typography>
                        <TextField
                          fullWidth size="small" name="confirmPassword" type="password" placeholder="••••••••"
                          value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                        />
                      </Box>
                    </Box>

                    <Button
                      fullWidth type="submit" variant="contained" disabled={isLoading}
                      sx={{ mt: 4, py: 1.5, boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)" }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 
                       (isSuperAdminRegistering ? "Create Tenant" : 
                        isAdminRegistering ? "Add Recruiter" : "Register")}
                    </Button>

                    {!isAdminRegistering && !isSuperAdminRegistering && (
                      <Box mt={3} textAlign="center">
                        <Typography variant="body2" color="#64748b">
                          Already have an account?{' '}
                          <Link href="/login" sx={{ color: "#3b82f6", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
                        </Typography>
                      </Box>
                    )}
                  </Form>
                )}
              </Formik>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterForm;