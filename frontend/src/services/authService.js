import api from "../api/axios";

export const login = async ({ email, password }) => {

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post(
        "/api/auth/login",
        formData,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
};