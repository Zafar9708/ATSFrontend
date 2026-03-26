import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Card,
  Tooltip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Paper,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessCircleIcon,
  MarkEmailRead as MailSentIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Visibility as ViewIcon,
  VideoCall as InterviewIcon,
  GroupWork as VendorIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  AccountBalance as BankIcon,
  LinkedIn as LinkedInIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Link as LinkIcon,
  PersonSearch as CandidateIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon, // ✅ ADDED missing import
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import adminService from "../../services/adminService";
import { inviteVendor } from "../../services/Vendor/vendorService";
import VendorForm from "./VendorForm";
import RecruiterForm from "../../components/RecruitForm";
import CandidatePipelineChart from "../../components/Admin/CandidatePie";

// ==================== CONSTANTS & THEME ====================
const THEME = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  border: "#e2e8f0",
  primary: "#1e40af",
  primaryM: "#2563eb",
  primaryL: "#eff6ff",
  text: "#0f172a",
  textSub: "#475569",
  textMuted: "#94a3b8",
  success: "#059669",
  successBg: "#ecfdf5",
  warning: "#d97706",
  warningBg: "#fffbeb",
  danger: "#dc2626",
  dangerBg: "#fef2f2",
  info: "#0284c7",
  infoBg: "#f0f9ff",
  purple: "#7c3aed",
  purpleBg: "#faf5ff",
  indigo: "#4f46e5",
  indigoL: "#eef2ff",
  emerald: "#10b981",
  emeraldL: "#d1fae5",
  rose: "#f43f5e",
  roseL: "#ffe4e6",
  amber: "#f59e0b",
  amberL: "#fef3c7",
  sky: "#0ea5e9",
  skyL: "#e0f2fe",
};

const PALETTE = ["#2563eb", "#059669", "#7c3aed", "#d97706", "#dc2626", "#0284c7", "#be185d"];
const getAvatarColor = (str = "") => PALETTE[str.charCodeAt(0) % PALETTE.length];

// ==================== HELPER FUNCTIONS ====================
const formatCurrency = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "—");
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

