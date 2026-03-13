import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Snackbar, Alert, useMediaQuery, useTheme, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import StepIndicator from "../components/Jobs/StepIndicator";
import JobDescriptionForm from "../components/Jobs/JobDescriptionForm";
import JobDetailsForm from "../components/Jobs/JobDetailsForm";
import PublishOptionsForm from "../components/Jobs/PublishOptionsForm";
import { createJob, updateJob, fetchJobDetails } from "../services/Jobs/jobCreationService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import adminService from "../services/adminService";
import { useUser } from "../contexts/UserContext"; 

const JobCreationPage = () => {
  const theme = useTheme();
  const { user: currentUser } = useUser(); 
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Header height constants (adjust these based on your actual header height)
  const HEADER_HEIGHT = {
    mobile: '64px',    // Typical mobile header height
    tablet: '72px',    // Tablet header height
    desktop: '80px'    // Desktop header height
  };

  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    experience: '',
    jobDesc: '',
    BusinessUnit: '',
    Client: '',
    jobType: '',
    location: '',
    locations: [],
    openings: '',
    targetHireDate: null,
    currency: '',
    amount: '',
    allowReapply: false,
    reapplyDate: null,
    markPriority: false,
    hiringFlow: ["Technical Round", "Manager Interview", "HR Round"],
    careerSite: false,
    internalEmployees: false,
    referToEmployees: false,
    salesPerson: '',
    recruitingPerson: '',
    assignedRecruiters: []
  });

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/jobs');
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        console.log('Current user from context:', currentUser);
        
        if (currentUser && currentUser.role === 'admin') {
          await fetchRecruiters();
        }
        
        if (id) {
          await loadJobData();
        }
      } catch (error) {
        console.error('Error initializing page:', error);
        setErrorMessage('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      initializePage();
    } else {
      setLoading(false);
    }
  }, [id, currentUser]);

  const fetchRecruiters = async () => {
    try {
      const response = await adminService.getRecruiters();
      console.log('Recruiters response:', response);
      
      let recruitersList = [];
      
      if (response.recruiters && Array.isArray(response.recruiters)) {
        recruitersList = response.recruiters;
      } else if (response.recuiter && Array.isArray(response.recuiter)) {
        recruitersList = response.recuiter;
      } else if (Array.isArray(response)) {
        recruitersList = response;
      } else {
        console.error('Unexpected recruiters response format:', response);
      }
      
      console.log('Processed recruiters:', recruitersList);
      setRecruiters(recruitersList);
      
    } catch (err) {
      console.error('Error fetching recruiters:', err);
      setRecruiters([]);
    }
  };

  const loadJobData = async () => {
    try {
      let jobData;
      if (location.state?.job) {
        jobData = location.state.job;
      } else {
        const response = await fetchJobDetails(id);
        jobData = response.job;
      }
      
      setFormData({
        jobTitle: jobData.jobTitle || '',
        department: jobData.department || '',
        experience: jobData.experience || '',
        jobDesc: jobData.jobDesc || '',
        BusinessUnit: jobData.jobFormId?.BusinessUnit || '',
        Client: jobData.jobFormId?.Client || '',
        jobType: jobData.jobFormId?.jobType || '',
        location: jobData.jobFormId?.location || '',
        locations: jobData.jobFormId?.locations || [],
        openings: jobData.jobFormId?.openings || '',
        targetHireDate: jobData.jobFormId?.targetHireDate || null,
        currency: jobData.jobFormId?.currency || '',
        amount: jobData.jobFormId?.amount || '',
        allowReapply: jobData.jobFormId?.allowReapply || false,
        reapplyDate: jobData.jobFormId?.reapplyDate || null,
        markPriority: jobData.jobFormId?.markPriority || false,
        hiringFlow: jobData.jobFormId?.hiringFlow || ["Technical Round", "Manager Interview", "HR Round"],
        careerSite: jobData.careerSite || false,
        internalEmployees: jobData.internalEmployees || false,
        referToEmployees: jobData.referToEmployees || false,
        salesPerson: jobData.jobFormId?.salesPerson || '',
        recruitingPerson: jobData.jobFormId?.recruitingPerson || '',
        assignedRecruiters: jobData.assignedRecruiters || []
      });

      setIsEditMode(true);
    } catch (error) {
      console.error("Error loading job data:", error);
      setErrorMessage("Failed to load job data");
    }
  };

  useEffect(() => {
    if (isEditMode && recruiters.length > 0 && formData.assignedRecruiters.length > 0) {
      console.log('Setting selected recruiters from form data');
      const assignedRecruiters = recruiters.filter(recruiter => 
        formData.assignedRecruiters.includes(recruiter._id)
      );
      console.log('Assigned recruiters filtered:', assignedRecruiters);
      setSelectedRecruiters(assignedRecruiters);
    }
  }, [recruiters, isEditMode, formData.assignedRecruiters]);

  const handleJobDescriptionSubmit = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    setCompletedSteps((prev) => [...new Set([...prev, 0])]);
    setStep(1);
  };

  const handleJobDetailsSubmit = (data, action) => {
    if (action === "back") {
      setStep(0);
    } else {
      setFormData(prev => ({
        ...prev,
        ...data
      }));
      setCompletedSteps((prev) => [...new Set([...prev, 1])]);
      setStep(2);
    }
  };

  const handlePublishBack = () => {
    setStep(1);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handlePublish = async (options) => {
    const finalData = {
      jobTitle: formData.jobTitle,
      department: formData.department,
      experience: formData.experience,
      jobDesc: formData.jobDesc,
      
      jobType: formData.jobType,
      locations: formData.locations,
      openings: formData.openings,
      targetHireDate: formData.targetHireDate,
      currency: formData.currency,
      amount: formData.amount,
      allowReapply: formData.allowReapply,
      reapplyDate: formData.reapplyDate,
      markPriority: formData.markPriority,
      hiringFlow: formData.hiringFlow,
      BusinessUnit: formData.BusinessUnit,
      Client: formData.Client,
      salesPerson: formData.salesPerson,
      recruitingPerson: formData.recruitingPerson,
      
      careerSite: options.careerSite,
      internalEmployees: options.internalEmployees,
      referToEmployees: options.referToEmployees,
      
      ...(currentUser?.role === 'admin' && {
        assignedRecruiters: selectedRecruiters.map(recruiter => recruiter._id)
      })
    };
    
    console.log("Final data being sent:", JSON.stringify(finalData, null, 2));
    
    try {
      setPublishLoading(true);
      if (isEditMode) {
        await updateJob(id, finalData);
        setSuccessMessage("Job Updated Successfully ✅");
      } else {
        await createJob(finalData);
        setSuccessMessage("Job Published Successfully ✅");
      }
      
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting job:", error);
      setErrorMessage(error.response?.data?.error || "Failed to publish job. Please try again.");
      setPublishLoading(false);
    }
  };

  // Get header height based on screen size
  const getHeaderHeight = () => {
    if (isMobile) return HEADER_HEIGHT.mobile;
    if (isTablet) return HEADER_HEIGHT.tablet;
    return HEADER_HEIGHT.desktop;
  };

  // Responsive padding and margin values with top margin to clear header
  const getResponsiveSpacing = () => {
    const headerHeight = getHeaderHeight();
    
    if (isMobile) return { 
      padding: 1.5, 
      ml: 0,
      mt: headerHeight,
      minHeight: `calc(100vh - ${headerHeight})`
    };
    if (isTablet) return { 
      padding: 2, 
      ml: 2,
      mt: headerHeight,
      minHeight: `calc(100vh - ${headerHeight})`
    };
    if (isLaptop) return { 
      padding: 2.5, 
      ml: 3,
      mt: headerHeight,
      minHeight: `calc(100vh - ${headerHeight})`
    };
    return { 
      padding: 3, 
      ml: 4,
      mt: headerHeight,
      minHeight: `calc(100vh - ${headerHeight})`
    }; // Desktop
  };

  const getResponsiveTypography = () => {
    if (isMobile) return { variant: "h5", fontSize: "1.5rem" };
    if (isTablet) return { variant: "h4", fontSize: "2rem" };
    return { variant: "h4", fontSize: "2.125rem" }; // Laptop/Desktop
  };

  const responsiveSpacing = getResponsiveSpacing();
  const responsiveTitle = getResponsiveTypography();

  if (loading) {
    return (
      <MainLayout>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          sx={{
            minHeight: `calc(100vh - ${getHeaderHeight()})`,
            mt: getHeaderHeight(),
            padding: responsiveSpacing.padding,
            flexDirection: isMobile ? "column" : "row"
          }}
        >
          <CircularProgress 
            size={isMobile ? 40 : 60} 
            thickness={4} 
          />
          <Typography 
            sx={{ 
              ml: isMobile ? 0 : 2, 
              mt: isMobile ? 2 : 0,
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            Loading...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box 
        sx={{ 
          padding: responsiveSpacing.padding,
          ml: "210px",
          mt: responsiveSpacing.mt,
          minHeight: responsiveSpacing.minHeight,
          width: '1200px',
          maxWidth: '100%',
          overflowX: 'hidden',
          
        }}
      >
        {/* Back Button */}
      <Box sx={{ mb: isMobile ? 1 : 2 }}>
  <Button
    startIcon={<ArrowBackIcon />}
    onClick={handleBack}
    sx={{
      // Text and icon color - blue
      color: '#1976d2',
      
      // Hover effect - blue text with light grey background
      '&:hover': {
        backgroundColor: '#f5f5f5',  // Light grey background on hover
        color: '#1565C0',  // Slightly darker blue on hover
      },
      
      // Responsive styles
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 500,
      textTransform: 'none',
      px: isMobile ? 1 : 2,
      py: isMobile ? 0.5 : 1,
      
      // Optional: smooth transition for hover effect
      transition: 'all 0.2s ease',
      
      // Remove default background
      backgroundColor: 'transparent',
    }}
  >
    Back  
  </Button>
</Box>

        <Typography 
          variant={responsiveTitle.variant}
          sx={{ 
            color: "#1976d2", 
            fontWeight: "bold",
            fontSize: responsiveTitle.fontSize,
            mb: isMobile ? 2 : 3,
            wordBreak: 'break-word',
            pt: isMobile ? 1 : 2 // Add some top padding inside the content
          }} 
          align="center"
        >
          {isEditMode ? "Update Job Posting" : "Create a New Job"}
        </Typography>

        <Box sx={{ 
          mb: isMobile ? 2 : 3,
          px: isMobile ? 0 : 1
        }}>
          <StepIndicator 
            activeStep={step} 
            completedSteps={completedSteps}
            isMobile={isMobile}
          />
        </Box>

        <Box sx={{
          maxWidth: isDesktop ? '1200px' : '100%',
          margin: '0 auto',
          px: isMobile ? 0 : isTablet ? 1 : 2
        }}>
          {step === 0 && (
            <JobDescriptionForm 
              onContinue={handleJobDescriptionSubmit} 
              initialData={{
                jobTitle: formData.jobTitle,
                department: formData.department,
                experience: formData.experience,
                jobDesc: formData.jobDesc
              }}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          )}

          {step === 1 && (
            <JobDetailsForm 
              onContinue={handleJobDetailsSubmit} 
              initialData={{
                BusinessUnit: formData.BusinessUnit,
                Client: formData.Client,
                jobType: formData.jobType,
                locations: formData.locations,
                openings: formData.openings,
                targetHireDate: formData.targetHireDate,
                currency: formData.currency,
                amount: formData.amount,
                allowReapply: formData.allowReapply,
                reapplyDate: formData.reapplyDate,
                markPriority: formData.markPriority,
                hiringFlow: formData.hiringFlow,
                salesPerson: formData.salesPerson,
                recruitingPerson: formData.recruitingPerson,
              }}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          )}

          {step === 2 && currentUser && (
            <PublishOptionsForm
              onBack={handlePublishBack}
              onPublish={handlePublish}
              initialOptions={{
                careerSite: formData.careerSite,
                internalEmployees: formData.internalEmployees,
                referToEmployees: formData.referToEmployees
              }}
              isEditMode={isEditMode}
              recruiters={recruiters}
              selectedRecruiters={selectedRecruiters}
              setSelectedRecruiters={setSelectedRecruiters}
              userRole={currentUser.role}
              loading={publishLoading}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          )}
        </Box>

        {/* Success Message Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ 
            vertical: isMobile ? 'bottom' : 'top', 
            horizontal: 'center' 
          }}
          sx={{
            bottom: isMobile ? 16 : 'auto',
            top: isMobile ? 'auto' : getHeaderHeight(),
            width: isMobile ? '90%' : 'auto',
            left: isMobile ? '5%' : 'auto',
            zIndex: 1400 // Ensure snackbar appears above content
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ 
              width: '100%',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Message Snackbar */}
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ 
            vertical: isMobile ? 'bottom' : 'top', 
            horizontal: 'center' 
          }}
          sx={{
            bottom: isMobile ? 16 : 'auto',
            top: isMobile ? 'auto' : getHeaderHeight(),
            width: isMobile ? '90%' : 'auto',
            left: isMobile ? '5%' : 'auto',
            zIndex: 1400 // Ensure snackbar appears above content
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="error" 
            sx={{ 
              width: '100%',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default JobCreationPage;