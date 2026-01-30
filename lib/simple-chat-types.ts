// Simple Chat Types - replaces @ai-sdk/react types for MVP

export interface SimpleMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// UI Message format (for components expecting parts)
export interface SimplePart {
  type: "text";
  text: string;
}

export interface SimpleUIMessage {
  id: string;
  role: "user" | "assistant";
  parts: SimplePart[];
}

export type SimpleChatStatus = "ready" | "streaming" | "error";

// Simplified chat helpers interface
export interface SimpleChatHelpers {
  messages: SimpleUIMessage[];
  status: SimpleChatStatus;
  sendMessage: (content: string) => void;
  stop: () => Promise<void>;
  setMessages: (messages: SimpleUIMessage[] | ((prev: SimpleUIMessage[]) => SimpleUIMessage[])) => void;
}

// Convert SimpleMessage to SimpleUIMessage
export function toUIMessage(msg: SimpleMessage): SimpleUIMessage {
  return {
    id: msg.id,
    role: msg.role,
    parts: [{ type: "text", text: msg.content }],
  };
}

// Convert SimpleUIMessage to SimpleMessage
export function fromUIMessage(msg: SimpleUIMessage): SimpleMessage {
  const textPart = msg.parts.find(p => p.type === "text");
  return {
    id: msg.id,
    role: msg.role,
    content: textPart?.text || "",
  };
}
