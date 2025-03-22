import Discussion from '../Schema/DiscussionForumSchema.js';
import Course from '../Schema/CourseSchema.js';
import Reply from '../Schema/ReplySchema.js'

export const createDiscussion = async (req, res) => {
    try{
        const {question} = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" })
            const discussion = new Discussion({
                course: req.params.id,
                user: req.userId,
                question
              });
              await discussion.save();

              res.status(201).json(discussion);
    }catch(error){
        console.log(error.message)
        res.status(500).json({ error:'Internal Server Error' });
    }
}

export const getDiscussions = async (req,res) =>{
    try {
        const discussions = await Discussion.find({ course: req.params.id })
          .populate("user", "name email")
          .sort({ createdAt: -1 });
    
        res.status(200).json(discussions);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}

export const replyDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: "Discussion not found" });
    
        const reply = new Reply({
          discussion: req.params.id,
          user: req.userId,
          content: req.body.content
        });
    
        await reply.save();
        discussion.replies.push({
            user:reply._id,
            message:req.body.content,
        });
        await discussion.save();
    
        res.status(201).json(reply);
      } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" });
      }
}

export const getReply = async(req,res)=>{
    try {
        const replies = await Reply.find({ discussion: req.params.id })
          .populate("user", "name email")
          .sort({ createdAt: 1 });
    
        res.status(200).json(replies);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}