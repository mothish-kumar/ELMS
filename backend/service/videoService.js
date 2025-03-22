import path from "path";
import fs from "fs";
import Video from "../Schema/VideoSchema.js";
import Course from "../Schema/CourseSchema.js";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 export default class VideoService {
    
    // Delete Video
    static async deleteVideo(videoId, userId) {
      try {
        const video = await Video.findById(videoId);
        if (!video) return { status: 404, message: "Video not found" };
  
        const course = await Course.findById(video.course);
        if (!course) return { status: 404, message: "Course not found" };
  
        // Only the instructor of the course can delete the video
        if (course.instructor.toString() !== userId.toString()) {
          return { status: 403, message: "Not authorized" };
        }
  
        // Delete the video file from server
        const videoPath = path.join(__dirname, `../${video.videoUrl}`);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath); // Deletes the file
        }
  
        // Remove video from course's video list
        course.videos = course.videos.filter(v => v.toString() !== video._id.toString());
        await course.save();
  
        // Delete video from database
        await video.deleteOne();
        return { status: 200, message: "Video deleted successfully" };
  
      } catch (error) {
        console.error("Error deleting video:", error);
        return { status: 500, message: "Internal Server Error" };
      }
    }
  }