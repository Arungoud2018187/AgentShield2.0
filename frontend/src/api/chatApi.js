import { sendMessage } from "../services/chatService";

export const chatWithAI = async (prompt) => {
    try {

        const data = await sendMessage(prompt);

        return {
            success: true,
            response: data.response,
            blocked: data.blocked,
            risk: data.risk,
        };

    } catch {

        return {
            success: false,
            response: "AgentShield AI is unavailable.",
            blocked: false,
            risk: "Error",
        };

    }
};

export const checkAIHealth = async () => {

    try {

        const data = await fetch(
            "http://localhost:8000/api/chat/health"
        );

        return await data.json();

    } catch {

        return {
            status: "offline",
        };

    }

};