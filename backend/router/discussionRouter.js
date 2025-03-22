import express from 'express';
import {replyDiscussion,getReply} from '../controller/discussionController.js';

const router = express.Router();

router.post('/:id/reply', replyDiscussion);
router.get('/:id/reply', getReply);

export default router