// // components/OrganizationForm.jsx
// import React, { useState } from 'react';
// import {
//   Box, Typography, TextField, Grid, MenuItem, Button,
//   FormControl, Select, FormHelperText,
//   InputAdornment, Divider, Paper, Stack,
//   Chip, IconButton, Collapse, Alert
// } from '@mui/material';
// import {
//   Business as BusinessIcon,
//   Language as LanguageIcon,
//   Phone as PhoneIcon,
//   Email as EmailIcon,
//   Receipt as ReceiptIcon,
//   AccountBalance as AccountIcon,
//   Person as PersonIcon,
//   Badge as BadgeIcon,
//   Fingerprint as FingerprintIcon,
//   AttachMoney as MoneyIcon,
//   CalendarToday as CalendarIcon,
//   CloudUpload as UploadIcon,
//   Lock as LockIcon,
//   Home as HomeIcon,
//   Info as InfoIcon,
//   NoteAdd as NoteIcon,
//   ExpandMore as ExpandMoreIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon
// } from '@mui/icons-material';

// /* ── Design tokens ────────────────────────────────────────────── */
// const T = {
//   navy:    '#0F172A',
//   slate:   '#334155',
//   muted:   '#64748B',
//   border:  '#E2E8F0',
//   bg:      '#F8FAFC',
//   card:    '#FFFFFF',
//   indigo:  '#4F46E5',
//   indigoL: '#818CF8',
//   indigoS: '#EEF2FF',
//   emerald: '#10B981',
//   emeraldS: '#D1FAE5',
//   rose:    '#F43F5E',
//   roseS:   '#FFE4E6',
//   amber:   '#F59E0B',
//   amberS:  '#FEF3C7',
//   sky:     '#0EA5E9',
//   skyS:    '#E0F2FE',
// };

// const INDUSTRY_OPTIONS = [
//   { value: 'IT', label: 'Information Technology' },
//   { value: 'Finance', label: 'Finance & Banking' },
//   { value: 'Healthcare', label: 'Healthcare & Pharmaceuticals' },
//   { value: 'Education', label: 'Education & Training' },
//   { value: 'Manufacturing', label: 'Manufacturing' },
//   { value: 'Retail', label: 'Retail & E-commerce' },
//   { value: 'RealEstate', label: 'Real Estate' },
//   { value: 'Logistics', label: 'Logistics & Transportation' },
//   { value: 'Other', label: 'Other' }
// ];

// const PLAN_OPTIONS = [
//   { value: 'Basic', label: 'Basic', price: '$99/month' },
//   { value: 'Professional', label: 'Professional', price: '$199/month' },
//   { value: 'Enterprise', label: 'Enterprise', price: '$399/month' },
//   { value: 'Custom', label: 'Custom', price: 'Contact sales' }
// ];

// const BILLING_CYCLE_OPTIONS = [
//   { value: 'Monthly', label: 'Monthly' },
//   { value: 'Quarterly', label: 'Quarterly (10% off)' },
//   { value: 'Half-Yearly', label: 'Half-Yearly (15% off)' },
//   { value: 'Yearly', label: 'Yearly (20% off)' }
// ];

// const OrganizationForm = ({ formData, setFormData, formErrors, setFormErrors, onSubmit, onCancel, submitting }) => {
//   const [showCustomFields, setShowCustomFields] = useState(false);
//   const [customNote, setCustomNote] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleFileUpload = (fieldName) => (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, [fieldName]: file }));
//       if (formErrors[fieldName]) {
//         setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
//       }
//     }
//   };

//   const addCustomField = () => {
//     if (customNote.trim()) {
//       const existingNotes = formData.customNotes || [];
//       setFormData(prev => ({
//         ...prev,
//         customNotes: [...existingNotes, { id: Date.now(), text: customNote, date: new Date().toISOString() }]
//       }));
//       setCustomNote('');
//     }
//   };

//   const removeCustomField = (id) => {
//     setFormData(prev => ({
//       ...prev,
//       customNotes: (prev.customNotes || []).filter(note => note.id !== id)
//     }));
//   };

//   const inputSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '12px',
//       background: '#FFFFFF',
//       fontSize: 14,
//       transition: 'all 0.2s ease',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//       '&:hover': {
//         '& fieldset': { borderColor: T.indigo }
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: T.indigo,
//         borderWidth: 2,
//         boxShadow: `0 0 0 4px ${T.indigoS}`
//       }
//     },
//     '& .MuiOutlinedInput-root.Mui-error': {
//       '&:hover fieldset': { borderColor: T.rose },
//       '&.Mui-focused fieldset': {
//         borderColor: T.rose,
//         boxShadow: `0 0 0 4px ${T.roseS}`
//       }
//     },
//     '& .MuiInputLabel-root': { fontSize: 14, fontWeight: 500, color: T.slate },
//     '& .MuiFormHelperText-root': { fontSize: 11, marginLeft: 0.5, marginTop: 0.5 }
//   };

