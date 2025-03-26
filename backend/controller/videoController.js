import Video from '../Schema/VideoSchema.js'
import Course from'../Schema/CourseSchema.js'
import VideoService from '../service/videoService.js';

 export const uploadVideo = async (req, res) => {
    try {
        const { courseId ,title} = req.body;
        if (!courseId || !title) return res.status(400).json({ error: "All fields are required" });
        const course = await Course.findById(courseId);
        if (req.role !== "instructor")  return res.status(403).json({ message: "Only instructors can upload videos" });
        if (course.instructor.toString() !== req.userId.toString())  return res.status(403).json({ message: "Not authorized" });

        if (!course) return res.status(404).json({ error: "Course not found" });
        if (!req.file) return res.status(400).json({ error: "No video uploaded" });
        

        const videoUrl = `/uploads/${course.title}/${req.file.filename}`;
        const video = new Video({
            course:courseId,
            title,
            videoUrl
        });
        await video.save();
        //Update Videos in Course Schema
        course.videos.push(video._id);
        await course.save();

        res.status(201).json({ message: "Video uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
 }

 export const getVideo = async (req, res) => {
    try {
        const video = await Video.find({course:req.params.id}).populate("course", "title");
    
        if (!video) return res.status(404).json({ message: "Video not found" });
    
        res.status(200).json(video);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
 }

 export const likes = async(req,res)=>{
    if (req.role !== "student") return res.status(403).json({ message: "Only students can like videos" });
    try{
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });
        if (video.likes.includes(req.userId))  return res.status(400).json({ message: "You already liked this video" });
        video.likes.push(req.userId);
        await video.save();
        res.status(200).json({ message: "Video liked successfully" })
    }catch(error){
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" });
    }
 }

 export const deleteVideo = async (req, res) => {   
    const result = await VideoService.deleteVideo(req.params.id, req.userId);
    res.status(result.status).json({ message: result.message });
 }

