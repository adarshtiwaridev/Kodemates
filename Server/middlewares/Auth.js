
const jwt =require("jsonwebtoken");
require("dotenv").config();
const User=require("../Models/User")


 //Auth concept 
 exports.auth=async(req,res ,next) =>{
 try {
    // extract token 
    const token=req.body.token ||req.cookies.token || req.header("Authorization").replace("bearer"," ");
      
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        //  Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Correct: use decoded payload here
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        next(); //  Continue to next middleware
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
  }
  
 

//isStudent
exports.student=async(req,res,next ) =>
  {
    try {
   if (req.User.accounttype !=="Student") {
    return res.status(403).json({
      success:false,
      message:"This is protected routes for Student only",
    });
    
   }



    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"User role can not be varified ,please try again"
      })
      
    }
  
}
//isTeacher


exports.Instructor=async(req,res,next ) =>
  {
    try {
   if (req.User.accounttype !=="Instructor") {
    return res.status(403).json({
      success:false,
      message:"This is protected routes for teacher only",
    });
    
   }



    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"User role can not be varified ,please try again"
      })
      
    }
  
}

//admin pannel

exports.Admin=async(req,res,next ) =>
  {
    try {
   if (req.User.accounttype !=="Admin") {
    return res.status(403).json({
      success:false,
      message:"This is protected routes for Admin only",
    });
    
   }



    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"User role can not be varified ,please try again"
      })
      
    }
  
}

