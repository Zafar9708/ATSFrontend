import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  TextField,
  Chip,
  Dialog,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
  Badge,
  Stack,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  ViewModule as CardViewIcon,
  ViewHeadline as TableViewIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  AssignmentInd as InterviewIcon,
  ArrowForward as StageIcon,
  NoteAdd as RemarksIcon,
  Email as EmailIcon,
  Assessment as AnalysisIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import CandidateDetailsPage from "./CandidateDetailsPage";
import CandidateResumeAnalysis from "../../pages/Candidate/CandidateResumeAnalysis";
import candidateService from "../../services/Candidates/candidateService";
import stageService from "../../services/Candidates/stageService";
import BulkUploadDialog from "../../components/Candidates/BulkUploadDialog";
import ErrorBoundary from "../../components/ErrorBoundary";

export const CandidatesTab = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [viewMode, setViewMode] = useState("table");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [interviewAnchorEl, setInterviewAnchorEl] = useState(null);
  const [stageAnchorEl, setStageAnchorEl] = useState(null);
  const [remarksAnchorEl, setRemarksAnchorEl] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewType, setInterviewType] = useState(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [bulkMoveDialogOpen, setBulkMoveDialogOpen] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [stages, setStages] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [rejectedFilter, setRejectedFilter] = useState("");
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [selectedCandidateForAnalysis, setSelectedCandidateForAnalysis] =
    useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [rejectionTypes, setRejectionTypes] = useState([]);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({});

  // Filter state - Updated with new fields
  const [filters, setFilters] = useState({
    status: "",
    businessUnit: "",
    department: "",
    recruiter: "",
    location: "",
    searchQuery: "",
    source: "",
    experience: "",
    availableToJoin: "",
  });

  // Mock data for filter options (replace with actual API data)
  const businessUnits = [
    "Technology",
    "Sales",
    "Marketing",
    "Operations",
    "HR",
  ];
  const departments = ["Engineering", "Product", "Design", "Finance", "Legal"];
  const recruiters = [
    "John Smith",
    "Sarah Johnson",
    "Mike Brown",
    "Lisa Davis",
  ];
  const locations = [
    "New York",
    "San Francisco",
    "London",
    "Singapore",
    "Mumbai",
  ];

  // Calculate main content width based on sidebar state
  const getMainContentWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) {
      return sidebarOpen ? "calc(100vw - 240px)" : "calc(100vw - 65px)";
    }
    return sidebarOpen ? "calc(100vw - 240px)" : "calc(100vw - 65px)";
  };

  // Get responsive grid columns for card view
  const getCardGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) {
      return sidebarOpen ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
    }
    if (sidebarOpen) {
      return {
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      };
    }
    return {
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
      xl: "repeat(5, 1fr)",
    };
  };

  // Get responsive padding
  const getContainerPadding = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  // Get filter count
  const getFilterCount = () => {
    return Object.keys(filters).filter(
      (key) => filters[key] && key !== "searchQuery",
    ).length;
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Fetch all candidates and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const candidatesResponse = await candidateService.fetchCandidates();

        let candidatesData = [];
        if (Array.isArray(candidatesResponse)) {
          candidatesData = candidatesResponse;
        } else if (
          candidatesResponse &&
          Array.isArray(candidatesResponse.candidates)
        ) {
          candidatesData = candidatesResponse.candidates;
        } else if (
          candidatesResponse &&
          Array.isArray(candidatesResponse.data)
        ) {
          candidatesData = candidatesResponse.data;
        }

        setCandidates(candidatesData);

        try {
          const stagesData = await stageService.fetchStages();
          setStages(stagesData);
        } catch (err) {
          console.error("Error fetching stages:", err);
          setStages([]);
        }

        try {
          const optionsData = await stageService.fetchStageOptions();
          setStageOptions(optionsData);
        } catch (err) {
          console.error("Error fetching stage options:", err);
          setStageOptions([]);
        }

        try {
          const rejectionData = await stageService.fetchRejectionTypes();
          setRejectionTypes(rejectionData);
        } catch (err) {
          console.error("Error fetching rejection types:", err);
          setRejectionTypes([]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        showSnackbar(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get stage name
  const getStageName = (stage) => {
    if (!stage) return "Sourced";

    if (typeof stage === "string") {
      const foundStage =
        stages.find((s) => s._id === stage) ||
        stageOptions.find((s) => s._id === stage);
      return foundStage?.name || "Sourced";
    }

    if (typeof stage === "object") {
      if (stage.name) return stage.name;
      if (stage._id) {
        const foundStage =
          stages.find((s) => s._id === stage._id) ||
          stageOptions.find((s) => s._id === stage._id);
        return foundStage?.name || "Sourced";
      }
    }

    return "Sourced";
  };

  // Helper function to get recruiter name
  const getRecruiterName = (owner) => {
    if (!owner) return "Not assigned";

    if (typeof owner === "string") {
      return owner;
    }

    if (typeof owner === "object") {
      if (owner.email) {
        return owner.email.split("@")[0];
      }
      if (owner.name) {
        return owner.name;
      }
    }

    return "Not assigned";
  };

  // Helper function to get vendor name
  const getVendorName = (candidate) => {
    return candidate.vendor || "Not Specified";
  };

  // Helper function to format skills
  const formatSkills = (skills) => {
    if (!skills) return "No skills listed";

    if (Array.isArray(skills)) {
      return skills.join(", ");
    }

    if (typeof skills === "string") {
      return skills;
    }

    return "No skills listed";
  };

  // Calculate candidate counts for all stages
  const calculateStageCounts = (candidates) => {
    const counts = {
      sourced: 0,
      interview: 0,
      preboarding: 0,
      hired: 0,
      archived: 0,
      rejected: 0,
      all: candidates.length,
    };

    candidates.forEach((candidate) => {
      if (!candidate) return;

      const stageName = getStageName(candidate.stage).toLowerCase();
      counts[stageName] = (counts[stageName] || 0) + 1;
    });

    return counts;
  };

  // Filter candidates based on filter criteria
  const getFilteredCandidates = () => {
    return candidates.filter((candidate) => {
      if (!candidate) return false;

      // Status filter
      if (filters.status && filters.status.toLowerCase() !== "sourced") {
        const candidateStageName = getStageName(candidate.stage).toLowerCase();
        if (candidateStageName !== filters.status.toLowerCase()) {
          return false;
        }

        if (filters.status.toLowerCase() === "rejected" && rejectedFilter) {
          if (candidate.rejectionType !== rejectedFilter) {
            return false;
          }
        }
      }

      // Business Unit filter (mock - replace with actual logic)
      if (
        filters.businessUnit &&
        candidate.businessUnit !== filters.businessUnit
      ) {
        return false;
      }

      // Department filter (mock - replace with actual logic)
      if (filters.department && candidate.department !== filters.department) {
        return false;
      }

      // Recruiter filter (mock - replace with actual logic)
      if (filters.recruiter) {
        const recruiterName = getRecruiterName(candidate.owner);
        if (
          recruiterName !== filters.recruiter &&
          recruiterName !== "Not assigned"
        ) {
          return false;
        }
      }

      // Location filter (mock - replace with actual logic)
      if (filters.location && candidate.location !== filters.location) {
        return false;
      }

      // Source filter
      if (filters.source) {
        const candidateSource = candidate.source;
        const sourceName =
          typeof candidateSource === "string"
            ? candidateSource
            : candidateSource?.name;

        if (sourceName !== filters.source) {
          return false;
        }
      }

      // Experience filter
      if (filters.experience) {
        const [min, max] = filters.experience.split("-").map(Number);
        const candidateExp = parseFloat(candidate.experience || 0);

        if (filters.experience === "5+" && candidateExp < 5) {
          return false;
        }
        if (max && (candidateExp < min || candidateExp > max)) {
          return false;
        }
      }

      // Availability filter
      if (
        filters.availableToJoin &&
        (candidate.availableToJoin || 0) > parseInt(filters.availableToJoin)
      ) {
        return false;
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const candidateText = [
          candidate.firstName || "",
          candidate.middleName || "",
          candidate.lastName || "",
          candidate.email || "",
          candidate.mobile || "",
          candidate.skills || "",
        ]
          .join(" ")
          .toLowerCase();

        if (!candidateText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  };

  const stageCounts = calculateStageCounts(candidates);
  const filteredCandidates = getFilteredCandidates();

  const stageCardData = [
    {
      stage: "sourced",
      label: "All Candidates",
      count: stageCounts.all,
      totalCount: stageCounts.all,
    },
    { stage: "interview", label: "Interview", count: stageCounts.interview },
    {
      stage: "preboarding",
      label: "Preboarding",
      count: stageCounts.preboarding,
    },
    { stage: "hired", label: "Hired", count: stageCounts.hired },
    { stage: "archived", label: "Archived", count: stageCounts.archived },
    { stage: "rejected", label: "Rejected", count: stageCounts.rejected },
  ];

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const handleSelectAllCandidates = (event) => {
    if (event.target.checked) {
      const allIds = filteredCandidates.map((c) => c._id);
      setSelectedCandidates(allIds);
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleOpenDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDetailsDialog(true);
  };

  const handleNavigateToCandidate = (candidate) => {
    navigate(`/candidates/${candidate._id}`);
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
  };

  const handleInterviewClick = (event, candidateId) => {
    setCurrentCandidate(candidateId);
    setInterviewAnchorEl(event.currentTarget);
  };

  const handleStageClick = (event, candidateId) => {
    setCurrentCandidate(candidateId);
    setStageAnchorEl(event.currentTarget);
  };

  const handleRemarksClick = (event, candidateId) => {
    setCurrentCandidate(candidateId);
    setRemarksAnchorEl(event.currentTarget);
  };

  const handleCloseInterviewMenu = () => {
    setInterviewAnchorEl(null);
  };

  const handleCloseStageMenu = () => {
    setStageAnchorEl(null);
  };

  const handleCloseRemarksMenu = () => {
    setRemarksAnchorEl(null);
  };

  const handleInterviewOption = (option, candidateId) => {
    setInterviewType(option);
    setCurrentCandidate(candidates.find((c) => c._id === candidateId));
    setShowInterviewModal(true);
    handleCloseInterviewMenu();
  };

  const handleStageMove = async (formData) => {
    try {
      await candidateService.updateCandidate(currentCandidate, formData);
      const candidatesResponse = await candidateService.fetchCandidates();
      let refreshedCandidates = [];

      if (Array.isArray(candidatesResponse)) {
        refreshedCandidates = candidatesResponse;
      } else if (
        candidatesResponse &&
        Array.isArray(candidatesResponse.candidates)
      ) {
        refreshedCandidates = candidatesResponse.candidates;
      } else if (candidatesResponse && Array.isArray(candidatesResponse.data)) {
        refreshedCandidates = candidatesResponse.data;
      }

      setCandidates(refreshedCandidates);
      showSnackbar("Candidate stage updated successfully!");
      setMoveDialogOpen(false);
    } catch (error) {
      console.error("Error updating candidate stage:", error);
      showSnackbar(error.message, "error");
    }
  };

  const handleBulkStageMove = async () => {
    try {
      const updatePromises = selectedCandidates.map((candidateId) =>
        candidateService.updateCandidate(candidateId, { stage: newStage }),
      );

      await Promise.all(updatePromises);
      const candidatesResponse = await candidateService.fetchCandidates();
      let refreshedCandidates = [];

      if (Array.isArray(candidatesResponse)) {
        refreshedCandidates = candidatesResponse;
      } else if (
        candidatesResponse &&
        Array.isArray(candidatesResponse.candidates)
      ) {
        refreshedCandidates = candidatesResponse.candidates;
      } else if (candidatesResponse && Array.isArray(candidatesResponse.data)) {
        refreshedCandidates = candidatesResponse.data;
      }

      setCandidates(refreshedCandidates);
      setSelectedCandidates([]);
      setBulkMoveDialogOpen(false);
      showSnackbar("Candidates moved successfully!");
    } catch (error) {
      console.error("Error moving candidates:", error);
      showSnackbar(error.message, "error");
    }
  };

  const handleBulkEmail = async () => {
    setEmailDialogOpen(true);
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject || !emailBody) {
      showSnackbar("Please enter both subject and body", "error");
      return;
    }

    try {
      setIsSendingEmail(true);
      const selectedCandidateEmails = candidates
        .filter((c) => selectedCandidates.includes(c._id))
        .map((c) => c.email);

      if (selectedCandidateEmails.length === 0) {
        showSnackbar("No candidates selected", "error");
        return;
      }

      const response = await candidateService.sendBulkEmails({
        recipients: selectedCandidateEmails,
        subject: emailSubject,
        body: emailBody,
      });

      if (response.success) {
        showSnackbar(
          `Email sent to ${selectedCandidateEmails.length} candidates`,
          "success",
        );
        setEmailDialogOpen(false);
        setEmailSubject("");
        setEmailBody("");
      } else {
        throw new Error(response.message || "Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending bulk email:", error);
      showSnackbar(error.message, "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (action === "delete") {
      try {
        const deletePromises = selectedCandidates.map((id) =>
          candidateService.deleteCandidate(id),
        );
        await Promise.all(deletePromises);
        const candidatesResponse = await candidateService.fetchCandidates();
        let refreshedCandidates = [];

        if (Array.isArray(candidatesResponse)) {
          refreshedCandidates = candidatesResponse;
        } else if (
          candidatesResponse &&
          Array.isArray(candidatesResponse.candidates)
        ) {
          refreshedCandidates = candidatesResponse.candidates;
        } else if (
          candidatesResponse &&
          Array.isArray(candidatesResponse.data)
        ) {
          refreshedCandidates = candidatesResponse.data;
        }

        setCandidates(refreshedCandidates);
        setSelectedCandidates([]);
        showSnackbar("Candidate(s) deleted successfully!");
      } catch (error) {
        console.error("Bulk delete failed:", error);
        showSnackbar(error.message, "error");
      }
    } else if (action === "email") {
      handleBulkEmail();
    } else if (action === "move-to-sourced") {
      setBulkMoveDialogOpen(true);
    }
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });

    if (
      filterName === "status" &&
      event.target.value.toLowerCase() !== "rejected"
    ) {
      setRejectedFilter("");
    }
  };

  const handleRejectedFilterChange = (event) => {
    setRejectedFilter(event.target.value);
  };

  const handleOpenAnalysis = async (candidateId) => {
    const candidate = candidates.find((c) => c._id === candidateId);
    if (!candidate) return;

    setSelectedCandidateForAnalysis(candidate);
    setAnalysisLoading(true);
    setAnalysisDialogOpen(true);

    try {
      const analysisData =
        await candidateService.getResumeAnalysis(candidateId);
      setAnalysisData(analysisData);
    } catch (error) {
      console.error("Error fetching resume analysis:", error);
      showSnackbar(error.message || "Failed to fetch resume analysis", "error");
      setAnalysisData(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleAddRemarks = () => {
    handleCloseRemarksMenu();
    setRemarksDialogOpen(true);
  };

  const handleSubmitRemarks = async () => {
    try {
      await candidateService.addRemarks({
        text: remarksText,
        candidateId: currentCandidate,
      });

      const candidatesResponse = await candidateService.fetchCandidates();
      let refreshedCandidates = [];

      if (Array.isArray(candidatesResponse)) {
        refreshedCandidates = candidatesResponse;
      } else if (
        candidatesResponse &&
        Array.isArray(candidatesResponse.candidates)
      ) {
        refreshedCandidates = candidatesResponse.candidates;
      } else if (candidatesResponse && Array.isArray(candidatesResponse.data)) {
        refreshedCandidates = candidatesResponse.data;
      }

      setCandidates(refreshedCandidates);
      setRemarksDialogOpen(false);
      setRemarksText("");
      showSnackbar("Remarks added successfully!");
    } catch (error) {
      console.error("Error saving remarks:", error);
      showSnackbar(error.message, "error");
    }
  };

  const handleStageCardClick = (stage) => {
    if (stage === "sourced") {
      setFilters({
        ...filters,
        status: "",
      });
    } else {
      setFilters({
        ...filters,
        status: stage,
      });
    }
    setRejectedFilter("");
  };

  const handleRejectedCardClick = () => {
    setFilters({
      ...filters,
      status: "rejected",
    });
    setRejectedFilter("");
  };

  const handleMobileFilterApply = () => {
    setFilters(tempFilters);
    setMobileFilterOpen(false);
  };

  const handleMobileFilterClear = () => {
    setTempFilters({});
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      businessUnit: "",
      department: "",
      recruiter: "",
      location: "",
      searchQuery: "",
      source: "",
      experience: "",
      availableToJoin: "",
    });
    setTempFilters({});
    setRejectedFilter("");
  };

  const handleBulkUploadComplete = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const candidatesResponse = await candidateService.fetchCandidates();

        let candidatesData = [];
        if (Array.isArray(candidatesResponse)) {
          candidatesData = candidatesResponse;
        } else if (
          candidatesResponse &&
          Array.isArray(candidatesResponse.candidates)
        ) {
          candidatesData = candidatesResponse.candidates;
        } else if (
          candidatesResponse &&
          Array.isArray(candidatesResponse.data)
        ) {
          candidatesData = candidatesResponse.data;
        }

        setCandidates(candidatesData);
        showSnackbar("Bulk upload completed successfully!", "success");
      } catch (err) {
        console.error("Failed to refresh candidates after bulk upload:", err);
        showSnackbar("Failed to refresh candidates list", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  // Mobile Filter Drawer Component - With labels in border left corner
  const MobileFilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileFilterOpen}
      onClose={() => setMobileFilterOpen(false)}
      PaperProps={{
        sx: {
          maxHeight: "85vh",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          p: { xs: 2.5, sm: 3 },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 1,
          borderBottom: "2px solid #f1f5f9",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Filter Candidates
        </Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          maxHeight: "calc(85vh - 180px)",
          overflowY: "auto",
          px: 0.5,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f5f9",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#94a3b8",
            borderRadius: "10px",
          },
        }}
      >
        <Stack spacing={2.5}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                backgroundColor: "white",
                px: 0.5,
                transform: "translate(14px, -9px) scale(0.75)",
                "&.Mui-focused": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              shrink
            >
              Status
            </InputLabel>
            <Select
              value={tempFilters.status || ""}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              label="Status"
              sx={{
                "& .MuiSelect-select": {
                  fontSize: "0.95rem",
                  py: 1.5,
                },
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ fontSize: "0.95rem" }}>Select Status </em>
              </MenuItem>
              {stageOptions.map((option) => (
                <MenuItem
                  key={option._id || option}
                  value={option.name || option}
                >
                  {option.name || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                backgroundColor: "white",
                px: 0.5,
                transform: "translate(14px, -9px) scale(0.75)",
                "&.Mui-focused": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              shrink
            >
              Business Unit
            </InputLabel>
            <Select
              value={tempFilters.businessUnit || ""}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  businessUnit: e.target.value,
                }))
              }
              label="Business Unit"
              sx={{
                "& .MuiSelect-select": {
                  fontSize: "0.95rem",
                  py: 1.5,
                },
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ fontSize: "0.95rem" }}>Select Business Unit </em>
              </MenuItem>
              {businessUnits.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                backgroundColor: "white",
                px: 0.5,
                transform: "translate(14px, -9px) scale(0.75)",
                "&.Mui-focused": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              shrink
            >
              Department
            </InputLabel>
            <Select
              value={tempFilters.department || ""}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              label="Department"
              sx={{
                "& .MuiSelect-select": {
                  fontSize: "0.95rem",
                  py: 1.5,
                },
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ fontSize: "0.95rem" }}>Select Department </em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                backgroundColor: "white",
                px: 0.5,
                transform: "translate(14px, -9px) scale(0.75)",
                "&.Mui-focused": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              shrink
            >
              Recruiter
            </InputLabel>
            <Select
              value={tempFilters.recruiter || ""}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  recruiter: e.target.value,
                }))
              }
              label="Recruiter"
              sx={{
                "& .MuiSelect-select": {
                  fontSize: "0.95rem",
                  py: 1.5,
                },
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ fontSize: "0.95rem" }}>Select Recruiter </em>
              </MenuItem>
              {recruiters.map((recruiter) => (
                <MenuItem key={recruiter} value={recruiter}>
                  {recruiter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                backgroundColor: "white",
                px: 0.5,
                transform: "translate(14px, -9px) scale(0.75)",
                "&.Mui-focused": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              shrink
            >
              Location
            </InputLabel>
            <Select
              value={tempFilters.location || ""}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              label="Location"
              sx={{
                "& .MuiSelect-select": {
                  fontSize: "0.95rem",
                  py: 1.5,
                },
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ fontSize: "0.95rem" }}>Select Location </em>
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 3,
          pt: 2.5,
          borderTop: "2px solid #f1f5f9",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setTempFilters({});
            handleMobileFilterClear();
          }}
          sx={{
            py: 1.5,
            fontSize: "0.95rem",
            fontWeight: 500,
            borderRadius: 2,
            borderColor: "#cbd5e1",
            borderWidth: "1.5px",
            color: "#475569",
            "&:hover": {
              borderColor: "#2563eb",
              backgroundColor: "#f0f9ff",
              color: "#2563eb",
            },
          }}
        >
          Clear All
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleMobileFilterApply}
          sx={{
            py: 1.5,
            fontSize: "0.95rem",
            fontWeight: 500,
            borderRadius: 2,
            backgroundColor: "#2563eb",
            "&:hover": {
              backgroundColor: "#1e40af",
            },
          }}
        >
          Apply Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
        </Button>
      </Box>
    </Drawer>
  );

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: getMainContentWidth(),
        minHeight: "100vh",
        p: getContainerPadding(),
        ml: {
          xs: 0,
          sm: sidebarOpen ? "100px" : "65px",
          md: sidebarOpen ? "100px" : "65px",
        },
        transition: "margin-left 0.3s ease, width 0.3s ease",
        mt: { xs: 7, sm: 8, md: 9 },
        overflowX: "hidden",
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: isMobile ? "bottom" : "top",
          horizontal: isMobile ? "center" : "right",
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: isMobile ? 1 : 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            // Text and icon color - blue
            color: "#1976d2",

            // Hover effect - blue text with light grey background
            "&:hover": {
              backgroundColor: "#f5f5f5", // Light grey background on hover
              color: "#1565C0", // Slightly darker blue on hover
            },

            // Responsive styles
            fontSize: isMobile ? "0.9rem" : "1rem",
            fontWeight: 500,
            textTransform: "none",
            px: isMobile ? 1 : 2,
            py: isMobile ? 0.5 : 1,

            // Optional: smooth transition for hover effect
            transition: "all 0.2s ease",

            // Remove default background
            backgroundColor: "transparent",
          }}
        >
          Back
        </Button>
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
            All Candidates ({candidates.length})
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setBulkUploadOpen(true)}
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            Bulk Upload
          </Button>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="table" aria-label="table view">
              <TableViewIcon />
            </ToggleButton>
            <ToggleButton value="card" aria-label="card view">
              <CardViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Stages Summary */}
      <Card sx={{ mb: 2, overflow: "hidden", background: "#f8fafc" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box
            sx={{
              display: "flex",

              justifyContent: "space-between",
              gap: { xs: 1, sm: 2 },
              overflowX: "auto",
              py: { xs: 1, sm: 2 },
              px: { xs: 0.5, sm: 1 },
              "&::-webkit-scrollbar": {
                height: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f5f9",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#94a3b8",
                borderRadius: "4px",
              },
            }}
          >
            {stageCardData.map(({ stage, label, count, totalCount }) => (
              <Card
                key={stage}
                id={stage === "rejected" ? "rejected-card" : undefined}
                onClick={() => {
                  if (stage === "rejected") {
                    handleRejectedCardClick();
                  } else {
                    handleStageCardClick(stage);
                  }
                }}
                sx={{
                  backgroundColor:
                    (stage === "sourced" && !filters.status) ||
                    (stage !== "sourced" &&
                      filters.status.toLowerCase() === stage)
                      ? "#e3f2fd"
                      : "#f5f5f5",
                  minWidth: { xs: "110px", sm: "130px", md: "150px" },
                  textAlign: "center",
                  borderRadius: 2,
                  p: { xs: 1.5, sm: 2 },
                  boxShadow: 2,
                  flexShrink: 0,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ fontWeight: 600 }}
                >
                  {stage === "sourced" ? `${totalCount}` : count}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  {label}
                </Typography>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Rejected Filter */}
      {filters.status.toLowerCase() === "rejected" && (
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}>
              Rejection Type
            </InputLabel>
            <Select
              value={rejectedFilter}
              onChange={handleRejectedFilterChange}
              label="Rejection Type"
              sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
            >
              <MenuItem value="">
                <em style={{ fontSize: "0.85rem" }}>All Rejected</em>
              </MenuItem>
              {rejectionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <span style={{ fontSize: "0.85rem" }}>{type}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Filters - With labels in border left corner - WIDER VERSION */}
      {isMobile ? (
        // Mobile Filter Bar
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 1.5 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search jobs..."
                value={filters.searchQuery}
                onChange={handleFilterChange("searchQuery")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { fontSize: "0.85rem" },
                }}
              />
              <Badge badgeContent={getFilterCount()} color="primary">
                <IconButton
                  onClick={() => {
                    setTempFilters(filters);
                    setMobileFilterOpen(true);
                  }}
                  sx={{ border: "1px solid #ddd", borderRadius: 1 }}
                >
                  <FilterIcon />
                </IconButton>
              </Badge>
            </Box>
          </CardContent>
        </Card>
      ) : (
        // Desktop/Tablet Filters - WIDER VERSION with better space utilization
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            {/* Filter Row - 6 equal width items (5 filters + reset button) */}
            <Grid container spacing={2} alignItems="center">
              {/* Status Filter - Full width */}
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                      backgroundColor: "white",
                      px: 0.5,
                      transform: "translate(14px, -9px) scale(0.75)",
                      "&.Mui-focused": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                    shrink
                  >
                    Status
                  </InputLabel>
                  <Select
                    label="Status"
                    value={filters.status}
                    onChange={handleFilterChange("status")}
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      "& .MuiSelect-select": {
                        py: { xs: 1.2, sm: 1.4, md: 1.6 },
                      },
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem",
                            md: "0.95rem",
                          },
                        }}
                      >
                        Select Status{" "}
                      </em>
                    </MenuItem>
                    {stageOptions.map((option) => (
                      <MenuItem
                        key={option._id || option}
                        value={option.name || option}
                      >
                        {option.name || option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Business Unit Filter - Full width */}
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                      backgroundColor: "white",
                      px: 0.5,
                      transform: "translate(14px, -9px) scale(0.75)",
                      "&.Mui-focused": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                    shrink
                  >
                    Business Unit
                  </InputLabel>
                  <Select
                    label="Business Unit"
                    value={filters.businessUnit || ""}
                    onChange={handleFilterChange("businessUnit")}
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      "& .MuiSelect-select": {
                        py: { xs: 1.2, sm: 1.4, md: 1.6 },
                      },
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem",
                            md: "0.95rem",
                          },
                        }}
                      >
                        Select Business Unit{" "}
                      </em>
                    </MenuItem>
                    {businessUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Department Filter - Full width */}
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                      backgroundColor: "white",
                      px: 0.5,
                      transform: "translate(14px, -9px) scale(0.75)",
                      "&.Mui-focused": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                    shrink
                  >
                    Department
                  </InputLabel>
                  <Select
                    label="Department"
                    value={filters.department || ""}
                    onChange={handleFilterChange("department")}
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      "& .MuiSelect-select": {
                        py: { xs: 1.2, sm: 1.4, md: 1.6 },
                      },
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem",
                            md: "0.95rem",
                          },
                        }}
                      >
                        Select Department{" "}
                      </em>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Recruiter Filter - Full width */}
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                      backgroundColor: "white",
                      px: 0.5,
                      transform: "translate(14px, -9px) scale(0.75)",
                      "&.Mui-focused": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                    shrink
                  >
                    Recruiter
                  </InputLabel>
                  <Select
                    label="Recruiter"
                    value={filters.recruiter || ""}
                    onChange={handleFilterChange("recruiter")}
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      "& .MuiSelect-select": {
                        py: { xs: 1.2, sm: 1.4, md: 1.6 },
                      },
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem",
                            md: "0.95rem",
                          },
                        }}
                      >
                        Select Recruiter
                      </em>
                    </MenuItem>
                    {recruiters.map((recruiter) => (
                      <MenuItem key={recruiter} value={recruiter}>
                        {recruiter}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Location Filter - Full width */}
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                      backgroundColor: "white",
                      px: 0.5,
                      transform: "translate(14px, -9px) scale(0.75)",
                      "&.Mui-focused": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                    shrink
                  >
                    Location
                  </InputLabel>
                  <Select
                    label="Location"
                    value={filters.location || ""}
                    onChange={handleFilterChange("location")}
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      "& .MuiSelect-select": {
                        py: { xs: 1.2, sm: 1.4, md: 1.6 },
                      },
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem",
                            md: "0.95rem",
                          },
                        }}
                      >
                        Select Location{" "}
                      </em>
                    </MenuItem>
                    {locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Reset Button - Full width */}
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  fullWidth
                  size="medium"
                  sx={{
                    height: { xs: "44px", sm: "48px", md: "52px" },
                    ml: "70px",
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                    "&:hover": {
                      borderColor: "#b71c1c",
                      backgroundColor: "#ffebee",
                    },
                  }}
                  disabled={
                    Object.keys(filters).filter((k) => filters[k]).length === 0
                  }
                >
                  RESET ALL FILTERS
                </Button>
              </Grid>
            </Grid>

            {/* Search Row - Full width */}
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, email, phone, skills..."
                value={filters.searchQuery}
                onChange={handleFilterChange("searchQuery")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: {
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                    py: { xs: 0.5, sm: 0.8, md: 1 },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer />

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            p: 1.5,
            backgroundColor: "#f0f9ff",
            borderRadius: 2,
            border: "1px solid #bae6fd",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {selectedCandidates.length} candidate
            {selectedCandidates.length > 1 ? "s" : ""} selected
          </Typography>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>Bulk Actions</InputLabel>
            <Select
              label="Bulk Actions"
              defaultValue=""
              onChange={(e) => handleBulkAction(e.target.value)}
              sx={{ fontSize: "0.85rem" }}
            >
              <MenuItem value="email">
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Send email" />
              </MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
              <MenuItem value="move-to-sourced">
                <ListItemIcon>
                  <StageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Move to another Stage" />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Bulk Move Dialog */}
      <Dialog
        open={bulkMoveDialogOpen}
        onClose={() => setBulkMoveDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            m: isMobile ? 1 : 2,
            width: isMobile ? "calc(100% - 16px)" : "100%",
            maxWidth: isMobile ? "100%" : "sm",
          },
        }}
      >
        <DialogTitle>Move Selected Candidates to Another Stage</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>New Stage</InputLabel>
            <Select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              label="New Stage"
            >
              {stageOptions.map((option) => (
                <MenuItem
                  key={option._id || option}
                  value={option._id || option}
                >
                  {option.name || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkMoveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBulkStageMove}
            variant="contained"
            disabled={!newStage}
          >
            Move Candidates
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: isMobile ? 1 : 2,
            width: isMobile ? "calc(100% - 16px)" : "100%",
            maxWidth: isMobile ? "100%" : "md",
          },
        }}
      >
        <DialogTitle>Send Email to Selected Candidates</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            variant="outlined"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Email Body"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={isMobile ? 8 : 10}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontSize: "0.85rem" }}
          >
            This email will be sent to {selectedCandidates.length} selected
            candidates.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSendBulkEmail}
            variant="contained"
            disabled={isSendingEmail || !emailSubject || !emailBody}
            startIcon={isSendingEmail ? <CircularProgress size={20} /> : null}
          >
            {isSendingEmail ? "Sending..." : "Send Email"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interview Menu */}
      <Menu
        anchorEl={interviewAnchorEl}
        open={Boolean(interviewAnchorEl)}
        onClose={handleCloseInterviewMenu}
      >
        <MenuItem
          onClick={() => handleInterviewOption("online", currentCandidate)}
        >
          <ListItemText primary="Schedule Online Interview" />
        </MenuItem>
        <MenuItem
          onClick={() => handleInterviewOption("offline", currentCandidate)}
        >
          <ListItemText primary="Schedule Offline Interview" />
        </MenuItem>
      </Menu>

      {/* Stage Menu */}
      <Menu
        anchorEl={stageAnchorEl}
        open={Boolean(stageAnchorEl)}
        onClose={handleCloseStageMenu}
      >
        <MenuItem
          onClick={() => {
            setMoveDialogOpen(true);
            handleCloseStageMenu();
          }}
        >
          <ListItemText primary="Move to Another Stage" />
        </MenuItem>
      </Menu>

      {/* Remarks Menu */}
      <Menu
        anchorEl={remarksAnchorEl}
        open={Boolean(remarksAnchorEl)}
        onClose={handleCloseRemarksMenu}
      >
        <MenuItem onClick={handleAddRemarks}>
          <ListItemIcon>
            <RemarksIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add Remarks" />
        </MenuItem>
      </Menu>

      <Dialog
        open={remarksDialogOpen}
        onClose={() => setRemarksDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            m: isMobile ? 1 : 2,
            width: isMobile ? "calc(100% - 16px)" : "100%",
            maxWidth: isMobile ? "100%" : "sm",
          },
        }}
      >
        <DialogTitle>Add Remarks</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="remarks"
            label="Remarks"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={remarksText}
            onChange={(e) => setRemarksText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarksDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitRemarks}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Resume Analysis Dialog */}
      <Dialog
        open={analysisDialogOpen}
        onClose={() => setAnalysisDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: { xs: 0, sm: 3 },
            maxHeight: "90vh",
            m: isMobile ? 0 : 2,
            width: isMobile ? "100%" : "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: { xs: "12px 16px", sm: "16px 24px" },
          }}
        >
          <Box display="flex" alignItems="center">
            <AnalysisIcon sx={{ mr: 1 }} />
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              component="div"
              sx={{ fontWeight: 600 }}
            >
              Resume Analysis - {selectedCandidateForAnalysis?.firstName}{" "}
              {selectedCandidateForAnalysis?.lastName}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setAnalysisDialogOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {analysisLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <CandidateResumeAnalysis
              open={analysisDialogOpen}
              onClose={() => setAnalysisDialogOpen(false)}
              candidate={selectedCandidateForAnalysis}
              analysisData={analysisData}
              loading={analysisLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onUploadComplete={handleBulkUploadComplete}
      />

      {/* Candidate Views */}
      {viewMode === "table" ? (
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "& .MuiTable-root": {
              minWidth: {
                xs: "100%", // Mobile pe full width
                sm: "100%", // Tablet pe full width
                md: "100%", // Desktop pe full width
              },
            },
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={handleSelectAllCandidates}
                    checked={
                      selectedCandidates.length === filteredCandidates.length &&
                      filteredCandidates.length > 0
                    }
                    sx={{ color: "#3f51b5" }}
                  />
                </TableCell>

                {[
                  "Name",
                  "Status",
                  "Email",
                  "Phone",
                  "Skills",
                  "Recruiter",
                  "Vendor",
                  "Actions",
                ].map((label, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                      color: "#333",
                      borderBottom: "2px solid #e0e0e0",
                      whiteSpace: "nowrap",
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow
                  key={candidate._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleNavigateToCandidate(candidate)}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedCandidates.includes(candidate._id)}
                      onChange={() => handleSelectCandidate(candidate._id)}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        }}
                      >
                        {`${candidate.firstName || ""} ${candidate.middleName || ""} ${candidate.lastName || ""}`.trim()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        }}
                      >
                        {candidate.experience || "0"} yrs •{" "}
                        {candidate.availableToJoin || "0"} days
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        }}
                      >
                        {typeof candidate.source === "string"
                          ? candidate.source
                          : candidate.source?.name || "Unknown"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <ErrorBoundary>
                      <Box>
                        {(() => {
                          try {
                            const stageName = String(
                              getStageName(candidate?.stage || "Sourced"),
                            );
                            const rejectionType = candidate?.rejectionType
                              ? String(candidate.rejectionType)
                              : null;

                            return (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                  }}
                                >
                                  {stageName}
                                </Typography>
                                {stageName === "Rejected" && rejectionType && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text.secondary",
                                      mt: 0.5,
                                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                    }}
                                  >
                                    {rejectionType}
                                  </Typography>
                                )}
                              </>
                            );
                          } catch (error) {
                            console.error("Error rendering stage:", error);
                            return (
                              <Typography
                                color="error"
                                sx={{ fontSize: "0.8rem" }}
                              >
                                Error
                              </Typography>
                            );
                          }
                        })()}
                      </Box>
                    </ErrorBoundary>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {candidate.email || "Not provided"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" } }}
                    >
                      {candidate.mobile || "Not provided"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Tooltip title={formatSkills(candidate.skills)}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: { xs: 100, sm: 120, md: 150 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        }}
                      >
                        {formatSkills(candidate.skills)}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" } }}
                    >
                      {getRecruiterName(candidate.owner)}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" } }}
                    >
                      {getVendorName(candidate)}
                    </Typography>
                  </TableCell>

                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 0.5,
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<AnalysisIcon />}
                        onClick={() => handleOpenAnalysis(candidate._id)}
                        disabled={!candidate.resume}
                        size="small"
                        sx={{
                          fontSize: { xs: "0.65rem", sm: "0.7rem" },
                          padding: { xs: "2px 4px", sm: "4px 8px" },
                          minWidth: { xs: "60px", sm: "70px" },
                        }}
                      >
                        Analysis
                      </Button>
                      <Box sx={{ display: "flex", gap: 0.25 }}>
                        <IconButton
                          onClick={(e) =>
                            handleInterviewClick(e, candidate._id)
                          }
                          size="small"
                          sx={{ padding: { xs: "2px", sm: "4px" } }}
                        >
                          <InterviewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleStageClick(e, candidate._id)}
                          size="small"
                          sx={{ padding: { xs: "2px", sm: "4px" } }}
                        >
                          <StageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleRemarksClick(e, candidate._id)}
                          size="small"
                          sx={{ padding: { xs: "2px", sm: "4px" } }}
                        >
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: getCardGridColumns(),
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate._id}
              sx={{
                borderRadius: 3,
                boxShadow: 6,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                ":hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 12,
                },
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor: "background.paper",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1.5, sm: 2 },
                  padding: { xs: 1.5, sm: 2 },
                }}
              >
                {/* Header: Name, Avatar, and Checkbox */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Checkbox
                    checked={selectedCandidates.includes(candidate._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectCandidate(candidate._id);
                    }}
                    color="primary"
                    sx={{ padding: 0 }}
                    size="small"
                  />
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      fontWeight: "bold",
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                    }}
                    onClick={() => handleNavigateToCandidate(candidate)}
                  >
                    {candidate.firstName?.charAt(0) || "?"}
                  </Avatar>
                  <Box
                    sx={{ flex: 1 }}
                    onClick={() => handleNavigateToCandidate(candidate)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {`${candidate.firstName || ""} ${candidate.lastName || ""}`.trim()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      }}
                    >
                      {candidate.experience || "0"} years •{" "}
                      {candidate.availableToJoin || "0"} days
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{ color: "text.secondary" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemarksClick(e, candidate._id);
                    }}
                    size="small"
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Status Chip */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={getStageName(candidate.stage)}
                    color={
                      getStageName(candidate.stage) === "Hired"
                        ? "success"
                        : getStageName(candidate.stage) === "Archived"
                          ? "default"
                          : "primary"
                    }
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      height: { xs: 20, sm: 24 },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    }}
                  >
                    {typeof candidate.source === "string"
                      ? candidate.source
                      : candidate.source?.name || "Unknown"}
                  </Typography>
                </Box>

                {/* Rejection Details */}
                {getStageName(candidate.stage) === "Rejected" &&
                  candidate.rejectionType && (
                    <Box
                      sx={{
                        backgroundColor: "#ffeeee",
                        p: 1,
                        borderRadius: 1,
                        borderLeft: "3px solid #f44336",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        }}
                      >
                        {candidate.rejectionType}
                      </Typography>
                      {candidate.rejectionReason && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mt: 0.5,
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                          }}
                        >
                          {candidate.rejectionReason}
                        </Typography>
                      )}
                    </Box>
                  )}

                {/* Contact Info */}
                <Box
                  onClick={() => handleNavigateToCandidate(candidate)}
                  sx={{ mt: 0.5 }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <EmailIcon
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: "text.secondary",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        color: "text.primary",
                        wordBreak: "break-word",
                      }}
                    >
                      {candidate.email || "Not provided"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: "text.secondary",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        color: "text.primary",
                      }}
                    >
                      {candidate.mobile || "Not provided"}
                    </Typography>
                  </Stack>
                </Box>

                {/* Skills */}
                <Box onClick={() => handleNavigateToCandidate(candidate)}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    }}
                  >
                    Skills:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {formatSkills(candidate.skills)}
                  </Typography>
                </Box>

                {/* Recruiter and Vendor Info */}
                <Box onClick={() => handleNavigateToCandidate(candidate)}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: "500",
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    }}
                  >
                    <strong>Recruiter:</strong>{" "}
                    {getRecruiterName(candidate.owner)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: "500",
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    }}
                  >
                    <strong>Vendor:</strong> {getVendorName(candidate)}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 1,
                    gap: 1,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="contained"
                    startIcon={<AnalysisIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAnalysis(candidate._id);
                    }}
                    disabled={!candidate.resume}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      backgroundColor: "#4caf50",
                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                      padding: { xs: "2px 4px", sm: "4px 8px" },
                      minWidth: { xs: "70px", sm: "90px" },
                      "&:hover": {
                        backgroundColor: "#388e3c",
                      },
                    }}
                  >
                    Analysis
                  </Button>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInterviewClick(e, candidate._id);
                    }}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      borderRadius: "50%",
                      padding: { xs: 0.5, sm: 1 },
                      ":hover": { backgroundColor: "primary.dark" },
                      transition: "background-color 0.2s ease",
                    }}
                    size="small"
                  >
                    <InterviewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStageClick(e, candidate._id);
                    }}
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "white",
                      borderRadius: "50%",
                      padding: { xs: 0.5, sm: 1 },
                      ":hover": { backgroundColor: "secondary.dark" },
                      transition: "background-color 0.2s ease",
                    }}
                    size="small"
                  >
                    <StageIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {openDetailsDialog && (
        <CandidateDetailsPage
          open={openDetailsDialog}
          onClose={handleCloseDetails}
          candidate={selectedCandidate}
        />
      )}
    </Box>
  );
};
