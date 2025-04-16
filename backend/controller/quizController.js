import QuizSchema from "../Schema/QuizSchema.js";
import QuizSubmissionSchema from "../Schema/QuizSubmissionSchema.js";


export const createQuiz = async(req,res)=>{
    if(req.role !== "instructor") return res.status(403).json({message:'Unauthorized access'})
        try {
            const { courseId, title, questions } = req.body;
            const quiz = new QuizSchema({ courseId, title, questions });
            await quiz.save();
            res.status(201).json({ message: "Quiz created successfully", quiz });
          } catch (error) {
            res.status(500).json({ error: "Internal Server Error", message: error.message });
          }
}
export const getQuizzesByCourse = async (req, res) => {
    try {
      const quizzes = await QuizSchema.find({ courseId: req.params.courseId });
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  };

  export const submitQuiz = async (req, res) => {
    try {
      const { quizId, answers } = req.body;
      const quiz = await QuizSchema.findById(quizId);
  
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
      let score = 0;
      const calculatedAnswers = quiz.questions.map((q, index) => {
        const isCorrect = q.correctAnswer === answers[index];
        if (isCorrect) score++;
        return {
          questionId: q._id,
          selectedAnswer: answers[index],
        };
      });
  
      const submission = new QuizSubmissionSchema({
        studentId: req.userId,
        quizId,
        answers: calculatedAnswers,
        score,
      });
  
      await submission.save();
  
      res.status(200).json({ message: "Quiz submitted successfully", score });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  };

  export const getQuizSubmission = async(req,res)=>{
    try {
        const { quizId } = req.params;
        const submissions = await QuizSubmissionSchema.find({ quizId }).populate("studentId", "name email score");
        res.status(200).json(submissions);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
  }

  export const checkQuizSubmission = async (req, res) => {
    try {
      const { quizId, studentId } = req.query;
      const submission = await QuizSubmissionSchema.findOne({ quizId, studentId });
      if (submission) {
        return res.status(200).json({ submitted: true });
      }
      res.status(200).json({ submitted: false });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  };

  export const getStudentQuizScores = async (req, res) => {
    try {
      const { studentId } = req.params;
      const submissions = await QuizSubmissionSchema.find({ studentId }).populate("quizId", "title");
  
      const quizScores = submissions.map((submission) => ({
        quizTitle: submission.quizId.title,
        score: submission.score,
      }));
  
      res.status(200).json(quizScores);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  };