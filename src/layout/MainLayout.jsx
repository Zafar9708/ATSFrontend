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

  const SIDEBAR_WIDTH = 180;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={themes[currentThemeName] || themes.default}>
      <CssBaseline />

      {/* ── MAIN LAYOUT WRAPPER ───────────────────────── */}
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden", // ⭐ IMPORTANT (stops full page scroll)
        }}
      >
        {/* ── DESKTOP SIDEBAR (FIXED) ─────────────────── */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: "100dvh",
            display: { xs: "none", sm: "block" },
            zIndex: 1200,
          }}
        >
          <Sidebar />
        </Box>

        {/* ── MOBILE SIDEBAR ─────────────────────────── */}
        {mobileOpen && (
          <>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: SIDEBAR_WIDTH,
                height: "100dvh",
                zIndex: 1300,
                bgcolor: "background.paper",
              }}
            >
              <Sidebar />
            </Box>

            {/* Overlay */}
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(0,0,0,0.5)",
                zIndex: 1250,
              }}
              onClick={handleDrawerToggle}
            />
          </>
        )}

        {/* ── MAIN CONTENT AREA ───────────────────────── */}
        <Box
          sx={{
            marginLeft: { md: `${SIDEBAR_WIDTH}px` }, // push content
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {/* HEADER */}
          <Header onMenuClick={handleDrawerToggle} />

          {/* SCROLLABLE CONTENT */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto", // ⭐ ONLY THIS SCROLLS
              p: 2,
            }}
          >
            <Outlet />
            {children}
          </Box>
        </Box>
      </Box>

      {/* CHATBOT */}
      <AtsChatbot />
    </ThemeProvider>
  );
};

const MainLayout = ({ children }) => (
  <CustomThemeProvider>
    <LayoutContent>{children}</LayoutContent>
  </CustomThemeProvider>
);

export default MainLayout;
