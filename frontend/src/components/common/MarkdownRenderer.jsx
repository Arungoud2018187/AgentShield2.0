import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  return (
    <div className={`markdown-content text-xs leading-relaxed space-y-2 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="mt-4 mb-2 text-base font-bold text-white border-b border-slate-800 pb-1.5"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="mt-3.5 mb-2 text-sm font-bold text-violet-300 tracking-tight"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="mt-3 mb-1.5 text-xs font-bold text-slate-200 uppercase tracking-wide"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed text-slate-300 last:mb-0" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-slate-200" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-2 ml-4 list-disc space-y-1 text-slate-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-2 ml-4 list-decimal space-y-1 text-slate-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-2.5 rounded-r-lg border-l-4 border-violet-500 bg-violet-950/20 px-3.5 py-2 text-xs italic text-slate-300"
              {...props}
            />
          ),
          code: ({ node, inline, className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName && typeof children === "string" && !children.includes("\n");
            return isInline ? (
              <code
                className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300 border border-slate-800"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className="font-mono text-xs text-slate-200" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="my-2.5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-sm">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              className="bg-violet-950/40 text-slate-200 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider"
              {...props}
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-800/80 text-slate-300" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-900/50 transition" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3.5 py-2.5 font-bold text-violet-300 whitespace-nowrap" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3.5 py-2 text-slate-300 leading-normal" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-3 border-slate-800" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
