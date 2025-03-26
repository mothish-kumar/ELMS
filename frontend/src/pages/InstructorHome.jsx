import React,{useState}from 'react'
import {Container} from '@mui/material'
import InstructorDashboard from '../component/InstructorDashboard'
import InstructorSlideBar from '../component/InstructorSlideBar'
import VideoUpload from '../component/VideoUpload'
import Assignments from '../component/Assignments'
import CreateCourse from'../component/CreateCourse'
import Submissions from '../component/Submissions'
import InstructorChat from '../component/InstructorChat'

const InstructorHome = () => {
  const [section, setSection] = useState("dashboard");
  return (
    <div style={{ display: "flex" }}>
      <InstructorSlideBar onSelect={setSection} />
      <Container sx={{ marginLeft: "-150px", padding: "20px" , marginTop:"70px"}}>
        {section === "courses" && <CreateCourse/>}
        {section === "dashboard" && <InstructorDashboard />}
        {section === "videos" && <VideoUpload />}
        {section === "assignments" && <Assignments />}
        {section === "submissions" && <Submissions />}
        {section === "chat" && <InstructorChat />}
      </Container>
    </div>
  )
}

export default InstructorHome