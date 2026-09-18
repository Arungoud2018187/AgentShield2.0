import api from "./axios";

export async function getAnalytics() {
    const response = await api.get("/api/analytics");
    return response.data;
}