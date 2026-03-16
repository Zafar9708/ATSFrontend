// import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom";

// // MUI Components
// import { 
//   Box, Button, Typography, Container, Paper, Divider, 
//   Chip, Avatar, useMediaQuery, useTheme, Stack 
// } from "@mui/material";

// // Icons
// import { 
//   ArrowBack as ArrowBackIcon, LocationOn, Work, AccessTime, 
//   People, Email, Phone, Language, Favorite, FavoriteBorder, 
//   School, TrendingUp, Verified, CalendarMonth, InfoOutlined
// } from "@mui/icons-material";

// // Heroicons (for Section Headers)
// import { 
//   SparklesIcon, 
//   ListBulletIcon, 
//   ShieldCheckIcon, 
//   GiftIcon 
// } from '@heroicons/react/24/outline';

// const JobDetailPage = () => {
//   const [isSaved, setIsSaved] = useState(false);
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // Static Data (Mock)
//   const jobData = {
//     title: "Senior Product Manager",
//     company: "TechCorp Innovations",
//     companyLogo: "https://via.placeholder.com/60",
//     location: "San Francisco, CA (Hybrid)",
//     salary: "$140,000 - $180,000",
//     jobType: "Full-time",
//     experience: "5-8 years",
//     department: "Product Management",
//     postedDate: "2 days ago",
//     applicationsCount: 47,
//     deadline: "2024-04-15",
//     description: "We are looking for a visionary Senior Product Manager to lead our core product strategy and drive innovation in the fintech space. You'll work with cross-functional teams to define product roadmap, gather requirements, and deliver exceptional user experiences.",
//     responsibilities: [
//       "Define and execute product strategy and roadmap for our flagship product",
//       "Lead cross-functional teams including engineering, design, and marketing",
//       "Conduct market research and competitive analysis to identify opportunities",
//       "Gather and prioritize requirements from stakeholders and customers",
//       "Define KPIs and track product performance metrics"
//     ],
//     requirements: [
//       "5+ years of product management experience in SaaS or fintech",
//       "Strong analytical skills and data-driven decision making",
//       "Excellent communication and stakeholder management abilities",
//       "Bachelor's degree in Computer Science, Business, or related field"
//     ],
//     benefits: [
//       "Competitive salary and equity package",
//       "Comprehensive health, dental, and vision insurance",
//       "401(k) matching up to 4%",
//       "Unlimited PTO and flexible working hours",
//       "Professional development budget ($3,000/year)"
//     ],
//     skills: ["Product Strategy", "Agile", "Data Analysis", "User Research", "Roadmapping"],
//     recruiter: {
//       name: "Sarah Johnson",
//       title: "Senior Technical Recruiter",
//       avatar: "https://via.placeholder.com/50",
//       email: "sarah.j@techcorp.com",
//       phone: "+1 (555) 123-4567"
//     },
//     similarJobs: [
//       { title: "Product Manager - Mobile", company: "InnovateTech", location: "Remote", salary: "$120k - $160k" },
//       { title: "Senior Product Owner", company: "FinanceHub", location: "New York, NY", salary: "$130k - $170k" }
//     ]
//   };

//   // Section Header Component for Reusability
//   const SectionHeader = ({ icon: Icon, title, iconColor }) => (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
//       <Box sx={{ 
//         p: 1, 
//         borderRadius: '10px', 
//         bgcolor: `${iconColor}15`, 
//         color: iconColor,
//         display: 'flex' 
//       }}>
//         <Icon className="w-6 h-6" />
//       </Box>
//       <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
//         {title}
//       </Typography>
//     </Box>
//   );

//   return (
//     <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', pb: 8 , ml:"200px", mt:"70px"}}>
//       {/* Top Navigation Bar Space */}
    

//       <Container maxWidth="xl">
//         {/* Navigation / Actions */}
//         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => navigate(-1)}
//            sx={{
//       // Text and icon color - blue
//       color: '#1976d2',
      
//       // Hover effect - blue text with light grey background
//       '&:hover': {
//         backgroundColor: '#f5f5f5',  // Light grey background on hover
//         color: '#1565C0',  // Slightly darker blue on hover
//       },
      
//       // Responsive styles
//       fontSize: isMobile ? '0.9rem' : '1rem',
//       fontWeight: 500,
//       textTransform: 'none',
//       px: isMobile ? 1 : 2,
//       py: isMobile ? 0.5 : 1,
      
//       // Optional: smooth transition for hover effect
//       transition: 'all 0.2s ease',
      
//       // Remove default background
//       backgroundColor: 'transparent',
//     }}
//           >
//             Back 
//           </Button>
//         </Stack>

//         {/* Hero Header Card */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: { xs: 3, md: 5 }, 
//             borderRadius: '24px', 
//             border: '1px solid #e2e8f0',
//             background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
//             position: 'relative',
//             overflow: 'hidden',
//             mb: 4
//           }}
//         >
//           {/* Subtle Decorative Background Element */}
//           <Box sx={{ 
//             position: 'absolute', top: -50, right: -50, 
//             width: 200, height: 200, borderRadius: '50%', 
//             background: 'radial-gradient(circle, #3b82f610 0%, transparent 70%)' 
//           }} />

//           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, position: 'relative' }}>
//             <Avatar 
//               src={jobData.companyLogo}
//               variant="rounded"
//               sx={{ width: 100, height: 100, borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
//             />
            
//             <Box sx={{ flex: 1 }}>
//               <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                 <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
//                   {jobData.title}
//                 </Typography>
//                 {!isMobile && <Verified sx={{ color: '#3b82f6' }} />}
//               </Stack>
              
