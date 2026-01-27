"use client"
import { MoveRight, Zap } from "lucide-react";
import Link from "next/link";

interface LiveGameBannerProps {
    bannerLiveGameId: string;
}

const LiveGameBanner = ({ bannerLiveGameId }: LiveGameBannerProps) => {
    return (
        <Link 
            href={`/game/live/${bannerLiveGameId}`} 
            className="block w-full bg-emerald-500 p-4 mb-6 group transition-all hover:bg-emerald-400 active:translate-y-0.5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-zinc-900"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-zinc-900 p-2">
                        <Zap size={18} className="text-emerald-500 fill-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900/70 leading-none mb-1">
                            Action Required
                        </h4>
                        <p className="text-sm font-black text-zinc-900 uppercase">
                            You are currently in a live match
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 font-black uppercase text-[10px] text-zinc-900 tracking-tighter">
                    <span>Jump Back In</span>
                    <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

export default LiveGameBanner;