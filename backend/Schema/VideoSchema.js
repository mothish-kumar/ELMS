import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // AWS S3 or other storage
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
  });
  
  export default  mongoose.model("Video", VideoSchema);
  