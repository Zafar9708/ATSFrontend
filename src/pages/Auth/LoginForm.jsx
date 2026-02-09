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
  IconButton,
  GlobalStyles
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  VerifiedUserOutlined
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useUser } from "../../contexts/UserContext";

const recruitTheme = createTheme({
  palette: {
    primary: { main: "#3b82f6" }, // Blue-500
    secondary: { main: "#f50057" },
    background: { default: "#ffffff" },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h4: { fontWeight: 800, color: "#1e293b", fontSize: "1.75rem" },
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

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await loginUser(values);
      localStorage.setItem("token", data.token);
      updateUser(data.data.user);

      switch (data.data.user.role) {
        case "superadmin":
          navigate("/superadmin/dashboard");
          break;
        case "admin":
          navigate(`/tenant/${data.data.user.tenantId}/dashboard`);
          break;
        case "recruiter":
          navigate(`/recruiter/${data.data.user.tenantId}/dashboard`);
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
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
            <Box textAlign="center" mb={3}>
              <Box sx={{ display: "inline-flex", p: 1.5, borderRadius: "12px", bgcolor: "#eff6ff", mb: 2 }}>
                <VerifiedUserOutlined color="primary" fontSize="large" />
              </Box>
              {/* <Typography variant="h4">ATS</Typography> */}
              <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
                Welcome back! Please login to continue.
              </Typography>
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                {errorMessage}
              </Alert>
            )}

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Box mb={2.5}>
                    <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>
                      Email Address
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      placeholder="name@company.com"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined sx={{ fontSize: 20, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 700, color: "#475569" }}>
                      Password
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      variant="outlined"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ fontSize: 20, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                              {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                      "&:hover": { backgroundColor: "#2563eb" },
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                  </Button>

                  <Box textAlign="center" mt={3} display="flex" flexDirection="column" gap={1.5}>
                    <Link 
                      href="/register" 
                      variant="body2" 
                      onClick={handleRegisterClick}
                      sx={{ 
                        color: 'primary.main', 
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Create Superadmin Account
                    </Link>
                    <Link 
                      href="/forgot-password" 
                      variant="body2" 
                      onClick={handleForgotPasswordClick}
                      sx={{ 
                        color: 'secondary.main', 
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;