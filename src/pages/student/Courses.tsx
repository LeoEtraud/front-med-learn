import React from 'react';
import { Link } from 'wouter';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStudentEnrollments } from '@/hooks/use-student';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock3, PlayCircle, BookOpen } from 'lucide-react';
import { useDelayedFlag } from '@/hooks/use-delayed-flag';
import { CourseCardGridSkeleton } from '@/components/ui/content-skeletons';

export default function StudentCourses() {
  const { data: enrollments, isLoading } = useStudentEnrollments();
  const showLoading = useDelayedFlag(isLoading);

  if (isLoading && showLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-[92rem] min-w-0 space-y-6">
          <CourseCardGridSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (isLoading) return <AppLayout><div className="min-h-24" /></AppLayout>;
  if (!enrollments) return <AppLayout><div>Não foi possível carregar seus cursos.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[92rem] min-w-0 space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Estudante</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Meus Cursos</h1>
        </div>

        {enrollments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              Você ainda não está inscrito em nenhum curso.
              <div className="mt-4">
                <Link href="/courses">
                  <Button variant="outline">Explorar Catálogo</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="overflow-hidden">
                <div className="relative aspect-video w-full bg-slate-100">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  {enrollment.course.coverImageUrl ? (
                    <img
                      src={enrollment.course.coverImageUrl}
                      alt={`Capa do curso ${enrollment.course.title}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <h3 className="line-clamp-2 text-lg font-bold">{enrollment.course.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {enrollment.course.shortDescription || enrollment.course.subtitle || 'Sem descrição resumida.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span>Progresso</span>
                      <span>{Math.round(enrollment.progressPercent)}%</span>
                    </div>
                    <Progress value={enrollment.progressPercent} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {enrollment.course.workloadHours ? `${enrollment.course.workloadHours}h` : '--'}
                    </div>
                    <span className="font-semibold uppercase">{enrollment.course.level}</span>
                  </div>

                  <Link href={`/student/courses/${enrollment.courseId}/lessons/${enrollment.lastLessonId || 'start'}`}>
                    <Button className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {enrollment.lastLessonId ? 'Continuar curso' : 'Iniciar curso'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
