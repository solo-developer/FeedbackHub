import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "./contexts/ToastContext"; // Import the ToastProvider
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import Auth Context

import LoginPage from "./pages/Login";
import AdminDashboardPage from "./pages/Admin/AdminDashboard";
import DashboardPage from "./pages/Consumer/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ToastContainer position="top-right" />
    </ToastProvider>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, role, setAuthState } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setAuthState(true, decodedToken.role); 
      } catch (error) {
        console.error("Token decoding error:", error);
        setAuthState(false, null);
      }
    } else {
      setAuthState(false, null);
    }
  }, [setAuthState]); 

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? (role === "superadmin" ? "/admin-dashboard" : "/dashboard") : "/login"} />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/*" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
