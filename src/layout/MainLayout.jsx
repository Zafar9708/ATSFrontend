import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Box, CssBaseline, Drawer } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { themes } from "../theme/themes";
import {
  ThemeProvider as CustomThemeProvider,
  useAppTheme,
} from "../context/ThemeContext";
import AtsChatbot from "../components/ChatBoat";

const LayoutContent = ({ children, width }) => {

  const { currentThemeName } = useAppTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = width ? width : 45;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={themes[currentThemeName] || themes.default}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
        }}
      >

        {/* SIDEBAR AREA */}

        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
          }}
        >

          {/* MOBILE DRAWER */}

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <Sidebar />
          </Drawer>

          {/* DESKTOP DRAWER */}

          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                borderRight: "1px solid #eee",
              },
            }}
          >
            <Sidebar />
          </Drawer>
        </Box>


        {/* MAIN CONTENT */}

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            ml: { xs: 0, sm: `${drawerWidth-30}px` },
            minHeight: "100vh",
            
          }}
        >

          {/* HEADER */}

          <Header onMenuClick={handleDrawerToggle} />


          {/* PAGE CONTENT */}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mt: "3px",
              p: { xs: 1.5, sm: 2, md: 3 },
              width: "100%",
              overflowX: "hidden",
            }}
          >
            {children}
          </Box>


          {/* CHATBOT */}

          <AtsChatbot />

        </Box>
      </Box>
    </ThemeProvider>
  );
};


const MainLayout = ({ children, width }) => (
  <CustomThemeProvider>
    <LayoutContent width={width}>
      {children}
    </LayoutContent>
  </CustomThemeProvider>
);

export default MainLayout;