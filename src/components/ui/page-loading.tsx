import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type PageLoadingProps = {
  message?: string;
  className?: string;
};

export function PageLoading({ message = 'Carregando...', className }: PageLoadingProps) {
  return (
    <div className={cn('flex min-h-full w-full flex-col items-center justify-center gap-3 p-10 text-center', className)}>
      <Spinner className="size-7 text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
