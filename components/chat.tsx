"use client";

import { useEffect, useRef, useState } from "react";
import { useSimpleChat } from "@/hooks/use-simple-chat";
import { Message, ThinkingMessage } from "@/components/message";
import { toUIMessage } from "@/lib/simple-chat-types";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/elements/prompt-input";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { SuggestionCards } from "@/components/suggestion-cards";
import { Paperclip, ArrowUp, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chat() {
  const [isDeepThink, setIsDeepThink] = useState(false);
  const { messages, status, error, clearError, sendMessage, stop, retry } = useSimpleChat({ deepThink: isDeepThink });
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Adjust textarea height
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || status === "streaming") return;
    sendMessage(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRetry = () => {
    clearError();
    retry();
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <AppSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 flex flex-col relative bg-stitch-gradient h-full transition-all duration-300 ease-in-out",
          // Mobile: full width with top padding for header
          "pt-14 md:pt-0",
          // Desktop: sidebar margin
          "md:ml-[70px]",
          isSidebarOpen && "md:ml-64"
        )}
      >
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={scrollRef}>
          <div className="mx-auto max-w-4xl flex flex-col gap-6 min-h-full">

            {/* Empty State / Hero Section */}
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-start justify-center pb-20 fade-in-0 duration-500 animate-in">
                <div className="mb-8 md:mb-12 space-y-1 md:space-y-2">
                  <h1 className="text-2xl md:text-5xl font-medium tracking-tight">
                    Greetings! <span className="text-muted-foreground"></span>
                  </h1>
                  <h2 className="text-2xl md:text-5xl font-medium text-muted-foreground/60 leading-tight">
                    What do you want to know about the climate today?
                  </h2>
                </div>

                <div className="w-full mb-12">
                  <SuggestionCards onSelect={(prompt) => setInput(prompt)} />
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <Message key={msg.id} message={toUIMessage(msg)} />
            ))}

            {status === "streaming" && <ThinkingMessage />}

            {/* Error Display */}
            {status === "error" && error && (
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 w-full max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <span className="text-destructive">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{error.message}</p>
                  </div>
                </div>
                {error.retryable && (
                  <div className="flex gap-2 ml-8">
                    <Button variant="outline" size="sm" onClick={handleRetry} className="h-8 text-xs border-destructive/30 hover:bg-destructive/10">Try Again</Button>
                    <Button variant="ghost" size="sm" onClick={clearError} className="h-8 text-xs hover:bg-white/5">Dismiss</Button>
                  </div>
                )}
              </div>
            )}

            <div ref={endRef} className="h-4" />
          </div>
        </div>

        {/* Input Area (Floating) */}
        <div className="p-2 md:p-6 w-full max-w-4xl mx-auto z-20">
          <PromptInput
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="relative border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300"
          >

            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="min-h-[44px] md:min-h-[60px] py-3 md:py-5 px-4 md:px-5 text-base bg-transparent placeholder:text-muted-foreground/60 resize-none !border-none !shadow-none !ring-0 focus-visible:ring-0"
            />

            <div className="flex items-center justify-between px-3 md:px-4 pb-3 md:pb-4">
              {/* Deep Think Toggle */}
              <button
                type="button"
                onClick={() => setIsDeepThink(!isDeepThink)}
                className={cn(
                  "flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                  isDeepThink
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
                )}
              >
                <Brain className={cn("size-3.5 md:size-4", isDeepThink && "animate-pulse")} />
                <span className="hidden md:inline">Deep Think</span>
              </button>

              <PromptInputSubmit
                onClick={handleSubmit}
                status={status as any}
                disabled={!input.trim() && status !== "streaming"}
                className={cn(
                  "rounded-xl size-8 md:size-10 transition-all duration-300",
                  input.trim() ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-white/10 text-muted-foreground"
                )}
              >
                <ArrowUp className="size-4 md:size-5" />
              </PromptInputSubmit>
            </div>

          </PromptInput>

          <div className="text-center text-[10px] text-muted-foreground/40 mt-3 font-mono uppercase tracking-widest">
            Atmo AI Preview
          </div>
        </div>

      </main>
    </div>
  );
}