// ==================== STAT CARD COMPONENT ====================
const StatCard = ({ label, value, sub, icon, color, bg }) => (
  <Card
    sx={{
      borderRadius: "16px",
      border: `1px solid ${THEME.border}`,
      background: THEME.surface,
      overflow: "hidden",
      position: "relative",
      transition: "transform 0.15s, box-shadow 0.15s",
      "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,.09)" },
    }}
  >
    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
    <Box sx={{ pt: 2.5, pb: 2, px: { xs: 2, sm: 2.5 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 800, color: THEME.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}
        </Typography>
        <Box sx={{ width: 40, height: 40, borderRadius: "11px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
          {icon}
        </Box>
      </Box>
      <Typography sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 900, color: THEME.text, lineHeight: 1, mb: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: THEME.textMuted, fontWeight: 500 }}>{sub}</Typography>
    </Box>
  </Card>
);

// ==================== VIEW DIALOGS ====================
const RecruiterViewDialog = ({ open, onClose, recruiter, onEdit, onDelete }) => {
  if (!recruiter) return null;
  const fullName = `${recruiter.firstName || ""} ${recruiter.lastName || ""}`.trim();
  const avatarColor = getAvatarColor(recruiter.firstName || "");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", p: 0, maxHeight: "92vh" } }}>
      <Box sx={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`, px: 3, pt: 3, pb: 2.5, position: "relative" }}>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: 10, right: 10, color: "rgba(255,255,255,.8)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "rgba(255,255,255,.25)", fontSize: 20, fontWeight: 800, border: "2px solid rgba(255,255,255,.4)" }}>
            {fullName.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>{fullName}</Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,.82)" }}>{recruiter.email}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
              <Chip label={recruiter.isActive ? "Active" : "Inactive"} size="small"
                sx={{ fontSize: 10, fontWeight: 700, bgcolor: recruiter.isActive ? "rgba(16,185,129,.25)" : "rgba(244,63,94,.25)", color: "#fff" }} />
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 1.5, overflowY: "auto", maxHeight: "calc(92vh - 200px)" }}>
        <DetailSection title="Personal Info" icon={<PhoneIcon />} accent={THEME.primaryM}>
          <DetailRow icon={<PhoneIcon />} label="Phone" value={recruiter.phoneNumber} accent={THEME.primaryM} />
          <DetailRow icon={<LocationIcon />} label="Location" value={recruiter.location} accent={THEME.primaryM} />
          {recruiter.linkedIn && <DetailRow icon={<LinkedInIcon />} label="LinkedIn" value={recruiter.linkedIn} accent={THEME.primaryM} />}
        </DetailSection>
        <DetailSection title="Work Details" icon={<BusinessIcon />} accent={THEME.emerald}>
          <DetailRow icon={<BusinessIcon />} label="Department" value={recruiter.department} accent={THEME.emerald} />
          <DetailRow icon={<BadgeIcon />} label="Employment Type" value={recruiter.employmentType} accent={THEME.emerald} />
          <DetailRow icon={<StarIcon />} label="Specialisation" value={recruiter.specialisation} accent={THEME.emerald} />
          <DetailRow icon={<BadgeIcon />} label="Experience" value={recruiter.experience ? `${recruiter.experience} years` : "—"} accent={THEME.emerald} />
        </DetailSection>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${THEME.border}`, display: "flex", gap: 1.5 }}>
        <Button fullWidth onClick={onClose} variant="outlined" sx={{ borderRadius: "10px" }}>Close</Button>
        <Button fullWidth onClick={onDelete} variant="outlined" sx={{ borderRadius: "10px", borderColor: THEME.danger, color: THEME.danger }}>Delete</Button>
        <Button fullWidth onClick={onEdit} variant="contained" sx={{ borderRadius: "10px", bgcolor: THEME.primaryM }}>Edit</Button>
      </Box>
    </Dialog>
  );
};

const DetailRow = ({ icon, label, value, accent }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1, borderBottom: `1px solid ${THEME.border}` }}>
    <Box sx={{ p: 0.5, borderRadius: "6px", bgcolor: `${accent}14`, flexShrink: 0 }}>
      {React.cloneElement(icon, { sx: { fontSize: 13, color: accent } })}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: 10, color: THEME.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: THEME.text, fontWeight: 500 }}>{value || "—"}</Typography>
    </Box>
  </Box>
);

const DetailSection = ({ title, icon, accent, children }) => (
  <>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 0.5 }}>
      <Box sx={{ width: 3, height: 14, borderRadius: 2, bgcolor: accent }} />
      <Typography sx={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: "uppercase" }}>{title}</Typography>
    </Box>
    {children}
  </>
);

