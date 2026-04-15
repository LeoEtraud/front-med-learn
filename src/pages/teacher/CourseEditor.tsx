import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'wouter';
import {
  useTeacherCourse,
  useUpdateCourse,
  usePresignLessonVideo,
  useUpdateLesson,
} from '@/hooks/use-teacher';
import type { Lesson } from '@/types/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageLoading } from '@/components/ui/page-loading';
import { useForm } from 'react-hook-form';
import { Plus, Video, FileQuestion, GripVertical, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateLessonModal, CreateModuleModal } from '@/components/course-management/create-entity-modals';

// FUNÇÃO PARA PARSEAR O ERRO DO S3
function parseS3ErrorText(raw: string): string | null {
  const code = raw.match(/<Code>([^<]+)<\/Code>/)?.[1];
  const message = raw.match(/<Message>([^<]+)<\/Message>/)?.[1];
  if (!code && !message) return null;
  return [code, message].filter(Boolean).join(': ');
}

type UploadWithProgressParams = {
  uploadUrl: string;
  file: File;
  contentType: string;
  onProgress: (percent: number) => void;
};

function uploadFileWithProgress({ uploadUrl, file, contentType, onProgress }: UploadWithProgressParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100)));
      onProgress(percent);
    };

    xhr.onerror = () => reject(new Error('Falha de rede durante o upload do vídeo.'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      const rawBody = typeof xhr.responseText === 'string' ? xhr.responseText : '';
      const s3Reason = parseS3ErrorText(rawBody);
      reject(new Error(s3Reason ? `Upload falhou (${xhr.status}) - ${s3Reason}` : `Upload falhou (${xhr.status})`));
    };

    xhr.send(file);
  });
}

