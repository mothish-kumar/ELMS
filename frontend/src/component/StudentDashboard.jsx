import React, { useEffect, useState } from "react";
import { 
  Container, Grid, Card, CardContent, Typography, 
  LinearProgress, Button, Avatar, List, ListItem, ListItemIcon, ListItemText 
} from "@mui/material";
import { styled } from "@mui/system";
import { PlayCircleFilled, Assignment, Forum, CheckCircle } from "@mui/icons-material";
import axiosInstance from '../utils/axiosInstance'

const DashboardContainer = styled(Container)({
  marginTop: "20px",
});

const StudentDashboard = () => {
  const [student, setStudent] = useState({ name: "", avatar: "" });
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    // Fetch Student Profile
    axiosInstance.get("/studentProgress/getProfile").then((res) => setStudent(res.data)).catch((err)=>console.log('Error on profile api',err.message));

    // Fetch Student Progress
    axiosInstance.get("/studentProgress").then((res) => {
      setProgressData(res.data.progress); 
    });
  }, []);

  return (
    <DashboardContainer>
      {/* Welcome Section */}
      <Card sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 56, height: 56 }} src={student.avatar}>{student.name.charAt(0)}</Avatar>
        <Typography variant="h5">Welcome, {student.name}</Typography>
      </Card>

      <Grid container spacing={3} mt={3}>
        {/* Student Progress - Courses */}
        {progressData.map((courseProgress) => (
          <Grid item xs={12} md={6} key={courseProgress._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">📚 {courseProgress.courseId.title}</Typography>
                <LinearProgress variant="determinate" value={courseProgress.progress} sx={{ my: 1 }} />
                <Typography variant="body2">Progress: {courseProgress.progress}%</Typography>
                <Button variant="contained" startIcon={<PlayCircleFilled />} sx={{ mt: 1 }}>
                  Continue Learning
                </Button>

                {/* Completed Videos */}
                {courseProgress.completedVideos.length > 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>🎥 Completed Videos:</Typography>
                    <List dense>
                      {courseProgress.completedVideos.map((video) => (
                        <ListItem key={video._id}>
                          <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                          <ListItemText primary={video.title} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Submitted Assignments */}
                {courseProgress.submittedAssignments.length > 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>📝 Submitted Assignments:</Typography>
                    <List dense>
                      {courseProgress.submittedAssignments.map((assignment) => (
                        <ListItem key={assignment._id}>
                          <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                          <ListItemText primary={assignment.title} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Discussion Forum */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">💬  Discussions</Typography>
              <Typography variant="body2">Join course discussions and interact with peers.</Typography>
              <Button variant="contained" startIcon={<Forum />} sx={{ mt: 1 }}>
                Go to Forum
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default StudentDashboard;
