import express from 'express'
import { checkQuizSubmission, createQuiz, getQuizSubmission, getQuizzesByCourse, getStudentQuizScores, submitQuiz } from '../controller/quizController.js'


const router   = express.Router()

router.get("/checkSubmission", checkQuizSubmission); 
router.get("/:courseId", getQuizzesByCourse); 
router.post("/create", createQuiz); 
router.post("/submit", submitQuiz); 
router.get("/submissions/:quizId", getQuizSubmission); 
router.get('/studentScores/:studentId',getStudentQuizScores)

export default router