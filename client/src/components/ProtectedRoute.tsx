// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // While auth is still initializing (checking token/profile)
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the nested route
  return <Outlet />;
};

export default ProtectedRoute;