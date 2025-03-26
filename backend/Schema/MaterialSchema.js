import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true }, // URL to the uploaded file
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Material", MaterialSchema);
