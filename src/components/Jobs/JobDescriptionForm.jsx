import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Card, CardContent, Grid, IconButton, InputAdornment,
  Select, FormControl, InputLabel
} from '@mui/material';
import { Description, Close, Search } from '@mui/icons-material';
import { fetchDepartments, addDepartment } from '../../services/Jobs/departmentService';
import { fetchJobTemplates } from '../../services/Jobs/templatesService';

const JobDescriptionForm = ({ onContinue, initialData }) => {
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle || '');
  const [department, setDepartment] = useState(initialData.department || '');
  const [experience, setExperience] = useState(initialData.experience || '');
  const [jobDesc, setJobDesc] = useState(initialData.jobDesc || '');
  const [templates, setTemplates] = useState([]);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [newDeptDialogOpen, setNewDeptDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const descRef = useRef(null);

  useEffect(() => {
    setJobTitle(initialData.jobTitle || '');
    setDepartment(initialData.department || '');
    setExperience(initialData.experience || '');
    setJobDesc(initialData.jobDesc || '');
  }, [initialData]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedTemplates = await fetchJobTemplates();
        setTemplates(fetchedTemplates);

        const fetchedDepartments = await fetchDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error('Error loading templates/departments:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (descRef.current && jobDesc && !isEditing) {
      descRef.current.innerHTML = jobDesc;
    }
  }, [jobDesc, isEditing]);

  const handleTemplateSelect = (content) => {
    const cleanContent = content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    setJobDesc(cleanContent);
    if (descRef.current) {
      descRef.current.innerHTML = cleanContent;
    }
    setOpenTemplate(false);
  };

  const handleSubmit = () => {
    if (jobTitle && department && experience && jobDesc) {
      const jobData = { 
        jobTitle, 
        department, 
        experience, 
        jobDesc 
      };
      onContinue(jobData);
    } else {
      alert('Please fill all fields.');
    }
  };

  const filteredTemplates = Array.isArray(templates) ? templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const applyFormat = (command) => {
    if (descRef.current) {
      // Save current selection
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      // Apply command
      document.execCommand(command, false, null);
      
      // Update state
      setJobDesc(descRef.current.innerHTML);
      
      // Restore selection
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Save current selection
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    // Insert text at cursor position
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Update state
    setJobDesc(descRef.current.innerHTML);
  };

  const handleContentChange = () => {
    if (descRef.current) {
      setJobDesc(descRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleContentChange();
  };

  return (
    <Box sx={{ maxWidth: 860, margin: 'auto', p: 3 }}>
      <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Description fontSize="medium" /> Create Job Posting
      </Typography>

      <Card variant="outlined" sx={{ mb: 3, p: 1, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                variant="outlined"
                size="medium"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  value={department}
                  onChange={(e) => {
                    if (e.target.value === '__add__') {
                      setNewDeptDialogOpen(true);
                    } else {
                      setDepartment(e.target.value);
                    }
                  }}
                  label="Department"
                  variant="outlined"
                  size="medium"
                  sx={{ minWidth: 200 }}
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                  <MenuItem value="__add__" sx={{ fontStyle: '-moz-initial', color: '#1976d2' }}>
                    + Add Department
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Experience Level"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                variant="outlined"
                size="medium"
                placeholder="e.g. 2-5 years"
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Job Description</Typography>
            <Button
              onClick={() => setOpenTemplate(true)}
              size="medium"
              variant="outlined"
              startIcon={<Description fontSize="small" />}
              sx={{ textTransform: 'none' }}
            >
              Browse Templates
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="outlined" size="small" onClick={() => applyFormat('bold')}>
              <strong>B</strong>
            </Button>
            <Button variant="outlined" size="small" onClick={() => applyFormat('italic')}>
              <em>I</em>
            </Button>
            <Button variant="outlined" size="small" onClick={() => applyFormat('underline')}>
              <u>U</u>
            </Button>
          </Box>

          <Box
            contentEditable
            ref={descRef}
            suppressContentEditableWarning
            onPaste={handlePaste}
            onInput={handleContentChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
              border: '1px solid #ccc',
              minHeight: 200,
              padding: 1.5,
              borderRadius: 1,
              backgroundColor: '#f9f9f9',
              fontFamily: 'Arial, sans-serif',
              overflowY: 'auto',
              '&:focus': {
                borderColor: '#1976d2',
                outline: 'none'
              }
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!jobTitle || !department || !experience || !jobDesc}
          sx={{ px: 4, py: 1.5, textTransform: 'none', fontWeight: 500, borderRadius: 1, bgcolor: '#1976d2' }}
          size="medium"
        >
          Continue
        </Button>
      </Box>

      <Dialog
        open={openTemplate}
        onClose={() => setOpenTemplate(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Job Description Templates</Typography>
          <IconButton onClick={() => setOpenTemplate(false)}><Close /></IconButton>
        </DialogTitle>

        <Box sx={{ px: 3, pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            {filteredTemplates.length > 0 ? (
              <Grid container spacing={2}>
                {filteredTemplates.map((template, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>{template.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{template.content}</Typography>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => handleTemplateSelect(template.content)}
                        sx={{ textTransform: 'none' }}
                      >
                        Use Template
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No templates found matching your search</Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={newDeptDialogOpen} onClose={() => setNewDeptDialogOpen(false)}>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Department Name"
            variant="outlined"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDeptDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (newDepartment.trim()) {
                try {
                  const updated = await addDepartment(newDepartment.trim());
                  setDepartments(updated);
                  setDepartment(newDepartment.trim());
                  setNewDepartment('');
                  setNewDeptDialogOpen(false);
                } catch (err) {
                  console.error(err);
                  alert('Failed to add department');
                }
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDescriptionForm;

  