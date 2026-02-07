const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudconnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

/* ===================== LOAD ENV ===================== */
dotenv.config();

/* ===================== INIT APP ===================== */
const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: true, // same-origin on Render
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/* ===================== CLOUDINARY ===================== */
cloudconnect();

/* ===================== API ROUTES ===================== */
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/courses", courseRoutes);

/* ===================== FRONTEND (VITE BUILD) ===================== */
// __dirname = Server/
const rootDir = path.resolve(__dirname, ".."); // Edutech/

app.use(express.static(path.join(rootDir, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(rootDir, "dist", "index.html"));
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();
