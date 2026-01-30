"use client";

import { cn } from "@/lib/utils";
import { SimpleUIMessage } from "@/lib/simple-chat-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Message({ message }: { message: SimpleUIMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-2 md:gap-3 py-2 md:py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn("flex size-6 md:size-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
        isUser ? "bg-background" : "bg-primary text-primary-foreground"
      )}>
        {isUser ? (
          <span className="text-[10px] md:text-xs font-medium uppercase">Me</span>
        ) : (
          <span className="text-[10px] md:text-xs font-bold uppercase">A</span>
        )}
      </div>

      <div className={cn(
        "flex flex-col gap-1 min-w-0 overflow-hidden",
        isUser ? "items-end max-w-[85%]" : "items-start flex-1"
      )}>
        <div className={cn(
          "text-sm overflow-hidden",
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl md:rounded-3xl px-3 md:px-4 py-1.5 md:py-2.5 rounded-tr-none"
            : "text-foreground w-full"
        )}>
          {message.parts.map((part, index) => (
            <div key={index} className="break-words overflow-wrap-anywhere">
              {isUser ? (
                <span className="whitespace-pre-wrap leading-relaxed">{part.text}</span>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-full prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-table:my-3 prose-th:border prose-th:border-border prose-th:px-2 prose-th:py-1 prose-th:bg-muted prose-td:border prose-td:border-border prose-td:px-2 prose-td:py-1 [word-break:break-word] [overflow-wrap:break-word]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ThinkingMessage() {
  return (
    <div className="group flex w-full items-start gap-2 md:gap-3 py-2 md:py-4">
      <div className="flex size-6 md:size-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm bg-primary text-primary-foreground">
        <span className="text-[10px] md:text-xs font-bold uppercase">A</span>
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="bg-muted text-foreground rounded-2xl md:rounded-3xl px-3 md:px-4 py-1.5 md:py-2.5 text-sm">
          <span className="animate-pulse">Thinking...</span>
        </div>
      </div>
    </div>
  );
}
