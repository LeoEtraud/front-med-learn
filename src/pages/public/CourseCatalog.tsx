import React, { useState } from 'react';
import { usePublicCourses } from '@/hooks/use-courses';
import { Link } from 'wouter';
import { Search, Clock, GraduationCap, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLoading } from '@/components/ui/page-loading';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const specialties = ['Cardiologia', 'Neurologia', 'Pediatria', 'Cirurgia', 'Clínica Médica'];

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const { data, isLoading } = usePublicCourses({ search: debouncedSearch, specialty });

  return (
    <div className="min-h-dvh overflow-x-hidden bg-slate-50">
      <div className="bg-sidebar py-12 text-white sm:py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-3 font-display text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">Catálogo de Cursos</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            Encontre a especialização ideal para sua carreira médica. Filtre por especialidade ou busque diretamente.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:gap-6">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <Input
              placeholder="Buscar cursos..."
              className="bg-white pl-10 sm:h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-11 min-h-11 w-full shrink-0 rounded-md border border-slate-200 bg-white px-4 text-base md:h-12 md:w-64 md:text-sm touch-manipulation"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option value="">Todas Especialidades</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {isLoading ? (
          <PageLoading message="Carregando cursos..." />
        ) : data?.courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Nenhum curso encontrado</h3>
            <p className="text-slate-500">Tente ajustar seus filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.courses.map(course => (
              <Card key={course.id} className="card-hover flex flex-col group">
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {course.coverImageUrl ? (
                    <img
                      src={course.coverImageUrl}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <BookOpen className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">{course.level}</Badge>
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="text-sm text-accent font-semibold mb-2">{course.specialty || 'Geral'}</div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">{course.shortDescription || course.subtitle}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {course.workloadHours ? `${course.workloadHours}h` : '--'}
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 p-0 gap-1 h-auto font-semibold">
                        Ver Detalhes <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
