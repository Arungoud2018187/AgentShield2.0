import api from "./axios";

export async function chatWithAI(prompt) {

    const response = await api.post("/api/chat/", {
        prompt,
    });

    return response.data;
}

export async function getChatHealth() {

    const response = await api.get("/api/chat/health");

    return response.data;
}