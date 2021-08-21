export default (db, dbHandler) => {
  db.once("open", () => {
    const userCollection = db.collection("users");
    const userStream = userCollection.watch();
    userStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const newUser = change.fullDocument;
        dbHandler.emitNewUser(newUser);
      }
      if (change.operationType === "update") {
        const _id = change.documentKey._id;
        const { status } = change.updateDescription.updatedFields;
        if (status)
          dbHandler.emitUpdateUser({
            _id,
            updatedFields: change.updateDescription.updatedFields,
          });
      }
    });

    const conversationCollection = db.collection("conversations");
    const conversationStream = conversationCollection.watch();
    conversationStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const newConversation = change.fullDocument;
        dbHandler.emitNewConversation(newConversation);
      }
    });

    const messageCollection = db.collection("messages");
    const messageStream = messageCollection.watch();
    messageStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        const newMessage = change.fullDocument;
        dbHandler.emitNewMessage(newMessage);
      } else if (change.operationType === "update") {
        const _id = change.documentKey._id;
        dbHandler.emitUpdateMessage({
          _id,
          updatedFields: change.updateDescription.updatedFields,
        });
      }
    });
  });
};
