import api from "./axios";

export async function login(data) {
    const response = await api.post("/api/auth/login", {
        identifier: data.identifier || data.email,
        password: data.password,
        selected_role: data.selected_role,
    });

    return response.data;
}

export async function getMe() {
    const response = await api.get("/api/auth/me");
    return response.data;
}