import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
    collapsed?: boolean;
    className?: string;
}

export function Logo({ collapsed, className }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3 overflow-hidden", className)}>
            <Globe className="size-6 text-white shrink-0" />
            <span
                className={cn(
                    "text-xl font-semibold text-white transition-all duration-300",
                    collapsed ? "opacity-0 w-0" : "opacity-100"
                )}
            >
                Atmo
            </span>
        </div>
    );
}
