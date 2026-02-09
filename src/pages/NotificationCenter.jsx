import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Tabs, Tab, IconButton, 
  List, ListItem, ListItemAvatar, ListItemText, Avatar, 
  Divider, Button, Menu, MenuItem, Tooltip,
  alpha, Stack, Grid, Switch, FormControlLabel,Badge,Chip
} from '@mui/material';
import {
  MoreVert, DoneAll, DeleteOutline, Settings, FiberManualRecord,
  Work, GroupAdd, EventAvailable, Campaign, ChatBubbleOutline,
  ErrorOutline, AssignmentTurnedIn, FilterList, TrendingUp, InfoOutlined
} from '@mui/icons-material';

// --- EXPANDED MOCK DATA ---
const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'application', title: 'New Application: Senior Frontend Developer', desc: 'John Smith submitted a new application. Experience: 8 years. Key Skills: React, Node.js.', time: '2 mins ago', unread: true, icon: <Work />, color: '#3b82f6', category: 'Jobs' },
  { id: 2, type: 'mention', title: 'Sarah Jenkins mentioned you in Marketing Lead Pipeline', desc: '"@Hameed, I\'ve shortlisted 3 candidates. Can you review their technical assessment scores before the sync?"', time: '45 mins ago', unread: true, icon: <ChatBubbleOutline />, color: '#8b5cf6', category: 'Mentions' },
  { id: 3, type: 'system', title: 'Scheduled System Maintenance: v2.4.0 Update', desc: 'RecruitX360 will be offline for approximately 2 hours starting at 02:00 AM UTC for database optimization.', time: '2 hours ago', unread: false, icon: <Campaign />, color: '#f59e0b', category: 'System' },
  { id: 4, type: 'interview', title: 'Technical Interview Confirmed', desc: 'Interview with Alex Rivera (Fullstack Candidate) is scheduled for Tomorrow at 10:30 AM via Google Meet.', time: '5 hours ago', unread: true, icon: <EventAvailable />, color: '#10b981', category: 'Jobs' },
  { id: 5, type: 'team', title: 'New Workspace Invitation', desc: 'The Global HR Team has invited you to collaborate on the "Q3 Executive Hiring Strategy" board.', time: 'Yesterday', unread: false, icon: <GroupAdd />, color: '#ec4899', category: 'System' },
  { id: 6, type: 'alert', title: 'Action Required: Plan Renewal', desc: 'Your "Enterprise Tier" subscription expires in 3 days. Please update payment method to avoid service gap.', time: 'Yesterday', unread: false, icon: <ErrorOutline />, color: '#ef4444', category: 'System' },
  { id: 7, type: 'application', title: 'Resume Parsed: Product Manager', desc: 'New candidate "Emily Chen" added to the pipeline. Match score: 94%.', time: '2 days ago', unread: false, icon: <Work />, color: '#3b82f6', category: 'Jobs' },
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleMenuOpen = (event, id) => { setAnchorEl(event.currentTarget); setSelectedId(id); };
  const handleMenuClose = () => { setAnchorEl(null); setSelectedId(null); };

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    handleMenuClose();
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return n.unread;
    if (activeTab === 2) return n.category === 'Jobs';
    if (activeTab === 3) return n.category === 'System';
    return true;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fa', pt: 10, pb: 8,ml:7, pl: { md: '100px' } }}>
      <Container maxWidth="xl"> {/* INCREASED TO XL FOR MAX WIDTH */}
        
        <Grid container spacing={4}>
          {/* MAIN FEED COLUMN */}
          <Grid item xs={12} lg={8.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
              <Box>
                <Typography variant="h3" fontWeight={900} letterSpacing="-1px" color="#1e293b">
                  Notification Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You have <b>{notifications.filter(n => n.unread).length} unread</b> notifications today.
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 2, bgcolor: 'white' }}>Filter</Button>
                <Button variant="contained" startIcon={<DoneAll />} onClick={markAllRead} sx={{ borderRadius: 2, px: 3 }}>Mark all read</Button>
              </Stack>
            </Box>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', px: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ '& .MuiTab-root': { py: 2.5, fontWeight: 700 } }}>
                  <Tab label="All Activity" />
                  <Tab label="Unread Only" />
                  <Tab label="Hiring Alerts" />
                  <Tab label="Platform Updates" />
                </Tabs>
              </Box>

              <List sx={{ p: 0, bgcolor: 'white' }}>
                {filteredNotifications.map((notif, index) => (
                  <React.Fragment key={notif.id}>
                    <ListItem
                      sx={{
                        py: 4, px: 4,
                        bgcolor: notif.unread ? alpha('#3b82f6', 0.03) : 'transparent',
                        '&:hover': { bgcolor: '#f8fafc' },
                      }}
                      secondaryAction={
                        <IconButton onClick={(e) => handleMenuOpen(e, notif.id)}><MoreVert /></IconButton>
                      }
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Badge overlap="circular" variant="dot" invisible={!notif.unread} color="primary">
                          <Avatar sx={{ bgcolor: alpha(notif.color, 0.1), color: notif.color, width: 56, height: 56 }}>
                            {notif.icon}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="h6" fontWeight={notif.unread ? 800 : 600} sx={{ mb: 0.5 }}>{notif.title}</Typography>}
                        secondary={
                          <Box>
                            <Typography variant="body1" color="#475569" sx={{ mb: 1.5, lineHeight: 1.6 }}>{notif.desc}</Typography>
                            <Stack direction="row" spacing={3} alignItems="center">
                              <Typography variant="caption" fontWeight={600} color="text.disabled">{notif.time}</Typography>
                              <Chip label={notif.category} size="small" sx={{ fontWeight: 800, fontSize: '10px', bgcolor: alpha(notif.color, 0.1), color: notif.color }} />
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index !== filteredNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* SIDEBAR COLUMN */}
          <Grid item xs={12} lg={3.5}>
            <Stack spacing={3}>
              {/* STATS CARD */}
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#1e293b', color: 'white' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp fontSize="small" /> Activity Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" fontWeight={800}>24</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Last 7 Days</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" fontWeight={800}>92%</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Response Rate</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* SETTINGS CARD */}
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Preferences</Typography>
                <Stack spacing={1}>
                  <FormControlLabel control={<Switch defaultChecked size="small" />} label={<Typography variant="body2">Email Digests</Typography>} />
                  <FormControlLabel control={<Switch defaultChecked size="small" />} label={<Typography variant="body2">Browser Push</Typography>} />
                  <FormControlLabel control={<Switch size="small" />} label={<Typography variant="body2">SMS Alerts</Typography>} />
                </Stack>
                <Button fullWidth variant="outlined" sx={{ mt: 3, borderRadius: 2 }} startIcon={<Settings />}>All Settings</Button>
              </Paper>

              {/* HELP CARD */}
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: alpha('#3b82f6', 0.05), border: '1px dashed #3b82f6' }}>
                <Stack direction="row" spacing={2}>
                  <InfoOutlined color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="primary">Pro Tip</Typography>
                    <Typography variant="caption" color="text.secondary">
                      You can mute specific hiring pipelines in the workspace settings to reduce noise.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><DoneAll sx={{ mr: 1, fontSize: 18 }} /> Mark Read</MenuItem>
          <MenuItem onClick={() => deleteNotification(selectedId)} sx={{ color: 'error.main' }}><DeleteOutline sx={{ mr: 1, fontSize: 18 }} /> Delete</MenuItem>
        </Menu>

      </Container>
    </Box>
  );
};

export default NotificationsPage;