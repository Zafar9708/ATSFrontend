import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vendorMenuAnchor, setVendorMenuAnchor] = useState(null);

  const handleVendorMenuOpen = (event) => {
    setVendorMenuAnchor(event.currentTarget);
  };

  const handleVendorMenuClose = () => {
    setVendorMenuAnchor(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { text: 'Features', href: '#features' },
    { text: 'How It Works', href: '#how-it-works' },
    { text: 'Pricing', href: '#pricing' },
    { text: 'Testimonials', href: '#testimonials' },
    { text: 'About Us', href: '#about' },
  ];

  const vendorMenuItems = [
    { text: 'Vendor Login', href: '/vendor-login' }
  ];

  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: '280px',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={toggleMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem 
            key={index} 
            component="a" 
            href={item.href}
            onClick={toggleMobileMenu}
            sx={{ py: 1.5 }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem 
          component={RouterLink}
          to="/vendor-login"
          onClick={toggleMobileMenu}
          sx={{ py: 1.5 }}
        >
          <ListItemText primary="Vendor Login" />
        </ListItem>
        <ListItem 
          component={RouterLink}
          to="/login"
          onClick={toggleMobileMenu}
          sx={{ py: 1.5 }}
        >
          <ListItemText primary="Employer Login" />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={1} 
        sx={{ 
          bgcolor: 'background.paper',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: '100%',
          left: 0,
          right: 0
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            py: 1,
            px: 0,
            minHeight: { xs: '64px', sm: '70px' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src="/logo.png" 
                alt="HireOnBoard Logo"
                sx={{ 
                  width: { xs: 40, sm: 48 }, 
                  height: { xs: 40, sm: 48 }, 
                  mr: { xs: 1, sm: 2 },
                  bgcolor: theme.palette.primary.main,
                  color: 'white'
                }}
              >
                HOB
              </Avatar>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { sm: '1.1rem', md: '1.25rem' }
                }}
              >
                HireOnBoard
              </Typography>
            </Box>

            {!isMobile ? (
              <>
                <Box sx={{ display: 'flex', gap: { md: 2, lg: 3 } }}>
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
                      color="inherit"
                      href={item.href}
                      sx={{ 
                        fontWeight: 500,
                        color: 'text.primary',
                        fontSize: { md: '0.9rem', lg: '1rem' },
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<BusinessIcon />}
                    onClick={handleVendorMenuOpen}
                    sx={{ 
                      borderRadius: '50px',
                      fontSize: { md: '0.8rem', lg: '0.9rem' },
                      px: { md: 1.5, lg: 2 }
                    }}
                  >
                    Vendor
                  </Button>
                  <Menu
                    anchorEl={vendorMenuAnchor}
                    open={Boolean(vendorMenuAnchor)}
                    onClose={handleVendorMenuClose}
                  >
                    {vendorMenuItems.map((item, index) => (
                      <MenuItem 
                        key={index} 
                        onClick={handleVendorMenuClose}
                        component={RouterLink}
                        to={item.href}
                      >
                        {item.text}
                      </MenuItem>
                    ))}
                  </Menu>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonIcon />}
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      borderRadius: '50px',
                      fontSize: { md: '0.8rem', lg: '0.9rem' },
                      px: { md: 1.5, lg: 2 }
                    }}
                  >
                    Employer Login
                  </Button>
                </Box>
              </>
            ) : (
              <IconButton
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <MobileMenu />
    </>
  );
};

export default Navbar;