import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import conversationReducer from "./conversationSlice";
import messagesReducer from "./messagesSlice";
import socketMiddleware from "../utils/socketMiddleware";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    conversation: conversationReducer,
    messages: messagesReducer,
  },
  middleware: [socketMiddleware()],
});
