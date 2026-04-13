import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { UserProfile } from '@/types/api';
import { useLocation } from 'wouter';

// FUNÇÃO PARA GERENCIAR AUTENTICAÇÃO E SESSÃO NO FRONTEND
export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem('medlearn_token');
      if (!token) return null;
      try {
        const res = await api.get<{id: string, name: string, email: string, role: string, avatarUrl: string}>('/auth/me');
        return res.data as UserProfile;
      } catch (err) {
        return null;
      }
    },
    staleTime: Infinity,
  });

  const login = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('medlearn_token', data.token);
        queryClient.setQueryData(['auth', 'me'], data.user);
        if (data.user.role === 'TEACHER') {
          setLocation('/teacher/dashboard');
        } else {
          setLocation('/student/dashboard');
        }
      }
    },
  });

  const register = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/auth/register', data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('medlearn_token', data.token);
        queryClient.setQueryData(['auth', 'me'], data.user);
        if (data.user.role === 'TEACHER') {
          setLocation('/teacher/dashboard');
        } else {
          setLocation('/student/dashboard');
        }
      }
    },
  });

  // FUNÇÃO PARA ENCERRAR A SESSÃO LOCAL DO USUÁRIO
  const logout = () => {
    localStorage.removeItem('medlearn_token');
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.clear();
    setLocation('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
