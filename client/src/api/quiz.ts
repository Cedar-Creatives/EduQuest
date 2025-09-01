import api from './api';

// Description: Get available quiz subjects
// Endpoint: GET /api/quiz/subjects
// Request: {}
// Response: { subjects: Array<{ _id: string, name: string, description: string, totalQuizzes: number, avgTime: number }> }
export const getSubjects = async () => {
  try {
    const response = await api.get('/api/quiz/subjects');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get quiz questions for a specific subject and difficulty
// Endpoint: GET /api/quiz/:subject/:difficulty
// Request: {}
// Response: { quiz: { _id: string, subject: string, difficulty: string, questions: Array<{ _id: string, question: string, options: string[], correctAnswer: number, explanation: string }> } }
export const getQuiz = async (subject: string, difficulty: string) => {
  try {
    const response = await api.get(`/api/quiz/${subject}/${difficulty}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Submit quiz answers and get results
// Endpoint: POST /api/quiz/submit
// Request: { quizId: string, answers: Array<number>, timeTaken?: number, subject?: string, difficulty?: string }
// Response: { result: { id: string, score: number, totalQuestions: number, correctAnswers: number, timeTaken: number, answers: Array<{ questionId: string, question: string, userAnswer: number, correctAnswer: number, isCorrect: boolean, explanation: string }> } }
export const submitQuiz = async (data: { 
  quizId: string; 
  answers: Array<number>; 
  timeTaken?: number;
  subject?: string;
  difficulty?: string;
}) => {
  try {
    const response = await api.post('/api/quiz/submit', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get quiz history for the authenticated user
// Endpoint: GET /api/quiz/history
// Request: { limit?: number }
// Response: { history: Array<{ _id: string, subject: string, difficulty: string, score: number, totalQuestions: number, correctAnswers: number, timeTaken: number, completedAt: string, createdAt: string }> }
export const getQuizHistory = async (limit?: number) => {
  try {
    const url = limit ? `/api/quiz/history?limit=${limit}` : '/api/quiz/history';
    const response = await api.get(url);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Create a new quiz subject
// Endpoint: POST /api/quiz/subjects
// Request: { name: string, description: string, avgTime?: number }
// Response: { subject: { _id: string, name: string, description: string, totalQuizzes: number, avgTime: number } }
export const createSubject = async (data: { name: string; description: string; avgTime?: number }) => {
  try {
    const response = await api.post('/api/quiz/subjects', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Create a new quiz question
// Endpoint: POST /api/quiz/questions
// Request: { subject: string, difficulty: string, question: string, options: string[], correctAnswer: number, explanation: string }
// Response: { question: { _id: string, subject: string, difficulty: string, question: string, options: string[], correctAnswer: number, explanation: string } }
export const createQuestion = async (data: {
  subject: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}) => {
  try {
    const response = await api.post('/api/quiz/questions', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get questions by subject ID
// Endpoint: GET /api/quiz/subjects/:subjectId/questions
// Request: { difficulty?: string }
// Response: { questions: Array<{ _id: string, subject: object, difficulty: string, question: string, options: string[], correctAnswer: number, explanation: string }> }
export const getQuestionsBySubject = async (subjectId: string, difficulty?: string) => {
  try {
    const url = `/api/quiz/subjects/${subjectId}/questions${difficulty ? `?difficulty=${difficulty}` : ''}`;
    const response = await api.get(url);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Select a quiz subject and difficulty, returns a quiz ID
// Endpoint: POST /api/quiz/subjects/:subjectId/select
// Request: { difficulty: string, questionCount?: number }
// Response: { quizId: string, subject: string, difficulty: string, questionCount: number }
export const selectQuizSubject = async (subjectId: string, data: { difficulty: string; questionCount?: number }) => {
  try {
    const response = await api.post(`/api/quiz/subjects/${subjectId}/select`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Generate quiz questions using AI
// Endpoint: POST /api/quiz/generate
// Request: { subject: string, difficulty: string, count?: number }
// Response: { quiz: { id: string, subject: string, difficulty: string, questions: Array<{ question: string, options: string[], correctAnswer: number, explanation: string }> } }
export const generateAIQuiz = async (data: { subject: string; difficulty: string; count?: number }) => {
  try {
    const response = await api.post('/api/quiz/generate', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}