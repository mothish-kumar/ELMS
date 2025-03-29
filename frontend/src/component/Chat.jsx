import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Avatar, Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "../utils/axiosInstance";
import { toast } from "sonner";
import './Chat.css'
import BackupIcon from '@mui/icons-material/Backup';

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Chat = ({ courseId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!courseId || !userId) return toast.error("Failed to send message, relogin again");

    socket.emit("joinCourse", { courseId, userId });

    socket.on("chatHistory", (chatHistory) => {
      setMessages(chatHistory);
      scrollToBottom();
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    // Listen for material uploads
  socket.on("materialUploaded", (material) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: { name: material.instructor, _id: "system" }, 
        message: ` Material Uploaded: ${material.title}`,
        fileUrl: material.fileUrl,
        timestamp: material.timestamp,
      },
    ]);
    scrollToBottom();
  });
    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
      socket.off("materialUploaded");
    };
  }, [courseId, userId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
  
    // Send message to the server
    socket.emit("sendMessage", {
      courseId,
      message: newMessage,
      senderId: userId,
    });
  
    setNewMessage(""); // Clear input field
    scrollToBottom();
  };
  

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadMaterial = async () => {
    if (!selectedFile) return toast.error("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseId", courseId);
    formData.append("title", selectedFile.name);
    formData.append("description", "Uploaded via chat");

    try {
      const res = await axios.post("/material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Material uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload material.");
      console.error(error.message);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Box className="chat-container">
  <Box className="chat-header">
    <Typography variant="h6">Course Chat</Typography>
  </Box>

  <Box className="chat-messages">
    {messages.map((msg, index) => (
      <Box key={index} className={`chat-bubble ${msg.sender?._id === userId ? "own-message" : ""}`}>
        <Avatar className="chat-avatar">{msg.sender?.name[0]}</Avatar>
        <Box className="chat-content">
          <Typography style={{color:'var(--primary-color)'}} className="chat-sender">{msg.sender?.name}</Typography>
          {msg.type === "message" ? (
            <Typography style={{color:'black'}} className="chat-text">{msg.message}</Typography>
          ) : (
            <Box className="chat-material">
              <Typography className="chat-text" > </Typography>
              <Typography style={{color:'var(--primary-color)'}}>{msg.description}</Typography>
              <a href={`http://localhost:5000/uploads${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
                📥 Download Material
              </a>
            </Box>
          )}
          <Typography className="chat-time">{new Date(msg.timestamp).toLocaleTimeString()}</Typography>
        </Box>
      </Box>
    ))}
    <div ref={chatRef} />
  </Box>

  <Box className="chat-input">
    <TextField
      fullWidth
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type a message..."
      variant="outlined"
      className="message-input"
    />
    <IconButton onClick={sendMessage} color="primary">
      <SendIcon />
    </IconButton>

    <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="file-upload" />
    <label htmlFor="file-upload">
      <IconButton component="span" color="primary">
        <AttachFileIcon />
      </IconButton>
    </label>

    {selectedFile && (
      <Button variant="contained" onClick={uploadMaterial}>
        <BackupIcon />
      </Button>
    )}
  </Box>
</Box>

  );
};

export default Chat;
