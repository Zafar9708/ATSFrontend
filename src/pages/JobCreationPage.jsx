
import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
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
  const { user: currentUser } = useUser(); 
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
  }, [id, currentUser]); // Add currentUser to dependencies

  const fetchRecruiters = async () => {
    try {
      const response = await adminService.getRecruiters();
      console.log('Recruiters response:', response);
      
      // Handle different response structures
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

      // Set selected recruiters if in edit mode
      if (jobData.assignedRecruiters && Array.isArray(jobData.assignedRecruiters)) {
        // This will be handled by the useEffect below after recruiters are loaded
        console.log('Job has assigned recruiters:', jobData.assignedRecruiters);
      }
      
      setIsEditMode(true);
    } catch (error) {
      console.error("Error loading job data:", error);
      setErrorMessage("Failed to load job data");
    }
  };

  // Update selected recruiters when recruiters data changes in edit mode
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
    // Create the final data object with proper structure
    const finalData = {
      // Job Description fields
      jobTitle: formData.jobTitle,
      department: formData.department,
      experience: formData.experience,
      jobDesc: formData.jobDesc,
      
      // Job Details fields
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
      
      // Publish Options
      careerSite: options.careerSite,
      internalEmployees: options.internalEmployees,
      referToEmployees: options.referToEmployees,
      
      // Recruiter assignment
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
      
      // Wait for 2 seconds before navigating to jobs page
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting job:", error);
      setErrorMessage(error.response?.data?.error || "Failed to publish job. Please try again.");
      setPublishLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ padding: 3, minHeight: "100vh", ml: 4 }}>
        <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold" }} align="center">
          {isEditMode ? "Update Job Posting" : "Create a New Job"}
        </Typography>

        <StepIndicator activeStep={step} completedSteps={completedSteps} />

        {step === 0 && (
          <JobDescriptionForm 
            onContinue={handleJobDescriptionSubmit} 
            initialData={{
              jobTitle: formData.jobTitle,
              department: formData.department,
              experience: formData.experience,
              jobDesc: formData.jobDesc
            }}
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
            userRole={currentUser.role} // Pass user role directly
            loading={publishLoading}
          />
        )}

        {/* Success Message Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Message Snackbar */}
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default JobCreationPage;