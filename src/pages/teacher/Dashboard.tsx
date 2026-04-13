import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTeacherDashboard } from '@/hooks/use-teacher';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileVideo, Activity, Target } from 'lucide-react';

export default function TeacherDashboard() {
  const { data, isLoading } = useTeacherDashboard();

  if (isLoading) return <AppLayout><div className="p-10">Carregando...</div></AppLayout>;
  if (!data) return <AppLayout><div>Erro</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl min-w-0 space-y-6 sm:space-y-8">
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <FileVideo className="mb-3 h-7 w-7 text-primary sm:mb-4 sm:h-8 sm:w-8" />
              <p className="text-sm text-slate-500 font-medium">Cursos Publicados</p>
              <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">{data.publishedCoursesCount}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Users className="mb-3 h-7 w-7 text-accent sm:mb-4 sm:h-8 sm:w-8" />
              <p className="text-sm text-slate-500 font-medium">Total Alunos</p>
              <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">{data.totalStudentsCount}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Target className="mb-3 h-7 w-7 text-green-500 sm:mb-4 sm:h-8 sm:w-8" />
              <p className="text-sm text-slate-500 font-medium">Taxa Conclusão Média</p>
              <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">{data.averageCompletionRate}%</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Activity className="mb-3 h-7 w-7 text-orange-500 sm:mb-4 sm:h-8 sm:w-8" />
              <p className="text-sm text-slate-500 font-medium">Média Avaliações</p>
              <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">{data.averageQuizScore}%</h3>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <div className="border-b p-4 sm:p-6">
            <h2 className="font-display text-lg font-bold sm:text-xl">Performance dos Cursos</h2>
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium lg:px-6 lg:py-4">Curso</th>
                    <th className="px-4 py-3 font-medium lg:px-6 lg:py-4">Status</th>
                    <th className="px-4 py-3 font-medium lg:px-6 lg:py-4">Alunos</th>
                    <th className="px-4 py-3 font-medium lg:px-6 lg:py-4">Conclusão</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.courses.map((course) => (
                    <tr key={course.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 lg:px-6 lg:py-4">{course.title}</td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <span
                          className={`rounded px-2 py-1 text-xs font-bold ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">{course.enrollmentCount}</td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">{course.completionRate}%</td>
                    </tr>
                  ))}
                  {data.courses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        Nenhum curso criado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {data.courses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-4 shadow-sm"
              >
                <p className="mb-2 font-medium text-slate-900">{course.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}
                  >
                    {course.status}
                  </span>
                  <span>
                    <strong className="text-slate-900">{course.enrollmentCount}</strong> alunos
                  </span>
                  <span>
                    <strong className="text-slate-900">{course.completionRate}%</strong> conclusão
                  </span>
                </div>
              </div>
            ))}
            {data.courses.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">Nenhum curso criado ainda.</p>
            )}
          </div>
        </Card>

      </div>
    </AppLayout>
  );
}
