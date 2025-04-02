import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import AdminDashboardPage from "./pages/Admin/AdminDashboard";
import DashboardPage from "./pages/Consumer/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import './App.css';

const App = () => {
    const isAuthenticated = !!localStorage.getItem("access_token");
    return (
        <Router>
            <Routes>
                {/* Default Route - Redirect to login or dashboard */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

                <Route path="/login" element={<LoginPage />} />

            
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
