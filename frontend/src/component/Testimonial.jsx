import React from "react";
import { Card, CardContent, Typography, Avatar, Grid, Box } from "@mui/material";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Student",
    feedback: "This platform has truly transformed the way I learn. The courses are well-structured and engaging!",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Instructor",
    feedback: "Teaching on this platform has been an amazing experience. The tools provided are top-notch!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 3,
    name: "Alex Johnson",
    role: "Student",
    feedback: "I love the interactive content and community support. Highly recommended for learners!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const Testimonial = () => {
  return (
    <Box sx={{ py: 6, textAlign: "center", backgroundColor: "var(--background-color)" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        What Our Users Say
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((testimonial) => (
          <Grid item key={testimonial.id} xs={12} sm={6} md={4}>
            <Card sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
              <Avatar
                src={testimonial.image}
                alt={testimonial.name}
                sx={{ width: 80, height: 80, margin: "auto", mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {testimonial.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {testimonial.role}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
                "{testimonial.feedback}"
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonial;
