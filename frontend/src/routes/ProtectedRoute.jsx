import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    roles = [],
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const userRole = (user.role || "").toUpperCase();

    if (roles.length > 0 && !roles.map((r) => r.toUpperCase()).includes(userRole)) {
        // Redirect unauthorized user directly to their assigned portal
        if (userRole === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }
        if (userRole === "ANALYST") {
            return <Navigate to="/soc" replace />;
        }
        return <Navigate to="/employee" replace />;
    }

    return children;
}