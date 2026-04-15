import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Course, CourseDetail, CourseWithStats } from '@/types/api';

// FUNÇÃO PARA LISTAR CURSOS PÚBLICOS COM FILTROS OPCIONAIS
export function usePublicCourses(params?: { specialty?: string; level?: string; search?: string }) {
  return useQuery({
    queryKey: ['public-courses', params],
    queryFn: async () => {
      const res = await api.get<{courses: Course[], total: number}>('/courses', { params });
      return res.data;
    },
    // Mantém a lista atual enquanto novos filtros carregam.
    placeholderData: (previousData) => previousData,
  });
}

// FUNÇÃO PARA BUSCAR DETALHES DE UM CURSO PÚBLICO
export function usePublicCourse(id: string) {
  return useQuery({
    queryKey: ['public-course', id],
    queryFn: async () => {
      const res = await api.get<CourseDetail>(`/courses/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
