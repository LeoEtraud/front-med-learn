import React, { useMemo, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Stethoscope } from 'lucide-react';

const schema = z
  .object({
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme a senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

// PÁGINA DE REDEFINIÇÃO DE SENHA - PÁGINA PARA REDEFINIR A SENHA DO USUÁRIO
export default function ResetPassword() {
  const search = useSearch();
  const token = useMemo(() => new URLSearchParams(search).get('token') ?? '', [search]);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setErrorMsg('Link inválido ou incompleto. Solicite um novo e-mail de redefinição.');
      return;
    }
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await api.post('/auth/reset-password', { token, password: data.password });
      setSuccessMsg('Senha alterada com sucesso. Você já pode entrar com a nova senha.');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Não foi possível redefinir a senha. O link pode ter expirado.');
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
          <h2 className="text-4xl font-display font-bold mb-4">Nova senha</h2>
          <p className="text-lg text-slate-300">Escolha uma senha forte e guarde em local seguro.</p>
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
            <CardTitle className="font-display text-2xl font-bold sm:text-3xl">Redefinir senha</CardTitle>
            <CardDescription>Defina uma nova senha para sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="p-3 text-sm text-amber-800 bg-amber-50 rounded-md border border-amber-100">
                Este link não contém um token válido.{' '}
                <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
                  Solicitar novo link
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 text-sm text-green-800 bg-green-50 rounded-md border border-green-100 space-y-3">
                    <p>{successMsg}</p>
                    <Link
                      href="/login"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground touch-manipulation"
                    >
                      Ir para o login
                    </Link>
                  </div>
                )}
                {!successMsg && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nova senha</label>
                      <PasswordInput {...register('password')} placeholder="••••••••" className="sm:h-12" />
                      {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirmar nova senha</label>
                      <PasswordInput {...register('confirmPassword')} placeholder="••••••••" className="sm:h-12" />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full text-base sm:h-12 sm:text-lg" isLoading={isSubmitting}>
                      Salvar nova senha
                    </Button>
                  </>
                )}
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pb-8 text-center">
            <p className="text-sm text-slate-600">
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Voltar ao login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
