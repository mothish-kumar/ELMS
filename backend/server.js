import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';  
import { setupSocket } from './service/webSocket.js';

import authRouter from './router/authRouter.js';
import courseRouter from './router/courseRouter.js';
import {authMiddleware} from './middleware/authMiddleware.js';
import videoRouter from './router/videoRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import assignmentRouter from './router/assignmentRouter.js';
import discussionRouter from './router/discussionRouter.js';
import materialRouter from './router/MaterialRouter.js'
import studentProgressRouter from './router/studentProgressRouter.js'

dotenv.config();

const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,  
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"]  
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 

// DB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed", error);
    }
};
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/course', authMiddleware, courseRouter);
app.use('/api/video', authMiddleware, videoRouter);
app.use('/api/assignment', authMiddleware, assignmentRouter);
app.use('/api/discussion/',authMiddleware,discussionRouter);
app.use('/api/material',authMiddleware,materialRouter)
app.use('/api/studentProgress',authMiddleware,studentProgressRouter)



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start WebSocket server
const io = setupSocket(server);
app.set("io",io)

server.listen(process.env.SERVER_PORT, () => {
    console.log("Server is running on port", process.env.SERVER_PORT);
});
