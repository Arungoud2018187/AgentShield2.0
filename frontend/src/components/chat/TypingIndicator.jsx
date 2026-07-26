import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start w-full animate-in fade-in duration-300">
      <div className="flex max-w-5xl gap-4">

        {/* AI Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>

        {/* Bubble */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-5 shadow-xl">

          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-slate-300">
              AgentShield AI is thinking
            </span>

            <div className="flex gap-1">

              <span
                className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />

              <span
                className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />

              <span
                className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />

            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Generating a secure response...
          </p>

        </div>
      </div>
    </div>
  );
}