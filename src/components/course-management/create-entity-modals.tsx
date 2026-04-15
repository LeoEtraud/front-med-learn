import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateCourse, useCreateLesson, useCreateModule } from "@/hooks/use-teacher";
import type { CourseLevel, LessonType } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function parseRequestError(error: unknown, fallback: string) {
  const ax = error as { response?: { data?: { error?: string } }; message?: string };
  return ax?.response?.data?.error || ax?.message || fallback;
}

type ModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  submitLabel: string;
};

function ModalShell({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  children,
  isSubmitting = false,
  errorMessage,
  submitLabel,
}: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          {errorMessage ? (
            <Alert variant="destructive" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Não foi possível salvar</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {children}

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const courseSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  subtitle: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  coverImageUrl: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^https?:\/\/\S+$/i.test(v), "Informe uma URL válida"),
  specialty: z.string().trim().optional(),
  level: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
  workloadHours: z
    .union([z.literal(""), z.coerce.number().int().min(1, "Carga horária deve ser maior que 0")])
    .optional(),
  tags: z.string().trim().optional(),
});

type CreateCourseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CourseFormValues = z.infer<typeof courseSchema>;

export function CreateCourseModal({ open, onOpenChange }: CreateCourseModalProps) {
  const createCourse = useCreateCourse();
  const { toast } = useToast();
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      shortDescription: "",
      description: "",
      coverImageUrl: "",
      specialty: "",
      level: "BASIC",
      workloadHours: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setRequestError(null);
      form.reset();
    }
  }, [open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setRequestError(null);
    try {
      await createCourse.mutateAsync({
        title: values.title,
        subtitle: values.subtitle || undefined,
        shortDescription: values.shortDescription || undefined,
        description: values.description || undefined,
        coverImageUrl: values.coverImageUrl || undefined,
        specialty: values.specialty || undefined,
        level: values.level,
        workloadHours: values.workloadHours === "" ? undefined : values.workloadHours,
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      });
      toast({ variant: "success", title: "Curso criado com sucesso" });
      onOpenChange(false);
    } catch (error) {
      setRequestError(parseRequestError(error, "Erro inesperado ao criar curso"));
    }
  });

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Novo Curso"
      description="Preencha os dados principais para criar um novo curso."
      onSubmit={onSubmit}
      isSubmitting={createCourse.isPending}
      errorMessage={requestError}
      submitLabel="Criar curso"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Título *</label>
          <Input {...form.register("title")} placeholder="Ex.: Fisiologia Cardiovascular" />
          {form.formState.errors.title ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nível</label>
          <Select
            value={form.watch("level")}
            onValueChange={(value) => form.setValue("level", value as CourseLevel, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BASIC">Básico</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
              <SelectItem value="ADVANCED">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Carga horária (horas)</label>
          <Input type="number" min={1} placeholder="Ex.: 40" {...form.register("workloadHours")} />
          {form.formState.errors.workloadHours ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.workloadHours.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Subtítulo</label>
          <Input {...form.register("subtitle")} placeholder="Resumo curto do curso" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Especialidade</label>
          <Input {...form.register("specialty")} placeholder="Ex.: Cardiologia" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Descrição curta</label>
          <Textarea rows={2} {...form.register("shortDescription")} placeholder="Descrição breve para listagens" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Descrição completa</label>
          <Textarea rows={4} {...form.register("description")} placeholder="Detalhes completos do curso" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">URL da capa</label>
          <Input {...form.register("coverImageUrl")} placeholder="https://..." />
          {form.formState.errors.coverImageUrl ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.coverImageUrl.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Tags</label>
          <Input {...form.register("tags")} placeholder="cardio, ecg, emergência" />
          <p className="text-xs text-muted-foreground">Separe por vírgula.</p>
        </div>
      </div>
    </ModalShell>
  );
}

const moduleSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  description: z.string().trim().optional(),
  order: z
    .union([z.literal(""), z.coerce.number().int().min(0, "Ordem não pode ser negativa")])
    .optional(),
});

type CreateModuleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  defaultOrder?: number;
};

type ModuleFormValues = z.infer<typeof moduleSchema>;

