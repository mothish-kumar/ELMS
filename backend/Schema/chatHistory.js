import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["message", "material"], default: "message" },
  fileUrl: { type: String, default: null }, // For material uploads
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
