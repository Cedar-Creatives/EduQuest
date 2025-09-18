import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  GraduationCap,
  Target,
  BookOpen,
  Clock,
  Trophy,
  Sparkles,
  Heart,
  Star,
  Zap,
  Brain,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    age: string;
    state: string;
  };
  academicLevel: {
    currentClass: string;
    school: string;
    examGoals: string[];
  };
  learningGoals: {
    primaryGoal: string;
    subjects: string[];
    weakAreas: string[];
  };
  studyPreferences: {
    studyTime: string;
    difficultyLevel: string;
    learningStyle: string;
  };
  schedule: {
    availableDays: string[];
    preferredTime: string;
    sessionDuration: string;
  };
  motivation: {
    motivationType: string;
    targetScore: string;
    timeline: string;
  };
  aiPersonalization: {
    teacherPreference: string;
    communicationStyle: string;
    reminderFrequency: string;
  };
}

const initialData: OnboardingData = {
  personalInfo: { firstName: "", lastName: "", age: "", state: "" },
  academicLevel: { currentClass: "", school: "", examGoals: [] },
  learningGoals: { primaryGoal: "", subjects: [], weakAreas: [] },
  studyPreferences: { studyTime: "", difficultyLevel: "", learningStyle: "" },
  schedule: { availableDays: [], preferredTime: "", sessionDuration: "" },
  motivation: { motivationType: "", targetScore: "", timeline: "" },
  aiPersonalization: {
    teacherPreference: "",
    communicationStyle: "",
    reminderFrequency: "",
  },
};

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const academicLevels = [
  "JSS1",
  "JSS2",
  "JSS3",
  "SS1",
  "SS2",
  "SS3",
  "Post-Secondary",
];
const examGoals = ["WAEC", "NECO", "JAMB", "POST-UTME", "NABTEB", "GCE"];
const coreSubjects = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Government",
  "Economics",
  "Literature",
  "Geography",
  "History",
  "Agricultural Science",
  "Commerce",
  "Accounting",
  "Computer Studies",
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (section: keyof OnboardingData, updates: any) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  const toggleArrayItem = (
    section: keyof OnboardingData,
    field: string,
    item: string
  ) => {
    setData((prev) => {
      const currentArray = (prev[section] as any)[field] || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i: string) => i !== item)
        : [...currentArray, item];

      return {
        ...prev,
        [section]: { ...prev[section], [field]: newArray },
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Save onboarding data to user profile
      await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({
          onboardingData: data,
          onboardingCompleted: true,
          plan: "freemium", // Start with freemium plan
        }),
      });

      toast({
        title: "Welcome to EduQuest! 🎉",
        description:
          "Your learning journey starts now. Let's achieve your goals together!",
      });

      navigate("/app");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-blue-500 to-success-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Tell us about yourself
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Let's get to know you better so we can personalize your learning
                experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={data.personalInfo.firstName}
                    onChange={(e) =>
                      updateData("personalInfo", { firstName: e.target.value })
                    }
                    placeholder="Enter your first name"
                    className="h-12 text-base border-gray-300 focus:border-primary-blue-500 focus:ring-primary-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={data.personalInfo.lastName}
                    onChange={(e) =>
                      updateData("personalInfo", { lastName: e.target.value })
                    }
                    placeholder="Enter your last name"
                    className="h-12 text-base border-gray-300 focus:border-primary-blue-500 focus:ring-primary-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="text-sm font-medium text-gray-700"
                  >
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={data.personalInfo.age}
                    onChange={(e) =>
                      updateData("personalInfo", { age: e.target.value })
                    }
                    placeholder="Your age"
                    className="h-12 text-base border-gray-300 focus:border-primary-blue-500 focus:ring-primary-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-sm font-medium text-gray-700"
                  >
                    State of Origin
                  </Label>
                  <select
                    id="state"
                    value={data.personalInfo.state}
                    onChange={(e) =>
                      updateData("personalInfo", { state: e.target.value })
                    }
                    className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent text-base"
                  >
                    <option value="">Select your state</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        );

      case 2:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-success-green-500 to-primary-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Academic Information
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Help us understand your current academic level and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="currentClass"
                  className="text-sm font-medium text-gray-700"
                >
                  Current Class/Level
                </Label>
                <select
                  id="currentClass"
                  value={data.academicLevel.currentClass}
                  onChange={(e) =>
                    updateData("academicLevel", {
                      currentClass: e.target.value,
                    })
                  }
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent text-base"
                >
                  <option value="">Select your class</option>
                  {academicLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="school"
                  className="text-sm font-medium text-gray-700"
                >
                  School Name (Optional)
                </Label>
                <Input
                  id="school"
                  value={data.academicLevel.school}
                  onChange={(e) =>
                    updateData("academicLevel", { school: e.target.value })
                  }
                  placeholder="Enter your school name"
                  className="h-12 text-base border-gray-300 focus:border-primary-blue-500 focus:ring-primary-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Exam Goals (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {examGoals.map((exam) => (
                    <Button
                      key={exam}
                      variant={
                        data.academicLevel.examGoals.includes(exam)
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        toggleArrayItem("academicLevel", "examGoals", exam)
                      }
                      className={cn(
                        "h-12 transition-all duration-200",
                        data.academicLevel.examGoals.includes(exam)
                          ? "bg-primary-blue-600 hover:bg-primary-blue-700 shadow-lg"
                          : "border-gray-300 hover:border-primary-blue-300 hover:bg-primary-blue-50"
                      )}
                    >
                      {exam}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        );

      case 3:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Learning Goals
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                What do you want to achieve with EduQuest?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Primary Learning Goal
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Improve grades",
                    "Exam preparation",
                    "Build confidence",
                    "Master difficult subjects",
                    "General knowledge",
                    "Competitive exams",
                  ].map((goal) => (
                    <Button
                      key={goal}
                      variant={
                        data.learningGoals.primaryGoal === goal
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("learningGoals", { primaryGoal: goal })
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.learningGoals.primaryGoal === goal
                          ? "bg-success-green-600 hover:bg-success-green-700 shadow-lg"
                          : "border-gray-300 hover:border-success-green-300 hover:bg-success-green-50"
                      )}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Subjects of Interest
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {coreSubjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={
                        data.learningGoals.subjects.includes(subject)
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        toggleArrayItem("learningGoals", "subjects", subject)
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.learningGoals.subjects.includes(subject)
                          ? "bg-primary-blue-600 hover:bg-primary-blue-700 shadow-lg"
                          : "border-gray-300 hover:border-primary-blue-300 hover:bg-primary-blue-50"
                      )}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Areas you find challenging (Optional)
                </Label>
                <Textarea
                  value={data.learningGoals.weakAreas.join(", ")}
                  onChange={(e) =>
                    updateData("learningGoals", {
                      weakAreas: e.target.value.split(", ").filter(Boolean),
                    })
                  }
                  placeholder="e.g., Algebra, Essay Writing, Chemical Equations..."
                  className="min-h-[100px] text-base border-gray-300 focus:border-primary-blue-500 focus:ring-primary-blue-500"
                />
              </div>
            </CardContent>
          </EnhancedCard>
        );

      case 4:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Study Preferences
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                How do you prefer to learn and study?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Preferred Study Time
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Early morning",
                    "Morning",
                    "Afternoon",
                    "Evening",
                    "Night",
                    "Flexible",
                  ].map((time) => (
                    <Button
                      key={time}
                      variant={
                        data.studyPreferences.studyTime === time
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("studyPreferences", { studyTime: time })
                      }
                      className={cn(
                        "h-12 transition-all duration-200",
                        data.studyPreferences.studyTime === time
                          ? "bg-success-green-600 hover:bg-success-green-700 shadow-lg"
                          : "border-gray-300 hover:border-success-green-300 hover:bg-success-green-50"
                      )}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Difficulty Level Preference
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Button
                      key={level}
                      variant={
                        data.studyPreferences.difficultyLevel === level
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("studyPreferences", {
                          difficultyLevel: level,
                        })
                      }
                      className={cn(
                        "h-12 transition-all duration-200",
                        data.studyPreferences.difficultyLevel === level
                          ? "bg-primary-blue-600 hover:bg-primary-blue-700 shadow-lg"
                          : "border-gray-300 hover:border-primary-blue-300 hover:bg-primary-blue-50"
                      )}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Learning Style
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Visual (diagrams, charts)",
                    "Text-based explanations",
                    "Step-by-step guidance",
                    "Practice-heavy approach",
                  ].map((style) => (
                    <Button
                      key={style}
                      variant={
                        data.studyPreferences.learningStyle === style
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("studyPreferences", { learningStyle: style })
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.studyPreferences.learningStyle === style
                          ? "bg-purple-600 hover:bg-purple-700 shadow-lg"
                          : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                      )}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        );

      case 5:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Study Schedule
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                When can you commit to studying? Let's create a realistic
                schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Available Days
                </Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <Button
                      key={day}
                      variant={
                        data.schedule.availableDays.includes(day)
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        toggleArrayItem("schedule", "availableDays", day)
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-xs",
                        data.schedule.availableDays.includes(day)
                          ? "bg-success-green-600 hover:bg-success-green-700 shadow-lg"
                          : "border-gray-300 hover:border-success-green-300 hover:bg-success-green-50"
                      )}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Preferred Time Slot
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "6:00 AM - 8:00 AM",
                    "8:00 AM - 12:00 PM",
                    "12:00 PM - 4:00 PM",
                    "4:00 PM - 8:00 PM",
                    "8:00 PM - 10:00 PM",
                    "Flexible timing",
                  ].map((slot) => (
                    <Button
                      key={slot}
                      variant={
                        data.schedule.preferredTime === slot
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("schedule", { preferredTime: slot })
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.schedule.preferredTime === slot
                          ? "bg-primary-blue-600 hover:bg-primary-blue-700 shadow-lg"
                          : "border-gray-300 hover:border-primary-blue-300 hover:bg-primary-blue-50"
                      )}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Study Session Duration
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {["15-30 minutes", "30-60 minutes", "1-2 hours"].map(
                    (duration) => (
                      <Button
                        key={duration}
                        variant={
                          data.schedule.sessionDuration === duration
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          updateData("schedule", { sessionDuration: duration })
                        }
                        className={cn(
                          "h-12 transition-all duration-200",
                          data.schedule.sessionDuration === duration
                            ? "bg-orange-600 hover:bg-orange-700 shadow-lg"
                            : "border-gray-300 hover:border-orange-300 hover:bg-orange-50"
                        )}
                      >
                        {duration}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        );

      case 6:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Motivation & Goals
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                What drives you to succeed? Let's understand your motivation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  What motivates you most?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Getting good grades",
                    "University admission",
                    "Making parents proud",
                    "Personal achievement",
                    "Career goals",
                    "Proving myself",
                  ].map((motivation) => (
                    <Button
                      key={motivation}
                      variant={
                        data.motivation.motivationType === motivation
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("motivation", { motivationType: motivation })
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.motivation.motivationType === motivation
                          ? "bg-yellow-600 hover:bg-yellow-700 shadow-lg"
                          : "border-gray-300 hover:border-yellow-300 hover:bg-yellow-50"
                      )}
                    >
                      {motivation}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Target Score/Grade (if applicable)
                </Label>
                <Input
                  value={data.motivation.targetScore}
                  onChange={(e) =>
                    updateData("motivation", { targetScore: e.target.value })
                  }
                  placeholder="e.g., A1 in Mathematics, 250+ in JAMB"
                  className="h-12 text-base border-gray-300 focus:border-primary-blue-500 focus:ring-primary-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Timeline for achieving your goal
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Next term",
                    "This academic year",
                    "Next academic year",
                    "In 2 years",
                    "Long-term goal",
                    "Continuous improvement",
                  ].map((timeline) => (
                    <Button
                      key={timeline}
                      variant={
                        data.motivation.timeline === timeline
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("motivation", { timeline: timeline })
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.motivation.timeline === timeline
                          ? "bg-success-green-600 hover:bg-success-green-700 shadow-lg"
                          : "border-gray-300 hover:border-success-green-300 hover:bg-success-green-50"
                      )}
                    >
                      {timeline}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        );

      case 7:
        return (
          <EnhancedCard
            variant="interactive"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl"
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Meet Your AI Teacher
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Choose your personal AI learning assistant - each with their
                unique teaching style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700 text-center block">
                  Choose Your AI Teacher
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className={cn(
                      "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105",
                      data.aiPersonalization.teacherPreference === "Kingsley"
                        ? "border-primary-blue-500 bg-primary-blue-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-primary-blue-300 hover:bg-primary-blue-25"
                    )}
                    onClick={() =>
                      updateData("aiPersonalization", {
                        teacherPreference: "Kingsley",
                      })
                    }
                  >
                    {data.aiPersonalization.teacherPreference ===
                      "Kingsley" && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                        👨‍🏫
                      </div>
                      <h3 className="text-xl font-bold text-primary-blue-600 mb-2">
                        Kingsley
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Encouraging & Supportive
                      </p>

                      <div className="space-y-2 text-left">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">
                            Patient explanations
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-700">
                            Step-by-step guidance
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">
                            Motivational support
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105",
                      data.aiPersonalization.teacherPreference === "Rita"
                        ? "border-success-green-500 bg-success-green-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-success-green-300 hover:bg-success-green-25"
                    )}
                    onClick={() =>
                      updateData("aiPersonalization", {
                        teacherPreference: "Rita",
                      })
                    }
                  >
                    {data.aiPersonalization.teacherPreference === "Rita" && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-success-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-success-green-500 to-success-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                        👩‍🏫
                      </div>
                      <h3 className="text-xl font-bold text-success-green-600 mb-2">
                        Rita
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Direct & Challenging
                      </p>

                      <div className="space-y-2 text-left">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-700">
                            Quick problem-solving
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-700">
                            Advanced concepts
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">
                            Performance focus
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Communication Style
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Formal & structured",
                    "Casual & friendly",
                    "Motivational",
                    "Straightforward",
                  ].map((style) => (
                    <Button
                      key={style}
                      variant={
                        data.aiPersonalization.communicationStyle === style
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("aiPersonalization", {
                          communicationStyle: style,
                        })
                      }
                      className={cn(
                        "h-12 transition-all duration-200 text-sm",
                        data.aiPersonalization.communicationStyle === style
                          ? "bg-purple-600 hover:bg-purple-700 shadow-lg"
                          : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                      )}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Reminder Frequency
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Daily", "Every few days", "Weekly", "None"].map((freq) => (
                    <Button
                      key={freq}
                      variant={
                        data.aiPersonalization.reminderFrequency === freq
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateData("aiPersonalization", {
                          reminderFrequency: freq,
                        })
                      }
                      className={cn(
                        "h-12 transition-all duration-200",
                        data.aiPersonalization.reminderFrequency === freq
                          ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                          : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                      )}
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-success-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-blue-600 to-success-green-600 bg-clip-text text-transparent mb-4">
            Welcome to EduQuest! 🎓
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Let's personalize your learning experience
          </p>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress
              value={progress}
              className="h-3"
              indicatorClassName="bg-gradient-to-r from-primary-blue-500 to-success-green-500"
            />

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    i + 1 === currentStep
                      ? "bg-primary-blue-600 scale-125"
                      : i + 1 < currentStep
                      ? "bg-success-green-500"
                      : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center space-x-2 w-full sm:w-auto h-12 px-6 border-gray-300 hover:border-primary-blue-300 hover:bg-primary-blue-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={completeOnboarding}
              disabled={loading}
              className="bg-gradient-to-r from-success-green-600 to-success-green-700 hover:from-success-green-700 hover:to-success-green-800 flex items-center space-x-2 w-full sm:w-auto h-12 px-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Completing Setup...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Setup</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 hover:from-primary-blue-700 hover:to-primary-blue-800 flex items-center space-x-2 w-full sm:w-auto h-12 px-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
