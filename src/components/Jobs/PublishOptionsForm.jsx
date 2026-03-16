

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Switch,
//   FormControlLabel,
//   Button,
//   Avatar,
//   CircularProgress,
//   Autocomplete,
//   TextField,
//   Alert,
//   Chip
// } from "@mui/material";

// const jobBoards = [
//   {
//     name: "Naukri",
//     logo: "/logos/naukri.png",
//     url: "https://www.naukri.com/",
//   },
//   {
//     name: "Glassdoor",
//     logo: "/logos/glassdoor.png",
//     url: "https://www.glassdoor.com/",
//   },
//   {
//     name: "Foundit",
//     logo: "/logos/foundit.jpg",
//     url: "https://www.foundit.in/",
//   },
// ];

// const PublishOptionsForm = ({ 
//   onBack, 
//   onPublish, 
//   initialOptions, 
//   isEditMode, 
//   recruiters, 
//   selectedRecruiters, 
//   setSelectedRecruiters,
//   isAdmin,
//   loading: parentLoading
// }) => {
//   const [publishOptions, setPublishOptions] = useState({
//     careerSite: initialOptions.careerSite || false,
//     internalEmployees: initialOptions.internalEmployees || false,
//     referToEmployees: initialOptions.referToEmployees || false
//   });
//   const [loading, setLoading] = useState(false);

//   const handlePublish = async () => {
//     setLoading(true);
//     try {
//       await onPublish(publishOptions);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isLoading = loading || parentLoading;

//   return (
//     <Box sx={{ 
//       maxWidth: 600, 
//       mx: "auto", 
//       mt: 5,
//       p: 3,
//       position: "relative",
//       overflow: "hidden",
//       minHeight: "500px",
//       display: "flex",
//       flexDirection: "column"
//     }}>
//       {isLoading && (
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10,
//             flexDirection: "column",
//             gap: 2
//           }}
//         >
//           <CircularProgress size={60} />
//           <Typography variant="h6" color="primary">
//             {isEditMode ? "Updating Job..." : "Publishing Job..."}
//           </Typography>
//         </Box>
//       )}

//       <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
//         {isEditMode ? "Update Options" : "Step 3: Publish Options"}
//       </Typography>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
//         {isAdmin ? (
//           <>
//             <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500, color: 'primary.main' }}>
//               Assign to Recruiters
//             </Typography>
            
//             {recruiters.length > 0 ? (
//               <Autocomplete
//                 multiple
//                 options={recruiters}
//                 value={selectedRecruiters}
//                 onChange={(event, newValue) => {
//                   setSelectedRecruiters(newValue);
//                 }}
//                 getOptionLabel={(option) => option.username || option.email || option.name || ''}
//                 isOptionEqualToValue={(option, value) => option._id === value._id}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Recruiters"
//                     placeholder="Choose recruiters to assign this job"
//                   />
//                 )}
//                 renderTags={(value, getTagProps) =>
//                   value.map((option, index) => (
//                     <Chip
//                       label={option.username || option.email || option.name}
//                       {...getTagProps({ index })}
//                       key={option._id || index}
//                       sx={{ margin: 0.5 }}
//                     />
//                   ))
//                 }
//               />
//             ) : (
//               <Typography variant="body2" color="text.secondary">
//                 No recruiters available. Please add recruiters first.
//               </Typography>
//             )}
//             <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//               Select one or more recruiters to assign this job. They will receive email notifications.
//             </Typography>
//           </>
//         ) : (
//           <Alert severity="info" sx={{ mt: 2 }}>
//             <Typography variant="body2">
//               This job will be automatically assigned to you. You will be responsible for managing applications.
//             </Typography>
//           </Alert>
//         )}

//         <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 500, color: 'primary.main' }}>
//           Publishing Options
//         </Typography>

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.careerSite}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, careerSite: e.target.checked })
//               }
//               disabled={isLoading}
//             />
//           }
//           label="Publish this job on career site"
//         />

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.internalEmployees}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, internalEmployees: e.target.checked })
//               }
//               disabled={isLoading}
//             />
//           }
//           label="Post this job for internal employees"
//         />

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.referToEmployees}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, referToEmployees: e.target.checked })
//               }
//               disabled={isLoading}
//             />
//           }
//           label="Refer this job to employees"
//         />

//         <Box sx={{ mt: 4, textAlign: "center" }}>
//           <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
//             Share this job on:
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
//             {jobBoards.map((board) => (
//               <a
//                 key={board.name}
//                 href={board.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ display: "inline-block", transition: "transform 0.2s" }}
//                 onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//               >
//                 <Avatar
//                   alt={board.name}
//                   src={board.logo}
//                   sx={{ width: 64, height: 64, border: '1px solid #ddd' }}
//                 />
//               </a>
//             ))}
//           </Box>
//         </Box>

