# CLAUDE.md

This file provides guidance to Claude when working with this codebase.

## Project Overview

**Atmo** - An AI-powered Climate Assistant that helps users understand environmental topics and sustainability. Features real-time streaming chat with Gemini 3 Flash and a Deep Think mode for rigorous analysis.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **AI:** Google Gemini via @ai-sdk/google
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion
- **State Management:** React hooks + usehooks-ts

## Development

### Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

Required in `.env.local`:
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API key

## Code Conventions

- Use TypeScript for all files
- Use Tailwind CSS for styling (v4 with @tailwindcss/postcss)
- Use `clsx` and `tailwind-merge` for class name composition
- Use Radix UI primitives for accessible components
- Use `lucide-react` for icons

## Project Structure

```
app/              # Next.js App Router pages and layouts
components/       # Reusable UI components
hooks/            # Custom React hooks
lib/              # Utility functions and configurations
public/           # Static assets
```

## Key Files

- `app/page.tsx` - Main chat interface
- `app/layout.tsx` - Root layout with providers
- `components/ui/` - Base UI components (Radix-based)
- `lib/utils.ts` - Utility functions (cn, etc.)

## Notes

- Server runs on port 3000 by default
- Uses Edge runtime for reliable streaming
- Dark mode UI with Earth-toned aesthetics
