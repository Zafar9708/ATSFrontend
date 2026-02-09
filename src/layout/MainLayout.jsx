
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Box, CssBaseline, Drawer } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { themes } from '../theme/themes';
import { ThemeProvider as CustomThemeProvider, useAppTheme } from '../context/ThemeContext';
import AtsChatbot from '../components/ChatBoat';
import { useUser } from '../contexts/UserContext';
import { useLocation } from 'react-router-dom';



const LayoutContent = ({ children,width }) => {
  const { currentThemeName } = useAppTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };
  
const drawerWidth = width ? width : 65;
console.log("drawerwidht",drawerWidth)


  return (
    <ThemeProvider theme={themes[currentThemeName] || themes.default}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Desktop Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
          }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            <Sidebar />
          </Drawer>

          {/* Permanent Sidebar (Desktop) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block', position: 'fixed' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                position: 'fixed',
                top: 0,
                left: 0,

                height: '100vh',
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          ml: { sm: `${drawerWidth}px` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: `calc(100% - ${drawerWidth}px)`,
          position: 'relative'
          
        }}
        >
          
          <Header onMenuClick={handleDrawerToggle} />
          <Box
            component="main"
            sx={{ 
              flex: 1,
              mt: '64px', 
              p: 0,
              minHeight: 'calc(100vh - 64px)',
              overflow: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              width: '100%',
              maxWidth: '100%',
            }}
          >
            {children}
          </Box>
          
          {/* Chatbot positioned in the bottom right corner */}
          <AtsChatbot />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const MainLayout = ({ children,width }) => (
  <CustomThemeProvider>
    <LayoutContent width={width}>{children}</LayoutContent>
  </CustomThemeProvider>
);

export default MainLayout;