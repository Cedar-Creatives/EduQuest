import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import { AITeacher } from "@/components/AITeacher";
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
} from "lucide-react";
import { getQuiz, submitQuiz } from "@/api/quiz";
import { Label } from "@/components/ui/label";

export function QuizTaking() {
  const { subject, difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAITeacher, setShowAITeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('Kingsley');
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});
  const [confidence, setConfidence] = useState({});
  const [strugglingQuestions, setStrugglingQuestions] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(`Fetching quiz: ${subject} - ${difficulty}`);
        const data = await getQuiz(subject!, difficulty!);
        setQuiz(data.quiz);
        setQuizStartTime(Date.now()); // Set the start time when the quiz data is loaded
        setQuestionStartTime(Date.now()); // Set the start time for the first question
      } catch (error: any) {
        console.error('Error fetching quiz:', error);
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
            handleSubmit(); // Submit the quiz when time runs out
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
    // Track time spent on current question
    const timeSpent = Date.now() - questionStartTime;
    setQuestionTimes(prev => ({
      ...prev,
      [currentQuestionIndex]: timeSpent
    }));

    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now()); // Reset timer for the next question
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now()); // Reset timer for the previous question
    }
  };

  const handleConfidenceChange = (questionIndex, confidenceLevel) => {
    setConfidence(prev => ({
      ...prev,
      [questionIndex]: confidenceLevel
    }));

    // If confidence is low, add to struggling questions
    if (confidenceLevel <= 2 && !strugglingQuestions.includes(questionIndex)) {
      setStrugglingQuestions(prev => [...prev, questionIndex]);
    }
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

      const detailedAnswers = quiz.questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: answers[index],
        timeSpent: questionTimes[index] || 0,
        confidence: confidence[index] || 3, // Default confidence to 3 if not set
        wasStruggling: strugglingQuestions.includes(index)
      }));

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          subject,
          difficulty,
          answers,
          detailedAnswers,
          totalTimeSpent,
          avgTimePerQuestion,
          strugglingQuestions,
          aiTeacherUsed: showAITeacher,
          selectedTeacher
        })
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/app/results/${result.quizId}`);
      } else {
        throw new Error('Failed to submit quiz');
      }
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Quiz not found or is empty.</p>
        <Button onClick={() => navigate('/app/quiz')} className="mt-4">
          Back to Quiz Selection
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredQuestionsCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {subject} Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Difficulty: <Badge variant="outline">{difficulty}</Badge>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Timer className="w-5 h-5" />
              <span className="font-mono text-lg">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAITeacher(!showAITeacher)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">AI Help</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Progress Bar with Analytics */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Quick Stats */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Answered: {answeredQuestionsCount}/{quiz.questions.length}</span>
            <span>Avg. Time: {Math.round((Date.now() - quizStartTime) / (currentQuestionIndex + 1 || 1) / 1000)}s/question</span>
            <span>Struggling: {strugglingQuestions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className={`grid gap-6 ${showAITeacher ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Quiz Questions Area */}
        <div className={`space-y-6 ${showAITeacher ? 'lg:col-span-2' : 'col-span-1'}`}>
          {currentQuestion && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question {currentQuestionIndex + 1}</span>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <Badge variant="outline">{currentQuestion.type || 'Multiple Choice'}</Badge>
                    {strugglingQuestions.includes(currentQuestionIndex) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Struggling
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                <div className="grid gap-3">
                  {currentQuestion.options?.map((option, index) => (
                    <Button
                      key={index}
                      variant={answers[currentQuestionIndex] === option ? "default" : "outline"}
                      onClick={() => handleAnswerSelect(option)}
                      className="justify-start text-left h-auto p-4 whitespace-normal hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQuestionIndex] === option ? 'border-blue-500' : 'border-gray-300'}`}>
                          {answers[currentQuestionIndex] === option && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Confidence Indicator */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <Label className="text-sm font-medium mb-2 block">How confident are you with this answer?</Label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Button
                        key={level}
                        variant={confidence[currentQuestionIndex] === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleConfidenceChange(currentQuestionIndex, level)}
                        className="w-10 h-10 p-0"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Not sure</span>
                    <span>Very confident</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>

                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {answeredQuestionsCount} / {quiz.questions.length} answered
                    </div>
                    <div className="text-xs text-gray-500">
                      Time on Q: {Math.round((Date.now() - questionStartTime) / 1000)}s
                    </div>
                  </div>

                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      {submitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quiz Progress Summary */}
          {quiz.questions.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{answeredQuestionsCount}</div>
                    <div className="text-xs text-gray-600">Answered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{Math.round((1800 - timeLeft) / 60)}</div>
                    <div className="text-xs text-gray-600">Minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{strugglingQuestions.length}</div>
                    <div className="text-xs text-gray-600">Struggling</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(confidence).length > 0 ?
                        Math.round(Object.values(confidence).reduce((a, b) => a + b, 0) / Object.keys(confidence).length) : 0}
                    </div>
                    <div className="text-xs text-gray-600">Avg. Confidence</div>
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
                <Label className="text-sm font-medium mb-2 block">Choose your AI teacher:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedTeacher === 'Kingsley' ? "default" : "outline"}
                    onClick={() => setSelectedTeacher('Kingsley')}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">K</span>
                    </div>
                    <span className="text-xs">Supportive</span>
                  </Button>
                  <Button
                    variant={selectedTeacher === 'Rita' ? "default" : "outline"}
                    onClick={() => setSelectedTeacher('Rita')}
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