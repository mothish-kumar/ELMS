import { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, TextField, Button, Typography, MenuItem, List, ListItem, ListItemText } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import assignmentImg from "../assets/assignment.svg";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Assignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/course/getAllCoursesByInstructor");
        setCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, []);

  // Fetch assignments for each course
  useEffect(() => {
    const fetchAssignmentsForCourses = async () => {
      try {
        const assignmentsData = {};
        for (const course of courses) {
          const res = await axiosInstance.get(`/assignment/${course._id}`);
          assignmentsData[course._id] = res.data; 
        }
        setAssignmentsByCourse(assignmentsData);
      } catch (error) {
        toast.error("Failed to fetch assignments.");
      }
    };
    if (courses.length > 0) fetchAssignmentsForCourses();
  }, [courses]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/assignment", formData);
      toast.success("Assignment Created Successfully!");
      setFormData({ courseId: "", title: "", description: "", dueDate: "" });
    } catch (error) {
      toast.error(error.response?.data || "Error creating assignment");
    }
  };

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
    <style>
    {`
      .slick-prev::before, .slick-next::before {
        color: red!important; /* Change button color */
      }
    `}
  </style>
    <Slider {...sliderSettings}>
      {/* Slide 1: Assignment Creation Form */}
      <div>
        <Card sx={{ display: "flex", maxWidth: 1200, mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
          <CardMedia
            component="img"
            style={{
              transform: "scale(1.5) translate(10px, 10px)",
              width: "100%",
              maxWidth: "450px",
              borderRadius: "10px",
              opacity: 0.9,
            }}
            image={assignmentImg}
            alt="Assignment"
          />
          <CardContent sx={{ flex: 1 }} style={{ marginTop: "70px", marginRight: "30px" }}>
            <Typography variant="h6" gutterBottom>Create Assignment</Typography>
            <TextField
              select
              label="Select Course"
              name="courseId"
              fullWidth
              margin="normal"
              value={formData.courseId}
              onChange={handleChange}
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Title" name="title" fullWidth margin="normal" value={formData.title} onChange={handleChange} />
            <TextField label="Description" name="description" fullWidth multiline rows={3} margin="normal" value={formData.description} onChange={handleChange} />
            <TextField label="Due Date" name="dueDate" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={handleChange} />
            <Button
              variant="contained"
              style={{
                color: "var(--button-text)",
                backgroundColor: "var(--button-bg)",
                border: "var(--border-color)",
              }}
              fullWidth
              onClick={handleSubmit}
            >
              Create Assignment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Slide 2: Assignments by Course */}
      <div>
        <Typography variant="h4" sx={{ textAlign: "center", mt: 5, mb: 2 }}>
          Assignments 
        </Typography>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {courses.map((course) => (
            <Card key={course._id} sx={{ m: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6">{course.title}</Typography>
              <List>
                {assignmentsByCourse[course._id]?.length > 0 ? (
                  assignmentsByCourse[course._id].map((assignment) => (
                    <ListItem key={assignment._id}>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="textSecondary">No assignments available.</Typography>
                )}
              </List>
            </Card>
          ))}
        </div>
      </div>
    </Slider>
    </>
  );
};

export default Assignments;
