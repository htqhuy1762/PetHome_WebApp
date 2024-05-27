import { joinRoom, sendMessage, onMessage, leaveRoom } from '~/utils/wsRequestChat';

export const joinChatRoom = (id_room, id_user) => {
  joinRoom(id_room, id_user);
};

export const sendChatMessage = (id_room, message) => {
  sendMessage(id_room, message);
};

export const receiveChatMessage = (callback) => {
  onMessage(callback);
};

export const exitChatRoom = (id_room) => {
  leaveRoom(id_room);
};
