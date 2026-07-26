import { useEffect, useRef, useState } from "react";

import ChatBox from "../../components/chat/ChatBox";
import ChatInput from "../../components/chat/ChatInput";
import { chatWithAI } from "../../api/chatApi";

export default function AIChat() {
  const welcomeMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "👋 Welcome to AgentShield AI.\n\nHow can I help you today?",
    status: "verified",
    security: "🛡️ AgentShield Verified",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const [messages, setMessages] = useState([welcomeMessage]);

  const [loading, setLoading] = useState(false);

  const [lastPrompt, setLastPrompt] = useState("");

  const [feedback, setFeedback] = useState({});

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendPrompt = async (prompt, saveUserMessage = true) => {
    if (!prompt.trim()) return;

    if (saveUserMessage) {
      setLastPrompt(prompt);

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMessage]);
    }

    setLoading(true);

    try {
      const response = await chatWithAI(prompt);

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          response?.response ??
          "No response received from AgentShield AI.",

        status: response?.status ?? "verified",

        security:
          response?.security ??
          "🛡️ AgentShield Verified",

        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Unable to connect to AgentShield AI.",

          status: "error",

          security:
            "⚠️ AI Service Temporarily Unavailable",

          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (prompt) => {
    if (loading) return;

    await sendPrompt(prompt, true);
  };

  const regenerateResponse = async () => {
    if (!lastPrompt || loading) return;

    await sendPrompt(lastPrompt, false);
  };

  const clearConversation = () => {
    setMessages([
      {
        ...welcomeMessage,
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setFeedback({});
    setLastPrompt("");
  };

  return (
    <div className="flex h-[calc(100vh-90px)] flex-col bg-slate-950">
      <div className="flex-1 overflow-hidden">
        <ChatBox
          messages={messages}
          loading={loading}
          onRegenerate={regenerateResponse}
          onClear={clearConversation}
          feedback={feedback}
          setFeedback={setFeedback}
        />

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        loading={loading}
      />
    </div>
  );
}