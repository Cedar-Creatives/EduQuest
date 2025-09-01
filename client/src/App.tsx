import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { LandingPage } from "./pages/LandingPage"
import { Dashboard } from "./pages/Dashboard"
import { QuizSelection } from "./pages/QuizSelection"
import { QuizTaking } from "./pages/QuizTaking"
import { QuizResults } from "./pages/QuizResults"
import { NotesLibrary } from "./pages/NotesLibrary"
import { NoteViewer } from "./pages/NoteViewer"
import { Profile } from "./pages/Profile"
import { Upgrade } from "./pages/Upgrade"
import { Onboarding } from "@/pages/Onboarding";
import { BlankPage } from "./pages/BlankPage"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            {/* Public routes - accessible to everyone */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/blankpage" element={<BlankPage />} />

            {/* Protected routes - require authentication */}
            <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="quiz" element={<QuizSelection />} />
              <Route path="quiz/:subject/:difficulty" element={<QuizTaking />} />
              <Route path="results/:quizId" element={<QuizResults />} />
              <Route path="notes" element={<NotesLibrary />} />
              <Route path="notes/:noteId" element={<NoteViewer />} />
              <Route path="profile" element={<Profile />} />
              <Route path="upgrade" element={<Upgrade />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App