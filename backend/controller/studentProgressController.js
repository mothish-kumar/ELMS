import StudentProgress from "../Schema/StudentProgressSchema.js";
import Course from "../Schema/CourseSchema.js";
import Submission from '../Schema/SubmissionSchema.js'
import User from '../Schema/UserSchema.js'
import Assignment from '../Schema/AssignmentSchema.js'

export const updateStudentProgress = async (req, res) => {
  const { courseId, completedVideos, submittedAssignments, quizScores } = req.body;

  try {
    let progress = await StudentProgress.findOne({ studentId: req.userId, courseId });

    // 🔹 If progress doesn't exist, create a new record
    if (!progress) {
      progress = new StudentProgress({ studentId: req.userId, courseId });
    }

    // 🔹 Add completed videos if provided
    if (completedVideos) {
      completedVideos.forEach((videoId) => {
        if (!progress.completedVideos.includes(videoId)) {
          progress.completedVideos.push(videoId);
        }else{
          res.status(400).json({error:"This video is already watched"})
        }
      });
    }

    // 🔹 Add submitted assignments if provided
    if (submittedAssignments) {
      submittedAssignments.forEach((assignmentId) => {
        if (!progress.submittedAssignments.includes(assignmentId)) {
          progress.submittedAssignments.push(assignmentId);
        }
      });
    }

    // 🔹 Add quiz scores if provided
    if (quizScores) {
      quizScores.forEach(({ submissionId, marks }) => {
        const existingQuiz = progress.quizScores.find(q => q.submissionId.toString() === submissionId);
        if (!existingQuiz) {
          progress.quizScores.push({ submissionId, marks });
        }
      });
    }

    // 🔹 Fetch course details to calculate progress
    const course = await Course.findById(courseId).populate("videos assignments");

    // 🔹 Fetch the student's submitted assignments
    const submissions = await Submission.find({ student: req.userId, assignment: { $in: course.assignments } });

    // 🔹 Update submitted assignments list in progress
    progress.submittedAssignments = submissions.map((submission) => submission.assignment);

    // 🔹 Calculate progress percentage
    const totalItems = course.videos.length + course.assignments.length;
    const completedItems = progress.completedVideos.length + progress.submittedAssignments.length;
    progress.progress = totalItems > 0 ? Math.floor((completedItems / totalItems) * 100) : 0;

    await progress.save();

    res.status(200).json({ message: "Progress updated", progress: progress.progress });
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error: error.message });
  }
};

export const getStudentProgress = async (req, res) => {
    try {
      const user =await User.findById(req.userId)
      if(!user) return res.status(404).json({error:'User Not found'})
        const courseIds = user.enrolledCourses
      const progress = await StudentProgress.find({
        studentId: req.userId,
        courseId:{$in :courseIds},
      })
      .populate("courseId", "title")
        .populate("completedVideos", "title")
        .populate("submittedAssignments", "title");
  
      if (!progress.length) {
        return res.status(404).json({ message: "No progress found for this courses." });
      }
  
      res.status(200).json({ progress });
    } catch (error) {
      res.status(500).json({ message: "Error fetching progress", error: error.message });
    }
  };
  
  export const getStudentProfile = async (req, res) => {
    try {
      const student = await User.findById(req.userId)
        .select("name email  enrolledCourses")
        .populate("enrolledCourses", "title") 
        .lean();
  
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: "Error fetching student profile", message: error.message });
    }
  };

  export const getMarks = async (req, res) => {
    try {
      const studentId = req.userId;
  
      // Find enrolled courses for the student
      const student = await User.findById(studentId).populate("enrolledCourses");
      if (!student) return res.status(404).json({ message: "Student not found" });
  
      const courses = student.enrolledCourses;
  
      // Fetch assignments for each enrolled course
      const marksData = await Promise.all(
        courses.map(async (course) => {
          const assignments = await Assignment.find({ course: course._id });
  
          // Fetch submissions for each assignment
          const assignmentData = (
            await Promise.all(
              assignments.map(async (assignment) => {
                const submission = await Submission.findOne({
                  assignment: assignment._id,
                  student: studentId,
                });
  
                // If no submission, return null (will be filtered later)
                if (!submission) return null;
  
                return {
                  assignmentTitle: assignment.title,
                  marks: submission.marks, // Include marks if available
                };
              })
            )
          ).filter((assignment) => assignment !== null); // Remove null values
  
          // If no valid assignments, return null (will be filtered later)
          if (assignmentData.length === 0) return null;
  
          return {
            courseTitle: course.title,
            assignments: assignmentData,
          };
        })
      );
  
      // Remove null values (courses with no submissions)
      const filteredMarksData = marksData.filter((item) => item !== null);
  
      res.status(200).json({ marksData: filteredMarksData });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
    }
  };
  
  
  
  
  
