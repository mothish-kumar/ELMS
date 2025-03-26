import { Button, TextField, Typography, Card, CardContent, Grid, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axiosInstance from "../utils/axiosInstance"; 
import videoUploadImg from "../assets/videoUpload.svg"; 
import { toast } from "sonner";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch course list from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/course/getAllCoursesByInstructor");
        setCourses(res.data.courses);
      } catch (error) {
        toast.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, []);

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video || !videoTitle || !selectedCourse) {
      alert("Please select a course, provide a title, and choose a video.");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("title", videoTitle);
    formData.append("video", video);

    setLoading(true);
    try {
      const res = await axiosInstance.post("/video/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

     toast.success(res.data.message)
      setVideo(null);
      setVideoTitle("");
      setSelectedCourse("");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error('Failed to upload video')
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ boxShadow: 3, p: 3, mt: 5, maxWidth: "90%", mx: "auto" }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          {/* Left Side - Image */}
          <Grid item xs={12} md={6}>
            <img
              src={videoUploadImg}
              alt="Upload Video"
              style={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: "10px",
                opacity: 0.9,
                transform: "scale(1.5) translate(10px, 10px)"
              }}
            />
          </Grid>

          {/* Right Side - Upload Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Upload a Video
            </Typography>
            
            {/* Upload Box */}
            <Box
              sx={{
                border: "2px dashed #90caf9",
                borderRadius: "10px",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={() => document.getElementById("videoInput").click()}
            >
              <CloudUploadIcon sx={{ fontSize: 50, color: "#42a5f5" }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {video ? video.name : "Click to Upload or Drag & Drop"}
              </Typography>
            </Box>

            {/* Hidden Input */}
            <input
              type="file"
              id="videoInput"
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <TextField
              label="Video Title"
              fullWidth
              margin="normal"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />

            {/* Course Selection Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
             style={{
              color: "var(--button-text)",
              backgroundColor: "var(--button-bg)",
              border: "var(--border-color)",
            } }  
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!video || !videoTitle || !selectedCourse || loading}
              onClick={handleUpload}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
