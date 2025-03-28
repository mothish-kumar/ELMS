import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Card, CardContent, LinearProgress, Grid, Avatar, Box, Chip 
} from "@mui/material";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import axiosInstance from "../utils/axiosInstance";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    axiosInstance.get("/studentProgress/getProfile").then((res) => {
      setStudent(res.data);
      axiosInstance.get("/studentProgress").then((res) => setProgressData(res.data.progress));
      axiosInstance.get("/studentProgress/getScore").then((res) => setMarksData(res.data.marksData))
    });
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6361"];

  return (
    <Container>
      {student && (
        <Card
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: "white",
                color: "#764ba2",
                width: 48,
                height: 48,
                fontSize: "1.25rem",
                fontWeight: "bold",
                mr: 2,
              }}
            >
              {student.name[0]}
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1 }}>
                {student.name}
              </Typography>
              <Typography variant="body2">{student.email}</Typography>
            </Box>
          </Box>

          <Chip
            label={`Courses: ${student.enrolledCourses.length}`}
            color="secondary"
            sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
          />
        </Card>
      )}

      {/* Progress Tracking */}
      <Typography variant="h5" gutterBottom style={{ marginTop: "30px", marginBottom: "20px" }}>
        Progress Tracking
      </Typography>
      <Grid container spacing={3}>
        {progressData.map((course, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 2, borderRadius: "12px", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{course.name}</Typography>
                <LinearProgress variant="determinate" value={course.progress} sx={{ my: 1, height: 10, borderRadius: 5 }} />
                <Typography>{course.progress}% Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Overall Progress Chart */}
      <Typography variant="h5" sx={{ mt: 4 }}>Overall Progress</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <ResponsiveContainer width="60%" height={300}>
          <PieChart>
            <Pie data={progressData} dataKey="progress" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {progressData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Assignment Marks */}
      <Typography variant="h5" sx={{ mt: 4 ,mb:4}}>Assignment Marks Per Course</Typography>
      <Grid container spacing={3}>
        {marksData.map((course, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{course.courseTitle}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={course.assignments}>
                    <XAxis dataKey="assignmentTitle" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="marks" fill={COLORS[index % COLORS.length]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentProfile;
