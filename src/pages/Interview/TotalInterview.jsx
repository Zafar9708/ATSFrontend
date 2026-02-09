


// import React, { useState } from 'react';
// import {
//   Box,
//   Tabs,
//   Tab,
//   useTheme,
//   Paper,
//   Typography,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Grid,
//   IconButton,
//   Collapse,
//   Button,
//   Badge,
//   Stack,
//   Divider
// } from '@mui/material';
// // import OnlineInterviews from './TotalOnlineInterviews';
// // import OfflineInterviews from './TotalOfflineInterviews';
// import OnlineInterviews from '../../components/Interviews/onlineInterviews';
// import OfflineInterviews from '../../components/Interviews/OfflineInterviews';
// import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
// import SearchIcon from '@mui/icons-material/Search';
// import ClearIcon from '@mui/icons-material/Clear';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import TuneIcon from '@mui/icons-material/Tune';

// const TotalInterviews = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filterExpanded, setFilterExpanded] = useState(false);
//   const theme = useTheme();

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('all');
//     setSelectedDate(null);
//   };

//   const statusOptions = [
//     { value: 'all', label: 'All Statuses' },
//     { value: 'scheduled', label: 'Scheduled' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'cancelled', label: 'Cancelled' }
//   ];

//   const getFilterBadgeCount = () => {
//     let count = 0;
//     if (searchTerm) count++;
//     if (statusFilter !== 'all') count++;
//     if (selectedDate) count++;
//     return count;
//   };

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         width: '200%',
//         borderRadius: 3,
//         p: 3,
//         backgroundColor: theme.palette.background.paper,
//       }}
//     >
//       {/* Header Section */}
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         mb: 3,
//         gap: 2
//       }}>
//         <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
//           Total Interviews 
//         </Typography>
        
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Badge 
//             badgeContent={getFilterBadgeCount()} 
//             color="primary"
//             overlap="circular"
//             sx={{ 
//               '& .MuiBadge-badge': { 
//                 fontSize: '0.7rem', 
//                 height: 20, 
//                 minWidth: 20,
//                 borderRadius: '50%',
//                 top: 8,
//                 right: 8,
//                 border: `2px solid ${theme.palette.background.paper}`
//               } 
//             }}
//           >
//             <Button
//               variant="outlined"
//               startIcon={<TuneIcon />}
//               endIcon={filterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//               onClick={() => {
//                 setShowFilters(!showFilters);
//                 setFilterExpanded(!filterExpanded);
//               }}
//               sx={{
//                 borderRadius: 2,
//                 px: 2,
//                 py: 1,
//                 borderColor: theme.palette.divider,
//                 backgroundColor: showFilters ? theme.palette.action.selected : 'inherit',
//                 '&:hover': {
//                   backgroundColor: theme.palette.action.hover
//                 }
//               }}
//             >
//               Filters
//             </Button>
//           </Badge>
//         </Box>
//       </Box>

//       {/* Filter Panel */}
//       <Collapse in={showFilters} timeout="auto" unmountOnExit>
//         <Paper
//           elevation={0}
//           sx={{
//             mb: 3,
//             p: 3,
//             borderRadius: 2,
//             backgroundColor: theme.palette.background.default,
//             border: `1px solid ${theme.palette.divider}`,
//             boxShadow: theme.shadows[1]
//           }}
//         >
//           <Stack spacing={3}>
//             {/* Search Field */}
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Search candidates, interviewers, emails, job titles, job names"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchTerm && (
//                   <IconButton
//                     edge="end"
//                     onClick={() => setSearchTerm('')}
//                     size="small"
//                     sx={{ color: theme.palette.text.secondary }}
//                   >
//                     <ClearIcon fontSize="small" />
//                   </IconButton>
//                 ),
//                 sx: {
//                   borderRadius: 2,
//                   backgroundColor: theme.palette.background.paper
//                 }
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: theme.palette.divider,
//                   },
//                   '&:hover fieldset': {
//                     borderColor: theme.palette.primary.light,
//                   },
//                 }
//               }}
//             />

