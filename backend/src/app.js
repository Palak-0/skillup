const express = require("express");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
    .split(",")
    .map((item) => item.trim().replace(/\/$/, ""))
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Same-origin requests / server requests
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (
        normalizedOrigin.startsWith("http://localhost:") ||
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lectures", require("./routes/lectureRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --------------------------------------------------
// REACT FRONTEND
// --------------------------------------------------

const frontendPath = path.join(__dirname, "../../frontend/build");

app.use(express.static(frontendPath));

// React routing fallback
app.get("*", (req, res, next) => {
  // API routes should not be handled by React
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// error middleware
app.use(errorMiddleware);

module.exports = app;