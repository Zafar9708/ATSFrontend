import React, { useState } from 'react';
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
        {[
          { icon: <DashboardIcon />, text: 'Dashboard', path: '/dashboard' },
          { icon: <WorkIcon />, text: 'Jobs', path: '/jobs' },
          { icon: <GroupIcon />, text: 'Candidates', path: '/all/candidates' },
          { icon: <TodayIcon />, text: 'Interviews', path: '/total-interviews' },
          { icon: <BusinessIcon />, text: 'Vendors', path: '/total-vendors' },

          { icon: <NotificationsIcon />, text: 'Notifications', path: '/notifications' },
          { icon: <BarChartIcon />, text: 'Reports', path: '/dashboard/reports' },
          { icon: <TaskIcon />, text: 'Tasks', path: '/tasks' },
          { icon: <SettingsIcon />, text: 'Settings', path: '/dashboard/settings' },
          { icon: <HelpIcon />, text: 'Help', path: '/dashboard/help' },
          // { icon: <FeedbackIcon />, text: 'Feedback', path: '/dashboard/feedback' },
        ].map((item, index) => {
          const roleBasedPath = getRoleBasedPath(item.path);
          const isActive =
            location.pathname === roleBasedPath ||
            (index !== 0 && location.pathname.startsWith(roleBasedPath));
          
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