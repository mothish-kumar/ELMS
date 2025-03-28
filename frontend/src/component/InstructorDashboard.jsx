import { Card, CardContent, Typography, Grid,  CardHeader, Avatar, Chip, Stack,Box, IconButton, Accordion, AccordionSummary, AccordionDetails,List,ListItem,ListItemText,Dialog, DialogContent,DialogTitle } from "@mui/material";
import { useState,useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { ExpandMore, PlayCircleOutline,Close } from "@mui/icons-material";
import {  Delete,Code, DesignServices, Science, Language, School  } from "@mui/icons-material"; 
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const InstructorDashboard = () => {

      const [counts,setCounts] = useState({totalCourses:0,totalAssignments:0,totalVideos:0});
      const [courses,setCourses] = useState([])
      const [videosByCourse, setVideosByCourse] = useState({});
      const [selectedVideo, setSelectedVideo] = useState(null);
      const [open, setOpen] = useState(false);
      const fetchCourseList = async()=>{
        try{
          const res = await axiosInstance.get("course/getAllCoursesByInstructor")
          setCourses(res.data.courses)
        }catch(error){
          toast.error('Unable to fetch courses list')
        }
      }
      const fetchCounts = async ()=>{
        try{
            const res = await axiosInstance.get("/course/getTotal");
            setCounts(res.data);
        }catch(error){
            console.log(error.message);
        }
    }
    const fetchVideosForCourses = async () => {
      try {
        const videosData = {}; 
    
        // Loop through each course and fetch videos
        for (const course of courses) {
          const res = await axiosInstance.get(`/video/${course._id}`);
          videosData[course._id] = res.data; 
        }
    
        setVideosByCourse(videosData);
      } catch (error) {
        toast.error("Failed to fetch videos.");
      }
    };
      useEffect(()=>{
        fetchCounts();
        fetchCourseList()
    },[])
    useEffect(() => {
      if (courses.length > 0) {
        fetchVideosForCourses();
      }
    }, [courses]);
  const stats = [
    { title: "Total Courses", value: counts.totalCourses },
    { title: "Uploaded Videos", value: counts.totalVideos },
    { title: "Assignments Created", value: counts.totalAssignments }
  ];
  const getCourseIcon = (title) => {
    const lowerTitle = title.toLowerCase();
  
    if (lowerTitle.includes("web") || lowerTitle.includes("development")) return <Code />;
    if (lowerTitle.includes("design") || lowerTitle.includes("ui") || lowerTitle.includes("ux")) return <DesignServices />;
    if (lowerTitle.includes("science") || lowerTitle.includes("physics") || lowerTitle.includes("chemistry")) return <Science />;
    if (lowerTitle.includes("language") || lowerTitle.includes("english") || lowerTitle.includes("french")) return <Language />;
    
    return <School />; // Default icon for general courses
  };
  const getCourseColor = (title) => {
    const lowerTitle = title.toLowerCase();
  
    if (lowerTitle.includes("web") || lowerTitle.includes("development")) return "#3498db"; // Blue
    if (lowerTitle.includes("design") || lowerTitle.includes("ui") || lowerTitle.includes("ux")) return "#e74c3c"; // Red
    if (lowerTitle.includes("science") || lowerTitle.includes("physics") || lowerTitle.includes("chemistry")) return "#2ecc71"; // Green
    if (lowerTitle.includes("language") || lowerTitle.includes("english") || lowerTitle.includes("french")) return "#f39c12"; // Orange
    
    return "#9b59b6"; // Purple (default)
  };
  const handleDelete = async (courseId, setCourses) => {
    try {
      await axiosInstance.delete(`/course/${courseId}`);
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete course.");
    }
  };

  // Open modal and set selected video
  const handleOpen = (video) => {
    setSelectedVideo(video);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  const handleVideoDelete =async (videoId,courseId)=>{
    try{
      await axiosInstance.delete(`/video/${videoId}`)
      toast.success('Video has been deleted successfully')
      setVideosByCourse((prevVideos) => ({
        ...prevVideos,
        [courseId]: prevVideos[courseId].filter(video => video._id !== videoId)
      }));
    }catch(error){
      toast.error('Failed to delete video ')
    }
  }
  return (
   <>
    <div>
     <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h5">{stat.value}</Typography>
              <Typography>{stat.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
   </div>
   {/* Courses */}
   <div>
    <h1 className="bolder text-center mt-5 mb-4">Courses </h1>
    
    <Grid container spacing={3} justifyContent="center">
    {courses.map((course, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ 
          width: "100%", 
          boxShadow: 3, 
          borderRadius: "12px", 
          p: 2, 
          textAlign: "center",
          transition: "0.3s",
          "&:hover": { boxShadow: 6 }
        }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: getCourseColor(course.title), color: "#fff" }}>
                {getCourseIcon(course.title)}
              </Avatar>
            }
            action={
              <IconButton onClick={() => handleDelete(course._id, setCourses)} sx={{ color: "red" }}>
                <Delete />
              </IconButton>
            }
            title={<Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>{course.title}</Typography>}
            subheader={
              <Typography variant="body2" color="textSecondary">
                Instructor: {course.instructor.name}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {course.description}
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Stack direction="row" spacing={0.2}>
                <Chip label={`Students: ${course.students.length}`} color="primary" />
                <Chip label={`Videos: ${course.videos.length}`} sx={{ bgcolor: "#9c27b0", color: "#fff" }} />
                <Chip label={`Assignments: ${course.assignments.length}`} sx={{ bgcolor: "#388e3c", color: "#fff" }} />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
   </div>
   {/* Videos */}
   <div>
    {/* Videos List by Course */}
    <Typography variant="h4" sx={{ textAlign: "center", mt: 5, mb: 2 }} >Videos </Typography>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {courses.map((course) => (
  <Accordion key={course._id}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography variant="h6">{course.title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {videosByCourse[course._id]?.length > 0 ? (
        <List>
          {videosByCourse[course._id].map((video) => (
            <ListItem key={video._id}>
              <ListItemText
                primary={video.title}
                secondary={`Uploaded on: ${new Date(video.createdAt).toLocaleDateString()}`}
              />
              <IconButton 
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    padding: "5px 10px",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    }
                  }}
                >
                  <ThumbUpAltIcon sx={{ color: "#007bff" }} /> 
                  <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                    {video.likes.length}
                  </Typography>
                </IconButton>

              <IconButton onClick={()=>handleVideoDelete(video._id,course._id)} sx={{ color: "red" }}>
            <Delete />
          </IconButton>
              <IconButton onClick={() => handleOpen(video)} color="primary">
                      <PlayCircleOutline fontSize="large" />
                    </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary">No videos available.</Typography>
      )}
    </AccordionDetails>
  </Accordion>
))}

      </Box>
   </div>


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

export default InstructorDashboard;
