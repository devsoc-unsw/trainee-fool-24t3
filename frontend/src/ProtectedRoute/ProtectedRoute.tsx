import { ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  user: boolean;
  children: ReactNode;
}

export const ProtectedRoute = (
  isAuthenticated: boolean,
  props: ProtectedRouteProps
) => {
  if (!isAuthenticated) {
    return <Navigate to="/unauthenticated" replace />;
  }

  return props.children;
};
