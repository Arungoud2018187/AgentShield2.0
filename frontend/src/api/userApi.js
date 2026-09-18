import api from "./axios";

export async function getUsers(params = {}) {
    const cleanedParams = {};
    Object.entries(params).forEach(([key, val]) => {
        if (val !== "" && val !== null && val !== undefined) {
            cleanedParams[key] = val;
        }
    });

    const response = await api.get("/api/users", {
        params: cleanedParams,
    });

    return response.data;
}

export async function createUser(data) {
    const response = await api.post("/api/users", data);
    return response.data;
}

export async function updateUser(id, data) {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
}

export async function deleteUser(id) {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
}