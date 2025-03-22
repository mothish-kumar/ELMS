import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.model("Course", CourseSchema);