const CandidateViewDialog = ({ open, onClose, candidate }) => {
  if (!candidate) return null;
  const name = candidate.fullName || `${candidate.firstName} ${candidate.lastName}`.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", p: 0, maxHeight: "92vh" } }}>
      <Box sx={{ background: `linear-gradient(135deg, ${getAvatarColor(name)}, ${getAvatarColor(name)}cc)`, px: 3, pt: 3, pb: 2.5 }}>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: 10, right: 10, color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: "rgba(255,255,255,.25)", fontSize: 18, fontWeight: 800 }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>{name}</Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,.82)" }}>{candidate.email}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 1.5, overflowY: "auto", maxHeight: "calc(92vh - 180px)" }}>
        <DetailSection title="Contact & Location" icon={<PhoneIcon />} accent={THEME.primaryM}>
          <DetailRow icon={<PhoneIcon />} label="Mobile" value={candidate.mobile} accent={THEME.primaryM} />
          <DetailRow icon={<LocationIcon />} label="Current Location" value={candidate.currentLocation?.name} accent={THEME.primaryM} />
        </DetailSection>
        <DetailSection title="Professional" icon={<BadgeIcon />} accent={THEME.emerald}>
          <DetailRow icon={<BadgeIcon />} label="Experience" value={candidate.experience} accent={THEME.emerald} />
          <DetailRow icon={<WorkIcon />} label="Applied Job" value={candidate.jobId?.jobTitle} accent={THEME.emerald} />
        </DetailSection>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${THEME.border}` }}>
        <Button fullWidth onClick={onClose} variant="outlined" sx={{ borderRadius: "10px" }}>Close</Button>
      </Box>
    </Dialog>
  );
};

const VendorViewDialog = ({ open, onClose, vendor, onDelete }) => {
  if (!vendor) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", p: 0, maxHeight: "92vh" } }}>
      <Box sx={{ background: `linear-gradient(135deg, ${THEME.purple}, #4c1d95)`, px: 3, pt: 3, pb: 2.5 }}>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: 10, right: 10, color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: "rgba(255,255,255,.25)", fontSize: 18, fontWeight: 800 }}>
            {vendor.companyName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>{vendor.companyName}</Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,.82)" }}>{vendor.companyEmail}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 1.5, overflowY: "auto", maxHeight: "calc(92vh - 190px)" }}>
        <DetailSection title="Company Info" icon={<BusinessIcon />} accent={THEME.purple}>
          <DetailRow icon={<PhoneIcon />} label="Phone" value={vendor.companyPhone} accent={THEME.purple} />
          <DetailRow icon={<LanguageIcon />} label="Website" value={vendor.website} accent={THEME.purple} />
          <DetailRow icon={<BusinessIcon />} label="Industry" value={vendor.industry} accent={THEME.purple} />
          <DetailRow icon={<LocationIcon />} label="Address" value={vendor.companyAddress} accent={THEME.purple} />
        </DetailSection>
        <DetailSection title="Contact Person" icon={<PersonIcon />} accent={THEME.emerald}>
          <DetailRow icon={<PersonIcon />} label="Name" value={`${vendor.firstName || ""} ${vendor.lastName || ""}`.trim()} accent={THEME.emerald} />
          <DetailRow icon={<EmailIcon />} label="Email" value={vendor.email} accent={THEME.emerald} />
          <DetailRow icon={<PhoneIcon />} label="Phone" value={vendor.phone} accent={THEME.emerald} />
        </DetailSection>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${THEME.border}`, display: "flex", gap: 1.5 }}>
        <Button fullWidth onClick={onClose} variant="outlined" sx={{ borderRadius: "10px" }}>Close</Button>
        <Button fullWidth onClick={onDelete} variant="outlined" sx={{ borderRadius: "10px", borderColor: THEME.danger, color: THEME.danger }}>Delete</Button>
      </Box>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ open, onClose, onConfirm, name }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{ sx: { borderRadius: "18px", overflow: "hidden", p: 0 } }}>
    <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${THEME.border}`, display: "flex", alignItems: "center", gap: 1.2 }}>
      <Box sx={{ p: 0.8, borderRadius: "10px", bgcolor: THEME.dangerBg }}>
        <DeleteIcon sx={{ color: THEME.danger, fontSize: 20 }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Confirm Delete</Typography>
    </Box>
    <Box sx={{ px: 3, py: 2.5 }}>
      <Typography>Permanently delete <b>{name}</b>?</Typography>
      <Box sx={{ mt: 1.5, p: 1.5, borderRadius: "10px", bgcolor: THEME.dangerBg }}>
        <Typography sx={{ fontSize: 12, color: THEME.danger }}>⚠ This cannot be undone.</Typography>
      </Box>
    </Box>
    <Box sx={{ px: 3, pb: 3, display: "flex", gap: 1 }}>
      <Button fullWidth onClick={onClose} variant="outlined">Cancel</Button>
      <Button fullWidth onClick={onConfirm} variant="contained" sx={{ bgcolor: THEME.danger }}>Delete</Button>
    </Box>
  </Dialog>
);

