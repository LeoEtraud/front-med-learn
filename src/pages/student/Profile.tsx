import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  useStudentProfile,
  useUpdateStudentPassword,
  useUpdateStudentProfile,
} from '@/hooks/use-student';

// PÁGINA DE PERFIL DO ALUNO - PÁGINA PARA MOSTRAR O PERFIL DO ALUNO
export default function StudentProfile() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useStudentProfile();

  // FUNÇÃO PARA VERIFICAR SE O USUÁRIO É UM ALUNO
  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role !== 'STUDENT') {
      setLocation('/teacher/dashboard');
    }
  }, [authLoading, user, setLocation]);
  const updateProfile = useUpdateStudentProfile();
  const updatePassword = useUpdateStudentPassword();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? '');
    setBio(profile.bio ?? '');
    setSpecialty(profile.specialty ?? '');
    setAvatarUrl(profile.avatarUrl ?? '');
  }, [profile]);

  // FUNÇÃO PARA SALVAR O PERFIL DO ALUNO
  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Nome é obrigatório' });
      return;
    }

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        bio: bio.trim() || '',
        specialty: specialty.trim() || '',
        avatarUrl: avatarUrl.trim() || '',
      });
      toast({ title: 'Perfil atualizado com sucesso' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar perfil',
        description: error?.response?.data?.error ?? 'Tente novamente.',
      });
    }
  };

  // FUNÇÃO PARA ATUALIZAR A SENHA DO ALUNO
  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ variant: 'destructive', title: 'Preencha todos os campos de senha' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'A nova senha deve ter no mínimo 6 caracteres' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'A confirmação de senha não confere' });
      return;
    }

    try {
      await updatePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'Senha alterada com sucesso' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar senha',
        description: error?.response?.data?.error ?? 'Tente novamente.',
      });
    }
  };

  // FUNÇÃO PARA VERIFICAR SE O USUÁRIO É UM ALUNO
  if (authLoading || (user && user.role !== 'STUDENT')) {
    return <AppLayout><div className="p-10">Carregando...</div></AppLayout>;
  }

  if (isLoading) return <AppLayout><div className="p-10">Carregando perfil...</div></AppLayout>;
  if (!profile) return <AppLayout><div>Não foi possível carregar o perfil.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl min-w-0 space-y-6">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">Estudante</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Meu Perfil</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSaveProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input value={profile.email} disabled />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Área de interesse</label>
                  <Input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Ex.: clínica médica, pediatria..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL da foto (avatar)</label>
                  <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-28 resize-y"
                  placeholder="Conte um pouco sobre você e seus objetivos de estudo."
                />
              </div>

              <Button type="submit" isLoading={updateProfile.isPending}>Salvar dados</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpdatePassword} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha atual</label>
                  <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nova senha</label>
                  <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmar nova senha</label>
                  <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>

              <Button type="submit" variant="outline" isLoading={updatePassword.isPending}>
                Alterar senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
