import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import Chat from "./Chat";

const InstructorChat = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/course/getAllCoursesByInstructor");
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, []);

  const handleTabChange = (event, newIndex) => {
    setSelectedCourse(newIndex);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "70px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tabs value={selectedCourse} onChange={handleTabChange} centered sx={{
    "& .MuiTabs-indicator": { backgroundColor: "var(--background-color)" }, 
    "& .MuiTab-root": { color: "var(--text-color)" }, 
    "& .Mui-selected": { color: "var(-text-color)", fontWeight: "bold" } 
  }}>
        {courses.map((course, index) => (
          <Tab key={course._id} label={course.title} />
        ))}
      </Tabs>

      {courses.length > 0 && (
        <Box 
          sx={{ 
            width: "80%", 
            maxWidth: "900px", 
            height: "70vh", /* Fixed height */
            marginTop: "20px", 
            display: "flex", 
            flexDirection: "column",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
            borderRadius: "12px",
            overflow: "hidden" 
          }}
        >
  

          {/* Chat container with scrollable messages */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <Chat 
              courseId={courses[selectedCourse]?._id} 
              userId={userId} 
              userName={userName} 
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InstructorChat;
