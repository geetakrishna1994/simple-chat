export default (dbHandler, io, userSocketMap) => {
  dbHandler.on("login", (socket) => {
    console.log("login");
    userSocketMap.set(socket.user._id.toString(), socket);
    socket.join(
      socket.user.conversations.map((c) => c.conversationId.toString())
    );
  });

  dbHandler.on("logout", (_id) => {
    userSocketMap.delete(_id.toString());
  });

  dbHandler.on("user/new", (newUser) => {
    console.log("New User created");
    io.except(newUser._id.toString()).emit("user/new", newUser);
  });

  dbHandler.on("user/update", (_id, updatedFields) => {
    console.log("User Updated : " + _id);
    io.except(_id.toString()).emit("user/update", { _id, updatedFields });
  });

  dbHandler.on("conversation/new", (newConversation) => {
    console.log("New Conversation created");

    // * join corresponding user sockets to conversation room

    const userIds = newConversation.users;
    for (let u of userIds) {
      let s = userSocketMap.get(u.toString());
      if (s) {
        s.join(newConversation._id.toString());
      }
    }
    console.log(userSocketMap);
    // *send new conversation details to conversation room
    io.in(newConversation._id.toString()).emit(
      "conversation/new",
      newConversation
    );
  });

  dbHandler.on("message/new", (newMessage) => {
    const conversationId = newMessage.conversationId;
    io.in(conversationId.toString()).emit("message/new", newMessage);
  });

  dbHandler.on("message/update", (_id, conversationId, updatedFields) => {
    io.in(conversationId.toString()).emit("message/update", {
      _id,
      conversationId,
      updatedFields,
    });
  });
};
