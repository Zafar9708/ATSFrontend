import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
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
  useScrollTrigger,
} from '@mui/material';
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
  CheckCircle,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Clean, simple corporate theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A3B5C',
      light: '#2A4C6E',
      dark: '#0E2A40',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2E7D8C',
      light: '#4897A6',
      dark: '#1E5F6B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E2B3C',
      secondary: '#4A5B6C',
    },
    grey: {
      50: '#F8FAFC',
      100: '#EFF2F6',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '3rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4A5B6C',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #E2E8F0',
          '&:hover': {
            borderColor: '#1A3B5C',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 1200px)': {
            maxWidth: '100% !important',
            paddingLeft: '48px !important',
            paddingRight: '48px !important',
          },
          '@media (min-width: 600px)': {
            paddingLeft: '24px !important',
            paddingRight: '24px !important',
          },
        },
      },
    },
  },
});

function ScrollTop({ children }) {
  const trigger = useScrollTrigger({ threshold: 100 });
  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <Fade in={trigger}>
      <Box onClick={handleClick} sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
        {children}
      </Box>
    </Fade>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <Card sx={{ height: '100%', p: 3 }}>
    <Box sx={{ mb: 2 }}>
      <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    </Box>
    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Card>
);

const Home = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <People sx={{ fontSize: 32 }} />,
      title: 'Candidate Management',
      description: 'Track and manage candidates throughout your hiring pipeline with powerful filtering and search.'
    },
    {
      icon: <Work sx={{ fontSize: 32 }} />,
      title: 'Job Posting',
      description: 'Create and publish job openings across multiple platforms with a single workflow.'
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: 'Interview Scheduling',
      description: 'Automated scheduling with calendar integration to coordinate interviews efficiently.'
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security with role-based access and data encryption.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Companies' },
    { value: '2M+', label: 'Candidates' },
    { value: '70%', label: 'Faster Hiring' },
    { value: '98%', label: 'Satisfaction' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Simple Navigation - Full Width */}
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0} 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid', 
          borderColor: 'grey.100',
          width: '100%'
        }}
      >
        <Box sx={{ px: { xs: 3, md: 6 } }}>
          <Toolbar sx={{ py: 1, px: '0 !important', minHeight: '64px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                  H
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.25rem' }}>
                HireOnBoard
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                component={RouterLink}
                to="/login/vendor"
                sx={{ borderColor: 'grey.200', color: 'text.primary' }}
              >
                Vendor
              </Button>
              <Button 
                variant="contained" 
                component={RouterLink}
                to="/login"
                sx={{ bgcolor: 'primary.main' }}
              >
                Employer
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
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/demo"
                  sx={{ borderColor: 'grey.200', color: 'text.primary' }}
                >
                  Request demo
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  width: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 20, color: 'secondary.main' }} />
                    <Typography variant="body2">AI Candidate Screening</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 20, color: 'secondary.main' }} />
                    <Typography variant="body2">Automated Scheduling</Typography>
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
                  2.4 hours
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Average time to first interview
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Active jobs
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      847
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Candidates
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      12.4K
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Stats Section - Full Width */}
      <Box sx={{ py: 6, bgcolor: 'grey.50', width: '100%' }}>
        <Box sx={{ px: { xs: 3, md: 6 } }}>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Features Section - Full Width */}
      <Box sx={{ py: 8, bgcolor: 'white', width: '100%' }}>
        <Box sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 2, color: 'primary.main' }}>
              Everything you need to hire better
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              Powerful features that help you find, evaluate, and hire the best talent.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* CTA Section - Full Width */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', width: '100%' }}>
        <Box sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Ready to get started?
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 4, fontSize: '1.125rem' }}>
              Join thousands of companies hiring better with HireOnBoard.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                Start free trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/demo"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Schedule demo
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Simple Footer - Full Width */}
      <Box sx={{ bgcolor: 'white', borderTop: '1px solid', borderColor: 'grey.100', py: 6, width: '100%' }}>
        <Box sx={{ px: { xs: 3, md: 6 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    H
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.125rem' }}>
                  HireOnBoard
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Modern hiring platform for forward-thinking companies.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[LinkedIn, Twitter, GitHub].map((Icon, i) => (
                  <IconButton key={i} size="small" sx={{ color: 'text.secondary' }}>
                    <Icon sx={{ fontSize: 20 }} />
                  </IconButton>
                ))}
              </Stack>
            </Grid>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact'] },
              { title: 'Resources', links: ['Blog', 'Guides', 'Support'] }
            ].map((column, i) => (
              <Grid item xs={4} md={2} key={i}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  {column.title}
                </Typography>
                <Stack spacing={1.5}>
                  {column.links.map((link, j) => (
                    <Link
                      key={j}
                      href="#"
                      variant="body2"
                      sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'grey.100' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" color="text.disabled">
              © {new Date().getFullYear()} HireOnBoard. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="#" variant="caption" sx={{ color: 'text.disabled', textDecoration: 'none' }}>
                Privacy
              </Link>
              <Link href="#" variant="caption" sx={{ color: 'text.disabled', textDecoration: 'none' }}>
                Terms
              </Link>
            </Stack>
          </Box>
        </Box>
      </Box>

      <ScrollTop>
        <Fab size="small" sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </ThemeProvider>
  );
};

export default Home;