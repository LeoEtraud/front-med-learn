import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageLoading } from "@/components/ui/page-loading";

// Pages (lazy-loaded by route to reduce initial bundle)
const Home = lazy(() => import("@/pages/public/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const CourseCatalog = lazy(() => import("@/pages/public/CourseCatalog"));
const CourseDetail = lazy(() => import("@/pages/public/CourseDetail"));
const StudentDashboard = lazy(() => import("@/pages/student/Dashboard"));
const StudentProfile = lazy(() => import("@/pages/student/Profile"));
const LessonViewer = lazy(() => import("@/pages/student/LessonViewer"));
const TeacherDashboard = lazy(() => import("@/pages/teacher/Dashboard"));
const CoursesList = lazy(() => import("@/pages/teacher/CoursesList"));
const CourseEditor = lazy(() => import("@/pages/teacher/CourseEditor"));
const TeacherProfile = lazy(() => import("@/pages/teacher/Profile"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    },
  },
});

function Router() {
  return (
    <Suspense fallback={<PageLoading message="Carregando página..." className="min-h-dvh" />}>
      <Switch>
        {/* Public */}
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/courses" component={CourseCatalog} />
        <Route path="/courses/:id" component={CourseDetail} />

        {/* Student */}
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/courses" component={StudentDashboard} /> {/* Reuse dashboard for simplicity in this artifact, normally a list view */}
        <Route path="/student/profile" component={StudentProfile} />
        <Route path="/student/courses/:courseId/lessons/:lessonId" component={LessonViewer} />

        {/* Teacher */}
        <Route path="/teacher/dashboard" component={TeacherDashboard} />
        <Route path="/teacher/courses" component={CoursesList} />
        <Route path="/teacher/courses/:id/edit" component={CourseEditor} />
        <Route path="/teacher/profile" component={TeacherProfile} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300} skipDelayDuration={200}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
