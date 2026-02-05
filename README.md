# 🌍 Atmo

An AI-powered Climate Assistant that helps you understand environmental topics and sustainability.

## Features

- **Real-time streaming** chat with StepFun 3.5 Flash (via OpenRouter)
- **Deep Think mode** for rigorous analysis of complex climate questions
- **Climate-focused** system prompt with solution-oriented responses
- **Dark mode** UI with Earth-toned aesthetics

## Getting Started

### Prerequisites

- Node.js 18+
- OpenRouter API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### Development

```bash
npm run dev
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **LLM:** StepFun 3.5 Flash via OpenRouter
- **UI:** Radix primitives + Framer Motion

## License

MIT
