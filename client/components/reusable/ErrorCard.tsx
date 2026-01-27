"use client"
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, AlertOctagon } from "lucide-react";

const ErrorCard = ({ messageDescription, messageHeader, statusCode }: {
    messageHeader: string;
    messageDescription: string;
    statusCode: number
}) => {
    return (
        <div className="w-full max-w-sm sm:max-w-xl bg-white border-2 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(239,68,68,0.1)] overflow-hidden">
            {/* Warning Header Strip */}
            <div className="bg-red-500 py-2 px-4 flex items-center justify-between border-b-2 border-zinc-900">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                    Error
                </span>
                <AlertOctagon size={14} className="text-white" />
            </div>

            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                        {messageHeader}
                    </h1>
                    <p className="text-[11px] font-medium uppercase tracking-tight text-zinc-500 leading-relaxed max-w-md">
                        {messageDescription}
                    </p>
                </div>

                <div className="pt-4 flex items-center">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button 
                            className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest h-10 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none transition-all"
                        >
                            <ArrowLeft size={14} className="mr-2" />
                            Go back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom Diagnostic Bar */}
            <div className="bg-zinc-50 border-t border-zinc-200 py-2 px-4 flex justify-between items-center">
                <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 w-4 bg-red-500/20" />
                    ))}
                </div>
                <span className="text-[8px] font-mono text-zinc-400">STATUS: {statusCode}</span>
            </div>
        </div>
    )
}

export default ErrorCard;