import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStudentDashboard } from '@/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/ui/content-skeletons';
import { useDelayedFlag } from '@/hooks/use-delayed-flag';
import { normalizePtBrText } from '@/lib/normalize-ptbr';

// PÁGINA DE DASHBOARD DO ALUNO - PÁGINA PARA MOSTRAR O DASHBOARD DO ALUNO
export default function StudentDashboard() {
  const { data, isLoading } = useStudentDashboard();
  const showLoading = useDelayedFlag(isLoading);
  const isWaitingData = isLoading && !data;

  if (isWaitingData && showLoading) return <AppLayout><DashboardSkeleton /></AppLayout>;
  if (isWaitingData) return <AppLayout><div className="min-h-24" /></AppLayout>;
  if (!data) return <AppLayout><div>Erro ao carregar dados.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[92rem] min-w-0 space-y-6 sm:space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="flex items-center gap-4 p-4 sm:p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Cursos Inscritos</p>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{data.enrolledCoursesCount}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-accent">
            <CardContent className="flex items-center gap-4 p-4 sm:p-6">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Em Andamento</p>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{data.inProgressCoursesCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="flex items-center gap-4 p-4 sm:p-6">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Concluídos</p>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{data.completedCoursesCount}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Continue Learning */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold sm:text-xl">Continue Aprendendo</h2>
            {data.recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {data.recentEnrollments.slice(0,3).map(enrollment => (
                  <Card key={enrollment.id} className="card-hover">
                    <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="mb-1 text-base font-bold sm:text-lg">{normalizePtBrText(enrollment.course.title)}</h4>
                          <p className="line-clamp-2 text-sm text-muted-foreground sm:line-clamp-1">
                            {normalizePtBrText(enrollment.lastLessonTitle) || 'Iniciar curso'}
                          </p>
                        </div>
                        <Link
                          to={`/student/courses/${enrollment.courseId}/lessons/${enrollment.lastLessonId || 'start'}`}
                          className="shrink-0"
                        >
                          <Button size="icon" className="rounded-full shadow-md shadow-primary/20" aria-label="Continuar aula">
                            <PlayCircle className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>Progresso</span>
                          <span>{Math.round(enrollment.progressPercent)}%</span>
                        </div>
                        <Progress value={enrollment.progressPercent} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  Você ainda não está inscrito em nenhum curso.
                  <div className="mt-4">
                    <Link to="/courses"><Button variant="outline">Explorar Catálogo</Button></Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Quizzes */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold sm:text-xl">Últimas Avaliações</h2>
            <Card>
              <CardContent className="p-0">
                {data.recentQuizAttempts?.length > 0 ? (
                  <div className="divide-y">
                    {data.recentQuizAttempts.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{quiz.quizTitle}</p>
                          <p className="text-xs text-muted-foreground">{quiz.courseTitle}</p>
                        </div>
                        <div
                          className={`shrink-0 self-start rounded-full px-3 py-1.5 text-xs font-bold sm:self-auto ${quiz.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {quiz.score}% — {quiz.passed ? 'Aprovado' : 'Reprovado'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Nenhuma avaliação realizada recentemente.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
