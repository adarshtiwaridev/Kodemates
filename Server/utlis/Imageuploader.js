const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

/**
 * Upload optimized image to Cloudinary
 * @param {string} filePath - Local file path (from multer/temp)
 * @param {string} folderName - Cloudinary folder name
 * @param {object} options - { height, width, quality, format, crop }
 * @returns {object} Uploaded image details
 */
const uploadOptimizedImage = async (filePath, folderName, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName || "uploads",
      resource_type: "image",

      // Optimizations
      height: options.height || 600,
      width: options.width || 600,
      crop: options.crop || "fill",
      quality: options.quality || "auto",
      format: options.format || "webp",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {object} Deletion response
 */
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Image deletion failed");
  }
};

module.exports = {
  uploadOptimizedImage,
  deleteImageFromCloudinary,
};
