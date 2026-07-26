import api from "./axios";

// =======================
// DASHBOARD
// =======================

export const getDashboardStats = async () => {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
};

// =======================
// ANALYTICS
// =======================

export const getAnalytics = async () => {
    const response = await api.get("/api/analytics");
    return response.data;
};

// =======================
// USERS
// =======================

export const getUsers = async (params = {}) => {
    const response = await api.get("/api/users/", {
        params,
    });

    return response.data;
};

// =======================
// UPDATE USER STATUS
// =======================

export const updateUserStatus = async (id, is_active) => {
    const response = await api.patch(
        `/api/users/${id}/status`,
        {
            is_active,
        }
    );

    return response.data;
};