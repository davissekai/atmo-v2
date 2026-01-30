"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Search,
    Menu,
    X
} from "lucide-react";

interface AppSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
    return (
        <>
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-sidebar border-b border-border/10 z-50 md:hidden">
                <Logo />
                <Button variant="ghost" size="icon" onClick={onToggle}>
                    <Menu className="size-5 text-white" />
                </Button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full flex flex-col items-center py-6 border-r border-border/10 bg-sidebar z-50 transition-all duration-300",
                    // Mobile: slide in/out
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "w-64 md:translate-x-0",
                    // Desktop: responsive width
                    isOpen ? "md:w-64" : "md:w-[70px]"
                )}
            >
                {/* Mobile Close Button */}
                <div className="absolute top-4 right-4 md:hidden">
                    <Button variant="ghost" size="icon" onClick={onToggle}>
                        <X className="size-5 text-white" />
                    </Button>
                </div>

                {/* Brand Icon / Logo */}
                <div className="mb-8 mt-2 w-full px-4 flex items-center justify-center">
                    <div onClick={onToggle} className="cursor-pointer hidden md:block">
                        <Logo collapsed={!isOpen} />
                    </div>
                    <div className="md:hidden">
                        <Logo />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-2 w-full px-3">
                    <NavButton
                        icon={MessageSquare}
                        label="Messages"
                        active
                        collapsed={!isOpen}
                    />
                    <NavButton
                        icon={Search}
                        label="Search"
                        collapsed={!isOpen}
                    />
                </nav>

                {/* Toggle Button - Desktop Only */}
                <div className="hidden md:flex justify-center pt-4 border-t border-white/5 w-full px-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="opacity-50 hover:opacity-100"
                    >
                        {isOpen ? (
                            <ChevronLeft className="size-5" />
                        ) : (
                            <ChevronRight className="size-5" />
                        )}
                    </Button>
                </div>
            </aside>
        </>
    );
}

function NavButton({
    icon: Icon,
    label,
    active,
    collapsed
}: {
    icon: any;
    label: string;
    active?: boolean;
    collapsed?: boolean;
}) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full h-10 rounded-xl transition-all duration-300 group",
                active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                // On mobile always show labels, on desktop respect collapsed state
                "px-4 justify-start gap-3 md:px-0 md:justify-center",
                !collapsed && "md:px-4 md:justify-start md:gap-3"
            )}
            title={collapsed ? label : undefined}
        >
            <Icon className={cn("size-5 shrink-0", active && "text-primary")} />

            <span className={cn(
                "font-medium truncate transition-all duration-300 origin-left",
                // Mobile: always show, Desktop: respect collapsed
                "md:w-0 md:opacity-0 md:scale-0",
                !collapsed && "md:w-auto md:opacity-100 md:scale-100"
            )}>
                {label}
            </span>
        </Button>
    );
}
