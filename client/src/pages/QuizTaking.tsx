import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import { AITeacher } from "@/components/AITeacher";
import { useOffline } from "@/hooks/useServiceWorker";
import {
  CheckCircle,
  Flag,
  MessageCircle,
  Target,
  Timer,
  BookOpen,
  AlertCircle,
  WifiOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { aiQuizService, AIQuestion } from "@/services/aiQuizService";

export function QuizTaking() {
  const { subject, difficulty } = useParams();
  const navigate = useNavigate();
  const { } = useAuth();
  const { toast } = useToast();
  const isOffline = useOffline();

  const [quiz, setQuiz] = useState<AIQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [answerValidation, setAnswerValidation] = useState<{ [key: number]: { isCorrect: boolean; showFeedback: boolean } }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAITeacher, setShowAITeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("Kingsley");
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState<{ [key: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        console.log('Generating AI quiz for:', { subject, difficulty });

        const questions = await aiQuizService.generateQuiz({
          subject: subject!,
          difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
          questionCount: 10
        });

        setQuiz(questions);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());

        toast({
          title: "Quiz Generated! 🎉",
          description: `AI has created ${questions.length} personalized questions for you.`,
        });
      } catch (error: any) {
        console.error('Error generating quiz:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate quiz",
          variant: "destructive",
        });
        navigate("/app/quiz");
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [subject, difficulty, navigate, toast]);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, timeLeft]);

  const handleAnswerSelect = (option: string) => {
    const currentQuestion = quiz[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
    
    // Show immediate feedback
    setAnswerValidation((prev) => ({
      ...prev,
      [currentQuestionIndex]: { isCorrect, showFeedback: true }
    }));
  };

  const handleNext = () => {
    const timeSpent = Date.now() - questionStartTime;
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestionIndex]: timeSpent,
    }));

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
      // Reset validation for next question
      setShowValidation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };



  const toggleFlagQuestion = (questionIndex: number) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionIndex)
        ? prev.filter((q) => q !== questionIndex)
        : [...prev, questionIndex]
    );
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const totalTimeSpent = Date.now() - quizStartTime;
      const correctAnswers = quiz.filter((q, index) =>
        answers[index] === q.correctAnswer
      ).length;

      const score = Math.round((correctAnswers / quiz.length) * 100);

      // Calculate detailed results
      const detailedResults = quiz.map((question, index) => ({
        questionId: question.id,
        question: question.question,
        selectedAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect: answers[index] === question.correctAnswer,
        explanation: question.explanation,
        timeSpent: questionTimes[index] || 0,
        wasFlagged: flaggedQuestions.includes(index),
        topic: question.topic
      }));

      // Store results in localStorage for the results page
      const quizResults = {
        id: `quiz_${Date.now()}`,
        subject,
        difficulty,
        score,
        correctAnswers,
        totalQuestions: quiz.length,
        totalTimeSpent,
        detailedResults,
        flaggedQuestions,
        aiTeacherUsed: showAITeacher,
        selectedTeacher,
        completedAt: new Date().toISOString()
      };

      localStorage.setItem('latestQuizResults', JSON.stringify(quizResults));

      toast({
        title: "Quiz Submitted! 🎉",
        description: `You scored ${score}% (${correctAnswers}/${quiz.length})`,
      });

      navigate(`/app/results/${quizResults.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Preparing Your Quiz
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Generating questions tailored for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Quiz Not Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The quiz you're looking for doesn't exist or is empty.
        </p>
        <Button
          onClick={() => navigate("/app/quiz")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Quiz Selection
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;
  const answeredQuestionsCount = Object.keys(answers).length;
  const timeLeftMinutes = Math.floor(timeLeft / 60);
  const timeLeftSeconds = timeLeft % 60;

  return (
    <div className="space-y-6">
      {/* Enhanced Quiz Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{subject} Quiz</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {difficulty}
                  </Badge>
                  {isOffline && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                    >
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
              <Timer className="w-5 h-5" />
              <span className="font-mono text-lg font-bold">
                {timeLeftMinutes}:{timeLeftSeconds.toString().padStart(2, "0")}
              </span>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
              <Target className="w-4 h-4" />
              <span className="font-medium">
                {currentQuestionIndex + 1} / {quiz.length}
              </span>
            </div>

            {/* AI Help Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAITeacher(!showAITeacher)}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI Help</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm text-blue-100">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/20" />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold">{answeredQuestionsCount}</div>
              <div className="text-blue-100 text-xs">Answered</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold">
                {Math.round((1800 - timeLeft) / 60)}
              </div>
              <div className="text-blue-100 text-xs">Minutes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold">{flaggedQuestions.length}</div>
              <div className="text-blue-100 text-xs">Flagged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div
        className={`grid gap-6 ${showAITeacher ? "lg:grid-cols-3" : "grid-cols-1"
          }`}
      >
        {/* Quiz Questions Area */}
        <div
          className={`space-y-6 ${showAITeacher ? "lg:col-span-2" : "col-span-1"
            }`}
        >
          {currentQuestion && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {currentQuestionIndex + 1}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Question {currentQuestionIndex + 1}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          Multiple Choice
                        </Badge>

                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                    className={`${flaggedQuestions.includes(currentQuestionIndex)
                        ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                        : "hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      }`}
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Question Text */}
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Answer Options with Real-time Validation */}
                <div className="grid gap-3">
                  {currentQuestion.options?.map(
                    (option: string, index: number) => {
                      const isSelected = answers[currentQuestionIndex] === option;
                      const validation = answerValidation[currentQuestionIndex];
                      const showFeedback = validation?.showFeedback && isSelected;
                      const isCorrect = option === currentQuestion.correctAnswer;
                      
                      let buttonClass = "";
                      let iconColor = "";
                      
                      if (showFeedback) {
                        if (validation.isCorrect) {
                          buttonClass = "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105 border-green-500";
                          iconColor = "text-white";
                        } else {
                          buttonClass = "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105 border-red-500";
                          iconColor = "text-white";
                        }
                      } else if (isSelected) {
                        buttonClass = "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105";
                        iconColor = "text-white";
                      } else {
                        buttonClass = "hover:shadow-md hover:scale-102 hover:border-blue-300 dark:hover:border-blue-600";
                        iconColor = "text-gray-300 dark:text-gray-600";
                      }
                      
                      // Show correct answer in green if user got it wrong
                      if (validation?.showFeedback && !validation.isCorrect && isCorrect) {
                        buttonClass = "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md border-green-400";
                        iconColor = "text-white";
                      }

                      return (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => !validation?.showFeedback && handleAnswerSelect(option)}
                          disabled={validation?.showFeedback}
                          className={`justify-start text-left h-auto p-4 whitespace-normal transition-all duration-300 ${buttonClass}`}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                showFeedback
                                  ? validation.isCorrect
                                    ? "border-white bg-white/20"
                                    : "border-white bg-white/20"
                                  : isSelected
                                  ? "border-white bg-white/20"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {(isSelected || (validation?.showFeedback && !validation.isCorrect && isCorrect)) && (
                                <CheckCircle className={`w-4 h-4 ${iconColor}`} />
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                            {validation?.showFeedback && isSelected && (
                              <div className="ml-2">
                                {validation.isCorrect ? (
                                  <div className="flex items-center text-white">
                                    <CheckCircle className="w-5 h-5 mr-1" />
                                    <span className="text-sm font-medium">Correct!</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-white">
                                    <div className="w-5 h-5 mr-1 rounded-full bg-white/20 flex items-center justify-center">
                                      <span className="text-xs font-bold">✗</span>
                                    </div>
                                    <span className="text-sm font-medium">Incorrect</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {validation?.showFeedback && !validation.isCorrect && isCorrect && (
                              <div className="ml-2">
                                <div className="flex items-center text-white">
                                  <CheckCircle className="w-5 h-5 mr-1" />
                                  <span className="text-sm font-medium">Correct Answer</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    }
                  )}
                </div>

                {/* Show explanation after answering */}
                {answerValidation[currentQuestionIndex]?.showFeedback && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Explanation
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}



                {/* Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="text-center space-y-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {answeredQuestionsCount} / {quiz.length}{" "}
                      answered
                    </div>
                    <div className="text-xs text-gray-500">
                      Time on Q:{" "}
                      {Math.round((Date.now() - questionStartTime) / 1000)}s
                    </div>
                  </div>

                  {currentQuestionIndex === quiz.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Quiz
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Quiz Progress Summary */}
          {quiz.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                  Quiz Progress Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {answeredQuestionsCount}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Answered
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((1800 - timeLeft) / 60)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Minutes
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {flaggedQuestions.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Flagged
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(progress)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      % Complete
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Teacher Sidebar */}
        {showAITeacher && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="mb-4">
                <Label className="text-sm font-medium mb-3 block">
                  Choose your AI teacher:
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={
                      selectedTeacher === "Kingsley" ? "default" : "outline"
                    }
                    onClick={() => setSelectedTeacher("Kingsley")}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">K</span>
                    </div>
                    <span className="text-xs">Supportive</span>
                  </Button>
                  <Button
                    variant={selectedTeacher === "Rita" ? "default" : "outline"}
                    onClick={() => setSelectedTeacher("Rita")}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">R</span>
                    </div>
                    <span className="text-xs">Challenging</span>
                  </Button>
                </div>
              </div>

              <AITeacher
                selectedTeacher={selectedTeacher}
                subject={subject}
                context={`Quiz question: ${currentQuestion?.question}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
