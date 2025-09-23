import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Work as JobIcon,
  Person as CandidateIcon,
  CalendarMonth as InterviewIcon,
  MarkEmailRead as ReadAllIcon
} from '@mui/icons-material';
// REMOVE this import - we'll use the CDN version
// import { io } from 'socket.io-client';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const { user, tenantId } = useUser();

  useEffect(() => {
    if (user && tenantId) {
      console.log('Initializing Socket.io connection...');
      
      // Check if io is available from CDN
      if (typeof io === 'undefined') {
        console.error('Socket.io not loaded. Make sure CDN is added to index.html');
        return;
      }
      
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      // Use the global io object from CDN
      socketRef.current = io('https://ungroupable-appallingly-bryan.ngrok-free.dev', {
        query: { token },
        transports: ['websocket', 'polling']
      });

      // Handle connection events
      socketRef.current.on('connect', () => {
        console.log('✓ Socket.io connected successfully!');
        console.log('Socket ID:', socketRef.current.id);
        setSocketConnected(true);
        
        // Join tenant room
        socketRef.current.emit('join-tenant', tenantId);
        console.log(`✓ Joined tenant room: ${tenantId}`);
      });

      socketRef.current.on('welcome', (data) => {
        console.log('Welcome message:', data);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket.io disconnected');
        setSocketConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setSocketConnected(false);
      });

      // Listen for real-time notifications
      socketRef.current.on('new-notification', (notification) => {
        console.log('Real-time notification received:', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Load existing notifications
      fetchNotifications();
      fetchUnreadCount();

      return () => {
        if (socketRef.current) {
          console.log('Cleaning up Socket.io connection');
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, tenantId]);

  const handleCloseDetail=()=>{
    
  }

  // Add connection status indicator to your UI
  return (
    <>
      <Tooltip title={`Notifications ${socketConnected ? '✓' : '✗'}`}>
        <IconButton
          color="inherit"
          onClick={() => setOpen(true)}
          sx={{ position: 'relative' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
          {/* Connection status indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: socketConnected ? 'success.main' : 'error.main'
            }}
          />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            <Box>
              {unreadCount > 0 && (
                <Tooltip title="Mark all as read">
                  <IconButton onClick={markAllAsRead} size="small">
                    <ReadAllIcon />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton onClick={() => setOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          <List sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderLeft: notification.read ? 'none' : '3px solid',
                    borderLeftColor: 'primary.main',
                    mb: 1
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span">
                          {notification.message}
                        </Typography>
                        <Chip
                          label={notification.type.split('_').join(' ')}
                          size="small"
                          color={getNotificationColor(notification.type)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.createdAt)} • by {notification.performedBy?.username}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Drawer>

      {/* Notification Detail Dialog */}
      <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle>
          Notification Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDetail}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedNotification.message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={selectedNotification.type.split('_').join(' ')}
                  color={getNotificationColor(selectedNotification.type)}
                />
                <Chip
                  label={new Date(selectedNotification.createdAt).toLocaleDateString()}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Performed by: {selectedNotification.performedBy?.username} ({selectedNotification.performedBy?.email})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {new Date(selectedNotification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter;