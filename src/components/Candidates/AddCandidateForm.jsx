
// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Button,
//   IconButton,
//   Typography,
//   Grid,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   LinearProgress,
//   Divider,
//   Stack,
//   Fade,
//   Backdrop,
//   DialogContentText,
//   TextField as MuiTextField,
// } from "@mui/material";
// import {
//   CloudUpload as CloudUploadIcon,
//   AttachFile as AttachFileIcon,
//   Analytics,
//   Add as AddIcon,
// } from "@mui/icons-material";
// import {
//   createCandidate,
//   getAllLocations,
//   addLocation,
//   getAllSources,
//   addSource,
//   getAllStages,
//   analyzeResume,
// } from "../../services/Candidates/addCandidateServices";
// import { useParams } from "react-router-dom";

// const AddCandidateForm = ({ onClose, onSubmit }) => {
//   const { id: jobId } = useParams();
//   const [locations, setLocations] = useState([]);
//   const [sources, setSources] = useState([]);
//   const [stages, setStages] = useState([]);
//   const [loadingStages, setLoadingStages] = useState(false);
//   const [loadingLocations, setLoadingLocations] = useState(false);
//   const [loadingSources, setLoadingSources] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [analysisData, setAnalysisData] = useState(null);
//   const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
//   const [emailWarning, setEmailWarning] = useState(false);
//   const [duplicateEmailError, setDuplicateEmailError] = useState(false);
//   const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
//   const [showAddSourceDialog, setShowAddSourceDialog] = useState(false);
//   const [newLocation, setNewLocation] = useState("");
//   const [newSource, setNewSource] = useState("");
//   const [resumeFile, setResumeFile] = useState(null);
//   const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     mobile: "",
//     stage: "",
//     source: "",
//     availableToJoin: "",
//     currentLocation: "",
//     preferredLocation: "",
//     gender: "",
//     dob: "",
//     skills: "",
//     experience: "",
//     education: "",
//     additionalDocuments: null,
//     resume: null,
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const docsInputRef = useRef(null);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoadingStages(true);
//         setLoadingLocations(true);
//         setLoadingSources(true);

//         const [stagesData, locationsData, sourcesData] = await Promise.all([
//           getAllStages(),
//           getAllLocations(),
//           getAllSources(),
//         ]);

//         setStages(stagesData);
//         setLocations(locationsData);
//         setSources(sourcesData);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: "Failed to load initial data",
//           severity: "error",
//         });
//       } finally {
//         setLoadingStages(false);
//         setLoadingLocations(false);
//         setLoadingSources(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === "email" && duplicateEmailError) {
//       setDuplicateEmailError(false);
//     }
//   };

//   const handleResumeUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   // Validate file type
//   const validTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ];
  
