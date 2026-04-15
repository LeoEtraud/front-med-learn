# Guia de Performance React 2026

Este guia atualiza as práticas de performance para React em 2026 e inclui as otimizações aplicadas nesta aplicação.

## 1) Prioridade: medir antes de otimizar

- Monitore Web Vitals com foco em `LCP`, `INP` e `CLS`.
- Use React DevTools Profiler para identificar componentes com commits caros.
- Defina budgets de performance por rota (bundle, tempo de carregamento e INP).

## 2) Renderização e memoização em 2026

- Evite re-render desnecessário por arquitetura de dados e composição.
- Use `React.memo`, `useMemo` e `useCallback` quando houver gargalo comprovado.
- Se React Compiler estiver habilitado no projeto, prefira remover memoização manual redundante.

## 3) Split de código por rota e por feature

- Carregue páginas pesadas com `React.lazy` + `Suspense`.
- Mantenha fallback leve e consistente para melhorar percepção de fluidez.
- Garanta que o bundle inicial contenha apenas o necessário para o primeiro paint.

## 4) Estratégia de dados com TanStack Query

- Configure defaults globais para reduzir refetch agressivo.
- Ajuste `staleTime` e `gcTime` conforme criticidade de cada consulta.
- Use `placeholderData` para evitar piscadas durante troca de filtros/páginas.

## 5) Interação fluida

- Debounce em buscas com input livre para reduzir chamadas desnecessárias.
- Use `useTransition`/`useDeferredValue` quando atualização não precisa bloquear digitação.
- Faça lazy-loading de imagens e assets fora da dobra.

## 6) Checklist 2026

- [ ] Rota inicial com bundle mínimo.
- [ ] Navegação sem bloqueio e sem flashes.
- [ ] Queries com `staleTime` apropriado.
- [ ] Busca com debounce.
- [ ] Imagens com `loading="lazy"` e compressão adequada.
- [ ] Métricas reais (RUM) acompanhadas continuamente.

---

## O que foi aplicado neste projeto

1. `src/App.tsx`
   - Rotas migradas para `React.lazy` + `Suspense` com fallback `PageLoading`.
   - `QueryClient` com defaults para reduzir refetch desnecessário:
     - `refetchOnWindowFocus: false`
     - `refetchOnReconnect: false`
     - `staleTime: 60_000`
     - `gcTime: 5 * 60_000`

2. `src/pages/public/CourseCatalog.tsx`
   - Busca com debounce (`350ms`) para reduzir chamadas por tecla.
   - Imagens do catálogo com `loading="lazy"` e `decoding="async"`.

3. `src/hooks/use-courses.ts`
   - `placeholderData` em `usePublicCourses` para manter dados anteriores durante novas consultas.

4. `src/components/layout/AppLayout.tsx`
   - Redirecionamento para `/login` movido para `useEffect`, evitando side-effect durante render.

5. `src/hooks/use-debounced-value.ts`
   - Novo hook utilitário reutilizável para debounce de valores.
