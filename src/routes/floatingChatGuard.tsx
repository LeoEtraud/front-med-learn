import { useLocation } from "react-router-dom";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { useAuth } from "@/hooks/use-auth";
import { isPublicAuthPath } from "./publicPaths";

export function AuthenticatedFloatingChat() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || isPublicAuthPath(location.pathname)) return null;

  return <FloatingChatButton />;
}
