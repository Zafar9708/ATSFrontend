import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  TextField,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Card,
  InputAdornment,
  Tooltip,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Switch,
  Tab,
  Tabs,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessCircleIcon,
  MarkEmailRead as MailSentIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  TableRows as TableIcon,
  GridView as GridIcon,
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
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import adminService from "../../services/adminService";
import { inviteVendor } from "../../services/Vendor/vendorService";
import VendorForm from "./VendorForm";
import RecruiterForm from "../../components/RecruitForm";
import CandidatePipeline from "../../components/Admin/CandidatePipeline";
import InterviewCalendar from "../../components/Admin/InterviewCalendar";
import CandidatePipelineChart from "../../components/Admin/CandidatePie";

/* ── Tokens ─────────────────────────────────────────────────────── */
const T = {
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

const PALETTE = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0284c7",
  "#be185d",
];
const aC = (s = "") => PALETTE[s.charCodeAt(0) % PALETTE.length];

/* ── Helpers ─────────────────────────────────────────────────────── */
const fmt = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "—");
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/* ── ChartTip ───────────────────────────────────────────────────── */
const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: "#1e293b",
        borderRadius: "10px",
        p: "8px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,.3)",
      }}
    >
      <Typography
        sx={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, mb: 0.5 }}
      >
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Box
          key={i}
          sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: p.color,
            }}
          />
          <Typography sx={{ color: "#f8fafc", fontSize: 12, fontWeight: 600 }}>
            {p.name}: {p.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

/* ── StatCard ───────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, color, bg }) => (
  <Card
    sx={{
      borderRadius: "16px",
      border: `1px solid ${T.border}`,
      background: T.surface,
      overflow: "hidden",
      position: "relative",
      transition: "transform .15s, box-shadow .15s",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 8px 24px rgba(0,0,0,.09)",
      },
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: color,
      }}
    />
    <Box sx={{ pt: 2.5, pb: 2, px: { xs: 2, sm: 2.5 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 800,
            color: T.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "11px",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: { xs: 28, sm: 32 },
          fontWeight: 900,
          color: T.text,
          lineHeight: 1,
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
        {sub}
      </Typography>
    </Box>
  </Card>
);

/* ── SectionCard ────────────────────────────────────────────────── */
const SC = ({ children, title, count, action }) => (
  <Card
    sx={{
      borderRadius: "16px",
      border: `1px solid ${T.border}`,
      background: T.surface,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        px: 2.5,
        py: 1.8,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 14, color: T.text }}>
          {title}
        </Typography>
        {count != null && (
          <Chip
            label={count}
            size="small"
            sx={{
              fontSize: 10,
              fontWeight: 700,
              background: T.indigoL,
              color: T.indigo,
            }}
          />
        )}
      </Box>
      {action}
    </Box>
    {children}
  </Card>
);

/* ── DetailRow ──────────────────────────────────────────────────── */
const DR = ({ icon, label, value, accent = T.primaryM }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      py: 1,
      borderBottom: `1px solid ${T.border}`,
    }}
  >
    <Box
      sx={{
        p: 0.5,
        borderRadius: "6px",
        background: `${accent}14`,
        flexShrink: 0,
        mt: 0.2,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 13, color: accent } })}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 10,
          color: T.textMuted,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: T.text,
          fontWeight: 500,
          wordBreak: "break-word",
          mt: 0.1,
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

const SH = ({ label, accent }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 0.5 }}>
    <Box sx={{ width: 3, height: 14, borderRadius: 2, background: accent }} />
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 800,
        color: accent,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {label}
    </Typography>
  </Box>
);

/* ═══════════════════════════════════════════════════════════════════
   RECRUITER VIEW DIALOG
═══════════════════════════════════════════════════════════════════ */
const RecruiterViewDialog = ({
  open,
  onClose,
  recruiter,
  onEdit,
  onDelete,
}) => {
  if (!recruiter) return null;
  const ac = aC(recruiter.firstName || "");
  const fullName =
    `${recruiter.firstName || ""} ${recruiter.lastName || ""}`.trim();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          p: 0,
          maxHeight: "92vh",
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${ac}, ${ac}cc)`,
          px: 3,
          pt: 3,
          pb: 2.5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "rgba(255,255,255,.8)",
            "&:hover": { background: "rgba(255,255,255,.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            src={recruiter.profilePicture}
            sx={{
              width: 56,
              height: 56,
              background: "rgba(255,255,255,.25)",
              fontSize: 20,
              fontWeight: 800,
              border: "2px solid rgba(255,255,255,.4)",
            }}
          >
            {!recruiter.profilePicture && fullName.charAt(0)}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 18,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {fullName}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: "rgba(255,255,255,.82)", mt: 0.3 }}
            >
              {recruiter.email}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.8, flexWrap: "wrap" }}>
              <Chip
                label={recruiter.isActive ? "Active" : "Inactive"}
                size="small"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: recruiter.isActive
                    ? "rgba(16,185,129,.25)"
                    : "rgba(244,63,94,.25)",
                  color: "#fff",
                  border: `1px solid ${recruiter.isActive ? T.emerald : T.rose}55`,
                }}
              />
              {recruiter.designation && (
                <Chip
                  label={recruiter.designation}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "rgba(255,255,255,.2)",
                    color: "#fff",
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          overflowY: "auto",
          maxHeight: "calc(92vh - 200px)",
        }}
      >
        <SH label="Personal Info" accent={T.primaryM} />
        <DR
          icon={<PhoneIcon />}
          label="Phone"
          value={recruiter.phoneNumber}
          accent={T.primaryM}
        />
        <DR
          icon={<LocationIcon />}
          label="Location"
          value={recruiter.location}
          accent={T.primaryM}
        />
        {recruiter.linkedIn && (
          <DR
            icon={<LinkedInIcon />}
            label="LinkedIn"
            value={recruiter.linkedIn}
            accent={T.primaryM}
          />
        )}
        <SH label="Work Details" accent={T.emerald} />
        <DR
          icon={<BusinessIcon />}
          label="Department"
          value={recruiter.department}
          accent={T.emerald}
        />
        <DR
          icon={<BadgeIcon />}
          label="Employment Type"
          value={recruiter.employmentType}
          accent={T.emerald}
        />
        <DR
          icon={<StarIcon />}
          label="Specialisation"
          value={recruiter.specialisation}
          accent={T.emerald}
        />
        <DR
          icon={<StarIcon />}
          label="Secondary Skill"
          value={recruiter.secondarySkill}
          accent={T.emerald}
        />
        <DR
          icon={<BadgeIcon />}
          label="Experience"
          value={
            recruiter.experience != null ? `${recruiter.experience} years` : "—"
          }
          accent={T.emerald}
        />
        <DR
          icon={<CalendarIcon />}
          label="Joining Date"
          value={fmtDate(recruiter.joiningDate)}
          accent={T.emerald}
        />
        <DR
          icon={<CalendarIcon />}
          label="Last Login"
          value={fmtDate(recruiter.lastLogin)}
          accent={T.emerald}
        />
        {recruiter.customNotes?.length > 0 && (
          <>
            <SH label="Custom Notes" accent={T.purple} />
            {recruiter.customNotes.map((n, i) => (
              <Box
                key={i}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "10px",
                  background: T.purpleBg,
                  border: `1px solid ${T.purple}22`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.purple,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {n.label}
                </Typography>
                <Typography sx={{ fontSize: 13, color: T.text, mt: 0.3 }}>
                  {n.value}
                </Typography>
              </Box>
            ))}
          </>
        )}
        <Box sx={{ pb: 1 }} />
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          gap: 1.5,
        }}
      >
        <Button
          fullWidth
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: T.border,
            color: T.textSub,
          }}
        >
          Close
        </Button>
        <Button
          fullWidth
          onClick={onDelete}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: T.danger,
            color: T.danger,
            "&:hover": { background: T.dangerBg },
          }}
        >
          Delete
        </Button>
        <Button
          fullWidth
          onClick={onEdit}
          variant="contained"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            background: T.primaryM,
            "&:hover": { background: T.primary },
          }}
        >
          Edit
        </Button>
      </Box>
    </Dialog>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CANDIDATE VIEW DIALOG
═══════════════════════════════════════════════════════════════════ */
const CandidateViewDialog = ({ open, onClose, candidate }) => {
  if (!candidate) return null;
  const name =
    candidate.fullName || `${candidate.firstName} ${candidate.lastName}`.trim();
  const ac = aC(name);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          p: 0,
          maxHeight: "92vh",
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${ac}, ${ac}cc)`,
          px: 3,
          pt: 3,
          pb: 2.5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "rgba(255,255,255,.8)",
            "&:hover": { background: "rgba(255,255,255,.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              background: "rgba(255,255,255,.25)",
              fontSize: 18,
              fontWeight: 800,
              border: "2px solid rgba(255,255,255,.4)",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 17,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: "rgba(255,255,255,.82)", mt: 0.3 }}
            >
              {candidate.email}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.8, flexWrap: "wrap" }}>
              {candidate.stage?.name && (
                <Chip
                  label={candidate.stage.name}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "rgba(255,255,255,.2)",
                    color: "#fff",
                  }}
                />
              )}
              {candidate.gender && (
                <Chip
                  label={candidate.gender}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "rgba(255,255,255,.15)",
                    color: "#fff",
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          overflowY: "auto",
          maxHeight: "calc(92vh - 180px)",
        }}
      >
        <SH label="Contact & Location" accent={T.primaryM} />
        <DR
          icon={<PhoneIcon />}
          label="Mobile"
          value={candidate.mobile}
          accent={T.primaryM}
        />
        <DR
          icon={<LocationIcon />}
          label="Current Location"
          value={candidate.currentLocation?.name}
          accent={T.primaryM}
        />
        <DR
          icon={<LocationIcon />}
          label="Preferred Location"
          value={candidate.preferredLocation?.name}
          accent={T.primaryM}
        />
        <SH label="Professional" accent={T.emerald} />
        <DR
          icon={<BadgeIcon />}
          label="Experience"
          value={candidate.experience}
          accent={T.emerald}
        />
        <DR
          icon={<BadgeIcon />}
          label="Education"
          value={candidate.education}
          accent={T.emerald}
        />
        <DR
          icon={<TimeIcon />}
          label="Notice Period"
          value={
            candidate.availableToJoin != null
              ? `${candidate.availableToJoin} days`
              : "—"
          }
          accent={T.emerald}
        />
        <DR
          icon={<WorkIcon />}
          label="Applied Job"
          value={candidate.jobId?.jobTitle}
          accent={T.emerald}
        />
        <DR
          icon={<PersonIcon />}
          label="Source"
          value={candidate.source?.name}
          accent={T.emerald}
        />
        <DR
          icon={<PersonIcon />}
          label="Owner"
          value={candidate.owner?.email}
          accent={T.emerald}
        />
        <SH label="Compensation" accent={T.amber} />
        <DR
          icon={<BadgeIcon />}
          label="Current CTC"
          value={candidate.formattedCurrentCTC || fmt(candidate.currentCTC)}
          accent={T.amber}
        />
        <DR
          icon={<BadgeIcon />}
          label="Expected CTC"
          value={candidate.formattedExpectedCTC || fmt(candidate.expectedCTC)}
          accent={T.amber}
        />
        {candidate.skills?.filter((s) => s).length > 0 && (
          <>
            <SH label="Skills" accent={T.sky} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1 }}>
              {candidate.skills
                .flatMap((s) => s.split(","))
                .filter((s) => s.trim())
                .map((s, i) => (
                  <Chip
                    key={i}
                    label={s.trim()}
                    size="small"
                    sx={{
                      fontSize: 11,
                      background: T.skyL,
                      color: T.sky,
                      fontWeight: 600,
                    }}
                  />
                ))}
            </Box>
          </>
        )}
        <Box sx={{ pb: 1 }} />
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${T.border}` }}>
        <Button
          fullWidth
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: T.border,
            color: T.textSub,
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   VENDOR VIEW DIALOG
═══════════════════════════════════════════════════════════════════ */
const VendorViewDialog = ({ open, onClose, vendor, onDelete }) => {
  if (!vendor) return null;
  const ac = aC(vendor.companyName || "");
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          p: 0,
          maxHeight: "92vh",
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${T.purple}, #4c1d95)`,
          px: 3,
          pt: 3,
          pb: 2.5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "rgba(255,255,255,.8)",
            "&:hover": { background: "rgba(255,255,255,.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              background: "rgba(255,255,255,.25)",
              fontSize: 18,
              fontWeight: 800,
              border: "2px solid rgba(255,255,255,.4)",
            }}
          >
            {vendor.companyName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 17,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {vendor.companyName}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: "rgba(255,255,255,.82)", mt: 0.3 }}
            >
              {vendor.companyEmail}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.8, flexWrap: "wrap" }}>
              <Chip
                label={vendor.isActive ? "Active" : "Inactive"}
                size="small"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: vendor.isActive
                    ? "rgba(16,185,129,.25)"
                    : "rgba(244,63,94,.25)",
                  color: "#fff",
                  border: `1px solid ${vendor.isActive ? T.emerald : T.rose}55`,
                }}
              />
              {vendor.vendorType && (
                <Chip
                  label={vendor.vendorType}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "rgba(255,255,255,.2)",
                    color: "#fff",
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          overflowY: "auto",
          maxHeight: "calc(92vh - 190px)",
        }}
      >
        <SH label="Company Info" accent={T.purple} />
        <DR
          icon={<PhoneIcon />}
          label="Phone"
          value={vendor.companyPhone}
          accent={T.purple}
        />
        <DR
          icon={<LanguageIcon />}
          label="Website"
          value={vendor.website}
          accent={T.purple}
        />
        <DR
          icon={<BusinessIcon />}
          label="Industry"
          value={vendor.industry}
          accent={T.purple}
        />
        <DR
          icon={<LocationIcon />}
          label="Address"
          value={vendor.companyAddress}
          accent={T.purple}
        />
        <DR
          icon={<BadgeIcon />}
          label="GST"
          value={vendor.gstNumber}
          accent={T.purple}
        />
        <DR
          icon={<BadgeIcon />}
          label="PAN"
          value={vendor.companyPan}
          accent={T.purple}
        />
        <DR
          icon={<BadgeIcon />}
          label="Reg. No."
          value={vendor.registrationNumber}
          accent={T.purple}
        />
        <SH label="Contact Person" accent={T.emerald} />
        <DR
          icon={<PersonIcon />}
          label="Name"
          value={`${vendor.firstName || ""} ${vendor.lastName || ""}`.trim()}
          accent={T.emerald}
        />
        <DR
          icon={<BadgeIcon />}
          label="Designation"
          value={vendor.designation}
          accent={T.emerald}
        />
        <DR
          icon={<EmailIcon />}
          label="Email"
          value={vendor.email}
          accent={T.emerald}
        />
        <DR
          icon={<PhoneIcon />}
          label="Phone"
          value={vendor.phone}
          accent={T.emerald}
        />
        <SH label="Bank Details" accent={T.amber} />
        <DR
          icon={<BankIcon />}
          label="Bank"
          value={vendor.bankDetails?.bankName}
          accent={T.amber}
        />
        <DR
          icon={<BankIcon />}
          label="Account No."
          value={vendor.bankDetails?.accountNumber}
          accent={T.amber}
        />
        <DR
          icon={<BankIcon />}
          label="IFSC"
          value={vendor.bankDetails?.ifscCode}
          accent={T.amber}
        />
        <DR
          icon={<LocationIcon />}
          label="Branch"
          value={vendor.bankDetails?.branch}
          accent={T.amber}
        />
        <SH label="Billing" accent={T.sky} />
        <DR
          icon={<CalendarIcon />}
          label="Billing Cycle"
          value={vendor.billingCycle}
          accent={T.sky}
        />
        <DR
          icon={<CalendarIcon />}
          label="Payment Terms"
          value={vendor.paymentTerms}
          accent={T.sky}
        />
        <DR
          icon={<CalendarIcon />}
          label="Contract Start"
          value={fmtDate(vendor.contractStartDate)}
          accent={T.sky}
        />
        <DR
          icon={<CalendarIcon />}
          label="Contract End"
          value={fmtDate(vendor.contractEndDate)}
          accent={T.sky}
        />
        <DR
          icon={<BadgeIcon />}
          label="Credit Limit"
          value={fmt(vendor.creditLimit)}
          accent={T.sky}
        />
        <DR
          icon={<BadgeIcon />}
          label="Service Charge"
          value={
            vendor.serviceCharge != null ? `${vendor.serviceCharge}%` : "—"
          }
          accent={T.sky}
        />
        {vendor.customNotes?.length > 0 && (
          <>
            <SH label="Custom Notes" accent={T.indigo} />
            {vendor.customNotes.map((n, i) => (
              <Box
                key={i}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "10px",
                  background: T.indigoL,
                  border: `1px solid ${T.indigo}22`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.indigo,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {n.label}
                </Typography>
                <Typography sx={{ fontSize: 13, color: T.text, mt: 0.3 }}>
                  {n.value}
                </Typography>
              </Box>
            ))}
          </>
        )}
        <Box sx={{ pb: 1 }} />
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          gap: 1.5,
        }}
      >
        <Button
          fullWidth
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: T.border,
            color: T.textSub,
          }}
        >
          Close
        </Button>
        <Button
          fullWidth
          onClick={onDelete}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: T.danger,
            color: T.danger,
            "&:hover": { background: T.dangerBg },
          }}
        >
          Delete
        </Button>
      </Box>
    </Dialog>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   INTERVIEW VIEW DIALOG
