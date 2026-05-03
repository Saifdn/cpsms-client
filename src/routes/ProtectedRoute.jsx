import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still loading user data
  if (loading) {
    // return (
    //   <div className="flex min-h-screen items-center justify-center">
    //     <p className="text-muted-foreground">Loading...</p>
    //   </div>
    // );
    return null;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If no specific roles required → allow any logged-in user
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Role check (safe guard against undefined role)
  const userRole = user.role || user.Role || "";   // handle different casing

  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  // Role not allowed
  console.warn(`Access denied. User role "${userRole}" not in allowed roles:`, allowedRoles);
  return <Navigate to="/dashboard" replace />;
};