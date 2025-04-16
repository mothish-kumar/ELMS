import React,{useState,useEffect} from 'react'
import TakeQuiz from './TakeQuiz';
import axiosInstance from '../utils/axiosInstance';

const StudentQuiz = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    useEffect(() => {
        axiosInstance
          .get("/studentProgress/getProfile")
          .then((res) => setEnrolledCourses(res.data.enrolledCourses))
          .catch((err) => toast.error(err.message));
      }, []);
  return (
    <div>
        {enrolledCourses.map((course)=>(
            <TakeQuiz key={course._id} courseId={course._id} studentId={localStorage.getItem("userId")}/>
        ))}
    </div>
  )
}

export default StudentQuiz