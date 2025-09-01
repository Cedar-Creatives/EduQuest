const express = require("express");
const router = express.Router();
const { requireUser } = require("./middleware/firebaseAuth");
const { db } = require("../config/firebase");
const { openRouterService } = require("../services/openRouterService");

// Apply authentication middleware to all routes
router.use(requireUser);

// GET /api/notes - Get all notes (public + user's own)
router.get("/", async (req, res) => {
  try {
    console.log("=== GET /api/notes ===");
    console.log("User:", req.user.uid);

    // Get user's own notes (simplified to avoid index issues)
    const userNotesSnapshot = await db
      .collection("notes")
      .where("userId", "==", req.user.uid)
      .get();

    // Get public notes from other users (simplified to avoid index issues)
    const publicNotesSnapshot = await db
      .collection("notes")
      .where("isPublic", "==", true)
      .limit(50) // Increased limit since we'll filter in JS
      .get();

    const userNotes = userNotesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const publicNotes = publicNotesSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((note) => note.userId !== req.user.uid) // Filter out user's own notes in JS
      .slice(0, 20); // Limit to 20 after filtering

    // Sort both arrays by createdAt in JavaScript
    const sortedUserNotes = userNotes.sort(
      (a, b) =>
        new Date(b.createdAt?.toDate?.() || b.createdAt) -
        new Date(a.createdAt?.toDate?.() || a.createdAt)
    );

    const sortedPublicNotes = publicNotes.sort(
      (a, b) =>
        new Date(b.createdAt?.toDate?.() || b.createdAt) -
        new Date(a.createdAt?.toDate?.() || a.createdAt)
    );

    const allNotes = [...sortedUserNotes, ...sortedPublicNotes];

    res.json({
      success: true,
      notes: allNotes,
    });
  } catch (error) {
    console.error("Error in GET /api/notes:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/notes/my - Get user's own notes only
router.get("/my", async (req, res) => {
  try {
    console.log("=== GET /api/notes/my ===");
    console.log("User:", req.user.uid);

    const notesSnapshot = await db
      .collection("notes")
      .where("userId", "==", req.user.uid)
      .get();

    const notes = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by createdAt in JavaScript
    const sortedNotes = notes.sort(
      (a, b) =>
        new Date(b.createdAt?.toDate?.() || b.createdAt) -
        new Date(a.createdAt?.toDate?.() || a.createdAt)
    );

    res.json({
      success: true,
      notes: sortedNotes,
    });
  } catch (error) {
    console.error("Error in GET /api/notes/my:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/notes/search - Search notes
router.get("/search", async (req, res) => {
  try {
    console.log("=== GET /api/notes/search ===");
    console.log("User:", req.user.uid);
    console.log("Query:", req.query.q);

    const { q: query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    // Basic Firestore search (for exact matches)
    const userNotesSnapshot = await db
      .collection("notes")
      .where("userId", "==", req.user.uid)
      .get();

    const publicNotesSnapshot = await db
      .collection("notes")
      .where("isPublic", "==", true)
      .get();

    const allNotes = [
      ...userNotesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...publicNotesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ];

    // Filter notes by search query
    const filteredNotes = allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.subject.toLowerCase().includes(query.toLowerCase()) ||
        (note.tags &&
          note.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
    );

    // If OpenRouter API is available, enhance search with AI
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const aiEnhancedResults = await openRouterService.searchNotes(
          query,
          allNotes
        );
        if (aiEnhancedResults && aiEnhancedResults.length > 0) {
          // Merge AI results with basic search results
          const aiNoteIds = aiEnhancedResults.map((note) => note.id);
          const basicResults = filteredNotes.filter(
            (note) => !aiNoteIds.includes(note.id)
          );
          const enhancedNotes = [...aiEnhancedResults, ...basicResults];

          res.json({
            success: true,
            notes: enhancedNotes,
            searchType: "ai_enhanced",
          });
          return;
        }
      } catch (aiError) {
        console.log(
          "AI search failed, falling back to basic search:",
          aiError.message
        );
      }
    }

    res.json({
      success: true,
      notes: filteredNotes,
      searchType: "basic",
    });
  } catch (error) {
    console.error("Error in GET /api/notes/search:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
  try {
    console.log("=== POST /api/notes ===");
    console.log("User:", req.user.uid);
    console.log("Request body:", req.body);

    const { title, content, subject, description, isPublic, tags } = req.body;

    // Validate required fields
    if (!title || !content || !subject) {
      return res.status(400).json({
        success: false,
        error: "Title, content, and subject are required",
      });
    }

    // Check if user is premium for note creation
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = userDoc.data();
    if (user.subscriptionStatus !== "premium") {
      return res.status(403).json({
        success: false,
        error: "Premium users only can create notes",
      });
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      subject: subject.trim(),
      description: description?.trim() || "",
      isPublic: isPublic !== false, // Default to true
      tags: tags || [],
      userId: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If OpenRouter API is available, enhance the note with AI
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const aiSummary = await openRouterService.summarizeNote(content);
        if (aiSummary) {
          noteData.aiSummary = aiSummary;
        }
      } catch (aiError) {
        console.log("AI summarization failed:", aiError.message);
      }
    }

    const noteRef = await db.collection("notes").add(noteData);
    const note = { id: noteRef.id, ...noteData };

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: note,
      noteId: note.id,
    });
  } catch (error) {
    console.error("Error in POST /api/notes:", error.message);

    if (error.message.includes("Premium users")) {
      return res.status(403).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/notes/:noteId - Get a specific note by ID
router.get("/:noteId", async (req, res) => {
  try {
    console.log("=== GET /api/notes/:noteId ===");
    console.log("Note ID:", req.params.noteId);
    console.log("User:", req.user.uid);

    const noteDoc = await db.collection("notes").doc(req.params.noteId).get();

    if (!noteDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    const note = { id: noteDoc.id, ...noteDoc.data() };

    // Check if user has access to this note
    if (note.userId !== req.user.uid && !note.isPublic) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    res.json({
      success: true,
      note: note,
    });
  } catch (error) {
    console.error("Error in GET /api/notes/:noteId:", error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message.includes("Access denied")) {
      return res.status(403).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/notes/:noteId - Update a note
router.put("/:noteId", async (req, res) => {
  try {
    console.log("=== PUT /api/notes/:noteId ===");
    console.log("Note ID:", req.params.noteId);
    console.log("User:", req.user.uid);
    console.log("Request body:", req.body);

    const { title, content, subject, description, isPublic, tags } = req.body;

    // Check if note exists and user owns it
    const noteDoc = await db.collection("notes").doc(req.params.noteId).get();
    if (!noteDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    const note = noteDoc.data();
    if (note.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (subject !== undefined) updateData.subject = subject.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (tags !== undefined) updateData.tags = tags;

    // If content was updated and OpenRouter API is available, update AI summary
    if (content && process.env.OPENROUTER_API_KEY) {
      try {
        const aiSummary = await openRouterService.summarizeNote(content);
        if (aiSummary) {
          updateData.aiSummary = aiSummary;
        }
      } catch (aiError) {
        console.log("AI summarization failed:", aiError.message);
      }
    }

    await db.collection("notes").doc(req.params.noteId).update(updateData);

    // Get updated note
    const updatedNoteDoc = await db
      .collection("notes")
      .doc(req.params.noteId)
      .get();
    const updatedNote = { id: updatedNoteDoc.id, ...updatedNoteDoc.data() };

    res.json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error in PUT /api/notes/:noteId:", error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message.includes("Access denied")) {
      return res.status(403).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/notes/:noteId - Delete a note
router.delete("/:noteId", async (req, res) => {
  try {
    console.log("=== DELETE /api/notes/:noteId ===");
    console.log("Note ID:", req.params.noteId);
    console.log("User:", req.user.uid);

    // Check if note exists and user owns it
    const noteDoc = await db.collection("notes").doc(req.params.noteId).get();
    if (!noteDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    const note = noteDoc.data();
    if (note.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.collection("notes").doc(req.params.noteId).delete();

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/notes/:noteId:", error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message.includes("Access denied")) {
      return res.status(403).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
