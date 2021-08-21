import mongoose from "mongoose";
import User from "./User.js";

const Schema = mongoose.Schema;

const conversationSchema = Schema(
  {
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    conversationType: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    admins: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    photoURL: String,
    name: String,
    messages: [{ type: String, ref: "Message" }],
    lastMessage: { type: String, ref: "Message" },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.post("save", async (doc) => {
  for (let i = 0; i < doc.users.length; i++) {
    await User.findByIdAndUpdate(doc.users[i], {
      $push: {
        conversations: { userId: doc.users[1 - i], conversationId: doc._id },
      },
    });
  }
});

export default mongoose.model("Conversation", conversationSchema);
