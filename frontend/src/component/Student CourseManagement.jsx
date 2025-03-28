import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import axiosInstance from '../utils/axiosInstance';
import {toast} from 'sonner'

// Styled components for scrollable section
const ScrollableContainer = styled("div")({
  maxHeight: "500px",
  overflowY: "auto",
  paddingRight: "10px",
});

// Gradient background generator based on theme
const getGradient = (index) => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  ];
  return gradients[index % gradients.length];
};

// Styled Card with White Border
const StyledCard = styled(Card)(({ theme, index }) => ({
  border: "2px solid white",
  background: getGradient(index),
  color: "white",
}));

const StudentCourseManagement = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    // Fetch all available courses
    axiosInstance.get("/course/getAll").then((res) => setAvailableCourses(res.data.courses));

    // Fetch enrolled courses with progress
    axiosInstance.get("/studentProgress").then((res) => setEnrolledCourses(res.data.progress));
  }, []);

  // Filter available courses to exclude already enrolled courses
  const enrolledCourseIds = new Set(enrolledCourses.map((course) => course.courseId._id));
  const filteredAvailableCourses = availableCourses.filter((course) => !enrolledCourseIds.has(course._id));

  const handleEnroll = async (courseId) => {
    try {
      await axiosInstance.post(`/course/enroll/${courseId}`);
      
      // Find the enrolled course and remove it from available courses
      const enrolledCourse = availableCourses.find((c) => c._id === courseId);
      
      if (enrolledCourse) {
        setEnrolledCourses((prev) => [...prev, { courseId: enrolledCourse, progress: 0 }]);
        setAvailableCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
      toast.success("Entrollement has been successfully completed")
    } catch (error) {
      console.error("Enrollment failed", error);
    }
  };
  

  return (
    <Container>
      <Grid container spacing={3}>
        
        {/* Available Courses - Left Side */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Available Courses</Typography>
          <ScrollableContainer>
            {filteredAvailableCourses.length > 0 ? (
              filteredAvailableCourses.map((course, index) => (
                <StyledCard key={course._id} index={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{course.title}</Typography>
                    <Typography variant="body2">{course.description}</Typography>

                    {/* Instructor Details */}
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      👨‍🏫 Instructor: <strong>{course.instructor.name}</strong>
                    </Typography>
                    <Typography variant="body2">
                      📧 {course.instructor.email}
                    </Typography>

                    {/* Enroll Button */}
                    <Button variant="contained" color="primary" onClick={() => handleEnroll(course._id)} sx={{ mt: 1 }}>
                      Enroll
                    </Button>
                  </CardContent>
                </StyledCard>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                🎉 You are enrolled in all available courses!
              </Typography>
            )}
          </ScrollableContainer>
        </Grid>

        {/* Enrolled Courses - Right Side */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Your Enrolled Courses</Typography>
          <ScrollableContainer>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course, index) => (
                <StyledCard key={course._id} index={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{course.courseId.title}</Typography>
                    <LinearProgress variant="determinate" value={course.progress} sx={{ my: 1 }} />
                    <Typography variant="body2">Progress: {course.progress}%</Typography>
                  </CardContent>
                </StyledCard>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                🚀 You have not enrolled in any courses yet!
              </Typography>
            )}
          </ScrollableContainer>
        </Grid>

      </Grid>
    </Container>
  );
};

export default StudentCourseManagement;
