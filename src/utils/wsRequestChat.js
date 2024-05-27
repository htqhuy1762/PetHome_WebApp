import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_BASE_URL_CHAT_WS;

export const socket = io(SOCKET_URL, {
  path: '/ws',
  reconnectionDelayMax: 10000,
});

export const joinRoom = (id_room, id_user) => {
  socket.emit('joinRoom', { id_room, id_user });
};

export const sendMessage = (id_room, message) => {
  socket.emit('sendMessage', { id_room, message });
};

export const onMessage = (callback) => {
  socket.on('message', callback);
};

export const leaveRoom = (id_room) => {
  socket.emit('leaveRoom', { id_room });
};