//   const sectionCard = (icon, title, subtitle, color, children) => (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 3,
//         mb: 3,
//         borderRadius: '16px',
//         border: `1px solid ${T.border}`,
//         background: '#FFFFFF',
//         transition: 'all 0.2s ease',
//         '&:hover': {
//           boxShadow: `0 8px 24px rgba(0,0,0,0.05)`,
//           borderColor: color
//         }
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
//         <Box sx={{
//           p: 1.2,
//           borderRadius: '12px',
//           background: `${color}10`,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
//         </Box>
//         <Box>
//           <Typography sx={{ fontWeight: 700, fontSize: 16, color: T.navy }}>{title}</Typography>
//           <Typography sx={{ fontSize: 13, color: T.muted }}>{subtitle}</Typography>
//         </Box>
//         <Chip
//           label="Required"
//           size="small"
//           sx={{
//             ml: 'auto',
//             background: `${color}10`,
//             color: color,
//             fontSize: 11,
//             fontWeight: 600,
//             borderRadius: '6px'
//           }}
//         />
//       </Box>
//       {children}
//     </Paper>
//   );

//   const fileUploadField = (label, fieldName, required = false, acceptedTypes = ".pdf,.jpg,.jpeg,.png") => (
//     <Box>
//       <Typography sx={{
//         fontSize: 13,
//         fontWeight: 600,
//         color: T.slate,
//         mb: 1,
//         display: 'flex',
//         alignItems: 'center',
//         gap: 0.5
//       }}>
//         {label}
//         {required && <span style={{ color: T.rose }}>*</span>}
//       </Typography>
//       <Button
//         component="label"
//         variant="outlined"
//         fullWidth
//         startIcon={<UploadIcon />}
//         sx={{
//           borderRadius: '10px',
//           textTransform: 'none',
//           fontWeight: 500,
//           fontSize: 13,
//           py: 1.2,
//           borderColor: formErrors[fieldName] ? T.rose : T.border,
//           borderWidth: formErrors[fieldName] ? 2 : 1,
//           background: formErrors[fieldName] ? '#FFF1F2' : '#FFFFFF',
//           color: formData[fieldName] ? T.indigo : T.slate,
//           justifyContent: 'flex-start',
//           px: 2,
//           '&:hover': {
//             borderColor: T.indigo,
//             background: '#FFFFFF',
//             boxShadow: `0 4px 12px ${T.indigoS}`
//           }
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
//           <UploadIcon sx={{ fontSize: 18, color: formData[fieldName] ? T.indigo : T.muted, flexShrink: 0 }} />
//           <Typography sx={{
//             fontSize: 13,
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//             color: formData[fieldName] ? T.indigo : T.slate
//           }}>
//             {formData[fieldName] ? formData[fieldName].name : `Upload ${label}`}
//           </Typography>
//           {formData[fieldName] && (
//             <CheckCircleIcon sx={{ fontSize: 16, color: T.emerald, ml: 'auto', flexShrink: 0 }} />
//           )}
//         </Box>
//         <input
//           type="file"
//           hidden
//           accept={acceptedTypes}
//           onChange={handleFileUpload(fieldName)}
//         />
//       </Button>
//       {formErrors[fieldName] && (
//         <FormHelperText error sx={{ ml: 0.5, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <WarningIcon sx={{ fontSize: 12 }} />
//           {formErrors[fieldName]}
//         </FormHelperText>
//       )}
//     </Box>
//   );

//   const selectField = (label, name, options, required = false, icon) => (
//     <Box>
//       <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
//         {label}
//         {required && <span style={{ color: T.rose }}>*</span>}
//       </Typography>
//       <FormControl fullWidth error={!!formErrors[name]}>
//         <Select
//           name={name}
//           value={formData[name] || ''}
//           onChange={handleChange}
//           displayEmpty
//           sx={{
//             borderRadius: '10px',
//             background: '#FFFFFF',
//             fontSize: 14,
//             boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//             '& .MuiSelect-select': { py: 1.2, display: 'flex', alignItems: 'center', gap: 1 },
//             '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.indigo },
//             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//               borderColor: T.indigo,
//               borderWidth: 2,
//               boxShadow: `0 0 0 4px ${T.indigoS}`
//             }
//           }}
//           startAdornment={
//             icon && (
//               <InputAdornment position="start" sx={{ mr: 0.5 }}>
//                 {React.cloneElement(icon, { sx: { fontSize: 18, color: T.muted } })}
//               </InputAdornment>
//             )
//           }
//         >
//           <MenuItem value="" disabled>
//             <span style={{ color: T.muted }}>Select {label}</span>
//           </MenuItem>
//           {options.map(opt => (
//             <MenuItem key={opt.value} value={opt.value} sx={{ py: 1 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
//                 <span>{opt.label}</span>
//                 {opt.price && (
//                   <Chip label={opt.price} size="small" sx={{ fontSize: 10, background: T.indigoS, color: T.indigo }} />
//                 )}
//               </Box>
//             </MenuItem>
//           ))}
//         </Select>
//         {formErrors[name] && <FormHelperText>{formErrors[name]}</FormHelperText>}
//       </FormControl>
//     </Box>
//   );

