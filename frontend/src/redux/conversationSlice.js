import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentConversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = state.conversations.find(
        (c) => c._id === action.payload
      );
    },
    updateLastMessage: (state, action) => {
      const convoIdx = state.conversations.findIndex(
        (c) => c._id === action.payload.conversationId
      );
      state.conversations[convoIdx].lastMessage = action.payload;
    },
    updateLastMessageStatus: (state, action) => {
      const conversationIdx = state.conversations.findIndex(
        (c) => c._id === action.payload.conversationId
      );
      if (conversationIdx > -1) {
        if (
          state.conversations[conversationIdx].lastMessage._id ===
          action.payload._id
        ) {
          state.conversations[conversationIdx].lastMessage = {
            ...state.conversations[conversationIdx].lastMessage,
            ...action.payload.updatedFields,
          };
        }
      }
    },
    resetConversation: (state) => {
      return initialState;
    },
  },
});

export const {
  setConversations,
  updateConversation,
  setCurrentConversation,
  addConversation,
  updateLastMessage,
  updateLastMessageStatus,
  resetConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
