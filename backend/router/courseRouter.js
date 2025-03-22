import express from 'express';
import { createCourse,getAllCourses,getCourseById ,entrollCourse,deleteCourse} from '../controller/courseController.js';

const router = express.Router();

router.post('/create', createCourse);
router.get('/getAll', getAllCourses);
router.get('/:id', getCourseById);
router.post('/enroll/:id', entrollCourse);
router.delete('/:id', deleteCourse);

export default router;