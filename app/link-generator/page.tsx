"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Globe } from "lucide-react";

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



    return (
        <div className="min-h-screen bg-[#0A100D] text-white font-sans selection:bg-[#40902e] selection:text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#40902e] rounded-full blur-[180px] opacity-10 pointer-events-none" />

            {/* Navbar / Logo */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                <Globe className="size-6 text-[#40902e]" />
                <span className="text-xl font-medium tracking-tight">Atmo</span>
            </div>

            <div className="max-w-2xl mx-auto relative z-10 pt-16">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Climate Dictionary <br /> <span className="text-[#40902e]">Link Generator</span></h1>
                    <p className="text-lg text-white/50 max-w-lg mx-auto">
                        Create deep links for the ACC Climate Dictionary series.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 mb-6 shadow-2xl shadow-black/50">
                    <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide uppercase text-xs">
                        Climate Dictionary Term
                    </label>
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="e.g., Maladaptation"
                        className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#40902e] focus:border-[#40902e] text-lg transition-all"
                        onKeyDown={(e) => e.key === "Enter" && generateLink()}
                    />
                    <Button
                        onClick={generateLink}
                        disabled={!term.trim()}
                        className="mt-6 w-full h-14 bg-[#40902e] hover:bg-[#367a26] text-white font-medium text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#40902e]/20"
                    >
                        Generate Deep Link
                    </Button>
                </div>

                {/* Output Section */}
                {generatedLink && (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                        <label className="block text-sm font-medium text-white/70 mb-3 tracking-wide uppercase text-xs">
                            Shareable Link
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={generatedLink}
                                readOnly
                                className="flex-1 px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-[#40902e] font-mono text-sm focus:outline-none selection:bg-[#40902e] selection:text-white"
                            />
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="h-auto w-16 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                            >
                                {copied ? <Check className="size-5 text-[#40902e]" /> : <Copy className="size-5" />}
                            </Button>
                        </div>

                        {copied && (
                            <p className="text-[#40902e] text-sm mt-3 animate-in fade-in-0 flex items-center justify-center gap-2">
                                <Check className="size-3" /> Copied to clipboard
                            </p>
                        )}
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-12 text-center text-white/30 text-sm space-y-2">
                    <p>Internal tool for Africa Climate Collaborative.</p>
                </div>
            </div>
        </div>
    );
}
