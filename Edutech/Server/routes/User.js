const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  logout,
  changePassword,
  verifyOtp,

  deleteAccount,
} = require("../Controllers/Auths");

const {
  resetPasswordToken,
  resetPassword,
} = require("../Controllers/Resetpassword");


const { createContactus } = require("../Controllers/Contactus");

const { auth } = require("../middleware/Auth");
const rateLimit = require("../middleware/rateLimit");

/* ================= SAFETY CHECK ================= */

if (typeof auth !== "function") {
  throw new Error("auth middleware is not a function");
}

/* ================= AUTH ROUTES ================= */

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/contactus", rateLimit, createContactus);

router.delete("/deleteAccount",  deleteAccount);

/* ================= PASSWORD ROUTES ================= */

router.put("/changePassword", auth, changePassword);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword/:token", resetPassword);



module.exports = router;