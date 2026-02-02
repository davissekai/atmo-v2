"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Globe, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0A100D] text-white font-sans selection:bg-[#40902e] selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A100D]/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Globe className="size-6 text-[#40902e]" />
                    <span className="text-xl font-medium tracking-tight">Atmo</span>
                </div>
                <Link href="/chat">
                    <Button
                        variant="ghost"
                        className="rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Launch Atmo <ArrowRight className="ml-2 size-4" />
                    </Button>
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#40902e] rounded-full blur-[180px] opacity-10 pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95]">
                        The Earth Needs <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                            An Advocate.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Atmo is not just a chatbot. It is a proactive steward for the planet,
                        powered by deep reasoning to bridge the gap between complex climate
                        science and urgent global action.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/chat">
                            <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-[#40902e] hover:bg-[#367a26] text-white transition-all duration-300 hover:scale-105 border border-transparent">
                                Start the Conversation
                            </Button>
                        </Link>
                        <Link href="/mission">
                            <Button variant="ghost" size="lg" className="rounded-full h-14 px-8 text-lg text-white/70 hover:text-white hover:bg-white/5">
                                Read Our Mission
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Floating Earth Visual */}
                <div className="mt-16 relative w-full max-w-[1000px] aspect-[16/9] md:aspect-[21/9] rounded-t-[40px] overflow-hidden border-t border-x border-white/10 bg-white/5 backdrop-blur-sm mask-gradient-b">
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <Image
                            src="/atmo-earth.png"
                            alt="Atmo Deep Earth"
                            width={1200}
                            height={1200}
                            className="object-cover opacity-80 scale-110 hover:scale-105 transition-transform duration-[20s] ease-linear"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A100D] via-transparent to-transparent" />
                    </div>
                </div>
            </section>

            {/* Bento Grid Pillars */}
            <section className="py-32 px-6 relative z-10 bg-[#0A100D]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1: Advocacy */}
                        <div className="group md:col-span-2 relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-10 hover:border-white/20 transition-colors">
                            <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-30 transition-opacity">
                                <ShieldCheck className="size-40 text-[#40902e]" />
                            </div>
                            <h3 className="text-2xl font-medium mb-3">A Voice, Not Just An Echo</h3>
                            <p className="text-white/60 max-w-md leading-relaxed">
                                Most AI reflects the internet. Atmo reflects the planet's needs.
                                It takes a stance on sustainability, guiding users from passive knowledge to active stewardship.
                            </p>
                        </div>

                        {/* Card 2: Deep Think */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-10 hover:border-white/20 transition-colors flex flex-col justify-end min-h-[300px]">
                            <div className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10">
                                <Brain className="size-6 text-[#40902e]" />
                            </div>
                            <h3 className="text-2xl font-medium mb-3">Deep Reasoning</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Powered by Gemini's thinking model, Atmo reasons from first principles to explain *why* the climate changes, not just *how*.
                            </p>
                        </div>

                        {/* Card 3: Urgency */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-10 hover:border-white/20 transition-colors flex flex-col justify-between min-h-[300px]">
                            <div className="flex items-center gap-2">
                                <span className="flex size-3 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Live Status</span>
                            </div>
                            <div>
                                <div className="text-4xl font-light mb-1">~1.5°C</div>
                                <div className="text-sm text-white/40">Warming above pre-industrial levels</div>
                                <div className="text-[10px] text-white/20 mt-2 uppercase tracking-widest">Source: Copernicus 2024</div>
                            </div>
                        </div>

                        {/* Card 4: Edge */}
                        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-10 hover:border-white/20 transition-colors bg-gradient-to-br from-white/5 to-transparent">
                            <h3 className="text-2xl font-medium mb-3">Global Edge Network</h3>
                            <p className="text-white/60 max-w-lg leading-relaxed">
                                Atmo lives on the Edge. Optimized for speed and accessibility. Just instant access to climate insights, wherever you are in the world.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Example Prompts Section */}
            <section className="py-24 px-6 border-t border-white/5 bg-[#0A100D]">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white/90">Build your Climate Intelligence.</h2>
                        <p className="text-lg text-white/50 max-w-2xl mx-auto">
                            From definitions to deep dives, Atmo helps you understand the language of our changing planet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {/* Prompt 1 */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#40902e]/50 hover:bg-white/[0.07] transition-all cursor-default">
                            <div className="text-[#40902e] text-sm font-medium mb-3 tracking-wide uppercase">Foundational</div>
                            <p className="text-lg text-white/80 leading-snug group-hover:text-white transition-colors">
                                "What is Greenhouse Gas mitigation, and how does it actually work?"
                            </p>
                        </div>

                        {/* Prompt 2 */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#40902e]/50 hover:bg-white/[0.07] transition-all cursor-default">
                            <div className="text-[#40902e] text-sm font-medium mb-3 tracking-wide uppercase">Concepts</div>
                            <p className="text-lg text-white/80 leading-snug group-hover:text-white transition-colors">
                                "What is the difference between 'Net Zero' and 'Carbon Neutral'?"
                            </p>
                        </div>

                        {/* Prompt 3 */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#40902e]/50 hover:bg-white/[0.07] transition-all cursor-default">
                            <div className="text-[#40902e] text-sm font-medium mb-3 tracking-wide uppercase">Context</div>
                            <p className="text-lg text-white/80 leading-snug group-hover:text-white transition-colors">
                                "Why is '1.5 degrees' considered the critical limit for warming?"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-white/30 text-sm">
                <p>&copy; 2026 Atmo. Built for the Earth.</p>
            </footer>
        </div>
    );
}
