import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import * as bootstrap from "bootstrap"; // Bootstrap JS

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ViewRecord from "./pages/ViewRecord";
import NewRecord from "./pages/NewRecord";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditRecord from "./pages/EditRecord";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  const [firstUser, setFirstUser] = useState(null);

  useEffect(() => {
    // Clear any stale token before checking
    localStorage.removeItem("userInfo");

    axios
      .get("/api/auth/exists")
      .then((res) => {
        // If no users exist → firstUser = true → show Register
        setFirstUser(!res.data.exists);
      })
      .catch((err) => {
        console.error("Failed to check if users exist:", err);
        // On error (e.g., 429), assume first user → show register
        setFirstUser(true);
      });
  }, []);

  // Initialize all Bootstrap tooltips once after mount
  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
  }, []); // empty deps → run once on mount

  if (firstUser === null) return null; // wait until we know if firstUser

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={firstUser ? <Register /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={firstUser ? <Register /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes with Navbar */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/records/:id"
            element={
              <>
                <Navbar />
                <ViewRecord />
              </>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <>
                <Navbar />
                <EditRecord />
              </>
            }
          />
          <Route
            path="/new"
            element={
              <>
                <Navbar />
                <NewRecord />
              </>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
