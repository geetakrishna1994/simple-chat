import { io } from "socket.io-client";
import { EventEmitter } from "events";
import {
  LOGIN,
  LOGOUT,
  NEW_CONVERSATION,
  NEW_MESSAGE,
  UPDATE_MESSAGE,
  GET_CONVERSATION_MESSAGES,
} from "../redux/socketActions";
class Socket extends EventEmitter {
  // * emitter

  emitConnected() {
    this.emit("socket/connected");
  }
  emitLoginResponse(user, users, conversations) {
    this.emit("user/login", user, users, conversations);
  }

  emitLogout() {
    this.emit("user/logout");
  }

  emitNewConversation(newConversation) {
    this.emit("conversation/created", newConversation);
  }

  emitAllMessages(messages) {
    this.emit(GET_CONVERSATION_MESSAGES, messages);
  }

  emitNewMessage(newMessage) {
    this.emit("message/new", newMessage);
  }
  emitUpdateMessage({ _id, conversationId, updatedFields }) {
    this.emit("message/update", _id, conversationId, updatedFields);
  }

  emitNewUser(newUser) {
    this.emit("user/new", newUser);
  }
  emitUpdateUser({ _id, updatedFields }) {
    this.emit("user/update", _id, updatedFields);
  }

  // * constructor
  constructor() {
    super();
    this.socket = io(process.env.REACT_APP_SOCKET_URI, { autoConnect: false });
    this.listeners = [];
  }
  /**
   * connects the socket
   */
  connect() {
    this.socket.on("user/new", (newUser) => {
      this.emitNewUser(newUser);
    });
    this.socket.on("user/update", ({ _id, updatedFields }) => {
      this.emitUpdateUser({ _id, updatedFields });
    });
    this.socket.on("conversation/new", (newConversation) => {
      this.emitNewConversation(newConversation);
    });
    this.socket.on("message/new", (newMessage) => {
      this.emitNewMessage(newMessage);
    });
    this.socket.on(
      "message/update",
      ({ _id, conversationId, updatedFields }) => {
        this.emitUpdateMessage({
          _id,
          conversationId,
          updatedFields,
        });
      }
    );
    this.socket.connect();
    this.emitConnected();
  }

  /**
   *
   * @param {userdata from firebase auth} userData
   * sends request to server
   * emits login event with user, users, conversations
   */
  login(userData) {
    const { email, displayName, photoURL } = userData;
    if (this.socket.disconnected) this.connect();
    this.socket.emit(
      LOGIN,
      { email, displayName, photoURL },
      (user, users, conversations) => {
        this.emitLoginResponse(user, users, conversations);
      }
    );
  }

  logout(userData) {
    this.socket.emit(LOGOUT, () => {
      this.emitLogout();
      this.socket.removeAllListeners();
      this.socket.close();
      this.listeners = [];
      console.log(this.socket.disconnected);
    });
  }

  attachConversationListener(_id) {
    this.socket.on(_id.toString(), ({ type, payload }) => {
      if (type === "new") {
        this.emitNewMessage(payload);
      } else {
        this.emitMessageUpdate(payload._id, payload.conversationId, payload);
      }
    });

    this.listeners.push(_id.toString());
  }

  createConversation(data) {
    const { users, admins, conversationType } = data;
    this.socket.emit(NEW_CONVERSATION, {
      users,
      admins,
      conversationType,
    });
  }

  getAllMessages(_id) {
    this.socket.emit(GET_CONVERSATION_MESSAGES, _id, (messages) => {
      this.emitAllMessages(messages);
    });
  }

  sendMessage(data) {
    const { _id, content, senderId, conversationId } = data;
    this.socket.emit(NEW_MESSAGE, {
      _id,
      content,
      senderId,
      conversationId,
    });
  }

  updateMessage(data) {
    const { _id, userId, status } = data;
    this.socket.emit(UPDATE_MESSAGE, { _id, userId, status });
  }
}

export default Socket;
