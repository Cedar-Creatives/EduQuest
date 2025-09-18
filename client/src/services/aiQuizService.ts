// AI Quiz Generation Service
export interface AIQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  subject: string;
}

export interface QuizConfig {
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  topics?: string[];
}

export class AIQuizService {
  private static instance: AIQuizService;
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  static getInstance(): AIQuizService {
    if (!AIQuizService.instance) {
      AIQuizService.instance = new AIQuizService();
    }
    return AIQuizService.instance;
  }

  async generateQuiz(config: QuizConfig): Promise<AIQuestion[]> {
    try {
      console.log('Generating AI quiz with config:', config);
      
      // For now, generate mock questions with AI-like content
      // In production, this would call your AI service
      const questions = await this.generateMockQuestions(config);
      
      return questions;
    } catch (error) {
      console.error('Error generating AI quiz:', error);
      throw new Error('Failed to generate quiz questions');
    }
  }

  private async generateMockQuestions(config: QuizConfig): Promise<AIQuestion[]> {
    // Mock AI-generated questions based on subject and difficulty
    const questionTemplates = this.getQuestionTemplates(config.subject, config.difficulty);
    
    const questions: AIQuestion[] = [];
    
    for (let i = 0; i < config.questionCount; i++) {
      const template = questionTemplates[i % questionTemplates.length];
      questions.push({
        id: `ai_${Date.now()}_${i}`,
        question: template.question,
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        difficulty: config.difficulty,
        topic: template.topic,
        subject: config.subject
      });
    }
    
    return questions;
  }

  private getQuestionTemplates(subject: string, difficulty: string) {
    const templates = {
      mathematics: {
        beginner: [
          {
            question: "What is 15 + 27?",
            options: ["40", "42", "44", "46"],
            correctAnswer: "42",
            explanation: "15 + 27 = 42. When adding two-digit numbers, you can add the tens place (10 + 20 = 30) and the ones place (5 + 7 = 12), then combine them: 30 + 12 = 42.",
            topic: "Basic Addition"
          },
          {
            question: "Which of the following is a prime number?",
            options: ["15", "21", "17", "25"],
            correctAnswer: "17",
            explanation: "17 is a prime number because it can only be divided by 1 and itself without leaving a remainder. 15 = 3×5, 21 = 3×7, and 25 = 5×5, so they are not prime.",
            topic: "Prime Numbers"
          },
          {
            question: "What is the area of a rectangle with length 8 and width 5?",
            options: ["13", "26", "40", "45"],
            correctAnswer: "40",
            explanation: "The area of a rectangle is length × width. So 8 × 5 = 40 square units.",
            topic: "Area and Perimeter"
          }
        ],
        intermediate: [
          {
            question: "Solve for x: 3x + 7 = 22",
            options: ["x = 3", "x = 5", "x = 7", "x = 9"],
            correctAnswer: "x = 5",
            explanation: "To solve 3x + 7 = 22: First subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5.",
            topic: "Linear Equations"
          },
          {
            question: "What is the slope of the line passing through points (2, 3) and (6, 11)?",
            options: ["1", "2", "3", "4"],
            correctAnswer: "2",
            explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2",
            topic: "Coordinate Geometry"
          }
        ],
        advanced: [
          {
            question: "Find the derivative of f(x) = 3x² + 2x - 5",
            options: ["6x + 2", "3x + 2", "6x - 5", "3x² + 2"],
            correctAnswer: "6x + 2",
            explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-5) = 0. Therefore, f'(x) = 6x + 2.",
            topic: "Calculus - Derivatives"
          }
        ]
      },
      science: {
        beginner: [
          {
            question: "What is the chemical symbol for water?",
            options: ["H₂O", "CO₂", "NaCl", "O₂"],
            correctAnswer: "H₂O",
            explanation: "Water is composed of two hydrogen atoms (H) and one oxygen atom (O), giving it the chemical formula H₂O.",
            topic: "Basic Chemistry"
          },
          {
            question: "Which planet is closest to the Sun?",
            options: ["Venus", "Earth", "Mercury", "Mars"],
            correctAnswer: "Mercury",
            explanation: "Mercury is the closest planet to the Sun in our solar system, with an average distance of about 36 million miles.",
            topic: "Solar System"
          }
        ],
        intermediate: [
          {
            question: "What is the process by which plants make their own food?",
            options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
            correctAnswer: "Photosynthesis",
            explanation: "Photosynthesis is the process where plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.",
            topic: "Plant Biology"
          }
        ],
        advanced: [
          {
            question: "According to Newton's second law, if the mass of an object doubles while the force remains constant, what happens to acceleration?",
            options: ["Doubles", "Halves", "Remains the same", "Quadruples"],
            correctAnswer: "Halves",
            explanation: "F = ma, so a = F/m. If mass doubles and force stays constant, acceleration becomes F/(2m) = (1/2)(F/m), which is half the original acceleration.",
            topic: "Physics - Newton's Laws"
          }
        ]
      }
    };

    const subjectKey = subject.toLowerCase() as keyof typeof templates;
    const difficultyKey = difficulty as keyof typeof templates[typeof subjectKey];
    
    return templates[subjectKey]?.[difficultyKey] || templates.mathematics.beginner;
  }

  async getExplanation(question: string, userAnswer: string, correctAnswer: string): Promise<string> {
    // In production, this would call an AI service for personalized explanations
    return `The correct answer is "${correctAnswer}". Your answer "${userAnswer}" was incorrect. Let me explain why the correct answer is right and help you understand the concept better.`;
  }
}

export const aiQuizService = AIQuizService.getInstance();