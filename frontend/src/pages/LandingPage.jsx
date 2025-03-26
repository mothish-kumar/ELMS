import React,{useState,useEffect} from 'react';
import heroImg from '../assets/heroImg.svg';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

import CloseIcon from "@mui/icons-material/Close";
import axiosInstace from "../utils/axiosInstance";
import {toast} from'sonner'
import Testimonial from '../component/Testimonial';
import ContactUs from '../component/ContactUs';

const TypingEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  
  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
      {displayedText} <span style={{ color: "blue" }}>|</span> 
    </h1>
  );
};

const LandingPage = () => {

  const [registerModal,setRegisterModal] = useState(false);
    const [registerData, setRegisterData] = useState({ name:"", email: "", password: "" ,role:""});
    const [counts,setCounts] = useState({totalCourses:0,totalStudents:0,totalInstructors:0}); 

    useEffect(()=>{
        const fetchCounts = async ()=>{
            try{
                const res = await axiosInstace.get("/auth/getTotal");
                setCounts(res.data);
            }catch(error){
                console.log(error);
            }
        }
        fetchCounts();
    },[])
  
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  const handleRegisterSubmit = async () => { 
    try {
        const res = await axiosInstace.post("/auth/register", registerData);
        if (res.status === 201) {
            toast.success(res.data.message); // ✅ Show success toast
            setRegisterData({ name: "", email: "", password: "", role: "" });
            setRegisterModal(false); // ✅ Close the modal properly
        }
    } catch (err) {
        if (err.response) {
            toast.error(err.response.data.error); // ✅ Show error toast
        } else {
            console.log("Unknown error:", err);
            toast.error("An unexpected error occurred");
        }
    }
  };

  const cards = [
    {
      id: 1,
      title: counts.totalCourses,
      description: 'Total Courses',
    },
    {
      id: 2,
      title: counts.totalStudents,
      description: 'Total Students',
    },
    {
      id: 3,
      title: counts.totalInstructors,
      description: 'Total Instructors',
    },
  ];
  const [selectedCard, setSelectedCard] = React.useState(0);

  const steps = [
    { label: "Find Course", icon: <LibraryBooksIcon /> },
    { label: "Enroll in Course", icon: <SchoolIcon /> },
    { label: "Start Watching Tutorial", icon: <PlayCircleIcon /> },
  ];
  return (
    <>
    <div 
      className="d-flex flex-row justify-content-between align-items-center"
      style={{ padding: '0 50px', width: '100%', gap: '100px' }}
    > 
    
      {/* Left Side: Text */}
      <div style={{ flex: 1, textAlign: 'left' }}>
      <TypingEffect text="A good education is a foundation for a better future" speed={50} />
        <div className="text-secondary fs-5">
          A community with high expectations and high academic achievement
        </div>
        <button className="btn btn-lg mt-4 px-5" style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }} onClick={() => setRegisterModal(true)}>
          Get Started
        </button>
      </div>


      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <img 
          src={heroImg} 
          alt="Hero" 
          style={{ 
            width: '150%', 
            maxWidth: '900px', 
            height: 'auto', 
            transform: 'scale(1.8)', 
          }} 
        />
      </div>
    </div>
    <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Ensure even spacing
          gap: 2,
          justifyContent: 'center', // Center align grid items
          alignItems: 'stretch', // Ensure equal height
        }}
      >
        {cards.map((card, index) => (
          <Card key={index} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? '' : undefined}
              sx={{
                flexGrow: 1, // Ensures full height
                '&[data-active]': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selectedHover',
                  },
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <div className='text-center ' style={{marginTop:'100px'}}>
        <h2 className='bold'>  Working Process and Benifits</h2>
      </div>
      <Box sx={{ width: "100%", marginTop: "50px" }}>
          <Stepper activeStep={1} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => step.icon} 
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: index === 1 ? "blue" : "gray",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    },
                    "& svg": {
              fontSize: "2.5rem", // ✅ Increase icon size
            },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
          <div style={{marginTop:'100px'}}>
            <Testimonial/>
          </div>
          <div>
            <ContactUs/>
          </div>
    <Dialog open={registerModal} onClose={() => setRegisterModal(false)} fullWidth maxWidth="sm" sx={{
    "& .MuiPaper-root": {
      backgroundColor: "var(--background-color)", 
      color: "var(--text-color)", 
    },
  }}>
        <DialogTitle>
          ELMS Registration
          <IconButton onClick={() => setRegisterModal(false)} style={{ float: "right" }}>
            <CloseIcon style={{ color: "var(--text-color)" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={3}>
          <TextField
              label="User Name"
              variant="outlined"
              type="name"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              sx={{ input: { color: "var(--text-color)" }, label: { color: "var(--text-color)" },fieldset: { borderColor: "var(--text-color)" },"&:hover fieldset": { borderColor: "var(--text-color)" } }}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              sx={{ input: { color: "var(--text-color)" }, label: { color: "var(--text-color)" },fieldset: { borderColor: "var(--text-color)" },"&:hover fieldset": { borderColor: "var(--text-color)" } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange} 
              sx={{ input: { color: "var(--text-color)" }, label: { color: "var(--text-color)" },fieldset: { borderColor: "var(--text-color)" },"&:hover fieldset": { borderColor: "var(--text-color)" } }}
            />
            <FormControl fullWidth>
              <InputLabel id="role-label" sx={{ color: "var(--text-color)" }}>Select Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
                sx={{ input: { color: "var(--text-color)" }, label: { color: "var(--text-color)" },fieldset: { borderColor: "var(--text-color)" },"&:hover fieldset": { borderColor: "var(--text-color)" } }}
                variant="outlined"
                displayEmpty
              >
                <MenuItem value="" disabled 
                variant="outlined">
                  Select Role
                </MenuItem>
                <MenuItem value="student" >Student</MenuItem>
                <MenuItem value="instructor">Instructor</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              style={{ backgroundColor: "var(--button-bg)" }}
              onClick={handleRegisterSubmit}
            >
              Get Started
            </Button>
          </Stack>
        </DialogContent>
      </Dialog  >
    </>
  );
}

export default LandingPage;
