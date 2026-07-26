
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/admin/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Users from "../pages/admin/Users";
import AIChat from "../pages/admin/AIChat";
import Security from "../pages/admin/Security";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />

                    <Route
                        path="users"
                        element={<Users />}
                    />

                    <Route
                        path="chat"
                        element={<AIChat />}
                    />

                    <Route
                        path="security"
                        element={<Security />}
                    />

                    <Route
                        path="analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="settings"
                        element={<Settings />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}