//   const textField = (label, name, required = false, icon, placeholder = "", type = "text") => (
//     <Box>
//       <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
//         {label}
//         {required && <span style={{ color: T.rose }}>*</span>}
//       </Typography>
//       <TextField
//         fullWidth
//         name={name}
//         type={type}
//         value={formData[name] || ''}
//         onChange={handleChange}
//         error={!!formErrors[name]}
//         helperText={formErrors[name]}
//         placeholder={placeholder}
//         InputProps={{
//           startAdornment: icon && (
//             <InputAdornment position="start">
//               {React.cloneElement(icon, {
//                 sx: {
//                   fontSize: 18,
//                   color: formErrors[name] ? T.rose : (formData[name] ? T.indigo : T.muted)
//                 }
//               })}
//             </InputAdornment>
//           ),
//         }}
//         sx={inputSx}
//       />
//     </Box>
//   );

//   return (
//     <Box sx={{
//       maxWidth: '1200px',
//       margin: '0 auto',
//       p: { xs: 2, sm: 3 },
//       background: '#FFFFFF'
//     }}>
      
//       {/* Header with progress */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 3,
//           borderRadius: '16px',
//           background: `linear-gradient(135deg, ${T.indigo} 0%, #6366F1 100%)`,
//           color: 'white',
//           position: 'relative',
//           overflow: 'hidden'
//         }}
//       >
//         <Box sx={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
//         <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        
//         <Box sx={{ position: 'relative', zIndex: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//             <Box sx={{
//               p: 1.5,
//               borderRadius: '14px',
//               background: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <BusinessIcon sx={{ fontSize: 28 }} />
//             </Box>
//             <Box>
//               <Typography sx={{ fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>
//                 Register New Organisation
//               </Typography>
//               <Typography sx={{ fontSize: 14, opacity: 0.9 }}>
//                 Complete all sections to create a new tenant account
//               </Typography>
//             </Box>
//           </Box>
          
//           <Grid container spacing={2} sx={{ mt: 2 }}>
//             {['Company Info', 'Owner Details', 'Bank Info', 'Plan', 'Admin'].map((step, index) => (
//               <Grid item key={step}>
//                 <Chip
//                   label={step}
//                   icon={index < 2 ? <CheckCircleIcon /> : undefined}
//                   sx={{
//                     background: 'rgba(255,255,255,0.15)',
//                     color: 'white',
//                     fontWeight: 600,
//                     fontSize: 12,
//                     '& .MuiChip-icon': { color: 'white' }
//                   }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Paper>

