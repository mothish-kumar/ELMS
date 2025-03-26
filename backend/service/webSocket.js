import { Server } from "socket.io";
import Course from '../Schema/CourseSchema.js'
import Chat from '../Schema/chatHistory.js'
import mongoose from "mongoose";
import Material from '../Schema/MaterialSchema.js'

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinCourse", async ({ courseId, userId }) => {
            try {
                const course = await Course.findById(courseId);  // Add `await`
                if (!course) {
                    return socket.emit("error", "Course not found.");
                }
        
                const isEnrolled = course.students.includes(userId) || course.instructor.toString() === userId;
                if (!isEnrolled) {
                    return socket.emit("error", "You are not enrolled in this course.");
                }
        
                socket.join(courseId);
        
                // Fetch chat history for this course
                const chatHistory = await Chat.find({ courseId }).populate("sender", "name ");
                // Fetch uploaded materials
                const materials = await Material.find({ courseId }).populate("instructorId", "name");
                const combinedHistory = [
                    ...chatHistory.map((msg) => ({
                      type: "message",
                      sender: msg.sender,
                      message: msg.message,
                      timestamp: msg.timestamp,
                    })),
                    ...materials.map((mat) => ({
                      type: "material",
                      instructor: mat.instructorId,
                      title: mat.title,
                      description: mat.description,
                      fileUrl: mat.fileUrl,
                      timestamp: mat.createdAt,
                    })),
                  ];
                  combinedHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
                  socket.emit("chatHistory", combinedHistory);
            } catch (error) {
                console.error("Error on joining course", error);
            }
        });
        

        socket.on("sendMessage", async ({ courseId, message, senderId }) => {
            try {
              if (!mongoose.Types.ObjectId.isValid(senderId)) {
                console.error("Invalid senderId:", senderId);
                return;
              }
      
              const chatMessage = new Chat({
                courseId,
                message,
                sender: senderId, 
              });
      
              await chatMessage.save();
              console.log("saved")
      

      
              io.to(courseId).emit("receiveMessage", {
                sender: { _id: senderId, name: "User" }, 
                message,
                timestamp: chatMessage.timestamp,
                type: "message",
              });
            } catch (error) {
              console.error("Error saving message:", error.message);
            }
          });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};
