import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "./contexts/ToastContext"; // Import the ToastProvider
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import Auth Context

import AdminDashboardPage from "./pages/Admin/AdminDashboard";
import DashboardPage from "./pages/Consumer/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import AccessDenied from './components/AccessDenied';
import HomeScreenPage from './pages/HomeScreen';
import RegistrationRequestPage from './pages/Consumer/RegistrationRequest';
import { AppSwitcherProvider } from './contexts/AppSwitcherContext';
import { ADMIN_ROLE } from './utils/Constants';
import EditFeedbackPage from './pages/Shared/Feedback/EditFeedback';
import ChangePasswordPage from './pages/ChangePassword';
import { UserProvider } from './contexts/UserContext';

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

        <Route path="/login" element={<HomeScreenPage />} />
        <Route path="/register" element={<RegistrationRequestPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<UserProvider> <AdminDashboardPage /></UserProvider>} />
          <Route path="/admin/*" element={
            <UserProvider>
              <AdminDashboardPage />
            </UserProvider>} />
          <Route path="/consumer/*" element={
            <UserProvider>
              <AppSwitcherProvider>
                <DashboardPage />
              </AppSwitcherProvider>
            </UserProvider>} />
          <Route path="/feedback/:id" element={ <UserProvider><EditFeedbackPage></EditFeedbackPage></UserProvider>} />
          <Route path="/profile/change-password" element={<UserProvider>
            <ChangePasswordPage></ChangePasswordPage>
          </UserProvider>} />
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/" element={
            <Navigate to={isAuthenticated ? (role === ADMIN_ROLE ? "/admin-dashboard" : "/consumer") : "/login"} />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
