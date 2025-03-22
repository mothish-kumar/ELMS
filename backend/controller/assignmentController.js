import Assignment from "../Schema/AssignmentSchema.js";
import Course from "../Schema/CourseSchema.js";
import Submission from "../Schema/SubmissionSchema.js";

export const createAssignment = async (req, res) => {
    if(req.role !== "instructor")  return res.status(400).json({message: "You are not allowed to create assignment"});
    const {courseId, title, description, dueDate} = req.body;
    try {
        const course = await Course.findById(courseId);
        if(!course) return res.status(400).json({message: "Course not found"});
        const assignment = new Assignment({
            course: courseId,
            title,
            description,
            dueDate
        });
        await assignment.save();

        // Add assignment to the course
        course.assignments.push(assignment._id);
        await course.save();

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const getAssignment = async(req,res)=>{
    try {
        const assignment = await Assignment.findById(req.params.id).populate("course", "title");
    
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    
        res.status(200).json(assignment);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}

export const submitAssignment = async(req,res)=>{
    if(req.role !== "student") return res.status(403).json({message: "You are not allowed to submit assignment"});
    try {
        const { submissionUrl } = req.body;
        const assignment = await Assignment.findById(req.params.id);
    
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    
        // Check if student already submitted
        const existingSubmission = await Submission.findOne({
          assignment: req.params.id,
          student: req.userId
        });
    
        if (existingSubmission)  return res.status(400).json({ message: "You have already submitted this assignment" });
    
        const submission = new Submission({
          assignment: req.params.id,
          student: req.userId,
          submissionUrl
        });
    
        await submission.save();
    
        res.status(201).json({ message: "Assignment submitted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}

export const updateAssignmentMark = async(req,res)=>{
    if(req.role !== "instructor") return res.status(403).json({message: "You are not allowed to update marks"});
    try{
        const {marks} = req.body
        const submission = await Submission.findOne({
            assignment: req.params.id,
            student: req.params.studentId
          });
      
          if (!submission)  return res.status(404).json({ message: "Submission not found" });

          submission.marks = marks;
          await submission.save();
      
          res.status(200).json({ message: "Marks assigned successfully" });
    }catch(error){
        res.status(500).json({error:'Internal Server Error'})
    }
}

export const getSubmissions = async(req,res)=>{
    try {
        const assignment = await Assignment.findById(req.params.id).populate("course");
    
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    
        if (assignment.course.instructor.toString() !== req.userId.toString())  return res.status(403).json({ message: "Not authorized" });    
        
        const submissions = await Submission.find({ assignment: req.params.id })
          .populate("student", "name email")
          .select("submissionUrl marks");
    
        res.status(200).json(submissions);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}