import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  AppBar,
  Toolbar,
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Link,
  Divider,
  Paper,
  Stack,
  IconButton,
  Fab,
  Fade,
  useScrollTrigger
} from "@mui/material";

import {
  Work,
  People,
  Speed,
  Security,
  ArrowForward,
  KeyboardArrowUp,
  LinkedIn,
  Twitter,
  GitHub,
  CheckCircle
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

/* ===========================
        THEME
=========================== */

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A3B5C",
      light: "#2A4C6E",
      dark: "#0E2A40",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#2E7D8C",
      light: "#4897A6",
      dark: "#1E5F6B",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#1E2B3C",
      secondary: "#4A5B6C"
    },
    grey: {
      50: "#F8FAFC",
      100: "#EFF2F6",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569"
    }
  },

  typography: {
    fontFamily:
      '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',

    h1: {
      fontWeight: 600,
      fontSize: "3rem",
      lineHeight: 1.2,
      "@media (max-width:600px)": {
        fontSize: "2rem"
      }
    },

    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3
    },

    h3: {
      fontWeight: 600,
      fontSize: "1.5rem"
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#4A5B6C"
    },

    button: {
      textTransform: "none",
      fontWeight: 500
    }
  },

  shape: {
    borderRadius: 8
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          overflowX: "hidden"
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px"
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none"
          }
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #E2E8F0",
          "&:hover": {
            borderColor: "#1A3B5C"
          }
        }
      }
    }
  }
});

/* ===========================
      SCROLL TO TOP
=========================== */

function ScrollTop({ children }) {
  const trigger = useScrollTrigger({ threshold: 100 });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

/* ===========================
      FEATURE CARD
=========================== */

const FeatureCard = ({ icon, title, description }) => (
  <Card sx={{ height: "100%", p: 3 }}>
    <Box sx={{ mb: 2, color: "primary.main" }}>{icon}</Box>

    <Typography
      variant="h6"
      sx={{ mb: 1, fontWeight: 600, color: "primary.main" }}
    >
      {title}
    </Typography>

    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Card>
);

/* ===========================
        HOME PAGE
=========================== */

const Home = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const features = [
    {
      icon: <People sx={{ fontSize: 32 }} />,
      title: "Candidate Management",
      description:
        "Track and manage candidates throughout your hiring pipeline."
    },
    {
      icon: <Work sx={{ fontSize: 32 }} />,
      title: "Job Posting",
      description:
        "Create and publish job openings across multiple platforms."
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: "Interview Scheduling",
      description:
        "Automated scheduling with calendar integration."
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "Secure Platform",
      description:
        "Enterprise-grade security with role-based access."
    }
  ];

  const stats = [
    { value: "10K+", label: "Companies" },
    { value: "2M+", label: "Candidates" },
    { value: "70%", label: "Faster Hiring" },
    { value: "98%", label: "Satisfaction" }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ width: "100%" }}>
        
        {/* ===========================
              NAVBAR
        =========================== */}

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid",
            borderColor: "grey.200"
          }}
        >
          <Box sx={{ px: { xs: 3, md: 6 } }}>
            <Toolbar sx={{ px: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 600 }}>
                    H
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  HireOnBoard
                </Typography>
              </Box>

