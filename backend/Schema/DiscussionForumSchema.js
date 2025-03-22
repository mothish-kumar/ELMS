import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    replies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });

  export default mongoose.model("Discussion", DiscussionSchema);