// ==================== MAIN COMPONENT ====================
const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Dialog states
  const [recruiterDialog, setRecruiterDialog] = useState(false);
  const [vendorDialog, setVendorDialog] = useState(false);
  const [recruiterView, setRecruiterView] = useState(null);
  const [candidateView, setCandidateView] = useState(null);
  const [vendorView, setVendorView] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [vendorSaving, setVendorSaving] = useState(false);
  const [vendorSuccess, setVendorSuccess] = useState(false);
  const [savedVendorEmail, setSavedVendorEmail] = useState("");

  // Empty form templates
  const emptyRecruiter = {
    firstName: "", lastName: "", email: "", phoneNumber: "", username: "", location: "",
    linkedIn: "", designation: "", department: "", employmentType: "", experience: "",
    specialisation: "", secondarySkill: "", joiningDate: "", password: "", confirmPassword: "",
    profilePicture: null, profilePreviewUrl: null, customNotes: [],
  };

  const emptyVendor = {
    companyName: "", vendorType: "", industry: "", website: "", companyEmail: "", companyPhone: "",
    gstNumber: "", companyPan: "", registrationNumber: "", companyAddress: "", firstName: "",
    lastName: "", designation: "", email: "", phone: "", aadharNumber: "", panNumber: "",
    bankName: "", accountHolderName: "", accountNumber: "", ifscCode: "", branch: "",
    billingCycle: "", paymentTerms: "", contractStartDate: "", contractEndDate: "",
    creditLimit: "", serviceCharge: "", customNotes: [],
  };

  const [recruiterForm, setRecruiterForm] = useState(emptyRecruiter);
  const [recruiterFormErrors, setRecruiterFormErrors] = useState({});
  const [vendorForm, setVendorForm] = useState(emptyVendor);
  const [vendorFormErrors, setVendorFormErrors] = useState({});

  // Toast helper
  const showToast = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Fetch all data
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };

      const [rRes, jRes, cRes, iRes, vRes] = await Promise.allSettled([
        adminService.getRecruiters(),
        adminService.getAllJobs(),
        fetch("/api/v1/candidates", { headers }).then(res => res.json()),
        fetch("/api/online-interviews", { headers }).then(res => res.json()),
        fetch("/api/admin/vendors", { headers }).then(res => res.json()),
      ]);

      if (rRes.status === "fulfilled") setRecruiters(rRes.value?.recruiters || rRes.value?.recuiter || []);
      if (jRes.status === "fulfilled") setJobs(jRes.value?.jobs || []);
      if (cRes.status === "fulfilled") setCandidates(cRes.value?.candidates || []);
      if (iRes.status === "fulfilled") setInterviews(iRes.value?.data || []);
      if (vRes.status === "fulfilled") setVendors(vRes.value?.vendors || []);
    } catch (error) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Computed values
  const activeJobs = useMemo(() => jobs.filter(j => j.status === "Active"), [jobs]);
  const activeRecruiters = useMemo(() => recruiters.filter(r => r.isActive), [recruiters]);
  const activeVendors = useMemo(() => vendors.filter(v => v.isActive), [vendors]);
  const scheduledInterviews = useMemo(() => interviews.filter(i => i.status === "scheduled"), [interviews]);

  // Get user name from token
  const userName = useMemo(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.firstName || payload.name || payload.username || payload.email?.split("@")[0] || "";
    } catch { return ""; }
  }, []);

  // Handlers
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll();
  }, [fetchAll]);

  const handleAddRecruiter = useCallback(() => {
    setEditingId(null);
    setRecruiterForm(emptyRecruiter);
    setRecruiterFormErrors({});
    setSaveSuccess(false);
    setSavedEmail("");
    setRecruiterDialog(true);
  }, []);

  const handleEditRecruiter = useCallback((recruiter) => {
    setEditingId(recruiter._id);
    setRecruiterForm({
      ...emptyRecruiter,
      firstName: recruiter.firstName || "",
      lastName: recruiter.lastName || "",
      email: recruiter.email || "",
      phoneNumber: recruiter.phoneNumber || "",
      username: recruiter.username || "",
      location: recruiter.location || "",
      linkedIn: recruiter.linkedIn || "",
      designation: recruiter.designation || "",
      department: recruiter.department || "",
      employmentType: recruiter.employmentType || "",
      experience: String(recruiter.experience || ""),
      specialisation: recruiter.specialisation || "",
      secondarySkill: recruiter.secondarySkill || "",
      joiningDate: recruiter.joiningDate || "",
      profilePreviewUrl: recruiter.profilePicture || null,
      customNotes: recruiter.customNotes || [],
    });
    setRecruiterFormErrors({});
    setSaveSuccess(false);
    setRecruiterView(null);
    setRecruiterDialog(true);
  }, []);

  const handleSaveRecruiter = useCallback(async () => {
    // Validation
    const errors = {};
    if (!recruiterForm.firstName.trim()) errors.firstName = "Required";
    if (!recruiterForm.lastName.trim()) errors.lastName = "Required";
    if (!recruiterForm.email.trim()) errors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recruiterForm.email)) errors.email = "Invalid email";
    if (!recruiterForm.phoneNumber.trim()) errors.phoneNumber = "Required";
    if (!recruiterForm.username.trim()) errors.username = "Required";
    if (!editingId) {
      if (!recruiterForm.password) errors.password = "Required";
      else if (recruiterForm.password.length < 8) errors.password = "Min 8 characters";
      if (recruiterForm.password !== recruiterForm.confirmPassword) errors.confirmPassword = "Passwords do not match";
    }
    setRecruiterFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Please fill required fields", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: recruiterForm.firstName.trim(),
        lastName: recruiterForm.lastName.trim(),
        email: recruiterForm.email.trim(),
        phoneNumber: recruiterForm.phoneNumber.trim(),
        username: recruiterForm.username.trim(),
        location: recruiterForm.location?.trim() || undefined,
        linkedIn: recruiterForm.linkedIn?.trim() || undefined,
        designation: recruiterForm.designation?.trim() || undefined,
        department: recruiterForm.department || undefined,
        employmentType: recruiterForm.employmentType || undefined,
        experience: recruiterForm.experience ? Number(recruiterForm.experience) : undefined,
        specialisation: recruiterForm.specialisation || undefined,
        secondarySkill: recruiterForm.secondarySkill?.trim() || undefined,
        joiningDate: recruiterForm.joiningDate || undefined,
        customNotes: recruiterForm.customNotes?.length ? recruiterForm.customNotes : undefined,
      };
      if (recruiterForm.password) payload.password = recruiterForm.password;
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      await adminService.addRecruiter(payload);
      setSavedEmail(recruiterForm.email);
      setSaveSuccess(true);
      fetchAll();
    } catch (error) {
      showToast(error.response?.data?.message || "Error saving recruiter", "error");
    } finally {
      setSaving(false);
    }
  }, [recruiterForm, editingId, showToast, fetchAll]);

  const handleDeleteRecruiter = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteRecruiter(deleteTarget.id);
      setDeleteTarget(null);
      fetchAll();
      showToast("Recruiter deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  }, [deleteTarget, fetchAll, showToast]);

  const handleResendEmail = useCallback(async (id) => {
    try {
      await adminService.resendWelcomeEmail(id);
      showToast("Welcome email resent!");
    } catch {
      showToast("Failed to resend email", "error");
    }
  }, [showToast]);

  const handleAddVendor = useCallback(() => {
    setVendorForm(emptyVendor);
    setVendorFormErrors({});
    setVendorSuccess(false);
    setSavedVendorEmail("");
    setVendorDialog(true);
  }, []);

  const handleRegisterVendor = useCallback(async () => {
    // Validation
    const errors = {};
    if (!vendorForm.companyName.trim()) errors.companyName = "Required";
    if (!vendorForm.vendorType) errors.vendorType = "Required";
    if (!vendorForm.industry) errors.industry = "Required";
    if (!vendorForm.companyEmail.trim()) errors.companyEmail = "Required";
    if (!vendorForm.companyPhone.trim()) errors.companyPhone = "Required";
    if (!vendorForm.companyAddress.trim()) errors.companyAddress = "Required";
    if (!vendorForm.firstName.trim()) errors.firstName = "Required";
    if (!vendorForm.lastName.trim()) errors.lastName = "Required";
    if (!vendorForm.email.trim()) errors.email = "Required";
    if (!vendorForm.phone.trim()) errors.phone = "Required";
    if (!vendorForm.aadharNumber.trim()) errors.aadharNumber = "Required";
    if (!vendorForm.panNumber.trim()) errors.panNumber = "Required";
    if (!vendorForm.bankName.trim()) errors.bankName = "Required";
    if (!vendorForm.accountHolderName.trim()) errors.accountHolderName = "Required";
    if (!vendorForm.accountNumber.trim()) errors.accountNumber = "Required";
    if (!vendorForm.ifscCode.trim()) errors.ifscCode = "Required";
    if (!vendorForm.billingCycle) errors.billingCycle = "Required";
    if (!vendorForm.paymentTerms) errors.paymentTerms = "Required";
    if (!vendorForm.contractStartDate) errors.contractStartDate = "Required";
    if (!vendorForm.contractEndDate) errors.contractEndDate = "Required";
    setVendorFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Please fill required fields", "warning");
      return;
    }

    setVendorSaving(true);
    try {
      const payload = {
        companyName: vendorForm.companyName.trim(),
        vendorType: vendorForm.vendorType,
        industry: vendorForm.industry,
        website: vendorForm.website?.trim() || undefined,
        companyEmail: vendorForm.companyEmail.trim(),
        companyPhone: vendorForm.companyPhone.trim(),
        companyAddress: vendorForm.companyAddress.trim(),
        gstNumber: vendorForm.gstNumber?.trim() || undefined,
        companyPan: vendorForm.companyPan?.trim() || undefined,
        registrationNumber: vendorForm.registrationNumber?.trim() || undefined,
        firstName: vendorForm.firstName.trim(),
        lastName: vendorForm.lastName.trim(),
        designation: vendorForm.designation?.trim() || undefined,
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        aadharNumber: vendorForm.aadharNumber.trim(),
        panNumber: vendorForm.panNumber.trim(),
        bankName: vendorForm.bankName.trim(),
        accountHolderName: vendorForm.accountHolderName.trim(),
        accountNumber: vendorForm.accountNumber.trim(),
        ifscCode: vendorForm.ifscCode.trim(),
        branch: vendorForm.branch?.trim() || undefined,
        billingCycle: vendorForm.billingCycle,
        paymentTerms: vendorForm.paymentTerms,
        contractStartDate: vendorForm.contractStartDate,
        contractEndDate: vendorForm.contractEndDate,
        creditLimit: vendorForm.creditLimit ? Number(vendorForm.creditLimit) : undefined,
        serviceCharge: vendorForm.serviceCharge ? Number(vendorForm.serviceCharge) : undefined,
        customNotes: vendorForm.customNotes?.length ? vendorForm.customNotes : undefined,
      };
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      await inviteVendor(payload);
      setSavedVendorEmail(vendorForm.companyEmail);
      setVendorSuccess(true);
      fetchAll();
      showToast("Vendor registered!");
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Error registering vendor", "error");
    } finally {
      setVendorSaving(false);
    }
  }, [vendorForm, showToast, fetchAll]);

  // Loading state
  if (loading && !refreshing) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 2 }}>
        <CircularProgress size={56} thickness={4} />
        <Typography sx={{ color: THEME.textSub }}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  // Stat cards data
  const statCards = [
    { label: "Total Recruiters", value: recruiters.length, sub: `${activeRecruiters.length} active`, icon: <PeopleIcon />, color: THEME.primaryM, bg: THEME.primaryL },
    { label: "Candidates", value: candidates.length, sub: "Across all jobs", icon: <CandidateIcon />, color: THEME.success, bg: THEME.successBg },
    { label: "Active Jobs", value: activeJobs.length, sub: `${jobs.length} total jobs`, icon: <WorkIcon />, color: THEME.info, bg: THEME.infoBg },
    { label: "Interviews", value: interviews.length, sub: `${scheduledInterviews.length} scheduled`, icon: <InterviewIcon />, color: THEME.warning, bg: THEME.warningBg },
    { label: "Vendors", value: vendors.length, sub: `${activeVendors.length} active`, icon: <VendorIcon />, color: THEME.purple, bg: THEME.purpleBg },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        sx={{ 
          width: "90%", 
          maxWidth: "90%",
          overflowX: "hidden",
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          mt: { xs: 7, sm: 8, md: 6 }, 
          boxSizing: "border-box",
          // ✅ Add this to prevent any child from causing overflow
          "& > *": { maxWidth: "100%" }
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3.5 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: { xs: 20, sm: 24, md: 28 }, fontWeight: 900, color: THEME.text }}>
                {userName ? `Welcome back, ${userName}` : "Welcome to Dashboard"}
              </Typography>
              <Box sx={{ fontSize: 28 }}>👋</Box>
            </Box>
            <Typography sx={{ fontSize: 13, color: THEME.textMuted, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <DashboardIcon sx={{ fontSize: 16, color: THEME.primaryM }} />
              <Box component="span">Manage recruiters, candidates, interviews, vendors, and jobs</Box>
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Tooltip title="Refresh dashboard data">
              <IconButton onClick={handleRefresh} disabled={refreshing} sx={{ borderRadius: "10px", bgcolor: THEME.surface, border: `1px solid ${THEME.border}` }}>
                <RefreshIcon sx={{ fontSize: 18, color: THEME.primaryM }} />
              </IconButton>
            </Tooltip>

            <Button onClick={handleAddRecruiter} startIcon={<AddIcon />} variant="contained" size="small" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, bgcolor: THEME.primaryM, whiteSpace: "nowrap" }}>
              {isMobile ? "Recruiter" : "Add Recruiter"}
            </Button>

            <Button onClick={handleAddVendor} startIcon={<VendorIcon />} variant="contained" size="small" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, bgcolor: THEME.purple, whiteSpace: "nowrap" }}>
              {isMobile ? "Vendor" : "Add Vendor"}
            </Button>

            <Button onClick={() => navigate("/dashboard/jobs/createJob")} startIcon={<WorkIcon />} variant="outlined" size="small" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}>
              {isMobile ? "Job" : "Create Job"}
            </Button>
          </Stack>
        </Box>

        {/* Stat Cards - ✅ Fixed grid to prevent overflow */}
        <Grid 
          container 
          spacing={{ xs: 1.5, sm: 2 }} 
          sx={{ 
            mb: 2.5,
            width: "100%",
            margin: 0,
            "& > .MuiGrid-item": { paddingLeft: { xs: 0.75, sm: 1 } }
          }}
        >
          {statCards.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={2.4}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Pipeline Chart - ✅ Wrapped to prevent overflow */}
        <Box sx={{ width: "100%", overflowX: "hidden" }}>
          <CandidatePipelineChart />
        </Box>

        {/* Rest of your dialogs remain the same... */}
        {/* ... (keep all dialog code as is) ... */}

        <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ borderRadius: "12px", fontWeight: 600, fontSize: 13 }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;