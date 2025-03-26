import express from 'express';
import { createCourse,getAllCourses,getCourseById ,entrollCourse,deleteCourse, getTotal,getAllCoursesByInstructor} from '../controller/courseController.js';
import { createDiscussion,getDiscussions } from '../controller/discussionController.js';

const router = express.Router();

router.get('/getTotal',getTotal)
router.get('/getAllCoursesByInstructor',getAllCoursesByInstructor)
router.post('/create', createCourse);
router.get('/getAll', getAllCourses);
router.get('/:id', getCourseById);
router.post('/enroll/:id', entrollCourse);
router.delete('/:id', deleteCourse);

//Discussion
router.post('/:id/discussions', createDiscussion);
router.get('/:id/discussions', getDiscussions);




export default router;