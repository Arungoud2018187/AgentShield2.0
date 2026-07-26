import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export const sendMessage = async (prompt) => {

    const response = await API.post("/chat/", {
        prompt,
    });

    return response.data;

};

export const checkHealth = async () => {

    const response = await API.get("/chat/health");

    return response.data;

};

export default API;