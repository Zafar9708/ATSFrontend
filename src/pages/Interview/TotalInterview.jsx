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
  Stack,
  Container,
  useMediaQuery,
  Drawer,
  Fab,
  Chip,
  Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
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
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';

const TotalInterviews = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    searchTerm: '',
    statusFilter: 'all',
    selectedDate: null
  });
  
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Fixed sidebar width - must match your sidebar
  const sidebarWidth = 180;

  const handleBack = () => {
 navigate(-1)
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSelectedDate(null);
    setTempFilters({
      searchTerm: '',
      statusFilter: 'all',
      selectedDate: null
    });
  };

  const handleApplyMobileFilters = () => {
    setSearchTerm(tempFilters.searchTerm);
    setStatusFilter(tempFilters.statusFilter);
    setSelectedDate(tempFilters.selectedDate);
    setMobileFilterOpen(false);
  };

  const handleOpenMobileFilters = () => {
    setTempFilters({
      searchTerm,
      statusFilter,
      selectedDate
    });
    setMobileFilterOpen(true);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
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

  // Mobile Filter Drawer Component
  const MobileFilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileFilterOpen}
      onClose={() => setMobileFilterOpen(false)}
      PaperProps={{
        sx: {
          maxHeight: '85vh',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          p: 2.5
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        pb: 1,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filter Interviews
        </Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        maxHeight: 'calc(85vh - 150px)', 
        overflowY: 'auto',
        px: 0.5
      }}>
        <Stack spacing={2.5}>
          {/* Search Field */}
          <TextField
            fullWidth
            placeholder="Search candidates, jobs..."
            value={tempFilters.searchTerm}
            onChange={(e) => setTempFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: tempFilters.searchTerm && (
                <IconButton
                  edge="end"
                  onClick={() => setTempFilters(prev => ({ ...prev, searchTerm: '' }))}
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }}
          />

          {/* Status Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={tempFilters.statusFilter}
              onChange={(e) => setTempFilters(prev => ({ ...prev, statusFilter: e.target.value }))}
              label="Status"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Picker */}
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={tempFilters.selectedDate || ''}
            onChange={(e) => setTempFilters(prev => ({ ...prev, selectedDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 1.5, 
        mt: 3, 
        pt: 2, 
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleClearFilters}
          disabled={getFilterBadgeCount() === 0}
          sx={{ borderRadius: 2 }}
        >
          Clear All
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleApplyMobileFilters}
          sx={{ borderRadius: 2 }}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );

  // Active filters chips for mobile
  const ActiveFilters = () => {
    if (getFilterBadgeCount() === 0) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        mb: 2,
        mt: 1
      }}>
        {searchTerm && (
          <Chip
            label={`Search: ${searchTerm}`}
            onDelete={() => setSearchTerm('')}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {statusFilter !== 'all' && (
          <Chip
            label={`Status: ${statusOptions.find(s => s.value === statusFilter)?.label}`}
            onDelete={() => setStatusFilter('all')}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {selectedDate && (
          <Chip
            label={`Date: ${selectedDate}`}
            onDelete={() => setSelectedDate(null)}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        <Chip
          label="Clear All"
          onClick={handleClearFilters}
          size="small"
          color="default"
          variant="outlined"
        />
      </Box>
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        marginTop:'50px',
        bgcolor: theme.palette.background.default,
        // Responsive margin based on sidebar
        marginLeft: {
          xs: 0,
          sm: isDesktop ? `${sidebarWidth+50}px` : 0,
          md: `${sidebarWidth}px`,
        },
        width: {
          xs: '100%',
          sm: isDesktop ? `100%` : '100%',
          md: `120%`,
        },
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 1}
        sx={{
          width: '100%',
          minHeight: '100vh',
          borderRadius: {
            xs: 0,
            sm: 2,
            md: 3,
          },
          p: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
          },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Back Button */}
        <Box sx={{ mb: isMobile ? 1 : 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              fontSize: isMobile ? '0.9rem' : '1rem',
              fontWeight: 500,
              textTransform: 'none',
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 1,
              borderRadius:"50%"
            }}
          >
          </Button>
        </Box>

        {/* Header Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between', 
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            mb: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            gap: 2,
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            sx={{ 
              fontWeight: 700,
              fontSize: {
                xs: '1.1rem',
                sm: '1.25rem',
                md: '1.5rem',
              }
            }}
          >
            Total Interviews 
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: {
              xs: 'flex-start',
              sm: 'flex-end',
            },
            width: {
              xs: '100%',
              sm: 'auto',
            }
          }}>
            {isMobile ? (
              <Badge badgeContent={getFilterBadgeCount()} color="primary">
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleOpenMobileFilters}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                  }}
                >
                  Filters
                </Button>
              </Badge>
            ) : (
              <Badge badgeContent={getFilterBadgeCount()} color="primary">
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
                    px: {
                      xs: 2,
                      sm: 2.5,
                      md: 3,
                    },
                  }}
                >
                  Filters
                </Button>
              </Badge>
            )}
          </Box>
        </Box>

        {/* Active Filters Chips (Mobile) */}
        {isMobile && <ActiveFilters />}

        {/* Filter Panel - Desktop/Tablet */}
        {!isMobile && (
          <Collapse in={showFilters}>
            <Paper
              sx={{
                p: {
                  sm: 2,
                  md: 3,
                },
                mb: 3,
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
              }}
            >
              <Stack spacing={2.5}>
                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search candidates, interviewers, emails, job titles, job names"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <IconButton
                        edge="end"
                        onClick={() => setSearchTerm('')}
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Select Interview Date"
                      value={selectedDate || ''}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon />
                          </InputAdornment>
                        ),
                        endAdornment: selectedDate && (
                          <IconButton
                            edge="end"
                            onClick={() => setSelectedDate(null)}
                            size="small"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  justifyContent: 'flex-end',
                  gap: 1.5,
                }}>
                  <Button
                    onClick={handleClearFilters}
                    disabled={getFilterBadgeCount() === 0}
                    sx={{ textTransform: 'none' }}
                  >
                    Clear all
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setShowFilters(false)}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Apply Filters
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Collapse>
        )}

        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{ 
            mb: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '0.9375rem',
              },
              minHeight: {
                xs: 48,
                sm: 48,
                md: 48,
              },
              py: {
                xs: 1,
                sm: 1,
                md: 1.5,
              }
            }
          }}
        >
          <Tab 
            icon={<VideoCameraFrontIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />} 
            iconPosition="start"
            label="Online" 
          />
          <Tab 
            icon={<MeetingRoomIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />} 
            iconPosition="start"
            label="Offline" 
          />
          <Tab 
            icon={<CancelIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />} 
            iconPosition="start"
            label="Rejected" 
          />
        </Tabs>

        {/* Content */}
        <Box sx={{ 
          mt: {
            xs: 2,
            sm: 2.5,
            md: 3,
          }
        }}>
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

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer />
      </Paper>
    </Box>
  );
};

export default TotalInterviews;