//       {/* Company Information Section */}
//       {sectionCard(
//         <BusinessIcon />,
//         'Company Information',
//         'Basic company details and legal documents',
//         T.indigo,
//         <>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} md={6}>
//               {textField('Organisation Name', 'name', true, <BusinessIcon />, 'e.g. Acme Corporation')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {selectField('Industry', 'industry', INDUSTRY_OPTIONS, true, <BusinessIcon />)}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Website', 'website', false, <LanguageIcon />, 'https://www.example.com')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Phone', 'companyPhone', true, <PhoneIcon />, '+1 234 567 8900')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Email', 'email', true, <EmailIcon />, 'company@example.com', 'email')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('GST Number', 'gstNumber', false, <ReceiptIcon />, '22AAAAA0000A1Z5')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Company PAN', 'companyPan', true, <BadgeIcon />, 'AAAAA0000A')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Registration Number', 'registrationNumber', false, <FingerprintIcon />, 'U12345DL2023PTC123456')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {fileUploadField('GST Certificate', 'gstCertificate', true)}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {fileUploadField('Company PAN', 'companyPanFile', true)}
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Owner Information Section */}
//       {sectionCard(
//         <PersonIcon />,
//         'Owner Information',
//         'Primary owner/contact person details',
//         T.emerald,
//         <>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} md={6}>
//               {textField('Owner Name', 'ownerName', true, <PersonIcon />, 'John Doe')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Owner Email', 'ownerEmail', true, <EmailIcon />, 'owner@example.com', 'email')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Owner Phone', 'ownerPhone', true, <PhoneIcon />, '+1 234 567 8900')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Owner Aadhar', 'ownerAadhar', true, <FingerprintIcon />, '1234 5678 9012')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Owner PAN', 'ownerPan', true, <BadgeIcon />, 'AAAAA0000A')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {fileUploadField('Aadhar Card', 'aadharFile', true, '.pdf,.jpg,.jpeg,.png')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {fileUploadField('PAN Card', 'panFile', true, '.pdf,.jpg,.jpeg,.png')}
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Bank Information Section */}
//       {sectionCard(
//         <AccountIcon />,
//         'Bank Information',
//         'Bank account details for transactions',
//         T.amber,
//         <>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} md={6}>
//               {textField('Bank Name', 'bankName', true, <AccountIcon />, 'State Bank of India')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Account Holder', 'accountHolderName', true, <PersonIcon />, 'John Doe')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Account Number', 'accountNumber', true, <MoneyIcon />, '12345678901')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('IFSC Code', 'ifscCode', true, <FingerprintIcon />, 'SBIN0001234')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Branch', 'branch', false, <HomeIcon />, 'Connaught Place')}
//             </Grid>
//             <Grid item xs={12}>
//               {fileUploadField('Cancelled Cheque', 'cancelledCheque', true, '.pdf,.jpg,.jpeg,.png')}
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Plan & Subscription Section */}
//       {sectionCard(
//         <AttachMoneyIcon />,
//         'Plan & Subscription',
//         'Billing and subscription details',
//         T.sky,
//         <>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} md={6}>
//               {selectField('Plan', 'plan', PLAN_OPTIONS, true, <AttachMoneyIcon />)}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {selectField('Billing Cycle', 'billingCycle', BILLING_CYCLE_OPTIONS, true, <CalendarIcon />)}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Start Date', 'startDate', true, <CalendarIcon />, '', 'date')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('End Date', 'endDate', true, <CalendarIcon />, '', 'date')}
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Admin Information Section */}
//       {sectionCard(
//         <BadgeIcon />,
//         'Admin Information',
//         'Primary administrator account credentials',
//         T.rose,
//         <>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} md={6}>
//               {textField('First Name', 'adminFirstName', true, <PersonIcon />, 'John')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Last Name', 'adminLastName', true, <PersonIcon />, 'Doe')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Admin Email', 'adminEmail', true, <EmailIcon />, 'admin@company.com', 'email')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Admin Phone', 'adminPhone', true, <PhoneIcon />, '+1 234 567 8900')}
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {textField('Password', 'adminPassword', true, <LockIcon />, '••••••••', 'password')}
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Custom Fields Section */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 3,
//           borderRadius: '16px',
//           border: `1px solid ${T.border}`,
//           background: '#FFFFFF',
//           transition: 'all 0.2s ease'
//         }}
//       >
//         <Box
//           onClick={() => setShowCustomFields(!showCustomFields)}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1.5,
//             cursor: 'pointer',
//             '&:hover': { opacity: 0.8 }
//           }}
//         >
//           <Box sx={{
//             p: 1.2,
//             borderRadius: '12px',
//             background: `${T.indigo}10`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <NoteIcon sx={{ fontSize: 22, color: T.indigo }} />
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             <Typography sx={{ fontWeight: 700, fontSize: 16, color: T.navy }}>
//               Additional Information
//             </Typography>
//             <Typography sx={{ fontSize: 13, color: T.muted }}>
//               Add any custom notes or special requirements
//             </Typography>
//           </Box>
//           <IconButton>
//             <ExpandMoreIcon sx={{ transform: showCustomFields ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
//           </IconButton>
//         </Box>

//         <Collapse in={showCustomFields}>
//           <Box sx={{ mt: 3 }}>
//             <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Enter custom note or requirement..."
//                 value={customNote}
//                 onChange={(e) => setCustomNote(e.target.value)}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: '10px',
//                     background: '#FFFFFF',
//                     fontSize: 14
//                   }
//                 }}
//               />
//               <Button
//                 variant="contained"
//                 onClick={addCustomField}
//                 disabled={!customNote.trim()}
//                 sx={{
//                   borderRadius: '10px',
//                   textTransform: 'none',
//                   background: T.indigo,
//                   '&:hover': { background: T.indigoL },
//                   '&:disabled': { background: T.indigoS }
//                 }}
//               >
//                 Add
//               </Button>
//             </Stack>

//             {(formData.customNotes || []).length > 0 ? (
//               <Stack spacing={1}>
//                 {(formData.customNotes || []).map((note) => (
//                   <Paper
//                     key={note.id}
//                     variant="outlined"
//                     sx={{
//                       p: 2,
//                       borderRadius: '10px',
//                       borderColor: T.border,
//                       background: T.bg,
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start'
//                     }}
//                   >
//                     <Box>
//                       <Typography sx={{ fontSize: 14, color: T.navy }}>{note.text}</Typography>
//                       <Typography sx={{ fontSize: 11, color: T.muted, mt: 0.5 }}>
//                         Added: {new Date(note.date).toLocaleString()}
//                       </Typography>
//                     </Box>
//                     <IconButton size="small" onClick={() => removeCustomField(note.id)}>
//                       <DeleteIcon sx={{ fontSize: 16, color: T.muted }} />
//                     </IconButton>
//                   </Paper>
//                 ))}
//               </Stack>
//             ) : (
//               <Alert
//                 severity="info"
//                 sx={{
//                   borderRadius: '10px',
//                   background: T.skyS,
//                   color: T.sky,
//                   '& .MuiAlert-icon': { color: T.sky }
//                 }}
//               >
//                 No custom notes added yet. Add any special requirements or additional information.
//               </Alert>
//             )}
//           </Box>
//         </Collapse>
//       </Paper>

