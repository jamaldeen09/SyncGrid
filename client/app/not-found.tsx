"use client"
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = (): React.ReactElement => {
    return (
        /* Use min-h-screen to allow scrolling if content overflows on tiny heights */
        <div className="min-h-screen w-full bg-[#F8F8F8] text-zinc-900 font-sans flex flex-col p-4 sm:p-6 selection:bg-emerald-100 overflow-x-hidden">

           {/* Simple Header */}
            <header className="w-full flex items-center border-b border-zinc-200 pb-4 gap-4">
                <div className="h-3 w-3 bg-zinc-200 shrink-0" /> 
                <h1 className="text-[10px] sm:text-xs font-medium tracking-widest uppercase opacity-50 truncate">
                    Page Not Found
                </h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center border-x border-zinc-200 bg-white px-4 py-12">
                <div className="max-w-sm w-full text-center space-y-8 sm:space-y-12">

                    {/* Fluid Typography Container */}
                    <div className="relative inline-block w-full">
                        <h2 className="text-[25vw] sm:text-[10rem] font-black tracking-tighter leading-none opacity-5 select-none">
                            404
                        </h2>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg sm:text-xl font-bold tracking-tight bg-white px-2">
                                You are here.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-62.5 mx-auto">
                        We couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>

                    <Button
                        asChild
                        className="w-full h-14 sm:h-16 bg-zinc-900 hover:bg-emerald-600 text-white rounded-none text-[10px] sm:text-xs tracking-[0.2em] font-bold transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                        <Link href="/" className="flex items-center justify-center gap-2">
                            <ArrowLeft size={16} />
                            TAKE ME HOME
                        </Link>
                    </Button>
                </div>
            </main>
            
            {/* Simple Bottom Border */}
            <footer className="h-4 border-t border-zinc-200" />
        </div>
    );
};
 
export default NotFoundPage;