═══════════════════════════════════════════════════════════════════ */
const InterviewViewDialog = ({ open, onClose, interview }) => {
  if (!interview) return null;
  const statusColor =
    { scheduled: T.primaryM, completed: T.emerald, cancelled: T.danger }[
      interview.status
    ] || T.textMuted;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          p: 0,
          maxHeight: "90vh",
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${T.indigo}, ${T.primaryM})`,
          px: 3,
          pt: 3,
          pb: 2.5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "rgba(255,255,255,.8)",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,255,255,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InterviewIcon sx={{ fontSize: 26, color: "#fff" }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 17,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {interview.candidate?.name || "—"}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: "rgba(255,255,255,.82)", mt: 0.3 }}
            >
              {interview.candidate?.email}
            </Typography>
            <Chip
              label={interview.status || "scheduled"}
              size="small"
              sx={{
                mt: 0.8,
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(255,255,255,.2)",
                color: "#fff",
                textTransform: "capitalize",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          overflowY: "auto",
          maxHeight: "calc(90vh - 180px)",
        }}
      >
        <SH label="Schedule" accent={T.primaryM} />
        <DR
          icon={<CalendarIcon />}
          label="Date"
          value={fmtDate(interview.date)}
          accent={T.primaryM}
        />
        <DR
          icon={<TimeIcon />}
          label="Time"
          value={interview.startTime}
          accent={T.primaryM}
        />
        <DR
          icon={<TimeIcon />}
          label="Duration"
          value={interview.duration ? `${interview.duration} min` : "—"}
          accent={T.primaryM}
        />
        <DR
          icon={<LanguageIcon />}
          label="Timezone"
          value={interview.timezone}
          accent={T.primaryM}
        />
        <SH label="Meeting Details" accent={T.emerald} />
        <DR
          icon={<VideoCall />}
          label="Platform"
          value={interview.platform}
          accent={T.emerald}
        />
        <DR
          icon={<LinkIcon />}
          label="Link"
          value={interview.meetingLink}
          accent={T.emerald}
        />
        <DR
          icon={<PersonIcon />}
          label="Scheduled By"
          value={interview.scheduledBy?.email}
          accent={T.emerald}
        />
        {interview.interviewers?.length > 0 && (
          <>
            <SH label="Interviewers" accent={T.amber} />
            {interview.interviewers.map((iv, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 0.8,
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    background: aC(iv.name || ""),
                    fontSize: 12,
                  }}
                >
                  {iv.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 600, color: T.text }}
                  >
                    {iv.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: T.textMuted }}>
                    {iv.email}
                  </Typography>
                </Box>
              </Box>
            ))}
          </>
        )}
        {interview.notes && (
          <>
            <SH label="Notes" accent={T.purple} />
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                background: T.purpleBg,
                border: `1px solid ${T.purple}22`,
                mt: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, color: T.text }}>
                {interview.notes}
              </Typography>
            </Box>
          </>
        )}
        <Box sx={{ pb: 1 }} />
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${T.border}` }}>
        <Button
          fullWidth
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: T.border,
            color: T.textSub,
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

// VideoCall icon fix
const VideoCall = (props) => <InterviewIcon {...props} />;

