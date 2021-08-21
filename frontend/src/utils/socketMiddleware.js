import { loginSuccess, logoutSuccess, resetAuth } from "../redux/authSlice";
import { newUser, setUsers, updateUser, resetUsers } from "../redux/usersSlice";
import {
  addMessage,
  setMessages,
  updateMessageStatus,
  resetMessage,
} from "../redux/messagesSlice";
import {
  setCurrentConversation,
  addConversation,
  setConversations,
  updateLastMessage,
  updateLastMessageStatus,
  resetConversation,
} from "../redux/conversationSlice";

import {
  LOGIN,
  LOGOUT,
  NEW_CONVERSATION,
  NEW_MESSAGE,
  UPDATE_MESSAGE,
  GET_CONVERSATION_MESSAGES,
  sendUpdateMessage,
} from "../redux/socketActions";

import Socket from "./Socket";

console.log("Socket middleware running");

const socketMiddleware = () => {
  return ({ getState, dispatch }) => {
    console.log("I am here in socket middleware");

    const socket = new Socket();
    console.log(socket.socket.connected);

    socket.on("socket/connected", () => {
      console.log(socket.socket);
    });
    socket.on("user/login", (user, users, conversations) => {
      dispatch(loginSuccess(user));
      dispatch(setUsers(users));
      dispatch(setConversations(conversations));
    });

    socket.on("user/new", (newUserData) => {
      dispatch(newUser(newUserData));
    });
    socket.on("user/update", (_id, updatedFields) => {
      dispatch(updateUser({ _id, updatedFields }));
    });

    socket.on("user/logout", () => {
      dispatch(logoutSuccess());
      dispatch(resetAuth());
      dispatch(resetUsers());
      dispatch(resetConversation());
      dispatch(resetMessage());
    });

    socket.on("conversation/created", (newConversation) => {
      console.log(newConversation);
      console.log(getState().auth.user._id);

      const loginUser = getState().auth.user._id;
      const recipientId = newConversation.users.find((u) => u !== loginUser);
      console.log(recipientId);
      console.log(newConversation.users);
      console.log(getState().auth.user._id);
      dispatch(addConversation({ recipientId, ...newConversation }));

      if (newConversation.admins[0] === loginUser) {
        dispatch(setCurrentConversation(newConversation._id));
        dispatch(resetMessage());
      }
    });

    socket.on(GET_CONVERSATION_MESSAGES, (messages) => {
      dispatch(setMessages(messages));
    });

    socket.on("message/new", (newMessage) => {
      let status = "delivered";
      if (
        newMessage.conversationId ===
        getState().conversation.currentConversation?._id
      ) {
        dispatch(addMessage(newMessage));
        status = "read";
      }
      dispatch(updateLastMessage(newMessage));

      if (getState().auth.user._id !== newMessage.senderId)
        dispatch(
          sendUpdateMessage({
            _id: newMessage._id,
            userId: getState().auth.user._id,
            status: status,
          })
        );
    });

    socket.on("message/update", (_id, conversationId, updatedFields) => {
      dispatch(updateMessageStatus({ _id, updatedFields }));
      dispatch(updateLastMessageStatus({ _id, conversationId, updatedFields }));
    });

    return (next) => (action) => {
      if (action.socket) {
        switch (action.type) {
          case LOGIN:
            socket.login(action.payload);
            return;
          case LOGOUT:
            socket.logout();
            return;
          case NEW_CONVERSATION:
            socket.createConversation(action.payload);
            return;
          case GET_CONVERSATION_MESSAGES:
            socket.getAllMessages(action.payload);
            return;
          case NEW_MESSAGE:
            socket.sendMessage(action.payload);
            return;
          case UPDATE_MESSAGE:
            socket.updateMessage(action.payload);
            return;
          default:
            next(action);
        }
      }

      next(action);
    };
  };
};

export default socketMiddleware;
