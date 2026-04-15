import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSetCourseStatus, useTeacherCourses } from '@/hooks/use-teacher';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Clock3, CheckCircle2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateCourseModal } from '@/components/course-management/create-entity-modals';
import { CourseCardGridSkeleton } from '@/components/ui/content-skeletons';
import { useDelayedFlag } from '@/hooks/use-delayed-flag';
import { useToast } from '@/hooks/use-toast';

// PÁGINA DE LISTA DE CURSOS - PÁGINA PARA LISTAR OS CURSOS DO PROFESSOR
export default function CoursesList() {
  const { data: courses, isLoading } = useTeacherCourses();
  const setCourseStatus = useSetCourseStatus();
  const showLoading = useDelayedFlag(isLoading);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const { toast } = useToast();

  const handlePublishToggle = async (courseId: string, shouldPublish: boolean) => {
    try {
      await setCourseStatus.mutateAsync({ id: courseId, status: shouldPublish ? 'PUBLISHED' : 'DRAFT' });
      toast({
        variant: 'success',
        title: shouldPublish ? 'Curso publicado' : 'Curso movido para rascunho',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Não foi possível atualizar o status',
        description: error?.response?.data?.error ?? 'Tente novamente.',
      });
    }
  };

  return (
    <AppLayout>
      <CreateCourseModal open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen} />
      <div className="mx-auto max-w-[92rem] min-w-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-xl font-bold sm:text-2xl">Gerenciar Cursos</h1>
          <Button className="w-full sm:w-auto" onClick={() => setIsCreateCourseOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Curso
          </Button>
        </div>

        {isLoading && showLoading ? (
          <CourseCardGridSkeleton count={4} />
        ) : isLoading ? (
          <div className="min-h-24" />
        ) : courses?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">Você ainda não possui cursos</h3>
            <p className="text-slate-500 mb-6">Comece criando seu primeiro curso para seus alunos.</p>
            <Button onClick={() => setIsCreateCourseOpen(true)}>Criar Meu Primeiro Curso</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses?.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative aspect-video w-full bg-slate-100">
                  <div className="absolute inset-0 flex h-full w-full items-center justify-center text-slate-400">
                    <FileText className="h-8 w-8" />
                  </div>
                  {course.coverImageUrl ? (
                    <img
                      src={course.coverImageUrl}
                      className="absolute inset-0 h-full w-full object-cover"
                      alt={`Capa do curso ${course.title}`}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                      {course.specialty || 'Especialidade não informada'}
                    </span>
                    <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                      {course.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                  <h3 className="line-clamp-2 text-xl font-bold text-slate-900">{course.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {course.shortDescription || course.subtitle || 'Sem descrição resumida.'}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {course.workloadHours ? `${course.workloadHours}h` : '--'}
                    </div>
                    <div className="text-xs font-medium uppercase text-slate-500">{course.level}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link href={`/teacher/courses/${course.id}/edit`} className="flex-1 min-w-[8.5rem]">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit2 className="mr-2 h-4 w-4" /> Editar
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 min-w-[8.5rem]"
                      variant={course.status === 'PUBLISHED' ? 'secondary' : 'default'}
                      isLoading={setCourseStatus.isPending}
                      onClick={() => handlePublishToggle(course.id, course.status !== 'PUBLISHED')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {course.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
