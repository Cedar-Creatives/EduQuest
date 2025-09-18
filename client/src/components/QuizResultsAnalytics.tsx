import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Brain,
  Star,
  Award,
  BarChart3,
  PieChart,
  Zap,
  Calendar,
} from 'lucide-react';

interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  subject: string;
  difficulty: string;
  answers: Array<{
    questionId: string;
    question: string;
    options: string[];
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }>;
  performance: {
    grade: string;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  completedAt: string;
}

interface QuizResultsAnalyticsProps {
  result: QuizResult;
  onRetakeQuiz?: () => void;
  onViewExplanations?: () => void;
  onContinueLearning?: () => void;
}

export function QuizResultsAnalytics({
  result,
  onRetakeQuiz,
  onViewExplanations,
  onContinueLearning,
}: QuizResultsAnalyticsProps) {
  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const timePerQuestion = Math.round(result.timeTaken / result.totalQuestions);
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'B':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'C':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'D':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'F':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPerformanceIcon = () => {
    if (percentage >= 90) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (percentage >= 80) return <Award className="w-8 h-8 text-blue-500" />;
    if (percentage >= 70) return <Target className="w-8 h-8 text-green-500" />;
    if (percentage >= 60) return <TrendingUp className="w-8 h-8 text-orange-500" />;
    return <TrendingDown className="w-8 h-8 text-red-500" />;
  };

  const getMotivationalMessage = () => {
    if (percentage >= 90) return "Outstanding performance! You've mastered this topic! 🌟";
    if (percentage >= 80) return "Excellent work! You're doing great! 🎉";
    if (percentage >= 70) return "Good job! You're on the right track! 👍";
    if (percentage >= 60) return "Nice effort! Keep practicing to improve! 💪";
    return "Don't give up! Every expert was once a beginner! 🚀";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Results Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getPerformanceIcon()}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Quiz Complete!
          </CardTitle>
          <p className="text-gray-600 mt-2">{getMotivationalMessage()}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <Badge className={`text-lg px-3 py-1 ${getGradeColor(result.performance.grade)}`}>
                  Grade {result.performance.grade}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{result.correctAnswers} of {result.totalQuestions} correct</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="text-lg font-semibold">{result.subject}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="text-lg font-semibold capitalize">{result.difficulty}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="text-lg font-semibold">{formatTime(result.timeTaken)}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Question</p>
                <p className="text-lg font-semibold">{timePerQuestion}s</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {result.performance.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Strengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.performance.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {result.performance.improvements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <TrendingUp className="w-5 h-5" />
                <span>Areas to Improve</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.performance.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Question Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Question Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.answers.map((answer, index) => (
              <div
                key={answer.questionId}
                className={`p-3 rounded-lg border-2 ${
                  answer.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Q{index + 1}</span>
                  {answer.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {answer.question}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onViewExplanations}
          variant="default"
          className="flex items-center space-x-2"
        >
          <Brain className="w-4 h-4" />
          <span>View Explanations</span>
        </Button>
        
        <Button
          onClick={onRetakeQuiz}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Retake Quiz</span>
        </Button>
        
        <Button
          onClick={onContinueLearning}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Continue Learning</span>
        </Button>
      </div>
    </div>
  );
}