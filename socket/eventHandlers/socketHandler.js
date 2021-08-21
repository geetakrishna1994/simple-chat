export default (socket, dbHandler) => {
  socket.on("user/login", async (data, callback) => {
    // changes status to login
    // executes the callback
    // user : user details
    // users : all users except current user
    // conversations : all conversations of the current user

    try {
      await dbHandler.login(
        {
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
        },
        socket
      );

      const users = await dbHandler.getAllUsers(socket.user._id);
      const conversations = await dbHandler.getAllConversations(
        socket.user._id
      );
      dbHandler.emitLogin(socket);
      // * execute the callback sending back data
      callback(socket.user, users, conversations);

      // !TESTING
      // ! REMOVE THIS LATER
      // dbHandler.createConversation({
      //   users: ["611c2ca5dde6f750f8a5cb8d", "611c2cacdde6f750f8a5cb91"],
      //   admins: ["611c2ca5dde6f750f8a5cb8d"],
      //   conversationType: "private",
      // });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("user/logout", async (callback) => {
    console.log("User - Logout");
    try {
      const userId = socket.user?._id;
      dbHandler.logout(socket.user?._id).then(callback());
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("conversation/create", (conversationData) => {
    const { users, admins, conversationType } = conversationData;
    dbHandler.createConversation({ users, admins, conversationType });
  });

  socket.on("conversation/all-messages", async (_id, callback) => {
    const messages = await dbHandler.getAllMessages(_id, socket.user._id);
    callback(messages);
  });

  socket.on("message/create", ({ _id, content, senderId, conversationId }) => {
    dbHandler.createMessage({ _id, content, senderId, conversationId });
  });

  socket.on("message/update", ({ _id, userId, status }) => {
    dbHandler.updateMessage({ _id, userId, status });
  });
};
