// models/Otp.js

const mongoose = require("mongoose");
const sendEmail = require("../utlis/Sendemails");

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 5 * 60, // Auto delete after 5 minutes
    },
  },
  { collection: "otps" }
);


// =============================
// Email Sending Function
// =============================
async function sendEmailVerification(email, otp) {
  try {
    const title = "OTP Verification from Kodemates Education";
    const body = `
      <h2>OTP Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="color:#2563eb;">${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `;

    const mailResponse = await sendEmail(email, title, body);
    console.log("📩 Verification email sent:", mailResponse);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    // Do NOT throw error — we don't want save() to fail
  }
}


// =============================
// Pre Save Hook
// =============================
OtpSchema.pre("save", async function (next) {

  // Only send email if OTP is newly created
  if (this.isNew || this.isModified("otp")) {
    await sendEmailVerification(this.email, this.otp);
    console.log("📧 OTP email triggered for:", this.email);
  }

  next();
});


const Otp = mongoose.model("Otp", OtpSchema);
module.exports = Otp;
