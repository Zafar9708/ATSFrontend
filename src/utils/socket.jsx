import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  socket = io(process.env.REACT_APP_API_URL, {
    withCredentials: true,
    auth: { token }
  });
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};