import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["online", "offline"], required: true },
    conversations: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        conversationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Conversation",
        },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
