import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { BookOpen, FileVideo, GraduationCap, LayoutDashboard } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const SIDEBAR_COLLAPSED_KEY = 'medlearn_sidebar_collapsed';
const THEME_KEY = 'medlearn_theme';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return null;
  }

  const studentLinks = useMemo(() => [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/courses', label: 'Meus Cursos', icon: BookOpen },
    { href: '/courses', label: 'Catálogo', icon: GraduationCap },
  ], []);

  const teacherLinks = useMemo(() => [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/courses', label: 'Gerenciar Cursos', icon: FileVideo },
  ], []);

  const links = user.role === 'TEACHER' ? teacherLinks : studentLinks;
  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        links={links}
        location={location}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          setIsSidebarCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
            return next;
          });
        }}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 px-2 py-2 sm:gap-4 sm:px-3 sm:py-3 lg:px-5 lg:py-4">
        <div className="shrink-0 overflow-visible">
          <Header
            user={user}
            location={location}
            theme={theme}
            onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
            onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <main className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-border/90 bg-background/70 p-3 text-card-foreground shadow-inner sm:p-5 md:p-6 lg:p-8 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
