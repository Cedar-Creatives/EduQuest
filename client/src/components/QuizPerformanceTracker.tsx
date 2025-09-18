import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Brain,
  Award,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Star,
  Trophy,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';

interface QuizPerformanceData {
  overall: {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    totalTimeSpent: number;
    averageTimePerQuiz: number;
    improvementRate: number;
    consistencyScore: number;
  };
  subjects: Array<{
    name: string;
    quizzesTaken: number;
    averageScore: number;
    bestScore: number;
    improvement: number;
    timeSpent: number;
    difficulty: string;
    lastTaken: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  trends: Array<{
    date: string;
    score: number;
    subject: string;
    timeTaken: number;
    difficulty: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    category: string;
  }>;
  recommendations: Array<{
    type: 'study' | 'practice' | 'review';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
  }>;
}

interface QuizPerformanceTrackerProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
  compact?: boolean;
}

export function QuizPerformanceTracker({ 
  userId, 
  timeRange = '30d', 
  compact = false 
}: QuizPerformanceTrackerProps) {
  const [performanceData, setPerformanceData] = useState<QuizPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    fetchPerformanceData();
  }, [userId, timeRange]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockData: QuizPerformanceData = {
        overall: {
          totalQuizzes: 24,
          averageScore: 78.5,
          bestScore: 95,
          worstScore: 45,
          totalTimeSpent: 7200, // 2 hours in seconds
          averageTimePerQuiz: 300, // 5 minutes
          improvementRate: 12.5, // 12.5% improvement
          consistencyScore: 85, // How consistent the scores are
        },
        subjects: [
          {
            name: 'Mathematics',
            quizzesTaken: 10,
            averageScore: 82,
            bestScore: 95,
            improvement: 15,
            timeSpent: 3000,
            difficulty: 'Intermediate',
            lastTaken: '2 days ago',
            strengths: ['Algebra', 'Basic Arithmetic'],
            weaknesses: ['Geometry', 'Word Problems'],
          },
          {
            name: 'English',
            quizzesTaken: 8,
            averageScore: 75,
            bestScore: 88,
            improvement: 8,
            timeSpent: 2400,
            difficulty: 'Basic',
            lastTaken: '1 day ago',
            strengths: ['Grammar', 'Vocabulary'],
            weaknesses: ['Reading Comprehension', 'Essay Writing'],
          },
          {
            name: 'Physics',
            quizzesTaken: 6,
            averageScore: 68,
            bestScore: 80,
            improvement: 5,
            timeSpent: 1800,
            difficulty: 'Advanced',
            lastTaken: '3 days ago',
            strengths: ['Mechanics'],
            weaknesses: ['Electricity', 'Thermodynamics'],
          },
        ],
        trends: [
          { date: '2024-01-15', score: 65, subject: 'Mathematics', timeTaken: 280, difficulty: 'Basic' },
          { date: '2024-01-16', score: 72, subject: 'English', timeTaken: 320, difficulty: 'Basic' },
          { date: '2024-01-17', score: 78, subject: 'Mathematics', timeTaken: 290, difficulty: 'Intermediate' },
          { date: '2024-01-18', score: 85, subject: 'Physics', timeTaken: 350, difficulty: 'Advanced' },
          { date: '2024-01-19', score: 82, subject: 'Mathematics', timeTaken: 275, difficulty: 'Intermediate' },
        ],
        achievements: [
          {
            id: '1',
            title: 'First Perfect Score',
            description: 'Scored 100% on a quiz',
            unlockedAt: '2024-01-15',
            category: 'performance',
          },
          {
            id: '2',
            title: 'Study Streak',
            description: 'Completed quizzes for 7 consecutive days',
            unlockedAt: '2024-01-18',
            category: 'consistency',
          },
        ],
        recommendations: [
          {
            type: 'study',
            title: 'Focus on Physics Fundamentals',
            description: 'Your Physics scores show room for improvement. Review basic concepts.',
            priority: 'high',
            estimatedTime: 45,
          },
          {
            type: 'practice',
            title: 'More English Reading Comprehension',
            description: 'Practice reading comprehension to boost your English scores.',
            priority: 'medium',
            estimatedTime: 30,
          },
        ],
      };

      setPerformanceData(mockData);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
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

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 5) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (improvement < -5) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
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

  if (!performanceData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No performance data available</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{performanceData.overall.averageScore}%</div>
            <div className="text-xs text-gray-600">Avg Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{performanceData.overall.totalQuizzes}</div>
            <div className="text-xs text-gray-600">Quizzes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">+{performanceData.overall.improvementRate}%</div>
            <div className="text-xs text-gray-600">Improvement</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{formatTime(performanceData.overall.totalTimeSpent)}</div>
            <div className="text-xs text-gray-600">Study Time</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Performance Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{performanceData.overall.averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{performanceData.overall.totalQuizzes}</div>
              <div className="text-sm text-gray-600">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">+{performanceData.overall.improvementRate}%</div>
              <div className="text-sm text-gray-600">Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{formatTime(performanceData.overall.totalTimeSpent)}</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Consistency Score</span>
                <span>{performanceData.overall.consistencyScore}%</span>
              </div>
              <Progress value={performanceData.overall.consistencyScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="recommendations">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.subjects.map((subject) => (
              <Card key={subject.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <Badge className={getScoreColor(subject.averageScore)}>
                      {subject.averageScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Quizzes taken:</span>
                    <span className="font-medium">{subject.quizzesTaken}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Best score:</span>
                    <span className="font-medium">{subject.bestScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Improvement:</span>
                    <div className="flex items-center space-x-1">
                      {getImprovementIcon(subject.improvement)}
                      <span className="font-medium">{Math.abs(subject.improvement)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Time spent:</span>
                    <span className="font-medium">{formatTime(subject.timeSpent)}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-600 mb-1">Strengths:</div>
                    <div className="flex flex-wrap gap-1">
                      {subject.strengths.map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {subject.weaknesses.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Areas to improve:</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.weaknesses.map((weakness, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-orange-600">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceData.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-600">{trend.date}</div>
                      <Badge variant="outline">{trend.subject}</Badge>
                      <Badge className={getScoreColor(trend.score)}>{trend.score}%</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(trend.timeTaken)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceData.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Trophy className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <div className="text-xs text-gray-500">
                        Unlocked on {achievement.unlockedAt}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-3">
            {performanceData.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-600" />
                        <h3 className="font-semibold">{rec.title}</h3>
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : 
                                  rec.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="text-xs text-gray-500">
                        Estimated time: {rec.estimatedTime} minutes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}