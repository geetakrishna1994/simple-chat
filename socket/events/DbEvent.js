import { EventEmitter } from "events";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

class DbEvent extends EventEmitter {
  emitNewUser(newUser) {
    console.log(newUser);
    this.emit("user/new", newUser);
  }

  emitUpdateUser({ _id, updatedFields }) {
    this.emit("user/update", _id, updatedFields);
  }

  emitNewConversation(newConversation) {
    const populatedConversation = this.populateConversation(newConversation);
    this.emit("conversation/new", populatedConversation);
  }

  emitUpdateConversation({ _id, updatedFields }) {
    this.emit("conversation/update", _id, updatedFields);
  }

  emitNewMessage(newMessage) {
    this.emit("message/new", newMessage);
  }

  emitLogin(socket) {
    this.emit("login", socket);
  }

  emitLogout(_id) {
    this.emit("logout", _id);
  }

  async emitUpdateMessage({ _id, updatedFields }) {
    const updatedMessage = await Message.findById(_id);
    const conversationId = updatedMessage.conversationId;
    this.emit("message/update", _id, conversationId, updatedFields);
  }

  emitDeleteMessage({ _id }) {
    this.emit("message/delete", _id);
  }

  async login({ email, displayName, photoURL }, socket) {
    console.log("USER - LOGIN");
    // change "status" to login if exists
    // if NOT EXISTS create user with status login
    try {
      const existingUser = await User.findOneAndUpdate(
        { email },
        { $set: { status: "online" } }
      );
      // console.log(existingUser);
      if (existingUser) {
        socket.user = existingUser.toJSON();
      } else {
        const newUser = new User({
          email,
          displayName,
          photoURL,
          status: "online",
          description: "Online",
        });
        await newUser.save();
        socket.user = newUser.toJSON();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async logout(_id) {
    console.log("USER - LOGOUT");
    try {
      await User.findByIdAndUpdate(_id, {
        $set: { status: "offline" },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getAllConversations(_id) {
    // get all conversations of the user
    // returns {recipientId, conversationDetails, lastMessage}
    try {
      console.log(_id);
      const user = await User.findById(_id);
      const { conversations } = await user
        .populate({
          path: "conversations",
          select: "-_id",
          populate: {
            path: "conversationId",
            model: Conversation,
            select: "-messages",
            populate: {
              path: "lastMessage",
            },
          },
        })
        .execPopulate();

      return conversations.map((c) => {
        return { recipientId: c.userId, ...c.toJSON().conversationId };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers(id) {
    // get all users except for the current user
    try {
      const users = await User.find({ _id: { $ne: id } });
      return users;
    } catch (err) {
      console.log(err);
    }
  }

  async createConversation({ users, admins, conversationType }) {
    try {
      const newConversation = new Conversation({
        users,
        admins,
        conversationType,
      });
      await newConversation.save();
    } catch (err) {
      console.log(err);
    }
  }

  populateConversation(newConversation) {
    try {
      // * remove messages, users, admins fields
      const { messages: m, ...rest } = newConversation;

      return { ...rest };
    } catch (err) {
      console.log(err);
    }
  }

  async getAllMessages(_id, userId) {
    const { messages } = await Conversation.findById(_id)
      .select("messages")
      .populate("messages");
    await Message.updateMany(
      {
        conversationId: { $eq: _id },
        "deliveredTo.userId": { $ne: userId },
      },
      { $push: { deliveredTo: { userId, deliveredAt: Date.now() } } }
    );
    await Message.updateMany(
      {
        conversationId: { $eq: _id },
        "readBy.userId": { $ne: userId },
      },
      { $push: { readBy: { userId, readAt: Date.now() } } }
    );
    return messages.map((m) => m.toJSON());
  }

  async createMessage({ _id, senderId, content, conversationId }) {
    try {
      const newMessage = new Message({
        _id,
        senderId,
        content,
        conversationId,
        status: "sent",
      });
      await newMessage.save();
    } catch (error) {
      console.log(error);
    }
  }

  async updateMessage({ _id, status, userId }) {
    try {
      const updateMessage = await Message.findById(_id);
      if (status === "delivered") {
        await updateMessage.updateOne({
          $push: { deliveredTo: { userId, deliveredAt: Date.now() } },
        });
      } else if (status === "read")
        await updateMessage.updateOne({
          $push: { readBy: { userId, readAt: Date.now() } },
        });
    } catch (err) {
      console.log(err);
    }
  }
}

export default DbEvent;
