import { useState, useEffect, useRef } from "react";
import {
    Bot,
    User,
    Send,
    Shield,
    ShieldCheck,
    AlertTriangle,
    Cpu,
    Clock3,
    BrainCircuit,
    Sparkles,
    Copy,
    RotateCcw,
} from "lucide-react";

import api from "../../api/axios";

export default function Chat() {

    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, loading]);

    const suggestions = [

        "Analyze today's security events",

        "Explain MITRE ATT&CK T1059",

        "Check AI security posture",

        "Summarize latest blocked attacks",

    ];

    const timeNow = () =>

        new Date().toLocaleTimeString([], {

            hour: "2-digit",
            minute: "2-digit",

        });

    const copyMessage = async (text) => {

        await navigator.clipboard.writeText(text);

    };

    const regenerate = async (oldPrompt) => {

        if (!oldPrompt) return;

        setPrompt(oldPrompt);

        setTimeout(() => {

            sendPrompt(oldPrompt);

        }, 100);

    };

    const sendPrompt = async (customPrompt = prompt) => {

        if (!customPrompt.trim()) return;

        const userMessage = {

            sender: "user",

            text: customPrompt,

            time: timeNow(),

        };

        setMessages((prev) => [

            ...prev,

            userMessage,

        ]);

        setLoading(true);

        try {

            const { data } = await api.post("/api/chat/", {

                prompt: customPrompt,

            });

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text: data.response,

                    blocked: data.blocked,

                    risk: data.risk,

                    prompt: customPrompt,

                    time: timeNow(),

                },

            ]);

        } catch {

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text: "Unable to contact AgentShield.",

                    blocked: false,

                    risk: "Error",

                    prompt: customPrompt,

                    time: timeNow(),

                },

            ]);

        }

        setPrompt("");

        setLoading(false);

    };

    return (

        <div className="grid gap-6 xl:grid-cols-4">

            {/* Sidebar */}

            <div className="space-y-6">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center gap-4">

                        <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-3">

                            <BrainCircuit
                                size={30}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h2 className="font-bold text-white">

                                AgentShield AI

                            </h2>

                            <p className="text-slate-400 text-sm">

                                Enterprise Assistant

                            </p>

                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h3 className="mb-5 font-semibold text-white">

                        Suggested Prompts

                    </h3>

                    <div className="space-y-3">

                        {suggestions.map((item) => (

                            <button
                                key={item}
                                onClick={() => sendPrompt(item)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-left text-sm text-slate-300 transition hover:border-cyan-500 hover:bg-slate-700"
                            >

                                {item}

                            </button>

                        ))}

                    </div>

                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">

                    <div className="flex items-center gap-3">

                        <ShieldCheck className="text-emerald-400"/>

                        <div>

                            <p className="font-semibold text-emerald-400">

                                Security Status

                            </p>

                            <p className="text-sm text-slate-300">

                                Protected

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Continue in Part 2 */}
                        {/* Chat Window */}

            <div className="xl:col-span-3">

                <div className="flex h-[84vh] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                    {/* Header */}

                    <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

                        <div className="flex items-center gap-4">

                            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-3">

                                <Bot
                                    size={28}
                                    className="text-white"
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-white">

                                    Enterprise AI Assistant

                                </h1>

                                <p className="text-slate-400">

                                    Secure • Local • Ollama Powered

                                </p>

                            </div>

                        </div>

                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">

                            <div className="flex items-center gap-2">

                                <Sparkles
                                    size={18}
                                    className="text-emerald-400"
                                />

                                <span className="font-semibold text-emerald-400">

                                    Online

                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Messages */}

                    <div className="flex-1 overflow-y-auto bg-slate-950/40 px-8 py-8">

                        {messages.length === 0 && !loading && (

                            <div className="flex h-full flex-col items-center justify-center text-center">

                                <div className="mb-8 rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-600 p-6 shadow-xl shadow-cyan-500/20">

                                    <Bot
                                        size={60}
                                        className="text-white"
                                    />

                                </div>

                                <h2 className="text-4xl font-black text-white">

                                    Welcome to AgentShield AI

                                </h2>

                                <p className="mt-4 max-w-2xl text-lg text-slate-400">

                                    Ask security questions, investigate incidents,
                                    analyze enterprise logs, explain threats,
                                    generate reports and monitor AI security.

                                </p>

                                <div className="mt-10 grid gap-4 md:grid-cols-2">

                                    {suggestions.map((item) => (

                                        <button
                                            key={item}
                                            onClick={() => sendPrompt(item)}
                                            className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-left text-slate-300 transition hover:border-cyan-500 hover:bg-slate-700"
                                        >

                                            {item}

                                        </button>

                                    ))}

                                </div>

                            </div>

                        )}

                        <div className="space-y-8">

                            {messages.map((msg, index) => (

                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >

                                    <div
                                        className={`max-w-5xl rounded-2xl p-6 shadow-lg ${
                                            msg.sender === "user"
                                                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                                                : msg.blocked
                                                ? "border border-red-500/40 bg-red-500/10 text-red-200"
                                                : "border border-slate-700 bg-slate-800 text-white"
                                        }`}
                                    >

                                        <div className="mb-4 flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`rounded-full p-2 ${
                                                        msg.sender === "user"
                                                            ? "bg-white/20"
                                                            : "bg-slate-700"
                                                    }`}
                                                >

                                                    {msg.sender === "user"
                                                        ? <User size={18}/>
                                                        : <Bot size={18}/>
                                                    }

                                                </div>

                                                <div>

                                                    <p className="font-semibold">

                                                        {msg.sender === "user"
                                                            ? "You"
                                                            : "AgentShield"}

                                                    </p>

                                                    <p className="text-xs opacity-70">

                                                        {msg.time}

                                                    </p>

                                                </div>

                                            </div>

                                                                                        </div>

                                        </div>

                                        <div className="whitespace-pre-wrap leading-8 text-[15px]">

                                            {msg.text}

                                        </div>

                                        {msg.sender === "ai" && (

                                            <>

                                                <div className="mt-5 flex flex-wrap gap-3">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            msg.blocked
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "bg-emerald-500/20 text-emerald-400"
                                                        }`}
                                                    >

                                                        {msg.blocked
                                                            ? "Threat Blocked"
                                                            : "Safe Response"}

                                                    </span>

                                                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">

                                                        Risk : {msg.risk}

                                                    </span>

                                                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">

                                                        Ollama AI

                                                    </span>

                                                </div>

                                                <div className="mt-6 flex items-center gap-3">

                                                    <button
                                                        onClick={() =>
                                                            copyMessage(msg.text)
                                                        }
                                                        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
                                                    >

                                                        <Copy size={16} />

                                                        Copy

                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            regenerate(msg.prompt)
                                                        }
                                                        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500 hover:text-violet-400"
                                                    >

                                                        <RotateCcw size={16} />

                                                        Regenerate

                                                    </button>

                                                </div>

                                            </>

                                        )}

                                    </div>

                                </div>

                            ))}

                            {loading && (

                                <div className="flex justify-start">

                                    <div className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <Bot className="text-cyan-400" />

                                            <span className="text-white">

                                                AgentShield is thinking

                                            </span>

                                            <div className="flex gap-1">

                                                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />

                                                <span
                                                    className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                                                    style={{ animationDelay: "0.15s" }}
                                                />

                                                <span
                                                    className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                                                    style={{ animationDelay: "0.3s" }}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}

                            <div ref={messagesEndRef} />

                        </div>

                    </div>

                    {/* Continue in Part 4 */}
                                        {/* Bottom Panel */}

                    <div className="border-t border-slate-800 bg-slate-900 p-6">

                        {/* Status Cards */}

                        <div className="mb-6 grid gap-4 lg:grid-cols-4">

                            <div className="rounded-xl border border-slate-800 bg-slate-800 p-4">

                                <div className="flex items-center justify-between">

                                    <Shield className="text-emerald-400" />

                                    <span className="text-xs font-semibold text-emerald-400">

                                        Active

                                    </span>

                                </div>

                                <p className="mt-4 text-sm text-slate-400">

                                    Security

                                </p>

                                <h3 className="mt-1 text-lg font-bold text-white">

                                    Protected

                                </h3>

                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-800 p-4">

                                <div className="flex items-center justify-between">

                                    <Cpu className="text-cyan-400" />

                                    <span className="text-xs font-semibold text-cyan-400">

                                        Running

                                    </span>

                                </div>

                                <p className="mt-4 text-sm text-slate-400">

                                    AI Model

                                </p>

                                <h3 className="mt-1 text-lg font-bold text-white">

                                    Ollama

                                </h3>

                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-800 p-4">

                                <div className="flex items-center justify-between">

                                    <Clock3 className="text-orange-400" />

                                    <span className="text-xs font-semibold text-orange-400">

                                        Live

                                    </span>

                                </div>

                                <p className="mt-4 text-sm text-slate-400">

                                    Avg Response

                                </p>

                                <h3 className="mt-1 text-lg font-bold text-white">

                                    140 ms

                                </h3>

                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-800 p-4">

                                <div className="flex items-center justify-between">

                                    <AlertTriangle className="text-red-400" />

                                    <span className="text-xs font-semibold text-red-400">

                                        Monitor

                                    </span>

                                </div>

                                <p className="mt-4 text-sm text-slate-400">

                                    Threat Level

                                </p>

                                <h3 className="mt-1 text-lg font-bold text-emerald-400">

                                    Low

                                </h3>

                            </div>

                        </div>

                        {/* Input */}

                        <div className="flex items-center gap-4">

                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendPrompt();
                                    }
                                }}
                                placeholder="Ask AgentShield AI anything about cybersecurity..."
                                className="h-[60px] flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-6 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                            />

                            <button
                                onClick={() => sendPrompt()}
                                disabled={loading}
                                className="flex h-[60px] items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <Send size={18} />

                                {loading ? "Sending..." : "Send"}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
