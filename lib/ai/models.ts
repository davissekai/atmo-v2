// Curated list of top models
export const DEFAULT_CHAT_MODEL = "stepfun/step-3.5-flash:free";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  // OpenRouter (Fastest)
  {
    id: "stepfun/step-3.5-flash:free",
    name: "StepFun 3.5 Flash",
    provider: "openrouter",
    description: "Ultra-fast response times via OpenRouter",
  },
  // Google
  {
    id: "google/gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "google",
    description: "Pro-level intelligence at Flash speed",
  },
  {
    id: "google/gemini-3-pro-preview",
    name: "Gemini 3 Pro",
    provider: "google",
    description: "Advanced reasoning for complex tasks",
  },
];

// Group models by provider for UI
export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
