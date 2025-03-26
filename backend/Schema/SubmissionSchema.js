import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submissionUrl: { type: String, required: true },
    marks: { type: Number, default: null } , 
    submittedAt: { type: Date, default: Date.now }
  });

export default mongoose.model("Submission", submissionSchema);