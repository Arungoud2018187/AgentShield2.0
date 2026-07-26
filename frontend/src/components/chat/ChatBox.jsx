import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import {
  ShieldCheck,
  Sparkles,
  Bot,
  Lock,
  Plus,
} from "lucide-react";

export default function ChatBox({
  messages = [],
  loading = false,
  onRegenerate,
  onClear,
  feedback,
  setFeedback,
}) {
  const hasConversation =
    messages.length > 1 ||
    (messages.length === 1 &&
      messages[0]?.role !== "assistant");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">

      {/* Header */}

      <div className="border-b border-slate-800 bg-slate-900 px-8 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-white">
                AgentShield AI
              </h2>

              <p className="text-sm text-slate-400">
                Enterprise Security Assistant
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />

              <span className="text-sm font-medium text-emerald-300">
                Secure
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />

              <span className="text-sm font-medium text-cyan-300">
                AI Ready
              </span>
            </div>

            <button
              onClick={onClear}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Plus size={16} />
              New Chat
            </button>

          </div>

        </div>

      </div>

      {/* Chat Area */}

      <div className="flex-1 overflow-y-auto">

        {!hasConversation ? (

          <div className="flex h-full items-center justify-center px-8">

            <div className="mx-auto max-w-3xl text-center">

              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 shadow-2xl shadow-cyan-500/20">

                <Bot className="h-12 w-12 text-white" />

              </div>

              <h1 className="text-5xl font-bold text-white">
                Welcome to AgentShield AI
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Your enterprise cybersecurity assistant powered by AI.
                Analyze threats, investigate incidents, generate reports,
                explain security concepts, and assist with SOC operations.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">

                <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4">
                  <p className="font-medium text-white">
                    🛡 Threat Analysis
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4">
                  <p className="font-medium text-white">
                    📄 Log Investigation
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4">
                  <p className="font-medium text-white">
                    🤖 AI Assistance
                  </p>
                </div>

              </div>

              <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-slate-400">

                <Lock className="h-4 w-4" />

                Enterprise conversations are encrypted and protected.

              </div>

            </div>

          </div>

        ) : (

          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-10 py-8">

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRegenerate={onRegenerate}
                feedback={feedback}
                setFeedback={setFeedback}
              />
            ))}

            {loading && <TypingIndicator />}

          </div>

        )}

      </div>

    </div>
  );
}