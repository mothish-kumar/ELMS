import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Grid, LinearProgress } from "@mui/material";
import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";
import CloudinaryUploadWidget from "../component/CloudinaryUploadWidget";

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const studentId = localStorage.getItem('userId')

  // Fetch enrolled courses & assignments
  const fetchAssignments = async () => {
    try {
      const profileRes = await axiosInstance.get("/studentProgress/getProfile");

      let allAssignments = [];
      for (const course of profileRes.data.enrolledCourses) {
        const res = await axiosInstance.get(`/assignment/${course._id}`);
        allAssignments = [...allAssignments, ...res.data];
      }

      // Filter out assignments where student has already submitted
      const pendingAssignments = allAssignments.filter(
        (assignment) => !assignment.submissions.some((sub) => sub.student._id === studentId)
      );

      setAssignments(pendingAssignments);
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch assignments");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle file upload & submission
  const handleFileUpload = async (assignmentId, fileUrl) => {
    try {
      await axiosInstance.post(`/assignment/${assignmentId}/submit`, {
        submissionUrl: fileUrl,
      });
      toast.success("Assignment submitted successfully!");
      fetchAssignments(); // Refresh the list
    } catch (error) {
      toast.error("Submission failed!");
    }
  };

  return (
    <Container>
      
      {assignments.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No pending assignments 🎉
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} md={6} key={assignment._id}>
              <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">{assignment.title}</Typography>
                  <Typography variant="body2">{assignment.description}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                  </Typography>

                  {/* Upload Button */}
                  <CloudinaryUploadWidget onUpload={(fileUrl) => handleFileUpload(assignment._id, fileUrl)} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StudentAssignment;
