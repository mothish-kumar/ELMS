import React, { useState, useEffect,useRef } from "react";
import { 
  Card, List, ListItem, ListItemText, Typography, IconButton, Badge, Dialog, DialogTitle, 
  DialogContent, Table, TableHead, TableRow, TableCell, TableBody, Button 
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";

const Submissions = () => {
  const [courses, setCourses] = useState([]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);

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

  // Open Modal & Set Selected Submissions
  const handleOpenModal =async (assignmentId) => {
    try{
        const res = await axiosInstance.get(`/assignment/${assignmentId}/submissions`)
        const submissions = res.data
        setSelectedSubmissions(submissions);
        setOpenModal(true);
    }catch(error){
        toast.error('Failed to fetch Submissions')
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubmissions([]);
  };

  const handleAddMarks = async (assignmentId, studentId) => {
    const marks = prompt("Enter marks for the student:");
  
    if (marks === null) return; // User clicked Cancel
  
    if (!marks || isNaN(marks) || marks < 0) {
      alert("Invalid marks! Please enter a valid number.");
      return;
    }
  
    try {
      await axiosInstance.put(`/assignment/${assignmentId}/grade/${studentId}`, { marks });
      toast.success(`Marks added successfully: ${marks}`);
      window.location.reload(); 
    } catch (error) {
      toast.error("Failed to add marks.");
    }
  };
  
  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5, mb: 2 }}>
        Assignment Submissions
      </Typography>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {courses.map((course) => (
          <Card key={course._id} sx={{ m: 2, p: 2, boxShadow: 3 }}>
            <Typography variant="h6">{course.title}</Typography>
            <List>
              {assignmentsByCourse[course._id]?.length > 0 ? (
                assignmentsByCourse[course._id].map((assignment) => (
                  <ListItem key={assignment._id} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                    {assignment.submissions.length > 0 && (
                        
                      <IconButton onClick={() => handleOpenModal(assignment._id)}>
                        <Badge badgeContent={assignment.submissions.length} color="primary">
                          <VisibilityIcon />
                        </Badge>
                      </IconButton>
                    )}
                  </ListItem>
                ))
              ) : (
                <Typography color="textSecondary">No assignments available.</Typography>
              )}
            </List>
          </Card>
        ))}
      </div>

      {/* Modal for Showing Submissions */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Submissions</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Student email</TableCell>
                <TableCell>Submission File</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Mark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedSubmissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>{submission.student.name}</TableCell>
                  <TableCell>{submission.student.email}</TableCell>
                  <TableCell>
                    <a href={submission.submissionUrl} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  </TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>
                        {submission.marks === null ? (
                            <Button variant="contained" color="primary" onClick={() => handleAddMarks(submission.assignment,submission.student._id)}>
                            Add Mark
                            </Button>
                        ) : (
                            submission.marks
                        )}
                        </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Submissions;
