// components/OrganizationForm.jsx
import React, { useState } from 'react';
import {
  Box, Typography, TextField, Grid, MenuItem, Button,
  FormControl, Select, FormHelperText,
  InputAdornment, Divider, Paper, Stack,
  Chip, IconButton, Collapse, Alert
} from '@mui/material';
import {
  Business as BusinessIcon,
  Language as LanguageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Fingerprint as FingerprintIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  CloudUpload as UploadIcon,
  Lock as LockIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  NoteAdd as NoteIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

/* ── Design tokens ────────────────────────────────────────────── */
const T = {
  navy:    '#0F172A',
  slate:   '#334155',
  muted:   '#64748B',
  border:  '#E2E8F0',
  bg:      '#F8FAFC',
  card:    '#FFFFFF',
  indigo:  '#4F46E5',
  indigoL: '#818CF8',
  indigoS: '#EEF2FF',
  emerald: '#10B981',
  emeraldS: '#D1FAE5',
  rose:    '#F43F5E',
  roseS:   '#FFE4E6',
  amber:   '#F59E0B',
  amberS:  '#FEF3C7',
  sky:     '#0EA5E9',
  skyS:    '#E0F2FE',
};

const INDUSTRY_OPTIONS = [
  { value: 'IT', label: 'Information Technology' },
  { value: 'Finance', label: 'Finance & Banking' },
  { value: 'Healthcare', label: 'Healthcare & Pharmaceuticals' },
  { value: 'Education', label: 'Education & Training' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'RealEstate', label: 'Real Estate' },
  { value: 'Logistics', label: 'Logistics & Transportation' },
  { value: 'Other', label: 'Other' }
];

const PLAN_OPTIONS = [
  { value: 'Basic', label: 'Basic', price: '$99/month' },
  { value: 'Professional', label: 'Professional', price: '$199/month' },
  { value: 'Enterprise', label: 'Enterprise', price: '$399/month' },
  { value: 'Custom', label: 'Custom', price: 'Contact sales' }
];

const BILLING_CYCLE_OPTIONS = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly (10% off)' },
  { value: 'Half-Yearly', label: 'Half-Yearly (15% off)' },
  { value: 'Yearly', label: 'Yearly (20% off)' }
];

