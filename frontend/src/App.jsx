import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './utils/useTheme';
import Header from './component/Header';
import './App.css';
import { Toaster } from 'sonner';
import InstructorHome from './pages/InstructorHome';
import StudentHome from './pages/StudentHome';
import LandingPage from './pages/LandingPage';




function App() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn = {setIsLoggedIn} toggleTheme={toggleTheme} />
      <div style={{ marginTop: "40px" }}>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/instructorHome" element={<InstructorHome />} />
          <Route path="/studentHome" element={<StudentHome/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
