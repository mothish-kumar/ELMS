import Assignment from "../Schema/AssignmentSchema.js";
import Course from "../Schema/CourseSchema.js";
import User from "../Schema/UserSchema.js";
import Video from '../Schema/VideoSchema.js'
import StudentProgress from '../Schema/StudentProgressSchema.js'

export const createCourse = async (req, res) => {
    if(req.role !== "instructor")   return res.status(401).json({error: "You are not authorized to create a course"});
    try{
        const {title, description} = req.body;
        if(!title || !description) return res.status(400).json({error: "Please fill all the fields"});
        const course = new Course({
            title,
            description,
            instructor: req.userId
        });
        await course.save();
        res.status(201).json({message: "Course Created Successfully"});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getAllCourses = async (req, res) => {
    try{
        const courses = await Course.find().populate("instructor", "name email");
        res.status(200).json({courses});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getAllCoursesByInstructor = async (req, res) => {
    try{
        const courses = await Course.find({ instructor: req.userId }).populate("instructor", "name email");
        res.status(200).json({courses});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getCourseById = async (req, res) => {
    try{
        const course = await Course.findById(req.params.id).populate("instructor", "name email");
        if(!course) return res.status(404).json({error: "Course not found"});
        res.status(200).json({course});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const entrollCourse = async (req, res) => {
    if(req.role !== "student") return res.status(401).json({error: "You are not authorized to enroll in a course"});
    try{
        const course = await Course.findById(req.params.id);
        if(!course) return res.status(404).json({error: "Course not found"});
        if(course.students.includes(req.userId)) return res.status(400).json({error: "You are already enrolled in this course"});
        course.students.push(req.userId);

        // Add the course to the enrolledCourses array of the user
        await User.findByIdAndUpdate(req.userId, {
            $push: { enrolledCourses: req.params.id }
          });

        await course.save();
      
      // 🆕 Create an empty progress record when enrolled
      await StudentProgress.create({
        studentId: req.userId,
        courseId:req.params.id,
        progress: 0
      });
        res.status(200).json({message: "You have successfully enrolled in this course"});
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
    
        if (course.instructor.toString() !== req.userId.toString()) {
          return res.status(403).json({ message: "Not authorized" });
        }
    
        await course.deleteOne();
        res.status(200).json({ message: "Course deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}
export const getTotal = async (req, res) => {

    try {
        const instructorId = req.userId;


        if (!instructorId) {
            return res.status(400).json({ error: "User ID is missing in request." });
        }

        const totalCourses = await Course.countDocuments({ instructor: instructorId });

        const courseIds = await Course.find({ instructor: instructorId }).distinct("_id");


        const totalAssignments = await Assignment.countDocuments({ course: { $in: courseIds } });
        const totalVideos = await Video.countDocuments({ course: { $in: courseIds } });



        res.status(200).json({ totalCourses, totalAssignments, totalVideos });

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};



