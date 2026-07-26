import {
    getDashboardStats,
    getAnalytics,
    getUsers,
    updateUserStatus,
} from "../api/adminApi";

// =======================
// DASHBOARD
// =======================

export const dashboardService = async () => {
    return await getDashboardStats();
};

// =======================
// ANALYTICS
// =======================

export const analyticsService = async () => {
    return await getAnalytics();
};

// =======================
// USERS
// =======================

export const usersService = async () => {
    return await getUsers();
};

// =======================
// USER STATUS
// =======================

export const updateStatusService = async (id, status) => {
    return await updateUserStatus(id, status);
};