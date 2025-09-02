const express = require("express");
const router = express.Router();
const openRouterService = require("../services/openRouterService");

// Chat with AI Teacher
router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log("=== AI TEACHER CHAT REQUEST ===");
    console.log("Message:", message);
    console.log("Conversation History Length:", conversationHistory.length);

    const aiResponse = await openRouterService.chatWithAITeacher(
      message,
      conversationHistory
    );

    console.log("=== AI TEACHER RESPONSE ===");
    console.log("Response:", aiResponse);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("=== AI TEACHER CHAT ERROR ===");
    console.error("Error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message || "Failed to get AI response",
    });
  }
});

// Health check for AI Teacher service
router.get("/health", async (req, res) => {
  try {
    // Test if OpenRouter API key is configured
    const hasApiKey = !!process.env.OPENROUTER_API_KEY;

    res.json({
      success: true,
      service: "AI Teacher",
      status: hasApiKey ? "ready" : "no_api_key",
      message: hasApiKey
        ? "AI Teacher service is ready"
        : "OpenRouter API key not configured",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
