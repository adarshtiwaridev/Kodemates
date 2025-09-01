const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    let token = null;

    // 1. Priority: Authorization header
    if (req.header("Authorization")) {
      const parts = req.header("Authorization").split(" ");
      if (parts[0] === "Bearer" && parts[1]) {
        token = parts[1];
      }
    }

    // 2. Fallback: body or cookies
    if (!token) token = req.body.token || req.cookies.token;

    // If no token
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


// ------------------ ROLE CHECKERS ------------------
exports.student = (req, res, next) => {
  if (req.user.role !== "Student") {
    return res.status(403).json({ success: false, message: "Student only route" });
  }
  next();
};

exports.instructor = (req, res, next) => {
  if (req.user.role !== "Teacher") {
    return res.status(403).json({ success: false, message: "Instructor only route" });
  }
  next();
};

exports.admin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Admin only route" });
  }
  next();
};