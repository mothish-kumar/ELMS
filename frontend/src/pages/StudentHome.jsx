import React,{useState} from 'react'
import StudentSlideBar from '../component/StudentSlideBar';
import { Container } from '@mui/material';
import StudentDashboard from '../component/StudentDashboard';
import StudentCourseManagement from '../component/Student CourseManagement';
import StudentVideoLectures from '../component/StudentVideoLectures';
import StudentProfile from '../component/StudentProfile';
import StudentChat from '../component/StudentChat';
import StudentAssignment from '../component/StudentAssignment'
const StudentHome = () => {
  const [section, setSection] = useState("dashboard");
  return (
    <div style={{display:'flex'}}>
        <StudentSlideBar onSelect={setSection}/>
        <Container sx={{ marginLeft: "-150px", padding: "20px" , marginTop:"70px"}}>
        {section === "dashboard" && <StudentDashboard/>  }
          {section === "courseManagement" && <StudentCourseManagement/> }
          {section === "videoLectures" && <StudentVideoLectures/>}
          {section === "assignments" && <StudentAssignment/>}
          {section === "profile" && <StudentProfile/>}
          {section === "chat" && <StudentChat/>}

        </Container>
    </div>
  )
}

export default StudentHome