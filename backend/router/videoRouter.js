import express from 'express'
import { uploadVideo,getVideo ,likes,deleteVideo} from '../controller/videoController.js'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import fs from 'fs'
import Course from '../Schema/CourseSchema.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { courseId } = req.body;
      const course = await Course.findById(courseId)
      const courseTitle = course.title

      if (!courseId) {
        return cb(new Error("Course ID is required"), false);
      }

      const uploadPath = path.join(__dirname, `../uploads/${courseTitle}`);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    } catch (error) {
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  }
});

const upload = multer({ storage });

router.post('/upload-video', upload.single('video'), uploadVideo);
router.get('/:id', getVideo);
router.post('/:id/like', likes);
router.delete('/:id', deleteVideo);

export default router;
