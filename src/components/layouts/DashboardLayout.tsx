"use client";

import { BottomNav } from "@/components/layouts/BottomNav";
import { AlertToast } from "@/components/shared/AlertToast";
import { GlobalTopRightMenu } from "@/components/shared/GlobalTopRightMenu";
import { AuthSync } from "@/components/shared/AuthSync";
import { DesktopSidebar } from "@/components/layouts/DesktopSidebar";
import { DesktopRightPanel } from "@/components/layouts/DesktopRightPanel";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthSync />
            <AlertToast />

            {/* Desktop: 3-column layout */}
            <div className="hidden lg:flex min-h-screen w-full">
                <DesktopSidebar />
                <main className="flex-1 min-w-0 overflow-y-auto min-h-screen">
                    <div className="relative">
                        {children}
                    </div>
                </main>
                <DesktopRightPanel />
            </div>

            {/* Mobile: existing layout unchanged */}
            <div className="lg:hidden">
                <GlobalTopRightMenu />
                {children}
                <BottomNav />
            </div>
        </>
    );
}
