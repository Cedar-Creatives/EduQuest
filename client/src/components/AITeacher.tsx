
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageCircle,
  Send,
  BookOpen,
  Lightbulb,
  Heart,
  Zap,
  Target,
  Coffee
} from 'lucide-react';

interface TeacherProfile {
  name: string;
  personality: string;
  avatar: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  traits: string[];
  greetings: string[];
  motivationalMessages: string[];
  helpResponses: string[];
  subjectExpertise: { [subject: string]: string[] };
  examTips: { [examType: string]: string[] };
}

const teacherProfiles: { [key: string]: TeacherProfile } = {
  Kingsley: {
    name: 'Kingsley',
    personality: 'Encouraging & Supportive',
    avatar: 'K',
    color: 'blue',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    traits: ['Patient', 'Encouraging', 'Detailed', 'Supportive'],
    greetings: [
      "Hello there! I'm Kingsley, and I'm here to support you every step of the way! 😊",
      "Great to see you! Ready to learn something amazing today?",
      "Hey! Don't worry if things seem tough - we'll figure it out together! 💪",
      "Welcome back! I believe in you and I know you can achieve great things!"
    ],
    motivationalMessages: [
      "Remember, every expert was once a beginner. You're doing great! 🌟",
      "Progress isn't always fast, but it's always worth it. Keep going!",
      "I've seen students overcome much bigger challenges. You've got this! 💪",
      "Every question you ask makes you stronger. Never hesitate to ask!"
    ],
    helpResponses: [
      "That's a wonderful question! Let me break this down step by step for you...",
      "I understand this can be confusing. Let's approach it from a different angle...",
      "Great thinking! Now let me help you take it to the next level...",
      "No worries at all! This is actually a common area where students need support..."
    ],
    subjectExpertise: {
      'Mathematics': [
        "Math is like building blocks - start with the basics and build up!",
        "Don't rush through problems. Take your time to understand each step.",
        "Practice makes perfect in math. The more you solve, the better you get!"
      ],
      'Physics': [
        "Physics connects to real life! Think about how things work around you.",
        "Draw diagrams and visualize the problem - it helps a lot!",
        "Remember the formulas, but focus on understanding the concepts first."
      ],
      'English': [
        "Reading regularly improves your vocabulary and understanding.",
        "Practice writing every day, even if it's just a few sentences.",
        "Grammar rules become easier with practice and examples."
      ]
    },
    examTips: {
      'WAEC': [
        "WAEC tests your understanding, not just memorization. Focus on concepts!",
        "Practice past questions to get familiar with the exam pattern.",
        "Time management is crucial. Don't spend too long on one question."
      ],
      'NECO': [
        "NECO questions often test practical application. Think real-world scenarios.",
        "Read questions carefully - they often contain important clues.",
        "Show your working clearly - partial marks can make a big difference!"
      ],
      'JAMB': [
        "JAMB is about speed and accuracy. Practice timed mock exams.",
        "Focus on your strongest subjects to maximize your score.",
        "Don't leave any question unanswered - there's no penalty for wrong answers."
      ]
    }
  },
  Rita: {
    name: 'Rita',
    personality: 'Direct & Challenging',
    avatar: 'R',
    color: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    traits: ['Direct', 'Challenging', 'Efficient', 'Results-focused'],
    greetings: [
      "I'm Rita. Ready to push your limits and achieve excellence? Let's get started! 🔥",
      "Time to level up! I'm here to challenge you and bring out your best.",
      "No excuses, just results. Are you ready to work hard and succeed?",
      "Excellence isn't an accident - it's a choice. Let's make that choice today!"
    ],
    motivationalMessages: [
      "Stop making excuses and start making progress! You're capable of more! 🔥",
      "Comfort zones are where dreams go to die. Let's break through yours!",
      "Champions aren't made in comfort - they're forged through challenge!",
      "You didn't come this far just to come this far. Push harder!"
    ],
    helpResponses: [
      "Here's the direct path to mastery. Pay attention and practice hard...",
      "I'll give you the solution, but I expect you to understand it completely...",
      "This is exactly what separates average students from exceptional ones...",
      "Stop overthinking and start applying. Here's what you need to know..."
    ],
    subjectExpertise: {
      'Mathematics': [
        "Math requires precision. Every step must be correct - no shortcuts!",
        "Solve problems systematically. Write down every step clearly.",
        "Challenge yourself with harder problems. That's how you improve!"
      ],
      'Physics': [
        "Physics is about understanding principles, not memorizing facts.",
        "Apply concepts to new situations. That's real learning!",
        "Don't just solve problems - understand why the solution works."
      ],
      'English': [
        "Master the fundamentals. Grammar and vocabulary are your foundation.",
        "Read challenging texts to expand your knowledge.",
        "Write with purpose. Every word should serve a purpose."
      ]
    },
    examTips: {
      'WAEC': [
        "WAEC rewards thorough understanding. Don't just memorize - comprehend!",
        "Practice under exam conditions. Build your stamina and speed.",
        "Review your weak areas systematically. Turn weaknesses into strengths."
      ],
      'NECO': [
        "NECO tests application skills. Practice with real-world examples.",
        "Be precise in your answers. Quality over quantity.",
        "Time yourself during practice. Speed comes with practice."
      ],
      'JAMB': [
        "JAMB is a marathon, not a sprint. Build your endurance.",
        "Focus on high-yield topics. Maximize your score potential.",
        "Practice elimination strategies for multiple choice questions."
      ]
    }
  }
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'teacher';
  timestamp: Date;
  teacherName?: string;
}

