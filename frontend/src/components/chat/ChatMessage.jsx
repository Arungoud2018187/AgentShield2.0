import { useState } from "react";
import {
  User,
  Bot,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
} from "lucide-react";
import MarkdownRenderer from "../common/MarkdownRenderer";

export default function ChatMessage({
  message,
  onRegenerate,
  feedback,
  setFeedback,
}) {
  const isUser = message.role === "user";

  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const securityStyles = {
    verified:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

    blocked:
      "border-red-500/30 bg-red-500/10 text-red-300",

    error:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  };

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-5xl gap-4 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-lg ${
            isUser
              ? "bg-gradient-to-r from-cyan-500 to-blue-600"
              : "bg-gradient-to-r from-violet-500 to-indigo-600"
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>

        {/* Message Bubble */}

        <div
          className={`rounded-2xl border shadow-xl ${
            isUser
              ? "border-cyan-500/30 bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
              : "border-slate-700 bg-slate-900 text-slate-100"
          } px-6 py-5`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words leading-7 text-[15px]">
              {message.content}
            </div>
          ) : (
            <MarkdownRenderer content={message.content} className="text-[14px] leading-7" />
          )}

          {/* USER FOOTER */}

          {isUser && (
            <div className="mt-4 text-right text-xs text-cyan-100/80">
              {message.timestamp}
            </div>
          )}

          {/* AI FOOTER */}

          {!isUser && (
            <>
              <div className="mt-6 flex items-center justify-between border-t border-slate-700 pt-4">

                <div>

                  <p className="font-semibold text-white">
                    AgentShield AI
                  </p>

                  <p className="text-xs text-slate-500">
                    {message.timestamp}
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  {/* Copy */}

                  <button
                    onClick={copyMessage}
                    className="rounded-lg p-2 transition hover:bg-cyan-500/20 hover:text-cyan-400"
                    title="Copy Response"
                  >
                    {copied ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>

                  {/* Regenerate */}

                  <button
                    onClick={onRegenerate}
                    className="rounded-lg p-2 transition hover:bg-violet-500/20 hover:text-violet-400"
                    title="Regenerate Response"
                  >
                    <RotateCcw size={16} />
                  </button>

                  {/* Like */}

                  <button
                    onClick={() =>
                      setFeedback((prev) => ({
                        ...prev,
                        [message.id]: "like",
                      }))
                    }
                    className={`rounded-lg p-2 transition ${
                      feedback?.[message.id] === "like"
                        ? "bg-emerald-500 text-white"
                        : "hover:bg-emerald-500/20 hover:text-emerald-400"
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp size={16} />
                  </button>

                  {/* Dislike */}

                  <button
                    onClick={() =>
                      setFeedback((prev) => ({
                        ...prev,
                        [message.id]: "dislike",
                      }))
                    }
                    className={`rounded-lg p-2 transition ${
                      feedback?.[message.id] === "dislike"
                        ? "bg-red-500 text-white"
                        : "hover:bg-red-500/20 hover:text-red-400"
                    }`}
                    title="Not Helpful"
                  >
                    <ThumbsDown size={16} />
                  </button>

                </div>

              </div>

              {/* Security Badge */}

              {message.security && (
                <div
                  className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${
                    securityStyles[message.status] ??
                    securityStyles.verified
                  }`}
                >
                  <ShieldCheck size={14} />

                  {message.security}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}