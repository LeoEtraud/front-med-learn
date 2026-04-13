import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Link, useLocation } from 'wouter';
import { 
  BookOpen, LayoutDashboard, LogOut, Settings, 
  Menu, X, GraduationCap, Users, BarChart3, FileVideo, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/courses', label: 'Meus Cursos', icon: BookOpen },
    { href: '/courses', label: 'Catálogo', icon: GraduationCap },
    { href: '/student/profile', label: 'Meu Perfil', icon: Settings },
  ];

  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/courses', label: 'Gerenciar Cursos', icon: FileVideo },
    { href: '/teacher/profile', label: 'Meu Perfil', icon: Settings },
  ];

  const links = user.role === 'TEACHER' ? teacherLinks : studentLinks;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-white px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] dark:bg-slate-900 z-[60]">
        <div className="flex min-w-0 items-center gap-2 text-primary font-display font-bold text-lg">
          <BookOpen className="h-6 w-6 shrink-0" aria-hidden />
          <span className="truncate">MedLearn</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {user.role === 'TEACHER' && (
            <Link href="/teacher/courses/new" aria-label="Novo curso">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sidebar-foreground hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 touch-manipulation"
            aria-expanded={isMobileMenuOpen}
            aria-controls="app-sidebar-nav"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        id="app-sidebar-nav"
        className={cn(
          'fixed left-0 z-50 flex w-[min(100vw-3rem,16rem)] max-w-[16rem] flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-out max-md:top-[calc(env(safe-area-inset-top,0px)+3.75rem)] max-md:h-[calc(100dvh-env(safe-area-inset-top,0px)-3.75rem)] md:sticky md:top-0 md:h-dvh md:w-64 md:max-w-none md:translate-x-0 md:shadow-none',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          !isMobileMenuOpen && 'pointer-events-none md:pointer-events-auto'
        )}
      >
        <div className="hidden items-center gap-3 p-6 font-display text-2xl font-bold text-white md:flex">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          MedLearn
        </div>

        <div className="flex-1 overflow-y-auto overscroll-y-contain px-4 py-6 md:py-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || location.startsWith(link.href + '/');
              return (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors touch-manipulation",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}>
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white overflow-hidden">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{user.name}</span>
              <span className="text-xs text-slate-400 capitalize">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:h-screen">
        {/* Topbar for Desktop */}
        <header className="sticky top-0 z-10 hidden h-16 shrink-0 items-center justify-between border-b bg-white px-4 dark:bg-slate-900 lg:px-8 md:flex">
          <h1 className="truncate font-display text-lg font-semibold capitalize">
            {location.split('/')[2] || 'Dashboard'}
          </h1>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {user.role === 'TEACHER' && (
              <Link href="/teacher/courses/new">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Novo Curso
                </Button>
              </Link>
            )}
            <Link href={user.role === 'TEACHER' ? '/teacher/profile' : '/student/profile'}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5 text-slate-500" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden touch-manipulation"
          aria-label="Fechar menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