const OrganizationForm = ({ formData, setFormData, formErrors, setFormErrors, onSubmit, onCancel, submitting }) => {
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [customNote, setCustomNote] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (fieldName) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      if (formErrors[fieldName]) {
        setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  const addCustomField = () => {
    if (customNote.trim()) {
      const existingNotes = formData.customNotes || [];
      setFormData(prev => ({
        ...prev,
        customNotes: [...existingNotes, { id: Date.now(), text: customNote, date: new Date().toISOString() }]
      }));
      setCustomNote('');
    }
  };

  const removeCustomField = (id) => {
    setFormData(prev => ({
      ...prev,
      customNotes: (prev.customNotes || []).filter(note => note.id !== id)
    }));
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      background: '#FFFFFF',
      fontSize: 14,
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      '&:hover': {
        '& fieldset': { borderColor: T.indigo }
      },
      '&.Mui-focused fieldset': {
        borderColor: T.indigo,
        borderWidth: 2,
        boxShadow: `0 0 0 4px ${T.indigoS}`
      }
    },
    '& .MuiOutlinedInput-root.Mui-error': {
      '&:hover fieldset': { borderColor: T.rose },
      '&.Mui-focused fieldset': {
        borderColor: T.rose,
        boxShadow: `0 0 0 4px ${T.roseS}`
      }
    },
    '& .MuiInputLabel-root': { fontSize: 14, fontWeight: 500, color: T.slate },
    '& .MuiFormHelperText-root': { fontSize: 11, marginLeft: 0.5, marginTop: 0.5 }
  };

  const sectionCard = (icon, title, subtitle, color, children) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: '16px',
        border: `1px solid ${T.border}`,
        background: '#FFFFFF',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: `0 8px 24px rgba(0,0,0,0.05)`,
          borderColor: color
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
          p: 1.2,
          borderRadius: '12px',
          background: `${color}10`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: T.navy }}>{title}</Typography>
          <Typography sx={{ fontSize: 13, color: T.muted }}>{subtitle}</Typography>
        </Box>
        <Chip
          label="Required"
          size="small"
          sx={{
            ml: 'auto',
            background: `${color}10`,
            color: color,
            fontSize: 11,
            fontWeight: 600,
            borderRadius: '6px'
          }}
        />
      </Box>
      {children}
    </Paper>
  );

  const fileUploadField = (label, fieldName, required = false, acceptedTypes = ".pdf,.jpg,.jpeg,.png") => (
    <Box>
      <Typography sx={{
        fontSize: 13,
        fontWeight: 600,
        color: T.slate,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}>
        {label}
        {required && <span style={{ color: T.rose }}>*</span>}
      </Typography>
      <Button
        component="label"
        variant="outlined"
        fullWidth
        startIcon={<UploadIcon />}
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 13,
          py: 1.2,
          borderColor: formErrors[fieldName] ? T.rose : T.border,
          borderWidth: formErrors[fieldName] ? 2 : 1,
          background: formErrors[fieldName] ? '#FFF1F2' : '#FFFFFF',
          color: formData[fieldName] ? T.indigo : T.slate,
          justifyContent: 'flex-start',
          px: 2,
          '&:hover': {
            borderColor: T.indigo,
            background: '#FFFFFF',
            boxShadow: `0 4px 12px ${T.indigoS}`
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
          <UploadIcon sx={{ fontSize: 18, color: formData[fieldName] ? T.indigo : T.muted, flexShrink: 0 }} />
          <Typography sx={{
            fontSize: 13,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: formData[fieldName] ? T.indigo : T.slate
          }}>
            {formData[fieldName] ? formData[fieldName].name : `Upload ${label}`}
          </Typography>
          {formData[fieldName] && (
            <CheckCircleIcon sx={{ fontSize: 16, color: T.emerald, ml: 'auto', flexShrink: 0 }} />
          )}
        </Box>
        <input
          type="file"
          hidden
          accept={acceptedTypes}
          onChange={handleFileUpload(fieldName)}
        />
      </Button>
      {formErrors[fieldName] && (
        <FormHelperText error sx={{ ml: 0.5, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WarningIcon sx={{ fontSize: 12 }} />
          {formErrors[fieldName]}
        </FormHelperText>
      )}
    </Box>
  );

  const selectField = (label, name, options, required = false, icon) => (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
        {label}
        {required && <span style={{ color: T.rose }}>*</span>}
      </Typography>
      <FormControl fullWidth error={!!formErrors[name]}>
        <Select
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          displayEmpty
          sx={{
            borderRadius: '10px',
            background: '#FFFFFF',
            fontSize: 14,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            '& .MuiSelect-select': { py: 1.2, display: 'flex', alignItems: 'center', gap: 1 },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.indigo },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: T.indigo,
              borderWidth: 2,
              boxShadow: `0 0 0 4px ${T.indigoS}`
            }
          }}
          startAdornment={
            icon && (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                {React.cloneElement(icon, { sx: { fontSize: 18, color: T.muted } })}
              </InputAdornment>
            )
          }
        >
          <MenuItem value="" disabled>
            <span style={{ color: T.muted }}>Select {label}</span>
          </MenuItem>
          {options.map(opt => (
            <MenuItem key={opt.value} value={opt.value} sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span>{opt.label}</span>
                {opt.price && (
                  <Chip label={opt.price} size="small" sx={{ fontSize: 10, background: T.indigoS, color: T.indigo }} />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        {formErrors[name] && <FormHelperText>{formErrors[name]}</FormHelperText>}
      </FormControl>
    </Box>
  );

  const textField = (label, name, required = false, icon, placeholder = "", type = "text") => (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
        {label}
        {required && <span style={{ color: T.rose }}>*</span>}
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
                sx: {
                  fontSize: 18,
                  color: formErrors[name] ? T.rose : (formData[name] ? T.indigo : T.muted)
                }
              })}
            </InputAdornment>
          ),
        }}
        sx={inputSx}
      />
    </Box>
  );

  return (
    <Box sx={{
      maxWidth: '1200px',
      margin: '0 auto',
      p: { xs: 2, sm: 3 },
      background: '#FFFFFF'
    }}>
      
      {/* Header with progress */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${T.indigo} 0%, #6366F1 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <BusinessIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>
                Register New Organisation
              </Typography>
              <Typography sx={{ fontSize: 14, opacity: 0.9 }}>
                Complete all sections to create a new tenant account
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {['Company Info', 'Owner Details', 'Bank Info', 'Plan', 'Admin'].map((step, index) => (
              <Grid item key={step}>
                <Chip
                  label={step}
                  icon={index < 2 ? <CheckCircleIcon /> : undefined}
                  sx={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 12,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Company Information Section */}
      {sectionCard(
        <BusinessIcon />,
        'Company Information',
        'Basic company details and legal documents',
        T.indigo,
        <>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              {textField('Organisation Name', 'name', true, <BusinessIcon />, 'e.g. Acme Corporation')}
            </Grid>
            <Grid item xs={12} md={6}>
              {selectField('Industry', 'industry', INDUSTRY_OPTIONS, true, <BusinessIcon />)}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Website', 'website', false, <LanguageIcon />, 'https://www.example.com')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Phone', 'companyPhone', true, <PhoneIcon />, '+1 234 567 8900')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Email', 'email', true, <EmailIcon />, 'company@example.com', 'email')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('GST Number', 'gstNumber', false, <ReceiptIcon />, '22AAAAA0000A1Z5')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Company PAN', 'companyPan', true, <BadgeIcon />, 'AAAAA0000A')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Registration Number', 'registrationNumber', false, <FingerprintIcon />, 'U12345DL2023PTC123456')}
            </Grid>
            <Grid item xs={12} md={6}>
              {fileUploadField('GST Certificate', 'gstCertificate', true)}
            </Grid>
            <Grid item xs={12} md={6}>
              {fileUploadField('Company PAN', 'companyPanFile', true)}
            </Grid>
          </Grid>
        </>
      )}

      {/* Owner Information Section */}
      {sectionCard(
        <PersonIcon />,
        'Owner Information',
        'Primary owner/contact person details',
        T.emerald,
        <>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              {textField('Owner Name', 'ownerName', true, <PersonIcon />, 'John Doe')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Owner Email', 'ownerEmail', true, <EmailIcon />, 'owner@example.com', 'email')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Owner Phone', 'ownerPhone', true, <PhoneIcon />, '+1 234 567 8900')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Owner Aadhar', 'ownerAadhar', true, <FingerprintIcon />, '1234 5678 9012')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Owner PAN', 'ownerPan', true, <BadgeIcon />, 'AAAAA0000A')}
            </Grid>
            <Grid item xs={12} md={6}>
              {fileUploadField('Aadhar Card', 'aadharFile', true, '.pdf,.jpg,.jpeg,.png')}
            </Grid>
            <Grid item xs={12} md={6}>
              {fileUploadField('PAN Card', 'panFile', true, '.pdf,.jpg,.jpeg,.png')}
            </Grid>
          </Grid>
        </>
      )}

      {/* Bank Information Section */}
      {sectionCard(
        <AccountIcon />,
        'Bank Information',
        'Bank account details for transactions',
        T.amber,
        <>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              {textField('Bank Name', 'bankName', true, <AccountIcon />, 'State Bank of India')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Account Holder', 'accountHolderName', true, <PersonIcon />, 'John Doe')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Account Number', 'accountNumber', true, <MoneyIcon />, '12345678901')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('IFSC Code', 'ifscCode', true, <FingerprintIcon />, 'SBIN0001234')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Branch', 'branch', false, <HomeIcon />, 'Connaught Place')}
            </Grid>
            <Grid item xs={12}>
              {fileUploadField('Cancelled Cheque', 'cancelledCheque', true, '.pdf,.jpg,.jpeg,.png')}
            </Grid>
          </Grid>
        </>
      )}

      {/* Plan & Subscription Section */}
      {sectionCard(
        <AttachMoneyIcon />,
        'Plan & Subscription',
        'Billing and subscription details',
        T.sky,
        <>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              {selectField('Plan', 'plan', PLAN_OPTIONS, true, <AttachMoneyIcon />)}
            </Grid>
            <Grid item xs={12} md={6}>
              {selectField('Billing Cycle', 'billingCycle', BILLING_CYCLE_OPTIONS, true, <CalendarIcon />)}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Start Date', 'startDate', true, <CalendarIcon />, '', 'date')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('End Date', 'endDate', true, <CalendarIcon />, '', 'date')}
            </Grid>
          </Grid>
        </>
      )}

      {/* Admin Information Section */}
      {sectionCard(
        <BadgeIcon />,
        'Admin Information',
        'Primary administrator account credentials',
        T.rose,
        <>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              {textField('First Name', 'adminFirstName', true, <PersonIcon />, 'John')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Last Name', 'adminLastName', true, <PersonIcon />, 'Doe')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Admin Email', 'adminEmail', true, <EmailIcon />, 'admin@company.com', 'email')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Admin Phone', 'adminPhone', true, <PhoneIcon />, '+1 234 567 8900')}
            </Grid>
            <Grid item xs={12} md={6}>
              {textField('Password', 'adminPassword', true, <LockIcon />, '••••••••', 'password')}
            </Grid>
          </Grid>
        </>
      )}

      {/* Custom Fields Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: '16px',
          border: `1px solid ${T.border}`,
          background: '#FFFFFF',
          transition: 'all 0.2s ease'
        }}
      >
        <Box
          onClick={() => setShowCustomFields(!showCustomFields)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
        >
          <Box sx={{
            p: 1.2,
            borderRadius: '12px',
            background: `${T.indigo}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <NoteIcon sx={{ fontSize: 22, color: T.indigo }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: T.navy }}>
              Additional Information
            </Typography>
            <Typography sx={{ fontSize: 13, color: T.muted }}>
              Add any custom notes or special requirements
            </Typography>
          </Box>
          <IconButton>
            <ExpandMoreIcon sx={{ transform: showCustomFields ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
          </IconButton>
        </Box>

        <Collapse in={showCustomFields}>
          <Box sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter custom note or requirement..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    fontSize: 14
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={addCustomField}
                disabled={!customNote.trim()}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  background: T.indigo,
                  '&:hover': { background: T.indigoL },
                  '&:disabled': { background: T.indigoS }
                }}
              >
                Add
              </Button>
            </Stack>

            {(formData.customNotes || []).length > 0 ? (
              <Stack spacing={1}>
                {(formData.customNotes || []).map((note) => (
                  <Paper
                    key={note.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: '10px',
                      borderColor: T.border,
                      background: T.bg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 14, color: T.navy }}>{note.text}</Typography>
                      <Typography sx={{ fontSize: 11, color: T.muted, mt: 0.5 }}>
                        Added: {new Date(note.date).toLocaleString()}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => removeCustomField(note.id)}>
                      <DeleteIcon sx={{ fontSize: 16, color: T.muted }} />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Alert
                severity="info"
                sx={{
                  borderRadius: '10px',
                  background: T.skyS,
                  color: T.sky,
                  '& .MuiAlert-icon': { color: T.sky }
                }}
              >
                No custom notes added yet. Add any special requirements or additional information.
              </Alert>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Form Actions */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end',
        flexDirection: { xs: 'column', sm: 'row' },
        position: 'sticky',
        bottom: 16,
        zIndex: 10,
        background: '#FFFFFF',
        p: 2,
        borderRadius: '12px',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
      }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            px: 4,
            borderColor: T.border,
            color: T.slate,
            '&:hover': {
              borderColor: T.slate,
              background: T.bg
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? null : <CheckCircleIcon />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            py: 1.5,
            px: 4,
            background: `linear-gradient(135deg, ${T.indigo}, ${T.indigoL})`,
            boxShadow: `0 8px 16px ${T.indigo}40`,
            '&:hover': {
              background: T.indigo,
              boxShadow: `0 12px 24px ${T.indigo}60`,
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              background: `${T.indigo}40`
            },
            transition: 'all 0.2s ease'
          }}
        >
          {submitting ? 'Creating Organisation...' : 'Register Organisation'}
        </Button>
      </Box>
    </Box>
  );
};

export default OrganizationForm;