//       {/* Form Actions */}
//       <Box sx={{
//         display: 'flex',
//         gap: 2,
//         justifyContent: 'flex-end',
//         flexDirection: { xs: 'column', sm: 'row' },
//         position: 'sticky',
//         bottom: 16,
//         zIndex: 10,
//         background: '#FFFFFF',
//         p: 2,
//         borderRadius: '12px',
//         boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
//       }}>
//         <Button
//           onClick={onCancel}
//           variant="outlined"
//           sx={{
//             borderRadius: '10px',
//             textTransform: 'none',
//             fontWeight: 600,
//             py: 1.5,
//             px: 4,
//             borderColor: T.border,
//             color: T.slate,
//             '&:hover': {
//               borderColor: T.slate,
//               background: T.bg
//             }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={onSubmit}
//           variant="contained"
//           disabled={submitting}
//           startIcon={submitting ? null : <CheckCircleIcon />}
//           sx={{
//             borderRadius: '10px',
//             textTransform: 'none',
//             fontWeight: 700,
//             py: 1.5,
//             px: 4,
//             background: `linear-gradient(135deg, ${T.indigo}, ${T.indigoL})`,
//             boxShadow: `0 8px 16px ${T.indigo}40`,
//             '&:hover': {
//               background: T.indigo,
//               boxShadow: `0 12px 24px ${T.indigo}60`,
//               transform: 'translateY(-2px)'
//             },
//             '&:disabled': {
//               background: `${T.indigo}40`
//             },
//             transition: 'all 0.2s ease'
//           }}
//         >
//           {submitting ? 'Creating Organisation...' : 'Register Organisation'}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default OrganizationForm;


import React, { useState } from 'react';
import {
  Box, Typography, TextField, Grid, MenuItem, Button,
  FormControl, Select, FormHelperText,
  InputAdornment, Paper, Stack,
  Chip, IconButton, Collapse, Alert,
  Card, CardContent, Tooltip, Fade
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
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  CloudUpload as UploadIcon,
  Lock as LockIcon,
  Home as HomeIcon,
  NoteAdd as NoteIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

/* ── Design tokens ────────────────────────────────────────────── */
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
  { value: 'IT',            label: 'Information Technology' },
  { value: 'Finance',       label: 'Finance & Banking' },
  { value: 'Healthcare',    label: 'Healthcare & Pharmaceuticals' },
  { value: 'Education',     label: 'Education & Training' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail',        label: 'Retail & E-commerce' },
  { value: 'RealEstate',    label: 'Real Estate' },
  { value: 'Logistics',     label: 'Logistics & Transportation' },
  { value: 'Other',         label: 'Other' },
];

const PLAN_OPTIONS = [
  { value: 'Basic',        label: 'Basic',        price: '$99/month',     color: T.emerald },
  { value: 'Professional', label: 'Professional', price: '$199/month',    color: T.sky },
  { value: 'Enterprise',   label: 'Enterprise',   price: '$399/month',    color: T.purple },
  { value: 'Custom',       label: 'Custom',       price: 'Contact sales', color: T.amber },
];

const BILLING_CYCLE_OPTIONS = [
  { value: 'Monthly',     label: 'Monthly',     discount: 0  },
  { value: 'Quarterly',   label: 'Quarterly',   discount: 10 },
  { value: 'Half-Yearly', label: 'Half-Yearly', discount: 15 },
  { value: 'Yearly',      label: 'Yearly',      discount: 20 },
];

/* ── Shared input styles ──────────────────────────────────────── */
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: '#FFFFFF',
    fontSize: 14,
    transition: 'all 0.2s ease',
    '&:hover fieldset':       { borderColor: T.indigo },
    '&.Mui-focused fieldset': { borderColor: T.indigo, borderWidth: 2, boxShadow: `0 0 0 4px ${T.indigoS}` },
  },
  '& .MuiOutlinedInput-root.Mui-error': {
    '&:hover fieldset':       { borderColor: T.rose },
    '&.Mui-focused fieldset': { borderColor: T.rose, boxShadow: `0 0 0 4px ${T.roseS}` },
  },
  '& .MuiInputLabel-root':     { fontSize: 14, fontWeight: 500, color: T.slate },
  '& .MuiFormHelperText-root': { fontSize: 11, marginLeft: 0.5, marginTop: 0.5 },
};

/* ─────────────────────────────────────────────────────────────────
   TwoCol — pure CSS grid, always exactly 2 equal columns.
   No MUI breakpoints means no dependency on dialog/container width.
   Pass <Box /> as a spacer child for odd-count sections.
───────────────────────────────────────────────────────────────── */
const TwoCol = ({ children }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
    }}
  >
    {children}
  </Box>
);

