// otp verification

const User = require("../Models/User");
const Otp = require("../Models/Otp");
const otpGenerator = require("otp-generator");
const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");

// send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // check user already exist
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // generate OTP using nanoid
    const generateOTP = customAlphabet("1234567890", 6);
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    // save otp in DB
    const otpPayload = { email, otp };
    const otpBody = await Otp.create(otpPayload);
    console.log("Otp saved:", otpBody);

    // return response
    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp, // (in production, don't send otp in response!)
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "OTP failed",
    });
  }
};

// signup validate
exports.Signup = async (req, res) => {
  try {
    // data fetch from body
    const {
      firstName,
      lastname,
      email,
      mobile,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // validate inputs
    if (
      !firstName ||
      !lastname ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All Inputs are required",
      });
    }

    // 2 passwords match
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message:
          "Password & Confirm Password do not match, please try again",
      });
    }

    // check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // find most recent otp
    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    // validate otp
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "Otp not found, please try again",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //profile details 
    const profileDetails = await Profiler.create({
      gender:null,
      dateOfBirth:null,
      address:null,
      contactNumber:null,
    });

    // entry created in db
    const user = await User.create({
      firstName,
      lastname,
      email,
      mobile,
      password: hashedPassword,
      accountType,
      additionaldetails:profileDetails._id,
      images :"https://avatar.iran.liara.run/public"
    });

    // return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Signup failed, please try again",
    });
  }
};


// login  concept 

exports.Login =async(req,res) =>{
  try {
    //get data from req body
const {
  email,password
} =req.body;

if (!email || !password
) {
  return res.status(403).json({
    success:false,
    message:'All field are required ,please try again',
  })
  
}


//user cheack exist or not 
const existEmail =await User.findOne({email}).populate("additionalDetails");
if (!existEmail) {
  return res.status(403).json({
    success:false,
    message:"User is not registerd,please signup first",
  });
  
}
 // genrate jwt ,after password matching 
 if(await bcrypt.compare(password,user.pass))
 //create cookies and send response 
    
  } 
  catch (error) {
    
  }
}


//change password 