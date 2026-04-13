import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import CourseCatalog from "@/pages/public/CourseCatalog";
import CourseDetail from "@/pages/public/CourseDetail";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentProfile from "@/pages/student/Profile";
import LessonViewer from "@/pages/student/LessonViewer";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import CoursesList from "@/pages/teacher/CoursesList";
import CourseEditor from "@/pages/teacher/CourseEditor";
import TeacherProfile from "@/pages/teacher/Profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
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
