import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vendor_assets", // Changed to generic folder
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto"
  }
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vendor_videos",
    allowed_formats: ["mp4", "mov", "avi"],
    resource_type: "video"
  }
});

export const upload = multer({ storage });
export const uploadVideo = multer({ storage: videoStorage });