export function CreateModuleModal({ open, onOpenChange, courseId, defaultOrder }: CreateModuleModalProps) {
  const createModule = useCreateModule();
  const { toast } = useToast();
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { title: "", description: "", order: defaultOrder ?? "" },
  });

  useEffect(() => {
    if (!open) {
      setRequestError(null);
      form.reset({ title: "", description: "", order: defaultOrder ?? "" });
    }
  }, [open, defaultOrder, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setRequestError(null);
    try {
      await createModule.mutateAsync({
        courseId,
        title: values.title,
        description: values.description || undefined,
        order: values.order === "" ? undefined : values.order,
      });
      toast({ variant: "success", title: "Módulo criado com sucesso" });
      onOpenChange(false);
    } catch (error) {
      setRequestError(parseRequestError(error, "Erro inesperado ao criar módulo"));
    }
  });

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Novo Módulo"
      description="Crie um módulo vinculado ao curso atual."
      onSubmit={onSubmit}
      isSubmitting={createModule.isPending}
      errorMessage={requestError}
      submitLabel="Criar módulo"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Título *</label>
          <Input {...form.register("title")} placeholder="Ex.: Fundamentos de ECG" />
          {form.formState.errors.title ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea rows={3} {...form.register("description")} placeholder="Resumo do conteúdo do módulo" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Ordem</label>
          <Input type="number" min={0} {...form.register("order")} />
          {form.formState.errors.order ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.order.message}</p>
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
}

const lessonSchema = z.object({
  moduleId: z.string().trim().min(1, "Selecione um módulo"),
  title: z.string().trim().min(1, "Título é obrigatório"),
  description: z.string().trim().optional(),
  type: z.enum(["VIDEO", "TEXT", "PDF", "QUIZ", "MIXED"]),
  order: z
    .union([z.literal(""), z.coerce.number().int().min(0, "Ordem não pode ser negativa")])
    .optional(),
  duration: z
    .union([z.literal(""), z.coerce.number().int().min(1, "Duração deve ser maior que 0")])
    .optional(),
  isPublished: z.boolean(),
});

type ModuleOption = {
  id: string;
  title: string;
};

type CreateLessonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleOptions: ModuleOption[];
  defaultModuleId?: string;
  defaultOrder?: number;
};

type LessonFormValues = z.infer<typeof lessonSchema>;

export function CreateLessonModal({
  open,
  onOpenChange,
  moduleOptions,
  defaultModuleId,
  defaultOrder,
}: CreateLessonModalProps) {
  const createLesson = useCreateLesson();
  const { toast } = useToast();
  const [requestError, setRequestError] = useState<string | null>(null);

  const firstModuleId = useMemo(() => defaultModuleId || moduleOptions[0]?.id || "", [defaultModuleId, moduleOptions]);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      moduleId: firstModuleId,
      title: "",
      description: "",
      type: "VIDEO",
      order: defaultOrder ?? "",
      duration: "",
      isPublished: true,
    },
  });

  useEffect(() => {
    if (!open) {
      setRequestError(null);
      form.reset({
        moduleId: firstModuleId,
        title: "",
        description: "",
        type: "VIDEO",
        order: defaultOrder ?? "",
        duration: "",
        isPublished: true,
      });
    }
  }, [open, defaultOrder, firstModuleId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setRequestError(null);
    try {
      await createLesson.mutateAsync({
        moduleId: values.moduleId,
        title: values.title,
        description: values.description || undefined,
        type: values.type,
        order: values.order === "" ? undefined : values.order,
        duration: values.duration === "" ? undefined : values.duration,
        isPublished: values.isPublished,
      });
      toast({ variant: "success", title: "Aula criada com sucesso" });
      onOpenChange(false);
    } catch (error) {
      setRequestError(parseRequestError(error, "Erro inesperado ao criar aula"));
    }
  });

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Nova Aula"
      description="Crie uma aula vinculada a um módulo do curso."
      onSubmit={onSubmit}
      isSubmitting={createLesson.isPending}
      errorMessage={requestError}
      submitLabel="Criar aula"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Módulo *</label>
          <Select
            value={form.watch("moduleId")}
            onValueChange={(value) => form.setValue("moduleId", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um módulo" />
            </SelectTrigger>
            <SelectContent>
              {moduleOptions.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.moduleId ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.moduleId.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Título *</label>
          <Input {...form.register("title")} placeholder="Ex.: Anatomia do Coração" />
          {form.formState.errors.title ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea rows={3} {...form.register("description")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tipo</label>
          <Select
            value={form.watch("type")}
            onValueChange={(value) => form.setValue("type", value as LessonType, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIDEO">Vídeo</SelectItem>
              <SelectItem value="TEXT">Texto</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="QUIZ">Quiz</SelectItem>
              <SelectItem value="MIXED">Misto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Ordem</label>
          <Input type="number" min={0} {...form.register("order")} />
          {form.formState.errors.order ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.order.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Duração (minutos)</label>
          <Input type="number" min={1} {...form.register("duration")} />
          {form.formState.errors.duration ? (
            <p className="text-xs font-medium text-destructive">{form.formState.errors.duration.message}</p>
          ) : null}
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium">
          <Checkbox
            checked={form.watch("isPublished")}
            onCheckedChange={(checked) => form.setValue("isPublished", checked === true)}
          />
          Publicar aula imediatamente
        </label>
      </div>
    </ModalShell>
  );
}
