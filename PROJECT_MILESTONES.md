# Atmo Project Milestones: Wins & Setbacks

This document tracks the technical evolution, major breakthroughs, and challenges encountered during the development of Atmo—the AI Climate Assistant.

## 🏆 Major Wins

### 1. Deep Think Reasoning Engine
- **Insight**: Users needed high-level analysis that wasn't just "surface level."
- **Solution**: Successfully implemented custom First-Principles/Systems-Thinking prompt frameworks using StepFun 3.5 Flash.
- **Impact**: Atmo now performs internal reasoning before responding, providing much more structured and accurate climate analysis.

### 2. The "ChatGPT" Pill Input
- **Insight**: The initial mobile UI felt cluttered with separate buttons.
- **Solution**: Designed a single, floating, glassmorphic capsule containing the input, Deep Think toggle (Brain icon), and Submit button.
- **Impact**: Dramatically improved mobile ergonomics and aesthetics, creating a premium "app-like" feel.

### 3. Vercel Edge Streaming Fix
- **Insight**: Production API calls were returning 200 OK but with empty bodies.
- **Solution**: Migrated the chat API route to the **Edge Runtime** and optimized the streaming headers.
- **Impact**: Fixed the silent failures in production, ensuring fast and reliable message streaming globally.

### 4. Mobile UX Hardening
- **Insight**: iOS devices were zooming in on focus and text was overflowing widths.
- **Solution**: Enforced `16px` font-size for inputs and `maximum-scale=1` viewport meta tags, coupled with strict CSS `word-break` rules.
- **Impact**: Native-feeling mobile interaction without unwanted scrolling or zooming.

---

## ⚠️ Major Setbacks

### 1. Serverless Timeout/Empty Streams
- **Issue**: Standard Node.js serverless functions often struggle with long-running AI streams or fail silently if the body isn't handled immediately.
- **Lesson**: Streaming AI responses in production requires the Edge Runtime for guaranteed performance.

### 2. Form Submission "Phantom" Refreshes
- **Issue**: Standard HTML forms refresh the page on Enter.
- **Lesson**: Robust `e.preventDefault()` and `requestSubmit()` patterns are critical for Single Page App (SPA) chat interfaces.

### 3. Double-Submit Locking
- **Issue**: Having button `onClick` handlers and form `onSubmit` handlers concurrently caused dual API calls, leading to state conflicts.
- **Lesson**: Simplify event architecture to use single-source-of-truth handlers (Form Submit only).

### 4. Icon & Alignment Purgatory
- **Issue**: The transition to the "Pill" shape made centering icons horizontally and vertically difficult across different screen sizes.
- **Lesson**: Using `flex items-center` consistently on the parent container is superior to manual margin adjustments (`mb-0.5`).

---

## 📅 Roadmap Context
- [x] Refine Mobile Layout
- [x] Stability Fixes (Edge Runtime)
- [x] Thinking Mode UI
- [ ] Chat History & Persistence (Supabase)
- [ ] Proactive Climate Lessons
