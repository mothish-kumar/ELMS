import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  AppBar,
  Toolbar,
  Button,
  Checkbox, FormControlLabel 
} from "@mui/material";
import { PlayCircle, ThumbUp, Visibility, Close } from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";
import { styled } from "@mui/system";
import { toast } from "sonner";


const GradientCard = styled(Card)({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "10px",
  padding: "15px",
  cursor: "pointer",
  marginBottom: "10px",
});

const StudentVideoLectures = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [open, setOpen] = useState(false);
  const [watchedVideo,setWatchedVideo] = useState({})

  useEffect(() => {
    axiosInstance
      .get("/studentProgress/getProfile")
      .then((res) => setEnrolledCourses(res.data.enrolledCourses))
      .catch((err) => toast.error(err.message));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      axiosInstance
        .get(`/video/${selectedCourse._id}`)
        .then((res) => setVideos(res.data))
        .catch((err) => toast.error(err.message));
    }
  }, [selectedCourse]);

  const handleOpenDialog = (course) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
    setVideos([]);
  };

  const handleLike = async (videoId) => {
    try {
      await axiosInstance.post(`/video/${videoId}/like`);
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, likes: v.likes + 1 } : v
        )
      );
    } catch (err) {
      toast.success("You already liked a video");
    }
  };

  const handleWatched = async (courseId, videoId) => {
    try {
      await axiosInstance.put('/studentProgress', { courseId, completedVideos: [videoId] });
      toast.success('Lecture has been watched successfully');
  
      // Update watchedVideos state
      setWatchedVideo(prev => ({
        ...prev,
        [videoId]: true
      }));
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update watched videos list');
      }
    }
  };
  
  const getVideosWatched = async () => {
    try {
      const watched = {};
      const res = await axiosInstance.get("/studentProgress");
  
      if (res.data && res.data.progress) {
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
  
   useEffect(() => {
    getVideosWatched();
  }, []);
    // Open modal and set selected video
    const handleOpen = (videoUrl,title) => {
      const videoData = {videoUrl,title}
      setSelectedVideo(videoData);
      setOpen(true);
    };
  
    // Close modal
    const handleClose = () => {
      setOpen(false);
      setSelectedVideo(null);
    };

  return (
    <>
    <Container>
      
      <Grid container spacing={3}>
        {enrolledCourses.length === 0 ? (
          <Typography>No enrolled courses.</Typography>
        ) : (
          enrolledCourses.map((course) => (
            <Grid item xs={12} md={4} key={course._id}>
              <GradientCard onClick={() => handleOpenDialog(course)}>
                <Typography variant="h6">{course.title}</Typography>
              </GradientCard> 
            </Grid>
          ))
        )}
      </Grid>

      {/* Full-Screen Dialog for Video List */}
      <Dialog fullScreen open={openDialog} onClose={handleCloseDialog}>
        <AppBar sx={{ position: "relative", background: "var(--background-color)" }}>
          <Toolbar>
            <IconButton edge="start" style={{color:'var(--text-color'}} onClick={handleCloseDialog} aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" style={{color:'var(--text-color'}} sx={{ flexGrow: 1 }}>
              {selectedCourse?.title} -Lectures
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ background: "var(--background-color)", padding: "20px" }}>
          {videos.length === 0 ? (
            <Typography style={{color:'var(--text-color)'}}>No videos available for this course.</Typography>
          ) : (
            videos.map((video) => (
              <Card
                key={video._id}
                sx={{
                  mb: 2,
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "white",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{video.title}</Typography>
                </CardContent>
                <div>
                  <IconButton color="primary" onClick={() => handleOpen(video.videoUrl,video.title)}>
                    <PlayCircle style={{width:'50px'}} />
                  </IconButton>
                  <IconButton color="success" onClick={() => handleLike(video._id)}>
                    <ThumbUp style={{width:'50px'}} /> {video.likes.length}
                  </IconButton>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!watchedVideo[video._id]} 
                          onChange={() => handleWatched(selectedCourse._id, video._id)}
                          color="primary"
                          disabled={watchedVideo[video._id]} 
                        />
                      }
                      label={watchedVideo[video._id] ? "Watched" : "Mark as Watched"}
                      sx={{
                        color: watchedVideo[video._id] ? "gray" : "black",
                        "& .MuiCheckbox-root": {
                          color: watchedVideo[video._id] ? "gray" : "var(--button-bg)",
                        },
                      }}
                    />


                </div>
              </Card>
            ))
          )}
        </DialogContent>
      </Dialog>
    </Container>
    {/* Video Popup Modal */}
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
    </>
  );
};

export default StudentVideoLectures;