//   if (!validTypes.includes(file.type)) {
//     setSnackbar({
//       open: true,
//       message: "Invalid file type. Please upload PDF or Word documents",
//       severity: "error",
//     });
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     setSnackbar({
//       open: true,
//       message: "File size should be less than 5MB",
//       severity: "error",
//     });
//     return;
//   }

//   setIsAnalyzingResume(true);
//   setEmailWarning(false);
//   setDuplicateEmailError(false);
//   setResumeFile(file);

//   try {
//     const response = await analyzeResume(file, jobId);
    
//     if (!response.success) {
//       throw new Error(response.error || "Analysis failed");
//     }

//     // Set the entire response including the data structure
//     setAnalysisData(response.data);

//     // DEBUG: Log the full response to see the exact structure
//     console.log('Full API response structure:', response.data);
//     console.log('Extracted data:', response.data.extractedData);
//     console.log('Raw text data:', response.data.rawText);

//     // Auto-fill form fields from resume analysis
//     if (response.data) {
//       // Try different possible locations for the extracted data
//       const extractedData = response.data.extractedData || response.data;
      
//       // Extract personal information using multiple possible field names
//       const firstName = extractedData.firstName || extractedData.firstname || 
//                        extractedData.name?.split(' ')[0] || '';
//       const lastName = extractedData.lastName || extractedData.lastname || 
//                       extractedData.name?.split(' ').slice(1).join(' ') || '';
//       const email = extractedData.email || extractedData.contactEmail || '';
//       const phone = extractedData.mobile || extractedData.phone || 
//                    extractedData.contact || extractedData.telephone || '';
//       const skills = Array.isArray(extractedData.skills) ? 
//                     extractedData.skills.join(", ") : 
//                     extractedData.skills || '';
//       const experience = extractedData.experience || extractedData.workExperience || 
//                         extractedData.experienceSummary || '';
//       const education = extractedData.education || extractedData.educationalBackground || 
//                        extractedData.educationSummary || '';

//       console.log('Extracted fields:', {
//         firstName,
//         lastName,
//         email,
//         phone,
//         skills,
//         experience,
//         education
//       });

//       if (response.data && response.data.extractedData) {
//   const extractedData = response.data.extractedData;
  
//   console.log('Extracted data from backend:', extractedData);

//   setFormData((prev) => ({
//     ...prev,
//     firstName: extractedData.firstName || prev.firstName,
//     lastName: extractedData.lastName || prev.lastName,
//     email: extractedData.email || prev.email,
//     mobile: extractedData.phone || prev.mobile,
//     skills: Array.isArray(extractedData.skills) ? 
//             extractedData.skills.join(", ") : 
//             extractedData.skills || prev.skills,
//     experience: extractedData.experience || prev.experience,
//     education: extractedData.education || prev.education,
//     resume: file,
//   }));

//   // Check if email was found
//   if (!extractedData.email) {
//     setEmailWarning(true);
//     setSnackbar({
//       open: true,
//       message: "No email found in resume. Please add manually.",
//       severity: "warning",
//     });
//   } else {
//     setEmailWarning(false);
//   }
// }

//       // Check if email was found
//       if (!email) {
//         setEmailWarning(true);
//         setSnackbar({
//           open: true,
//           message: "No email found in resume. Please add manually.",
//           severity: "warning",
//         });
//       } else {
//         setEmailWarning(false);
//       }
//     }

//     // Show analysis dialog automatically if we have matching data
//     if (response.data.aiAnalysis?.matchPercentage !== undefined) {
//       setShowAnalysisDialog(true);
//     }

//     setSnackbar({
//       open: true,
//       message: "Resume analyzed successfully",
//       severity: "success",
//     });
//   } catch (error) {
//     console.error('Resume analysis error:', error);
    
//     let errorMessage = "Failed to analyze resume";
//     let severity = "error";
    
//     if (error.response) {
//       // Handle HTTP errors
//       if (error.response.status === 409) {
//         errorMessage = error.response.data.message || "This email already exists in our system";
//         setDuplicateEmailError(true);
//       } else if (error.response.data?.error) {
//         errorMessage = error.response.data.error;
//         if (error.response.data.details) {
//           console.log('Analysis error details:', error.response.data.details);
//         }
//       } else if (error.response.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//     } else if (error.message) {
//       // Handle custom errors
//       errorMessage = error.message;
//     }

//     setSnackbar({
//       open: true,
//       message: errorMessage,
//       severity,
//     });
//   } finally {
//     setIsAnalyzingResume(false);
//   }
// };

//   const handleDocsUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, additionalDocuments: file }));
//       setSnackbar({
//         open: true,
//         message: "Document attached successfully",
//         severity: "success",
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     if (emailWarning && !formData.email) {
//       setSnackbar({
//         open: true,
//         message: "Please enter candidate email address",
//         severity: "error",
//       });
//       return;
//     }

//     if (!resumeFile) {
//       setSnackbar({
//         open: true,
//         message: "Please upload a resume first",
//         severity: "error",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const formDataToSend = new FormData();

//       // Append all form fields
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           if (key === "resume") {
//             formDataToSend.append(key, resumeFile);
//           } else if (key === "additionalDocuments" && value) {
//             formDataToSend.append(key, value);
//           } else if (key !== "additionalDocuments") {
//             formDataToSend.append(key, value);
//           }
//         }
//       });

//       if (jobId) {
//         formDataToSend.append("jobId", jobId);
//       }

//       const response = await createCandidate(formDataToSend);

//       setSnackbar({
//         open: true,
//         message: "Candidate created successfully",
//         severity: "success",
//       });

//       // Call onSubmit with the created candidate data
//       if (onSubmit && response.data) {
//         onSubmit(response.data);
//       }

//       setTimeout(() => onClose(), 1500);
//     } catch (error) {
//       console.error('Candidate creation error:', error);
      
//       let errorMessage = "Failed to create candidate";
//       let severity = "error";
      
//       // Extract the actual error message from the backend
//       if (error.response) {
//         // Handle HTTP errors
//         if (error.response.data?.message) {
//           errorMessage = error.response.data.message;
//         } else if (error.response.data?.error) {
//           errorMessage = error.response.data.error;
//         } else if (error.response.status === 409) {
//           errorMessage = "This candidate already exists in the system";
//         }
//       } else if (error.message) {
//         // Handle custom errors from the service
//         errorMessage = error.message;
//       }

//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const handleShowAnalysis = () => {
//     setShowAnalysisDialog(true);
//   };

//   const handleCloseAnalysisDialog = () => {
//     setShowAnalysisDialog(false);
//   };

//   const handleAddLocation = async () => {
//     if (!newLocation.trim()) return;

//     try {
//       setIsLoading(true);
//       const response = await addLocation(newLocation);
//       setLocations((prev) => [...prev, response.data]);
//       setFormData((prev) => ({
//         ...prev,
//         currentLocation: response.data._id,
//         preferredLocation: response.data._id,
//       }));
//       setNewLocation("");
//       setShowAddLocationDialog(false);
//       setSnackbar({
//         open: true,
//         message: "Location added successfully",
//         severity: "success",
//       });
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to add location",
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddSource = async () => {
//     if (!newSource.trim()) return;

//     try {
//       setIsLoading(true);
//       const response = await addSource(newSource);
//       setSources((prev) => [...prev, response.data]);
//       setFormData((prev) => ({ ...prev, source: response.data._id }));
//       setNewSource("");
//       setShowAddSourceDialog(false);
//       setSnackbar({
//         open: true,
//         message: "Source added successfully",
//         severity: "success",
//       });
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to add source",
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: 600,
//         mx: "auto",
//         mt: 2,
//         p: 0,
//         position: "relative",
//       }}
//     >
//       {/* Loading Overlay */}
//       <Backdrop
//         sx={{
//           color: "#fff",
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           position: "absolute",
//           borderRadius: "12px",
//         }}
//         open={isLoading || isAnalyzingResume}
//       >
//         <Fade in={isLoading || isAnalyzingResume}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               backgroundColor: "rgba(255, 255, 255, 0.9)",
//               p: 4,
//               borderRadius: "12px",
//               boxShadow: 3,
//             }}
//           >
//             <CircularProgress
//               size={60}
//               thickness={4}
//               sx={{
//                 color: "#3f51b5",
//                 mb: 2,
//               }}
//             />
//             <Typography variant="h6" color="text.primary">
//               {isAnalyzingResume ? "Analyzing Resume..." : "Adding Candidate..."}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               Please wait while we process your request
//             </Typography>
//           </Box>
//         </Fade>
//       </Backdrop>

//       <Card sx={{ width: "100%", p: 0, m: 0 }}>
//         <CardContent sx={{ p: 3 }}>
        
          
//           {/* Resume Upload Section */}
//           <Box sx={{ textAlign: "center", mb: 3 }}>
//             <input
//               type="file"
//               ref={fileInputRef}
//               hidden
//               accept=".pdf,.doc,.docx"
//               onChange={handleResumeUpload}
//             />
//             <IconButton
//               color="primary"
//               onClick={() => fileInputRef.current.click()}
//               disabled={isLoading || isAnalyzingResume}
//             >
//               {isAnalyzingResume ? (
//                 <CircularProgress size={40} />
//               ) : (
//                 <CloudUploadIcon sx={{ fontSize: 40 }} />
//               )}
//             </IconButton>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               Upload Resume (PDF, DOC, DOCX)
//             </Typography>
//             {resumeFile && (
//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 {resumeFile.name}
//               </Typography>
//             )}
//           </Box>

//           {/* Candidate Information Header with Analysis Button */}
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <Typography variant="h6">Candidate Information</Typography>
//             {analysisData && (
//               <Button
//                 variant="outlined"
//                 startIcon={<Analytics />}
//                 onClick={handleShowAnalysis}
//                 size="small"
//               >
//                 View Analysis
//               </Button>
//             )}
//           </Stack>

//           {/* Form Fields */}
//           <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 sx={{
//                   height: 40,
//                   width: 265,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 size="small"
//                 required
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 sx={{
//                   height: 40,
//                   width: 265,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 size="small"
//                 required
//               />
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} sx={{ mt: 0 }}>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 sx={{
//                   height: 40,
//                   width: 265,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 size="small"
//                 required
//                 error={duplicateEmailError}
//                 helperText={
//                   duplicateEmailError
//                     ? "This email already exists in our system"
//                     : emailWarning
//                     ? "No email found in resume. Please add manually."
//                     : ""
//                 }
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Mobile"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 sx={{
//                   height: 40,
//                   width: 265,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 size="small"
//                 required
//               />
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} sx={{ mt: 0 }}>
//             <Grid item xs={6}>
//               <FormControl fullWidth margin="normal" size="small">
//                 <InputLabel id="stage">Stage</InputLabel>
//                 <Select
//                   labelId="stage"
//                   label="stage"
//                   name="stage"
//                   value={formData.stage}
//                   onChange={handleChange}
//                   sx={{
//                     height: 40,
//                     width: 265,
//                     "& .MuiSelect-select": {
//                       paddingTop: "12px",
//                       paddingBottom: "12px",
//                     },
//                   }}
//                   disabled={loadingStages}
//                   required
//                 >
//                   {loadingStages ? (
//                     <MenuItem value="">
//                       <CircularProgress size={24} />
//                     </MenuItem>
//                   ) : (
//                     stages.map((stage) => (
//                       <MenuItem key={stage._id} value={stage._id}>
//                         {stage.name}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={6}>
//               <FormControl fullWidth margin="normal" size="small">
//                 <InputLabel id="source">Source</InputLabel>
//                 <Select
//                   labelId="source"
//                   label="source"
//                   name="source"
//                   value={formData.source}
//                   onChange={handleChange}
//                   sx={{
//                     height: 40,
//                     width: 265,
//                     "& .MuiSelect-select": {
//                       paddingTop: "12px",
//                       paddingBottom: "12px",
//                     },
//                   }}
//                   required
//                 >
//                   {loadingSources ? (
//                     <MenuItem value="">
//                       <CircularProgress size={24} />
//                     </MenuItem>
//                   ) : (
//                     sources.map((source) => (
//                       <MenuItem key={source._id} value={source._id}>
//                         {source.name}
//                       </MenuItem>
//                     ))
//                   )}
//                   <Divider />
//                   <MenuItem
//                     onClick={() => setShowAddSourceDialog(true)}
//                     sx={{ color: "primary.main" }}
//                   >
//                     <AddIcon fontSize="small" sx={{ mr: 1 }} />
//                     Add New Source
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} sx={{ mt: 0 }}>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Available to Join (Days)"
//                 name="availableToJoin"
//                 type="number"
//                 value={formData.availableToJoin}
//                 onChange={handleChange}
//                 sx={{
//                   height: 40,
//                   width: 265,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 margin="normal"
//                 size="small"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <FormControl fullWidth margin="normal" size="small">
//                 <InputLabel id="location">Current Location</InputLabel>
//                 <Select
//                   labelId="location"
//                   label="Current Location"
//                   name="currentLocation"
//                   value={formData.currentLocation}
//                   onChange={handleChange}
//                   sx={{
//                     height: 40,
//                     width: 265,
//                     "& .MuiSelect-select": {
//                       paddingTop: "12px",
//                       paddingBottom: "12px",
//                     },
//                   }}
//                 >
//                   {loadingLocations ? (
//                     <MenuItem value="">
//                       <CircularProgress size={24} />
//                     </MenuItem>
//                   ) : (
//                     locations.map((location) => (
//                       <MenuItem key={location._id} value={location._id}>
//                         {location.name}
//                       </MenuItem>
//                     ))
//                   )}
//                   <Divider />
//                   <MenuItem
//                     onClick={() => setShowAddLocationDialog(true)}
//                     sx={{ color: "primary.main" }}
//                   >
//                     <AddIcon fontSize="small" sx={{ mr: 1 }} />
//                     Add New Location
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} sx={{ mt: 0 }}>
//             <Grid item xs={6}>
//               <FormControl fullWidth margin="normal" size="small">
//                 <InputLabel id="location">Preferred Location</InputLabel>
//                 <Select
//                   labelId="location"
//                   label="Preferred Location"
//                   name="preferredLocation"
//                   value={formData.preferredLocation}
//                   onChange={handleChange}
//                   sx={{
//                     height: 40,
//                     width: 265,
//                     "& .MuiSelect-select": {
//                       paddingTop: "12px",
//                       paddingBottom: "12px",
//                     },
//                   }}
//                 >
//                   {loadingLocations ? (
//                     <MenuItem value="">
//                       <CircularProgress size={24} />
//                     </MenuItem>
//                   ) : (
//                     locations.map((location) => (
//                       <MenuItem key={location._id} value={location._id}>
//                         {location.name}
//                       </MenuItem>
//                     ))
//                   )}
//                   <Divider />
//                   <MenuItem
//                     onClick={() => setShowAddLocationDialog(true)}
//                     sx={{ color: "primary.main" }}
//                   >
//                     <AddIcon fontSize="small" sx={{ mr: 1 }} />
//                     Add New Location
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={6}>
//               <FormControl fullWidth margin="normal" size="small">
//                 <InputLabel id="Gender">Gender</InputLabel>
//                 <Select
//                   labelId="Gender"
//                   label="Gender"
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   sx={{
//                     height: 40,
//                     width: 265,
//                     "& .MuiSelect-select": {
//                       paddingTop: "12px",
//                       paddingBottom: "12px",
//                     },
//                   }}
//                 >
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                   <MenuItem value="Other">Other</MenuItem>
//                   <MenuItem value="Prefer not to say">
//                     Prefer not to say
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} sx={{ mt: 0 }}>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Date of Birth"
//                 name="dob"
//                 type="date"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 sx={{
//                   height: 40,
//                   width: 265,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 InputLabelProps={{ shrink: true }}
//                 margin="normal"
//                 size="small"
//               />
//             </Grid>
//           </Grid>

//           <TextField
//             fullWidth
//             label="Skills"
//             name="skills"
//             value={formData.skills}
//             onChange={handleChange}
//             margin="normal"
//             size="small"
//             helperText="Separate multiple skills with commas"
//           />

//           <Grid container spacing={2} sx={{ mt: 0 }}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Experience"
//                 name="experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 sx={{
//                   height: 1,
//                   width: 268,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 multiline
//                 rows={3}
//                 margin="normal"
//                 size="small"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Education"
//                 name="education"
//                 value={formData.education}
//                 onChange={handleChange}
//                 sx={{
//                   height: 1,
//                   width: 268,
//                   "& .MuiSelect-select": {
//                     paddingTop: "12px",
//                     paddingBottom: "12px",
//                   },
//                 }}
//                 multiline
//                 rows={3}
//                 margin="normal"
//                 size="small"
//               />
//             </Grid>
//           </Grid>

//           <Grid item xs={12}>
//             <input
//               type="file"
//               ref={docsInputRef}
//               hidden
//               accept=".pdf,.doc,.docx,.jpg,.png"
//               onChange={handleDocsUpload}
//               multiple
//             />
//             <Button
//               variant="outlined"
//               startIcon={<AttachFileIcon />}
//               onClick={() => docsInputRef.current.click()}
//               fullWidth
//               size="large"
//               sx={{
//                 py: 1.5,
//                 mt: 2,
//                 borderWidth: 2,
//                 "&:hover": { borderWidth: 2 },
//               }}
//             >
//               Attach Additional Documents
//             </Button>
//             {formData.additionalDocuments && (
//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 {formData.additionalDocuments.name}
//               </Typography>
//             )}
//           </Grid>

//           <Box
//             sx={{
//               mt: 4,
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: 2,
//             }}
//           >
//             <Button
//               onClick={onClose}
//               variant="outlined"
//               color="secondary"
//               size="small"
//               disabled={isLoading || isAnalyzingResume}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               variant="contained"
//               color="primary"
//               size="small"
//               disabled={
//                 isLoading ||
//                 isAnalyzingResume ||
//                 !resumeFile ||
//                 (emailWarning && !formData.email)
//               }
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Add Candidate"}
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* Resume Analysis Dialog */}
    
// <Dialog
//   open={showAnalysisDialog}
//   onClose={handleCloseAnalysisDialog}
//   maxWidth="md"
//   fullWidth
// >
//   <DialogTitle>Resume Analysis</DialogTitle>
//   <DialogContent dividers>
//     {analysisData?.aiAnalysis && (
//       <Box>
//         <Typography variant="h6" gutterBottom>
//           Matching Score: {analysisData.aiAnalysis.matchPercentage || 0}%
//         </Typography>

//         {analysisData.aiAnalysis.recommendation && (
//           <>
//             <Typography variant="subtitle1" gutterBottom>
//               Recommendation: {analysisData.aiAnalysis.recommendation}
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//           </>
//         )}

//         <Typography variant="subtitle1" gutterBottom>
//           Matching Skills:
//         </Typography>
//         {analysisData.aiAnalysis.matchingSkills?.length > 0 ? (
//           <Box sx={{ mb: 3 }}>
//             {analysisData.aiAnalysis.matchingSkills.map((skill, index) => (
//               <Box key={index} sx={{ mb: 1 }}>
//                 <Typography variant="body2">
//                   {skill.skill} ({Math.round(skill.confidence * 100)}% match)
//                 </Typography>
//                 <LinearProgress
//                   variant="determinate"
//                   value={skill.confidence * 100}
//                   sx={{ height: 8, borderRadius: 4 }}
//                 />
//               </Box>
//             ))}
//           </Box>
//         ) : (
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{ mb: 3 }}
//           >
//             No matching skills identified
//           </Typography>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle1" gutterBottom>
//           Missing Skills:
//         </Typography>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
//           {analysisData.aiAnalysis.missingSkills?.map((skill, index) => (
//             <Chip
//               key={index}
//               label={skill}
//               color="error"
//               variant="outlined"
//               sx={{ mb: 1 }}
//             />
//           ))}
//         </Box>

//         {analysisData.aiAnalysis.experienceMatch && (
//           <>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="subtitle1" gutterBottom>
//               Experience Match:
//             </Typography>
//             <Typography variant="body2" paragraph>
//               {analysisData.aiAnalysis.experienceMatch}
//             </Typography>
//           </>
//         )}

//         {analysisData.aiAnalysis.educationMatch && (
//           <>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="subtitle1" gutterBottom>
//               Education Match:
//             </Typography>
//             <Typography variant="body2" paragraph>
//               {analysisData.aiAnalysis.educationMatch}
//             </Typography>
//           </>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle1" gutterBottom>
//           Analysis Summary:
//         </Typography>
//         <Typography
//           variant="body2"
//           paragraph
//           sx={{ whiteSpace: "pre-line" }}
//         >
//           {analysisData.aiAnalysis.analysis || "No analysis available"}
//         </Typography>
//       </Box>
//     )}
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleCloseAnalysisDialog}>Close</Button>
//   </DialogActions>
// </Dialog>

//       {/* Add Location Dialog */}
//       <Dialog
//         open={showAddLocationDialog}
//         onClose={() => setShowAddLocationDialog(false)}
//       >
//         <DialogTitle>Add New Location</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Add a new location that's not in the list
//           </DialogContentText>
//           <MuiTextField
//             autoFocus
//             margin="dense"
//             label="Location Name"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={newLocation}
//             onChange={(e) => setNewLocation(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowAddLocationDialog(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleAddLocation} disabled={!newLocation.trim()}>
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Source Dialog */}
//       <Dialog
//         open={showAddSourceDialog}
//         onClose={() => setShowAddSourceDialog(false)}
//       >
//         <DialogTitle>Add New Source</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Add a new source that's not in the list
//           </DialogContentText>
//           <MuiTextField
//             autoFocus
//             margin="dense"
//             label="Source Name"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={newSource}
//             onChange={(e) => setNewSource(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowAddSourceDialog(false)}>Cancel</Button>
//           <Button onClick={handleAddSource} disabled={!newSource.trim()}>
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AddCandidateForm;


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Divider,
  Stack,
  Fade,
  Backdrop,
  DialogContentText,
  TextField as MuiTextField,
  InputAdornment,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Analytics,
  Add as AddIcon,
  Close,
} from "@mui/icons-material";
import {
  createCandidate,
  getAllLocations,
  addLocation,
  getAllSources,
  addSource,
  getAllStages,
  analyzeResume,
} from "../../services/Candidates/addCandidateServices";
import { useParams } from "react-router-dom";

const AddCandidateForm = ({ onClose, onSubmit }) => {
  const { id: jobId } = useParams();
  const [locations, setLocations] = useState([]);
  const [sources, setSources] = useState([]);
  const [stages, setStages] = useState([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [analysisData, setAnalysisData] = useState(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showAddSourceDialog, setShowAddSourceDialog] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newSource, setNewSource] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  
  // Vendor sharing state
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorEmailError, setVendorEmailError] = useState("");
  const [isSharingJob, setIsSharingJob] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    stage: "",
    source: "",
    availableToJoin: "",
    currentLocation: "",
    preferredLocation: "",
    gender: "",
    currentCTC: "",
    expectedCTC: "",
    currency: "INR",
    skills: "",
    experience: "",
    education: "",
    additionalDocuments: null,
    resume: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const docsInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingStages(true);
        setLoadingLocations(true);
        setLoadingSources(true);

        const [stagesData, locationsData, sourcesData] = await Promise.all([
          getAllStages(),
          getAllLocations(),
          getAllSources(),
        ]);

        setStages(stagesData);
        setLocations(locationsData);
        setSources(sourcesData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load initial data",
          severity: "error",
        });
      } finally {
        setLoadingStages(false);
        setLoadingLocations(false);
        setLoadingSources(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && duplicateEmailError) {
      setDuplicateEmailError(false);
    }
  };

  const handleCurrencyChange = (e) => {
    setFormData((prev) => ({ ...prev, currency: e.target.value }));
  };

  const handleVendorClick = () => {
    setVendorDialogOpen(true);
  };

  const handleCloseVendorDialog = () => {
    setVendorDialogOpen(false);
    setVendorEmail("");
    setVendorEmailError("");
  };

  const handleVendorEmailChange = (e) => {
    setVendorEmail(e.target.value);
    if (e.target.value && !/\S+@\S+\.\S+/.test(e.target.value)) {
      setVendorEmailError("Please enter a valid email address");
    } else {
      setVendorEmailError("");
    }
  };

  const handleShareJob = async () => {
    if (!vendorEmail) {
      setVendorEmailError("Email is required");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(vendorEmail)) {
      setVendorEmailError("Please enter a valid email address");
      return;
    }
    
    setIsSharingJob(true);
    
    try {
      const response = await axios.post('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/share-with-vendor', {
        vendorEmail,
        jobId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setVendorEmail("");
        setVendorEmailError("");
        setVendorDialogOpen(false);
        
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "success",
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to share job with vendor",
        severity: "error",
      });
    } finally {
      setIsSharingJob(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Invalid file type. Please upload PDF or Word documents",
        severity: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "File size should be less than 5MB",
        severity: "error",
      });
      return;
    }

    setIsAnalyzingResume(true);
    setEmailWarning(false);
    setDuplicateEmailError(false);
    setResumeFile(file);

    try {
      const response = await analyzeResume(file, jobId);
      
      if (!response.success) {
        throw new Error(response.error || "Analysis failed");
      }

      setAnalysisData(response.data);

      if (response.data && response.data.extractedData) {
        const extractedData = response.data.extractedData;
        
        setFormData((prev) => ({
          ...prev,
          firstName: extractedData.firstName || prev.firstName,
          lastName: extractedData.lastName || prev.lastName,
          email: extractedData.email || prev.email,
          mobile: extractedData.phone || prev.mobile,
          skills: Array.isArray(extractedData.skills) ? 
                  extractedData.skills.join(", ") : 
                  extractedData.skills || prev.skills,
          experience: extractedData.experience || prev.experience,
          education: extractedData.education || prev.education,
          resume: file,
        }));

        if (!extractedData.email) {
          setEmailWarning(true);
          setSnackbar({
            open: true,
            message: "No email found in resume. Please add manually.",
            severity: "warning",
          });
        } else {
          setEmailWarning(false);
        }
      }

      if (response.data.aiAnalysis?.matchPercentage !== undefined) {
        setShowAnalysisDialog(true);
      }

      setSnackbar({
        open: true,
        message: "Resume analyzed successfully",
        severity: "success",
      });
    } catch (error) {
      console.error('Resume analysis error:', error);
      
      let errorMessage = "Failed to analyze resume";
      let severity = "error";
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = error.response.data.message || "This email already exists in our system";
          setDuplicateEmailError(true);
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity,
      });
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleDocsUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, additionalDocuments: file }));
      setSnackbar({
        open: true,
        message: "Document attached successfully",
        severity: "success",
      });
    }
  };

  const handleSubmit = async () => {
    if (emailWarning && !formData.email) {
      setSnackbar({
        open: true,
        message: "Please enter candidate email address",
        severity: "error",
      });
      return;
    }

    if (!resumeFile) {
      setSnackbar({
        open: true,
        message: "Please upload a resume first",
        severity: "error",
      });
      return;
    }

    if (formData.currentCTC && (isNaN(formData.currentCTC) || formData.currentCTC < 0)) {
      setSnackbar({
        open: true,
        message: "Current CTC must be a valid positive number",
        severity: "error",
      });
      return;
    }

    if (formData.expectedCTC && (isNaN(formData.expectedCTC) || formData.expectedCTC < 0)) {
      setSnackbar({
        open: true,
        message: "Expected CTC must be a valid positive number",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "resume") {
            formDataToSend.append(key, resumeFile);
          } else if (key === "additionalDocuments" && value) {
            formDataToSend.append(key, value);
          } else if (key !== "additionalDocuments") {
            formDataToSend.append(key, value);
          }
        }
      });

      if (jobId) {
        formDataToSend.append("jobId", jobId);
      }

      const response = await createCandidate(formDataToSend);

      setSnackbar({
        open: true,
        message: "Candidate created successfully",
        severity: "success",
      });

      if (onSubmit && response.data) {
        onSubmit(response.data);
      }

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Candidate creation error:', error);
      
      let errorMessage = "Failed to create candidate";
      let severity = "error";
      
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.status === 409) {
          errorMessage = "This candidate already exists in the system";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleShowAnalysis = () => {
    setShowAnalysisDialog(true);
  };

  const handleCloseAnalysisDialog = () => {
    setShowAnalysisDialog(false);
  };

  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;

    try {
      setIsLoading(true);
      const response = await addLocation(newLocation);
      setLocations((prev) => [...prev, response.data]);
      setFormData((prev) => ({
        ...prev,
        currentLocation: response.data._id,
        preferredLocation: response.data._id,
      }));
      setNewLocation("");
      setShowAddLocationDialog(false);
      setSnackbar({
        open: true,
        message: "Location added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add location",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSource.trim()) return;

    try {
      setIsLoading(true);
      const response = await addSource(newSource);
      setSources((prev) => [...prev, response.data]);
      setFormData((prev) => ({ ...prev, source: response.data._id }));
      setNewSource("");
      setShowAddSourceDialog(false);
      setSnackbar({
        open: true,
        message: "Source added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add source",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mt: 2,
        p: 0,
        position: "relative",
      }}
    >
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: "absolute",
          borderRadius: "12px",
        }}
        open={isLoading || isAnalyzingResume}
      >
        <Fade in={isLoading || isAnalyzingResume}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              p: 4,
              borderRadius: "12px",
              boxShadow: 3,
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: "#3f51b5",
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.primary">
              {isAnalyzingResume ? "Analyzing Resume..." : "Adding Candidate..."}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we process your request
            </Typography>
          </Box>
        </Fade>
      </Backdrop>

      <Card sx={{ width: "100%", p: 0, m: 0 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleVendorClick}>
              Vendors
            </Button>
          </Box>
      
          <Dialog 
            open={vendorDialogOpen} 
            onClose={handleCloseVendorDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Share Job with Vendors
              <IconButton
                aria-label="close"
                onClick={handleCloseVendorDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Do you want to share this job with vendors?
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="vendor-email"
                label="Vendor Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={vendorEmail}
                onChange={handleVendorEmailChange}
                error={!!vendorEmailError}
                helperText={vendorEmailError}
                disabled={isSharingJob}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVendorDialog} disabled={isSharingJob}>
                Cancel
              </Button>
              <Button 
                onClick={handleShareJob} 
                variant="contained"
                disabled={!vendorEmail || !!vendorEmailError || isSharingJob}
              >
                {isSharingJob ? <CircularProgress size={24} /> : "Share Job"}
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
            />
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading || isAnalyzingResume}
            >
              {isAnalyzingResume ? (
                <CircularProgress size={40} />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 40 }} />
              )}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Upload Resume (PDF, DOC, DOCX)
            </Typography>
            {resumeFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {resumeFile.name}
              </Typography>
            )}
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Candidate Information</Typography>
            {analysisData && (
              <Button
                variant="outlined"
                startIcon={<Analytics />}
                onClick={handleShowAnalysis}
                size="small"
              >
                View Analysis
              </Button>
            )}
          </Stack>

          <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                }}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                }}
                size="small"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                }}
                size="small"
                required
                error={duplicateEmailError}
                helperText={
                  duplicateEmailError
                    ? "This email already exists in our system"
                    : emailWarning
                    ? "No email found in resume. Please add manually."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                }}
                size="small"
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Current CTC"
                name="CurrentCTC"
                value={formData.currentCTC}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                }}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expected CTC"
                name="ExpectedCTC"
                value={formData.expectedCTC}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                }}
                size="small"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="stage">Stage</InputLabel>
                <Select
                  labelId="stage"
                  label="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  sx={{
                    height: 40,
                    width: 265,
                  }}
                  disabled={loadingStages}
                  required
                >
                  {loadingStages ? (
                    <MenuItem value="">
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    stages.map((stage) => (
                      <MenuItem key={stage._id} value={stage._id}>
                        {stage.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="source">Source</InputLabel>
                <Select
                  labelId="source"
                  label="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  sx={{
                    height: 40,
                    width: 265,
                    "& .MuiSelect-select": {
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    },
                  }}
                  required
                >
                  {loadingSources ? (
                    <MenuItem value="">
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    sources.map((source) => (
                      <MenuItem key={source._id} value={source._id}>
                        {source.name}
                      </MenuItem>
                    ))
                  )}
                  <Divider />
                  <MenuItem
                    onClick={() => setShowAddSourceDialog(true)}
                    sx={{ color: "primary.main" }}
                  >
                    <AddIcon fontSize="small" sx={{ mr: 1 }} />
                    Add New Source
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Available to Join (Days)"
                name="availableToJoin"
                type="number"
                value={formData.availableToJoin}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                  "& .MuiSelect-select": {
                    paddingTop: "12px",
                    paddingBottom: "12px",
                  },
                }}
                margin="normal"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="location">Current Location</InputLabel>
                <Select
                  labelId="location"
                  label="Current Location"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  sx={{
                    height: 40,
                    width: 265,
                    "& .MuiSelect-select": {
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    },
                  }}
                >
                  {loadingLocations ? (
                    <MenuItem value="">
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    locations.map((location) => (
                      <MenuItem key={location._id} value={location._id}>
                        {location.name}
                      </MenuItem>
                    ))
                  )}
                  <Divider />
                  <MenuItem
                    onClick={() => setShowAddLocationDialog(true)}
                    sx={{ color: "primary.main" }}
                  >
                    <AddIcon fontSize="small" sx={{ mr: 1 }} />
                    Add New Location
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="location">Preferred Location</InputLabel>
                <Select
                  labelId="location"
                  label="Preferred Location"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  sx={{
                    height: 40,
                    width: 265,
                    "& .MuiSelect-select": {
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    },
                  }}
                >
                  {loadingLocations ? (
                    <MenuItem value="">
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    locations.map((location) => (
                      <MenuItem key={location._id} value={location._id}>
                        {location.name}
                      </MenuItem>
                    ))
                  )}
                  <Divider />
                  <MenuItem
                    onClick={() => setShowAddLocationDialog(true)}
                    sx={{ color: "primary.main" }}
                  >
                    <AddIcon fontSize="small" sx={{ mr: 1 }} />
                    Add New Location
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="Gender">Gender</InputLabel>
                <Select
                  labelId="Gender"
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{
                    height: 40,
                    width: 265,
                    "& .MuiSelect-select": {
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    },
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Prefer not to say">
                    Prefer not to say
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: 265,
                  "& .MuiSelect-select": {
                    paddingTop: "12px",
                    paddingBottom: "12px",
                  },
                }}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                size="small"
              />
            </Grid>
          </Grid> */}

          <TextField
            fullWidth
            label="Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            margin="normal"
            size="small"
            helperText="Separate multiple skills with commas"
          />

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <TextField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                sx={{
                  height: 1,
                  width: 268,
                  "& .MuiSelect-select": {
                    paddingTop: "12px",
                    paddingBottom: "12px",
                  },
                }}
                multiline
                rows={3}
                margin="normal"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                sx={{
                  height: 1,
                  width: 268,
                  "& .MuiSelect-select": {
                    paddingTop: "12px",
                    paddingBottom: "12px",
                  },
                }}
                multiline
                rows={3}
                margin="normal"
                size="small"
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              ref={docsInputRef}
              hidden
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleDocsUpload}
              multiple
            />
            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={() => docsInputRef.current.click()}
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                mt: 2,
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Attach Additional Documents
            </Button>
            {formData.additionalDocuments && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {formData.additionalDocuments.name}
              </Typography>
            )}
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              color="secondary"
              size="small"
              disabled={isLoading || isAnalyzingResume}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="small"
              disabled={
                isLoading ||
                isAnalyzingResume ||
                !resumeFile ||
                (emailWarning && !formData.email)
              }
            >
              {isLoading ? <CircularProgress size={24} /> : "Add Candidate"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Resume Analysis Dialog */}
      <Dialog
        open={showAnalysisDialog}
        onClose={handleCloseAnalysisDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Resume Analysis</DialogTitle>
        <DialogContent dividers>
          {analysisData?.aiAnalysis && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Matching Score: {analysisData.aiAnalysis.matchPercentage || 0}%
              </Typography>

              {analysisData.aiAnalysis.recommendation && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendation: {analysisData.aiAnalysis.recommendation}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              <Typography variant="subtitle1" gutterBottom>
                Matching Skills:
              </Typography>
              {analysisData.aiAnalysis.matchingSkills?.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  {analysisData.aiAnalysis.matchingSkills.map((skill, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {skill.skill} ({Math.round(skill.confidence * 100)}% match)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={skill.confidence * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  No matching skills identified
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Missing Skills:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {analysisData.aiAnalysis.missingSkills?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="error"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>

              {analysisData.aiAnalysis.experienceMatch && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Experience Match:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {analysisData.aiAnalysis.experienceMatch}
                  </Typography>
                </>
              )}

              {analysisData.aiAnalysis.educationMatch && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Education Match:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {analysisData.aiAnalysis.educationMatch}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Analysis Summary:
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ whiteSpace: "pre-line" }}
              >
                {analysisData.aiAnalysis.analysis || "No analysis available"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAnalysisDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Location Dialog */}
      <Dialog
        open={showAddLocationDialog}
        onClose={() => setShowAddLocationDialog(false)}
      >
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new location that's not in the list
          </DialogContentText>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Location Name"
            type="text"
            fullWidth
            variant="standard"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddLocationDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddLocation} disabled={!newLocation.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Source Dialog */}
      <Dialog
        open={showAddSourceDialog}
        onClose={() => setShowAddSourceDialog(false)}
      >
        <DialogTitle>Add New Source</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new source that's not in the list
          </DialogContentText>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Source Name"
            type="text"
            fullWidth
            variant="standard"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSourceDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSource} disabled={!newSource.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddCandidateForm;
