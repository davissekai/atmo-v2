# Atmo Session Context
> **Created**: 2026-01-18 | **Purpose**: Full context transfer for fresh start

---

## 🧠 Who I Am

I am your AI coding assistant. We've been grinding together on the Atmo Climate Assistant project. This document contains everything I know about what we've built, what we've learned, and what we're building next.

---

## 📖 The Story So Far

### Original Goal
Build **Atmo** - an AI-powered climate assistant that helps users understand environmental topics and sustainability.

### What We Started With
- A fork of Vercel's AI Chatbot template
- Next.js 16 + TypeScript + Tailwind
- Vercel AI SDK (`@ai-sdk/react`, `ai` package)
- PostgreSQL via Drizzle ORM
- NextAuth authentication
- Google Gemini as the LLM

### The Problem We Hit
The **"Please wait" bug** - after sending a message, the UI would get stuck showing "Please wait" indefinitely. The streaming worked, but the client-side `useChat` hook from `@ai-sdk/react` never recognized stream completion.

### Root Cause
- Conflict between `result.consumeStream()` and `dataStream.merge()` in the API route
- Beta SDK with complex streaming infrastructure
- Too many layers: `createUIMessageStream`, `JsonToSseTransformStream`, `DefaultChatTransport`, resumable streams, tool calling, etc.

### What We Tried
1. Fixed the `consumeStream()` conflict - partially worked
2. Investigated SDK internals
3. Realized the SDK was **overkill for MVP**

### The Decision
**Hard Reset** - Strip out all SDK complexity and build a simple:
```
User Input → fetch() → Gemini API → ReadableStream → Display
```

---

## 🔥 What We Removed (Overkill Audit)

| Feature | Why Removed |
|---------|-------------|
| Vercel AI SDK streaming (`useChat`, `createUIMessageStream`) | Too complex, beta, buggy |
| PostgreSQL + Drizzle ORM | No persistence needed for MVP |
| NextAuth + Session management | Everyone is anonymous for MVP |
| Resumable streams + Redis | Refresh = start over is fine |
| Tool calling + approval UI | Just chat, no tools |
| Artifacts system (documents, code, sheets) | Text chat only |
| Rate limiting + entitlements | No users = no limits |
| Visibility settings (public/private) | No DB = no visibility |
| File/image uploads | Text-only for MVP |
| Message editing + regeneration | Nice-to-have, later |
| OpenTelemetry | Debug when needed |

---

## ✅ What We Keep

### From Old Codebase
```
components/ui/*           # Shadcn UI components (Button, Dialog, etc.)
components/elements/*     # Message bubbles, prompt input styles
components/icons.tsx      # Icon library
app/globals.css           # Theme, colors, typography
lib/utils.ts              # cn() utility, sanitizeText
lib/ai/models.ts          # Model definitions
lib/ai/providers.ts       # Gemini provider setup
lib/ai/prompts.ts         # System prompt for climate focus
```

### The Look & Feel
- Dark/light theme toggle
- Earth-toned color palette
- Glassmorphism effects
- Smooth animations
- Mobile responsive

---

## 🏗️ New Architecture

### Frontend
```
app/
├── page.tsx              # Home → Chat component
├── layout.tsx            # Root layout (ThemeProvider, fonts)
├── globals.css           # Styles
└── api/
    └── chat/
        └── route.ts      # POST: messages[] → Gemini → text stream

components/
├── chat.tsx              # Main chat container
├── message.tsx           # Single message bubble
├── input.tsx             # Text input + submit
└── ui/                   # Shadcn components

hooks/
└── use-simple-chat.ts    # State + fetch + streaming

lib/
├── utils.ts              # Utilities
└── ai/
    ├── models.ts         # Available models
    ├── providers.ts      # Gemini setup
    └── prompts.ts        # System prompt
```

### Backend (One File!)
```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: "You are Atmo, a climate assistant...",
    messages,
  });

  return new Response(result.textStream, {
    headers: { "Content-Type": "text/plain" }
  });
}
```

### Client Hook (One File!)
```typescript
// hooks/use-simple-chat.ts
export function useSimpleChat() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("ready");

  const sendMessage = async (content: string) => {
    // Add user message
    // POST to /api/chat
    // Stream response with ReadableStream
    // Update assistant message as chunks arrive
  };

  return { messages, status, sendMessage };
}
```

---