/* ═══════════════════════════════════════════════════════════════════
   DELETE CONFIRM DIALOG
═══════════════════════════════════════════════════════════════════ */
const DeleteDialog = ({ open, onClose, onConfirm, name }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: { borderRadius: "18px", overflow: "hidden", p: 0, mx: { xs: 2 } },
    }}
  >
    <Box
      sx={{
        px: 3,
        pt: 2.5,
        pb: 2,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        gap: 1.2,
      }}
    >
      <Box sx={{ p: 0.8, borderRadius: "10px", background: T.dangerBg }}>
        <DeleteIcon sx={{ color: T.danger, fontSize: 20 }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: 15, color: T.text }}>
        Confirm Delete
      </Typography>
    </Box>
    <Box sx={{ px: 3, py: 2.5 }}>
      <Typography sx={{ fontSize: 14, color: T.textSub }}>
        Permanently delete <b style={{ color: T.text }}>{name}</b>?
      </Typography>
      <Box
        sx={{
          mt: 1.5,
          p: 1.5,
          borderRadius: "10px",
          background: T.dangerBg,
          border: "1px solid #fecdd3",
        }}
      >
        <Typography sx={{ fontSize: 12, color: T.danger }}>
          ⚠ This cannot be undone.
        </Typography>
      </Box>
    </Box>
    <Box sx={{ px: 3, pb: 3, display: "flex", gap: 1 }}>
      <Button
        fullWidth
        onClick={onClose}
        sx={{
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          color: T.textSub,
          border: `1px solid ${T.border}`,
        }}
      >
        Cancel
      </Button>
      <Button
        fullWidth
        onClick={onConfirm}
        variant="contained"
        sx={{
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
          background: T.danger,
          "&:hover": { background: "#b91c1c" },
        }}
      >
        Delete
      </Button>
    </Box>
  </Dialog>
);

