import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  PlayIcon,
  StarIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HeartIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CrownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = async () => {
    setIsLoading(true);
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
    setIsLoading(false);
  };

  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Learning",
      description:
        "Meet Kingsley & Rita, your personal AI teachers who adapt to your learning style and pace.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      highlight: "Personalized",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: AcademicCapIcon,
      title: "WAEC, NECO & JAMB Prep",
      description:
        "Comprehensive preparation materials for all major Nigerian exams with past questions and solutions.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      highlight: "Comprehensive",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: BookOpenIcon,
      title: "Rich Study Materials",
      description:
        "Access thousands of notes, summaries, and practice materials for JS1-SS3 curriculum.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      highlight: "Extensive",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: ChartBarIcon,
      title: "Progress Tracking",
      description:
        "Monitor your learning progress with detailed analytics and personalized recommendations.",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      highlight: "Smart",
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  const examTypes = [
    {
      name: "WAEC",
      description: "West African Examinations Council",
      students: "2M+",
      color: "from-blue-500 to-blue-600",
      icon: "🎓",
      bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
    },
    {
      name: "NECO",
      description: "National Examinations Council",
      students: "1.5M+",
      color: "from-green-500 to-green-600",
      icon: "📚",
      bgGradient: "bg-gradient-to-br from-green-50 to-emerald-100",
    },
    {
      name: "JAMB",
      description: "Joint Admissions and Matriculation Board",
      students: "1.8M+",
      color: "from-purple-500 to-purple-600",
      icon: "🎯",
      bgGradient: "bg-gradient-to-br from-purple-50 to-violet-100",
    },
  ];

  const pricingFeatures = {
    free: [
      "3 quizzes per day",
      "Basic study notes",
      "5 AI questions per day",
      "Basic progress tracking",
      "Community support",
    ],
    premium: [
      "Unlimited quizzes",
      "All study notes & topics",
      "Unlimited AI chat",
      "Advanced analytics",
      "Priority support",
      "Custom study plans",
      "Offline access",
      "Achievement badges",
    ],
  };

  const testimonials = [
    {
      name: "Chioma Okechukwu",
      level: "SS3 Student",
      exam: "WAEC",
      text: "EduQuest helped me improve my Physics score from C6 to A1! The AI teacher Kingsley was so patient with me.",
      avatar: "👩‍🎓",
      rating: 5,
    },
    {
      name: "Adebayo Adeyemi",
      level: "SS2 Student",
      exam: "JAMB Prep",
      text: "The practice questions are exactly like the real exam. I feel so much more confident now!",
      avatar: "👨‍🎓",
      rating: 5,
    },
    {
      name: "Fatima Hassan",
      level: "JS3 Student",
      exam: "NECO",
      text: "Rita is the best! She explains difficult Math concepts in a way I actually understand.",
      avatar: "👩‍🎓",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
              <AcademicCapIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              EduQuest
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 px-6 py-2">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-white/20 backdrop-blur-sm text-white border border-white/30 animate-pulse px-6 py-3 text-lg">
              🇳🇬 Made for Nigerian Students
            </Badge>

            <h1
              className={cn(
                "text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight transition-all duration-1000 drop-shadow-2xl",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              Ace Your Exams with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 block mt-4">
                AI-Powered Learning
              </span>
            </h1>

            <p
              className={cn(
                "text-xl sm:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-300 drop-shadow-lg",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              Join thousands of Nigerian students preparing for WAEC, NECO, and
              JAMB with personalized AI tutors, comprehensive study materials,
              and smart practice quizzes.
            </p>

            <div
              className={cn(
                "flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-500",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-5 text-xl font-bold rounded-2xl min-w-[250px] shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border-0"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Loading...
                  </div>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-6 h-6 mr-3" />
                    Start Learning Free
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/app/quiz")}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl font-bold rounded-2xl min-w-[250px] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <PlayIcon className="w-6 h-6 mr-3" />
                Try Demo Quiz
              </Button>
            </div>

            {/* Interactive Demo Preview */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                    See EduQuest in Action
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Experience our AI-powered quiz system
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-4xl mb-3">📚</div>
                    <div className="font-bold text-white text-lg mb-2">
                      Choose Subject
                    </div>
                    <div className="text-blue-100">Math, English, Physics</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-4xl mb-3">🤖</div>
                    <div className="font-bold text-white text-lg mb-2">
                      AI Generates Quiz
                    </div>
                    <div className="text-blue-100">Personalized questions</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-4xl mb-3">📊</div>
                    <div className="font-bold text-white text-lg mb-2">
                      Get Results
                    </div>
                    <div className="text-blue-100">Detailed analytics</div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => navigate("/app/quiz")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Start Demo Quiz
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 text-center">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-bold text-blue-300 drop-shadow-lg">
                  50k+
                </div>
                <div className="text-blue-100">Practice Questions</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-bold text-indigo-300 drop-shadow-lg">
                  15k+
                </div>
                <div className="text-blue-100">Students Helped</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-bold text-purple-300 drop-shadow-lg">
                  95%
                </div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Teachers Preview Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Meet Your AI Teachers
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Choose between Kingsley and Rita - each with their unique teaching
              style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/25">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    👨‍🏫
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                    Kingsley
                  </h3>
                  <p className="text-blue-100 text-lg mb-6">
                    Encouraging & Supportive
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Patient explanations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Step-by-step guidance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Motivational support</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-indigo-500/25">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    👩‍🏫
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                    Rita
                  </h3>
                  <p className="text-blue-100 text-lg mb-6">
                    Direct & Challenging
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Quick problem-solving</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Advanced concepts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Performance focus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Prepare for All Major Nigerian Exams
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive preparation materials tailored for each exam type
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examTypes.map((exam, index) => (
              <div
                key={exam.name}
                className="group transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                <div
                  className={`${exam.bgGradient} backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-xl transition-all duration-300`}
                >
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${exam.color} rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {exam.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {exam.name}
                    </h3>
                    <p className="text-gray-700 mb-4">{exam.description}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {exam.students}
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Students annually
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Start Preparing
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Why Students Choose EduQuest
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Advanced learning tools designed specifically for Nigerian
              curriculum and exam requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "group transform hover:scale-105 transition-all duration-300",
                  currentFeature === index && "ring-2 ring-blue-400 shadow-2xl"
                )}
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <div
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-lg",
                        feature.bgColor
                      )}
                    >
                      <feature.icon className={cn("w-8 h-8", feature.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-3 py-1">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                        {feature.title}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Choose Your Plan
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Start free and upgrade when you're ready for unlimited access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-3">Free</h3>
                <div className="text-4xl font-bold text-white mb-2">₦0</div>
                <p className="text-blue-100 mb-8">
                  Perfect for getting started
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {pricingFeatures.free.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 py-4 text-lg font-semibold"
                onClick={handleGetStarted}
              >
                Start Free
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border-2 border-blue-400/50 rounded-3xl p-8 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm font-bold border-0">
                  Most Popular
                </Badge>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-3">Premium</h3>
                <div className="text-4xl font-bold text-blue-300 mb-2">
                  ₦2,500
                </div>
                <p className="text-blue-100 mb-8">
                  Unlimited access to everything
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {pricingFeatures.premium.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 py-4 text-lg font-semibold"
                onClick={() => navigate("/app/upgrade")}
              >
                <TrophyIcon className="w-5 h-5 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
              What Students Say
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real feedback from Nigerian students using EduQuest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-5xl mb-6">{testimonial.avatar}</div>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-blue-100 mb-4">
                    {testimonial.level} • {testimonial.exam}
                  </p>
                </div>
                <p className="text-white/90 italic text-center leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-indigo-700/50"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 drop-shadow-2xl">
            Ready to Boost Your Exam Scores?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful students who achieved their academic
            goals with EduQuest
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 border-0"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  Loading...
                </div>
              ) : (
                <>
                  <RocketLaunchIcon className="w-6 h-6 mr-3" />
                  Start Your Journey
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <LightBulbIcon className="w-6 h-6 mr-3" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md text-gray-300 px-4 py-16 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">EduQuest</h3>
          </div>

          <p className="text-gray-400 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Empowering Nigerian students to achieve academic excellence through
            innovative AI-powered learning solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
            <Link
              to="/about"
              className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
            >
              Contact
            </Link>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2024 EduQuest. Made with{" "}
            <HeartIcon className="w-4 h-4 inline text-red-500 animate-pulse" />{" "}
            for Nigerian students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
