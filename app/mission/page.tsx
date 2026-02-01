import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Megaphone, BookOpen, Eye } from "lucide-react";

export default function MissionPage() {
    return (
        <div className="min-h-screen bg-[#0A100D] text-white font-sans selection:bg-[#40902e] selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                    <ArrowLeft className="size-5" />
                    <span className="text-sm tracking-wide">Return to Atmo</span>
                </Link>
                <div className="text-xl font-medium tracking-tight opacity-90">Savoir.</div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                {/* Hero */}
                <div className="space-y-6 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                        Building a voice <br />
                        for the planet.
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
                        Climate change isn't just a science problem. It's a communication problem.
                        Savoir exists to bridge the gap between data and action.
                    </p>
                </div>

                {/* Pillars */}
                <div className="grid md:grid-cols-3 gap-12 border-t border-white/10 pt-16">

                    {/* Pillar 1 */}
                    <div className="space-y-4 group">
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#40902e]/50 transition-colors">
                            <Megaphone className="size-5 text-[#40902e]" />
                        </div>
                        <h3 className="text-lg font-medium">Advocacy</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            We don't just report data. We take a stance. We fight for the Earth because it cannot speak for itself.
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="space-y-4 group">
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#40902e]/50 transition-colors">
                            <BookOpen className="size-5 text-[#40902e]" />
                        </div>
                        <h3 className="text-lg font-medium">Education</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Knowledge powers action. We break down complexity into clarity, making climate science accessible to everyone.
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="space-y-4 group">
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#40902e]/50 transition-colors">
                            <Eye className="size-5 text-[#40902e]" />
                        </div>
                        <h3 className="text-lg font-medium">Awareness</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            From passive understanding to active stewardship. We build tools that make the planet's pulse felt in real-time.
                        </p>
                    </div>

                </div>

                {/* Footer / Connect */}
                <div className="mt-32 p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6">
                    <h2 className="text-2xl font-light">The first step is conversation.</h2>
                    <Link href="/chat">
                        <Button className="rounded-full bg-[#40902e] hover:bg-[#367a26] text-white px-8">
                            Launch Atmo
                        </Button>
                    </Link>
                    <p className="text-xs text-white/30 pt-4">Savoir © 2026</p>
                </div>

            </main>
        </div>
    );
}
