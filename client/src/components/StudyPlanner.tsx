import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Star,
  Zap,
  Brain,
  Trophy,
  TrendingUp,
  Bell,
  Settings,
} from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  scheduledDate: Date;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'study' | 'practice' | 'review' | 'quiz';
  priority: 'low' | 'medium' | 'high';
}

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  totalSessions: number;
  completedSessions: number;
  subjects: string[];
  priority: 'low' | 'medium' | 'high';
}

interface StudyPlannerProps {
  userId?: string;
  examDate?: Date;
}

export function StudyPlanner({ userId, examDate }: StudyPlannerProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    subject: '',
    topic: '',
    duration: 30,
    difficulty: 'medium',
    type: 'study',
    priority: 'medium',
  });
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    title: '',
    description: '',
    totalSessions: 10,
    subjects: [],
    priority: 'medium',
  });

  useEffect(() => {
    loadStudyData();
  }, [userId]);

  const loadStudyData = () => {
    // Mock data for demonstration
    const mockSessions: StudySession[] = [
      {
        id: '1',
        subject: 'Mathematics',
        topic: 'Algebra Basics',
        duration: 45,
        scheduledDate: new Date(),
        completed: false,
        difficulty: 'medium',
        type: 'study',
        priority: 'high',
      },
      {
        id: '2',
        subject: 'English',
        topic: 'Grammar Review',
        duration: 30,
        scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
        completed: false,
        difficulty: 'easy',
        type: 'review',
        priority: 'medium',
      },
      {
        id: '3',
        subject: 'Physics',
        topic: 'Motion and Forces',
        duration: 60,
        scheduledDate: new Date(Date.now() - 86400000), // Yesterday
        completed: true,
        completedAt: new Date(Date.now() - 86400000),
        difficulty: 'hard',
        type: 'study',
        priority: 'high',
        notes: 'Completed all practice problems. Need more work on friction.',
      },
    ];

    const mockGoals: StudyGoal[] = [
      {
        id: '1',
        title: 'WAEC Preparation',
        description: 'Complete comprehensive review for WAEC examination',
        targetDate: new Date(Date.now() + 30 * 86400000), // 30 days from now
        progress: 65,
        totalSessions: 20,
        completedSessions: 13,
        subjects: ['Mathematics', 'English', 'Physics'],
        priority: 'high',
      },
      {
        id: '2',
        title: 'Mathematics Mastery',
        description: 'Achieve 90%+ average in Mathematics quizzes',
        targetDate: new Date(Date.now() + 14 * 86400000), // 14 days from now
        progress: 80,
        totalSessions: 10,
        completedSessions: 8,
        subjects: ['Mathematics'],
        priority: 'medium',
      },
    ];

    setSessions(mockSessions);
    setGoals(mockGoals);
  };

  const addSession = () => {
    if (!newSession.subject || !newSession.topic) return;

    const session: StudySession = {
      id: Date.now().toString(),
      subject: newSession.subject!,
      topic: newSession.topic!,
      duration: newSession.duration || 30,
      scheduledDate: selectedDate,
      completed: false,
      difficulty: newSession.difficulty || 'medium',
      type: newSession.type || 'study',
      priority: newSession.priority || 'medium',
    };

    setSessions([...sessions, session]);
    setNewSession({
      subject: '',
      topic: '',
      duration: 30,
      difficulty: 'medium',
      type: 'study',
      priority: 'medium',
    });
    setShowAddSession(false);
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.description) return;

    const goal: StudyGoal = {
      id: Date.now().toString(),
      title: newGoal.title!,
      description: newGoal.description!,
      targetDate: newGoal.targetDate || new Date(Date.now() + 30 * 86400000),
      progress: 0,
      totalSessions: newGoal.totalSessions || 10,
      completedSessions: 0,
      subjects: newGoal.subjects || [],
      priority: newGoal.priority || 'medium',
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      totalSessions: 10,
      subjects: [],
      priority: 'medium',
    });
    setShowAddGoal(false);
  };

  const completeSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, completed: true, completedAt: new Date() }
        : session
    ));
  };

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const getTodaySessions = () => {
    const today = new Date();
    return sessions.filter(session => 
      session.scheduledDate.toDateString() === today.toDateString()
    );
  };

  const getUpcomingSessions = () => {
    const today = new Date();
    return sessions.filter(session => 
      session.scheduledDate > today && !session.completed
    ).slice(0, 5);
  };

  const getWeeklyProgress = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekSessions = sessions.filter(session => 
      session.scheduledDate >= weekStart && session.scheduledDate <= new Date()
    );
    
    const completed = weekSessions.filter(session => session.completed).length;
    const total = weekSessions.length;
    
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'practice': return <Zap className="w-4 h-4" />;
      case 'review': return <TrendingUp className="w-4 h-4" />;
      case 'quiz': return <Brain className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const weeklyProgress = getWeeklyProgress();
  const todaySessions = getTodaySessions();
  const upcomingSessions = getUpcomingSessions();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold">{todaySessions.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Progress</p>
                <p className="text-2xl font-bold">{Math.round(weeklyProgress.percentage)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today's Study Plan</h2>
            <Button onClick={() => setShowAddSession(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </div>

          {todaySessions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No study sessions scheduled for today</p>
                <Button 
                  onClick={() => setShowAddSession(true)}
                  className="mt-4"
                  variant="outline"
                >
                  Schedule a Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(session.type)}
                          <div>
                            <h3 className="font-semibold">{session.topic}</h3>
                            <p className="text-sm text-gray-600">{session.subject}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(session.priority)}>
                          {session.priority}
                        </Badge>
                        <Badge variant="outline">
                          {session.duration}min
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {session.completed ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => completeSession(session.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSession(session.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
              <div className="space-y-2">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(session.type)}
                      <div>
                        <span className="font-medium">{session.topic}</span>
                        <span className="text-sm text-gray-600 ml-2">({session.subject})</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.scheduledDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Sessions for {selectedDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions
                    .filter(session => 
                      session.scheduledDate.toDateString() === selectedDate.toDateString()
                    )
                    .map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(session.type)}
                          <div>
                            <span className="font-medium">{session.topic}</span>
                            <span className="text-sm text-gray-600 block">{session.subject}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{session.duration}min</Badge>
                          {session.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  
                  {sessions.filter(session => 
                    session.scheduledDate.toDateString() === selectedDate.toDateString()
                  ).length === 0 && (
                    <p className="text-gray-600 text-center py-4">
                      No sessions scheduled for this date
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Study Goals</h2>
            <Button onClick={() => setShowAddGoal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.completedSessions}/{goal.totalSessions} sessions</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Target Date:</span>
                    <span className="font-medium">{goal.targetDate.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {goal.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Completed Sessions</span>
                    <span className="font-bold">{weeklyProgress.completed}/{weeklyProgress.total}</span>
                  </div>
                  <Progress value={weeklyProgress.percentage} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {Math.round(weeklyProgress.percentage)}% of planned sessions completed this week
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Mathematics', 'English', 'Physics'].map((subject) => {
                    const subjectSessions = sessions.filter(s => s.subject === subject && s.completed);
                    const totalTime = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
                    const percentage = sessions.length > 0 ? (totalTime / sessions.reduce((sum, s) => sum + s.duration, 0)) * 100 : 0;
                    
                    return (
                      <div key={subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject}</span>
                          <span>{totalTime}min ({Math.round(percentage)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Study Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newSession.subject || ''}
                  onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                  placeholder="e.g., Mathematics"
                />
              </div>
              
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={newSession.topic || ''}
                  onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                  placeholder="e.g., Algebra Basics"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newSession.duration || 30}
                  onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={addSession} className="flex-1">
                  Add Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddSession(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Study Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goalTitle">Title</Label>
                <Input
                  id="goalTitle"
                  value={newGoal.title || ''}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., WAEC Preparation"
                />
              </div>
              
              <div>
                <Label htmlFor="goalDescription">Description</Label>
                <Textarea
                  id="goalDescription"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Describe your goal..."
                />
              </div>
              
              <div>
                <Label htmlFor="totalSessions">Total Sessions</Label>
                <Input
                  id="totalSessions"
                  type="number"
                  value={newGoal.totalSessions || 10}
                  onChange={(e) => setNewGoal({...newGoal, totalSessions: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={addGoal} className="flex-1">
                  Add Goal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}