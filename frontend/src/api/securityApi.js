import api from "./axios";

export async function getSecurityDashboard() {
    const response = await api.get("/api/security/dashboard");
    return response.data;
}

export async function getSecurityAgents() {
    const response = await api.get("/api/security/agents");
    return response.data;
}

export async function getSecurityLogs() {
    const response = await api.get("/api/security/logs");
    return response.data;
}