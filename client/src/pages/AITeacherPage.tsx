import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AITeacherSidebar } from "@/components/AITeacherSidebar";
import {
  MessageCircle,
  ArrowLeft,
  Brain,
  BookOpen,
  Lightbulb,
  Zap,
  Target,
  Trophy,
  Clock,
  Users,
  Star,
} from "lucide-react";

export function AITeacherPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Personalized Learning",
      description: "Get explanations tailored to your learning style and pace",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: BookOpen,
      title: "Subject Expertise",
      description:
        "Ask questions about any subject - math, science, literature, and more",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Lightbulb,
      title: "Step-by-Step Solutions",
      description: "Break down complex problems into manageable steps",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Zap,
      title: "Instant Help",
      description: "Get immediate answers to your questions 24/7",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Exam Preparation",
      description: "Practice questions and get tips for upcoming exams",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Monitor your learning progress and achievements",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Ask a Question",
      description: "Get help with any subject",
      action: () => setIsSidebarOpen(true),
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Study Tips",
      description: "Learn effective study strategies",
      action: () => setIsSidebarOpen(true),
      icon: Lightbulb,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Exam Help",
      description: "Prepare for upcoming exams",
      action: () => setIsSidebarOpen(true),
      icon: Target,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Teacher
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your personal learning assistant
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Start Chat</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Your AI Teacher
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Get instant help with any subject, personalized explanations, and
            step-by-step solutions. Your AI Teacher is available 24/7 to support
            your learning journey.
          </p>

          <div className="flex justify-center space-x-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Available 24/7
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Personalized Learning
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Expert Knowledge
            </Badge>
          </div>

          <Button
            onClick={() => setIsSidebarOpen(true)}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
          >
            <MessageCircle className="h-6 w-6 mr-2" />
            Start Learning Now
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What would you like to learn today?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-6 h-auto flex flex-col items-center space-y-2`}
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Teacher Sidebar */}
      <AITeacherSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
