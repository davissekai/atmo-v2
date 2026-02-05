"use client";

import { useState, useCallback, useRef } from "react";
import { SimpleMessage } from "@/lib/simple-chat-types";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";

// Fallback ID generator for environments where crypto.randomUUID is unavailable
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

interface UseSimpleChatProps {
  initialMessages?: SimpleMessage[];
  model?: string;
  deepThink?: boolean;
  onError?: (error: Error) => void;
}

interface ChatError {
  message: string;
  code?: string;
  retryable: boolean;
}

export function useSimpleChat({
  initialMessages = [],
  model = DEFAULT_CHAT_MODEL,
  deepThink = false,
  onError,
}: UseSimpleChatProps = {}) {
  const [messages, setMessages] = useState<SimpleMessage[]>(initialMessages);
  const [status, setStatus] = useState<"ready" | "streaming" | "error">("ready");
  const [error, setError] = useState<ChatError | null>(null);
  const [sources, setSources] = useState<{ title: string; url: string; content: string }[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastInputRef = useRef<string>("");

  const clearError = useCallback(() => {
    setError(null);
    setStatus("ready");
  }, []);

  const stop = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("ready");
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Store for retry
      lastInputRef.current = content;

      // Clear any previous error and sources
      setError(null);
      setSources([]);


      const userMessage: SimpleMessage = {
        id: generateId(),
        role: "user",
        content,
      };

      const assistantMessage: SimpleMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
      };

      // Add user message and empty assistant message
      const newMessages = [...messages, userMessage];
      setMessages([...newMessages, assistantMessage]);
      setStatus("streaming");

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model,
            deepThink,
          }),
          signal: abortControllerRef.current.signal,
        });

        // Check for error responses
        if (!response.ok) {
          let errorMessage = "Something went wrong. Please try again.";
          let retryable = true;

          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Response wasn't JSON, use status-based message
            if (response.status === 429) {
              errorMessage = "Too many requests. Please wait a moment.";
            } else if (response.status === 503) {
              errorMessage = "Service temporarily unavailable.";
              retryable = false;
            }
          }

          throw {
            message: errorMessage,
            code: String(response.status),
            retryable
          } as ChatError;
        }

        if (!response.body) {
          throw {
            message: "No response received from server.",
            retryable: true
          } as ChatError;
        }

        // Read the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split('\n');
          // Keep the last part in the buffer if it's not empty (it might be an incomplete line)
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line) continue;

            // Text part
            if (line.startsWith('0:')) {
              try {
                const textContent = JSON.parse(line.substring(2));
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: (lastMessage.content || "") + textContent },
                    ];
                  }
                  return prev;
                });
              } catch (e) {
                console.error("Error parsing stream chunk:", e);
              }
            }
            // Sources from web search (custom '9:' event)
            else if (line.startsWith('9:')) {
              try {
                const sourcesData = JSON.parse(line.substring(2));
                if (Array.isArray(sourcesData)) {
                  setSources(sourcesData);
                }
              } catch (e) {
                console.error("Error parsing sources:", e);
              }
            }
            // Error part
            else if (line.startsWith('3:')) {
              try {
                const errorContent = JSON.parse(line.substring(2));
                throw { message: errorContent, retryable: true } as ChatError;
              } catch (e) {
                if ((e as ChatError).message) throw e;
              }
            }
          }
        }

        setStatus("ready");
      } catch (err) {
        // Handle abort
        if ((err as Error).name === "AbortError") {
          setStatus("ready");
          return;
        }

        // Handle network errors
        if (err instanceof TypeError && (err as Error).message.includes("fetch")) {
          setError({
            message: "Unable to connect. Check your internet connection.",
            retryable: true,
          });
        } else if ((err as ChatError).message) {
          // Our structured error
          setError(err as ChatError);
        } else {
          // Unknown error
          setError({
            message: "An unexpected error occurred.",
            retryable: true,
          });
        }

        console.error("Chat error:", err);
        setStatus("error");
        onError?.(err instanceof Error ? err : new Error(String(err)));

        // Remove the empty assistant message on error
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        abortControllerRef.current = null;
      }
    },
    [messages, model, deepThink, onError]
  );

  const retry = useCallback(() => {
    if (lastInputRef.current) {
      // Remove the failed user message first
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(lastInputRef.current);
    }
  }, [sendMessage]);

  return {
    messages,
    setMessages,
    status,
    error,
    clearError,
    sendMessage,
    stop,
    retry,
    sources,
  };
}
