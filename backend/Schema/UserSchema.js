import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor", "admin"], required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    createdAt: { type: Date, default: Date.now }
  },{collection: "users"});

  export default mongoose.model("User", UserSchema);
