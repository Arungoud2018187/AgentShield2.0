import { useState, useRef } from "react";
import {
  Send,
  Paperclip,
  Sparkles,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";

export default function ChatInput({
  onSend,
  loading = false,
}) {
  const [prompt, setPrompt] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");

    // 5MB Limit
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds 5MB maximum limit. Please choose a smaller file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    // Attempt to read text content if text, code, log, markdown, json, etc.
    const isText =
      file.type.startsWith("text/") ||
      file.type.includes("json") ||
      file.type.includes("javascript") ||
      /\.(txt|md|log|json|csv|py|js|jsx|ts|tsx|html|css|yaml|yml|sql|sh)$/i.test(file.name);

    if (isText) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFile({
          name: file.name,
          size: formattedSize,
          type: file.type || "text/plain",
          content: event.target.result,
        });
      };
      reader.onerror = () => {
        setFileError("Failed to read file contents.");
      };
      reader.readAsText(file);
    } else {
      // Binary or document file
      setAttachedFile({
        name: file.name,
        size: formattedSize,
        type: file.type || "application/octet-stream",
        content: `[Attached Document: ${file.name} (${formattedSize})]`,
      });
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = prompt.trim();

    if ((!text && !attachedFile) || loading) return;

    let fullMessage = text;
    if (attachedFile) {
      if (fullMessage) {
        fullMessage = `[Attached File: ${attachedFile.name} (${attachedFile.size})]\n\`\`\`\n${attachedFile.content}\n\`\`\`\n\n${fullMessage}`;
      } else {
        fullMessage = `Please review and analyze the attached file: ${attachedFile.name} (${attachedFile.size})\n\`\`\`\n${attachedFile.content}\n\`\`\``;
      }
    }

    onSend(fullMessage);
    setPrompt("");
    removeAttachedFile();
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
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">

          {/* Attached File Preview Bar */}
          {attachedFile && (
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <FileText size={16} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="max-w-xs truncate text-sm font-bold text-white sm:max-w-md">
                    {attachedFile.name}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-400">
                    {attachedFile.size}
                  </span>
                  <span className="hidden text-xs text-emerald-400 sm:inline">
                    • Ready for security inspection
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeAttachedFile}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                title="Remove attachment"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Error Message */}
          {fileError && (
            <div className="flex items-center justify-between border-b border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{fileError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFileError("")}
                className="text-red-400 hover:text-red-200"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-4 px-5 py-4">

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.log,.md,.json,.csv,.py,.js,.jsx,.ts,.tsx,.html,.css,.yaml,.yml,.sql,.sh,.pdf,.doc,.docx"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={handleFileClick}
              title="Attach File (Code, Log, or Document)"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
                attachedFile
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20"
                  : "border-slate-700 bg-slate-800 text-slate-400 hover:border-cyan-500 hover:bg-slate-700 hover:text-cyan-400"
              }`}
            >
              <Paperclip size={20} />
            </button>

            {/* Prompt Textarea */}
            <textarea
              rows={1}
              value={prompt}
              disabled={loading}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                attachedFile
                  ? "Add instructions for this file (e.g. 'Check for vulnerabilities')..."
                  : "Ask AgentShield AI anything..."
              }
              className="max-h-48 min-h-[60px] flex-1 resize-none overflow-y-auto bg-transparent py-4 text-base text-white placeholder:text-slate-500 outline-none"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || (!prompt.trim() && !attachedFile)}
              className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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