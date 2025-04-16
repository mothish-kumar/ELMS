import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography, Box } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";

const StudentQuizChart = () => {
    const studentId = localStorage.getItem('userId')
  const [quizScores, setQuizScores] = useState([]);

  useEffect(() => {
    const fetchQuizScores = async () => {
      try {
        const res = await axiosInstance.get(`/quiz/studentScores/${studentId}`);
        setQuizScores(res.data);
      } catch (error) {
        toast.error("Error fetching quiz scores:", error.message);
      }
    };
    fetchQuizScores();
  }, [studentId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quiz Scores
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={quizScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="quizTitle" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#82ca9d" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StudentQuizChart;