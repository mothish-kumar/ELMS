import express from 'express';
import { createAssignment,getAssignment,submitAssignment,updateAssignmentMark, getSubmissions } from '../controller/assignmentController.js';

const router = express.Router();

router.post('/', createAssignment);
router.get('/:id', getAssignment);
router.post('/:id/submit', submitAssignment);
router.put('/:id/grade/:studentId',updateAssignmentMark)
router.get('/:id/submissions',getSubmissions)

  

export default router;