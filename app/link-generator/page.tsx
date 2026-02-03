"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";

export default function LinkGeneratorPage() {
    const [term, setTerm] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        if (!term.trim()) return;

        // Create the prompt that will be auto-sent
        const prompt = `Explain what ${term.trim()} means in the context of climate change, and provide further insights into the concept.`;

        // URL-encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // Generate the full URL (production URL)
        const baseUrl = "https://atmo-v2.vercel.app";
        const fullUrl = `${baseUrl}/chat?prompt=${encodedPrompt}`;

        setGeneratedLink(fullUrl);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (!generatedLink) return;

        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const testLink = () => {
        if (!generatedLink) return;
        window.open(generatedLink.replace("https://atmo-v2.vercel.app", "http://localhost:3000"), "_blank");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">ACC Climate Dictionary Link Generator</h1>
                    <p className="text-slate-400">
                        Generate shareable links that open Atmo with a Climate Dictionary term pre-loaded.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Climate Dictionary Term
                    </label>
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="e.g., Climate Resilience"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                        onKeyDown={(e) => e.key === "Enter" && generateLink()}
                    />
                    <Button
                        onClick={generateLink}
                        disabled={!term.trim()}
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors"
                    >
                        Generate Link
                    </Button>
                </div>

                {/* Output Section */}
                {generatedLink && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Shareable Link
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={generatedLink}
                                readOnly
                                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-emerald-400 font-mono text-sm focus:outline-none"
                            />
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="px-4 border-slate-600 hover:bg-slate-700"
                            >
                                {copied ? <Check className="size-5 text-emerald-400" /> : <Copy className="size-5" />}
                            </Button>
                        </div>

                        {copied && (
                            <p className="text-emerald-400 text-sm mt-2 animate-in fade-in-0">
                                ✓ Copied to clipboard!
                            </p>
                        )}

                        {/* Test Link Button */}
                        <Button
                            onClick={testLink}
                            variant="ghost"
                            className="mt-4 text-slate-400 hover:text-white"
                        >
                            <ExternalLink className="size-4 mr-2" />
                            Test Link (localhost)
                        </Button>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-sm text-slate-400">
                    <h3 className="font-medium text-slate-300 mb-2">How it works:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Enter the Climate Dictionary term (e.g., &quot;Carbon Footprint&quot;)</li>
                        <li>Click &quot;Generate Link&quot; to create a shareable URL</li>
                        <li>Copy the link and add it to your social media post</li>
                        <li>When users click the link, Atmo opens and explains the term automatically</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
