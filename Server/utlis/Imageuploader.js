const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file (image/video/raw) to Cloudinary with optional optimizations
 * @param {string} filePath - Local file path (from express-fileupload tempFilePath)
 * @param {string} folderName - Cloudinary folder name
 * @param {object} options - { resource_type, height, width, quality, format, crop }
 * @returns {object} Uploaded file details
 */
const uploadOptimizedFile = async (filePath, folderName, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName || "uploads",
      resource_type: options.resource_type || "auto", // auto detects image/video/raw

      // Optimizations only for images
      ...(options.resource_type === "image" && {
        height: options.height || 600,
        width: options.width || 600,
        crop: options.crop || "fill",
        quality: options.quality || "auto",
        format: options.format || "webp",
      }),
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("File upload failed");
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resource_type - "image" | "video" | "raw"
 */
const deleteFileFromCloudinary = async (publicId, resource_type = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type });
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("File deletion failed");
  }
};

module.exports = {
  uploadOptimizedFile,
  deleteFileFromCloudinary,
};