/* ═══════════════════════════════════════════════════════════════════
   GRID CARDS
═══════════════════════════════════════════════════════════════════ */
const RecruiterCard = ({ r, onView, onEdit, onDelete, onEmail }) => {
  const ac = aC(r.firstName || "");
  const name = `${r.firstName || ""} ${r.lastName || ""}`.trim();
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: `1px solid ${T.border}`,
        background: T.surface,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all .2s",
        "&:hover": {
          boxShadow: "0 8px 28px rgba(0,0,0,.10)",
          borderColor: T.primaryM,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{ height: 4, background: `linear-gradient(90deg, ${ac}, ${ac}77)` }}
      />
      <Box sx={{ p: 2, flex: 1 }}>
        <Box
          sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}
        >
          <Avatar
            src={r.profilePicture}
            sx={{
              width: 42,
              height: 42,
              background: ac,
              fontSize: 15,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {!r.profilePicture && name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color: T.text,
                lineHeight: 1.3,
              }}
              noWrap
            >
              {name}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: T.textMuted, mt: 0.2 }}
              noWrap
            >
              {r.email}
            </Typography>
          </Box>
          <Chip
            label={r.isActive ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontSize: 9,
              fontWeight: 700,
              flexShrink: 0,
              background: r.isActive ? T.successBg : T.dangerBg,
              color: r.isActive ? T.success : T.danger,
            }}
          />
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          {[
            [<BadgeIcon />, r.designation || "—"],
            [<BusinessIcon />, r.department || "—"],
            [<LocationIcon />, r.location || "—"],
          ].map(([icon, val], i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.cloneElement(icon, {
                sx: { fontSize: 12, color: T.textMuted, flexShrink: 0 },
              })}
              <Typography sx={{ fontSize: 12, color: T.textSub }} noWrap>
                {val}
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon
              sx={{ fontSize: 12, color: T.textMuted, flexShrink: 0 }}
            />
            <Typography sx={{ fontSize: 12, color: T.textSub }} noWrap>
              {r.specialisation || "—"}
            </Typography>
          </Box>
        </Box>
        {r.customNotes?.length > 0 && (
          <Chip
            label={`${r.customNotes.length} note${r.customNotes.length > 1 ? "s" : ""}`}
            size="small"
            sx={{
              mt: 1.5,
              fontSize: 10,
              background: T.purpleBg,
              color: T.purple,
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          px: 2,
          py: 1.2,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 0.5,
          background: T.bg,
        }}
      >
        {[
          { tip: "Email", icon: <EmailIcon />, color: T.sky, fn: onEmail },
          { tip: "View", icon: <ViewIcon />, color: T.primaryM, fn: onView },
          { tip: "Edit", icon: <EditIcon />, color: T.amber, fn: onEdit },
          {
            tip: "Delete",
            icon: <DeleteIcon />,
            color: T.danger,
            fn: onDelete,
          },
        ].map((a) => (
          <Tooltip key={a.tip} title={a.tip} arrow>
            <IconButton
              onClick={a.fn}
              size="small"
              sx={{
                borderRadius: "7px",
                p: 0.5,
                color: a.color,
                background: `${a.color}14`,
                "&:hover": { background: a.color, color: "#fff" },
                transition: "all .15s",
              }}
            >
              {React.cloneElement(a.icon, { sx: { fontSize: 14 } })}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Card>
  );
};

const CandidateCard = ({ c, onView }) => {
  const name = c.fullName || `${c.firstName} ${c.lastName}`.trim();
  const ac = aC(name);
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: `1px solid ${T.border}`,
        background: T.surface,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all .2s",
        "&:hover": {
          boxShadow: "0 8px 28px rgba(0,0,0,.09)",
          borderColor: T.emerald,
          transform: "translateY(-2px)",
        },
        cursor: "pointer",
      }}
      onClick={onView}
    >
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${T.emerald}, ${T.emerald}77)`,
        }}
      />
      <Box sx={{ p: 2, flex: 1 }}>
        <Box
          sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: ac,
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: 13, color: T.text }}
              noWrap
            >
              {name}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: T.textMuted, mt: 0.2 }}
              noWrap
            >
              {c.email}
            </Typography>
          </Box>
          {c.stage?.name && (
            <Chip
              label={c.stage.name}
              size="small"
              sx={{
                fontSize: 9,
                fontWeight: 700,
                background: T.indigoL,
                color: T.indigo,
                flexShrink: 0,
              }}
            />
          )}
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          {[
            [<PhoneIcon />, c.mobile],
            [<LocationIcon />, c.currentLocation?.name],
            [<BadgeIcon />, c.experience ? `${c.experience} exp` : "—"],
          ].map(([icon, val], i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.cloneElement(icon, {
                sx: { fontSize: 12, color: T.textMuted, flexShrink: 0 },
              })}
              <Typography sx={{ fontSize: 12, color: T.textSub }} noWrap>
                {val || "—"}
              </Typography>
            </Box>
          ))}
          {c.jobId && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WorkIcon
                sx={{ fontSize: 12, color: T.textMuted, flexShrink: 0 }}
              />
              <Typography sx={{ fontSize: 12, color: T.textSub }} noWrap>
                {c.jobId.jobTitle}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 0.5, mt: 1.5, flexWrap: "wrap" }}>
          {c.skills
            ?.flatMap((s) => s.split(","))
            .filter((s) => s.trim())
            .slice(0, 3)
            .map((s, i) => (
              <Chip
                key={i}
                label={s.trim()}
                size="small"
                sx={{
                  fontSize: 9,
                  background: T.skyL,
                  color: T.sky,
                  fontWeight: 600,
                }}
              />
            ))}
        </Box>
      </Box>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: `1px solid ${T.border}`,
          background: T.bg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 10, color: T.textMuted }}>
          {c.formattedCurrentCTC || "—"}
        </Typography>
        <Typography sx={{ fontSize: 10, color: T.textMuted }}>
          {fmtDate(c.createdAt)}
        </Typography>
      </Box>
    </Card>
  );
};

const VendorCard = ({ v, onView, onDelete }) => {
  const ac = aC(v.companyName || "");
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: `1px solid ${T.border}`,
        background: T.surface,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all .2s",
        "&:hover": {
          boxShadow: "0 8px 28px rgba(0,0,0,.09)",
          borderColor: T.purple,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${T.purple}, #7c3aed77)`,
        }}
      />
      <Box sx={{ p: 2, flex: 1 }}>
        <Box
          sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: T.purple,
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {v.companyName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: 13, color: T.text }}
              noWrap
            >
              {v.companyName}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: T.textMuted, mt: 0.2 }}
              noWrap
            >
              {v.companyEmail}
            </Typography>
          </Box>
          <Chip
            label={v.isActive ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontSize: 9,
              fontWeight: 700,
              flexShrink: 0,
              background: v.isActive ? T.successBg : T.dangerBg,
              color: v.isActive ? T.success : T.danger,
            }}
          />
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          {[
            [<BusinessIcon />, v.vendorType],
            [<BusinessIcon />, v.industry],
            [<PhoneIcon />, v.companyPhone],
            [<LocationIcon />, v.companyAddress],
          ].map(([icon, val], i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.cloneElement(icon, {
                sx: { fontSize: 12, color: T.textMuted, flexShrink: 0 },
              })}
              <Typography sx={{ fontSize: 12, color: T.textSub }} noWrap>
                {val || "—"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          px: 2,
          py: 1.2,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 0.5,
          background: T.bg,
        }}
      >
        {[
          { tip: "View", icon: <ViewIcon />, color: T.purple, fn: onView },
          {
            tip: "Delete",
            icon: <DeleteIcon />,
            color: T.danger,
            fn: onDelete,
          },
        ].map((a) => (
          <Tooltip key={a.tip} title={a.tip} arrow>
            <IconButton
              onClick={a.fn}
              size="small"
              sx={{
                borderRadius: "7px",
                p: 0.5,
                color: a.color,
                background: `${a.color}14`,
                "&:hover": { background: a.color, color: "#fff" },
                transition: "all .15s",
              }}
            >
              {React.cloneElement(a.icon, { sx: { fontSize: 14 } })}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  /* ── Data state ─────────────────────────────────────────────── */
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ── UI state ───────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState(0); // 0=Recruiters,1=Candidates,2=Interviews,3=Vendors,4=Jobs

  const [timeFilter, setTimeFilter] = useState("monthly"); // 'weekly' or 'monthly'
  const [viewMode, setViewMode] = useState("table");
  const [searchR, setSearchR] = useState("");
  const [searchC, setSearchC] = useState("");
  const [searchV, setSearchV] = useState("");
  const [searchI, setSearchI] = useState("");
  const [searchJ, setSearchJ] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ── Dialog state ───────────────────────────────────────────── */
  const [recruiterDialog, setRecruiterDialog] = useState(false);
  const [vendorDialog, setVendorDialog] = useState(false);
  const [recruiterView, setRecruiterView] = useState(null);
  const [candidateView, setCandidateView] = useState(null);
  const [vendorView, setVendorView] = useState(null);
  const [interviewView, setInterviewView] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // {type, id, name}

  /* ── Recruiter form ─────────────────────────────────────────── */
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [vendorSaving, setVendorSaving] = useState(false);
  const [vendorSuccess, setVendorSuccess] = useState(false);
  const [savedVendorEmail, setSavedVendorEmail] = useState("");

  const emptyRecruiter = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    location: "",
    linkedIn: "",
    designation: "",
    department: "",
    employmentType: "",
    experience: "",
    specialisation: "",
    secondarySkill: "",
    joiningDate: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    profilePreviewUrl: null,
    customNotes: [],
  };
  const emptyVendor = {
    companyName: "",
    vendorType: "",
    industry: "",
    website: "",
    companyEmail: "",
    companyPhone: "",
    gstNumber: "",
    companyPan: "",
    registrationNumber: "",
    companyAddress: "",
    gstCertificate: null,
    companyPanFile: null,
    firstName: "",
    lastName: "",
    designation: "",
    email: "",
    phone: "",
    aadharNumber: "",
    panNumber: "",
    aadharFile: null,
    panFile: null,
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    cancelledCheque: null,
    billingCycle: "",
    paymentTerms: "",
    contractStartDate: "",
    contractEndDate: "",
    creditLimit: "",
    serviceCharge: "",
    companyRegistrationFile: null,
    gstCertificateKyc: null,
    companyPanKycFile: null,
    bankProofFile: null,
    msmeFile: null,
    otherDocFile: null,
    customNotes: [],
  };

  const [recruiterForm, setRecruiterForm] = useState(emptyRecruiter);
  const [recruiterFormErrors, setRecruiterFormErrors] = useState({});
  const [vendorForm, setVendorForm] = useState(emptyVendor);
  const [vendorFormErrors, setVendorFormErrors] = useState({});

  /* ── Fetch ──────────────────────────────────────────────────── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const authHeaders = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [rRes, jRes, cRes, iRes, vRes] = await Promise.allSettled([
        adminService.getRecruiters(),
        adminService.getAllJobs(),
        fetch("/api/v1/candidates", { headers: authHeaders }).then((r) =>
          r.json(),
        ),
        fetch("/api/online-interviews", { headers: authHeaders }).then((r) =>
          r.json(),
        ),
        fetch("/api/admin/vendors", { headers: authHeaders }).then((r) =>
          r.json(),
        ),
      ]);
      if (rRes.status === "fulfilled")
        setRecruiters(rRes.value?.recruiters || rRes.value?.recuiter || []);
      if (jRes.status === "fulfilled") setJobs(jRes.value?.jobs || []);
      if (cRes.status === "fulfilled")
        setCandidates(cRes.value?.candidates || []);
      if (iRes.status === "fulfilled") setInterviews(iRes.value?.data || []);
      if (vRes.status === "fulfilled") setVendors(vRes.value?.vendors || []);
    } catch (e) {
      toast("Failed to load data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toast = (msg, sev = "success") =>
    setSnackbar({ open: true, message: msg, severity: sev });

  /* ── Recruiter actions ──────────────────────────────────────── */
  const openAddRecruiter = () => {
    setEditingId(null);
    setRecruiterForm(emptyRecruiter);
    setRecruiterFormErrors({});
    setSaveSuccess(false);
    setSavedEmail("");
    setRecruiterDialog(true);
  };

  const openEditRecruiter = (r) => {
    setEditingId(r._id);
    setRecruiterForm({
      ...emptyRecruiter,
      firstName: r.firstName || "",
      lastName: r.lastName || "",
      email: r.email || "",
      phoneNumber: r.phoneNumber || "",
      username: r.username || "",
      location: r.location || "",
      linkedIn: r.linkedIn || "",
      designation: r.designation || "",
      department: r.department || "",
      employmentType: r.employmentType || "",
      experience: String(r.experience || ""),
      specialisation: r.specialisation || "",
      secondarySkill: r.secondarySkill || "",
      joiningDate: r.joiningDate || "",
      profilePreviewUrl: r.profilePicture || null,
      customNotes: r.customNotes || [],
    });
    setRecruiterFormErrors({});
    setSaveSuccess(false);
    setRecruiterView(null);
    setRecruiterDialog(true);
  };

  const validateRecruiter = () => {
    const e = {};
    if (!recruiterForm.firstName.trim()) e.firstName = "Required";
    if (!recruiterForm.lastName.trim()) e.lastName = "Required";
    if (!recruiterForm.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recruiterForm.email))
      e.email = "Invalid email";
    if (!recruiterForm.phoneNumber.trim()) e.phoneNumber = "Required";
    if (!recruiterForm.username.trim()) e.username = "Required";
    if (!editingId) {
      if (!recruiterForm.password) e.password = "Required";
      else if (recruiterForm.password.length < 8)
        e.password = "Min 8 characters";
      if (recruiterForm.password !== recruiterForm.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    setRecruiterFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveRecruiter = async () => {
    if (!validateRecruiter()) {
      toast("Please fill required fields", "warning");
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
        experience: recruiterForm.experience
          ? Number(recruiterForm.experience)
          : undefined,
        specialisation: recruiterForm.specialisation || undefined,
        secondarySkill: recruiterForm.secondarySkill?.trim() || undefined,
        joiningDate: recruiterForm.joiningDate || undefined,
        customNotes: recruiterForm.customNotes?.length
          ? recruiterForm.customNotes.map((n) => ({
              label: n.label,
              value: n.value,
              date: n.date || new Date().toISOString(),
              updatedAt: n.updatedAt || new Date().toISOString(),
            }))
          : undefined,
      };
      if (recruiterForm.password) payload.password = recruiterForm.password;
      Object.keys(payload).forEach(
        (k) => payload[k] === undefined && delete payload[k],
      );

      await adminService.addRecruiter(payload);
      setSavedEmail(recruiterForm.email);
      setSaveSuccess(true);
      fetchAll();
    } catch (err) {
      toast(err.response?.data?.message || "Error saving recruiter", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecruiter = async () => {
    try {
      await adminService.deleteRecruiter(deleteTarget.id);
      setDeleteTarget(null);
      fetchAll();
      toast("Recruiter deleted");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const handleResendEmail = async (id) => {
    try {
      await adminService.resendWelcomeEmail(id);
      toast("Welcome email resent!");
    } catch {
      toast("Failed to resend email", "error");
    }
  };

  const getMainContentWidth = () => {
    const sidebarOpen = true; // You can make this dynamic if needed
    if (isMobile) return "100%";
    if (isTablet) return "100%";
    return sidebarOpen ? "calc(100% - 100px)" : "calc(100% - 65px)";
  };

  /* ── Vendor actions ─────────────────────────────────────────── */
  const openAddVendor = () => {
    setVendorForm(emptyVendor);
    setVendorFormErrors({});
    setVendorSuccess(false);
    setSavedVendorEmail("");
    setVendorDialog(true);
  };

  const validateVendor = () => {
    const e = {};
    if (!vendorForm.companyName.trim()) e.companyName = "Required";
    if (!vendorForm.vendorType) e.vendorType = "Required";
    if (!vendorForm.industry) e.industry = "Required";
    if (!vendorForm.companyEmail.trim()) e.companyEmail = "Required";
    if (!vendorForm.companyPhone.trim()) e.companyPhone = "Required";
    if (!vendorForm.companyAddress.trim()) e.companyAddress = "Required";
    if (!vendorForm.firstName.trim()) e.firstName = "Required";
    if (!vendorForm.lastName.trim()) e.lastName = "Required";
    if (!vendorForm.email.trim()) e.email = "Required";
    if (!vendorForm.phone.trim()) e.phone = "Required";
    if (!vendorForm.aadharNumber.trim()) e.aadharNumber = "Required";
    if (!vendorForm.panNumber.trim()) e.panNumber = "Required";
    if (!vendorForm.bankName.trim()) e.bankName = "Required";
    if (!vendorForm.accountHolderName.trim()) e.accountHolderName = "Required";
    if (!vendorForm.accountNumber.trim()) e.accountNumber = "Required";
    if (!vendorForm.ifscCode.trim()) e.ifscCode = "Required";
    if (!vendorForm.billingCycle) e.billingCycle = "Required";
    if (!vendorForm.paymentTerms) e.paymentTerms = "Required";
    if (!vendorForm.contractStartDate) e.contractStartDate = "Required";
    if (!vendorForm.contractEndDate) e.contractEndDate = "Required";
    setVendorFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegisterVendor = async () => {
    if (!validateVendor()) {
      toast("Please fill required fields", "warning");
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
        creditLimit: vendorForm.creditLimit
          ? Number(vendorForm.creditLimit)
          : undefined,
        serviceCharge: vendorForm.serviceCharge
          ? Number(vendorForm.serviceCharge)
          : undefined,
        customNotes: vendorForm.customNotes?.length
          ? vendorForm.customNotes.map((n) => ({
              label: n.label,
              value: n.value,
              date: n.date || new Date().toISOString(),
              updatedAt: n.updatedAt || new Date().toISOString(),
            }))
          : undefined,
      };
      Object.keys(payload).forEach(
        (k) => payload[k] === undefined && delete payload[k],
      );
      await inviteVendor(payload);
      setSavedVendorEmail(vendorForm.companyEmail);
      setVendorSuccess(true);
      fetchAll();
      toast("Vendor registered!");
    } catch (err) {
      toast(
        err.response?.data?.message ||
          err.message ||
          "Error registering vendor",
        "error",
      );
    } finally {
      setVendorSaving(false);
    }
  };

  /* ── Filters ────────────────────────────────────────────────── */
  const filteredR = recruiters.filter((r) => {
    const s = searchR.toLowerCase();
    return (
      r.email?.toLowerCase().includes(s) ||
      r.username?.toLowerCase().includes(s) ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(s)
    );
  });
  const filteredC = candidates.filter((c) => {
    const s = searchC.toLowerCase();
    const name = c.fullName || `${c.firstName} ${c.lastName}`;
    return (
      name.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s) ||
      c.mobile?.includes(s)
    );
  });
  const filteredV = vendors.filter((v) => {
    const s = searchV.toLowerCase();
    return (
      v.companyName?.toLowerCase().includes(s) ||
      v.companyEmail?.toLowerCase().includes(s)
    );
  });
  const filteredI = interviews.filter((i) => {
    const s = searchI.toLowerCase();
    return (
      i.candidate?.name?.toLowerCase().includes(s) ||
      i.candidate?.email?.toLowerCase().includes(s)
    );
  });
  const filteredJ = jobs.filter((j) => {
    const s = searchJ.toLowerCase();
    return (
      j.jobTitle?.toLowerCase().includes(s) ||
      j.jobName?.toLowerCase().includes(s) ||
      j.department?.toLowerCase().includes(s)
    );
  });

  /* ── chart data ─────────────────────────────────────────────── */
  const recruiterChartData = (() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    return Array.from({ length: 6 }, (_, idx) => {
      const mIdx = (now.getMonth() - 5 + idx + 12) % 12;
      return {
        name: months[mIdx],
        added: recruiters.filter(
          (r) => new Date(r.createdAt).getMonth() === mIdx,
        ).length,
        active: recruiters.filter(
          (r) => new Date(r.createdAt).getMonth() === mIdx && r.isActive,
        ).length,
      };
    });
  })();

  // Vendor industry breakdown for pie chart
  const vendorIndustryData = (() => {
    const map = {};
    vendors.forEach((v) => {
      const k = v.industry || v.vendorType || "Other";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  })();

  const PIE_COLORS = [
    "#4f46e5",
    "#059669",
    "#7c3aed",
    "#d97706",
    "#0284c7",
    "#be185d",
  ];

  // Jobs trend — active vs inactive per month using status field from API
  const jobsChartData = (() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    return Array.from({ length: 6 }, (_, idx) => {
      const mIdx = (now.getMonth() - 5 + idx + 12) % 12;
      const monthJobs = jobs.filter(
        (j) => new Date(j.createdAt).getMonth() === mIdx,
      );
      const active = monthJobs.filter((j) => j.status === "Active").length;
      const inactive = monthJobs.filter((j) => j.status !== "Active").length;
      return { name: months[mIdx], active, inactive, total: monthJobs.length };
    });
  })();

  // Active jobs using status field from API
  const activeJobs = jobs.filter((j) => j.status === "Active");

  // Parse name from JWT token
  const tokenName = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return (
        payload.firstName ||
        payload.name ||
        payload.username ||
        payload.email?.split("@")[0] ||
        ""
      );
    } catch {
      return "";
    }
  })();

  /* ── Guard ──────────────────────────────────────────────────── */
  const sidebarOpen = true;

  const deptMap = {};
  jobs.forEach((j) => {
    const k = j.department || "Other";
    deptMap[k] = (deptMap[k] || 0) + 1;
  });

  const deptData = Object.entries(deptMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topDept = deptData[0]?.name || "N/A";

  /* ── loading ──────────────────────────────────────────────────────────── */
  if (loading && !refreshing)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Box sx={{ position: "relative", width: 56, height: 56 }}>
          <CircularProgress
            size={56}
            thickness={4}
            sx={{ color: "#1976d2", position: "absolute" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DashboardIcon sx={{ fontSize: 24, color: "#1976d2" }} />
          </Box>
        </Box>
        <Typography sx={{ color: T.textSub, fontSize: 14, fontWeight: 500 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );

  const tableHead = (cols) => (
    <TableHead>
      <TableRow sx={{ background: T.bg }}>
        {cols.map((h, i) => (
          <TableCell
            key={h}
            align={i === cols.length - 1 ? "right" : "left"}
            sx={{
              fontWeight: 700,
              fontSize: 10,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              borderBottom: `1px solid ${T.border}`,
              py: 1.2,
              px: i === 0 ? 2.5 : 1.5,
              whiteSpace: "nowrap",
            }}
          >
            {h}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "90%", // ✅ FIX
          maxWidth: "90%", // ✅ FIX
          overflowX: "hidden", // ✅ MAIN FIX (no scrollbar)
          p: { xs: 1.5, sm: 2, md: 2.5 },
          mt: { xs: 7, sm: 8, md: 9 },
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
            width: "100%", // ✅ FIX
            maxWidth: "100%", // ✅ FIX
            overflow: "hidden", // ✅ FIX
            mb: 3.5,
          }}
        >
          {/* Left side with animated greeting */}
          <Box sx={{ position: "relative", overflow: "hidden" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 20, sm: 24, md: 28 },
                  fontWeight: 900,
                  color: T.text,
                  letterSpacing: "-.4px",
                  lineHeight: 1.2,
                  animation: "slideIn 0.5s ease-out",
                  "@keyframes slideIn": {
                    from: { opacity: 0, transform: "translateX(-20px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                  },
                }}
              >
                {tokenName
                  ? `Welcome back, ${tokenName}`
                  : "Welcome to Dashboard"}
              </Typography>
              <Box
                sx={{
                  fontSize: 28,
                  animation: "wave 2s infinite",
                  transformOrigin: "70% 70%",
                  "@keyframes wave": {
                    "0%": { transform: "rotate(0deg)" },
                    "10%": { transform: "rotate(14deg)" },
                    "20%": { transform: "rotate(-8deg)" },
                    "30%": { transform: "rotate(14deg)" },
                    "40%": { transform: "rotate(-4deg)" },
                    "50%": { transform: "rotate(10deg)" },
                    "60%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(0deg)" },
                  },
                }}
              >
                👋
              </Box>
            </Box>

            {/* Animated subtitle */}
            <Typography
              sx={{
                fontSize: 13,
                color: T.textMuted,
                display: "flex",
                alignItems: "center",
                gap: 1,
                animation: "fadeIn 0.8s ease-out",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(10px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 0.6 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0.6 },
                  },
                }}
              >
                <DashboardIcon sx={{ fontSize: 16, color: T.primaryM }} />
              </Box>
              <Box
                component="span"
                sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
              >
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: T.primaryM,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Recruiters
                </Box>
                <span>•</span>
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: T.success,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Candidates
                </Box>
                <span>•</span>
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: T.warning,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Interviews
                </Box>
                <span>•</span>
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: T.purple,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Vendors
                </Box>
                <span>•</span>
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: T.info,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Jobs
                </Box>
              </Box>
            </Typography>

            {/* Live stats indicator */}
          </Box>

          {/* Right side with interactive buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              animation: "slideInRight 0.5s ease-out",
              "@keyframes slideInRight": {
                from: { opacity: 0, transform: "translateX(20px)" },
                to: { opacity: 1, transform: "translateX(0)" },
              },
            }}
          >
            {/* Refresh button with tooltip */}
            <Tooltip title="Refresh dashboard data" arrow placement="bottom">
              <IconButton
                onClick={() => {
                  setRefreshing(true);
                  fetchAll();
                }}
                disabled={refreshing}
                size="small"
                sx={{
                  borderRadius: "10px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  p: 1,
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 0,
                    height: 0,
                    borderRadius: "50%",
                    background: `${T.primaryM}20`,
                    transform: "translate(-50%, -50%)",
                    transition: "width 0.3s ease, height 0.3s ease",
                  },
                  "&:hover::before": {
                    width: "100px",
                    height: "100px",
                  },
                  "&:hover": {
                    background: T.primaryL,
                    borderColor: T.primaryM,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <RefreshIcon
                  sx={{
                    fontSize: 18,
                    color: T.primaryM,
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                    transition: "transform 0.2s ease",
                    "@keyframes spin": {
                      from: { transform: "rotate(0deg)" },
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>

            {/* Add Recruiter button with hover effect */}
            <Tooltip
              title="Create new recruiter account"
              arrow
              placement="bottom"
            >
              <Button
                onClick={openAddRecruiter}
                startIcon={
                  <AddIcon sx={{ transition: "transform 0.2s ease" }} />
                }
                variant="contained"
                size="small"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12,
                  background: T.primaryM,
                  position: "relative",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 0,
                    height: 0,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    transform: "translate(-50%, -50%)",
                    transition: "width 0.4s ease, height 0.4s ease",
                  },
                  "&:hover": {
                    background: T.primary,
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                    "&::after": {
                      width: "200px",
                      height: "200px",
                    },
                    "& .MuiButton-startIcon": {
                      transform: "rotate(90deg)",
                    },
                  },
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
                }}
              >
                {isMobile ? "Recruiter" : "Add Recruiter"}
              </Button>
            </Tooltip>

            {/* Add Vendor button with hover effect */}
            <Tooltip title="Register new vendor" arrow placement="bottom">
              <Button
                onClick={openAddVendor}
                startIcon={
                  <VendorIcon sx={{ transition: "transform 0.2s ease" }} />
                }
                variant="contained"
                size="small"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12,
                  background: T.purple,
                  position: "relative",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 0,
                    height: 0,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    transform: "translate(-50%, -50%)",
                    transition: "width 0.4s ease, height 0.4s ease",
                  },
                  "&:hover": {
                    background: "#6d28d9",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                    "&::after": {
                      width: "200px",
                      height: "200px",
                    },
                    "& .MuiButton-startIcon": {
                      transform: "rotate(90deg)",
                    },
                  },
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.2)",
                }}
              >
                {isMobile ? "Vendor" : "Add Vendor"}
              </Button>
            </Tooltip>

            {/* Create Job button with hover effect */}
            <Tooltip title="Post a new job opening" arrow placement="bottom">
              <Button
                onClick={() => navigate("/dashboard/jobs/createJob")}
                startIcon={
                  <WorkIcon sx={{ transition: "transform 0.2s ease" }} />
                }
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12,
                  borderColor: T.border,
                  color: T.textSub,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(120deg, transparent, ${T.info}10, transparent)`,
                    transform: "translateX(-100%)",
                    transition: "transform 0.5s ease",
                  },
                  "&:hover": {
                    background: T.bg,
                    borderColor: T.info,
                    color: T.info,
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(2,132,199,0.15)",
                    "&::before": {
                      transform: "translateX(100%)",
                    },
                    "& .MuiButton-startIcon": {
                      transform: "scale(1.1)",
                    },
                  },
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {isMobile ? "Job" : "Create Job"}
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2.5 }}>
          {[
            {
              label: "Total Recruiters",
              value: recruiters.length,
              sub: `${recruiters.filter((r) => r.isActive).length} active`,
              icon: <PeopleIcon sx={{ fontSize: 20 }} />,
              color: T.primaryM,
              bg: T.primaryL,
            },
            {
              label: "Candidates",
              value: candidates.length,
              sub: `Across all jobs`,
              icon: <CandidateIcon sx={{ fontSize: 20 }} />,
              color: T.success,
              bg: T.successBg,
            },
            {
              label: "Active Jobs",
              value: activeJobs.length,
              sub: `${jobs.length} total jobs`,
              icon: <WorkIcon sx={{ fontSize: 20 }} />,
              color: T.info,
              bg: T.infoBg,
            },
            {
              label: "Interviews",
              value: interviews.length,
              sub: `${interviews.filter((i) => i.status === "scheduled").length} scheduled`,
              icon: <InterviewIcon sx={{ fontSize: 20 }} />,
              color: T.warning,
              bg: T.warningBg,
            },
            {
              label: "Vendors",
              value: vendors.length,
              sub: `${vendors.filter((v) => v.isActive).length} active`,
              icon: <VendorIcon sx={{ fontSize: 20 }} />,
              color: T.purple,
              bg: T.purpleBg,
            },
          ].map((s, i) => (
            <Grid item key={i} xs={6} sm={4} md={2.4}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        <CandidatePipelineChart />

        {/* ── 4-Chart Analytics Row ──────────────────────────────── */}

        {/*  <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2.5 }}> */}
        {/* Chart 1 — Recruiter Activity (Bar) */}
        {/*   <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: "15px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                p: { xs: 2, sm: 2.5 },
                height: 300,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 13, color: T.text }}
                  >
                    👥 Recruiter Activity
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: T.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <span>
                      📊 {timeFilter === "weekly" ? "Weekly" : "Monthly"} trend
                      · Added vs active
                    </span>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.primaryM,
                        bgcolor: T.primaryL,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      ↑{" "}
                      {recruiterChartData.reduce(
                        (acc, curr) => acc + curr.added,
                        0,
                      )}{" "}
                      added
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.emerald,
                        bgcolor: "rgba(16,185,129,0.1)",
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      ✓{" "}
                      {recruiterChartData.reduce(
                        (acc, curr) => acc + curr.active,
                        0,
                      )}{" "}
                      active
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 0.5,
                  }}
                >
                  <Chip
                    label={`${recruiters.length} total`}
                    size="small"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: T.primaryL,
                      color: T.primaryM,
                    }}
                  />
                  <ToggleButtonGroup
                    size="small"
                    value={timeFilter}
                    exclusive
                    onChange={(e, val) => val && setTimeFilter(val)}
                    sx={{
                      height: 24,
                      "& .MuiToggleButton-root": {
                        fontSize: 10,
                        py: 0,
                        px: 1,
                        border: `1px solid ${T.border}`,
                        color: T.textMuted,
                      },
                    }}
                  >
                    <ToggleButton value="weekly">Week</ToggleButton>
                    <ToggleButton value="monthly">Month</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height="70%">
                <BarChart
                  data={recruiterChartData}
                  margin={{ left: -22, right: 4 }}
                  barGap={2}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={T.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: T.textMuted, fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: T.textMuted, fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<DarkTip />} />
                  <Bar
                    dataKey="added"
                    name="Added"
                    fill={T.primaryM}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="active"
                    name="Active"
                    fill={T.emerald}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  mt: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                  ⚡ Peak activity:{" "}
                  {
                    recruiterChartData.reduce((max, curr) =>
                      curr.added > max.added ? curr : max,
                    ).name
                  }
                </Typography>
                <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                  Retention:{" "}
                  {Math.round(
                    (recruiterChartData.reduce(
                      (acc, curr) => acc + curr.active,
                      0,
                    ) /
                      recruiterChartData.reduce(
                        (acc, curr) => acc + curr.added,
                        0,
                      )) *
                      100,
                  )}
                  %
                </Typography>
              </Box>
            </Card>
          </Grid> */}

        {/* Chart 2 — Jobs Trend (Area) */}
        {/*  <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                p: { xs: 2, sm: 2.5 },
                height: 300,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 13, color: T.text }}
                  >
                    📋 Job Postings Trend
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: T.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <span>
                      📈 Active vs inactive ·{" "}
                      {timeFilter === "weekly" ? "Weekly" : "Monthly"} view
                    </span>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.info,
                        bgcolor: T.infoBg,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      📌{" "}
                      {jobsChartData.reduce(
                        (acc, curr) => acc + curr.active,
                        0,
                      )}{" "}
                      active
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.danger,
                        bgcolor: "rgba(239,68,68,0.1)",
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      ⏸️{" "}
                      {jobsChartData.reduce(
                        (acc, curr) => acc + curr.inactive,
                        0,
                      )}{" "}
                      inactive
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${jobs.length} total`}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: T.infoBg,
                    color: T.info,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height="70%">
                <AreaChart
                  data={jobsChartData}
                  margin={{ left: -22, right: 4 }}
                >
                  <defs>
                    <linearGradient id="gActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.info} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={T.info} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gInactive" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={T.danger}
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor={T.danger} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={T.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: T.textMuted, fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: T.textMuted, fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<DarkTip />} />
                  <Area
                    type="monotone"
                    dataKey="active"
                    name="Active"
                    stroke={T.info}
                    strokeWidth={2}
                    fill="url(#gActive)"
                  />
                  <Area
                    type="monotone"
                    dataKey="inactive"
                    name="Inactive"
                    stroke={T.danger}
                    strokeWidth={2}
                    fill="url(#gInactive)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  mt: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                  📊 Growth:{" "}
                  {jobsChartData.length > 1
                    ? `${(((jobsChartData[jobsChartData.length - 1].active - jobsChartData[0].active) / jobsChartData[0].active) * 100).toFixed(0)}%`
                    : "0%"}
                </Typography>
                <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                  🎯 Fill rate:{" "}
                  {Math.round(
                    (jobsChartData.reduce((acc, curr) => acc + curr.active, 0) /
                      jobs.length) *
                      100,
                  )}
                  %
                </Typography>
              </Box>
            </Card>
          </Grid> */}

        {/* Chart 3 — Jobs by Department (Bar) */}
        {/*   <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                p: { xs: 2, sm: 2.5 },
                height: 300,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 13, color: T.text }}
                  >
                    🏢 Jobs by Department
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: T.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <span>📌 Active jobs distribution</span>
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.success,
                        bgcolor: T.successBg,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      🏢 {activeJobs.length} active depts
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.info,
                        bgcolor: T.infoBg,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      📊 {Object.keys(deptMap).length} total depts
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={`${activeJobs.length} active`}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: T.successBg,
                    color: T.success,
                  }}
                />
              </Box>

              {deptData.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70%",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: T.textMuted }}>
                    No job data
                  </Typography>
                </Box>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="65%">
                    <BarChart
                      data={deptData}
                      layout="vertical"
                      margin={{ left: 0, right: 8 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={T.border}
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: T.textMuted, fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: T.textMuted, fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
                      />
                      <ChartTooltip content={<DarkTip />} />
                      <Bar
                        dataKey="value"
                        name="Jobs"
                        fill={T.info}
                        radius={[0, 4, 4, 0]}
                        maxBarSize={16}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                      🏆 Top: {topDept} ({deptData[0]?.value} jobs)
                    </Typography>

                    <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                      📈 Avg per dept:{" "}
                      {deptData.length
                        ? Math.round(activeJobs.length / deptData.length)
                        : 0}
                    </Typography>
                  </Box>
                </>
              )}
            </Card>
          </Grid> */}

        {/* Chart 4 — Vendor Industry Breakdown (Donut Pie) */}
        {/*           <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                p: { xs: 2, sm: 2.5 },
                height: 300,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 13, color: T.text }}
                  >
                    🤝 Vendor Breakdown
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: T.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <span>🏭 By industry / type</span>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.purple,
                        bgcolor: T.purpleBg,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      🏭 {vendorIndustryData.length} industries
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: T.warning,
                        bgcolor: T.warningBg,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      🤝 {vendors.length} vendors
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${vendors.length} total`}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: T.purpleBg,
                    color: T.purple,
                  }}
                />
              </Box>
              {vendorIndustryData.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70%",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: T.textMuted }}>
                    No vendor data
                  </Typography>
                </Box>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="55%">
                    <PieChart>
                      <Pie
                        data={vendorIndustryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={56}
                        paddingAngle={3}
                        dataKey="value"
                        isAnimationActive
                      >
                        {vendorIndustryData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<DarkTip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.4,
                      mt: 0.5,
                    }}
                  >
                    {vendorIndustryData.slice(0, 4).map((d, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                          }}
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: PIE_COLORS[i % PIE_COLORS.length],
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 10,
                              color: T.textSub,
                              fontWeight: 500,
                            }}
                            noWrap
                          >
                            {d.name}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ fontSize: 10, fontWeight: 700, color: T.text }}
                        >
                          {d.value}
                        </Typography>
                      </Box>
                    ))}
                    {vendorIndustryData.length > 4 && (
                      <Typography
                        sx={{
                          fontSize: 9,
                          color: T.textMuted,
                          textAlign: "center",
                          mt: 0.5,
                        }}
                      >
                        +{vendorIndustryData.length - 4} more industries
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{ mt: 0.5, display: "flex", justifyContent: "center" }}
                  >
                    <Typography sx={{ fontSize: 9, color: T.textMuted }}>
                      🏭 Top industry: {vendorIndustryData[0]?.name} (
                      {Math.round(
                        (vendorIndustryData[0]?.value / vendors.length) * 100,
                      )}
                      %)
                    </Typography>
                  </Box>
                </>
              )}
            </Card>
          </Grid> */}
        {/* </Grid> */}

        {/* Tabs */}
        {/* <Box sx={{ borderBottom: `1px solid ${T.border}`, mb: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: 13, minWidth: 0, px: { xs: 1.5, sm: 2.5 } }, '& .MuiTabs-indicator': { background: T.primaryM, height: 3, borderRadius: '3px 3px 0 0' } }}>
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><PeopleIcon sx={{ fontSize: 16 }} />{!isMobile && 'Recruiters'}<Chip label={recruiters.length} size="small" sx={{ fontSize: 9, fontWeight: 700, background: T.primaryL, color: T.primaryM, height: 18, ml: .5 }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><CandidateIcon sx={{ fontSize: 16 }} />{!isMobile && 'Candidates'}<Chip label={candidates.length} size="small" sx={{ fontSize: 9, fontWeight: 700, background: T.successBg, color: T.success, height: 18, ml: .5 }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><InterviewIcon sx={{ fontSize: 16 }} />{!isMobile && 'Interviews'}<Chip label={interviews.length} size="small" sx={{ fontSize: 9, fontWeight: 700, background: T.warningBg, color: T.warning, height: 18, ml: .5 }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><VendorIcon sx={{ fontSize: 16 }} />{!isMobile && 'Vendors'}<Chip label={vendors.length} size="small" sx={{ fontSize: 9, fontWeight: 700, background: T.purpleBg, color: T.purple, height: 18, ml: .5 }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><WorkIcon sx={{ fontSize: 16 }} />{!isMobile && 'Jobs'}<Chip label={jobs.length} size="small" sx={{ fontSize: 9, fontWeight: 700, background: T.infoBg, color: T.info, height: 18, ml: .5 }} /></Box>} />
          </Tabs>
        </Box> */}

        {/* ── RECRUITERS TAB ────────────────────────────────────── */}
        {/*   {activeTab === 0 && (
          <SC title="Recruiters" count={filteredR.length} action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Search…" value={searchR} onChange={e => setSearchR(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: T.textMuted }} /></InputAdornment>, sx: { borderRadius: '9px', background: T.bg, fontSize: 12 } }}
                sx={{ width: { xs: 130, sm: 180 }, '& fieldset': { borderColor: T.border } }} />
              <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                sx={{ '& .MuiToggleButton-root': { border: `1px solid ${T.border}`, borderRadius: '8px !important', px: 1, py: .5, '&.Mui-selected': { background: T.primaryM, color: '#fff' } } }}>
                <ToggleButton value="table"><TableIcon sx={{ fontSize: 14 }} /></ToggleButton>
                <ToggleButton value="grid"><GridIcon sx={{ fontSize: 14 }} /></ToggleButton>
              </ToggleButtonGroup>
            </Box>
          }>
            {viewMode === 'grid' ? (
              <Box sx={{ p: 2 }}>
                {filteredR.length === 0 ? <Box sx={{ textAlign: 'center', py: 5 }}><Typography sx={{ color: T.textMuted, fontSize: 13 }}>No recruiters found</Typography></Box> : (
                  <Grid container spacing={2}>
                    {filteredR.map(r => (
                      <Grid item key={r._id} xs={12} sm={6} md={4}>
                        <RecruiterCard r={r}
                          onView={() => setRecruiterView(r)}
                          onEdit={() => openEditRecruiter(r)}
                          onDelete={() => setDeleteTarget({ type: 'recruiter', id: r._id, name: `${r.firstName} ${r.lastName}` })}
                          onEmail={() => handleResendEmail(r._id)} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 620 }}>
                  {tableHead(['Recruiter', 'Username', 'Department', 'Designation', 'Location', 'Status', 'Actions'])}
                  <TableBody>
                    {filteredR.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: T.textMuted, fontSize: 13 }}>No recruiters found</TableCell></TableRow>}
                    {filteredR.map(r => {
                      const name = `${r.firstName || ''} ${r.lastName || ''}`.trim();
                      return (
                        <TableRow key={r._id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: '#f8fafc' }, cursor: 'pointer' }}
                          onClick={() => setRecruiterView(r)}>
                          <TableCell sx={{ px: 2.5, py: 1.3 }} onClick={e => e.stopPropagation()}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar src={r.profilePicture} sx={{ width: 34, height: 34, background: aC(r.firstName || ''), fontSize: 13, fontWeight: 700 }}>
                                {!r.profilePicture && name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: 13, color: T.text, lineHeight: 1.3 }}>{name}</Typography>
                                <Typography sx={{ fontSize: 11, color: T.textMuted }}>{r.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ px: 1.5, py: 1.3 }}><Typography sx={{ fontSize: 12, color: T.textSub }}>{r.username}</Typography></TableCell>
                          <TableCell sx={{ px: 1.5, py: 1.3 }}><Typography sx={{ fontSize: 12, color: T.textSub }}>{r.department || '—'}</Typography></TableCell>
                          <TableCell sx={{ px: 1.5, py: 1.3 }}><Typography sx={{ fontSize: 12, color: T.textSub }}>{r.designation || '—'}</Typography></TableCell>
                          <TableCell sx={{ px: 1.5, py: 1.3 }}><Typography sx={{ fontSize: 12, color: T.textSub }}>{r.location || '—'}</Typography></TableCell>
                          <TableCell sx={{ px: 1.5, py: 1.3 }} onClick={e => e.stopPropagation()}>
                            <Chip label={r.isActive ? 'Active' : 'Inactive'} size="small" sx={{ fontSize: 10, fontWeight: 700, background: r.isActive ? T.successBg : T.dangerBg, color: r.isActive ? T.success : T.danger }} />
                          </TableCell>
                          <TableCell align="right" sx={{ px: 1.5, py: 1.3 }} onClick={e => e.stopPropagation()}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: .5 }}>
                              {[{tip:'Email',icon:<EmailIcon/>,color:T.sky,fn:()=>handleResendEmail(r._id)},{tip:'View',icon:<ViewIcon/>,color:T.primaryM,fn:()=>setRecruiterView(r)},{tip:'Edit',icon:<EditIcon/>,color:T.amber,fn:()=>openEditRecruiter(r)},{tip:'Delete',icon:<DeleteIcon/>,color:T.danger,fn:()=>setDeleteTarget({type:'recruiter',id:r._id,name})}].map(a => (
                                <Tooltip key={a.tip} title={a.tip} arrow>
                                  <IconButton onClick={a.fn} size="small" sx={{ borderRadius: '7px', p: .5, color: a.color, background: `${a.color}12`, '&:hover': { background: a.color, color: '#fff' }, transition: 'all .15s' }}>
                                    {React.cloneElement(a.icon, { sx: { fontSize: 14 } })}
                                  </IconButton>
                                </Tooltip>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            )}
          </SC>
        )}
 */}
        {/* ── CANDIDATES TAB ────────────────────────────────────── */}
        {/*    {activeTab === 1 && (
          <SC title="Candidates" count={filteredC.length} action={
            <TextField size="small" placeholder="Search…" value={searchC} onChange={e => setSearchC(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: T.textMuted }} /></InputAdornment>, sx: { borderRadius: '9px', background: T.bg, fontSize: 12 } }}
              sx={{ width: { xs: 130, sm: 180 }, '& fieldset': { borderColor: T.border } }} />
          }>
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              {filteredC.length === 0 ? <Box sx={{ textAlign: 'center', py: 5 }}><Typography sx={{ color: T.textMuted, fontSize: 13 }}>No candidates found</Typography></Box> : (
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {filteredC.map(c => (
                    <Grid item key={c._id} xs={12} sm={6} md={4} lg={3}>
                      <CandidateCard c={c} onView={() => setCandidateView(c)} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </SC>
        )}
 */}
        {/* ── INTERVIEWS TAB ────────────────────────────────────── */}
        {/*   {activeTab === 2 && (
          <SC title="Interviews" count={filteredI.length} action={
            <TextField size="small" placeholder="Search…" value={searchI} onChange={e => setSearchI(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: T.textMuted }} /></InputAdornment>, sx: { borderRadius: '9px', background: T.bg, fontSize: 12 } }}
              sx={{ width: { xs: 130, sm: 180 }, '& fieldset': { borderColor: T.border } }} />
          }>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 600 }}>
                {tableHead(['Candidate', 'Date & Time', 'Platform', 'Interviewers', 'Scheduled By', 'Status', 'Actions'])}
                <TableBody>
                  {filteredI.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: T.textMuted, fontSize: 13 }}>No interviews found</TableCell></TableRow>}
                  {filteredI.map(iv => (
                    <TableRow key={iv._id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: '#f8fafc' }, cursor: 'pointer' }} onClick={() => setInterviewView(iv)}>
                      <TableCell sx={{ px: 2.5, py: 1.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, background: aC(iv.candidate?.name || ''), fontSize: 12, fontWeight: 700 }}>{iv.candidate?.name?.charAt(0)}</Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: 13, color: T.text, lineHeight: 1.3 }}>{iv.candidate?.name}</Typography>
                            <Typography sx={{ fontSize: 11, color: T.textMuted }}>{iv.candidate?.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Typography sx={{ fontSize: 12, color: T.text, fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtDate(iv.date)}</Typography>
                        <Typography sx={{ fontSize: 11, color: T.textMuted }}>{iv.startTime} · {iv.duration}m</Typography>
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Chip label={iv.platform?.replace('_', ' ')} size="small" sx={{ fontSize: 10, fontWeight: 600, background: T.indigoL, color: T.indigo, textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Box sx={{ display: 'flex', gap: .5 }}>
                          {iv.interviewers?.slice(0, 2).map((ir, i) => (
                            <Tooltip key={i} title={ir.name}>
                              <Avatar sx={{ width: 24, height: 24, background: aC(ir.name || ''), fontSize: 10, fontWeight: 700 }}>{ir.name?.charAt(0)}</Avatar>
                            </Tooltip>
                          ))}
                          {iv.interviewers?.length > 2 && <Avatar sx={{ width: 24, height: 24, background: T.border, fontSize: 10, color: T.textMuted }}>+{iv.interviewers.length - 2}</Avatar>}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}><Typography sx={{ fontSize: 12, color: T.textSub }} noWrap>{iv.scheduledBy?.email}</Typography></TableCell>
                      <TableCell sx={{ px: 1.5, py: 1.3 }}>
                        <Chip label={iv.status || 'scheduled'} size="small"
                          sx={{ fontSize: 10, fontWeight: 700, textTransform: 'capitalize',
                            background: { scheduled: T.primaryL, completed: T.successBg, cancelled: T.dangerBg }[iv.status] || T.bg,
                            color:      { scheduled: T.primaryM, completed: T.success, cancelled: T.danger }[iv.status] || T.textMuted }} />
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1.5, py: 1.3 }}>
                        <Tooltip title="View Details" arrow>
                          <IconButton onClick={() => setInterviewView(iv)} size="small" sx={{ borderRadius: '7px', p: .5, color: T.primaryM, background: T.primaryL, '&:hover': { background: T.primaryM, color: '#fff' } }}>
                            <ViewIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </SC>
        )} */}

        {/* ── VENDORS TAB ───────────────────────────────────────── */}
        {/*  {activeTab === 3 && (
          <SC title="Vendors" count={filteredV.length} action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Search…" value={searchV} onChange={e => setSearchV(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: T.textMuted }} /></InputAdornment>, sx: { borderRadius: '9px', background: T.bg, fontSize: 12 } }}
                sx={{ width: { xs: 130, sm: 180 }, '& fieldset': { borderColor: T.border } }} />
              <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                sx={{ '& .MuiToggleButton-root': { border: `1px solid ${T.border}`, borderRadius: '8px !important', px: 1, py: .5, '&.Mui-selected': { background: T.purple, color: '#fff' } } }}>
                <ToggleButton value="table"><TableIcon sx={{ fontSize: 14 }} /></ToggleButton>
                <ToggleButton value="grid"><GridIcon sx={{ fontSize: 14 }} /></ToggleButton>
              </ToggleButtonGroup>
            </Box>
          }>
            {viewMode === 'grid' ? (
              <Box sx={{ p: 2 }}>
                {filteredV.length === 0 ? <Box sx={{ textAlign: 'center', py: 5 }}><Typography sx={{ color: T.textMuted, fontSize: 13 }}>No vendors found</Typography></Box> : (
                  <Grid container spacing={2}>
                    {filteredV.map(v => (
                      <Grid item key={v._id} xs={12} sm={6} md={4}>
                        <VendorCard v={v} onView={() => setVendorView(v)} onDelete={() => setDeleteTarget({ type: 'vendor', id: v._id, name: v.companyName })} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 600 }}>
                  {tableHead(['Company', 'Type', 'Industry', 'Contact', 'Billing', 'Status', 'Actions'])}
                  <TableBody>
                    {filteredV.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: T.textMuted, fontSize: 13 }}>No vendors found</TableCell></TableRow>}
                    {filteredV.map(v => (
                      <TableRow key={v._id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: '#f8fafc' }, cursor: 'pointer' }} onClick={() => setVendorView(v)}>
                        <TableCell sx={{ px: 2.5, py: 1.3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, background: T.purple, fontSize: 12, fontWeight: 700 }}>{v.companyName?.charAt(0)}</Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: 13, color: T.text }}>{v.companyName}</Typography>
                              <Typography sx={{ fontSize: 11, color: T.textMuted }}>{v.companyEmail}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}><Chip label={v.vendorType} size="small" sx={{ fontSize: 10, fontWeight: 600, background: T.purpleBg, color: T.purple }} /></TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}><Typography sx={{ fontSize: 12, color: T.textSub }}>{v.industry || '—'}</Typography></TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.text }}>{`${v.firstName || ''} ${v.lastName || ''}`.trim() || '—'}</Typography>
                          <Typography sx={{ fontSize: 11, color: T.textMuted }}>{v.phone}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap' }}>{v.billingCycle} · {v.paymentTerms}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }} onClick={e => e.stopPropagation()}>
                          <Chip label={v.isActive ? 'Active' : 'Inactive'} size="small" sx={{ fontSize: 10, fontWeight: 700, background: v.isActive ? T.successBg : T.dangerBg, color: v.isActive ? T.success : T.danger }} />
                        </TableCell>
                        <TableCell align="right" sx={{ px: 1.5, py: 1.3 }} onClick={e => e.stopPropagation()}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: .5 }}>
                            <Tooltip title="View" arrow><IconButton onClick={() => setVendorView(v)} size="small" sx={{ borderRadius: '7px', p: .5, color: T.purple, background: T.purpleBg, '&:hover': { background: T.purple, color: '#fff' } }}><ViewIcon sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                            <Tooltip title="Delete" arrow><IconButton onClick={() => setDeleteTarget({ type: 'vendor', id: v._id, name: v.companyName })} size="small" sx={{ borderRadius: '7px', p: .5, color: T.danger, background: T.dangerBg, '&:hover': { background: T.danger, color: '#fff' } }}><DeleteIcon sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </SC>
        )} */}

        {/* ── JOBS TAB ──────────────────────────────────────────── */}
        {/*  {activeTab === 4 && (
          <SC title="Jobs" count={filteredJ.length} action={
            <TextField size="small" placeholder="Search…" value={searchJ} onChange={e => setSearchJ(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: T.textMuted }} /></InputAdornment>, sx: { borderRadius: '9px', background: T.bg, fontSize: 12 } }}
              sx={{ width: { xs: 130, sm: 180 }, '& fieldset': { borderColor: T.border } }} />
          }>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 800 }}>
                {tableHead(['Job', 'Department', 'Type', 'Location', 'Openings', 'Salary', 'Target Date', 'Priority', 'Status'])}
                <TableBody>
                  {filteredJ.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 5, color: T.textMuted, fontSize: 13 }}>No jobs found</TableCell>
                    </TableRow>
                  )}
                  {filteredJ.map(j => {
                    const loc = j.jobFormId?.locations?.map(l => l.name).join(', ') || '—';
                    const salary = j.jobFormId?.amount
                      ? `${j.jobFormId.currency || '₹'} ${Number(j.jobFormId.amount).toLocaleString('en-IN')}`
                      : '—';
                    const targetDate = j.jobFormId?.targetHireDate
                      ? new Date(j.jobFormId.targetHireDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—';
                    return (
                      <TableRow key={j._id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: '#f8fafc' } }}>
                        <TableCell sx={{ px: 2.5, py: 1.3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: T.infoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <WorkIcon sx={{ fontSize: 16, color: T.info }} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: 13, color: T.text, lineHeight: 1.3 }}>{j.jobTitle}</Typography>
                              <Typography sx={{ fontSize: 11, color: T.textMuted }}>{j.jobName} · {j.experience}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub }}>{j.department || '—'}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Chip label={j.jobFormId?.jobType || '—'} size="small" sx={{ fontSize: 10, fontWeight: 600, background: T.indigoL, color: T.indigo }} />
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub }}>{loc}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.text, fontWeight: 700 }}>{j.jobFormId?.openings ?? '—'}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap' }}>{salary}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Typography sx={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap' }}>{targetDate}</Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          {j.jobFormId?.markPriority
                            ? <Chip label="Priority" size="small" sx={{ fontSize: 10, fontWeight: 700, background: T.amberL, color: T.amber }} />
                            : <Typography sx={{ fontSize: 12, color: T.textMuted }}>—</Typography>}
                        </TableCell>
                        <TableCell sx={{ px: 1.5, py: 1.3 }}>
                          <Chip
                            label={j.status}
                            size="small"
                            sx={{
                              fontSize: 10, fontWeight: 700,
                              background: j.status === 'Active' ? T.successBg : T.dangerBg,
                              color: j.status === 'Active' ? T.success : T.danger,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </SC>
        )} */}

        {/*   <Box sx={{ mt: 4 }}>
          <CandidatePipeline /> 
       
        </Box>
        <Box sx={{ mt: 2.5, mb: 3 }}>
          <InterviewCalendar />
        </Box> */}

        {/* ══════════ DIALOGS ══════════ */}

        {/* Add/Edit Recruiter */}
        <Dialog
          open={recruiterDialog}
          onClose={() => {
            if (!saving) {
              setRecruiterDialog(false);
            }
          }}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              p: 0,
              maxHeight: "92vh",
              "&::-webkit-scrollbar": { width: 5 },
              "&::-webkit-scrollbar-thumb": {
                background: T.primaryM,
                borderRadius: 3,
              },
            },
          }}
        >
          {saving && (
            <LinearProgress
              sx={{
                height: 2.5,
                "& .MuiLinearProgress-bar": { background: "#93c5fd" },
              }}
            />
          )}
          {saveSuccess ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                py: 5,
                px: 4,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: T.successBg,
                  border: `3px solid ${T.success}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                  animation: "pop .45s cubic-bezier(.34,1.56,.64,1)",
                  "@keyframes pop": {
                    "0%": { transform: "scale(0.4)", opacity: 0 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                <SuccessCircleIcon sx={{ fontSize: 48, color: T.success }} />
              </Box>
              <Typography
                sx={{ fontSize: 22, fontWeight: 900, color: T.text, mb: 0.75 }}
              >
                {editingId ? "Recruiter Updated!" : "Recruiter Added!"}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13.5,
                  color: T.textSub,
                  mb: 3.5,
                  maxWidth: 320,
                }}
              >
                The recruiter account has been{" "}
                {editingId ? "updated" : "created"} successfully.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.75,
                  textAlign: "left",
                  background: T.primaryL,
                  border: `1.5px solid ${T.primaryM}20`,
                  borderRadius: "14px",
                  px: 2.5,
                  py: 2,
                  maxWidth: 370,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "11px",
                    background: T.primaryM,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MailSentIcon sx={{ color: "#fff", fontSize: 21 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: T.primaryM,
                      mb: 0.4,
                    }}
                  >
                    Credentials sent!
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: T.textSub }}>
                    <b style={{ color: T.text }}>{savedEmail}</b>
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => setRecruiterDialog(false)}
                variant="contained"
                sx={{
                  mt: 4,
                  borderRadius: "11px",
                  px: 5,
                  py: 1.3,
                  fontSize: 14,
                  fontWeight: 800,
                  textTransform: "none",
                  background: T.primaryM,
                  "&:hover": { background: T.primary },
                }}
              >
                Done
              </Button>
            </Box>
          ) : (
            <RecruiterForm
              formData={recruiterForm}
              setFormData={setRecruiterForm}
              formErrors={recruiterFormErrors}
              setFormErrors={setRecruiterFormErrors}
              onSubmit={handleSaveRecruiter}
              onCancel={() => setRecruiterDialog(false)}
              submitting={saving}
              isEditing={!!editingId}
            />
          )}
        </Dialog>

        {/* Add Vendor */}
        <Dialog
          open={vendorDialog}
          onClose={() => {
            if (!vendorSaving) setVendorDialog(false);
          }}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              p: 0,
              maxHeight: "92vh",
              "&::-webkit-scrollbar": { width: 5 },
              "&::-webkit-scrollbar-thumb": {
                background: T.purple,
                borderRadius: 3,
              },
            },
          }}
        >
          {vendorSaving && (
            <LinearProgress
              sx={{
                height: 2.5,
                "& .MuiLinearProgress-bar": { background: "#c4b5fd" },
              }}
            />
          )}
          {vendorSuccess ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                py: 5,
                px: 4,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: T.successBg,
                  border: `3px solid ${T.success}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                  animation: "pop .45s cubic-bezier(.34,1.56,.64,1)",
                  "@keyframes pop": {
                    "0%": { transform: "scale(0.4)", opacity: 0 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                <SuccessCircleIcon sx={{ fontSize: 48, color: T.success }} />
              </Box>
              <Typography
                sx={{ fontSize: 22, fontWeight: 900, color: T.text, mb: 0.75 }}
              >
                Vendor Registered!
              </Typography>
              <Typography
                sx={{
                  fontSize: 13.5,
                  color: T.textSub,
                  mb: 3.5,
                  maxWidth: 340,
                }}
              >
                The vendor account has been created and is ready to use.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.75,
                  textAlign: "left",
                  background: T.purpleBg,
                  border: `1.5px solid ${T.purple}20`,
                  borderRadius: "14px",
                  px: 2.5,
                  py: 2,
                  maxWidth: 380,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "11px",
                    background: T.purple,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MailSentIcon sx={{ color: "#fff", fontSize: 21 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: T.purple,
                      mb: 0.4,
                    }}
                  >
                    Credentials sent!
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: T.textSub }}>
                    <b style={{ color: T.text }}>{savedVendorEmail}</b>
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => setVendorDialog(false)}
                variant="contained"
                sx={{
                  mt: 4,
                  borderRadius: "11px",
                  px: 5,
                  py: 1.3,
                  fontSize: 14,
                  fontWeight: 800,
                  textTransform: "none",
                  background: T.purple,
                  "&:hover": { background: "#6d28d9" },
                }}
              >
                Done
              </Button>
            </Box>
          ) : (
            <VendorForm
              formData={vendorForm}
              setFormData={setVendorForm}
              formErrors={vendorFormErrors}
              setFormErrors={setVendorFormErrors}
              onSubmit={handleRegisterVendor}
              onCancel={() => setVendorDialog(false)}
              submitting={vendorSaving}
            />
          )}
        </Dialog>

        {/* View Dialogs */}
        <RecruiterViewDialog
          open={!!recruiterView}
          onClose={() => setRecruiterView(null)}
          recruiter={recruiterView}
          onEdit={() => openEditRecruiter(recruiterView)}
          onDelete={() => {
            setDeleteTarget({
              type: "recruiter",
              id: recruiterView._id,
              name: `${recruiterView.firstName} ${recruiterView.lastName}`,
            });
            setRecruiterView(null);
          }}
        />

        <CandidateViewDialog
          open={!!candidateView}
          onClose={() => setCandidateView(null)}
          candidate={candidateView}
        />

        <VendorViewDialog
          open={!!vendorView}
          onClose={() => setVendorView(null)}
          vendor={vendorView}
          onDelete={() => {
            setDeleteTarget({
              type: "vendor",
              id: vendorView._id,
              name: vendorView.companyName,
            });
            setVendorView(null);
          }}
        />

        <InterviewViewDialog
          open={!!interviewView}
          onClose={() => setInterviewView(null)}
          interview={interviewView}
        />

        {/* Delete Confirm */}
        <DeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          name={deleteTarget?.name || ""}
          onConfirm={async () => {
            try {
              if (deleteTarget.type === "recruiter")
                await adminService.deleteRecruiter(deleteTarget.id);
              // add vendor delete service call here if available
              setDeleteTarget(null);
              fetchAll();
              toast(
                `${deleteTarget.type === "recruiter" ? "Recruiter" : "Vendor"} deleted`,
              );
            } catch {
              toast("Failed to delete", "error");
            }
          }}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,.14)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;
