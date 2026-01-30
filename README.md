# Atmo 🌍

An AI-powered Climate Assistant that helps you understand environmental topics and sustainability.

## Features

- **Real-time streaming** chat with Gemini 3 Flash
- **Deep Think mode** for rigorous analysis of complex climate questions
- **Climate-focused** system prompt with solution-oriented responses
- **Dark mode** UI with Earth-toned aesthetics

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **LLM:** Google Gemini via AI SDK
- **UI:** Radix primitives + Framer Motion

## License

MIT
