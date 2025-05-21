import { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

interface WaitingLayoutProps {
    children: ReactNode;
}

export function WaitingLayout({ children }: WaitingLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <main className="flex-1">
                {children}
            </main>
            <Toaster />
        </div>
    );
} 