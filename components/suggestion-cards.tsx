"use client";

import { cn } from "@/lib/utils";

interface SuggestionCardProps {
    title: string;
    description: string;
    prompt: string;
    onClick?: () => void;
}

export function SuggestionCards({ onSelect }: { onSelect: (prompt: string) => void }) {
    const cards = [
        {
            title: "Global Warming",
            description: "Why is the Earth's average temperature rising?",
            prompt: "Explain the primary causes of global warming and why the Earth's average temperature is rising so rapidly.",
        },
        {
            title: "Coral Bleaching",
            description: "How does ocean acidification affect marine life?",
            prompt: "What is coral bleaching and how does ocean acidification specifically impact the health of coral reefs and marine biodiversity?",
        },
        {
            title: "Renewable Energy",
            description: "What are the most effective ways to reduce carbon emissions?",
            prompt: "What are the most effective renewable energy technologies and lifestyle changes for reducing individual and global carbon emissions?",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-4 w-full max-w-4xl">
            {cards.map((card, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(card.prompt)}
                    className="group flex flex-col items-start p-3 md:p-6 rounded-xl md:rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 text-left shadow-lg backdrop-blur-sm"
                >
                    <h3 className="text-sm md:text-lg font-medium text-foreground mb-0.5 md:mb-2 font-sans tracking-tight">
                        {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed font-light">
                        {card.description}
                    </p>
                </button>
            ))}
        </div>
    );
}
