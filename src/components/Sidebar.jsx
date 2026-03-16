import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import BusinessIcon from '@mui/icons-material/Business'; // for vendors/companies
import FeedbackIcon from '@mui/icons-material/Feedback';
import WorkIcon from '@mui/icons-material/Work';
import TaskIcon from '@mui/icons-material/Task';
import TodayIcon from '@mui/icons-material/Today';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Update active index based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if current path matches any menu item
    const matchingIndex = menuItems.findIndex((item) => {
      const roleBasedPath = getRoleBasedPath(item.path);
      
      // For Jobs - check if path contains /jobs (including /dashboard/jobs/*)
      if (item.path === '/jobs') {
        return currentPath.includes('/jobs') || 
               currentPath === roleBasedPath || 
               currentPath.startsWith(roleBasedPath + '/') ||
               currentPath.includes('/dashboard/jobs');
      }
      
      // For other items, check exact match or starts with
      return currentPath === roleBasedPath || 
             currentPath.startsWith(roleBasedPath + '/');
    });

    if (matchingIndex !== -1) {
      setActiveIndex(matchingIndex);
    }
  }, [location.pathname]);

  const menuItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', path: '/dashboard' },
    { icon: <WorkIcon />, text: 'Jobs', path: '/jobs' },
    { icon: <GroupIcon />, text: 'Candidates', path: '/all/candidates' },
    { icon: <TodayIcon />, text: 'Interviews', path: '/total-interviews' },
    { icon: <BusinessIcon />, text: 'Vendors', path: '/total-vendors' },
    { icon: <BarChartIcon />, text: 'All Recruiters', path:"/total-recruiters" },
    { icon: <HelpIcon />, text: 'Help', path: '/dashboard/help' },
  ];

  const handleNavigation = (path, index) => {
    setActiveIndex(index);
    navigate(getRoleBasedPath(path));
  };

  const getRoleBasedPath = (basePath) => {
    if (!userData) return basePath;
    
    const prefix = userData.role === 'superadmin' ? '/superadmin' : 
                 userData.role === 'admin' ? `/tenant/${userData.tenantId}` :
                 userData.role === 'recruiter' ? `/recruiter/${userData.tenantId}` : '';
    
    return basePath.replace('/dashboard', prefix);
  };

  // Check if a menu item should be active
  const isItemActive = (item, index) => {
    const currentPath = location.pathname;
    const roleBasedPath = getRoleBasedPath(item.path);
    
    // For Jobs - active if path contains /jobs or /dashboard/jobs
    if (item.path === '/jobs') {
      return currentPath.includes('/jobs') || 
             currentPath.includes('/dashboard/jobs') ||
             currentPath === roleBasedPath || 
             currentPath.startsWith(roleBasedPath + '/');
    }
    
    // For Dashboard - only active on exact dashboard path
    if (item.path === '/dashboard') {
      return currentPath === roleBasedPath || 
             currentPath === '/dashboard' ||
             currentPath === `/${userData?.role === 'admin' ? `tenant/${userData.tenantId}` : ''}`;
    }
    
    // For other items
    return currentPath === roleBasedPath || 
           currentPath.startsWith(roleBasedPath + '/');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: 180,
        bgcolor: '#1F2937',
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        px: 1,
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        zIndex: 1200,
      }}
    >
      {/* Logo Image */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar 
          src="/logo.png"
          alt="Company Logo"
          sx={{ 
            width: 60, 
            height: 60,
            bgcolor: 'transparent'
          }}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = isItemActive(item, index);
          
          return (
            <Button
              key={index}
              onClick={() => handleNavigation(item.path, index)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: isActive ? 'primary.contrastText' : 'inherit',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                py: 1,
                '&:hover': { bgcolor: '#1976d2' },
                textTransform: 'none',
              }}
              disableRipple
            >
              {item.icon}
              <Typography variant="caption" sx={{ mt: 0.5 }}>{item.text}</Typography>
            </Button>
          );
        })}
      </Box>

      <Typography
        variant="caption"
        sx={{ 
          mt: 2, 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}
      >
        Powered by Wrocus Technology
      </Typography>
    </Box>
  );
};

export default Sidebar;