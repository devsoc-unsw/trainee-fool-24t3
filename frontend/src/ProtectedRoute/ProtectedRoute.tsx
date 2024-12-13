import { ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  if (!props.isAuthenticated) {
    if (props.fallback) {
      return props.fallback;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return props.children;
};