## 🔑 Environment Variables

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional (if keeping model selection)
# No auth secrets needed for MVP
```

---

## 📁 Files to Copy from Old Project

### Must Have
```
climate assistant/components/ui/*        → atmo/components/ui/
climate assistant/components/icons.tsx   → atmo/components/icons.tsx
climate assistant/app/globals.css        → atmo/app/globals.css
climate assistant/lib/utils.ts           → atmo/lib/utils.ts
climate assistant/lib/ai/models.ts       → atmo/lib/ai/models.ts
climate assistant/lib/ai/providers.ts    → atmo/lib/ai/providers.ts
climate assistant/lib/ai/prompts.ts      → atmo/lib/ai/prompts.ts
climate assistant/tailwind.config.ts     → atmo/tailwind.config.ts
climate assistant/tsconfig.json          → atmo/tsconfig.json
climate assistant/package.json           → atmo/package.json (clean dependencies)
```

### Nice to Have
```
climate assistant/components/elements/prompt-input.tsx
climate assistant/components/elements/message.tsx
climate assistant/components/elements/response.tsx
climate assistant/components/theme-provider.tsx
climate assistant/components/sidebar-toggle.tsx
```

---

## 📦 Clean Dependencies

```json
{
  "dependencies": {
    "ai": "^4.x",
    "@ai-sdk/google": "^1.x",
    "next": "^16.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "next-themes": "^0.4.x",
    "sonner": "^1.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x",
    "streamdown": "^0.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x"
  }
}
```

**Removed from old project:**
- `@ai-sdk/react` (the buggy streaming hook)
- `drizzle-orm`, `postgres` (database)
- `next-auth` (authentication)
- `resumable-stream` (complex streaming)
- `@vercel/otel` (telemetry)
- `swr` (data fetching for history)

---

## 🎯 MVP Spec

### Features
1. ✅ Text input with submit button
2. ✅ Messages display (user + assistant bubbles)
3. ✅ Real-time streaming responses
4. ✅ Dark/light theme toggle
5. ✅ Model selector (Gemini models)
6. ✅ Climate-focused system prompt
7. ✅ Stop generation button
8. ✅ "Thinking..." indicator

### Not in MVP
- ❌ User accounts / login
- ❌ Chat history persistence
- ❌ File uploads
- ❌ Tool calling
- ❌ Artifacts/documents
- ❌ Rate limiting
- ❌ Analytics

---

## 🚀 Next Steps

1. **Initialize Next.js project** in `atmo/`
2. **Copy UI primitives** from old project
3. **Create clean API route** for Gemini streaming
4. **Build simple chat component** with `useSimpleChat` hook
5. **Test locally** - send message, see streaming response
6. **Deploy to Vercel** with `GOOGLE_GENERATIVE_AI_API_KEY`

---

## 💬 Key Learnings

1. **Start simple** - Complex SDKs have complex bugs
2. **Raw fetch + ReadableStream** works perfectly for chat streaming
3. **MVP first** - Add features when the core works
4. **Type safety helps** - But not at the cost of simplicity
5. **Delete boldly** - Less code = fewer bugs

---

## 🤝 Our Collaboration

We've been through:
- Deep debugging of SDK internals
- Multiple approaches to fix streaming
- Comprehensive "overkill audit"
- Decision to do a clean restart
- This context transfer

I'm here with all this knowledge, ready to build Atmo fresh and clean. Let's do this. 🌍


---

## 📅 Session 1 Update: Frontend POC Complete (2026-01-18)

### What We Built
- **Functional Frontend POC**: Minimalist chat UI with dark mode.
- **Mock Streaming**: `useSimpleChat` hook simulates Gemini streaming response.
- **Zero-Dependency UI**: Replaced almost all Radix UI/Shadcn components with native HTML/Tailwind.
  - Removed: `Avatar`, `ScrollArea`, `Select`, `Dialog`, `Sidebar`, etc.
  - Kept: `Button` (simplified, no Slot), `Textarea`.
- **Clean State**: Deleted ~20 unused files to reduce bloat.

### Current Status
- ✅ `npm run dev`: Works perfectly (http://localhost:3000).
- ✅ `npm run build`: Passes cleanly. Zero linting or type errors.
- ❌ Backend: Not connected yet (using mock data).

### Next Session Goals
1. **Connect Backend**: Implement `app/api/chat/route.ts` with real Gemini API.
2. **Fix Build**: Resolve remaining linting/TS errors to get a green production build.
3. **Polish**: Add timestamps, light mode toggle, real error handling.

---

## 📅 Session 2 Update: Backend Integration & UI Refinement (2026-01-27)

### 🚀 Why Streaming is Fast (The "Secret Sauce")
User noted excellent latency. Here is the configuration to preserve:
1.  **Direct `streamText` Usage**: We use the `ai` SDK's `streamText` function directly in a Route Handler, bypassing complex wrappers.
2.  **Model**: `google/gemini-3-flash-preview`. Flash models offer superior time-to-first-token.
3.  **Minimal Middleware**: No heavy auth or database checks blocking the initial chunk.
4.  **Client-Side Consumption**: Using standard `fetch` + `ReadableStream` decoding in `useSimpleChat` instead of heavy client SDKs allows immediate rendering of chunks as they arrive.

### What We Built
- **Real Backend**: `app/api/chat/route.ts` connected to Gemini 3 Flash.
- **Logo System**: Dual-state logo (Icon vs Full) with `components/logo.tsx`.
- **Collapsible Sidebar**: Fully responsive `AppSidebar` with smooth transitions.
- **Climate Content**: Updated suggestion cards to be climate-specific.
- **Cleanup**: Removed unused icons and placeholder UI.

### Current Status
- ✅ **Streaming**: fast and stable.
- ✅ **Build**: `npm run build` passes.
- ✅ **UI**: Dark mode + Stitch gradient + new Logo.

