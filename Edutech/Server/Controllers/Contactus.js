const contactus= require("../Models/Contactus");
const nodemailer = require("nodemailer");

exports.createContactus = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const newMessage = await contactus.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });


       // Create transporter
       const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
           user: process.env.MAIL_USER,
           pass: process.env.MAIL_PASS,
         },
         connectionTimeout: 10000, // 10 sec safety
       });
   
    const mailOptions = {
  from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
  to: email,
  subject: "Your Message Has Been Received ✔",
  html: `
  <div style="background:#f4f6f9;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    
    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#2563eb;padding:24px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:24px;">EdTech Platform</h1>
        <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Thank you for contacting us</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="margin-top:0;color:#111;">Hello ${email},</h2>

        <p style="color:#444;font-size:15px;line-height:1.6;">
          We’ve successfully received your message. Our support team will review it and respond shortly.
        </p>

        <!-- Message Card -->
        <div style="background:#f1f5f9;border-left:4px solid #2563eb;padding:15px;margin:20px 0;border-radius:6px;">
          <p style="margin:0;font-size:14px;color:#333;">
            <strong>Your message has been recorded in our system.</strong>
          </p>
        </div>

        <p style="color:#444;font-size:15px;">
          If your inquiry is urgent, feel free to reply to this email.
        </p>

        <!-- Button -->
        <div style="text-align:center;margin-top:25px;">
          <a href="#" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">
            Visit Our Platform
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#777;">
        © ${new Date().getFullYear()} EdTech Platform • All Rights Reserved
      </div>

    </div>

  </div>
  `,
};

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// get all contact us messages


exports.getAllMessages=async(req,res)=>{
    try {
        const messages = await contactus.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All messages fetched successfully",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