interface AITeacherProps {
  selectedTeacher?: string;
  subject?: string;
  context?: string;
}

export function AITeacher({ selectedTeacher = 'Kingsley', subject, context }: AITeacherProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  
  const teacher = teacherProfiles[selectedTeacher];

  useEffect(() => {
    // Send initial greeting when component mounts
    const greeting = teacher.greetings[Math.floor(Math.random() * teacher.greetings.length)];
    setMessages([{
      id: '1',
      text: greeting,
      sender: 'teacher',
      timestamp: new Date(),
      teacherName: teacher.name
    }]);
  }, [selectedTeacher, teacher]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response (in real implementation, this would call the AI service)
    setTimeout(() => {
      const response = generateTeacherResponse(currentMessage, teacher, subject, context);
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'teacher',
        timestamp: new Date(),
        teacherName: teacher.name
      };

      setMessages(prev => [...prev, teacherMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateTeacherResponse = (
    userInput: string, 
    teacher: TeacherProfile, 
    subject?: string, 
    context?: string
  ): string => {
    const input = userInput.toLowerCase();
    
    // Subject-specific help
    if (subject && teacher.subjectExpertise[subject]) {
      if (input.includes('help') || input.includes('don\'t understand') || input.includes('confused')) {
        const expertise = teacher.subjectExpertise[subject];
        return expertise[Math.floor(Math.random() * expertise.length)];
      }
      
      if (input.includes('tip') || input.includes('advice') || input.includes('how to')) {
        const expertise = teacher.subjectExpertise[subject];
        return expertise[Math.floor(Math.random() * expertise.length)];
      }
    }
    
    // Exam-specific tips
    if (input.includes('waec') || input.includes('neco') || input.includes('jamb')) {
      let examType = 'WAEC';
      if (input.includes('neco')) examType = 'NECO';
      if (input.includes('jamb')) examType = 'JAMB';
      
      if (teacher.examTips[examType]) {
        const tips = teacher.examTips[examType];
        return tips[Math.floor(Math.random() * tips.length)];
      }
    }
    
    // General help responses
    if (input.includes('help') || input.includes('don\'t understand') || input.includes('confused')) {
      return teacher.helpResponses[Math.floor(Math.random() * teacher.helpResponses.length)];
    }
    
    // Difficulty handling
    if (input.includes('difficult') || input.includes('hard') || input.includes('struggling')) {
      if (teacher.name === 'Kingsley') {
        return "I understand this feels challenging, but remember - every difficulty is an opportunity to grow stronger! Let's break this down into smaller, manageable pieces. What specific part is giving you trouble?";
      } else {
        return "Difficult? Good! That means you're pushing your boundaries. Champions aren't built in comfort zones. Tell me exactly where you're stuck and I'll show you how to power through it.";
      }
    }
    
    // Quiz-specific help
    if (context && context.includes('Quiz question:')) {
      if (teacher.name === 'Kingsley') {
        return "I can see you're working on a quiz question! Let me help you think through this step by step. What specific part of the question is unclear to you?";
      } else {
        return "Quiz time! Let's tackle this systematically. Break down what you know and what you need to find out. What's your approach so far?";
      }
    }
    
    // Gratitude responses
    if (input.includes('thanks') || input.includes('thank you')) {
      if (teacher.name === 'Kingsley') {
        return "You're so welcome! It's my pleasure to help you succeed. Remember, asking questions shows intelligence, not weakness! 😊";
      } else {
        return "Save the thanks for when you ace that exam! Now let's get back to work and make it happen.";
      }
    }
    
    // Default responses based on personality and context
    if (teacher.name === 'Kingsley') {
      if (subject) {
        return `Great question about ${subject}! I can see you're really thinking about this. Let me help you explore this further. What would you like to know more about?`;
      }
      return "That's a great point! I can see you're really thinking about this. Let me help you explore this further. What would you like to know more about?";
    } else {
      if (subject) {
        return `Straight to the point about ${subject} - I like that! Here's what you need to focus on to master this topic. Are you ready to put in the work?`;
      }
      return "Straight to the point - I like that! Here's what you need to focus on to master this topic. Are you ready to put in the work?";
    }
  };

  const getRandomMotivation = () => {
    const motivation = teacher.motivationalMessages[Math.floor(Math.random() * teacher.motivationalMessages.length)];
    
    const motivationMessage: Message = {
      id: Date.now().toString(),
      text: motivation,
      sender: 'teacher',
      timestamp: new Date(),
      teacherName: teacher.name
    };

    setMessages(prev => [...prev, motivationMessage]);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={`bg-gradient-to-r ${teacher.gradientFrom} ${teacher.gradientTo} text-white rounded-t-lg`}>
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarFallback className={`bg-white text-${teacher.color}-600 font-bold`}>
              {teacher.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-lg">{teacher.name}</CardTitle>
            <p className="text-sm opacity-90">{teacher.personality}</p>
          </div>
          
          <div className="flex space-x-1">
            {teacher.name === 'Kingsley' ? (
              <Heart className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {teacher.traits.map((trait, index) => (
            <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
              {trait}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : `bg-gray-100 text-gray-800 border border-${teacher.color}-200`
                }`}
              >
                {message.sender === 'teacher' && (
                  <div className="text-xs font-semibold mb-1 text-gray-600">
                    {message.teacherName}
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className={`bg-gray-100 border border-${teacher.color}-200 px-4 py-2 rounded-lg`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={getRandomMotivation}
              className="flex items-center space-x-1 text-xs"
            >
              <Target className="w-3 h-3" />
              <span>Motivate me</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage("I need help with " + (subject || "this topic"))}
              className="flex items-center space-x-1 text-xs"
            >
              <BookOpen className="w-3 h-3" />
              <span>Get help</span>
            </Button>
            {subject && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMessage(`Give me ${subject} study tips`)}
                className="flex items-center space-x-1 text-xs"
              >
                <Brain className="w-3 h-3" />
                <span>{subject} tips</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage("Give me exam tips for WAEC/NECO/JAMB")}
              className="flex items-center space-x-1 text-xs"
            >
              <Trophy className="w-3 h-3" />
              <span>Exam tips</span>
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={`Ask ${teacher.name} anything...`}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isTyping}
              size="sm"
              className={`bg-gradient-to-r ${teacher.gradientFrom} ${teacher.gradientTo} hover:opacity-90`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { teacherProfiles };
