import { Suspense } from "react";
import { Chat } from "@/components/chat";

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background text-foreground">Loading...</div>}>
            <Chat />
        </Suspense>
    );
}
