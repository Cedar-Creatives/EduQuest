require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// --- Route Imports ---
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notesRoutes = require("./routes/notesRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const aiTeacherRoutes = require("./routes/aiTeacherRoutes");
const progressRoutes = require("./routes/progressRoutes");


// --- Server Initialization ---
const app = express();

// --- Middleware ---
// Enable CORS for all routes. In a production environment, you might want to restrict this
// to your frontend's domain. e.g., cors({ origin: 'https://eduquest-production-4e67.up.railway.app' })
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Mount all the individual routers on the /api path.
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai-teacher", aiTeacherRoutes);
app.use("/api/progress", progressRoutes);


// --- Serve Static Frontend ---
// This must be after all API routes. It serves the React build for any routes not matched above.
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, "index.html"));
  });
}

// --- Port Configuration ---
const PORT = process.env.PORT || 8080;

// --- Server Startup ---
app.listen(PORT, () => {
  console.log("=== SERVER STARTUP (Corrected Routing) ===");
  console.log(`Server running at http://localhost:${PORT}`);
});