/* ════════════════════════════════════════════════════════════════
   OrganizationForm
═══════════════════════════════════════════════════════════════ */
const OrganizationForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  onCancel,
  submitting,
}) => {
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [editingNote,      setEditingNote]      = useState(null);
  const [noteLabel,        setNoteLabel]        = useState('');
  const [noteValue,        setNoteValue]        = useState('');

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileUpload = (fieldName) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      if (formErrors[fieldName]) setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  /* ── Custom-field CRUD ─────────────────────────────────────── */
  const addCustomField = () => {
    if (!noteLabel.trim() || !noteValue.trim()) return;
    setFormData(prev => ({
      ...prev,
      customNotes: [
        ...(prev.customNotes || []),
        { id: Date.now(), label: noteLabel, value: noteValue, date: new Date().toISOString() },
      ],
    }));
    setNoteLabel('');
    setNoteValue('');
  };

  const editCustomField = (note) => {
    setEditingNote(note);
    setNoteLabel(note.label);
    setNoteValue(note.value);
  };

  const updateCustomField = () => {
    if (!noteLabel.trim() || !noteValue.trim() || !editingNote) return;
    setFormData(prev => ({
      ...prev,
      customNotes: (prev.customNotes || []).map(n =>
        n.id === editingNote.id
          ? { ...n, label: noteLabel, value: noteValue, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
    cancelEdit();
  };

  const deleteCustomField = (id) =>
    setFormData(prev => ({ ...prev, customNotes: (prev.customNotes || []).filter(n => n.id !== id) }));

  const cancelEdit = () => { setEditingNote(null); setNoteLabel(''); setNoteValue(''); };

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
                sx: { fontSize: 18, color: formErrors[name] ? T.rose : (formData[name] ? T.indigo : T.muted) },
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
          sx={{
            borderRadius: '10px',
            background: '#FFFFFF',
            fontSize: 14,
            '& .MuiSelect-select': { py: 1.55, display: 'flex', alignItems: 'center', gap: 1 },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.indigo },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: T.indigo, borderWidth: 2, boxShadow: `0 0 0 4px ${T.indigoS}`,
            },
          }}
          startAdornment={
            icon && (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                {React.cloneElement(icon, { sx: { fontSize: 18, color: T.muted } })}
              </InputAdornment>
            )
          }
          renderValue={(selected) => {
            const opt = options.find(o => o.value === selected);
            return opt ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{opt.label}</span>
                {opt.price && (
                  <Chip label={opt.price} size="small" sx={{ fontSize: 10, background: opt.color || T.indigoS, color: opt.color ? '#fff' : T.indigo, ml: 1 }} />
                )}
              </Box>
            ) : <span style={{ color: T.muted }}>Select {label}</span>;
          }}
        >
          <MenuItem value="" disabled><span style={{ color: T.muted }}>Select {label}</span></MenuItem>
          {options.map(opt => (
            <MenuItem key={opt.value} value={opt.value} sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{opt.label}</span>
                  {opt.discount > 0 && (
                    <Chip label={`${opt.discount}% off`} size="small" sx={{ fontSize: 10, background: T.emeraldS, color: T.emerald }} />
                  )}
                </Box>
                {opt.price && (
                  <Chip label={opt.price} size="small" sx={{ fontSize: 10, background: opt.color || T.indigoS, color: opt.color ? '#fff' : T.indigo }} />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        {formErrors[name] && <FormHelperText>{formErrors[name]}</FormHelperText>}
      </FormControl>
    </Box>
  );

  const fileUploadField = (label, fieldName, required = false) => (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: T.slate, mb: 1 }}>
        {label}{required && <span style={{ color: T.rose }}> *</span>}
      </Typography>
      <Button
        component="label"
        variant="outlined"
        fullWidth
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 13,
          py: 1.2,
          borderColor: formErrors[fieldName] ? T.rose : T.border,
          borderWidth: formErrors[fieldName] ? 2 : 1,
          background: formErrors[fieldName] ? T.roseS : '#FFFFFF',
          color: formData[fieldName] ? T.indigo : T.slate,
          justifyContent: 'flex-start',
          px: 2,
          '&:hover': { borderColor: T.indigo, background: '#FFFFFF', boxShadow: `0 4px 12px ${T.indigoS}` },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', overflow: 'hidden' }}>
          <UploadIcon sx={{ fontSize: 18, color: formData[fieldName] ? T.indigo : T.muted, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: formData[fieldName] ? T.indigo : T.slate }}>
            {formData[fieldName] ? formData[fieldName].name : `Upload ${label}`}
          </Typography>
          {formData[fieldName] && (
            <Fade in>
              <CheckCircleIcon sx={{ fontSize: 16, color: T.emerald, ml: 'auto', flexShrink: 0 }} />
            </Fade>
          )}
        </Box>
        <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload(fieldName)} />
      </Button>
      {formErrors[fieldName] && (
        <FormHelperText error sx={{ ml: 0.5, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WarningIcon sx={{ fontSize: 12 }} />{formErrors[fieldName]}
        </FormHelperText>
      )}
    </Box>
  );

  /* ── Section card wrapper ──────────────────────────────────── */
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
          background: `linear-gradient(135deg, ${T.indigo} 0%, ${T.purple} 100%)`,
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
                Register New Organisation
              </Typography>
              <Typography sx={{ fontSize: 14, opacity: 0.9, mt: 0.5 }}>
                Complete all sections to create a new tenant account
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={1}>
            {['Company Information', 'Owner Details', 'Bank Information', 'Plan & Subscription', 'Admin Details'].map((step) => (
              <Grid item key={step}>
                <Chip
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
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* ── Company Information ─────────────────────────────── */}
      {sectionCard(
        <BusinessIcon />,
        'Company Information',
        'Basic company details and legal documents',
        T.indigo,
        <TwoCol>
          {textField('Organisation Name',  'name',               true,  <BusinessIcon />,    'e.g. Acme Corporation')}
          {selectField('Industry',          'industry',           INDUSTRY_OPTIONS, true, <BusinessIcon />)}
          {textField('Website',             'website',            false, <LanguageIcon />,    'https://www.example.com')}
          {textField('Phone',               'companyPhone',       true,  <PhoneIcon />,       '+1 234 567 8900')}
          {textField('Email',               'email',              true,  <EmailIcon />,       'company@example.com', 'email')}
          {textField('GST Number',          'gstNumber',          false, <ReceiptIcon />,     '22AAAAA0000A1Z5')}
          {textField('Company PAN',         'companyPan',         true,  <BadgeIcon />,       'AAAAA0000A')}
          {textField('Registration Number', 'registrationNumber', false, <FingerprintIcon />, 'U12345DL2023PTC123456')}
          {fileUploadField('GST Certificate', 'gstCertificate', true)}
          {fileUploadField('Company PAN',     'companyPanFile',  true)}
        </TwoCol>
      )}

      {/* ── Owner Information ───────────────────────────────── */}
      {sectionCard(
        <PersonIcon />,
        'Owner Information',
        'Primary owner / contact person details',
        T.emerald,
        <TwoCol>
          {textField('Owner Name',   'ownerName',   true, <PersonIcon />,      'John Doe')}
          {textField('Owner Email',  'ownerEmail',  true, <EmailIcon />,       'owner@example.com', 'email')}
          {textField('Owner Phone',  'ownerPhone',  true, <PhoneIcon />,       '+1 234 567 8900')}
          {textField('Owner Aadhar', 'ownerAadhar', true, <FingerprintIcon />, '1234 5678 9012')}
          {textField('Owner PAN',    'ownerPan',    true, <BadgeIcon />,       'AAAAA0000A')}
          <Box /> {/* spacer — keeps PAN in col 1, empty col 2 */}
          {fileUploadField('Aadhar Card', 'aadharFile', true)}
          {fileUploadField('PAN Card',    'panFile',    true)}
        </TwoCol>
      )}

      {/* ── Bank Information ────────────────────────────────── */}
      {sectionCard(
        <AccountIcon />,
        'Bank Information',
        'Bank account details for transactions',
        T.amber,
        <TwoCol>
          {textField('Bank Name',      'bankName',          true,  <AccountIcon />,     'State Bank of India')}
          {textField('Account Holder', 'accountHolderName', true,  <PersonIcon />,      'John Doe')}
          {textField('Account Number', 'accountNumber',     true,  <AttachMoneyIcon />, '12345678901')}
          {textField('IFSC Code',      'ifscCode',          true,  <FingerprintIcon />, 'SBIN0001234')}
          {textField('Branch',         'branch',            false, <HomeIcon />,        'Connaught Place')}
          {fileUploadField('Cancelled Cheque', 'cancelledCheque', true)}
        </TwoCol>
      )}

      {/* ── Plan & Subscription ─────────────────────────────── */}
      {sectionCard(
        <AttachMoneyIcon />,
        'Plan & Subscription',
        'Billing and subscription details',
        T.sky,
        <TwoCol>
          {selectField('Plan',          'plan',         PLAN_OPTIONS,          true, <AttachMoneyIcon />)}
          {selectField('Billing Cycle', 'billingCycle', BILLING_CYCLE_OPTIONS, true, <CalendarIcon />)}
          {textField('Start Date', 'startDate', true, <CalendarIcon />, '', 'date')}
          {textField('End Date',   'endDate',   true, <CalendarIcon />, '', 'date')}
        </TwoCol>
      )}

      {/* ── Admin Information ───────────────────────────────── */}
      {sectionCard(
        <ShieldIcon />,
        'Admin Information',
        'Primary administrator account credentials',
        T.rose,
        <TwoCol>
          {textField('First Name',  'adminFirstName', true, <PersonIcon />, 'John')}
          {textField('Last Name',   'adminLastName',  true, <PersonIcon />, 'Doe')}
          {textField('Admin Email', 'adminEmail',     true, <EmailIcon />,  'admin@company.com', 'email')}
          {textField('Admin Phone', 'adminPhone',     true, <PhoneIcon />,  '+1 234 567 8900')}
          {textField('Password',    'adminPassword',  true, <LockIcon />,   '••••••••', 'password')}
          <Box /> {/* spacer — Password in col 1, empty col 2 */}
        </TwoCol>
      )}

      {/* ── Additional / Custom Fields ──────────────────────── */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '20px',
          border: `1px solid ${T.border}`,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: T.purple },
        }}
      >
        <Box
          onClick={() => setShowCustomFields(v => !v)}
          sx={{
            p: 2.5,
            background: `linear-gradient(90deg, ${T.purple}08, transparent)`,
            borderBottom: showCustomFields ? `1px solid ${T.border}` : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { background: `${T.purple}12` },
          }}
        >
          <Box sx={{ p: 1, borderRadius: '12px', background: `${T.purple}15`, display: 'flex' }}>
            <NoteIcon sx={{ fontSize: 22, color: T.purple }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: T.navy }}>Additional Information</Typography>
            <Typography sx={{ fontSize: 13, color: T.muted }}>Add custom fields with labels and values</Typography>
          </Box>
          <Chip
            label={`${formData.customNotes?.length || 0} fields`}
            size="small"
            sx={{ background: T.purpleS, color: T.purple, fontSize: 11, fontWeight: 600, borderRadius: '8px' }}
          />
          <IconButton size="small">
            <ExpandMoreIcon sx={{ transform: showCustomFields ? 'rotate(180deg)' : 'none', transition: '0.3s', color: T.purple }} />
          </IconButton>
        </Box>

        <Collapse in={showCustomFields}>
          <CardContent sx={{ p: 3 }}>
            {/* Add / Edit form */}
            <Paper
              elevation={0}
              sx={{ p: 2.5, mb: 3, borderRadius: '12px', background: T.bg, border: `1px solid ${T.border}` }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: T.navy, mb: 2 }}>
                {editingNote ? 'Edit Custom Field' : 'Add New Custom Field'}
              </Typography>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Field Label"
                    placeholder="e.g. Tax ID, Reference Code"
                    value={noteLabel}
                    onChange={e => setNoteLabel(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', background: '#FFFFFF', fontSize: 14 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Field Value"
                    placeholder="Enter value…"
                    value={noteValue}
                    onChange={e => setNoteValue(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', background: '#FFFFFF', fontSize: 14 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Stack direction="row" spacing={1}>
                    {editingNote ? (
                      <>
                        <Tooltip title="Save changes">
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={updateCustomField}
                            disabled={!noteLabel.trim() || !noteValue.trim()}
                            sx={{ borderRadius: '10px', textTransform: 'none', background: T.emerald, '&:hover': { background: '#0ea571' } }}
                          >
                            <SaveIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton
                            onClick={cancelEdit}
                            sx={{ borderRadius: '10px', background: T.roseS, color: T.rose, '&:hover': { background: '#fecdd3' } }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Add field">
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={addCustomField}
                          disabled={!noteLabel.trim() || !noteValue.trim()}
                          startIcon={<AddIcon />}
                          sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            background: T.purple,
                            '&:hover': { background: '#7c3aed' },
                            '&:disabled': { background: T.purpleS },
                          }}
                        >
                          Add
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Fields list */}
            {(formData.customNotes || []).length > 0 ? (
              <Grid container spacing={2}>
                {(formData.customNotes || []).map(note => (
                  <Grid item xs={12} sm={6} key={note.id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        borderColor: T.border,
                        background: '#FFFFFF',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: T.purple, boxShadow: `0 4px 12px ${T.purpleS}` },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: T.purple, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                            {note.label}
                          </Typography>
                          <Typography sx={{ fontSize: 15, color: T.navy, fontWeight: 500 }}>{note.value}</Typography>
                          <Typography sx={{ fontSize: 11, color: T.muted, mt: 1 }}>
                            Added: {new Date(note.date).toLocaleDateString()}
                            {note.updatedAt && ` · Updated: ${new Date(note.updatedAt).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => editCustomField(note)} sx={{ color: T.sky, '&:hover': { background: T.skyS } }}>
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => deleteCustomField(note.id)} sx={{ color: T.rose, '&:hover': { background: T.roseS } }}>
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert
                severity="info"
                icon={<NoteIcon />}
                sx={{ borderRadius: '12px', background: T.purpleS, color: T.purple, '& .MuiAlert-icon': { color: T.purple } }}
              >
                No custom fields added yet. Add labels and values for any additional information.
              </Alert>
            )}
          </CardContent>
        </Collapse>
      </Card>

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
            background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
            boxShadow: `0 8px 20px ${T.indigo}40`,
            '&:hover': { background: T.indigo, boxShadow: `0 12px 28px ${T.indigo}60`, transform: 'translateY(-2px)' },
            '&:disabled': { background: `${T.indigo}40` },
            transition: 'all 0.2s ease',
          }}
        >
          {submitting ? 'Creating Organisation…' : 'Register Organisation'}
        </Button>
      </Box>

    </Box>
  );
};

export default OrganizationForm;