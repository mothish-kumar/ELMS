import React,{useState,useEffect} from 'react'
import axiosInstance from '../utils/axiosInstance';
import { Container,TextField,MenuItem,Typography,Grid,Button } from '@mui/material';
import { toast } from "sonner";
import InstuctorQuizSubmission from './InstuctorQuizSubmission';

const InstructorQuiz = () => {
    const [courses, setCourses] = useState([]);
    const [quizData,setQuizData] = useState({courseId:"",title:"",questions:[]})
    const [currentQuestion, setCurrentQuestion] = useState({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    const [quizzes,setQuizzes] = useState([])

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
  useEffect(()=>{
    const fetchQuizz = async () => {
      try {
        const quizzesData = [];
        for (const course of courses) {
          try {
            const res = await axiosInstance.get(`/quiz/${course._id}`);
            quizzesData.push(...res.data); // Append quizzes for each course
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(`No quizzes found for course: ${course.title}`);
            } else {
              console.error("Error fetching quizzes:", error.message);
            }
          }
        }
        setQuizzes(quizzesData); 
      } catch (error) {
        toast.error("Unable to fetch quiz submissions");
      }
    };
    fetchQuizz()
  },[courses])

  const handleAddQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, currentQuestion],
    }));
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
  };
  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/quiz/create", { ...quizData});
      toast.success("Quiz created successfully!");
      setQuizData({courseId:"",title: "", questions: [] });
    } catch (error) {

      toast.error("Failed to create quiz");
    }
  };
  return (
   <>
   <Container sx={{height:'100vh'}}>
          <Typography variant="h5">Create Quiz</Typography>
      <TextField
              select
              label="Select Course"
              name="courseId"
              fullWidth
              margin="normal"
              value={quizData.courseId}
              onChange={(e)=>setQuizData({...quizData,courseId:e.target.value})}
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.title}
                </MenuItem>
              ))}
      </TextField>
      <TextField
        label="Quiz Title"
        fullWidth
        margin="normal"
        value={quizData.title}
        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
      />
      <Typography variant="h6">Add Questions</Typography>
      <TextField
        label="Question"
        fullWidth
        margin="normal"
        value={currentQuestion.question}
        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
      />
      <Grid container spacing={2}>
        {currentQuestion.options.map((option, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={`Option ${index + 1}`}
              fullWidth
              value={option}
              onChange={(e) =>
                setCurrentQuestion((prev) => {
                  const newOptions = [...prev.options];
                  newOptions[index] = e.target.value;
                  return { ...prev, options: newOptions };
                })
              }
            />
          </Grid>
        ))}
      </Grid>
      <TextField
        label="Correct Answer"
        fullWidth
        margin="normal"
        value={currentQuestion.correctAnswer}
        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
      />
      <Button variant="contained" onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginLeft: "10px" }}>
        Submit Quiz
      </Button>
   </Container>
   <Container sx={{height:'100vh'}}>
        <Typography variant='h5'>Quiz Submissions</Typography>
            {quizzes.map((quizData,index)=>(
                  <InstuctorQuizSubmission quizId={quizData._id} key={index}/>
            ))}
   </Container>
   </>
  )
}

export default InstructorQuiz