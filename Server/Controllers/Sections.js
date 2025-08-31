const Section = require("../Models/Section");
const Course = require("../Models/Course");   // Import the Course models

// ================= CREATE SECTION =================
exports.createSection = async (req, res) => {
  try {
    // 1. Data fetch
    const { sectionName, courseId } = req.body;

    // 2. Validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All inputs are required",
      });
    }

    // 3. Create section
    const newSection = await Section.create({
      sectionName,
      courseId,
    });

    // 4. Update course by pushing Section _id into courseContent
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subsections", // ✅ matches Section schema
        },
      })
      .exec();

    // 5. Send response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};



// ================= UPDATE SECTION =================
exports.updateSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, sectionId } = req.body;

    // validate 
    if (!sectionName || !sectionId) {
      return res.status(403).json({
        success: false,
        message: "All inputs are required",
      });
    }

    // find by id and update 
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    ).populate("subsections"); // optional: if you want updated subsections also

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // return 
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedSection,
    });

  } catch (error) {
    console.error("Error updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating section",
      error: error.message,
    });
  }
};

 // delete subsection  
 exports.deleteSection =async (req,res)=>{
     try {
        //date fetch 
        const {sectionId} =req.params;

        //validate 
        if (!sectionId) {
           return res.status(403).json({
            success:false,
            message:"All inputs are required"
           } );
        }
        //find by id and delete 
           await Section.findByIdAndDelete(sectionId);
        //return 
 return res.status(200).json({
      success: true,
      message: "Section delete successfully",
      updatedCourse,
    });
        
     } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"Something error while deleting"
        })
     }
 }