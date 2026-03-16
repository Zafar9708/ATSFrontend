// components/OrganizationForm.jsx
import React from 'react';
import {
  Box, Typography, TextField, Grid, MenuItem, Button,
  FormControl, InputLabel, Select, FormHelperText,
  InputAdornment, Divider
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
  Home as HomeIcon
} from '@mui/icons-material';

/* ── Design tokens (matching dashboard) ────────────────────────────── */
const T = {
  navy:    '#0F172A',
  slate:   '#334155',
  muted:   '#64748B',
  border:  '#E2E8F0',
  bg:      '#F1F5F9',
  card:    '#FFFFFF',
  indigo:  '#4F46E5',
  indigoL: '#818CF8',
  emerald: '#10B981',
  rose:    '#F43F5E',
  amber:   '#F59E0B',
  sky:     '#0EA5E9',
};

const INDUSTRY_OPTIONS = ['IT', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Real Estate', 'Logistics', 'Other'];
const PLAN_OPTIONS = ['Basic', 'Professional', 'Enterprise', 'Custom'];
const BILLING_CYCLE_OPTIONS = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];

const OrganizationForm = ({ formData, setFormData, formErrors, setFormErrors, onSubmit, onCancel, submitting }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
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

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      background: '#F8FAFC',
      fontSize: 14,
      transition: 'all 0.2s',
      '&:hover': {
        '& fieldset': { borderColor: T.indigo }
      },
      '&.Mui-focused fieldset': {
        borderColor: T.indigo,
        borderWidth: 2
      }
    },
    '& .MuiInputLabel-root': { fontSize: 14, fontWeight: 500 },
    '& .MuiFormHelperText-root': { fontSize: 11, marginLeft: 0.5 }
  };

  const sectionTitle = (icon, title, subtitle, color = T.indigo) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, mt: 1 }}>
      <Box sx={{ 
        p: 1, 
        borderRadius: '12px', 
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 20, color } })}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: T.navy }}>{title}</Typography>
        <Typography sx={{ fontSize: 12, color: T.muted }}>{subtitle}</Typography>
      </Box>
    </Box>
  );

  const fileUploadField = (label, fieldName, required = false) => (
    <Box>
      <Typography sx={{ 
        fontSize: 12, 
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
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 13,
          py: 1.5,
          borderColor: formErrors[fieldName] ? T.rose : T.border,
          background: formErrors[fieldName] ? '#FFF1F2' : '#F8FAFC',
          color: formData[fieldName] ? T.indigo : T.slate,
          '&:hover': {
            borderColor: T.indigo,
            background: '#F8FAFC'
          }
        }}
      >
        {formData[fieldName] ? formData[fieldName].name || 'File selected' : 'Choose file'}
        <input
          type="file"
          hidden
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload(fieldName)}
        />
      </Button>
      {formErrors[fieldName] && (
        <FormHelperText error sx={{ ml: 0.5, mt: 0.5 }}>
          {formErrors[fieldName]}
        </FormHelperText>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      
      {/* Section 1: Company Information */}
      {sectionTitle(<BusinessIcon />, 'Company Information', 'Basic company details and documents')}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Organisation Name <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            placeholder="e.g. Acme Corporation"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ fontSize: 18, color: formErrors.name ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Industry <span style={{ color: T.rose }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!formErrors.industry}>
            <Select
              name="industry"
              value={formData.industry || ''}
              onChange={handleChange}
              displayEmpty
              renderValue={(value) => value || <span style={{ color: T.muted }}>Select industry</span>}
              sx={{
                borderRadius: '12px',
                background: '#F8FAFC',
                fontSize: 14,
                '& .MuiSelect-select': { py: 1.5 }
              }}
            >
              <MenuItem value="" disabled>Select industry</MenuItem>
              {INDUSTRY_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            {formErrors.industry && <FormHelperText>{formErrors.industry}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Website
          </Typography>
          <TextField
            fullWidth
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://www.example.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LanguageIcon sx={{ fontSize: 18, color: T.muted }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Phone <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="companyPhone"
            value={formData.companyPhone || ''}
            onChange={handleChange}
            error={!!formErrors.companyPhone}
            helperText={formErrors.companyPhone}
            placeholder="+1 234 567 8900"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ fontSize: 18, color: formErrors.companyPhone ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Email <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            placeholder="company@example.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 18, color: formErrors.email ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            GST Number
          </Typography>
          <TextField
            fullWidth
            name="gstNumber"
            value={formData.gstNumber || ''}
            onChange={handleChange}
            placeholder="22AAAAA0000A1Z5"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReceiptIcon sx={{ fontSize: 18, color: T.muted }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Company PAN Number <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="companyPan"
            value={formData.companyPan || ''}
            onChange={handleChange}
            error={!!formErrors.companyPan}
            helperText={formErrors.companyPan}
            placeholder="AAAAA0000A"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ fontSize: 18, color: formErrors.companyPan ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Company Registration Number
          </Typography>
          <TextField
            fullWidth
            name="registrationNumber"
            value={formData.registrationNumber || ''}
            onChange={handleChange}
            placeholder="U12345DL2023PTC123456"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FingerprintIcon sx={{ fontSize: 18, color: T.muted }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {fileUploadField('Upload GST Certificate', 'gstCertificate', true)}
        </Grid>

        <Grid item xs={12} md={6}>
          {fileUploadField('Upload Company PAN', 'companyPanFile', true)}
        </Grid>
      </Grid>

      {/* Section 2: Owner Information */}
      <Divider sx={{ my: 3 }} />
      {sectionTitle(<PersonIcon />, 'Owner Information', 'Primary owner/contact person details', T.emerald)}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Owner Name <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ownerName"
            value={formData.ownerName || ''}
            onChange={handleChange}
            error={!!formErrors.ownerName}
            helperText={formErrors.ownerName}
            placeholder="John Doe"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ fontSize: 18, color: formErrors.ownerName ? T.rose : T.emerald }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Owner Email <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ownerEmail"
            type="email"
            value={formData.ownerEmail || ''}
            onChange={handleChange}
            error={!!formErrors.ownerEmail}
            helperText={formErrors.ownerEmail}
            placeholder="owner@example.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 18, color: formErrors.ownerEmail ? T.rose : T.emerald }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Owner Phone <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ownerPhone"
            value={formData.ownerPhone || ''}
            onChange={handleChange}
            error={!!formErrors.ownerPhone}
            helperText={formErrors.ownerPhone}
            placeholder="+1 234 567 8900"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ fontSize: 18, color: formErrors.ownerPhone ? T.rose : T.emerald }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Owner Aadhar Number <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ownerAadhar"
            value={formData.ownerAadhar || ''}
            onChange={handleChange}
            error={!!formErrors.ownerAadhar}
            helperText={formErrors.ownerAadhar}
            placeholder="1234 5678 9012"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FingerprintIcon sx={{ fontSize: 18, color: formErrors.ownerAadhar ? T.rose : T.emerald }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Owner PAN Number <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ownerPan"
            value={formData.ownerPan || ''}
            onChange={handleChange}
            error={!!formErrors.ownerPan}
            helperText={formErrors.ownerPan}
            placeholder="AAAAA0000A"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ fontSize: 18, color: formErrors.ownerPan ? T.rose : T.emerald }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {fileUploadField('Upload Aadhar', 'aadharFile', true)}
        </Grid>

        <Grid item xs={12} md={6}>
          {fileUploadField('Upload PAN', 'panFile', true)}
        </Grid>
      </Grid>

      {/* Section 3: Bank Information */}
      <Divider sx={{ my: 3 }} />
      {sectionTitle(<AccountIcon />, 'Bank Information', 'Bank account details for transactions', T.amber)}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Bank Name <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            error={!!formErrors.bankName}
            helperText={formErrors.bankName}
            placeholder="State Bank of India"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountIcon sx={{ fontSize: 18, color: formErrors.bankName ? T.rose : T.amber }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Account Holder Name <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="accountHolderName"
            value={formData.accountHolderName || ''}
            onChange={handleChange}
            error={!!formErrors.accountHolderName}
            helperText={formErrors.accountHolderName}
            placeholder="John Doe"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ fontSize: 18, color: formErrors.accountHolderName ? T.rose : T.amber }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Bank Account Number <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="accountNumber"
            value={formData.accountNumber || ''}
            onChange={handleChange}
            error={!!formErrors.accountNumber}
            helperText={formErrors.accountNumber}
            placeholder="12345678901"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon sx={{ fontSize: 18, color: formErrors.accountNumber ? T.rose : T.amber }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            IFSC Code <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ifscCode"
            value={formData.ifscCode || ''}
            onChange={handleChange}
            error={!!formErrors.ifscCode}
            helperText={formErrors.ifscCode}
            placeholder="SBIN0001234"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FingerprintIcon sx={{ fontSize: 18, color: formErrors.ifscCode ? T.rose : T.amber }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Branch
          </Typography>
          <TextField
            fullWidth
            name="branch"
            value={formData.branch || ''}
            onChange={handleChange}
            placeholder="Connaught Place"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon sx={{ fontSize: 18, color: T.muted }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12}>
          {fileUploadField('Upload Cancelled Cheque', 'cancelledCheque', true)}
        </Grid>
      </Grid>

      {/* Section 4: Plan & Subscription */}
      <Divider sx={{ my: 3 }} />
      {sectionTitle(<MoneyIcon />, 'Plan & Subscription', 'Billing and subscription details', T.sky)}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Plan <span style={{ color: T.rose }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!formErrors.plan}>
            <Select
              name="plan"
              value={formData.plan || ''}
              onChange={handleChange}
              displayEmpty
              sx={{
                borderRadius: '12px',
                background: '#F8FAFC',
                fontSize: 14,
                '& .MuiSelect-select': { py: 1.5 }
              }}
            >
              <MenuItem value="" disabled>Select plan</MenuItem>
              {PLAN_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            {formErrors.plan && <FormHelperText>{formErrors.plan}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Billing Cycle <span style={{ color: T.rose }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!formErrors.billingCycle}>
            <Select
              name="billingCycle"
              value={formData.billingCycle || ''}
              onChange={handleChange}
              displayEmpty
              sx={{
                borderRadius: '12px',
                background: '#F8FAFC',
                fontSize: 14,
                '& .MuiSelect-select': { py: 1.5 }
              }}
            >
              <MenuItem value="" disabled>Select billing cycle</MenuItem>
              {BILLING_CYCLE_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            {formErrors.billingCycle && <FormHelperText>{formErrors.billingCycle}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Start Date <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="startDate"
            type="date"
            value={formData.startDate || ''}
            onChange={handleChange}
            error={!!formErrors.startDate}
            helperText={formErrors.startDate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon sx={{ fontSize: 18, color: formErrors.startDate ? T.rose : T.sky }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            End Date <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={handleChange}
            error={!!formErrors.endDate}
            helperText={formErrors.endDate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon sx={{ fontSize: 18, color: formErrors.endDate ? T.rose : T.sky }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>
      </Grid>

      {/* Section 5: Admin Information */}
      <Divider sx={{ my: 3 }} />
      {sectionTitle(<BadgeIcon />, 'Admin Information', 'Primary administrator account', T.rose)}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Admin First Name <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="adminFirstName"
            value={formData.adminFirstName || ''}
            onChange={handleChange}
            error={!!formErrors.adminFirstName}
            helperText={formErrors.adminFirstName}
            placeholder="John"
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Admin Last Name <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="adminLastName"
            value={formData.adminLastName || ''}
            onChange={handleChange}
            error={!!formErrors.adminLastName}
            helperText={formErrors.adminLastName}
            placeholder="Doe"
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Admin Email <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="adminEmail"
            type="email"
            value={formData.adminEmail || ''}
            onChange={handleChange}
            error={!!formErrors.adminEmail}
            helperText={formErrors.adminEmail}
            placeholder="admin@company.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 18, color: formErrors.adminEmail ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Admin Phone <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="adminPhone"
            value={formData.adminPhone || ''}
            onChange={handleChange}
            error={!!formErrors.adminPhone}
            helperText={formErrors.adminPhone}
            placeholder="+1 234 567 8900"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ fontSize: 18, color: formErrors.adminPhone ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: T.slate, mb: 1 }}>
            Admin Password <span style={{ color: T.rose }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="adminPassword"
            type="password"
            value={formData.adminPassword || ''}
            onChange={handleChange}
            error={!!formErrors.adminPassword}
            helperText={formErrors.adminPassword || 'Minimum 8 characters'}
            placeholder="••••••••"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ fontSize: 18, color: formErrors.adminPassword ? T.rose : T.indigo }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        </Grid>
      </Grid>

      {/* Form Actions */}
      <Box sx={{
        mt: 4,
        pt: 3,
        borderTop: `1px solid ${T.border}`,
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end',
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderRadius: '12px',
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
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            py: 1.5,
            px: 4,
            background: `linear-gradient(135deg, ${T.indigo}, ${T.indigoL})`,
            boxShadow: `0 4px 16px ${T.indigo}50`,
            '&:hover': {
              background: T.indigo,
              boxShadow: `0 6px 20px ${T.indigo}70`
            },
            '&:disabled': {
              background: `${T.indigo}55`
            }
          }}
        >
          {submitting ? 'Creating Organisation...' : 'Register Organisation'}
        </Button>
      </Box>
    </Box>
  );
};

export default OrganizationForm;