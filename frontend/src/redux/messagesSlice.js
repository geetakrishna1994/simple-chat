import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const message = state.messages.find((m) => m._id === action.payload._id);
      if (message) message.status = action.payload.status;
      else state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action) => {
      const messageIdx = state.messages.findIndex(
        (m) => m._id === action.payload._id
      );
      if (messageIdx > -1) {
        state.messages[messageIdx] = {
          ...state.messages[messageIdx],
          ...action.payload.updatedFields,
        };
      }
    },
    resetMessage: (state) => {
      return initialState;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  updateMessageStatus,
  resetMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