<<<<<<< HEAD
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* <Button 
                variant="outlined" 
                component={RouterLink}
                to="/login/vendor"
                sx={{ borderColor: 'grey.200', color: 'text.primary' }}
              >
                Vendor
              </Button> */}
              <Button 
                variant="contained" 
                component={RouterLink}
                to="/login"
                sx={{ bgcolor: 'primary.main' }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {/* Hero Section - Full Width */}
      <Box sx={{ py: { xs: 6, md: 12 }, bgcolor: 'white', width: '100%' }}>
        <Box sx={{ px: { xs: 3, md: 6 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" sx={{ mb: 2, color: 'primary.main' }}>
                Modern hiring for
                <Box component="span" sx={{ color: 'secondary.main', display: 'block' }}>
                  growing companies
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.125rem', maxWidth: '500px' }}>
                Streamline your recruitment process with tools designed for efficiency and better candidate experiences.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  endIcon={<ArrowForward />}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Start free trial
                </Button>
=======
              <Stack direction="row" spacing={2}>
>>>>>>> 3d0656417305394ad9a0caa8872b012cd849f844
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/login/vendor"
                >
                  Vendor
                </Button>

                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                >
                  Employer
                </Button>
              </Stack>
            </Toolbar>
          </Box>
        </AppBar>

        {/* ===========================
            HERO SECTION
        =========================== */}

     <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 } }}> <Grid container spacing={6} alignItems="center">

```
{/* LEFT SIDE */}
<Grid item xs={12} md={6}>

  <Typography
    sx={{
      fontSize: { xs: "2.2rem", md: "3rem" },
      fontWeight: 700,
      color: "primary.main",
      lineHeight: 1.2,
      mb: 2
    }}
  >
    Hire Smarter,
    <Box component="span" sx={{ display: "block", color: "secondary.main" }}>
      Grow Faster
    </Box>
  </Typography>

  <Typography
    sx={{
      fontSize: "1.1rem",
      color: "text.secondary",
      mb: 4,
      maxWidth: "480px"
    }}
  >
    Simplify your recruitment workflow with powerful tools for
    candidate tracking, interview scheduling and smart hiring decisions.
  </Typography>

  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
    <Button
      variant="contained"
      size="large"
      component={RouterLink}
      to="/register"
      endIcon={<ArrowForward />}
      sx={{
        px: 4,
        py: 1.5,
        fontWeight: 600
      }}
    >
      Start Free Trial
    </Button>

    <Button
      variant="outlined"
      size="large"
      component={RouterLink}
      to="/demo"
      sx={{
        px: 4,
        py: 1.5
      }}
    >
      Request Demo
    </Button>
  </Stack>

</Grid>


{/* RIGHT SIDE CARD */}
<Grid item xs={12} md={6}>
  <Paper
    elevation={0}
    sx={{
      p: 4,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "grey.200",
      background: "linear-gradient(135deg,#F8FAFC,#FFFFFF)"
    }}
  >

    <Typography
      sx={{
        fontWeight: 600,
        mb: 3,
        color: "primary.main"
      }}
    >
      Hiring Insights
    </Typography>

    <Grid container spacing={3}>

      <Grid item xs={6}>
        <Box>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 700 }}>
            847
          </Typography>
          <Typography color="text.secondary">
            Active Jobs
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 700 }}>
            12.4K
          </Typography>
          <Typography color="text.secondary">
            Candidates
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 1 }} />
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircle sx={{ color: "secondary.main" }} />
            <Typography>AI Candidate Screening</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircle sx={{ color: "secondary.main" }} />
            <Typography>Automated Interview Scheduling</Typography>
          </Stack>
        </Stack>
      </Grid>

    </Grid>

  </Paper>
</Grid>
```

  </Grid>
</Box>


        {/* ===========================
            STATS
        =========================== */}

        <Box sx={{ py: 6, bgcolor: "grey.50", px: { xs: 3, md: 6 } }}>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary.main">
                    {stat.value}
                  </Typography>

                  <Typography color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ===========================
            FEATURES
        =========================== */}

        <Box sx={{ py: 8, px: { xs: 3, md: 6 } }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ===========================
            FOOTER
        =========================== */}

        <Box sx={{ py: 6, px: { xs: 3, md: 6 }, borderTop: "1px solid #E2E8F0" }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} HireOnBoard
          </Typography>
        </Box>

        <ScrollTop>
          <Fab size="small" sx={{ bgcolor: "primary.main", color: "white" }}>
            <KeyboardArrowUp />
          </Fab>
        </ScrollTop>

      </Box>
    </ThemeProvider>
  );
};

export default Home;