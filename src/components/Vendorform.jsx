import React from 'react';
import {
  Box, Typography, TextField, Button,
  FormControl, Select, FormHelperText,
  InputAdornment, Paper,
  Chip, MenuItem,
  Card, CardContent,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

/* ── Design tokens — identical to OrganizationForm ───────────── */
const T = {
  navy:     '#0F172A',
  slate:    '#334155',
  muted:    '#64748B',
  border:   '#E2E8F0',
  bg:       '#F8FAFC',
  card:     '#FFFFFF',
  indigo:   '#4F46E5',
  indigoL:  '#818CF8',
  indigoS:  '#EEF2FF',
  emerald:  '#10B981',
  emeraldS: '#D1FAE5',
  rose:     '#F43F5E',
  roseS:    '#FFE4E6',
  amber:    '#F59E0B',
  amberS:   '#FEF3C7',
  sky:      '#0EA5E9',
  skyS:     '#E0F2FE',
  purple:   '#8B5CF6',
  purpleS:  '#EDE9FE',
};

const INDUSTRY_OPTIONS = [
  'Information Technology', 'Healthcare', 'Finance', 'Education',
  'Retail', 'Manufacturing', 'Construction', 'Telecommunications',
  'Transportation and Logistics', 'Marketing and Advertising',
  'Legal Services', 'Human Resources / Staffing', 'Real Estate',
  'Media and Entertainment', 'Government', 'Non-Profit',
  'Energy and Utilities', 'Hospitality', 'Agriculture',
  'Aerospace and Defense', 'E-commerce', 'Pharmaceuticals',
  'Automotive', 'Insurance', 'Consulting', 'Other',
];

/* ── Shared input styles ──────────────────────────────────────── */
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: '#FFFFFF',
    fontSize: 14,
    transition: 'all 0.2s ease',
    '&:hover fieldset':       { borderColor: T.purple },
    '&.Mui-focused fieldset': { borderColor: T.purple, borderWidth: 2, boxShadow: `0 0 0 4px ${T.purpleS}` },
  },
  '& .MuiOutlinedInput-root.Mui-error': {
    '&:hover fieldset':       { borderColor: T.rose },
    '&.Mui-focused fieldset': { borderColor: T.rose, boxShadow: `0 0 0 4px ${T.roseS}` },
  },
  '& .MuiInputLabel-root':     { fontSize: 14, fontWeight: 500, color: T.slate },
  '& .MuiFormHelperText-root': { fontSize: 11, marginLeft: 0.5, marginTop: 0.5 },
};

