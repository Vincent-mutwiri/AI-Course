import { Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import AIAssistantPage from "./pages/AIAssistantPage";
import QuizDemoPage from "./pages/QuizDemoPage";
import AdminPage from "./pages/AdminPage";
import CourseBuilderPage from "./pages/admin/CourseBuilderPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AdminRoute from "./components/shared/AdminRoute";
import ModuleContent from "./pages/ModuleContent";
import HelpPage from "./pages/HelpPage";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        expand={true}
        visibleToasts={4}
        closeButton
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
          className: 'my-toast',
          duration: 4000,
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId/module/:moduleId"
            element={
              <ProtectedRoute>
                <ModuleContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />
          <Route path="/demo/quiz" element={<QuizDemoPage />} />
          <Route path="/quiz-demo" element={<QuizDemoPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/courses/:id/builder"
            element={
              <AdminRoute>
                <CourseBuilderPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
