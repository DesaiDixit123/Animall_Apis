import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});

// Multer upload instance
const upload = multer({ storage });

export default upload;
