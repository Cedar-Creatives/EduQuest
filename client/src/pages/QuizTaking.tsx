import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  Brain
} from "lucide-react"
import { getQuiz, submitQuiz } from "@/api/quiz"
import { useToast } from "@/hooks/useToast"

export function QuizTaking() {
  const { subject, difficulty } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(`Fetching quiz: ${subject} - ${difficulty}`)
        const data = await getQuiz(subject!, difficulty!)
        setQuiz(data.quiz)
        setStartTime(Date.now())
      } catch (error: any) {
        console.error('Error fetching quiz:', error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
        navigate('/app/quiz')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [subject, difficulty, navigate, toast])

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [loading, timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return
    
    setSelectedAnswer(answerIndex)
    const questionId = quiz.questions[currentQuestion]._id
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowFeedback(false)
      setSelectedAnswer(answers[quiz.questions[currentQuestion + 1]._id] ?? null)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setShowFeedback(false)
      setSelectedAnswer(answers[quiz.questions[currentQuestion - 1]._id] ?? null)
    }
  }

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length === 0) {
      toast({
        title: "No answers provided",
        description: "Please answer at least one question before submitting",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      console.log('Submitting quiz answers...')
      console.log('Quiz object:', quiz) // Debug log
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      
      // Create an array of just the answer indices in the order of questions
      const answerArray = quiz.questions.map((q: any) => {
        return answers[q._id] !== undefined ? answers[q._id] : -1 // -1 for unanswered questions
      })

      // Ensure we have a valid quizId
      const quizId = quiz._id || quiz.id
      if (!quizId) {
        throw new Error('Quiz ID is missing')
      }

      console.log('Submitting with quizId:', quizId)
      console.log('Answers array:', answerArray)

      const result = await submitQuiz({
        quizId: quizId,
        answers: answerArray,
        timeTaken,
        subject,
        difficulty
      })

      navigate(`/app/results/${result.result.id}`, { 
        state: { 
          result: result.result, 
          quiz: quiz,
          subject,
          difficulty 
        } 
      })
    } catch (error: any) {
      console.error('Error submitting quiz:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Quiz not found</p>
        <Button onClick={() => navigate('/app/quiz')} className="mt-4">
          Back to Quiz Selection
        </Button>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl capitalize">
                {subject} Quiz - {difficulty}
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-blue-100">
                <span className="flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {answeredQuestions} answered
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-blue-100 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                Time Left: {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="w-48 h-2 bg-blue-400" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQ.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQ.correctAnswer
              const showCorrectAnswer = showFeedback && isCorrect
              const showIncorrectAnswer = showFeedback && isSelected && !isCorrect

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full p-4 h-auto text-left justify-start transition-all duration-300 ${
                    showCorrectAnswer
                      ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-50'
                      : showIncorrectAnswer
                      ? 'bg-red-50 border-red-500 text-red-700 hover:bg-red-50'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showCorrectAnswer
                        ? 'border-green-500 bg-green-500'
                        : showIncorrectAnswer
                        ? 'border-red-500 bg-red-500'
                        : isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {(isSelected || showCorrectAnswer) && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                      {showCorrectAnswer && <CheckCircle className="w-4 h-4 text-white" />}
                      {showIncorrectAnswer && <XCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </Button>
              )
            })}
          </div>

          {/* Explanation */}
          {showFeedback && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation:</h4>
              <p className="text-blue-800 dark:text-blue-200">{currentQ.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            {answeredQuestions} / {quiz.questions.length} answered
          </Badge>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.questions.map((_: any, index: number) => {
              const isAnswered = answers[quiz.questions[index]._id] !== undefined
              const isCurrent = index === currentQuestion
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`w-10 h-10 p-0 ${
                    isCurrent
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setCurrentQuestion(index)
                    setShowFeedback(false)
                    setSelectedAnswer(answers[quiz.questions[index]._id] ?? null)
                  }}
                >
                  {index + 1}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}