import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { ReactNode } from "react";

export default function AdminProtected({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const loc = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  }
  return <>{children}</>;
}
