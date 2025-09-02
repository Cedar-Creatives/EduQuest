require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db, auth } = require("./config/firebase");
const path = require("path");

// --- Route Imports ---
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const notesRoutes = require("./routes/notesRoutes");
const progressRoutes = require('./routes/progressRoutes');
const aiTeacherRoutes = require('./routes/aiTeacherRoutes');

// --- Server Initialization ---
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use("/api", basicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai-teacher", aiTeacherRoutes);

// --- Serve Static Frontend ---
// This must be after all API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'))
  })
}


// --- Port Configuration ---
const PORT = process.env.PORT || 8080;

// --- Server Startup ---
app.listen(PORT, () => {
  console.log("=== SERVER STARTUP ===");
  console.log(`Server running at http://localhost:${PORT}`);
});
