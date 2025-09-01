const Course = require("../Models/Course");
const Section = require("../Models/Section");
const User = require("../Models/User");
const Category = require("../Models/Categories"); // ✅ Replaced Tag with Category
const { uploadOptimizedFile } = require("../utlis/Imageuploader");
const { configDotenv } = require("dotenv");
const { populate } = require("../Models/Profile");
require("dotenv").config();

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatyouwillLearn, price, categories } = req.body;
    const thumbnailFile = req.files?.thumbnailFile;

    const userId = req.user?.id; // ensure JWT middleware sets this

    console.log("REQ BODY:", courseName, courseDescription, whatyouwillLearn, price, categories);
    console.log("THUMBNAIL FILE:", thumbnailFile);
    console.log("USER ID:", userId);

    // Validation
    if (!courseName || !courseDescription || !whatyouwillLearn || !price || !thumbnailFile || !categories) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Instructor check
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({ success: false, message: "Instructor not found" });
    }
    if (instructorDetails.accountType !== "Teacher") {
      return res.status(403).json({ success: false, message: "Instructor only route" });
    }

    // Category check
    const categoryDetails = await Category.findById(categories);
    if (!categoryDetails) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }

    // Upload thumbnail
    let uploadedImage;
    try {
      uploadedImage = await uploadOptimizedFile(thumbnailFile.tempFilePath || thumbnailFile.path, "course_thumbnails");
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: err.message,
      });
    }
const newCourse = await Course.create({
  courseName,
  courseDescription,
  instructor: instructorDetails._id,   // keep the ObjectId
  instructorName: instructorDetails.fullName || instructorDetails.name || instructorDetails.firstName, // ✅ fill instructorName
  whatyouwillLearn,
  price,
  Thumbnails: uploadedImage.secure_url, // ✅ plural, matches schema
  Categories: categoryDetails._id,
  courseStatus: "upcoming", // ✅ valid default
});



    // Update instructor + category
    await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } });
    await Category.findByIdAndUpdate(categoryDetails._id, { $push: { courses: newCourse._id } });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating course",
      error: error.message,
    });
  }
};



// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      { courseName: 1, ratingAndReviews: 1, price: 1, thumbnail: 1, instructor: 1 }
    )

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error("Error while fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all courses",
      error: error.message,
    });
  }
};



// Get course details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("categories")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error while fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching course details",
      error: error.message,
    });
  }
};
