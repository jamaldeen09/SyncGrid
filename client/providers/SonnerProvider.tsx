"use client"
import React from "react";
import { toast, Toaster } from "sonner";

/**
 * Calls sonners toast
 * @param variant 
 * @param message 
 * @param options 
 */
export const callToast = (
    variant: "success" | "error" | "warning" | "info",
    message: string,
    options?: {
        duration?: number;
        style?: React.CSSProperties;
    }
) => {
    toast[variant](message, { 
        ...options, 
        duration: options?.duration || 3000 
    });
}

const SonnerProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    return (
        <>
            <Toaster
                theme="dark"
                position="top-right"
                toastOptions={{
                    style: {
                        fontFamily: "var(--font-sans)",
                        borderRadius: "0px",
                        width: "480px",
                    },
                }}
                richColors
            />
            {children}
        </>
    )
};

export default SonnerProvider;