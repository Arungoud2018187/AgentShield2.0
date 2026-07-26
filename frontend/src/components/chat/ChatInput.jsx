import { useState } from "react";
import {
  Send,
  Paperclip,
  Sparkles,
} from "lucide-react";

export default function ChatInput({
  onSend,
  loading = false,
}) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = prompt.trim();

    if (!text || loading) return;

    onSend(text);
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl px-8 py-6"
      >
        <div className="rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">

          {/* Input Row */}
          <div className="flex items-center gap-4 px-5 py-4">

            {/* Attachment */}
            <button
              type="button"
              title="Attach File"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 transition hover:border-cyan-500 hover:bg-slate-700 hover:text-cyan-400"
            >
              <Paperclip size={20} />
            </button>

            {/* Prompt */}
            <textarea
              rows={1}
              value={prompt}
              disabled={loading}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AgentShield AI anything..."
              className="max-h-48 min-h-[60px] flex-1 resize-none overflow-y-auto bg-transparent py-4 text-base text-white placeholder:text-slate-500 outline-none"
            />

            {/* Send */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Sparkles
                    size={18}
                    className="animate-spin"
                  />
                  Thinking...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send
                </>
              )}
            </button>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3 text-xs text-slate-500">

            <span>
              Press <span className="font-semibold text-slate-300">Enter</span> to
              send
            </span>

            <span>
              <span className="font-semibold text-slate-300">Shift + Enter</span>{" "}
              for a new line
            </span>

          </div>
        </div>
      </form>
    </div>
  );
}