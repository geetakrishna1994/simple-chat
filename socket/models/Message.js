import mongoose from "mongoose";
import Conversation from "./Conversation.js";

const Schema = mongoose.Schema;

const messageSchema = Schema(
  {
    _id: String,
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    deliveredTo: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        deliveredAt: { type: Date },
      },
    ],
    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date },
      },
    ],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.post("save", async (doc, next) => {
  const conversationId = doc.conversationId;
  await Conversation.findByIdAndUpdate(conversationId, {
    $push: { messages: doc._id },
    $set: { lastMessage: doc._id },
  });
  next();
});

export default mongoose.model("Message", messageSchema);