//         <Box sx={{ mt: "auto", pt: 3, display: "flex", justifyContent: "space-between" }}>
//           <Button variant="outlined" onClick={onBack} disabled={isLoading}>
//             Back
//           </Button>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={handlePublish}
//             disabled={isLoading || (isAdmin && selectedRecruiters.length === 0 && !isEditMode)}
//             sx={{ minWidth: 120, fontWeight: 600 }}
//           >
//             {isEditMode ? "Update Changes" : "Publish"}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );  
// }; 

// export default PublishOptionsForm;


//----------

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Switch,
//   FormControlLabel,
//   Button,
//   Avatar,
//   CircularProgress,
//   Autocomplete,
//   TextField,
//   Alert,
//   Chip
// } from "@mui/material";

// const jobBoards = [
//   {
//     name: "Naukri",
//     logo: "/logos/naukri.png",
//     url: "https://www.naukri.com/",
//   },
//   {
//     name: "Glassdoor",
//     logo: "/logos/glassdoor.png",
//     url: "https://www.glassdoor.com/",
//   },
//   {
//     name: "Foundit",
//     logo: "/logos/foundit.jpg",
//     url: "https://www.foundit.in/",
//   },
// ];

// const PublishOptionsForm = ({ 
//   onBack, 
//   onPublish, 
//   initialOptions, 
//   isEditMode, 
//   recruiters, 
//   selectedRecruiters, 
//   setSelectedRecruiters,
//   userRole, 
//   loading
// }) => {
//   const [publishOptions, setPublishOptions] = useState({
//     careerSite: initialOptions.careerSite || false,
//     internalEmployees: initialOptions.internalEmployees || false,
//     referToEmployees: initialOptions.referToEmployees || false
//   });

//   const isAdmin = userRole === 'admin'; 

//   console.log('PublishOptionsForm - userRole:', userRole);
//   console.log('PublishOptionsForm - isAdmin:', isAdmin);
//   console.log('PublishOptionsForm - recruiters:', recruiters);
//   console.log('PublishOptionsForm - selectedRecruiters:', selectedRecruiters);

//   const handlePublish = async () => {
//     await onPublish(publishOptions);
//   };

//   return (
//     <Box sx={{ 
//       maxWidth: 600, 
//       mx: "auto", 
//       mt: 5,
//       p: 3,
//       position: "relative",
//       overflow: "hidden",
//       minHeight: "500px",
//       display: "flex",
//       flexDirection: "column"
//     }}>
//       {loading && (
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10,
//             flexDirection: "column",
//             gap: 2
//           }}
//         >
//           <CircularProgress size={60} />
//           <Typography variant="h6" color="primary">
//             {isEditMode ? "Updating Job..." : "Publishing Job..."}
//           </Typography>
//           <Typography variant="body2">
//             You will be redirected to jobs page in a moment
//           </Typography>
//         </Box>
//       )}

//       <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
//         {isEditMode ? "Update Options" : "Step 3: Publish Options"}
//       </Typography>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
//         {isAdmin ? ( // This should now work correctly
//           <>
//             <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500, color: 'primary.main' }}>
//               Assign to Recruiters
//             </Typography>
            
//             {recruiters && recruiters.length > 0 ? (
//               <Autocomplete
//                 multiple
//                 options={recruiters}
//                 value={selectedRecruiters || []}
//                 onChange={(event, newValue) => {
//                   console.log('Selected recruiters changed:', newValue);
//                   setSelectedRecruiters(newValue);
//                 }}
//                 getOptionLabel={(option) => {
//                   const label = option.username || option.email || option.name || 'Unknown Recruiter';
//                   console.log('Option label:', label, 'for option:', option);
//                   return label;
//                 }}
//                 isOptionEqualToValue={(option, value) => {
//                   const isEqual = option._id === value._id;
//                   console.log('Comparing:', option, value, 'isEqual:', isEqual);
//                   return isEqual;
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Recruiters"
//                     placeholder="Choose recruiters to assign this job"
//                   />
//                 )}
//                 renderTags={(value, getTagProps) =>
//                   value.map((option, index) => (
//                     <Chip
//                       label={option.username || option.email || option.name}
//                       {...getTagProps({ index })}
//                       key={option._id || index}
//                       sx={{ margin: 0.5 }}
//                     />
//                   ))
//                 }
//               />
//             ) : (
//               <Typography variant="body2" color="text.secondary">
//                 No recruiters available. Please add recruiters first.
//               </Typography>
//             )}
//             <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//               Select one or more recruiters to assign this job. They will receive email notifications.
//             </Typography>
//           </>
//         ) : (
//           <Alert severity="info" sx={{ mt: 2 }}>
//             <Typography variant="body2">
//               This job will be automatically assigned to you. You will be responsible for managing applications.
//             </Typography>
//           </Alert>
//         )}