//             <Grid container spacing={2}>
//               {/* Status Filter */}
//               <Grid item xs={12} sm={6} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel sx={{ 
//                     color: theme.palette.text.secondary,
//                     '&.Mui-focused': {
//                       color: theme.palette.primary.main
//                     }
//                   }}>
//                     Status
//                   </InputLabel>
//                   <Select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     label="Status"
//                     sx={{
//                       borderRadius: 2,
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: theme.palette.divider,
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: theme.palette.primary.light,
//                       },
//                     }}
//                     MenuProps={{
//                       PaperProps: {
//                         sx: {
//                           borderRadius: 2,
//                           mt: 1,
//                           boxShadow: theme.shadows[3]
//                         }
//                       }
//                     }}
//                   >
//                     {statusOptions.map((option) => (
//                       <MenuItem 
//                         key={option.value} 
//                         value={option.value}
//                         sx={{
//                           '&.Mui-selected': {
//                             backgroundColor: theme.palette.action.selected,
//                           },
//                           '&:hover': {
//                             backgroundColor: theme.palette.action.hover,
//                           }
//                         }}
//                       >
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* Date Picker */}
//               <Grid item xs={12} sm={6} md={6}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="Select Interview Date"
//                   value={selectedDate || ''}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   InputLabelProps={{ 
//                     shrink: true,
//                     sx: {
//                       color: theme.palette.text.secondary,
//                       '&.Mui-focused': {
//                         color: theme.palette.primary.main
//                       }
//                     }
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <CalendarTodayIcon color="action" />
//                       </InputAdornment>
//                     ),
//                     endAdornment: selectedDate && (
//                       <IconButton
//                         edge="end"
//                         onClick={() => setSelectedDate(null)}
//                         size="small"
//                         sx={{ color: theme.palette.text.secondary }}
//                       >
//                         <ClearIcon fontSize="small" />
//                       </IconButton>
//                     ),
//                   }}
//                   sx={{
//                     borderRadius: 2,
//                     '& .MuiOutlinedInput-root': {
//                       '& fieldset': {
//                         borderColor: theme.palette.divider,
//                       },
//                       '&:hover fieldset': {
//                         borderColor: theme.palette.primary.light,
//                       },
//                     }
//                   }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Filter Actions */}
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'flex-end', 
//               gap: 2,
//               pt: 1
//             }}>
//               <Button
//                 variant="text"
//                 color="inherit"
//                 onClick={handleClearFilters}
//                 startIcon={<ClearIcon />}
//                 disabled={getFilterBadgeCount() === 0}
//                 sx={{
//                   textTransform: 'none',
//                   color: theme.palette.text.secondary,
//                   '&:hover': {
//                     color: theme.palette.text.primary,
//                     backgroundColor: 'transparent'
//                   }
//                 }}
//               >
//                 Clear all
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => setFilterExpanded(false)}
//                 sx={{
//                   borderRadius: 2,
//                   px: 3,
//                   textTransform: 'none',
//                   boxShadow: 'none',
//                   '&:hover': {
//                     boxShadow: 'none'
//                   }
//                 }}
//               >
//                 Apply Filters
//               </Button>
//             </Box>
//           </Stack>
//         </Paper>
//       </Collapse>

//       {/* Tabs Section */}
//       <Tabs 
//         value={tabValue} 
//         onChange={handleTabChange} 
//         aria-label="interview types tabs"
//         variant="fullWidth"
//         sx={{
//           mb: 3,
//           '& .MuiTabs-indicator': {
//             backgroundColor: theme.palette.primary.main,
//             height: 3,
//             borderRadius: 3
//           },
//           '& .MuiTab-root': {
//             textTransform: 'none',
//             fontWeight: 500,
//             fontSize: '0.9375rem',
//             minHeight: 48,
//             color: theme.palette.text.secondary,
//             '&.Mui-selected': {
//               color: theme.palette.primary.main,
//               fontWeight: 600,
//             },
//           },
//         }}
//       >
//         <Tab
//           icon={<VideoCameraFrontIcon />}
//           iconPosition="start"
//           label="Online Interviews"
//           sx={{
//             minHeight: 48,
//             '& .MuiTab-iconWrapper': {
//               mb: 0,
//               mr: 1
//             }
//           }}
//         />
//         <Tab
//           icon={<MeetingRoomIcon />}
//           iconPosition="start"
//           label="Offline Interviews"
//           sx={{
//             minHeight: 48,
//             '& .MuiTab-iconWrapper': {
//               mb: 0,
//               mr: 1
//             }
//           }}
//         />
//       </Tabs>

