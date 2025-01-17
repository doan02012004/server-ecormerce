import { v2 as cloudinary } from 'cloudinary';
import { env } from './environment.js';

cloudinary.config({
  cloud_name:env.CLOUDINARY_CLOUD_NAME, // Lấy từ Cloudinary dashboard
  api_key: env.CLOUDINARY_API_KEY,       // Lấy từ Cloudinary dashboard
  api_secret:env.CLOUDINARY_API_SECRET, // Lấy từ Cloudinary dashboard
});

export default cloudinary;