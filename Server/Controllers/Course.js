const Course = require("../Models/Course");
const Section = require("../Models/Section");
const Tag = require("../Models/Tag");
const User = require("../Models/User");
const { uploadOptimizedImage } = require("../utils/imageUploader");
const { resetPassword } = require("./Resetpassword");

/**
 * @route POST /api/courses/create
 */
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatyouwillLearn,
      price,
      tag,
    } = req.body;

    // Thumbnail file (from multer middleware)
    const thumbnailFile = req.file;

    if (
      !courseName ||
      !courseDescription ||
      !instructorName ||
      !whatyouwillLearn ||
      !price ||
      !thumbnailFile
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
 // instructor id 
  const userId=req.body.userId;
  const instructorDetails =await User.findById(userId);
    console.log("instructor details" ,instructorDetails);
    if (!instructorDetails) {
      return res.status(400).json({
        success:false,

        message:"Instructor are not found"
      });
      
    }


 const tagDetails =await User.findById(tag);
    console.log("tag details" ,tagDetails);
    if (!tagDetails) {
      return res.status(400).json({
        success:false,

        message:"tag are not found"
      });
      
    }

  
    if (tag && !tagExists) {
      return res.status(404).json({ success: false, message: "Invalid Tag ID" });
    }

    // Upload thumbnail to Cloudinary
    const uploadedImage = await uploadOptimizedImage(thumbnailFile.path, "course_thumbnails");

    // Create course with Cloudinary URL
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructorName:instructorDetails._id,
      whatyouwillLearn,
     price,
      Thumbnails: uploadedImage.secure_url, // Store URL
      tag:tagDetails._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
    // add the new coouse of user schema of instructor
    await User.findByIdAndUpdate({_id:instructorDetails._id},

      $push:{
        Course:newCourse._id,
      },
      {new:true}

    )

    // update the tag schema
 await Tag.findByIdAndUpdate({_id:tagDetails._id},
  $push:{
    tag:newCourse._id
  }
 )
    // 
    return res.status(200).json({
      success:true,
      message:"Course creted and saved succesfully",
      data:newCourse
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



// get all courses

exports.getAllCourses =async (req,res)=>{
  try {


     const allCouses=await Course.find({},{
      courseName:true,ratingandReviews:true,price:true,
      Thumbnails:true,instructorName:true,
     }).populate("Instructor").exec();  // query execute ho rha hai exec se 


      return res.status(200).json({
        success:true,
        message:"Data recived succesfully ",
        data:allCouses,
      })



     
    

  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Something error while finding all courses"
    })
  }
  
   




}