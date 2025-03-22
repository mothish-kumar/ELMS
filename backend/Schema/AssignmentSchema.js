import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fileUrl: { type: String, required: true }, // AWS S3 or other storage
        submittedAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });

  export default mongoose.model("Assignment", AssignmentSchema);