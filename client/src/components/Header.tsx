import { Bell, LogOut, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ThemeToggle } from "./ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Badge } from "./ui/badge"

export function Header() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    console.log('User logging out')
    logout()
    navigate("/login")
  }

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search quizzes, notes..."
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Daily Quiz Limit */}
          {user?.plan === 'freemium' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Daily Quizzes:</span>
              <Badge variant="outline">
                {user?.dailyQuizzesUsed || 0}/5
              </Badge>
            </div>
          )}

          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}