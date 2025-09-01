import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { getSubjects, selectQuizSubject, generateAIQuiz } from "@/api/quiz";
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

const difficultyColors = {
  Beginner: "from-green-400 to-green-500",
  Intermediate: "from-yellow-400 to-orange-500",
  Advanced: "from-red-400 to-red-500",
};

export function QuizSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<string>("Intermediate");
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        console.log("Fetching available subjects...");
        const data = await getSubjects();
        console.log("Subjects fetched successfully:", data.subjects.length);
        setSubjects(data.subjects);
      } catch (error: any) {
        console.error("Error fetching subjects:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [toast]);

  const handleStartQuiz = async () => {
    if (!selectedSubject) {
      toast({
        title: "Please select a subject",
        description: "Choose a subject before starting the quiz",
        variant: "destructive",
      });
      return;
    }

    setSelecting(true);
    try {
      console.log(`Selecting quiz: ${selectedSubject.name} - ${difficulty}`);

      const selectionResult = await selectQuizSubject(selectedSubject.id, {
        difficulty: difficulty,
        questionCount: 10,
      });

      console.log("Quiz selected successfully:", selectionResult);

      toast({
        title: "Quiz Ready!",
        description: `${selectionResult.subject} quiz with ${selectionResult.questionCount} questions is ready`,
      });

      // Navigate to quiz taking page with the quiz ID
      navigate(
        `/app/quiz/${selectedSubject.name.toLowerCase()}/${difficulty.toLowerCase()}`
      );
    } catch (error: any) {
      console.error("Error selecting quiz:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSelecting(false);
    }
  };

  const handleStartAIQuiz = async () => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    try {
      setGeneratingAI(true);
      const result = await generateAIQuiz({
        subject: selectedSubject.name,
        difficulty: difficulty.toLowerCase(),
      });
      
      if (result && result.quiz && result.quiz.id) {
        navigate(`/app/quiz/${selectedSubject.name.toLowerCase()}/${difficulty.toLowerCase()}?quizId=${result.quiz.id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate quiz questions",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error generating AI quiz:", error);
      let errorMessage = "Failed to generate quiz questions";
      
      // Check for specific error messages
      if (error?.message?.includes("402") || error?.message?.includes("payment required")) {
        errorMessage = "AI service credits exhausted. Please try again later.";
      } else if (error?.message?.includes("Daily quiz limit")) {
        errorMessage = "Daily quiz limit reached. Upgrade to premium for unlimited quizzes.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                        {subject.totalQuizzes} quizzes
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
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r ${
                        difficultyColors[level as keyof typeof difficultyColors]
                      }`}
                    >
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{level}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {level === "Beginner" && "Perfect for getting started"}
                      {level === "Intermediate" && "Test your knowledge"}
                      {level === "Advanced" && "Challenge yourself"}
                    </p>
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
                    15-20 minutes
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    10 questions
                  </span>
                </div>
                <p className="text-blue-100">
                  Test your knowledge and track your progress
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  disabled={selecting || generatingAI}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8"
                >
                  {selecting ? "Preparing Quiz..." : "Start Quiz"}
                </Button>
                <Button
                  onClick={handleStartAIQuiz}
                  size="lg"
                  disabled={selecting || generatingAI}
                  className="bg-purple-100 text-purple-600 hover:bg-purple-200 px-8 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {generatingAI ? "Generating..." : "AI Quiz"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
