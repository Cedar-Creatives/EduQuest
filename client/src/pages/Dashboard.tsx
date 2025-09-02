import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  EnhancedCard,
  CardHeader as EnhancedCardHeader,
  CardTitle as EnhancedCardTitle,
  CardDescription as EnhancedCardDescription,
  CardContent as EnhancedCardContent,
} from "@/components/ui/enhanced-card";
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
  Zap,
  Activity,
  Play,
  Lightbulb,
  Flame,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  UsersIcon,
  TimerIcon,
  TargetIcon,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/api/dashboard";
import { useToast } from "@/hooks/useToast";
import { ProgressTracker } from "@/components/ProgressTracker";
import { AchievementSystem } from "@/components/AchievementSystem";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Quizzes Completed",
      value: dashboardData?.stats?.quizzesCompleted || 0,
      icon: Brain,
      color: "from-primary-blue-500 to-primary-blue-600",
      bgColor: "bg-primary-blue-100",
      textColor: "text-primary-blue-600",
    },
    {
      title: "Average Score",
      value: `${dashboardData?.stats?.averageScore || 0}%`,
      icon: Target,
      color: "from-success-green-500 to-success-green-600",
      bgColor: "bg-success-green-100",
      textColor: "text-success-green-600",
    },
    {
      title: "Study Streak",
      value: `${dashboardData?.stats?.studyStreak || 0} days`,
      icon: Flame,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      title: "Achievements",
      value: dashboardData?.stats?.achievements || 0,
      icon: Trophy,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  const recommendedTopics = [
    {
      subject: "Mathematics",
      topic: "Quadratic Equations",
      difficulty: "Intermediate",
      estimatedTime: "45 min",
      progress: 65,
      color: "from-primary-blue-500 to-primary-blue-600",
    },
    {
      subject: "English",
      topic: "Essay Writing",
      difficulty: "Basic",
      estimatedTime: "30 min",
      progress: 80,
      color: "from-success-green-500 to-success-green-600",
    },
    {
      subject: "Physics",
      topic: "Mechanics",
      difficulty: "Advanced",
      estimatedTime: "60 min",
      progress: 40,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const dailyGoals = [
    {
      name: "Daily Quizzes",
      current: dashboardData?.dailyQuizzesUsed || 0,
      target: 5,
      unit: "quizzes",
    },
    {
      name: "Study Time",
      current: dashboardData?.studyTimeToday || 0,
      target: 60,
      unit: "minutes",
    },
    {
      name: "AI Questions",
      current: dashboardData?.aiQuestionsUsed || 0,
      target: 5,
      unit: "questions",
    },
  ];

  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Start your learning journey today!";
    if (streak < 3) return "Great start! Keep the momentum going!";
    if (streak < 7) return "You're building a great habit!";
    if (streak < 14) return "Impressive consistency! You're unstoppable!";
    if (streak < 30)
      return "Outstanding dedication! You're a learning machine!";
    return "Legendary! You're an inspiration to all students!";
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "🌱";
    if (streak < 3) return "🔥";
    if (streak < 7) return "🚀";
    if (streak < 14) return "⚡";
    if (streak < 30) return "💎";
    return "👑";
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Welcome Section with Study Streak */}
      <EnhancedCard
        variant="interactive"
        className="bg-gradient-to-r from-primary-blue-600 via-primary-blue-500 to-success-green-600 text-white border-0 shadow-xl"
      >
        <EnhancedCardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-4xl">
                  {getStreakEmoji(dashboardData?.stats?.studyStreak || 0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.username || "Student"}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {getMotivationalMessage(
                      dashboardData?.stats?.studyStreak || 0
                    )}
                  </p>
                </div>
              </div>

              {/* Study Streak Counter */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
                <div className="flex items-center space-x-3">
                  <Flame className="w-6 h-6 text-orange-300" />
                  <div>
                    <div className="text-2xl font-bold">
                      {dashboardData?.stats?.studyStreak || 0}
                    </div>
                    <div className="text-sm text-blue-100">
                      Day Study Streak
                    </div>
                  </div>
                  <div className="text-xs text-blue-100 bg-white/20 px-2 py-1 rounded">
                    {dashboardData?.stats?.studyStreak || 0 >= 7
                      ? "🔥 Hot"
                      : "🌱 Growing"}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block mt-6 lg:mt-0">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <EnhancedCard
            key={index}
            variant="interactive"
            hover
            className="group transform hover:scale-105 transition-all duration-300"
          >
            <EnhancedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <EnhancedCardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </EnhancedCardTitle>
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                  stat.bgColor
                )}
              >
                <stat.icon className={cn("w-5 h-5", stat.textColor)} />
              </div>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stat.title === "Study Streak" &&
                  stat.value !== "0 days" &&
                  "Keep it up! 🔥"}
                {stat.title === "Average Score" &&
                  parseInt(stat.value) >= 80 &&
                  "Excellent! 🎉"}
                {stat.title === "Achievements" &&
                  parseInt(stat.value) > 0 &&
                  "You're amazing! 🏆"}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions & Daily Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <EnhancedCard
            variant="interactive"
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Jump right into your learning activities
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate("/app/quiz")}
                  className="h-24 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 flex flex-col items-center justify-center space-y-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Brain className="w-8 h-8" />
                  <span className="font-semibold">Take a Quiz</span>
                </Button>
                <Button
                  onClick={() => navigate("/app/notes")}
                  variant="outline"
                  className="h-24 border-2 border-success-green-300 text-success-green-600 hover:bg-success-green-50 flex flex-col items-center justify-center space-y-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <BookOpen className="w-8 h-8" />
                  <span className="font-semibold">Browse Notes</span>
                </Button>
                <Button
                  onClick={() => navigate("/app/ai-teacher")}
                  className="h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex flex-col items-center justify-center space-y-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle className="w-10 h-10" />
                  <span className="font-semibold">AI Teacher</span>
                </Button>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>

          {/* Daily Goals Progress */}
          <EnhancedCard
            variant="default"
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="flex items-center">
                <TargetIcon className="w-5 h-5 mr-2 text-success-green-500" />
                Daily Goals Progress
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Track your daily learning targets
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-6">
              {dailyGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {goal.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress
                    value={(goal.current / goal.target) * 100}
                    className="h-3"
                    indicatorClassName={cn(
                      "transition-all duration-500",
                      goal.current / goal.target >= 0.8
                        ? "bg-success-green-500"
                        : goal.current / goal.target >= 0.6
                        ? "bg-yellow-500"
                        : "bg-primary-blue-500"
                    )}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}

              {/* Weekly Goal */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Weekly Goal</span>
                  <span className="text-sm text-gray-500">
                    {dashboardData?.weeklyProgress || 0}%
                  </span>
                </div>
                <Progress
                  value={dashboardData?.weeklyProgress || 0}
                  className="h-3"
                  indicatorClassName={cn(
                    "transition-all duration-500",
                    (dashboardData?.weeklyProgress || 0) >= 80
                      ? "bg-success-green-500"
                      : (dashboardData?.weeklyProgress || 0) >= 60
                      ? "bg-yellow-500"
                      : "bg-primary-blue-500"
                  )}
                />
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>

        {/* Recommended Next Topic */}
        <div className="space-y-6">
          <EnhancedCard
            variant="interactive"
            className="bg-gradient-to-br from-success-green-50 to-primary-blue-50 border-success-green-200"
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="flex items-center text-success-green-700">
                <Lightbulb className="w-5 h-5 mr-2" />
                Recommended Next Topic
              </EnhancedCardTitle>
              <EnhancedCardDescription className="text-success-green-600">
                AI-suggested based on your progress
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-4">
                {recommendedTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-success-green-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {topic.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {topic.estimatedTime}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {topic.subject}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{topic.topic}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-success-green-600 hover:bg-success-green-700"
                      onClick={() =>
                        navigate("/app/quiz", {
                          state: { subject: topic.subject, topic: topic.topic },
                        })
                      }
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>

          {/* Exam Countdown */}
          <EnhancedCard
            variant="default"
            className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="flex items-center text-orange-700">
                <TimerIcon className="w-5 h-5 mr-2" />
                Exam Countdown
              </EnhancedCardTitle>
              <EnhancedCardDescription className="text-orange-600">
                Stay focused on your goals
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  45 Days
                </div>
                <div className="text-sm text-orange-600 mb-4">
                  Until WAEC 2024
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="text-xs text-orange-600 mb-2">
                    Today's Focus
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Complete 2 practice quizzes
                  </div>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="overview"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Quizzes */}
            <EnhancedCard
              variant="default"
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-blue-500" />
                  Recent Quizzes
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Your latest quiz performance
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="space-y-4">
                  {dashboardData?.recentQuizzes
                    ?.slice(0, 5)
                    .map((quiz: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {quiz.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {quiz.difficulty} • {quiz.date}
                          </p>
                        </div>
                        <Badge
                          variant={
                            quiz.score >= 80
                              ? "default"
                              : quiz.score >= 60
                              ? "secondary"
                              : "destructive"
                          }
                          className="ml-2"
                        >
                          {quiz.score}%
                        </Badge>
                      </div>
                    )) || (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recent quizzes</p>
                      <p className="text-sm text-gray-400">
                        Take your first quiz to get started!
                      </p>
                      <Button
                        onClick={() => navigate("/app/quiz")}
                        className="mt-3 bg-primary-blue-600 hover:bg-primary-blue-700"
                      >
                        Start Quiz
                      </Button>
                    </div>
                  )}
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Recent Achievements */}
            <EnhancedCard
              variant="default"
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Recent Achievements
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Celebrate your learning milestones
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="space-y-4">
                  {dashboardData?.achievements
                    ?.slice(0, 5)
                    .map((achievement: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {achievement.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    )) || (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No achievements yet</p>
                      <p className="text-sm text-gray-400">
                        Complete quizzes and study goals to earn achievements!
                      </p>
                    </div>
                  )}
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>

          {/* Upgrade Prompt for Free Users */}
          {user?.plan === "freemium" && (
            <EnhancedCard
              variant="interactive"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl"
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Unlock Your Full Potential
                </EnhancedCardTitle>
                <EnhancedCardDescription className="text-purple-100">
                  Upgrade to Premium for unlimited quizzes, all study materials,
                  and advanced AI features
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => navigate("/app/upgrade")}
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                  >
                    Upgrade to Premium
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTracker />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementSystem compact={false} />
        </TabsContent>
      </Tabs>

      {/* Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}
