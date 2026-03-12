import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { themes } from "../theme/themes";
import {
  ThemeProvider as CustomThemeProvider,
  useAppTheme,
} from "../context/ThemeContext";
import AtsChatbot from "../components/ChatBoat";

const LayoutContent = ({ children }) => {
  const { currentThemeName } = useAppTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fixed dimensions
  const SIDEBAR_WIDTH = 260; // Fixed sidebar width
  const HEADER_HEIGHT = 70;  // Fixed header height

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={themes[currentThemeName] || themes.default}>
      <CssBaseline />

        
        {/* ── SIDEBAR (Fixed) ─────────────────────────────────────────── */}
        <Box
          component="aside"
          sx={{
            
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            height: "100vh",
            overflowY: "auto",
           bgcolor: "background.paper", 
            borderRight: "1px solid",
            borderColor: "divider",
            zIndex: 1200,
          
            display: { xs: "none", md: "block" }, // Hide on mobile, show on desktop
            boxShadow: "0 0 20px rgba(0,0,0,0.05)",
          }}
        >
          <Sidebar />
        </Box>

        {/* ── MOBILE SIDEBAR (Drawer) ─────────────────────────────────── */}
        <Box
          component="aside"
          sx={{
            display: { xs: mobileOpen ? "block" : "none", md: "none" },
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: SIDEBAR_WIDTH,
            
            bgcolor: "background.paper", 
            borderRight: "1px solid",
            borderColor: "divider",
            zIndex: 1300,
            overflowY: "auto",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            animation: "slideIn 0.3s ease",
            "@keyframes slideIn": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(0)" },
            },
          }}
        >
          <Sidebar />
        </Box>

        {/* ── OVERLAY for mobile sidebar ──────────────────────────────── */}
        {mobileOpen && (
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
             bgcolor: "rgba(0,0,0,0.5)",
             
              zIndex: 1250,
              animation: "fadeIn 0.3s ease",
              "@keyframes fadeIn": {
                "0%": { opacity: 0 },
                "100%": { opacity: 1 },
              },
            }}
            onClick={handleDrawerToggle}
          />
        )}

        {/* ── MAIN CONTENT AREA (with left margin for sidebar) ────────── */}

          {/* ── HEADER (Fixed) ────────────────────────────────────────── */}
     
            <Header onMenuClick={handleDrawerToggle} />
      

          {/* ── PAGE CONTENT with OUTLET ──────────────────────────────── */}
          
            {/* Use Outlet for nested routes */}
            <Outlet />
            {/* Also support children prop for backward compatibility */}
            {children}
        

          {/* ── CHATBOT ────────────────────────────────────────────────── */}
          <AtsChatbot />
       
  
    </ThemeProvider>
  );
};

const MainLayout = ({ children }) => (
  <CustomThemeProvider>
    <LayoutContent children={children} />
  </CustomThemeProvider>
);

export default MainLayout;