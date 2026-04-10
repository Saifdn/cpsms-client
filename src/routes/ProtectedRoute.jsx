import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Spinner } from "@/components/ui/spinner";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { accessToken, user, loading } = useAuth();
  const location = useLocation();

  // if (loading && !accessToken) {
  //   // return spinner or null while checking refresh token
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-background backdrop-blur-sm z-50">
  //       <Spinner className="size-15" />
  //     </div>
  //   );
  // }

  if (loading) return null

  // Not logged in
  if (!accessToken) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Role restriction
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
