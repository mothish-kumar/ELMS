import React, { useState } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import axiosInstace from "../utils/axiosInstance";
import {toast} from'sonner'
import { useNavigate } from "react-router-dom";


const AuthButtons = ({ setIsLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerModal,setRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({ name:"", email: "", password: "" ,role:""});

  const navigation = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
 const handleLoginSubmit =async () => {
      await axiosInstace.post("/auth/login", loginData).then((res) => {
        if(res.status === 200){
          const token =res.data.token;
          const userName = res.data.userName
          const userId = res.data.userId
          if (token) {
            localStorage.setItem("token", token); 
            localStorage.setItem("useName",userName)
            localStorage.setItem("email",loginData.email)
            localStorage.setItem("userId",userId)
            setIsLoggedIn(true);
          }else{
            console.log('Token not found')
          }
          if(res.data.role === "student"){
            navigation("/studentHome");
          }else if(res.data.role === "instructor"){
            navigation("/instructorHome");
          }else{
            console.log('Role not found')
          }
        setLoginData({ email: "", password: "" });
        setOpen(false);
        }
      }).catch((err) => {
        if (err.response) {
          toast.error(err.response.data.error);
        } else {
          console.log("Unknown error:", err.message);
          toast.error("An unexpected error occurred");
        }
      }
    );
      
 }
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

  return (
    <>
      <div className="d-flex gap-4">
        <button
          className="btn px-md-3 d-flex align-items-center gap-2 loginbtn"
          style={{ color: "var(--text-color)" }}
          onClick={() => setOpen(true)}
        >
          Login
        </button>
        <button
          className="btn px-md-3 d-flex align-items-center gap-2 registerbtn"
          style={{
            color: "var(--button-text)",
            backgroundColor: "var(--button-bg)",
            border: "var(--border-color)",
          } } onClick={() => setRegisterModal(true)} 
        >
          Get Started
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" sx={{
    "& .MuiPaper-root": {
      backgroundColor: "var(--background-color)", 
      color: "var(--text-color)", 
    },
  }}>
        <DialogTitle>
          ELMS Login
          <IconButton onClick={() => setOpen(false)} style={{ float: "right" }}>
            <CloseIcon style={{ color: "var(--text-color)" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              sx={{ input: { color: "var(--text-color)" }, label: { color: "var(--text-color)" },fieldset: { borderColor: "var(--text-color)" },"&:hover fieldset": { borderColor: "var(--text-color)" } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange} 
              sx={{ input: { color: "var(--text-color)" }, label: { color: "var(--text-color)" },fieldset: { borderColor: "var(--text-color)" },"&:hover fieldset": { borderColor: "var(--text-color)" } }}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "var(--button-bg)" }}
              onClick={handleLoginSubmit}
            >
              Login
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
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
};

export default AuthButtons;
