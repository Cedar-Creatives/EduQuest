import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trophy,
  Star,
  Zap,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  Lock,
  Award,
  TrendingUp,
  Calendar,
  Brain,
  Crown,
  Flame,
  Lightbulb,
  Users,
  ArrowRight,
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'study' | 'performance' | 'consistency' | 'mastery' | 'social';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward?: {
    type: 'points' | 'badge' | 'feature';
    value: string | number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  compact?: boolean;
  showUnlockedOnly?: boolean;
}

export function AchievementSystem({ compact = false, showUnlockedOnly = false }: AchievementSystemProps) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // Simulate API call - replace with actual API
        const mockAchievements: Achievement[] = [
          {
            id: '1',
            title: 'First Steps',
            description: 'Complete your first quiz',
            icon: '🎯',
            category: 'study',
            unlocked: true,
            progress: 1,
            maxProgress: 1,
            reward: { type: 'points', value: 100 },
            rarity: 'common',
            unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: '2',
            title: 'Quiz Master',
            description: 'Complete 50 quizzes',
            icon: '🏆',
            category: 'study',
            unlocked: false,
            progress: 47,
            maxProgress: 50,
            reward: { type: 'badge', value: 'Quiz Master' },
            rarity: 'rare',
          },
          {
            id: '3',
            title: 'Streak Champion',
            description: 'Maintain 15-day study streak',
            icon: '🔥',
            category: 'consistency',
            unlocked: false,
            progress: 12,
            maxProgress: 15,
            reward: { type: 'points', value: 500 },
            rarity: 'epic',
          },
          {
            id: '4',
            title: 'Subject Expert',
            description: 'Achieve 90%+ in any subject',
            icon: '👑',
            category: 'performance',
            unlocked: true,
            progress: 100,
            maxProgress: 100,
            reward: { type: 'badge', value: 'Subject Expert' },
            rarity: 'rare',
            unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            id: '5',
            title: 'Time Warrior',
            description: 'Study for 50 hours total',
            icon: '⏰',
            category: 'consistency',
            unlocked: false,
            progress: 47,
            maxProgress: 50,
            reward: { type: 'points', value: 300 },
            rarity: 'common',
          },
          {
            id: '6',
            title: 'Consistency King',
            description: 'Study 7 days in a row',
            icon: '👑',
            category: 'consistency',
            unlocked: true,
            progress: 100,
            maxProgress: 100,
            reward: { type: 'badge', value: 'Consistency King' },
            rarity: 'common',
            unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            id: '7',
            title: 'Speed Demon',
            description: 'Complete 10 quizzes in one day',
            icon: '⚡',
            category: 'performance',
            unlocked: false,
            progress: 8,
            maxProgress: 10,
            reward: { type: 'points', value: 200 },
            rarity: 'epic',
          },
          {
            id: '8',
            title: 'Perfect Score',
            description: 'Get 100% on any quiz',
            icon: '💎',
            category: 'performance',
            unlocked: false,
            progress: 0,
            maxProgress: 1,
            reward: { type: 'badge', value: 'Perfect Score' },
            rarity: 'legendary',
          },
          {
            id: '9',
            title: 'Study Buddy',
            description: 'Share your progress with friends',
            icon: '🤝',
            category: 'social',
            unlocked: false,
            progress: 0,
            maxProgress: 1,
            reward: { type: 'feature', value: 'Social Features' },
            rarity: 'common',
          },
          {
            id: '10',
            title: 'Knowledge Seeker',
            description: 'Use AI teacher 50 times',
            icon: '🧠',
            category: 'study',
            unlocked: false,
            progress: 23,
            maxProgress: 50,
            reward: { type: 'points', value: 400 },
            rarity: 'rare',
          },
        ];

        setAchievements(mockAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'performance': return <Target className="w-4 h-4" />;
      case 'consistency': return <Calendar className="w-4 h-4" />;
      case 'mastery': return <Brain className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (showUnlockedOnly && !achievement.unlocked) return false;
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
            <Badge variant="secondary" className="ml-auto">
              {unlockedCount}/{totalCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-gray-800 dark:text-gray-200">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {filteredAchievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className={`p-3 rounded-lg border transition-all duration-200 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700' 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm truncate ${
                      achievement.unlocked 
                        ? 'text-gray-800 dark:text-gray-200' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {achievement.title}
                    </h4>
                    <div className="flex justify-between items-center mt-1">
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </Badge>
                      {achievement.unlocked ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="w-full">
            View All Achievements
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Achievements</h1>
                <p className="text-yellow-100">Track your learning milestones</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{unlockedCount}</div>
              <div className="text-yellow-100 text-sm">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalCount}</div>
              <div className="text-yellow-100 text-sm">Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{completionRate}%</div>
              <div className="text-yellow-100 text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('all')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Trophy className="w-4 h-4 mr-2" />
          All
        </Button>
        <Button
          variant={selectedCategory === 'study' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('study')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Study
        </Button>
        <Button
          variant={selectedCategory === 'performance' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('performance')}
        >
          <Target className="w-4 h-4 mr-2" />
          Performance
        </Button>
        <Button
          variant={selectedCategory === 'consistency' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('consistency')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Consistency
        </Button>
        <Button
          variant={selectedCategory === 'mastery' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('mastery')}
        >
          <Brain className="w-4 h-4 mr-2" />
          Mastery
        </Button>
        <Button
          variant={selectedCategory === 'social' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('social')}
        >
          <Users className="w-4 h-4 mr-2" />
          Social
        </Button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
            achievement.unlocked 
              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700' 
              : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${
                        achievement.unlocked 
                          ? 'text-gray-800 dark:text-gray-200' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    {achievement.reward && (
                      <div className="text-xs text-gray-500">
                        Reward: {achievement.reward.value}
                      </div>
                    )}
                  </div>

                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-gray-500">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Achievements Found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try selecting a different category or complete more activities to unlock achievements.</p>
        </div>
      )}
    </div>
  );
}
