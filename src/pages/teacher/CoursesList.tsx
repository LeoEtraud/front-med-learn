import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTeacherCourses } from '@/hooks/use-teacher';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Plus, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLoading } from '@/components/ui/page-loading';
import { CreateCourseModal } from '@/components/course-management/create-entity-modals';

// PÁGINA DE LISTA DE CURSOS - PÁGINA PARA LISTAR OS CURSOS DO PROFESSOR
export default function CoursesList() {
  const { data: courses, isLoading } = useTeacherCourses();
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

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

        {isLoading ? (
          <PageLoading message="Carregando cursos..." />
        ) : courses?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">Você ainda não possui cursos</h3>
            <p className="text-slate-500 mb-6">Comece criando seu primeiro curso para seus alunos.</p>
            <Button onClick={() => setIsCreateCourseOpen(true)}>Criar Meu Primeiro Curso</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {courses?.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-32 bg-slate-100 shrink-0">
                    {course.coverImageUrl ? (
                      <img src={course.coverImageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">Sem Capa</div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-center">
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'secondary'}>{course.status}</Badge>
                          <span className="text-xs font-medium uppercase text-slate-500">{course.level}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">{course.title}</h3>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link href={`/teacher/courses/${course.id}/edit`} className="w-full sm:w-auto">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 sm:mt-4 sm:gap-6">
                      <div><strong className="text-slate-900">{course.enrollmentCount}</strong> alunos</div>
                      <div><strong className="text-slate-900">{course.completionRate}%</strong> conclusão</div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