// FUNÇÃO PARA EDITAR UMA AULA
function LessonEditorRow({ lesson }: { lesson: Lesson }) {
  const presign = usePresignLessonVideo();
  const updateLesson = useUpdateLesson();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const localPreviewRef = useRef<string | null>(null);
  const [externalUrl, setExternalUrl] = useState(lesson.videoUrl ?? '');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingVideo, setIsRemovingVideo] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localVideoPreviewUrl, setLocalVideoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (lesson.videoObjectKey) {
      setExternalUrl('');
    } else {
      setExternalUrl(lesson.videoUrl ?? '');
    }
  }, [lesson.id, lesson.videoUrl, lesson.videoObjectKey]);

  useEffect(() => {
    return () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }
    };
  }, []);

  const hasHosted = !!lesson.videoObjectKey;
  const hasExternal = !!lesson.videoUrl && !hasHosted;
  const previewUrl = localVideoPreviewUrl || lesson.videoPlaybackUrl || (!hasHosted ? lesson.videoUrl : null) || null;
  const busy = isUploading || presign.isPending || (updateLesson.isPending && !isRemovingVideo);

  const setLocalPreviewFromFile = (file: File) => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    localPreviewRef.current = objectUrl;
    setLocalVideoPreviewUrl(objectUrl);
  };

  const clearLocalPreview = () => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = null;
    }
    setLocalVideoPreviewUrl(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast({ variant: 'destructive', title: 'Selecione um arquivo de vídeo' });
      return;
    }
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const { uploadUrl, objectKey, headers } = await presign.mutateAsync({
        lessonId: lesson.id,
        fileName: file.name,
        contentType: file.type,
        fileSizeBytes: file.size,
      });
      await uploadFileWithProgress({
        uploadUrl,
        file,
        contentType: headers['Content-Type'],
        onProgress: (percent) => setUploadProgress(percent),
      });
      await updateLesson.mutateAsync({ id: lesson.id, data: { videoObjectKey: objectKey } });
      setLocalPreviewFromFile(file);
      setExternalUrl('');
      toast({ variant: 'success', title: 'Vídeo enviado com sucesso' });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string };
      toast({
        variant: 'destructive',
        title: 'Falha no upload',
        description: ax?.response?.data?.error || ax?.message || 'Verifique CORS do bucket e variáveis S3/R2.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
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
      clearLocalPreview();
      toast({ variant: 'success', title: 'Link externo salvo' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao salvar link' });
    }
  };

  const onDeleteVideo = async () => {
    setIsRemovingVideo(true);
    try {
      await updateLesson.mutateAsync({ id: lesson.id, data: { videoObjectKey: null, videoUrl: null } });
      clearLocalPreview();
      setExternalUrl('');
      setUploadProgress(null);
      toast({ variant: 'success', title: 'Vídeo removido com sucesso' });
    } catch {
      toast({ variant: 'destructive', title: 'Falha ao remover vídeo' });
    } finally {
      setIsRemovingVideo(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/70" />
          {lesson.type === 'VIDEO' ? (
            <Video className="w-4 h-4 text-blue-500 shrink-0" />
          ) : (
            <FileQuestion className="w-4 h-4 text-orange-500 shrink-0" />
          )}
          <span className="truncate text-sm font-medium text-foreground">{lesson.title}</span>
        </div>
        <span className="shrink-0 text-[10px] font-bold uppercase text-muted-foreground">
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
          Upload de Vídeo
        </Button>
      </div>

      {uploadProgress !== null && (
        <div className="space-y-1.5 rounded-md border border-border/70 bg-muted/40 p-2.5">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Enviando vídeo...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2.5" />
        </div>
      )}

      {previewUrl && (
        <div className="rounded-md border border-border/70 bg-muted/30 p-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Pré-visualização do vídeo</p>
              <div className="w-full max-w-[15rem] overflow-hidden rounded-md bg-black/90 sm:max-w-[16rem]">
                <video src={previewUrl} controls preload="metadata" className="aspect-video w-full" />
              </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="shrink-0"
                onClick={() => setIsDeleteDialogOpen(true)}
                isLoading={isRemovingVideo}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir vídeo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este vídeo? Essa ação remove a pré-visualização e desvincula o vídeo da aula.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRemovingVideo}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={async (event) => {
                      event.preventDefault();
                      await onDeleteVideo();
                      setIsDeleteDialogOpen(false);
                    }}
                    disabled={isRemovingVideo}
                  >
                    {isRemovingVideo ? 'Excluindo...' : 'Excluir'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <div className="flex-1 space-y-1 min-w-0">
          <label className="text-xs font-medium text-muted-foreground">Link externo (ex.: YouTube)</label>
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
        <p className="text-xs text-muted-foreground">
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
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'modules'>('modules');
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState<string | undefined>(undefined);

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
      toast({ variant: 'success', title: 'Curso atualizado' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao salvar' });
    }
  };

  const handleAddModule = () => setIsModuleModalOpen(true);
  const handleAddLesson = (moduleId?: string) => {
    setSelectedModuleIdForLesson(moduleId);
    setIsLessonModalOpen(true);
  };

  if (isLoading) return <AppLayout><PageLoading message="Carregando editor..." /></AppLayout>;
  if (!course) return <AppLayout><div>Curso não encontrado</div></AppLayout>;

  return (
    <AppLayout>
      <CreateModuleModal
        open={isModuleModalOpen}
        onOpenChange={setIsModuleModalOpen}
        courseId={id!}
        defaultOrder={(course.modules?.length || 0) + 1}
      />
      <CreateLessonModal
        open={isLessonModalOpen}
        onOpenChange={setIsLessonModalOpen}
        defaultModuleId={selectedModuleIdForLesson}
        defaultOrder={99}
        moduleOptions={(course.modules || []).map((mod) => ({
          id: mod.id,
          title: mod.title,
        }))}
      />
      <div className="mx-auto max-w-[92rem] min-w-0 space-y-6">
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
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium touch-manipulation sm:px-4 ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('info')}
          >
            Informações Básicas
          </button>
          <button
            type="button"
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium touch-manipulation sm:px-4 ${activeTab === 'modules' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
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
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => handleAddLesson()} className="w-full sm:w-auto" disabled={!course.modules?.length}>
                <Plus className="mr-2 h-4 w-4" /> Nova Aula
              </Button>
              <Button type="button" onClick={handleAddModule} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Novo Módulo
              </Button>
            </div>

            <div className="space-y-4">
              {course.modules?.map((mod, index) => (
                <Card key={mod.id} className="border-border">
                  <div className="flex flex-col gap-3 rounded-t-xl border-b border-border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                    <h3 className="flex min-w-0 items-center gap-2 text-base font-bold sm:gap-3 sm:text-lg">
                      <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground/70" aria-hidden />
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
                      <Plus className="mr-1 h-4 w-4" /> Nova Aula
                    </Button>
                  </div>
                  <div className="bg-card p-3 sm:p-4">
                    {mod.lessons?.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma aula neste módulo.</p>
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
                <div className="rounded-xl border-2 border-dashed border-border py-12 text-center text-muted-foreground">
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
