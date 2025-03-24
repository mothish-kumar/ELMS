import React, { useState } from "react";
import { TextField, Button, Typography, Grid, Paper, Box, Snackbar, Alert } from "@mui/material";
import emailjs from "@emailjs/browser";
import contactUsImg from '../assets/contactUsImg.jpg'

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_d9uo8kr", // Replace with EmailJS Service ID
        "template_hq044de", // Replace with EmailJS Template ID
        formData,
        "FfpxydKfr2dju41pB" // Replace with EmailJS Public Key
      )
      .then(() => {
        setOpenSnackbar(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => console.error("EmailJS Error:", error));
  };

  return (
    <Box sx={{ py: 8, px: 4, backgroundColor: "var(--background-color)" }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side - Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={contactUsImg}
            alt="Contact Us"
            sx={{ width: "100%", borderRadius: 2, boxShadow: 2 }}
          />
        </Grid>

        {/* Right Side - Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Have questions or need help? Fill out the form below, and we'll get back to you as soon as possible.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                variant="outlined"
                value={formData.message}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                Send Message
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success">Message sent successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;
