import React, { useState, useEffect } from "react";
import { Typography, Button, RadioGroup, FormControlLabel, Radio, Container } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";

const TakeQuiz = ({ courseId, studentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState({}); // Track submitted quizzes

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axiosInstance.get(`/quiz/${courseId}`);
        const quizzesData = res.data;

        // Check submission status for each quiz
        const submissionStatuses = {};
        for (const quiz of quizzesData) {
          const submissionRes = await axiosInstance.get(`/quiz/checkSubmission`, {
            params: { quizId: quiz._id, studentId },
          });
          submissionStatuses[quiz._id] = submissionRes.data.submitted;
        }

        setSubmittedQuizzes(submissionStatuses);
        setQuizzes(quizzesData);
      } catch (error) {
        toast.error("Failed to fetch quizzes");
      }
    };
    fetchQuizzes();
  }, [courseId, studentId]);

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/quiz/submit", { quizId: selectedQuiz._id, answers });
      toast.success(`Quiz submitted! Your score: ${res.data.score}`);

      // Mark the quiz as submitted
      setSubmittedQuizzes((prev) => ({ ...prev, [selectedQuiz._id]: true }));
      setSelectedQuiz(null); // Reset selected quiz
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  };

  return (
    <Container>
      {selectedQuiz ? (
        <>
          <Typography variant="h6">{selectedQuiz.title}</Typography>
          {selectedQuiz.questions.map((q, index) => (
            <div key={index}>
              <Typography>{q.question}</Typography>
              <RadioGroup
                value={answers[index] || ""}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value;
                  setAnswers(newAnswers);
                }}
              >
                {q.options.map((option, i) => (
                  <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button variant="contained" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </>
      ) : (
        quizzes.map((quiz) => (
          <Button
            key={quiz._id}
            onClick={() => setSelectedQuiz(quiz)}
            disabled={submittedQuizzes[quiz._id]} // Disable button if quiz is already submitted
          >
            {quiz.title} {submittedQuizzes[quiz._id] ? "(Already Submitted)" : ""}
          </Button>
        ))
      )}
    </Container>
  );
};

export default TakeQuiz;