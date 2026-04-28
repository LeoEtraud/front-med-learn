import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MedlearnAiChatProvider } from "@/contexts/medlearn-ai-chat-context";
import { AppRoutes, AuthenticatedFloatingChat } from "@/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300} skipDelayDuration={200}>
        <MedlearnAiChatProvider apiEndpoint="/api/chat">
          <AppRoutes />
          <AuthenticatedFloatingChat />
        </MedlearnAiChatProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
