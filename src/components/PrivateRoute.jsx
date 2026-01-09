import { Navigate, Outlet } from "react-router-dom";

// PrivateRoute checks the token inside userInfo in localStorage
export default function PrivateRoute() {
  // Grab userInfo from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // If no token, redirect to login
  if (!userInfo?.token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the child route(s)
  return <Outlet />;
}
