import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calculator,
  Atom,
  Globe,
  BookOpen,
  Palette,
  Music,
  Code,
  Heart,
  Clock,
  Users,
  Star,
  Trophy,
  Sparkles,
  Lock,
  Crown,
  Target,
  Zap,
  Brain,
} from "lucide-react";
import { getSubjects } from "@/api/quiz";
import { useToast } from "@/hooks/useToast";

const subjectIcons: { [key: string]: any } = {
  Mathematics: Calculator,
  Science: Atom,
  History: Globe,
  Literature: BookOpen,
  Art: Palette,
  Music: Music,
  Programming: Code,
  Biology: Heart,
};

const difficultyConfig = {
  Beginner: {
    color: "from-green-400 to-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
    icon: Target,
    description: "Perfect for building strong foundations",
  },
  Intermediate: {
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-green-700",
    icon: Brain,
    description: "Challenge yourself with moderate complexity",
  },
  Advanced: {
    color: "from-red-400 to-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
    icon: Zap,
    description: "Push your limits with expert-level questions",
  },
};

const questionCountOptions = [
  {
    count: 10,
    label: "10 Questions",
    free: true,
    description: "Quick practice session",
  },
  {
    count: 20,
    label: "20 Questions",
    free: false,
    description: "Comprehensive review",
  },
  {
    count: 30,
    label: "30 Questions",
    free: false,
    description: "Full exam simulation",
  },
];

export function QuizSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<string>("Intermediate");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  // Check if user has premium subscription
  const isPremium = user?.plan === "premium";

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSubjects();

        setSubjects(data || []);
      } catch (error: any) {
        // Error handled by toast notification

        setError(error.message || "Failed to fetch subjects");
        toast({
          title: "Error",
          description: error.message || "Failed to fetch subjects",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [toast]);

  const handleStartQuiz = () => {
    if (!selectedSubject) {
      toast({
        title: "Please select a subject",
        description: "Choose a subject before starting the quiz",
        variant: "destructive",
      });
      return;
    }

    // Check if user is trying to access premium features
    if (questionCount > 10 && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium for quizzes with 20+ questions",
        variant: "destructive",
      });
      return;
    }

    try {
      // Starting quiz with selected parameters

      // Navigate to quiz taking page
      navigate(
        `/app/quiz/${selectedSubject.name.toLowerCase()}/${difficulty.toLowerCase()}`
      );
    } catch (error: any) {
      // Error handled by toast notification

      toast({
        title: "Error",
        description: error.message || "Failed to start quiz",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading Quiz Selection...
          </h1>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">
            Error Loading Quizzes
          </h1>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!subjects || subjects.length === 0) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-600">
            No Quizzes Available
          </h1>
          <p className="text-lg text-gray-500 mb-4">
            There are currently no quiz subjects available.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Quiz
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select a subject and difficulty level to start your learning journey
        </p>
      </div>

      {/* Subject Selection */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
            Select Subject
          </CardTitle>
          <CardDescription>
            Choose from our wide range of subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const Icon = subjectIcons[subject.name] || BookOpen;
              const isSelected = selectedSubject?.id === subject.id;

              return (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-purple-600"
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="flex justify-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {subject.avgTime} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {subject.questionCount || 0} questions
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subject.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Selection */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Select Difficulty
          </CardTitle>
          <CardDescription>Choose your challenge level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyLevels.map((level) => {
              const config =
                difficultyConfig[level as keyof typeof difficultyConfig];
              const isSelected = difficulty === level;

              return (
                <Card
                  key={level}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected
                      ? "ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setDifficulty(level)}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r ${config.color}`}
                    >
                      <config.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{level}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {config.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Question Count Selection */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-purple-500" />
            Select Question Count
          </CardTitle>
          <CardDescription>Choose the number of questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questionCountOptions.map((option) => {
              const isSelected = questionCount === option.count;

              return (
                <Card
                  key={option.count}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected
                      ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setQuestionCount(option.count)}
                >
                  <CardHeader className="text-center">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-500 to-pink-600"
                            : "bg-gradient-to-r from-gray-400 to-gray-500"
                        }`}
                      >
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      {!option.free && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs px-2 py-1">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{option.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>
                    {!option.free && !isPremium && (
                      <Badge
                        variant="outline"
                        className="mt-2 text-xs text-purple-600 border-purple-300"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Upgrade Required
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Preview */}
      {selectedSubject && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Start?</CardTitle>
            <CardDescription className="text-blue-100">
              {selectedSubject.name} • {difficulty} Level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {questionCount <= 10
                      ? "15-20"
                      : questionCount <= 20
                      ? "25-35"
                      : "40-50"}{" "}
                    minutes
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {questionCount} questions
                  </span>
                  {questionCount > 10 && (
                    <span className="flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-blue-100">
                  Test your knowledge and track your progress
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8"
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