//         {/* Rest of the component remains the same */}
//         <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 500, color: 'primary.main' }}>
//           Publishing Options
//         </Typography>

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.careerSite}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, careerSite: e.target.checked })
//               }
//               disabled={loading}
//             />
//           }
//           label="Publish this job on career site"
//         />

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.internalEmployees}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, internalEmployees: e.target.checked })
//               }
//               disabled={loading}
//             />
//           }
//           label="Post this job for internal employees"
//         />

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.referToEmployees}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, referToEmployees: e.target.checked })
//               }
//               disabled={loading}
//             />
//           }
//           label="Refer this job to employees"
//         />

//         <Box sx={{ mt: 4, textAlign: "center" }}>
//           <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
//             Share this job on:
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
//             {jobBoards.map((board) => (
//               <a
//                 key={board.name}
//                 href={board.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ display: "inline-block", transition: "transform 0.2s" }}
//                 onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//               >
//                 <Avatar
//                   alt={board.name}
//                   src={board.logo}
//                   sx={{ width: 64, height: 64, border: '1px solid #ddd' }}
//                 />
//               </a>
//             ))}
//           </Box>
//         </Box>

//         <Box sx={{ mt: "auto", pt: 3, display: "flex", justifyContent: "space-between" }}>
//           <Button variant="outlined" onClick={onBack} disabled={loading}>
//             Back
//           </Button>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={handlePublish}
//             disabled={loading || (isAdmin && (!selectedRecruiters || selectedRecruiters.length === 0) && !isEditMode)}
//             sx={{ minWidth: 120, fontWeight: 600 }}
//           >
//             {isEditMode ? "Update Changes" : "Publish"}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );  
// }; 

// export default PublishOptionsForm;



// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Switch,
//   FormControlLabel,
//   Button,
//   Avatar,
//   CircularProgress,
//   Autocomplete,
//   TextField,
//   Alert,
//   Chip
// } from "@mui/material";

// const jobBoards = [
//   {
//     name: "Naukri",
//     logo: "/logos/naukri.png",
//     url: "https://www.naukri.com/",
//   },
//   {
//     name: "Glassdoor",
//     logo: "/logos/glassdoor.png",
//     url: "https://www.glassdoor.com/",
//   },
//   {
//     name: "Foundit",
//     logo: "/logos/foundit.jpg",
//     url: "https://www.foundit.in/",
//   },
// ];

// const PublishOptionsForm = ({ 
//   onBack, 
//   onPublish, 
//   initialOptions, 
//   isEditMode, 
//   recruiters, 
//   selectedRecruiters, 
//   setSelectedRecruiters,
//   userRole, 
//   loading
// }) => {
//   const [publishOptions, setPublishOptions] = useState({
//     careerSite: initialOptions.careerSite || false,
//     internalEmployees: initialOptions.internalEmployees || false,
//     referToEmployees: initialOptions.referToEmployees || false
//   });

//   const handlePublish = async () => {
//     await onPublish(publishOptions);
//   };

//   return (
//     <Box sx={{ 
//       maxWidth: 600, 
//       mx: "auto", 
//       mt: 5,
//       p: 3,
//       position: "relative",
//       overflow: "hidden",
//       minHeight: "500px",
//       display: "flex",
//       flexDirection: "column"
//     }}>
//       {loading && (
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10,
//             flexDirection: "column",
//             gap: 2
//           }}
//         >
//           <CircularProgress size={60} />
//           <Typography variant="h6" color="primary">
//             {isEditMode ? "Updating Job..." : "Publishing Job..."}
//           </Typography>
//           <Typography variant="body2">
//             You will be redirected to jobs page in a moment
//           </Typography>
//         </Box>
//       )}

//       <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
//         {isEditMode ? "Update Options" : "Step 3: Publish Options"}
//       </Typography>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>

//         {/* Publishing Options */}
//         <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 500, color: 'primary.main' }}>
//           Publishing Options
//         </Typography>

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.careerSite}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, careerSite: e.target.checked })
//               }
//               disabled={loading}
//             />
//           }
//           label="Publish this job on career site"
//         />

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.internalEmployees}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, internalEmployees: e.target.checked })
//               }
//               disabled={loading}
//             />
//           }
//           label="Post this job for internal employees"
//         />

//         <FormControlLabel
//           control={
//             <Switch
//               checked={publishOptions.referToEmployees}
//               onChange={(e) =>
//                 setPublishOptions({ ...publishOptions, referToEmployees: e.target.checked })
//               }
//               disabled={loading}
//             />
//           }
//           label="Refer this job to employees"
//         />

