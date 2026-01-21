import React from "react";
import { Button } from "../ui/button";

const ActionSection = (): React.ReactElement => {
    return (
        <section className="w-full lg:w-125 flex flex-col justify-center p-16 gap-12 bg-[#F8F8F8]">
            <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter leading-tight">Ready to <br /> Play?</h2>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                    Connect with an opponent instantly. Matches are fast, competitive, and recorded.
                </p>
            </div>

            <div className="space-y-6">
                <Button className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none text-lg font-bold shadow-[8px_8px_0px_0px_#064e3b] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                    Find Match
                </Button>

                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                    <span>Avg Queue: 12s</span>
                    <span className="text-emerald-600">● 1,024 Online</span>
                </div>
            </div>
        </section>
    );
};

export default ActionSection;