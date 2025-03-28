import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "sonner";

const CloudinaryUploadWidget = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "elearningmanagementsystem"); 
    formData.append("resource_type", "raw");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/ddkuextaz/raw/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      onUpload(data.secure_url); 
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("File upload failed!");
    }
    setLoading(false);
  };

  return (
    <>
      <input accept="image/*,application/pdf" type="file" onChange={handleUpload} hidden id="file-upload" />
      <label htmlFor="file-upload">
        <Button component="span" variant="contained" startIcon={<CloudUploadIcon />} disabled={loading} sx={{ mt: 1 }}>
          {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Upload Assignment"}
        </Button>
      </label>
    </>
  );
};

export default CloudinaryUploadWidget;