//         <Box sx={{ mt: 4, textAlign: "center" }}>
//           <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
//             Share this job on:
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
//             {jobBoards.map((board) => (
//               <a
//                 key={board.name}
//                 href={board.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ display: "inline-block", transition: "transform 0.2s" }}
//                 onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//               >
//                 <Avatar
//                   alt={board.name}
//                   src={board.logo}
//                   sx={{ width: 64, height: 64, border: '1px solid #ddd' }}
//                 />
//               </a>
//             ))}
//           </Box>
//         </Box>

//         <Box sx={{ mt: "auto", pt: 3, display: "flex", justifyContent: "space-between" }}>
//           <Button variant="outlined" onClick={onBack} disabled={loading}>
//             Back
//           </Button>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={handlePublish}
//             disabled={loading}
//             sx={{ minWidth: 120, fontWeight: 600 }}
//           >
//             {isEditMode ? "Update Changes" : "Publish"}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );  
// }; 

// export default PublishOptionsForm;


import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Avatar,
  CircularProgress,
  Autocomplete,
  TextField,
  Alert,
  Chip
} from "@mui/material";

const jobBoards = [
  {
    name: "LinkedIn",
    logo: "/logos/linkedin.png",
    url: "https://www.linkedin.com/sharing/share-offsite/?url=https://yourdomain.com/jobs",
  },
  {
    name: "Naukri",
    logo: "/logos/naukri.png",
    url: "https://www.naukri.com/",
  },
  {
    name: "Glassdoor",
    logo: "/logos/glassdoor.png",
    url: "https://www.glassdoor.com/",
  },
  {
    name: "Foundit",
    logo: "/logos/foundit.jpg",
    url: "https://www.foundit.in/",
  },
];

const PublishOptionsForm = ({ 
  onBack, 
  onPublish, 
  initialOptions, 
  isEditMode, 
  recruiters, 
  selectedRecruiters, 
  setSelectedRecruiters,
  userRole, 
  loading
}) => {

  const [publishOptions, setPublishOptions] = useState({
    careerSite: initialOptions.careerSite || false,
    internalEmployees: initialOptions.internalEmployees || false,
    referToEmployees: initialOptions.referToEmployees || false
  });

  const handlePublish = async () => {
    await onPublish(publishOptions);
  };

  // LinkedIn Job Post Format
  const generateLinkedInPost = () => {
    const postText = `
🚀 We're Hiring!

Position: Frontend Developer
Company: Your Company Name
Location: India
Experience: 2+ Years

Join our growing team and build amazing products!

Apply Here:
https://yourdomain.com/jobs

#Hiring #Jobs #FrontendDeveloper #TechJobs
`;

    navigator.clipboard.writeText(postText);
    alert("LinkedIn job post format copied! Paste it when posting.");
  };

  return (
    <Box sx={{ 
      maxWidth: 600, 
      mx: "auto", 
      mt: 5,
      p: 3,
      position: "relative",
      overflow: "hidden",
      minHeight: "500px",
      display: "flex",
      flexDirection: "column"
    }}>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            flexDirection: "column",
            gap: 2
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="primary">
            {isEditMode ? "Updating Job..." : "Publishing Job..."}
          </Typography>
          <Typography variant="body2">
            You will be redirected to jobs page in a moment
          </Typography>
        </Box>
      )}

      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        {isEditMode ? "Update Options" : "Step 3: Publish Options"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>

        <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 500, color: 'primary.main' }}>
          Publishing Options
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={publishOptions.careerSite}
              onChange={(e) =>
                setPublishOptions({ ...publishOptions, careerSite: e.target.checked })
              }
              disabled={loading}
            />
          }
          label="Publish this job on career site"
        />

        <FormControlLabel
          control={
            <Switch
              checked={publishOptions.internalEmployees}
              onChange={(e) =>
                setPublishOptions({ ...publishOptions, internalEmployees: e.target.checked })
              }
              disabled={loading}
            />
          }
          label="Post this job for internal employees"
        />

        <FormControlLabel
          control={
            <Switch
              checked={publishOptions.referToEmployees}
              onChange={(e) =>
                setPublishOptions({ ...publishOptions, referToEmployees: e.target.checked })
              }
              disabled={loading}
            />
          }
          label="Refer this job to employees"
        />

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Share this job on:
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
            {jobBoards.map((board) => (
              <a
                key={board.name}
                href={board.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", transition: "transform 0.2s" }}
                onClick={(e) => {
                  if (board.name === "LinkedIn") {
                    generateLinkedInPost();
                  }
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Avatar
                  alt={board.name}
                  src={board.logo}
                  sx={{ width: 64, height: 64, border: "1px solid #ddd" }}
                />
              </a>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: "auto", pt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={onBack} disabled={loading}>
            Back
          </Button>

          <Button 
            variant="contained" 
            color="primary" 
            onClick={handlePublish}
            disabled={loading}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            {isEditMode ? "Update Changes" : "Publish"}
          </Button>
        </Box>

      </Box>
    </Box>
  );  
};

export default PublishOptionsForm;