/* ── TwoCol — pure CSS grid, always exactly 2 equal columns ───── */
const TwoCol = ({ children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
    {children}
  </Box>
);

/* ════════════════════════════════════════════════════════════════
   VendorForm
═══════════════════════════════════════════════════════════════ */
const VendorForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  onCancel,
  submitting,
}) => {

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  /* ── Reusable field builders ───────────────────────────────── */
  const textField = (label, name, required = false, icon, placeholder = '', type = 'text') => (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
        {label}{required && <span style={{ color: T.rose }}> *</span>}
      </Typography>
      <TextField
        fullWidth
        name={name}
        type={type}
        value={formData[name] || ''}
        onChange={handleChange}
        error={!!formErrors[name]}
        helperText={formErrors[name]}
        placeholder={placeholder}
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start">
              {React.cloneElement(icon, {
                sx: { fontSize: 18, color: formErrors[name] ? T.rose : (formData[name] ? T.purple : T.muted) },
              })}
            </InputAdornment>
          ),
        }}
        sx={inputSx}
      />
    </Box>
  );

  const selectField = (label, name, options, required = false, icon) => (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
        {label}{required && <span style={{ color: T.rose }}> *</span>}
      </Typography>
      <FormControl fullWidth error={!!formErrors[name]}>
        <Select
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          displayEmpty
          MenuProps={{ PaperProps: { sx: { maxHeight: 280, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } } }}
          sx={{
            borderRadius: '10px',
            background: '#FFFFFF',
            fontSize: 14,
            '& .MuiSelect-select': { py: 1.55, display: 'flex', alignItems: 'center', gap: 1 },
            '&:hover .MuiOutlinedInput-notchedOutline':       { borderColor: T.purple },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: T.purple, borderWidth: 2, boxShadow: `0 0 0 4px ${T.purpleS}`,
            },
          }}
          startAdornment={
            icon && (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                {React.cloneElement(icon, { sx: { fontSize: 18, color: T.muted } })}
              </InputAdornment>
            )
          }
          renderValue={(selected) =>
            selected
              ? <span>{selected}</span>
              : <span style={{ color: T.muted }}>Select {label}</span>
          }
        >
          <MenuItem value="" disabled>
            <span style={{ color: T.muted }}>Select {label}</span>
          </MenuItem>
          {options.map(opt => (
            <MenuItem key={opt} value={opt} sx={{ fontSize: 13, py: 1 }}>{opt}</MenuItem>
          ))}
        </Select>
        {formErrors[name] && <FormHelperText>{formErrors[name]}</FormHelperText>}
      </FormControl>
    </Box>
  );

  /* ── Section card wrapper — identical to OrganizationForm ──── */
  const sectionCard = (icon, title, subtitle, color, children) => (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: '20px',
        border: `1px solid ${T.border}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: color },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          background: `linear-gradient(90deg, ${color}08, transparent)`,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box sx={{ p: 1, borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: T.navy }}>{title}</Typography>
          <Typography sx={{ fontSize: 13, color: T.muted }}>{subtitle}</Typography>
        </Box>
        <Chip
          label="Required Fields"
          size="small"
          sx={{ background: `${color}10`, color, fontSize: 11, fontWeight: 600, borderRadius: '8px', border: `1px solid ${color}30` }}
        />
      </Box>
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  );

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <Box sx={{ maxWidth: '820px', margin: '0 auto', p: { xs: 2, sm: 3 }, background: '#FFFFFF' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${T.purple} 0%, #5b21b6 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -20,   right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: '16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <BusinessIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 26, letterSpacing: -0.5 }}>
                Register New Vendor
              </Typography>
              <Typography sx={{ fontSize: 14, opacity: 0.9, mt: 0.5 }}>
                Complete all sections to register a new vendor
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Contact Person', 'Company Details'].map((step) => (
              <Chip
                key={step}
                label={step}
                size="small"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 11,
                  '&:hover': { background: 'rgba(255,255,255,0.25)' },
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ── Contact Person ──────────────────────────────────── */}
      {sectionCard(
        <PersonIcon />,
        'Contact Person',
        'Primary contact details for this vendor',
        T.purple,
        <TwoCol>
          {textField('First Name',  'firstName',   true,  <PersonIcon />, 'John')}
          {textField('Last Name',   'lastName',    true,  <PersonIcon />, 'Doe')}
          {textField('Email Address', 'email',     true,  <EmailIcon />,  'contact@vendor.com', 'email')}
          {textField('Phone',       'phone',       false, <PhoneIcon />,  '+1 234 567 8900', 'tel')}
          {textField('Designation', 'designation', false, <BadgeIcon />,  'e.g. Sales Manager')}
          <Box /> {/* spacer */}
        </TwoCol>
      )}

      {/* ── Company Details ─────────────────────────────────── */}
      {sectionCard(
        <BusinessIcon />,
        'Company Details',
        'Organisation information and industry',
        T.indigo,
        <TwoCol>
          {textField('Company Name',  'companyName',    true,  <BusinessIcon />, 'e.g. Acme Corp')}
          {textField('Company Email', 'companyEmail',   false, <EmailIcon />,    'info@acme.com', 'email')}
          {textField('Company Phone', 'companyPhone',   false, <PhoneIcon />,    '+1 234 567 8900', 'tel')}
          {selectField('Industry',    'industry',       INDUSTRY_OPTIONS, true, <BusinessIcon />)}
          {textField('Company Address', 'companyAddress', false, <LocationIcon />, '123 Main St, City, Country')}
          <Box /> {/* spacer */}
        </TwoCol>
      )}

      {/* ── Form actions — scrolls naturally with the form ──── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          justifyContent: 'flex-end',
          mt: 1,
          mb: 3,
          p: 2.5,
          borderRadius: '16px',
          background: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: `1px solid ${T.border}`,
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            px: 5,
            borderColor: T.border,
            color: T.slate,
            '&:hover': { borderColor: T.slate, background: T.bg },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          size="large"
          disabled={submitting}
          startIcon={submitting ? null : <CheckCircleIcon />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            py: 1.5,
            px: 5,
            background: `linear-gradient(135deg, ${T.purple}, #5b21b6)`,
            boxShadow: `0 8px 20px ${T.purple}40`,
            '&:hover': { background: T.purple, boxShadow: `0 12px 28px ${T.purple}60`, transform: 'translateY(-2px)' },
            '&:disabled': { background: `${T.purple}40` },
            transition: 'all 0.2s ease',
          }}
        >
          {submitting ? 'Registering Vendor…' : 'Register Vendor'}
        </Button>
      </Box>

    </Box>
  );
};

export default VendorForm;