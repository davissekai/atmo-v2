# Atmo Codebase Audit Report

**Date:** February 26, 2025
**Auditor:** Jules

## 1. Executive Summary

The Atmo codebase is a modern Next.js 16 application using the latest technologies (Tailwind 4, React 19). While the UI is polished and aligns with the project's aesthetic goals, there are critical discrepancies between the documentation (README/Milestones) and the actual implementation, particularly regarding the AI model and Edge runtime. A significant bug in the streaming logic and security vulnerabilities in dependencies also need immediate attention.

## 2. Security Audit

### 🚨 Critical Issues
*   **Dependency Vulnerabilities**: `npm audit` reported **9 vulnerabilities** (1 High, 8 Moderate).
    *   **High Severity**: `next` (DoS vulnerability). The current version `16.0.10` is vulnerable.
    *   **Moderate Severity**: `lodash-es` (Prototype Pollution) via `streamdown` -> `mermaid`.
*   **Model Implementation Mismatch**:
    *   **Documentation**: Claims to use "Gemini 3 Flash".
    *   **Implementation**: `app/api/chat/route.ts` and `lib/ai/models.ts` explicitly use `stepfun/step-3.5-flash:free` via OpenRouter.
    *   **Risk**: This is a potential compliance/transparency issue if users expect Google's models.
*   **API Key Discrepancy**:
    *   **Documentation**: Requests `GOOGLE_GENERATIVE_AI_API_KEY`.
    *   **Implementation**: Uses `OPENROUTER_API_KEY` and `TAVILY_API_KEY`. The Google key appears unused.

### ⚠️ Warnings
*   **Input Validation**: Minimal validation in `app/api/chat/route.ts`. While it checks for `messages` array, strict schema validation (e.g., Zod) is recommended.
*   **Rate Limiting**: No rate limiting mechanism was found in the API route, leaving the app open to abuse.

## 3. Functionality & Architecture

### 🚨 Critical Issues
*   **Missing Edge Runtime**:
    *   The README claims a "Vercel Edge Streaming Fix" was applied.
    *   **Finding**: `app/api/chat/route.ts` **does not** export `runtime = 'edge'`. It is running in the default Node.js runtime. This may lead to the timeouts mentioned in "Major Setbacks".
*   **Streaming Logic Bug**:
    *   In `hooks/use-simple-chat.ts`, the stream parsing logic (`chunk.split('\n')`) is naive.
    *   **Risk**: It assumes every network chunk ends with a newline. If a JSON payload is split across two chunks (common on slower networks), `JSON.parse` will throw, causing the message to be lost or the app to crash.

### ⚠️ Warnings
*   **Ineffective Caching**:
    *   `lib/ai/cache.ts` implements an in-memory `Map`.
    *   **Finding**: In a serverless/edge environment (Vercel), this cache will be cleared frequently (on every cold start) and is not shared between instances, making it largely ineffective.
*   **Hardcoded Content**:
    *   `components/landing-page.tsx` contains hardcoded climate data (e.g., "~1.5°C") and static claims about "Gemini's thinking model" that do not match the current codebase state.
    *   `lib/ai/tavily.ts` has hardcoded keywords (e.g., "cop30"), which makes the "Deep Think" trigger brittle.

## 4. Code Quality & Standards

*   **Linting**: `next lint` failed due to environment configuration issues, but manual review shows generally clean code.
*   **Project Structure**: Well-organized following Next.js App Router best practices.
*   **Tech Stack**:
    *   **Tailwind 4**: Correctly configured.
    *   **TypeScript**: Strict mode is enabled and respected.
*   **Accessibility**:
    *   `Brain` toggle button in `components/chat.tsx` lacks an `aria-label`.

## 5. Recommendations

### Immediate Actions
1.  **Update Dependencies**: Upgrade `next` to `16.1.6` or later to fix the High severity DoS vulnerability.
2.  **Fix Edge Runtime**: Add `export const runtime = 'edge';` to `app/api/chat/route.ts` to fulfill the architecture promise.
3.  **Fix Stream Parsing**: Refactor `use-simple-chat.ts` to use a robust stream parser (e.g., `eventsource-parser` or a buffer implementation) that handles split chunks.
4.  **Align Model Usage**: Either update the code to use Google Gemini as documented OR update the documentation to reflect the use of OpenRouter/StepFun.

### Long-term Improvements
1.  **Implement Rate Limiting**: Use `@vercel/kv` or similar middleware to prevent API abuse.
2.  **External Cache**: Replace in-memory cache with Redis or Vercel KV for persistent caching.
3.  **Dynamic Content**: Fetch "Live Status" data on the landing page from an API instead of hardcoding it.
