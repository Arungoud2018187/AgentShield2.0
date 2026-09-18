import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

// Role-Specific Layouts
import AdminLayout from "../layouts/AdminLayout";
import SocLayout from "../layouts/SocLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// ==========================
// ADMIN PAGES
// ==========================
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import RolesAndDepartments from "../pages/admin/RolesAndDepartments";
import SecurityPolicies from "../pages/admin/SecurityPolicies";
import AuditLogs from "../pages/admin/AuditLogs";
import Analytics from "../pages/admin/Analytics";
import Security from "../pages/admin/Security";
import AdminSecurityCopilot from "../pages/admin/SecurityCopilot";
import Settings from "../pages/admin/Settings";

// ==========================
// SOC ANALYST PAGES
// ==========================
import SocDashboard from "../pages/soc/SocDashboard";
import SocSecurityCopilot from "../pages/soc/SecurityCopilot";
import SecurityEvents from "../pages/soc/SecurityEvents";
import Incidents from "../pages/soc/Incidents";
import AgentMonitoring from "../pages/soc/AgentMonitoring";

// ==========================
// EMPLOYEE PAGES
// ==========================
import EmployeeDashboard from "../pages/employee/Dashboard";
import Profile from "../pages/employee/Profile";
import Notifications from "../pages/employee/Notifications";
import EmployeeSettings from "../pages/employee/Settings";
import ReportIncident from "../pages/employee/ReportIncident";

// ==========================
// SHARED AI CHAT
// ==========================
import AIChat from "../pages/chat/AIChat";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================
              LOGIN / AUTH
        ====================== */}
        <Route path="/" element={<Login />} />

        {/* ======================
              ADMINISTRATOR PORTAL
        ====================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles-departments" element={<RolesAndDepartments />} />
          <Route path="policies" element={<SecurityPolicies />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="security" element={<Security />} />
          <Route path="security-copilot" element={<AdminSecurityCopilot />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<AIChat />} />
        </Route>

        {/* ======================
              SOC ANALYST PORTAL
        ====================== */}
        <Route
          path="/soc"
          element={
            <ProtectedRoute roles={["ANALYST", "ADMIN"]}>
              <SocLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SocDashboard />} />
          <Route path="security-copilot" element={<SocSecurityCopilot />} />
          <Route path="events" element={<SecurityEvents />} />
          <Route path="threats" element={<Security />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="agents" element={<AgentMonitoring />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="chat" element={<AIChat />} />

          {/* Compatibility redirects */}
          <Route path="security" element={<Navigate to="/soc/events" replace />} />
          <Route path="reports" element={<Navigate to="/soc/analytics" replace />} />
        </Route>

        {/* Legacy redirect /analyst -> /soc */}
        <Route path="/analyst/*" element={<Navigate to="/soc" replace />} />

        {/* ======================
              EMPLOYEE PORTAL
        ====================== */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["EMPLOYEE", "ADMIN"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="chat" element={<AIChat />} />
          <Route path="report-incident" element={<ReportIncident />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<EmployeeSettings />} />
        </Route>

        {/* ======================
              DEFAULT REDIRECTS
        ====================== */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}