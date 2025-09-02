import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Send,
  MessageCircle,
  Brain,
  BookOpen,
  Target,
  Trophy,
} from "lucide-react";
import { chatWithAITeacher, checkAITeacherHealth } from "@/api/aiTeacher";

interface Message {
  id: string;
  text: string;
  sender: "user" | "teacher";
  timestamp: Date;
}

interface AITeacherSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AITeacherSidebar({ isOpen, onClose }: AITeacherSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check AI Teacher service health when component mounts
    checkAITeacherHealth()
      .then((health) => {
        setIsConnected(health.status === "ready");
        if (health.status === "ready") {
          // Send welcome message
          setMessages([
            {
              id: "1",
              text: "Hello! I'm your AI Teacher. I'm here to help you with any subject or question. What would you like to learn today?",
              sender: "teacher",
              timestamp: new Date(),
            },
          ]);
        } else {
          setError(
            "AI Teacher service is not available. Please try again later."
          );
        }
      })
      .catch((err) => {
        console.error("AI Teacher health check failed:", err);
        setError("Unable to connect to AI Teacher service.");
        setIsConnected(false);
      });
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim() || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await chatWithAITeacher({
        message: currentMessage,
        conversationHistory: messages.map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
        })),
      });

      if (response.success) {
        const teacherMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          sender: "teacher",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, teacherMessage]);
      } else {
        throw new Error(response.error || "Failed to get response");
      }
    } catch (err: any) {
      console.error("AI Teacher chat error:", err);
      setError(err.message || "Failed to get AI response");

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: "teacher",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI Teacher</h3>
              <p className="text-sm opacity-90">Your learning assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 mx-4 mt-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMessage("I need help with math")}
            className="flex items-center space-x-1 text-xs"
            disabled={!isConnected}
          >
            <BookOpen className="w-3 h-3" />
            <span>Math Help</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMessage("Give me study tips")}
            className="flex items-center space-x-1 text-xs"
            disabled={!isConnected}
          >
            <Brain className="w-3 h-3" />
            <span>Study Tips</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMessage("Help me prepare for exams")}
            className="flex items-center space-x-1 text-xs"
            disabled={!isConnected}
          >
            <Target className="w-3 h-3" />
            <span>Exam Prep</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMessage("Explain a concept step by step")}
            className="flex items-center space-x-1 text-xs"
            disabled={!isConnected}
          >
            <Trophy className="w-3 h-3" />
            <span>Step by Step</span>
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI Teacher anything..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isTyping || !isConnected}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Connection Status */}
        <div className="mt-2 text-center">
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className={`text-xs ${
              isConnected
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
