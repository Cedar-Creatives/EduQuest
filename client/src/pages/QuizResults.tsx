import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from '@/contexts/AuthContext';
import { AITeacher } from '@/components/AITeacher';
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Share2,
  Download,
  Star,
  TrendingUp,
  Award,
  Brain,
  BarChart3,
  MessageCircle,
  BookOpen,
  Lightbulb
} from "lucide-react"

export function QuizResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<any[]>([])
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const { user } = useAuth();

  const { result, quiz, subject, difficulty } = location.state || {}

  useEffect(() => {
    if (result && result.score >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    // Collect wrong answers for review
    if (result && result.answers) {
      const incorrectAnswers = result.answers.filter((answer: any) => !answer.isCorrect)
      setWrongAnswers(incorrectAnswers)
      console.log('Wrong answers:', incorrectAnswers)
    }
  }, [result])

  if (!result || !quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No quiz results found</p>
        <Button onClick={() => navigate('/app/quiz')} className="mt-4">
          Take a Quiz
        </Button>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! 🎉"
    if (score >= 80) return "Excellent work! 👏"
    if (score >= 70) return "Good job! 👍"
    if (score >= 60) return "Not bad, keep practicing! 💪"
    return "Keep studying, you'll improve! 📚"
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const generateAIInsights = async () => {
    if (aiInsights || generatingInsights) return;

    setGeneratingInsights(true);
    try {
      const response = await fetch('/api/quiz/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          quizId,
          results,
          strugglingAreas: result?.strugglingAreas || [],
          timeAnalysis: result?.timeAnalysis || {}
        })
      });

      if (response.ok) {
        const insights = await response.json();
        setAiInsights(insights);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <Card className={`bg-gradient-to-r ${getScoreColor(result.score)} text-white border-0 shadow-xl`}>
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold mb-2">
            {result.score}%
          </CardTitle>
          <CardDescription className="text-white/90 text-xl">
            {getScoreMessage(result.score)}
          </CardDescription>
          <div className="flex justify-center items-center space-x-6 mt-4 text-white/90">
            <span className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              {result.correctAnswers}/{result.totalQuestions} correct
            </span>
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {formatTime(result.timeTaken)}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Results and AI Insights */}
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">Results Overview</TabsTrigger>
          <TabsTrigger value="ai-insights" onClick={generateAIInsights} disabled={generatingInsights || !!aiInsights}>
            {generatingInsights ? 'Generating Insights...' : (aiInsights ? 'AI Insights' : 'AI Insights')}
          </TabsTrigger>
        </TabsList>

        {/* Results Overview Tab */}
        <TabsContent value="results">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Subject</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
                  {subject}
                </p>
                <Badge className="mt-2 capitalize">{difficulty}</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </p>
                <Progress value={(result.correctAnswers / result.totalQuestions) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Time Taken</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(result.timeTaken)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Avg: {Math.round(result.timeTaken / result.totalQuestions)}s per question
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Question Review */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Question Review
              </CardTitle>
              <CardDescription>
                Review your answers and see the correct solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quiz.questions.map((question: any, index: number) => {
                  const userResult = result.results.find((r: any) => r.questionId === question._id)
                  const isCorrect = userResult?.correct

                  return (
                    <div key={question._id} className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <XCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Question {index + 1}: {question.question}
                          </h4>

                          <div className="space-y-2">
                            {question.options.map((option: string, optionIndex: number) => {
                              const isUserAnswer = userResult?.selectedAnswer === optionIndex
                              const isCorrectAnswer = question.correctAnswer === optionIndex

                              return (
                                <div key={optionIndex} className={`p-2 rounded ${
                                  isCorrectAnswer
                                    ? 'bg-green-100 dark:bg-green-800/30 border border-green-300 dark:border-green-700'
                                    : isUserAnswer && !isCorrectAnswer
                                      ? 'bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-700'
                                      : 'bg-gray-50 dark:bg-gray-700'
                                }`}>
                                  <div className="flex items-center space-x-2">
                                    {isCorrectAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={`${
                                      isCorrectAnswer ? 'font-medium text-green-800 dark:text-green-200' :
                                      isUserAnswer && !isCorrectAnswer ? 'font-medium text-red-800 dark:text-red-200' :
                                      'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {option}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Wrong Answers Summary */}
          {wrongAnswers.length > 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-500" />
                  Questions to Review
                </CardTitle>
                <CardDescription>
                  Focus on these questions that you answered incorrectly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wrongAnswers.map((answer, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {answer.question}
                      </h4>
                      <div className="flex items-center text-red-600 dark:text-red-400 mb-2">
                        <XCircle className="w-4 h-4 mr-2" />
                        Your answer: {quiz.questions.find((q: any) => q._id === answer.questionId)?.options[answer.userAnswer]}
                      </div>
                      <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Correct answer: {quiz.questions.find((q: any) => q._id === answer.questionId)?.options[answer.correctAnswer]}
                      </div>
                      {answer.explanation && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Explanation:</strong> {answer.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Insights */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Strengths</h4>
                  <ul className="space-y-2">
                    {result.score >= 80 && (
                      <li className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Excellent overall performance
                      </li>
                    )}
                    {result.timeTaken < 600 && (
                      <li className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Good time management
                      </li>
                    )}
                    {result.correctAnswers > result.totalQuestions / 2 && (
                      <li className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Strong subject knowledge
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {result.score < 70 && (
                      <li className="flex items-center text-orange-600 dark:text-orange-400">
                        <Target className="w-4 h-4 mr-2" />
                        Review fundamental concepts
                      </li>
                    )}
                    {result.timeTaken > 900 && (
                      <li className="flex items-center text-orange-600 dark:text-orange-400">
                        <Clock className="w-4 h-4 mr-2" />
                        Work on answering speed
                      </li>
                    )}
                    <li className="flex items-center text-blue-600 dark:text-blue-400">
                      <Brain className="w-4 h-4 mr-2" />
                      Practice more {subject.toLowerCase()} questions
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wrong Answers Summary - Duplicate Section Removed */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(`/app/quiz/${subject?.toLowerCase()}/${difficulty?.toLowerCase()}`)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </Button>

            <Button
              onClick={() => navigate('/app/quiz')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Try Different Quiz</span>
            </Button>

            <Button
              onClick={() => navigate('/app')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </Button>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatingInsights ? (
                <div className="text-center py-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Our AI is analyzing your performance to provide personalized feedback. This may take a moment...
                  </p>
                  <Button className="animate-pulse" disabled>
                    Analyzing...
                  </Button>
                </div>
              ) : aiInsights ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Strengths</h4>
                  <ul className="space-y-2">
                    {aiInsights.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Areas to Focus On</h4>
                  <ul className="space-y-2">
                    {aiInsights.areasForImprovement.map((area: string, index: number) => (
                      <li key={index} className="flex items-center text-orange-600 dark:text-orange-400">
                        <Target className="w-4 h-4 mr-2" />
                        {area}
                      </li>
                    ))}
                  </ul>

                  {aiInsights.personalizedTips && (
                    <>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Personalized Study Tips</h4>
                      <ul className="space-y-2">
                        {aiInsights.personalizedTips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-center text-blue-600 dark:text-blue-400">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {aiInsights.recommendations && (
                    <>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Next Steps</h4>
                      <ul className="space-y-2">
                        {aiInsights.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-center text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Click the button below to let our AI analyze your quiz performance and provide personalized insights.
                  </p>
                  <Button onClick={generateAIInsights} disabled={generatingInsights}>
                    Generate AI Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade Prompt */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Want More Detailed Analytics?
          </CardTitle>
          <CardDescription className="text-purple-100">
            Upgrade to Premium for advanced performance tracking and personalized study recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate('/app/upgrade')}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}