//               <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 3 }}>
//                 <Typography sx={{ color: '#475569', fontWeight: 600 }}>{jobData.company}</Typography>
//                 <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
//                 <Stack direction="row" spacing={1} alignItems="center">
//                   <LocationOn sx={{ fontSize: 18, color: '#94a3b8' }} />
//                   <Typography sx={{ color: '#64748b' }}>{jobData.location}</Typography>
//                 </Stack>
//               </Stack>

//               <Stack direction="row" spacing={1.5}>
//                 <Chip label={jobData.jobType} sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600 }} />
//                 <Chip label={jobData.experience} sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 600 }} />
//                 <Chip label={jobData.department} variant="outlined" sx={{ color: '#64748b' }} />
//               </Stack>
//             </Box>

//             <Box sx={{ textAlign: { md: 'right' }, minWidth: '200px' }}>
//               <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
//                 {jobData.salary.split(' ')[0]}
//               </Typography>
//               <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, mb: 3 }}>
//                 ANNUAL SALARY
//               </Typography>
//               <Button 
//                 fullWidth 
//                 variant="contained" 
//                 sx={{ 
//                   py: 1.5, borderRadius: '12px', bgcolor: '#2563eb', 
//                   boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
//                   textTransform: 'none', fontSize: '1rem', fontWeight: 700
//                 }}
//               >
//                 Apply Now
//               </Button>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Main Grid Content */}
//         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' }, gap: 4 }}>
          
//           {/* Left Side: Details */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
//             <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
//               <SectionHeader icon={SparklesIcon} title="About the Role" iconColor="#3b82f6" />
//               <Typography sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1.05rem' }}>
//                 {jobData.description}
//               </Typography>
//             </Paper>

//             <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
//               <SectionHeader icon={ListBulletIcon} title="Responsibilities" iconColor="#10b981" />
//               <Stack spacing={2.5}>
//                 {jobData.responsibilities.map((text, i) => (
//                   <Box key={i} sx={{ display: 'flex', gap: 2 }}>
//                     <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', mt: 1.2, flexShrink: 0 }} />
//                     <Typography sx={{ color: '#334155', lineHeight: 1.5 }}>{text}</Typography>
//                   </Box>
//                 ))}
//               </Stack>
//             </Paper>

//             <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
//               <SectionHeader icon={ShieldCheckIcon} title="Requirements" iconColor="#f59e0b" />
//               <Stack spacing={2.5}>
//                 {jobData.requirements.map((text, i) => (
//                   <Box key={i} sx={{ display: 'flex', gap: 2 }}>
//                     <Box sx={{ p: 0.5, borderRadius: '50%', bgcolor: '#fef3c7', display: 'flex' }}>
//                       <Verified sx={{ fontSize: 14, color: '#d97706' }} />
//                     </Box>
//                     <Typography sx={{ color: '#334155' }}>{text}</Typography>
//                   </Box>
//                 ))}
//               </Stack>
//             </Paper>

//             <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
//               <SectionHeader icon={GiftIcon} title="Perks & Benefits" iconColor="#ef4444" />
//               <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
//                 {jobData.benefits.map((benefit, i) => (
//                   <Stack key={i} direction="row" spacing={1.5} alignItems="center">
//                     <Favorite sx={{ color: '#fca5a5', fontSize: 20 }} />
//                     <Typography sx={{ color: '#334155', fontWeight: 500 }}>{benefit}</Typography>
//                   </Stack>
//                 ))}
//               </Box>
//             </Paper>
//           </Box>

//           {/* Right Side: Sidebar */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
//             {/* Quick Stats Sidebar */}
//             <Paper elevation={0} sx={{ 
//               p: 4, borderRadius: '24px', border: '1px solid #e2e8f0',
//               position: 'sticky', top: '90px' 
//             }}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>
//                 Job Overview
//               </Typography>
              
//               <Stack spacing={3}>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Stack direction="row" spacing={1.5} alignItems="center">
//                     <CalendarMonth sx={{ color: '#94a3b8' }} />
//                     <Typography sx={{ color: '#64748b' }}>Posted date</Typography>
//                   </Stack>
//                   <Typography sx={{ fontWeight: 600 }}>{jobData.postedDate}</Typography>
//                 </Stack>

//                 <Stack direction="row" justifyContent="space-between">
//                   <Stack direction="row" spacing={1.5} alignItems="center">
//                     <People sx={{ color: '#94a3b8' }} />
//                     <Typography sx={{ color: '#64748b' }}>Applicants</Typography>
//                   </Stack>
//                   <Typography sx={{ fontWeight: 600 }}>{jobData.applicationsCount}</Typography>
//                 </Stack>

//                 <Stack direction="row" justifyContent="space-between">
//                   <Stack direction="row" spacing={1.5} alignItems="center">
//                     <InfoOutlined sx={{ color: '#94a3b8' }} />
//                     <Typography sx={{ color: '#64748b' }}>Closing date</Typography>
//                   </Stack>
//                   <Typography sx={{ fontWeight: 600, color: '#ef4444' }}>{jobData.deadline}</Typography>
//                 </Stack>
//               </Stack>

//               <Divider sx={{ my: 3 }} />

//               <Button 
//                 fullWidth 
//                 variant="outlined" 
//                 startIcon={isSaved ? <Favorite sx={{ color: '#ef4444' }} /> : <FavoriteBorder />}
//                 onClick={() => setIsSaved(!isSaved)}
//                 sx={{ 
//                   borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 600,
//                   borderColor: '#e2e8f0', color: '#1e293b'
//                 }}
//               >
//                 {isSaved ? 'Saved to Favorites' : 'Save for Later'}
//               </Button>
//             </Paper>

          
           
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default JobDetailPage;



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
    <div className="flex flex-col h-screen    ">
    
      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{marginLeft:15,marginTop:5}}


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
