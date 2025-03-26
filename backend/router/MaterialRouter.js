import express from 'express'
import multer from "multer";
import path from "path";
import fs from "fs";
import { getMaterial, postMaterial } from '../controller/materialController.js';

const router = express.Router()

const uploadPath = path.join("uploads", "materials");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/',upload.single("file"),postMaterial)
router.get('/',getMaterial)

export default router