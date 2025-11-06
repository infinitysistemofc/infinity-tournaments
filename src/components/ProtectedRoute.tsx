import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHasRole, AppRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const { hasRole, isLoading: roleLoading } = useHasRole(requiredRole || "player");

  // Show loading state
  if (requiredRole && roleLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Check role
  if (requiredRole && !hasRole) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">Acesso Negado</h1>
        <p className="text-muted-foreground mb-8">
          Você não tem permissão para acessar esta página.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <>{children}</>;
};
