
import React, { useState,useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import Dashboard from "../components/Jobs/JobDetailDashboard";
import JobInfo from "../components/Jobs/JobInfo";
import CandidatesTab from "../components/Candidates/CandidatesTab";


const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 2 }}>
      {children}
    </Box>
  ) : null;
};

const JobDetail = () => {
  const [activeTab, setActiveTab] = useState(0);
   const [userName, setUserName] = useState("");

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("user_name");
    if (storedUsername) {
      setUserName(storedUsername);
    } else {
      console.warn("No username found in localStorage");
    }
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const tabNames = [
    "DASHBOARD",
    "CANDIDATES",
    "JOBINFO",
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="flex flex-col h-screen">
    
      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4  ">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{marginLeft:15}}

          >
            {tabNames.map((tab, index) => (
              <Tab
                key={tab}
                label={tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                sx={{ textTransform: "capitalize" }}
              />
            ))}
          </Tabs>

          {/* Tab Content */}

          <TabPanel value={activeTab} index={0}>
            <Dashboard />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <CandidatesTab />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <JobInfo />
          </TabPanel>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;
