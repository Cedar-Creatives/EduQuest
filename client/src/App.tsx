import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login }))
);
const Register = lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register }))
);
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((module) => ({ default: module.default }))
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const QuizSelection = lazy(() =>
  import("./pages/QuizSelection").then((module) => ({
    default: module.QuizSelection,
  }))
);
const QuizTaking = lazy(() =>
  import("./pages/QuizTaking").then((module) => ({
    default: module.QuizTaking,
  }))
);
const QuizResults = lazy(() =>
  import("./pages/QuizResults").then((module) => ({
    default: module.QuizResults,
  }))
);
const NotesLibrary = lazy(() =>
  import("./pages/NotesLibrary").then((module) => ({
    default: module.NotesLibrary,
  }))
);
const NoteViewer = lazy(() =>
  import("./pages/NoteViewer").then((module) => ({
    default: module.NoteViewer,
  }))
);
const Profile = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.Profile }))
);
const Upgrade = lazy(() =>
  import("./pages/Upgrade").then((module) => ({ default: module.Upgrade }))
);
const AdvancedAnalytics = lazy(() =>
  import("./pages/AdvancedAnalytics").then((module) => ({
    default: module.AdvancedAnalytics,
  }))
);
const AITeacherPage = lazy(() =>
  import("./pages/AITeacherPage").then((module) => ({
    default: module.AITeacherPage,
  }))
);
const Onboarding = lazy(() =>
  import("./pages/Onboarding").then((module) => ({
    default: module.Onboarding,
  }))
);


// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Loading EduQuest
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Preparing your learning experience...
      </p>
    </div>
  </div>
);

// Import ErrorBoundary
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes - accessible to everyone */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected routes - require authentication */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="quiz" element={<QuizSelection />} />
                  <Route
                    path="quiz/:subject/:difficulty"
                    element={<QuizTaking />}
                  />
                  <Route path="results/:quizId" element={<QuizResults />} />
                  <Route path="notes" element={<NotesLibrary />} />
                  <Route path="notes/:noteId" element={<NoteViewer />} />
                  <Route path="ai-teacher" element={<AITeacherPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="upgrade" element={<Upgrade />} />
                  <Route path="analytics" element={<AdvancedAnalytics />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
