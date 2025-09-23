// components/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#features' },
        { text: 'Pricing', href: '#pricing' },
        { text: 'Integrations', href: '#integrations' },
        { text: 'Updates', href: '#updates' },
      ]
    },
    {
      title: 'Solutions',
      links: [
        { text: 'Enterprise', href: '#enterprise' },
        { text: 'Startups', href: '#startups' },
        { text: 'Recruitment Agencies', href: '#agencies' },
        { text: 'HR Teams', href: '#hr-teams' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { text: 'Blog', href: '#blog' },
        { text: 'Guides', href: '#guides' },
        { text: 'Help Center', href: '#help' },
        { text: 'Webinars', href: '#webinars' },
      ]
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '#about' },
        { text: 'Careers', href: '#careers' },
        { text: 'Contact', href: '#contact' },
        { text: 'Partners', href: '#partners' },
      ]
    }
  ];

  return (
    <Box component="footer" sx={{ 
      bgcolor: 'primary.dark', 
      color: 'white', 
      pt: 8, 
      pb: 4,
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  mr: 2, 
                  bgcolor: 'primary.main',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}
              >
                HOB
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                HireOnBoard
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
              The modern hiring and onboarding platform that helps companies attract, 
              hire, and retain top talent with cutting-edge technology.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  info@hireonboard.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <LocationIcon sx={{ mr: 1, mt: 0.5, fontSize: '1rem', opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Tech Street, Innovation City<br />
                  CA 94103, USA
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <IconButton 
                aria-label="Facebook" 
                color="inherit"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                aria-label="Twitter" 
                color="inherit"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                aria-label="LinkedIn" 
                color="inherit"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton 
                aria-label="Instagram" 
                color="inherit"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Instagram />
              </IconButton>
            </Stack>
          </Grid>
          
          {footerSections.map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link, linkIndex) => (
                  <Link 
                    key={linkIndex}
                    href={link.href} 
                    variant="body2" 
                    color="inherit" 
                    sx={{ 
                      opacity: 0.8, 
                      '&:hover': { 
                        opacity: 1, 
                        color: 'primary.light',
                        textDecoration: 'none'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} HireOnBoard. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack 
              direction="row" 
              spacing={3} 
              justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              sx={{ flexWrap: 'wrap' }}
            >
              <Link 
                href="#" 
                variant="body2" 
                color="inherit" 
                sx={{ 
                  opacity: 0.7, 
                  '&:hover': { opacity: 1 } 
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                variant="body2" 
                color="inherit" 
                sx={{ 
                  opacity: 0.7, 
                  '&:hover': { opacity: 1 } 
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                variant="body2" 
                color="inherit" 
                sx={{ 
                  opacity: 0.7, 
                  '&:hover': { opacity: 1 } 
                }}
              >
                Cookie Policy
              </Link>
              <Link 
                href="#" 
                variant="body2" 
                color="inherit" 
                sx={{ 
                  opacity: 0.7, 
                  '&:hover': { opacity: 1 } 
                }}
              >
                Security
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;