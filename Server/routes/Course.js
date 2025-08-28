// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course")

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Sections")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRatingAndReviews,
  getAverageRating,
  getAllRatings, // ✅ correct import
} = require("../Controllers/RatingAndReviews")

// Importing Middlewares
const { auth, instructor, student, admin } = require("../middleware/Auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, instructor, createCourse)
// Add a Section to a Course
router.post("/addSection", auth, instructor, createSection)
// Update a Section
router.post("/updateSection", auth, instructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, instructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, instructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, instructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, instructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Course
router.post("/getCourseDetails", getCourseDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/createCategory", auth, admin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, student, createRatingAndReviews)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatings) // ✅ fixed function name

module.exports = router
