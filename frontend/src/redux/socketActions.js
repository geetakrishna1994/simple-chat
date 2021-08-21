export const LOGIN = "user/login";
export const LOGOUT = "user/logout";
export const NEW_CONVERSATION = "conversation/create";
export const NEW_MESSAGE = "message/create";
export const UPDATE_MESSAGE = "message/update";
export const GET_CONVERSATION_MESSAGES = "conversation/all-messages";

export const sendLogin = (userDetails) => {
  return { socket: true, type: LOGIN, payload: userDetails };
};

export const sendLogout = () => {
  return { socket: true, type: LOGOUT };
};

export const sendNewConversation = (conversationData) => {
  return { socket: true, type: NEW_CONVERSATION, payload: conversationData };
};

export const sendGetAllMessages = (_id) => {
  return { socket: true, type: GET_CONVERSATION_MESSAGES, payload: _id };
};

export const sendNewMessage = (messageData) => {
  return { socket: true, type: NEW_MESSAGE, payload: messageData };
};

export const sendUpdateMessage = (messageData) => {
  return { socket: true, type: UPDATE_MESSAGE, payload: messageData };
};
