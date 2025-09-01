import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  Brain,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Star,
  Award,
  Calendar,
  BarChart3,
  Zap
} from "lucide-react"
import { useEffect, useState } from "react"
import { getDashboardData } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...')
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Quizzes Completed",
      value: dashboardData?.stats?.quizzesCompleted || 0,
      icon: Brain,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Average Score",
      value: `${dashboardData?.stats?.averageScore || 0}%`,
      icon: Target,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Study Streak",
      value: `${dashboardData?.stats?.studyStreak || 0} days`,
      icon: Calendar,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Achievements",
      value: dashboardData?.stats?.achievements || 0,
      icon: Trophy,
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username || 'Student'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Jump right into your learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/quiz')}
                className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex flex-col items-center justify-center space-y-2"
              >
                <Brain className="w-6 h-6" />
                <span>Take a Quiz</span>
              </Button>
              <Button
                onClick={() => navigate('/notes')}
                variant="outline"
                className="h-20 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-col items-center justify-center space-y-2"
              >
                <BookOpen className="w-6 h-6" />
                <span>Browse Notes</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Progress */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.plan === 'freemium' && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Quizzes</span>
                  <span>{dashboardData?.dailyQuizzesUsed || 0}/5</span>
                </div>
                <Progress value={(dashboardData?.dailyQuizzesUsed || 0) * 20} className="h-2" />
              </div>
            )}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Study Time Today</span>
                <span>{dashboardData?.studyTimeToday || 0} min</span>
              </div>
              <Progress value={(dashboardData?.studyTimeToday || 0) / 60 * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weekly Goal</span>
                <span>{dashboardData?.weeklyProgress || 0}%</span>
              </div>
              <Progress value={dashboardData?.weeklyProgress || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quizzes */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentQuizzes?.map((quiz: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.subject}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.difficulty} • {quiz.date}</p>
                  </div>
                  <Badge variant={quiz.score >= 80 ? 'default' : quiz.score >= 60 ? 'secondary' : 'destructive'}>
                    {quiz.score}%
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No recent quizzes</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.achievements?.map((achievement: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No achievements yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt for Freemium Users */}
      {user?.plan === 'freemium' && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Unlock Your Full Potential
            </CardTitle>
            <CardDescription className="text-purple-100">
              Upgrade to Premium for unlimited quizzes and advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/upgrade')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}