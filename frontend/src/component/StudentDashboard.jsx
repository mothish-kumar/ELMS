import React, { useEffect, useState } from "react";
import {
  Container, Grid, Card, CardContent, Typography,
  LinearProgress, Button, Avatar, List, ListItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, AppBar, Toolbar, IconButton,
  Checkbox, FormControlLabel
} from "@mui/material";
import { styled } from "@mui/system";
import { PlayCircle, Assignment, Forum, CheckCircle, Close, ThumbUp } from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";

const DashboardContainer = styled(Container)({ marginTop: "20px" });

const StudentDashboard = () => {
  const [student, setStudent] = useState({ name: "", avatar: "" });
  const [progressData, setProgressData] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [open, setOpen] = useState(false);
  const [watchedVideo, setWatchedVideo] = useState({});

  useEffect(() => {
    axiosInstance.get("/studentProgress/getProfile")
      .then((res) => setStudent(res.data))
      .catch((err) => console.log("Error on profile API", err.message));

    axiosInstance.get("/studentProgress")
      .then((res) => setProgressData(res.data.progress))
      .catch((err) => console.log("Error fetching progress", err.message));
  }, []);

  useEffect(() => {
    if (courseId) {
      axiosInstance.get(`/video/${courseId}`)
        .then((res) => setVideos(res.data))
        .catch((err) => toast.error(err.message));
    }
  }, [courseId]);

  useEffect(() => {
    const getVideosWatched = async () => {
      try {
        const watched = {};
        const res = await axiosInstance.get("/studentProgress");
        if (res.data?.progress) {
          res.data.progress.forEach((studentProgress) => {
            studentProgress.completedVideos.forEach((video) => {
              watched[video._id] = true;
            });
          });
        }
        setWatchedVideo(watched);
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to fetch watched videos");
      }
    };
    getVideosWatched();
  }, []);

  const handleOpenDialog = (course) => {
    setCourseId(course._id);
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCourseId(null);
    setVideos([]);
  };

  const handleLike = async (videoId) => {
    try {
      await axiosInstance.post(`/video/${videoId}/like`);
      setVideos((prev) => prev.map((v) => v._id === videoId ? { ...v, likes: v.likes + 1 } : v));
    } catch (err) {
      toast.success("Your already like video");
    }
  };

  const handleWatched = async (courseId, videoId) => {
    try {
      await axiosInstance.put("/studentProgress", { courseId, completedVideos: [videoId] });
      toast.success("Lecture has been watched successfully");
      setWatchedVideo((prev) => ({ ...prev, [videoId]: true }));
    } catch (error) {
      toast.error(error.response?.data.error || "Failed to update watched videos list");
    }
  };

  const handleOpen = (videoUrl, title) => {
    console.log("button clicked")
    setSelectedVideo({ videoUrl, title });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  return (
    <DashboardContainer>
      <Card sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 56, height: 56 }} src={student.avatar}>{student.name.charAt(0)}</Avatar>
        <Typography variant="h5">Welcome, {student.name}</Typography>
      </Card>

      <Grid container spacing={3} mt={3}>
        {progressData.map((courseProgress) => (
          <Grid item xs={12} md={6} key={courseProgress._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">📚 {courseProgress.courseId.title}</Typography>
                <LinearProgress variant="determinate" value={courseProgress.progress} sx={{ my: 1 }} />
                <Typography variant="body2">Progress: {courseProgress.progress}%</Typography>
                <Button variant="contained" startIcon={<PlayCircle />} sx={{ mt: 1 }} onClick={() => handleOpenDialog(courseProgress.courseId)}>
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog fullScreen open={openDialog} onClose={handleCloseDialog}>
        <AppBar sx={{ position: "relative",background:"var(--background-color)"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleCloseDialog} aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {selectedCourse?.title} - Lectures
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{background:"var(--background-color)"}}>
          {videos.length === 0 ? (
            <Typography>No videos available for this course.</Typography>
          ) : (
            videos.map((video) => (
              <Card sx={{ mb: 2, p: 2, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                {/* Title on the left */}
                <Typography variant="h6">{video.title}</Typography>
            
                {/* Buttons on the right */}
                <div>
                  <IconButton color="primary" onClick={() => handleOpen(video.videoUrl, video.title)}>
                    <PlayCircle />
                  </IconButton>
                  <IconButton color="success" onClick={() => handleLike(video._id)}>
                    <ThumbUp style={{ width: "50px" }} /> {video.likes.length}
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!watchedVideo[video._id]}
                        onChange={() => handleWatched(selectedCourse._id, video._id)}
                      />
                    }
                    label={watchedVideo[video._id] ? "Watched" : "Mark as Watched"}
                  />
                </div>
              </div>
            </Card>
            
            ))
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {/* Modal Header with Close Button */}
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">{selectedVideo?.title}</Typography>
          <IconButton onClick={handleClose} sx={{ color: "red" }}>
            <Close />
          </IconButton>
        </DialogTitle>
      
        {/* Video Content */}
        <DialogContent sx={{ textAlign: "center" }}>
          {selectedVideo && (
            <video width="100%" controls autoPlay>
              <source src={`http://localhost:5000${selectedVideo.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </DashboardContainer>
    
  );
};

export default StudentDashboard;
