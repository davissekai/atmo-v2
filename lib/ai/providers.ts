import { google } from "@ai-sdk/google";

export function getLanguageModel(modelId: string) {
  if (modelId.startsWith("google/")) {
    const cleanId = modelId.replace("google/", "");
    return google(cleanId);
  }

  throw new Error(`Provider for ${modelId} not configured`);
}

