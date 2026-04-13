import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useStudentLesson, useMarkLessonProgress } from '@/hooks/use-student';
import { usePublicCourse } from '@/hooks/use-courses';
import type { LessonWithProgress } from '@/types/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChevronLeft, CheckCircle2, PlayCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// FUNÇÃO PARA CONVERTAR O URL DO VÍDEO DO YOUTUBE PARA O EMBED
function toYoutubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      const m = u.pathname.match(/\/embed\/([^/?]+)/);
      if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

// FUNÇÃO PARA MOSTRAR O VÍDEO DA AULA
function LessonVideoPanel({ lesson }: { lesson: LessonWithProgress }) {
  const placeholder = (
    <div className="relative aspect-video w-full shrink-0 bg-slate-100 flex items-center justify-center border-b">
      <FileText className="w-16 h-16 text-slate-300" />
    </div>
  );

  if (lesson.type !== 'VIDEO') {
    return placeholder;
  }

  if (lesson.videoPlaybackUrl) {
    return (
      <div className="relative aspect-video w-full shrink-0 bg-black">
        <video
          key={lesson.videoPlaybackUrl}
          src={lesson.videoPlaybackUrl}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-contain"
        >
          Seu navegador não suporta reprodução deste vídeo.
        </video>
      </div>
    );
  }

  if (lesson.videoUrl) {
    const embed = toYoutubeEmbed(lesson.videoUrl);
    if (embed) {
      return (
        <div className="relative aspect-video w-full shrink-0 bg-black">
          <iframe src={embed} className="absolute inset-0 h-full w-full" allowFullScreen title="Vídeo da aula" />
        </div>
      );
    }
    return (
      <div className="relative aspect-video w-full shrink-0 bg-black">
        <video
          src={lesson.videoUrl}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-contain"
        >
          Seu navegador não suporta reprodução deste vídeo.
        </video>
      </div>
    );
  }

  return placeholder;
}

// PÁGINA DE VISUALIZAÇÃO DA AULA - PÁGINA PARA VISUALIZAR UMA AULA
export default function LessonViewer() {
  const { courseId, lessonId } = useParams<{courseId: string, lessonId: string}>();
  
  const { data: course } = usePublicCourse(courseId);
  
  // Find actual lessonId if 'start' is passed
  let actualLessonId = lessonId;
  if (lessonId === 'start' && course?.modules?.[0]?.lessons?.[0]) {
    actualLessonId = course.modules[0].lessons[0].id;
  }

  const { data: lesson, isLoading } = useStudentLesson(actualLessonId);
  const markProgress = useMarkLessonProgress();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      await markProgress.mutateAsync({ lessonId: actualLessonId, isCompleted: !lesson?.isCompleted });
      toast({ title: lesson?.isCompleted ? "Marcado como não concluído" : "Aula concluída!" });
    } catch(e) {
      toast({ variant: "destructive", title: "Erro ao salvar progresso" });
    }
  };

  if (isLoading || !course) return <AppLayout><div className="p-20 text-center">Carregando aula...</div></AppLayout>;
  if (!lesson) return <AppLayout><div className="p-20 text-center">Aula não encontrada.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="flex w-full min-w-0 flex-col gap-4 lg:min-h-[min(100%,calc(100dvh-5rem))] lg:flex-row lg:gap-6">
        {/* Conteúdo principal: primeiro no mobile (vídeo + texto) */}
        <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-white lg:order-2 lg:min-h-[min(100%,calc(100dvh-5rem))]">
          <div className="shrink-0 overflow-hidden rounded-t-xl">
            <LessonVideoPanel lesson={lesson} />
          </div>

          <div className="min-h-0 flex-1 rounded-b-xl p-4 sm:p-6 md:p-8 lg:overflow-y-auto">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h1 className="mb-1 font-display text-xl font-bold sm:text-2xl">{lesson.title}</h1>
                <p className="text-sm text-slate-500">Aula de Módulo</p>
              </div>
              <Button
                onClick={handleComplete}
                variant={lesson.isCompleted ? 'outline' : 'default'}
                className={`w-full shrink-0 sm:w-auto ${lesson.isCompleted ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100' : ''}`}
                isLoading={markProgress.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 shrink-0" />
                {lesson.isCompleted ? 'Concluída' : 'Marcar como Concluída'}
              </Button>
            </div>

            <div className="prose prose-sm max-w-none text-slate-700 sm:prose-base">
              {lesson.description ? (
                <p>{lesson.description}</p>
              ) : (
                <p className="italic text-slate-400">Nenhuma descrição adicional para esta aula.</p>
              )}
            </div>

            {lesson.type === 'QUIZ' && lesson.quiz && (
              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center sm:mt-10 sm:p-6">
                <h3 className="mb-2 text-lg font-bold text-blue-900 sm:text-xl">{lesson.quiz.title}</h3>
                <p className="mb-4 text-sm text-blue-700 sm:mb-6 sm:text-base">
                  Avaliação com {lesson.quiz.questions.length} questões. Nota para passar: {lesson.quiz.passingScore}%
                </p>
                <Button className="w-full sm:w-auto">Iniciar Avaliação</Button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de aulas: abaixo no mobile, à esquerda no desktop */}
        <aside className="order-2 flex max-h-[min(42vh,20rem)] w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-white lg:order-1 lg:max-h-none lg:h-auto lg:max-h-[min(100%,calc(100dvh-5rem))] lg:w-80">
          <div className="shrink-0 border-b bg-slate-50 p-3 sm:p-4">
            <Link href="/student/courses">
              <Button variant="ghost" size="sm" className="-ml-2 mb-1 text-muted-foreground sm:mb-2">
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden /> Voltar
              </Button>
            </Link>
            <h3 className="line-clamp-2 font-display text-sm font-bold sm:text-base">{course.title}</h3>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain p-2 sm:space-y-4">
            {course.modules?.map((mod, i) => (
              <div key={mod.id}>
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:px-3 sm:py-2 sm:text-xs">
                  Módulo {i + 1}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {mod.lessons?.map((l) => (
                    <Link key={l.id} href={`/student/courses/${course.id}/lessons/${l.id}`}>
                      <button
                        type="button"
                        className={`flex w-full min-h-11 items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors touch-manipulation sm:gap-3 sm:px-3 sm:py-2.5 ${l.id === actualLessonId ? 'bg-primary/10 font-medium text-primary' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        {l.type === 'VIDEO' ? (
                          <PlayCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        ) : (
                          <FileText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        )}
                        <span className="line-clamp-2">{l.title}</span>
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
