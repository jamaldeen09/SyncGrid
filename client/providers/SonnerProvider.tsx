"use client"
import React from "react";
import { toast, Toaster } from "sonner";
import { Wifi, WifiOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Calls sonners toast
 * @param variant 
 * @param message 
 * @param options 
 */
export const callToast = {
    // Standard variants
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),

    // 1. Connection Lost
    offline: () => toast.error("Offline", {
        description: "Your internet connection was lost.",
        duration: Infinity,
        icon: <WifiOff size={14} className="text-red-500" />,
        id: "connection-status",
    }),

    // 2. Connection Restored
    online: () => toast.success("Connected", {
        description: "You are back online.",
        duration: 3000,
        icon: <Wifi size={14} className="text-emerald-500" />,
        id: "connection-status", 
    }),

    // 3. Reconnecting (Active Loading State)
    reconnecting: () => toast.warning("Reconnecting", {
        description: "Attempting to reconnect...",
        duration: Infinity,
        icon: <Spinner className="text-amber-500"/>,
        id: "connection-status"
    }),
};

const SonnerProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    return (
        <>
            <Toaster
                position="bottom-right" // Bottom-right feels more like a "system tray" for industrial apps
                toastOptions={{
                    unstyled: true, // We take full control
                    classNames: {
                        toast: "w-[380px] flex items-center gap-4 p-4 bg-white border border-zinc-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] font-sans",
                        title: "text-[11px] font-bold uppercase tracking-widest text-zinc-900",
                        description: "text-[10px] text-zinc-500 uppercase tracking-tight",
                        success: "border-l-4 border-l-emerald-500 text-emerald-500",
                        error: "border-l-4 border-l-red-500 text-red-500",
                        warning: "border-l-4 border-l-amber-500",
                        info: "border-l-4 border-l-zinc-900 border",
                    },
                }}
            />
            {children}
        </>
    )
};

export default SonnerProvider;