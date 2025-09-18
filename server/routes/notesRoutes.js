const express = require("express");
const router = express.Router();
const { requireUser } = require("./middleware/firebaseAuth.js");

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Notes Routes ---

// GET /api/notes - Get all notes for the authenticated user
router.get(
  "/",
  requireUser, // Apply the authentication middleware
  asyncHandler(async (req, res, next) => {
    // The user's ID is now available on req.user.uid
    console.log(`-> GET /api/notes for UID: ${req.user.uid}`);

    try {
      // In a real app, you would fetch notes from the database for the user: req.user.uid
      const mockNotes = [
        {
          id: "note1",
          userId: req.user.uid, // Associate note with user
          title: "Mathematics Basics",
          content: "Introduction to basic mathematics concepts...",
          subject: "Mathematics",
          createdAt: new Date().toISOString(),
        },
        {
          id: "note2",
          userId: req.user.uid, // Associate note with user
          title: "English Grammar",
          content: "Essential English grammar rules...",
          subject: "English",
          createdAt: new Date().toISOString(),
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

// GET /api/notes/:id - Get a specific note for the authenticated user
router.get(
  "/:id",
  requireUser, // Apply the authentication middleware
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/notes/${req.params.id} for UID: ${req.user.uid}`);

    try {
      // In a real app, you would verify that this note belongs to the user before returning it
      const mockNote = {
        id: req.params.id,
        userId: req.user.uid,
        title: "Sample Note",
        content: "This is a sample note content...",
        subject: "General",
        createdAt: new Date().toISOString(),
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
