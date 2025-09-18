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
      console.warn("OpenRouter API key not configured, using fallback questions");
      return this.getFallbackQuestions(subject, difficulty, count);
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
        console.log("Falling back to mock questions");
        return this.getFallbackQuestions(subject, difficulty, count);
      }
    } catch (error) {
      console.error("OpenRouter API error:", error);

      // Check if it's a credits issue
      if (error.response && error.response.data && 
          error.response.data.error && 
          error.response.data.error.message && 
          error.response.data.error.message.includes('credits')) {
        console.warn("Insufficient OpenRouter credits, using fallback questions");
        return this.getFallbackQuestions(subject, difficulty, count);
      }

      // Provide more detailed error messages based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error("API Response Error:", error.response.data);
        console.log("Falling back to mock questions due to API error");
        return this.getFallbackQuestions(subject, difficulty, count);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Request Error: No response received");
        console.log("Falling back to mock questions due to network error");
        return this.getFallbackQuestions(subject, difficulty, count);
      } else {
        // Something happened in setting up the request
        console.log("Falling back to mock questions due to request setup error");
        return this.getFallbackQuestions(subject, difficulty, count);
      }
    }
  }

  getFallbackQuestions(subject, difficulty, count = 5) {
    const normalizedSubject = subject.toLowerCase();
    const normalizedDifficulty = difficulty.toLowerCase();
    
    const questionTemplates = {
      mathematics: {
        basic: [
          {
            question: "What is 5 + 7?",
            options: ["10", "11", "12", "13"],
            correctAnswer: 2,
            explanation: "5 + 7 = 12. This is basic addition.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "What is 9 × 3?",
            options: ["27", "21", "24", "18"],
            correctAnswer: 0,
            explanation: "9 × 3 = 27. This is basic multiplication.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "Solve: 15 − 6",
            options: ["7", "8", "9", "10"],
            correctAnswer: 2,
            explanation: "15 − 6 = 9. This is basic subtraction.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "What is 12 ÷ 4?",
            options: ["2", "3", "4", "6"],
            correctAnswer: 1,
            explanation: "12 ÷ 4 = 3. This is basic division.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "What is 2³ (2 to the power of 3)?",
            options: ["6", "8", "9", "12"],
            correctAnswer: 1,
            explanation: "2³ = 2 × 2 × 2 = 8. This is basic exponentiation.",
            difficulty: difficulty,
            subject: subject
          }
        ],
        intermediate: [
          {
            question: "Solve: 3x + 5 = 14",
            options: ["x = 2", "x = 3", "x = 4", "x = 5"],
            correctAnswer: 1,
            explanation: "3x + 5 = 14, so 3x = 9, therefore x = 3.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "What is the area of a rectangle with length 8 and width 5?",
            options: ["13", "26", "40", "45"],
            correctAnswer: 2,
            explanation: "Area = length × width = 8 × 5 = 40 square units.",
            difficulty: difficulty,
            subject: subject
          }
        ]
      },
      english: {
        basic: [
          {
            question: "What is the synonym of 'quick'?",
            options: ["Rapid", "Slow", "Lazy", "Heavy"],
            correctAnswer: 0,
            explanation: "'Rapid' means fast or quick, making it a synonym.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "Which is a noun?",
            options: ["Run", "Blue", "Happiness", "Quickly"],
            correctAnswer: 2,
            explanation: "'Happiness' is a noun as it names a feeling or state.",
            difficulty: difficulty,
            subject: subject
          }
        ]
      },
      physics: {
        basic: [
          {
            question: "What is the unit of force?",
            options: ["Joule", "Newton", "Watt", "Pascal"],
            correctAnswer: 1,
            explanation: "Newton (N) is the SI unit of force, named after Isaac Newton.",
            difficulty: difficulty,
            subject: subject
          },
          {
            question: "What is the speed of light in vacuum?",
            options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁹ m/s"],
            correctAnswer: 0,
            explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second.",
            difficulty: difficulty,
            subject: subject
          }
        ]
      }
    };

    const subjectQuestions = questionTemplates[normalizedSubject] || questionTemplates.mathematics;
    const difficultyQuestions = subjectQuestions[normalizedDifficulty] || subjectQuestions.basic || subjectQuestions[Object.keys(subjectQuestions)[0]];
    
    // Return the requested number of questions, cycling through available ones if needed
    const questions = [];
    for (let i = 0; i < count; i++) {
      const questionIndex = i % difficultyQuestions.length;
      questions.push({
        ...difficultyQuestions[questionIndex],
        id: `fallback-${i + 1}`
      });
    }
    
    return questions;
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
      console.warn("OpenRouter API key not configured, using fallback response");
      return this.getFallbackTeacherResponse(message);
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

      // Check if it's a credits issue
      if (error.response && error.response.data && 
          error.response.data.error && 
          error.response.data.error.message && 
          error.response.data.error.message.includes('credits')) {
        console.warn("Insufficient OpenRouter credits, using fallback response");
        return this.getFallbackTeacherResponse(message);
      }

      // Provide more detailed error messages based on the error type
      if (error.response) {
        console.error("API Response Error:", error.response.data);
        console.log("Falling back to mock response due to API error");
        return this.getFallbackTeacherResponse(message);
      } else if (error.request) {
        console.error("API Request Error: No response received");
        console.log("Falling back to mock response due to network error");
        return this.getFallbackTeacherResponse(message);
      } else {
        console.log("Falling back to mock response due to request setup error");
        return this.getFallbackTeacherResponse(message);
      }
    }
  }

  getFallbackTeacherResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Math-related responses
    if (lowerMessage.includes('math') || lowerMessage.includes('calculate') || lowerMessage.includes('solve')) {
      return "I'd be happy to help you with mathematics! Math is all about problem-solving and logical thinking. Could you share the specific problem you're working on? I can guide you through it step by step.";
    }
    
    // English-related responses
    if (lowerMessage.includes('english') || lowerMessage.includes('grammar') || lowerMessage.includes('writing')) {
      return "English is a wonderful subject! Whether you need help with grammar, vocabulary, or writing skills, I'm here to assist. What specific area would you like to work on today?";
    }
    
    // Physics-related responses
    if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('energy')) {
      return "Physics helps us understand how the world works! From the motion of objects to the behavior of light and energy, it's fascinating. What physics concept would you like to explore?";
    }
    
    // Study tips
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tips')) {
      return "Great question about studying! Here are some effective study tips: 1) Break topics into smaller chunks, 2) Practice regularly rather than cramming, 3) Teach concepts to someone else, and 4) Take breaks to help your brain process information. What subject are you studying?";
    }
    
    // Exam preparation
    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('waec') || lowerMessage.includes('jamb')) {
      return "Exam preparation is key to success! Focus on understanding concepts rather than just memorizing. Practice past questions, create a study schedule, and don't forget to take care of your health. Which exam are you preparing for?";
    }
    
    // Motivation and encouragement
    if (lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('struggling')) {
      return "I understand that learning can be challenging sometimes, but remember that every expert was once a beginner! Take it one step at a time, celebrate small victories, and don't hesitate to ask for help. You've got this! What specific topic is giving you trouble?";
    }
    
    // General greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your AI teacher, and I'm excited to help you learn today! Whether you need help with math, English, physics, or study tips, I'm here to support your educational journey. What would you like to explore?";
    }
    
    // Default encouraging response
    return "That's an interesting question! I'm here to help you learn and understand any topic better. Could you provide a bit more detail about what you'd like to know? I believe in your ability to learn and grow!";
  }
}

module.exports = new OpenRouterService();
