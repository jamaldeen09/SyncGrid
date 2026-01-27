import React from "react";
import { Button } from "../ui/button";
import { Loader2, } from "lucide-react";

interface ActionSectionProps {
    isFindingMatch: boolean;
    isCancelingMatchmaking: boolean;
    findMatch: () => void;
    cancelSearch: () => void;
};

const ActionSection = ({
    isFindingMatch,
    findMatch,
    cancelSearch,
    isCancelingMatchmaking
}: ActionSectionProps): React.ReactElement => {
    return (
        <section className="w-full lg:w-125 flex flex-col justify-center p-16 gap-12 bg-[#F8F8F8]">
            <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter leading-tight">
                    {isFindingMatch ? "Searching..." : "Ready to Play?"}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                    {isFindingMatch
                        ? `Establishing connection to network...\n Searching for a suitable opponent.`
                        : "Connect with an opponent instantly. Matches are fast, competitive, and recorded."
                    }
                </p>
            </div>

            <div className="space-y-6">
                {!isFindingMatch && (
                    <Button
                        disabled={isCancelingMatchmaking}
                        onClick={findMatch}
                        className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none text-lg font-bold shadow-[8px_8px_0px_0px_#064e3b] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tighter"
                    >
                        Find Match
                    </Button>
                )}

                {isFindingMatch && (
                    <Button
                        disabled={!isFindingMatch || isCancelingMatchmaking}
                        onClick={cancelSearch}
                        className="w-full h-20 bg-white border-4 border-red-600 text-red-600 hover:bg-red-50 rounded-none text-lg font-bold shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tighter flex flex-col gap-0"
                    >
                        <div className="flex items-center gap-2">
                            <Loader2 size={20} className="animate-spin" />
                            <span>{isCancelingMatchmaking ? "Canceling..." : "Cancel"}</span>
                        </div>
                    </Button>
                )}

                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                    <span>Avg Queue: 20s</span>

                    {isFindingMatch && (
                        <span className="animate-pulse text-red-500">
                            ● In queue
                        </span>
                    )}
                </div>
            </div>
        </section >
    );
};

export default ActionSection;