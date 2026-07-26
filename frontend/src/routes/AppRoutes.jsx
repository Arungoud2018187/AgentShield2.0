import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../layouts/DashboardLayout";

// Dashboards
import AdminDashboard from "../pages/admin/Dashboard";
import AnalystDashboard from "../pages/analyst/Dashboard";

// Admin Pages
import Users from "../pages/admin/Users";
import AIChat from "../pages/chat/AIChat";
import Security from "../pages/admin/Security";
import SecurityCopilot from "../pages/admin/SecurityCopilot";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Analyst */}
        <Route
          path="/analyst"
          element={
            <ProtectedRoute>
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<Users />}
          />

          {/* AI Chat */}
          <Route
            path="chat"
            element={<AIChat />}
          />

          {/* Security */}
          <Route
            path="security"
            element={<Security />}
          />

          {/* Security Copilot */}
          <Route
            path="security-copilot"
            element={<SecurityCopilot />}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<Analytics />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}