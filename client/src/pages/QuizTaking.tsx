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
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  Brain,
  MessageCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Timer,
  BookOpen,
  AlertCircle,
  Wifi,
  WifiOff,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getQuiz, submitQuiz } from "@/api/quiz";
import { Label } from "@/components/ui/label";

export function QuizTaking() {
  const { subject, difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isOffline = useOffline();

  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAITeacher, setShowAITeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("Kingsley");
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});
  const [confidence, setConfidence] = useState({});
  const [strugglingQuestions, setStrugglingQuestions] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(`Fetching quiz: ${subject} - ${difficulty}`);
        const data = await getQuiz(subject!, difficulty!);
        setQuiz(data.quiz);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());
      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/app/quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
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
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNext = () => {
    const timeSpent = Date.now() - questionStartTime;
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestionIndex]: timeSpent,
    }));

    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleConfidenceChange = (
    questionIndex: number,
    confidenceLevel: number
  ) => {
    setConfidence((prev) => ({
      ...prev,
      [questionIndex]: confidenceLevel,
    }));

    if (confidenceLevel <= 2 && !strugglingQuestions.includes(questionIndex)) {
      setStrugglingQuestions((prev) => [...prev, questionIndex]);
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
    if (!quiz || Object.keys(answers).length < quiz.questions.length) {
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
      const avgTimePerQuestion = totalTimeSpent / quiz.questions.length;

      const detailedAnswers = quiz.questions.map(
        (question: any, index: number) => ({
          questionId: question.id,
          selectedAnswer: answers[index],
          timeSpent: questionTimes[index] || 0,
          confidence: confidence[index] || 3,
          wasStruggling: strugglingQuestions.includes(index),
          wasFlagged: flaggedQuestions.includes(index),
        })
      );

      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({
          subject,
          difficulty,
          answers,
          detailedAnswers,
          totalTimeSpent,
          avgTimePerQuestion,
          strugglingQuestions,
          flaggedQuestions,
          aiTeacherUsed: showAITeacher,
          selectedTeacher,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/app/results/${result.quizId}`);
      } else {
        throw new Error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your quiz. Please try again.",
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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
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
                {currentQuestionIndex + 1} / {quiz.questions.length}
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
        className={`grid gap-6 ${
          showAITeacher ? "lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {/* Quiz Questions Area */}
        <div
          className={`space-y-6 ${
            showAITeacher ? "lg:col-span-2" : "col-span-1"
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
                          {currentQuestion.type || "Multiple Choice"}
                        </Badge>
                        {strugglingQuestions.includes(currentQuestionIndex) && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Struggling
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                    className={`${
                      flaggedQuestions.includes(currentQuestionIndex)
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

                {/* Answer Options */}
                <div className="grid gap-3">
                  {currentQuestion.options?.map(
                    (option: string, index: number) => (
                      <Button
                        key={index}
                        variant={
                          answers[currentQuestionIndex] === option
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleAnswerSelect(option)}
                        className={`justify-start text-left h-auto p-4 whitespace-normal transition-all duration-200 ${
                          answers[currentQuestionIndex] === option
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                            : "hover:shadow-md hover:scale-102 hover:border-blue-300 dark:hover:border-blue-600"
                        }`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              answers[currentQuestionIndex] === option
                                ? "border-white bg-white/20"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {answers[currentQuestionIndex] === option && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </Button>
                    )
                  )}
                </div>

                {/* Confidence Indicator */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">
                    How confident are you with this answer?
                  </Label>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Button
                          key={level}
                          variant={
                            confidence[currentQuestionIndex] === level
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleConfidenceChange(currentQuestionIndex, level)
                          }
                          className={`w-12 h-12 p-0 transition-all duration-200 ${
                            confidence[currentQuestionIndex] === level
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                              : "hover:scale-105"
                          }`}
                        >
                          {level === 1 && <Star className="w-4 h-4" />}
                          {level === 2 && <Star className="w-4 h-4" />}
                          {level === 3 && <Star className="w-4 h-4" />}
                          {level === 4 && <Star className="w-4 h-4" />}
                          {level === 5 && <Star className="w-4 h-4" />}
                        </Button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>Not sure</div>
                      <div>Very confident</div>
                    </div>
                  </div>
                </div>

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
                      {answeredQuestionsCount} / {quiz.questions.length}{" "}
                      answered
                    </div>
                    <div className="text-xs text-gray-500">
                      Time on Q:{" "}
                      {Math.round((Date.now() - questionStartTime) / 1000)}s
                    </div>
                  </div>

                  {currentQuestionIndex === quiz.questions.length - 1 ? (
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
          {quiz.questions.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                  Quiz Progress Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                      {strugglingQuestions.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Struggling
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(confidence).length > 0
                        ? Math.round(
                            Object.values(confidence).reduce(
                              (a: number, b: number) => a + b,
                              0
                            ) / Object.keys(confidence).length
                          )
                        : 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Avg. Confidence
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
