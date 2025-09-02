const express = require("express");
const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Notes Routes ---

// GET /api/notes - Get all notes
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/notes");

    try {
      // Mock notes data
      const mockNotes = [
        {
          id: "note1",
          title: "Mathematics Basics",
          content: "Introduction to basic mathematics concepts...",
          subject: "Mathematics",
          difficulty: "Basic",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "note2",
          title: "English Grammar",
          content: "Essential English grammar rules...",
          subject: "English",
          difficulty: "Basic",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      res.status(200).json({
        success: true,
        data: mockNotes,
      });
    } catch (error) {
      console.error("Notes error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notes.",
      });
    }
  })
);

// GET /api/notes/:id - Get a specific note
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/notes/${req.params.id}`);

    try {
      // Mock note data
      const mockNote = {
        id: req.params.id,
        title: "Sample Note",
        content: "This is a sample note content...",
        subject: "General",
        difficulty: "Basic",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      res.status(200).json({
        success: true,
        data: mockNote,
      });
    } catch (error) {
      console.error("Note error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch note.",
      });
    }
  })
);

module.exports = router;
