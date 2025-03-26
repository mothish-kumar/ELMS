import { Button, TextField, Typography, Container, Card, CardContent, Grid } from "@mui/material";
import createCourseImg from '../assets/createCourse.svg'
import { useState } from "react";
import {toast} from 'sonner'
import axiosInstance from '../utils/axiosInstance'
const CreateCourse = () => {
  const [courseData,setCourseData] = useState({title:"",description:""})

  const handelOnChange = (e)=>{
    setCourseData({...courseData,[e.target.name]:e.target.value})
  }
  const handleSubmit = async()=>{
    if (!courseData.title.trim() || !courseData.description.trim()) return toast.error('Please fill the required fields')
   try{
     await axiosInstance.post('/course/create',courseData)
    setCourseData({title:"",description:""})
    toast.success('Course Added Successfully')
  }catch(error){
    toast.error('Failedto add course')
  }
}
  return (
    <Container maxWidth="lg">
      <Card sx={{ boxShadow: 3, p: 3, mt: 5,maxWidth: "90%", mx: "auto"  }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/* Left Side - Image */}
            <Grid item xs={12} md={6}>
              <img
                src={createCourseImg}
                alt="Course"
                style={{ width: "100%", maxWidth: "450px", borderRadius: "10px", transform: "scale(2.0) translate(10px, 10px)"}}
              />
            </Grid>
            
            {/* Right Side - Form */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Create a Course
              </Typography>
              <TextField label="Course Title" fullWidth margin="normal" name="title" value={courseData.title} onChange={handelOnChange}/>
              <TextField label="Description" fullWidth margin="normal" multiline rows={4} name="description" value={courseData.description} onChange={handelOnChange}/>
              <Button variant="contained" style={{
            color: "var(--button-text)",
            backgroundColor: "var(--button-bg)",
            border: "var(--border-color)",
          } }  sx={{ mt: 2 }} onClick={handleSubmit}>
                Create Course
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateCourse;
