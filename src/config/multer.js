import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
import multer from "multer";

// Cấu hình storage cho Multer sử dụng Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nextjs_ecormerce',          // Thư mục Cloudinary để lưu ảnh
        allowed_formats: ['jpg', 'png', 'jpeg'], // Các định dạng ảnh cho phép
      },
  });
  
  const upload = multer({ storage });
  
  export default upload;