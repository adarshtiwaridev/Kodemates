const profile = require("../Models/Profile");
const user = require("../Models/User");
const course = require("../Models/Course");

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", contactNumber, gender, about = "" } = req.body;
    const id = req.user.id;

    if (!dateOfBirth || !contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await user.findById(id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profileId = userDetails.additionalDetails;
    const profileDetails = await profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.about = about;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the profile",
      error: error.message,
    });
  }
};

const User = require("../models/User"); // make sure path is correct

// Update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files?.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    // TODO: Upload displayPicture to Cloudinary / storage and get URL
    // Example: const uploadResult = await cloudinary.uploader.upload(displayPicture.tempFilePath);
    // const profilePicUrl = uploadResult.secure_url;

    const userDetails = await User.findByIdAndUpdate(
      userId,
      { profilePicture: displayPicture.name }, // replace with profilePicUrl after cloud upload
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error updating display picture:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating display picture",
      error: error.message,
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await user.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetails;
    await profile.findByIdAndDelete(profileId);
    await user.findByIdAndDelete(id);
    await course.deleteMany({ createdBy: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the account",
      error: error.message,
    });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await user.findById(id).populate("additionalDetails").exec();

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error fetching profile details:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the profile details",
      error: error.message,
    });
  }
};

// Get all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    const users = await user.find().populate("additionalDetails").exec();
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All user details fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching all user details:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all user details",
      error: error.message,
    });
  }
};

// Get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await user.findById(userId).populate("courses").exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: userDetails.courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching enrolled courses",
      error: error.message,
    });
  }
};
