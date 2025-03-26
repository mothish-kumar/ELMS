import Material from '../Schema/MaterialSchema.js'


export const postMaterial = async(req,res)=>{
    try {
        const { courseId, title, description } = req.body;
        const fileUrl = `/materials/${req.file.filename}`; 
        if(req.role !== "instructor") return res.status(403).json({error:"You are not authorized to upload file "})
        const material = new Material({
          courseId,
          instructorId: req.userId,
          title,
          description,
          fileUrl,
        });
    
        await material.save();
        // Emit event to update chat in real-time
    req.app.get("io").to(courseId).emit("materialUploaded", {
      courseId,
      instructor: req.userId,
      title,
      description,
      fileUrl,
      timestamp: new Date(),
    });
        res.status(201).json({ message: "Material uploaded successfully", material });
      } catch (error) {
        res.status(500).json({ error: "Error uploading material" ,errorMessage:error.message});
      }
}

export const  getMaterial = async(req,res)=>{
    try {
        const materials = await Material.find({ courseId: req.params.courseId });
        res.json(materials);
      } catch (error) {
        res.status(500).json({ error: "Error fetching materials" });
      }
}