//       {/* Content Section */}
//       <Box sx={{ 
//         mt: 2,
//         borderRadius: 2,
//         overflow: 'hidden'
//       }}>
//         {tabValue === 0 && (
//           <OnlineInterviews 
//             searchTerm={searchTerm}
//             statusFilter={statusFilter}
//             selectedDate={selectedDate}
//           />
//         )}
//         {tabValue === 1 && (
//           <OfflineInterviews 
//             searchTerm={searchTerm}
//             statusFilter={statusFilter}
//             selectedDate={selectedDate}
//           />
//         )}
//       </Box>
//     </Paper>
//   );
// };

// export default TotalInterviews;

//--------

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  useTheme,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  IconButton,
  Collapse,
  Button,
  Badge,
  Stack
} from '@mui/material';
import OnlineInterviews from '../../components/Interviews/onlineInterviews';
import OfflineInterviews from '../../components/Interviews/OfflineInterviews';
import RejectedInterviews from '../../components/Interviews/RejectedInterviews';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';

const TotalInterviews = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSelectedDate(null);
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const getFilterBadgeCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (selectedDate) count++;
    return count;
  };

  return (
    <Box 
      sx={{ 
        width: '80vw',   // full screen width
        minHeight: '100vh', 
        bgcolor: theme.palette.background.default,
        boxSizing: 'border-box',
        p: 2,             // remove extra padding
        m: 0  ,
        marginLeft:12            // remove margin
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          minHeight: '100vh',
          borderRadius: 0, // no rounded corners for full page layout
          p: 4,
          backgroundColor: theme.palette.background.paper,
          boxSizing: 'border-box',
          overflowX: 'hidden' // prevent right scroll issue
        }}
      >
        {/* Header Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            gap: 2,
            flexWrap: 'wrap',
            width: '100%'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Total Interviews 
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge 
              badgeContent={getFilterBadgeCount()} 
              color="primary"
              overlap="circular"
            >
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                endIcon={filterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => {
                  setShowFilters(!showFilters);
                  setFilterExpanded(!filterExpanded);
                }}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                Filters
              </Button>
            </Badge>
          </Box>
        </Box>

        {/* Filter Panel */}
        <Collapse in={showFilters} timeout="auto" unmountOnExit>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={2}>
              {/* Search Field */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search candidates, interviewers, emails, job titles, job names"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <IconButton
                      edge="end"
                      onClick={() => setSearchTerm('')}
                      size="small"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )
                }}
              />

              <Grid container spacing={2}>
                {/* Status Filter */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date Picker */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Select Interview Date"
                    value={selectedDate || ''}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: selectedDate && (
                        <IconButton
                          edge="end"
                          onClick={() => setSelectedDate(null)}
                          size="small"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Filter Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  disabled={getFilterBadgeCount() === 0}
                >
                  Clear all
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setFilterExpanded(false)}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Collapse>

        {/* Tabs Section */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab icon={<VideoCameraFrontIcon />} iconPosition="start" label="Online Interviews" />
          <Tab icon={<MeetingRoomIcon />} iconPosition="start" label="Offline Interviews" />
          <Tab icon={<CancelIcon />} iconPosition="start" label="Rejected Interviews" />
        </Tabs>

        {/* Content Section */}
        <Box sx={{ mt: 2, width: '100%' }}>
          {tabValue === 0 && (
            <OnlineInterviews 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              selectedDate={selectedDate}
            />
          )}
          {tabValue === 1 && (
            <OfflineInterviews 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              selectedDate={selectedDate}
            />
          )}
          {tabValue === 2 && (
            <RejectedInterviews 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              selectedDate={selectedDate}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TotalInterviews;
