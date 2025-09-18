import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Brain,
  Award,
  Calendar,
  Users,
  Zap,
  Star,
  Trophy,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Download,
  Share,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalQuizzes: number;
    averageScore: number;
    totalStudyTime: number;
    streakDays: number;
    improvementRate: number;
    rank: number;
    totalUsers: number;
  };
  performance: {
    subjects: Array<{
      name: string;
      averageScore: number;
      quizCount: number;
      timeSpent: number;
      improvement: number;
      difficulty: string;
      lastActivity: string;
    }>;
    trends: Array<{
      date: string;
      score: number;
      subject: string;
      difficulty: string;
    }>;
    weakAreas: Array<{
      topic: string;
      subject: string;
      errorRate: number;
      attempts: number;
    }>;
    strongAreas: Array<{
      topic: string;
      subject: string;
      successRate: number;
      attempts: number;
    }>;
  };
  timeAnalysis: {
    dailyPattern: Array<{
      hour: number;
      activity: number;
      performance: number;
    }>;
    weeklyPattern: Array<{
      day: string;
      quizzes: number;
      studyTime: number;
      averageScore: number;
    }>;
    monthlyProgress: Array<{
      month: string;
      quizzes: number;
      averageScore: number;
      improvement: number;
    }>;
  };
  goals: {
    current: Array<{
      title: string;
      progress: number;
      target: number;
      deadline: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    completed: Array<{
      title: string;
      completedDate: string;
      achievement: string;
    }>;
  };
  predictions: {
    examReadiness: number;
    recommendedStudyTime: number;
    weakestSubject: string;
    strongestSubject: string;
    nextMilestone: string;
  };
}

interface AnalyticsDashboardProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
  isPremium?: boolean;
}

