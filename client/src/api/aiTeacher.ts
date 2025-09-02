import api from "./api";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "teacher";
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
  timestamp: string;
  error?: string;
}

export const chatWithAITeacher = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  try {
    console.log("=== AI TEACHER CHAT REQUEST ===");
    console.log("Message:", request.message);
    console.log("History length:", request.conversationHistory.length);

    const response = await api.post("/api/ai-teacher/chat", request);

    console.log("=== AI TEACHER CHAT RESPONSE ===");
    console.log("Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("=== AI TEACHER CHAT ERROR ===");
    console.error("Error:", error);

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to get AI response"
    );
  }
};

export const checkAITeacherHealth = async (): Promise<{
  success: boolean;
  status: string;
  message: string;
}> => {
  try {
    const response = await api.get("/api/ai-teacher/health");
    return response.data;
  } catch (error: any) {
    console.error("AI Teacher health check failed:", error);
    throw new Error("AI Teacher service unavailable");
  }
};
