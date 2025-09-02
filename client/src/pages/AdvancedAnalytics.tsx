import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Brain,
  Award,
  Trophy,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Users,
  Lightbulb,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";

interface AnalyticsData {
  totalQuizzes: number;
  averageScore: number;
  studyStreak: number;
  totalStudyTime: number;
  subjects: {
    name: string;
    quizzesTaken: number;
    averageScore: number;
    timeSpent: number;
    strength: 'strong' | 'moderate' | 'weak';
  }[];
  weeklyProgress: {
    week: string;
    quizzes: number;
    averageScore: number;
    studyTime: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
  }[];
  learningPatterns: {
    bestStudyTime: string;
    mostProductiveDay: string;
    averageSessionLength: number;
    preferredSubjects: string[];
  };
}

export function AdvancedAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Check if user has premium subscription
  const isPremium = user?.subscription?.status === 'premium';

  useEffect(() => {
    if (!isPremium) {
      navigate('/app/upgrade');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // Simulate API call - replace with actual API
        const mockData: AnalyticsData = {
          totalQuizzes: 47,
          averageScore: 78.5,
          studyStreak: 12,
          totalStudyTime: 2840, // minutes
          subjects: [
            { name: 'Mathematics', quizzesTaken: 15, averageScore: 82, timeSpent: 450, strength: 'strong' },
            { name: 'Physics', quizzesTaken: 12, averageScore: 75, timeSpent: 380, strength: 'moderate' },
            { name: 'English', quizzesTaken: 10, averageScore: 85, timeSpent: 320, strength: 'strong' },
            { name: 'Chemistry', quizzesTaken: 8, averageScore: 68, timeSpent: 280, strength: 'weak' },
            { name: 'Biology', quizzesTaken: 2, averageScore: 72, timeSpent: 90, strength: 'moderate' },
          ],
          weeklyProgress: [
            { week: 'Week 1', quizzes: 8, averageScore: 75, studyTime: 320 },
            { week: 'Week 2', quizzes: 12, averageScore: 78, studyTime: 480 },
            { week: 'Week 3', quizzes: 15, averageScore: 82, studyTime: 600 },
            { week: 'Week 4', quizzes: 12, averageScore: 79, studyTime: 480 },
          ],
          achievements: [
            { id: '1', title: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🎯', unlocked: false, progress: 47, maxProgress: 50 },
            { id: '2', title: 'Streak Champion', description: 'Maintain 15-day study streak', icon: '🔥', unlocked: false, progress: 12, maxProgress: 15 },
            { id: '3', title: 'Subject Expert', description: 'Achieve 90%+ in any subject', icon: '🏆', unlocked: true, progress: 100, maxProgress: 100 },
            { id: '4', title: 'Time Warrior', description: 'Study for 50 hours total', icon: '⏰', unlocked: false, progress: 47, maxProgress: 50 },
            { id: '5', title: 'Consistency King', description: 'Study 7 days in a row', icon: '👑', unlocked: true, progress: 100, maxProgress: 100 },
          ],
          learningPatterns: {
            bestStudyTime: 'Evening (6-9 PM)',
            mostProductiveDay: 'Wednesday',
            averageSessionLength: 45, // minutes
            preferredSubjects: ['Mathematics', 'Physics'],
          },
        };

        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isPremium, navigate]);

  if (!isPremium) {
    return null; // Will redirect to upgrade
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Analytics</h3>
            <p className="text-gray-500 dark:text-gray-400">Preparing your detailed insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Analytics Unavailable</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Unable to load your analytics data.</p>
        <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Try Again
        </Button>
      </div>
    );
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'weak': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <TrendingUp className="w-4 h-4" />;
      case 'moderate': return <Target className="w-4 h-4" />;
      case 'weak': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Advanced Analytics</h1>
                <p className="text-blue-100">Detailed insights into your learning journey</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Quizzes</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{analyticsData.totalQuizzes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Average Score</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{analyticsData.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Study Streak</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{analyticsData.studyStreak} days</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Study Time</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{Math.round(analyticsData.totalStudyTime / 60)}h</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Patterns */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Learning Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Study Time</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analyticsData.learningPatterns.bestStudyTime}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Productive Day</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analyticsData.learningPatterns.mostProductiveDay}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Session Length</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analyticsData.learningPatterns.averageSessionLength} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Preferred Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.learningPatterns.preferredSubjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.weeklyProgress.map((week, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{week.week}</span>
                      <span className="text-gray-500">{week.averageScore}%</span>
                    </div>
                    <Progress value={week.averageScore} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{week.quizzes} quizzes</span>
                      <span>{Math.round(week.studyTime / 60)}h study time</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.subjects.map((subject, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{subject.name}</h3>
                        <Badge className={`${getStrengthColor(subject.strength)}`}>
                          {getStrengthIcon(subject.strength)}
                          <span className="ml-1 capitalize">{subject.strength}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{subject.averageScore}%</p>
                        <p className="text-sm text-gray-500">{subject.quizzesTaken} quizzes</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Performance</span>
                        <span className="text-gray-800 dark:text-gray-200">{subject.averageScore}%</span>
                      </div>
                      <Progress value={subject.averageScore} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Time spent: {Math.round(subject.timeSpent / 60)}h</span>
                        <span>Quizzes: {subject.quizzesTaken}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Trend */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.weeklyProgress.map((week, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{week.week}</p>
                        <p className="text-sm text-gray-500">{week.quizzes} quizzes taken</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{week.averageScore}%</p>
                        <p className="text-sm text-gray-500">{Math.round(week.studyTime / 60)}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Time Distribution */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Study Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{subject.name}</span>
                        <span className="text-gray-500">{Math.round(subject.timeSpent / 60)}h</span>
                      </div>
                      <Progress value={(subject.timeSpent / analyticsData.totalStudyTime) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData.achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700' 
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.unlocked 
                            ? 'text-gray-800 dark:text-gray-200' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => navigate('/app/quiz')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Take Another Quiz
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/app/profile')}
          className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <Users className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </div>
    </div>
  );
}
