import api from "./axios";

export async function getDashboard() {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
}