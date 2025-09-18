import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Brain,
  FileText,
  Home,
  User,
  Crown,
  Trophy,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/app", icon: Home },
  { name: "Take Quiz", href: "/app/quiz", icon: Brain },
  { name: "Notes Library", href: "/app/notes", icon: FileText },
  { name: "AI Teacher", href: "/app/ai-teacher", icon: Brain },
  { name: "Profile", href: "/app/profile", icon: User },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduQuiz
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/app"}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Section */}
        {user?.plan === "freemium" && (
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
              <div className="flex items-center mb-2">
                <Crown className="w-5 h-5 mr-2" />
                <span className="font-semibold">Upgrade to Premium</span>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Unlock unlimited quizzes and advanced analytics
              </p>
              <Button
                onClick={() => navigate("/app/upgrade")}
                className="w-full bg-white text-orange-600 hover:bg-gray-100"
                size="sm"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.username || "User"}
              </p>
              <div className="flex items-center space-x-1">
                <Badge
                  variant={user?.plan === "premium" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user?.plan === "premium" ? "Premium" : "Freemium"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
