const axios = require("axios");
require("dotenv").config();

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = "https://openrouter.ai/api/v1";

    if (!this.apiKey) {
      console.warn(
        "OpenRouter API key not found. AI features will be disabled."
      );
    }
  }

  async generateQuizQuestions(subject, difficulty, count = 5) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const prompt = `Generate ${count} multiple choice questions about ${subject} at ${difficulty} difficulty level. 
      Format the response as a JSON array with the following structure:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation of why this is the correct answer",
          "difficulty": "${difficulty}",
          "subject": "${subject}"
        }
      ]
      
      Make sure the questions are educational, accurate, and appropriate for ${difficulty} level.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "EduQuest Quiz Generator",
          },
        }
      );

      const content = response.data.choices[0].message.content;

      // Try to parse the JSON response
      try {
        const questions = JSON.parse(content);
        return questions;
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        throw new Error("Failed to generate quiz questions");
      }
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Provide more detailed error messages based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error("API Response Error:", error.response.data);
        throw new Error(
          `Failed to generate quiz questions: ${
            error.response.data.error?.message ||
            error.response.statusText ||
            "API error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Request Error: No response received");
        throw new Error(
          "Failed to generate quiz questions: No response from AI service"
        );
      } else {
        // Something happened in setting up the request
        throw new Error(`Failed to generate quiz questions: ${error.message}`);
      }
    }
  }

  async explainAnswer(question, userAnswer, correctAnswer, explanation) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const prompt = `Question: ${question}
      User's Answer: ${userAnswer}
      Correct Answer: ${correctAnswer}
      Original Explanation: ${explanation}
      
      Please provide a detailed, educational explanation of why the correct answer is right and why the user's answer might be wrong. 
      Make it helpful for learning purposes.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "EduQuest Answer Explanation",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Provide more detailed error messages based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error("API Response Error:", error.response.data);
        throw new Error(
          `Failed to generate answer explanation: ${
            error.response.data.error?.message ||
            error.response.statusText ||
            "API error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Request Error: No response received");
        throw new Error(
          "Failed to generate answer explanation: No response from AI service"
        );
      } else {
        // Something happened in setting up the request
        throw new Error(
          `Failed to generate answer explanation: ${error.message}`
        );
      }
    }
  }

  async generateSubjectDescription(subjectName) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const prompt = `Generate a brief, engaging description for the subject "${subjectName}" that would be suitable for an educational platform. 
      Keep it under 100 words and make it interesting for students.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "EduQuest Subject Description",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Provide more detailed error messages based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error("API Response Error:", error.response.data);
        throw new Error(
          `Failed to generate subject description: ${
            error.response.data.error?.message ||
            error.response.statusText ||
            "API error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Request Error: No response received");
        throw new Error(
          "Failed to generate subject description: No response from AI service"
        );
      } else {
        // Something happened in setting up the request
        throw new Error(
          `Failed to generate subject description: ${error.message}`
        );
      }
    }
  }

  async summarizeNote(noteContent) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const prompt = `Please provide a concise summary of the following educational note content. 
      Focus on the key concepts and main points. Keep the summary under 200 words.
      
      Note content:
      ${noteContent}`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "EduQuest Note Summarization",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Provide more detailed error messages based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error("API Response Error:", error.response.data);
        throw new Error(
          `Failed to summarize note: ${
            error.response.data.error?.message ||
            error.response.statusText ||
            "API error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Request Error: No response received");
        throw new Error(
          "Failed to summarize note: No response from AI service"
        );
      } else {
        // Something happened in setting up the request
        throw new Error(`Failed to summarize note: ${error.message}`);
      }
    }
  }

  async searchNotes(query, notes) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const prompt = `Given the following search query: "${query}"
      
      And these notes:
      ${notes
        .map(
          (note, index) =>
            `${index + 1}. ${note.title}: ${note.content.substring(0, 200)}...`
        )
        .join("\n")}
      
      Please rank these notes by relevance to the search query. Return a JSON array with the note indices (1-based) in order of relevance, most relevant first.
      
      Format: [3, 1, 2] (if note 3 is most relevant)`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 100,
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "EduQuest Note Search",
          },
        }
      );

      const content = response.data.choices[0].message.content;

      try {
        const rankedIndices = JSON.parse(content);
        return rankedIndices.map((index) => notes[index - 1]); // Convert back to 0-based
      } catch (parseError) {
        console.error("Failed to parse search response:", parseError);
        return notes; // Fallback to original order
      }
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Provide more detailed error messages based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error("API Response Error:", error.response.data);
        throw new Error(
          `Failed to search notes: ${
            error.response.data.error?.message ||
            error.response.statusText ||
            "API error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Request Error: No response received");
        throw new Error("Failed to search notes: No response from AI service");
      } else {
        // Something happened in setting up the request
        throw new Error(`Failed to search notes: ${error.message}`);
      }
    }
  }

  async chatWithAITeacher(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      // Build conversation context
      const messages = [
        {
          role: "system",
          content: `You are EduQuest AI Teacher, a helpful and encouraging educational assistant. Your role is to:

1. Help students understand concepts across all subjects (math, science, literature, history, etc.)
2. Provide clear, step-by-step explanations
3. Encourage learning and build confidence
4. Adapt explanations to the student's level
5. Be patient, supportive, and educational
6. Ask clarifying questions when needed
7. Provide examples and analogies to help understanding

Always maintain a positive, encouraging tone and focus on helping the student learn effectively.`,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        {
          role: "user",
          content: message,
        },
      ];

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "anthropic/claude-3.5-sonnet",
          messages: messages,
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:5000",
            "X-Title": "EduQuest AI Teacher",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Provide more detailed error messages based on the error type
      if (error.response) {
        console.error("API Response Error:", error.response.data);
        throw new Error(
          `Failed to get AI response: ${
            error.response.data.error?.message ||
            error.response.statusText ||
            "API error"
          }`
        );
      } else if (error.request) {
        console.error("API Request Error: No response received");
        throw new Error(
          "Failed to get AI response: No response from AI service"
        );
      } else {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
    }
  }
}

module.exports = new OpenRouterService();
