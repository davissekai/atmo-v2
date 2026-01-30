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
        "group flex w-full items-start gap-3 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn("flex size-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
        isUser ? "bg-background" : "bg-primary text-primary-foreground"
      )}>
        {isUser ? (
          <span className="text-xs font-medium">ME</span>
        ) : (
          <span className="text-xs font-bold">A</span>
        )}
      </div>

      <div className={cn("flex flex-col gap-2 min-w-0 max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm w-full"
        )}>
          {message.parts.map((part, index) => (
            <div key={index} className="break-words">
              {isUser ? (
                <span className="whitespace-pre-wrap">{part.text}</span>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-3 prose-headings:my-4 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-table:my-4 prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2">
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
    <div className="group flex w-full items-start gap-3 py-4">
      <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm bg-primary text-primary-foreground">
        <span className="text-xs font-bold">A</span>
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm">
          <span className="animate-pulse">Thinking...</span>
        </div>
      </div>
    </div>
  );
}
