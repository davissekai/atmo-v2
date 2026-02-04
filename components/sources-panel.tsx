"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Source {
    title: string;
    url: string;
    content?: string;
}

interface SourcesPanelProps {
    sources: Source[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    // Extract domain from URL for display
    const getDomain = (url: string) => {
        try {
            const domain = new URL(url).hostname.replace("www.", "");
            return domain;
        } catch {
            return url;
        }
    };

    return (
        <div className="mt-3 w-full">
            {/* Collapsed Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
                    "bg-white/5 hover:bg-white/10 border border-white/10",
                    "text-sm text-white/70 hover:text-white/90"
                )}
            >
                <Globe className="size-4 text-[#40902e]" />
                <span className="font-medium">Sources</span>
                <span className="text-white/40">({sources.length})</span>
                <ChevronDown
                    className={cn(
                        "size-4 ml-1 transition-transform duration-200",
                        isExpanded && "rotate-180"
                    )}
                />
            </button>

            {/* Expanded Panel */}
            {isExpanded && (
                <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    {sources.map((source, index) => (
                        <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "flex items-start gap-3 p-2 rounded-lg transition-colors",
                                "hover:bg-white/5 group"
                            )}
                        >
                            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-white/60">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white/90 truncate group-hover:text-[#40902e] transition-colors">
                                        {source.title}
                                    </span>
                                    <ExternalLink className="size-3 text-white/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs text-white/40">{getDomain(source.url)}</span>
                                {source.content && (
                                    <p className="text-xs text-white/50 mt-1 line-clamp-2">
                                        {source.content}
                                    </p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