export function AnalyticsDashboard({ 
  userId, 
  timeRange = '30d', 
  isPremium = false 
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [userId, timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock comprehensive analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalQuizzes: 47,
          averageScore: 78.5,
          totalStudyTime: 14400, // 4 hours in seconds
          streakDays: 12,
          improvementRate: 15.3,
          rank: 156,
          totalUsers: 2847,
        },
        performance: {
          subjects: [
            {
              name: 'Mathematics',
              averageScore: 82.3,
              quizCount: 18,
              timeSpent: 5400,
              improvement: 18.5,
              difficulty: 'Intermediate',
              lastActivity: '2 hours ago',
            },
            {
              name: 'English',
              averageScore: 76.8,
              quizCount: 15,
              timeSpent: 4200,
              improvement: 12.1,
              difficulty: 'Basic',
              lastActivity: '1 day ago',
            },
            {
              name: 'Physics',
              averageScore: 71.2,
              quizCount: 14,
              timeSpent: 4800,
              improvement: 8.7,
              difficulty: 'Advanced',
              lastActivity: '3 days ago',
            },
          ],
          trends: [
            { date: '2024-01-10', score: 65, subject: 'Mathematics', difficulty: 'Basic' },
            { date: '2024-01-12', score: 72, subject: 'English', difficulty: 'Basic' },
            { date: '2024-01-14', score: 78, subject: 'Mathematics', difficulty: 'Intermediate' },
            { date: '2024-01-16', score: 85, subject: 'Physics', difficulty: 'Advanced' },
            { date: '2024-01-18', score: 82, subject: 'Mathematics', difficulty: 'Intermediate' },
          ],
          weakAreas: [
            { topic: 'Geometry', subject: 'Mathematics', errorRate: 45, attempts: 12 },
            { topic: 'Reading Comprehension', subject: 'English', errorRate: 38, attempts: 8 },
            { topic: 'Thermodynamics', subject: 'Physics', errorRate: 52, attempts: 6 },
          ],
          strongAreas: [
            { topic: 'Algebra', subject: 'Mathematics', successRate: 92, attempts: 15 },
            { topic: 'Grammar', subject: 'English', successRate: 88, attempts: 10 },
            { topic: 'Mechanics', subject: 'Physics', successRate: 85, attempts: 9 },
          ],
        },
        timeAnalysis: {
          dailyPattern: [
            { hour: 6, activity: 5, performance: 72 },
            { hour: 7, activity: 12, performance: 78 },
            { hour: 8, activity: 25, performance: 82 },
            { hour: 9, activity: 35, performance: 85 },
            { hour: 10, activity: 28, performance: 83 },
            { hour: 14, activity: 20, performance: 75 },
            { hour: 15, activity: 30, performance: 80 },
            { hour: 16, activity: 40, performance: 84 },
            { hour: 17, activity: 35, performance: 82 },
            { hour: 19, activity: 25, performance: 78 },
            { hour: 20, activity: 15, performance: 74 },
          ],
          weeklyPattern: [
            { day: 'Mon', quizzes: 8, studyTime: 120, averageScore: 78 },
            { day: 'Tue', quizzes: 6, studyTime: 90, averageScore: 82 },
            { day: 'Wed', quizzes: 7, studyTime: 105, averageScore: 75 },
            { day: 'Thu', quizzes: 9, studyTime: 135, averageScore: 80 },
            { day: 'Fri', quizzes: 5, studyTime: 75, averageScore: 77 },
            { day: 'Sat', quizzes: 8, studyTime: 120, averageScore: 85 },
            { day: 'Sun', quizzes: 4, studyTime: 60, averageScore: 73 },
          ],
          monthlyProgress: [
            { month: 'Oct', quizzes: 12, averageScore: 68, improvement: 0 },
            { month: 'Nov', quizzes: 18, averageScore: 74, improvement: 8.8 },
            { month: 'Dec', quizzes: 22, averageScore: 79, improvement: 6.8 },
            { month: 'Jan', quizzes: 15, averageScore: 82, improvement: 3.8 },
          ],
        },
        goals: {
          current: [
            { title: 'WAEC Preparation', progress: 75, target: 100, deadline: '2024-05-15', priority: 'high' },
            { title: 'Mathematics Mastery', progress: 60, target: 90, deadline: '2024-03-01', priority: 'medium' },
            { title: 'Daily Study Streak', progress: 12, target: 30, deadline: '2024-02-15', priority: 'low' },
          ],
          completed: [
            { title: 'First 100% Quiz Score', completedDate: '2024-01-10', achievement: 'Perfect Score' },
            { title: '10 Quiz Milestone', completedDate: '2024-01-15', achievement: 'Dedicated Learner' },
          ],
        },
        predictions: {
          examReadiness: 72,
          recommendedStudyTime: 45, // minutes per day
          weakestSubject: 'Physics',
          strongestSubject: 'Mathematics',
          nextMilestone: 'Reach 85% average score',
        },
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 10) return 'text-green-600';
    if (improvement > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No analytics data available</p>
          <Button onClick={fetchAnalyticsData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your learning journey</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={fetchAnalyticsData} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{analyticsData.overview.totalQuizzes}</div>
            <div className="text-xs text-gray-600">Total Quizzes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{analyticsData.overview.averageScore}%</div>
            <div className="text-xs text-gray-600">Avg Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{formatTime(analyticsData.overview.totalStudyTime)}</div>
            <div className="text-xs text-gray-600">Study Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{analyticsData.overview.streakDays}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">+{analyticsData.overview.improvementRate}%</div>
            <div className="text-xs text-gray-600">Improvement</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">#{analyticsData.overview.rank}</div>
            <div className="text-xs text-gray-600">Rank</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="predictions">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performance.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-600">{trend.date}</div>
                      <Badge variant="outline">{trend.subject}</Badge>
                      <Badge className={`${trend.score >= 80 ? 'bg-green-100 text-green-800' : 
                                       trend.score >= 70 ? 'bg-blue-100 text-blue-800' : 
                                       'bg-orange-100 text-orange-800'}`}>
                        {trend.score}%
                      </Badge>
                    </div>
                    <Badge variant="outline">{trend.difficulty}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>Strong Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.performance.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{area.topic}</div>
                        <div className="text-sm text-gray-600">{area.subject}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">{area.successRate}%</div>
                        <div className="text-xs text-gray-500">{area.attempts} attempts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Areas to Improve</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.performance.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{area.topic}</div>
                        <div className="text-sm text-gray-600">{area.subject}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-600 font-bold">{area.errorRate}% errors</div>
                        <div className="text-xs text-gray-500">{area.attempts} attempts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.performance.subjects.map((subject) => (
              <Card key={subject.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <Badge className={`${subject.averageScore >= 80 ? 'bg-green-100 text-green-800' : 
                                     subject.averageScore >= 70 ? 'bg-blue-100 text-blue-800' : 
                                     'bg-orange-100 text-orange-800'}`}>
                      {subject.averageScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Quizzes</div>
                      <div className="font-semibold">{subject.quizCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Time Spent</div>
                      <div className="font-semibold">{formatTime(subject.timeSpent)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Difficulty</div>
                      <div className="font-semibold">{subject.difficulty}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Last Activity</div>
                      <div className="font-semibold">{subject.lastActivity}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Improvement</span>
                    <div className={`flex items-center space-x-1 ${getImprovementColor(subject.improvement)}`}>
                      {getImprovementIcon(subject.improvement)}
                      <span className="font-semibold">{Math.abs(subject.improvement)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          {/* Weekly Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.timeAnalysis.weeklyPattern.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{day.quizzes} quizzes</span>
                          <span>{day.studyTime}min</span>
                        </div>
                        <Progress value={(day.quizzes / 10) * 100} className="h-2" />
                      </div>
                      <div className="text-sm font-semibold w-12 text-right">
                        {day.averageScore}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.timeAnalysis.monthlyProgress.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{month.month}</div>
                      <Badge variant="outline">{month.quizzes} quizzes</Badge>
                      <Badge className={`${month.averageScore >= 80 ? 'bg-green-100 text-green-800' : 
                                       month.averageScore >= 70 ? 'bg-blue-100 text-blue-800' : 
                                       'bg-orange-100 text-orange-800'}`}>
                        {month.averageScore}%
                      </Badge>
                    </div>
                    <div className={`flex items-center space-x-1 ${getImprovementColor(month.improvement)}`}>
                      {getImprovementIcon(month.improvement)}
                      <span className="font-semibold">{Math.abs(month.improvement)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Current Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.goals.current.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{goal.title}</span>
                        <Badge className={`${goal.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                         goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-green-100 text-green-800'}`}>
                          {goal.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Due: {goal.deadline}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={(goal.progress / goal.target) * 100} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{goal.progress}/{goal.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.goals.completed.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">{goal.title}</div>
                        <div className="text-sm text-gray-600">{goal.achievement}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {goal.completedDate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Exam Readiness</div>
                  <div className="text-2xl font-bold text-blue-800">{analyticsData.predictions.examReadiness}%</div>
                  <div className="text-sm text-blue-600">You're on track for success!</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Recommended Study Time</div>
                  <div className="text-2xl font-bold text-purple-800">{analyticsData.predictions.recommendedStudyTime}min/day</div>
                  <div className="text-sm text-purple-600">Optimal for your goals</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Strongest Subject</div>
                  <div className="text-2xl font-bold text-green-800">{analyticsData.predictions.strongestSubject}</div>
                  <div className="text-sm text-green-600">Keep up the great work!</div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Focus Area</div>
                  <div className="text-2xl font-bold text-orange-800">{analyticsData.predictions.weakestSubject}</div>
                  <div className="text-sm text-orange-600">Needs more attention</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Next Milestone</span>
                </div>
                <p className="text-gray-700">{analyticsData.predictions.nextMilestone}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}