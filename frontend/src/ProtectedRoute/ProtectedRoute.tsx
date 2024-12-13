import { ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  if (!props.isAuthenticated) {
    return <Navigate to="/unauthenticated" replace />;
  }

  return props.children;
};
