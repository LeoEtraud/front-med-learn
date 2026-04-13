import React, { useState } from 'react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Stethoscope } from 'lucide-react';

// ESQUEMA DE VALIDAÇÃO PARA O REGISTRO
const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['STUDENT', 'TEACHER']),
});

// TIPO PARA O FORMULÁRIO DE REGISTRO
type RegisterForm = z.infer<typeof registerSchema>;

// PÁGINA DE REGISTRO - PÁGINA PARA REGISTRAR UM NOVO USUÁRIO
export default function Register() {
  const { register: registerUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' },
  });

  // FUNÇÃO PARA SUBMITIR O FORMULÁRIO DE REGISTRO
  const onSubmit = async (data: RegisterForm) => {
    try {
      setErrorMsg('');
      await registerUser.mutateAsync(data);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Erro ao criar conta.');
    }
  };

  return (
    <div className="grid min-h-dvh overflow-x-hidden bg-slate-50 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center p-12 bg-sidebar text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${import.meta.env.BASE_URL}images/doctor-abstract.png`} alt="Medical" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-8 text-primary" />
          <h2 className="text-4xl font-display font-bold mb-4">Comece sua jornada no MedLearn</h2>
          <p className="text-lg text-slate-300">
            Crie sua conta e acesse cursos, materiais e uma comunidade focada em educação médica de qualidade.
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardHeader className="space-y-2 pt-6 text-center sm:pt-8">
            <div className="flex justify-center mb-4 md:hidden">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="font-display text-2xl font-bold sm:text-3xl">Criar conta</CardTitle>
            <CardDescription>Junte-se à plataforma de educação médica</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome completo</label>
                <Input {...register('name')} placeholder="Dra. Ana Silva" className="sm:h-12" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" {...register('email')} placeholder="dr.nome@exemplo.com" className="sm:h-12" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <PasswordInput {...register('password')} placeholder="••••••••" className="sm:h-12" />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2 pb-2">
                <label className="text-sm font-medium">Eu sou um...</label>
                <select
                  {...register('role')}
                  className="flex h-11 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-12 sm:text-sm touch-manipulation"
                >
                  <option value="STUDENT">Estudante / Médico residente</option>
                  <option value="TEACHER">Professor / Criador de curso</option>
                </select>
              </div>
              <Button type="submit" className="w-full text-base sm:h-12 sm:text-lg" isLoading={isSubmitting}>
                Cadastrar na plataforma
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pb-8 text-center">
            <p className="text-sm text-slate-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
