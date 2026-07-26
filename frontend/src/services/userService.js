import api from "../api/axios";

// ==========================
// GET USERS
// ==========================
export const getUsers = async ({
    search = "",
    role_id = "",
    department_id = "",
    status = "",
    page = 1,
    limit = 10,
} = {}) => {

    const params = {};

    if (search) params.search = search;
    if (role_id) params.role_id = role_id;
    if (department_id) params.department_id = department_id;
    if (status !== "") params.status = status;

    params.page = page;
    params.limit = limit;

    const response = await api.get("/api/users/", {
        params,
    });

    return response.data;
};

// ==========================
// GET SINGLE USER
// ==========================
export const getUser = async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
};

// ==========================
// CREATE USER
// ==========================
export const createUser = async (userData) => {
    const response = await api.post("/api/users/", userData);
    return response.data;
};

// ==========================
// UPDATE USER
// ==========================
export const updateUser = async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
};

// ==========================
// DELETE USER
// ==========================
export const deleteUser = async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
};