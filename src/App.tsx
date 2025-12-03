import { Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import EdulimikaLandingPage from "./pages/EdulimikaLandingPage";
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
import { AdminLayout } from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseAnalytics from "./pages/admin/CourseAnalytics";
import PageBuilder from "./pages/admin/PageBuilder";
import PageEditorPage from "./pages/admin/PageEditorPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AdminRoute from "./components/shared/AdminRoute";
import ModuleContent from "./pages/ModuleContent";
import HelpPage from "./pages/HelpPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { getSiteConfig } from "./config/sites";

function App() {
  // Get site configuration to determine which landing page to render
  const siteConfig = getSiteConfig();

  // Determine landing page component based on site configuration
  const LandingPage = siteConfig.content.landingPage === 'EdulimikaLandingPage'
    ? EdulimikaLandingPage
    : HomePage;

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
          <Route path="/" element={<LandingPage />} />
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
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseAnalytics />} />
            <Route path="pages" element={<PageBuilder />} />
            <Route path="pages/new" element={<ErrorBoundary><PageEditorPage /></ErrorBoundary>} />
            <Route path="pages/:id/edit" element={<ErrorBoundary><PageEditorPage /></ErrorBoundary>} />
            <Route path="courses/:id/builder" element={<ErrorBoundary><CourseBuilderPage /></ErrorBoundary>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
