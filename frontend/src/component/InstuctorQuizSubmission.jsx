import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const InstuctorQuizSubmission = ({quizId}) => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
      const fetchSubmissions = async () => {
        try {
          const res = await axiosInstance.get(`/quiz/submissions/${quizId}`);
          setSubmissions(res.data);
        } catch (error) {
          console.error("Error fetching submissions:", error.message);
        }
      };
      fetchSubmissions();
    }, [quizId]);
  
    return (
      <div>
        
        <List>
          {submissions.map((submission) => (
            <ListItem key={submission._id}>
              <ListItemText
                primary={`Student: ${submission.studentId.name}`}
                secondary={`Score: ${submission.score}`}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  
}

export default InstuctorQuizSubmission