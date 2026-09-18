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

          <div className="flex h-full items-center justify-center px-6 py-12">

            <div className="mx-auto max-w-2xl text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-xl shadow-cyan-500/20">

                <Bot className="h-8 w-8 text-white" />

              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                AgentShield AI Assistant
              </h1>

              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400 leading-relaxed">
                Enterprise AI guardrails active. Ask questions, analyze security practices, or compose documentation with real-time prompt protection.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left">
                  <span className="text-xs font-bold text-white">🛡 Threat Defense</span>
                  <p className="mt-1 text-[11px] text-slate-400">Automatic filter for jailbreaks & prompt injection.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left">
                  <span className="text-xs font-bold text-white">⚡ Cloud Intelligence</span>
                  <p className="mt-1 text-[11px] text-slate-400">Powered by OpenRouter with enterprise rate limits.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left">
                  <span className="text-xs font-bold text-white">🔒 Policy Logging</span>
                  <p className="mt-1 text-[11px] text-slate-400">Prompts logged to immutable audit trail in PostgreSQL.</p>
                </div>

              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-400">

                <Lock className="h-3.5 w-3.5 text-emerald-400" />

                Enterprise interactions are policy-guarded and verified.

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