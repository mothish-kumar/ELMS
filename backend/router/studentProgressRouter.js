import express from 'express'
import { getMarks, getStudentProfile, getStudentProgress, updateStudentProgress } from '../controller/studentProgressController.js'

const router = express.Router()

router.put('/',updateStudentProgress)
router.get('/',getStudentProgress)
router.get('/getProfile',getStudentProfile)
router.get('/getScore/',getMarks)

export default router