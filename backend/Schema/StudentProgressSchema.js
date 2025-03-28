import mongoose from 'mongoose'

const StudentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  submittedAssignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  quizScores: [
    {
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
      marks:Number
    }
  ],
  progress: { type: Number, default: 0 } 
}, { timestamps: true });

export default mongoose.model("StudentProgress", StudentProgressSchema);
