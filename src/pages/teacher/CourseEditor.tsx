import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'wouter';
import {
  useTeacherCourse,
  useUpdateCourse,
  useCreateModule,
  useCreateLesson,
  usePresignLessonVideo,
  useUpdateLesson,
} from '@/hooks/use-teacher';
import type { Lesson } from '@/types/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Plus, Video, FileQuestion, GripVertical, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// FUNÇÃO PARA PARSEAR O ERRO DO S3
function parseS3ErrorText(raw: string): string | null {
  const code = raw.match(/<Code>([^<]+)<\/Code>/)?.[1];
  const message = raw.match(/<Message>([^<]+)<\/Message>/)?.[1];
  if (!code && !message) return null;
  return [code, message].filter(Boolean).join(': ');
}

// FUNÇÃO PARA EDITAR UMA AULA
function LessonEditorRow({ lesson }: { lesson: Lesson }) {
  const presign = usePresignLessonVideo();
  const updateLesson = useUpdateLesson();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [externalUrl, setExternalUrl] = useState(lesson.videoUrl ?? '');

  useEffect(() => {
    if (lesson.videoObjectKey) {
      setExternalUrl('');
    } else {
      setExternalUrl(lesson.videoUrl ?? '');
    }
  }, [lesson.id, lesson.videoUrl, lesson.videoObjectKey]);

  const hasHosted = !!lesson.videoObjectKey;
  const hasExternal = !!lesson.videoUrl && !hasHosted;
  const busy = presign.isPending || updateLesson.isPending;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast({ variant: 'destructive', title: 'Selecione um arquivo de vídeo' });
      return;
    }
    try {
      const { uploadUrl, objectKey, headers } = await presign.mutateAsync({
        lessonId: lesson.id,
        fileName: file.name,
        contentType: file.type,
        fileSizeBytes: file.size,
      });
      const put = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': headers['Content-Type'] },
      });
      if (!put.ok) {
        const errorBody = await put.text();
        const s3Reason = parseS3ErrorText(errorBody);
        throw new Error(s3Reason ? `Upload falhou (${put.status}) - ${s3Reason}` : `Upload falhou (${put.status})`);
      }
      await updateLesson.mutateAsync({ id: lesson.id, data: { videoObjectKey: objectKey } });
      toast({ title: 'Vídeo enviado e vinculado à aula' });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string };
      toast({
        variant: 'destructive',
        title: 'Falha no upload',
        description: ax?.response?.data?.error || ax?.message || 'Verifique CORS do bucket e variáveis S3/R2.',
      });
    }
  };

  const onSaveExternal = async () => {
    const url = externalUrl.trim();
    if (!url) {
      toast({ variant: 'destructive', title: 'Cole um link válido' });
      return;
    }
    try {
      await updateLesson.mutateAsync({ id: lesson.id, data: { videoUrl: url, videoObjectKey: null } });
      toast({ title: 'Link externo salvo' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao salvar link' });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-lg bg-white">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <GripVertical className="text-slate-300 w-4 h-4 shrink-0 cursor-grab" />
          {lesson.type === 'VIDEO' ? (
            <Video className="w-4 h-4 text-blue-500 shrink-0" />
          ) : (
            <FileQuestion className="w-4 h-4 text-orange-500 shrink-0" />
          )}
          <span className="font-medium text-sm truncate">{lesson.title}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
          {hasHosted ? 'Bucket' : hasExternal ? 'Externo' : 'Sem vídeo'}
        </span>
      </div>

      <input
        type="file"
        ref={fileRef}
        accept="video/mp4,video/webm,video/quicktime,video/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()} isLoading={busy}>
          <Upload className="w-4 h-4 mr-1" />
          Enviar vídeo (S3/R2)
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <div className="flex-1 space-y-1 min-w-0">
          <label className="text-xs font-medium text-slate-600">Link externo (ex.: YouTube)</label>
          <Input
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="h-9"
          />
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onSaveExternal} isLoading={updateLesson.isPending}>
          Usar link externo
        </Button>
      </div>
      {hasHosted && (
        <p className="text-xs text-slate-500">
          Salvar um link externo substitui o vídeo do bucket nesta aula (o arquivo antigo pode permanecer no armazenamento
          até você apagá-lo manualmente).
        </p>
      )}
    </div>
  );
}

// PÁGINA DE EDITOR DE CURSO - PÁGINA PARA EDITAR UM CURSO
export default function CourseEditor() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useTeacherCourse(id!);
  const updateCourse = useUpdateCourse();
  const createModule = useCreateModule();
  const createLesson = useCreateLesson();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'modules'>('modules');

  type CourseInfoForm = {
    title?: string;
    subtitle?: string;
    description?: string;
  };

  const { register, handleSubmit } = useForm<CourseInfoForm>({
    values: course
      ? {
          title: course.title ?? undefined,
          subtitle: course.subtitle ?? undefined,
          description: course.description ?? undefined,
        }
      : {},
  });

  const onSaveInfo = async (data: CourseInfoForm) => {
    try {
      await updateCourse.mutateAsync({ id: id!, data });
      toast({ title: 'Curso atualizado' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao salvar' });
    }
  };

  const handleAddModule = async () => {
    const title = prompt('Nome do Módulo:');
    if (!title) return;
    try {
      await createModule.mutateAsync({ courseId: id, title, order: (course?.modules?.length || 0) + 1 });
      toast({ title: 'Módulo adicionado' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao criar módulo' });
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    const title = prompt('Título da Aula:');
    if (!title) return;
    try {
      await createLesson.mutateAsync({
        moduleId,
        title,
        type: 'VIDEO',
        order: 99,
        isPublished: true,
      });
      toast({ title: 'Aula adicionada' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao criar aula' });
    }
  };

  if (isLoading) return <AppLayout><div className="p-10">Carregando editor...</div></AppLayout>;
  if (!course) return <AppLayout><div>Curso não encontrado</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl min-w-0 space-y-6">
        <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">Editor de Curso</p>
            <h1 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">{course.title}</h1>
          </div>
          <Button variant="outline" className="w-full shrink-0 sm:w-auto">
            Pré-visualizar
          </Button>
        </div>

        <div className="-mx-1 flex gap-1 overflow-x-auto border-b pb-px sm:mx-0 sm:gap-2 sm:overflow-visible">
          <button
            type="button"
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium touch-manipulation sm:px-4 ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('info')}
          >
            Informações Básicas
          </button>
          <button
            type="button"
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium touch-manipulation sm:px-4 ${activeTab === 'modules' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('modules')}
          >
            Módulos e Aulas
          </button>
        </div>

        {activeTab === 'info' && (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit(onSaveInfo)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input {...register('title')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subtítulo</label>
                    <Input {...register('subtitle')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição Completa</label>
                  <textarea
                    {...register('description')}
                    className="min-h-32 w-full resize-y rounded-md border border-input bg-background p-3 text-base md:text-sm"
                  />
                </div>
                <Button type="submit" isLoading={updateCourse.isPending}>
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex justify-stretch sm:justify-end">
              <Button type="button" onClick={handleAddModule} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Novo Módulo
              </Button>
            </div>

            <div className="space-y-4">
              {course.modules?.map((mod, index) => (
                <Card key={mod.id} className="border-slate-300">
                  <div className="flex flex-col gap-3 rounded-t-xl border-b bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                    <h3 className="flex min-w-0 items-center gap-2 text-base font-bold sm:gap-3 sm:text-lg">
                      <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-slate-400" aria-hidden />
                      <span className="truncate">
                        Módulo {index + 1}: {mod.title}
                      </span>
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full shrink-0 sm:w-auto"
                      onClick={() => handleAddLesson(mod.id)}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Aula
                    </Button>
                  </div>
                  <div className="bg-white p-3 sm:p-4">
                    {mod.lessons?.length === 0 ? (
                      <p className="text-center text-slate-400 py-4 text-sm">Nenhuma aula neste módulo.</p>
                    ) : (
                      <div className="space-y-3">
                        {mod.lessons?.map((lesson) => (
                          <LessonEditorRow key={lesson.id} lesson={lesson as Lesson} />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {(!course.modules || course.modules.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl text-slate-500">
                  Comece adicionando seu primeiro módulo.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
