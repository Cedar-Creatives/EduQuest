
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Zap,
  Star,
  Trophy,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface ProgressData {
  overall: {
    totalQuizzes: number;
    averageScore: number;
    studyStreak: number;
    totalStudyTime: number;
  };
  subjects: Array<{
    name: string;
    quizzesTaken: number;
    averageScore: number;
    improvement: number;
    lastTaken: string;
  }>;
  weekly: Array<{
    day: string;
    quizzes: number;
    avgScore: number;
    studyTime: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  streaks: {
    current: number;
    longest: number;
    weeklyGoal: number;
    monthlyGoal: number;
  };
  insights: {
    strongestSubject: string;
    weakestSubject: string;
    bestTimeOfDay: string;
    recommendedFocus: string[];
  };
}

export function ProgressTracker() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      if (!user) {
        console.log('No user found, skipping progress fetch');
        return;
      }

      const token = await user.getIdToken().catch(err => {
        console.error('Failed to get ID token:', err);
        return null;
      });

      if (!token) {
        console.error('No auth token available');
        return;
      }

      const response = await fetch('/api/dashboard/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      } else {
        console.error('Progress API error:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Progress
        </h1>
        <Button 
          onClick={fetchProgressData}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Activity className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Quizzes</p>
                <p className="text-3xl font-bold">{progressData?.overall.totalQuizzes || 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Average Score</p>
                <p className="text-3xl font-bold">{progressData?.overall.averageScore || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Study Streak</p>
                <p className="text-3xl font-bold">{progressData?.streaks.current || 0} days</p>
              </div>
              <Zap className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Study Hours</p>
                <p className="text-3xl font-bold">{Math.round((progressData?.overall.totalStudyTime || 0) / 3600)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Subjects</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {progressData?.weekly?.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{day.day.slice(0, 3)}</div>
                    <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col justify-end p-2">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm"
                        style={{ height: `${(day.quizzes / 5) * 100}%`, minHeight: '4px' }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{day.quizzes}</div>
                  </div>
                )) || Array.from({length: 7}, (_, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">Day {i+1}</div>
                    <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="text-xs text-gray-600 mt-1">0</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Weekly Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Quizzes Completed</span>
                    <span>{progressData?.overall.totalQuizzes || 0} / {progressData?.streaks.weeklyGoal || 10}</span>
                  </div>
                  <Progress 
                    value={((progressData?.overall.totalQuizzes || 0) / (progressData?.streaks.weeklyGoal || 10)) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-gray-600">
                    {Math.max(0, (progressData?.streaks.weeklyGoal || 10) - (progressData?.overall.totalQuizzes || 0))} more to reach your goal!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600">
                      {progressData?.streaks.current || 0}
                    </div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Best: {progressData?.streaks.longest || 0} days</span>
                    <span>Goal: {progressData?.streaks.monthlyGoal || 30} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid gap-4">
            {progressData?.subjects?.map((subject, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <p className="text-sm text-gray-600">
                        {subject.quizzesTaken} quizzes • Last: {subject.lastTaken}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{subject.averageScore}%</div>
                      <Badge 
                        variant={subject.improvement > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{subject.averageScore}%</span>
                    </div>
                    <Progress value={subject.averageScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No subject data available yet</p>
                  <p className="text-sm text-gray-400">Complete some quizzes to see your progress!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressData?.achievements?.map((achievement, index) => (
              <Card 
                key={index} 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full flex items-center justify-center mx-auto`}>
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="text-xs">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg md:col-span-2 lg:col-span-3">
                <CardContent className="p-8 text-center">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements unlocked yet</p>
                  <p className="text-sm text-gray-400">Complete quizzes and reach milestones to earn achievements!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI-Powered Insights */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Personalized Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressData?.insights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-600 mb-2">Strongest Subject</h4>
                    <p className="text-lg font-bold">{progressData.insights.strongestSubject}</p>
                    <p className="text-sm text-gray-600">Keep up the great work!</p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-600 mb-2">Focus Area</h4>
                    <p className="text-lg font-bold">{progressData.insights.weakestSubject}</p>
                    <p className="text-sm text-gray-600">Needs more attention</p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">Best Study Time</h4>
                    <p className="text-lg font-bold">{progressData.insights.bestTimeOfDay}</p>
                    <p className="text-sm text-gray-600">Peak performance window</p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-600 mb-2">Recommendations</h4>
                    <div className="space-y-1">
                      {progressData.insights.recommendedFocus.map((rec, i) => (
                        <Badge key={i} variant="outline" className="text-xs mr-1">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Complete more quizzes to unlock personalized insights!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'from-yellow-400 to-orange-500';
    case 'epic': return 'from-purple-400 to-pink-500';
    case 'rare': return 'from-blue-400 to-indigo-500';
    default: return 'from-gray-400 to-gray-500';
  }
};
