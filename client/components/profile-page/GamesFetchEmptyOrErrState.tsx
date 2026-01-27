"use client"
import React from "react";
import { AlertTriangle, SearchX, RotateCcw, DatabaseBackup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileType } from "@shared/index";

// Component props
interface GamesFetchEmptyOrErrStateProps {
    stateType: "error" | "empty" | "empty-with-filters";
    executeService?: (userId: string) => Promise<void>;
    profile?: ProfileType | null;
    clearFilters?: () => void;
}

const GamesFetchEmptyOrErrState = ({
    profile,
    executeService,
    stateType,
    clearFilters
}: GamesFetchEmptyOrErrStateProps): React.ReactElement => {

    // Content mapping for different states
    const stateConfig = {
        "error": {
            title: "Data Retrieval Failure",
            description: "Unable to synchronize with the game database.",
            icon: <AlertTriangle className="size-6 text-red-500" />,
            accent: "border-red-500",
            buttonText: "Retry Sync",
            buttonIcon: <RotateCcw size={12} />
        },
        "empty": {
            title: "No Records Found",
            description: "This user has no recorded game history.",
            icon: <DatabaseBackup className="size-6 text-zinc-400" />,
            accent: "border-zinc-200",
            buttonText: "Refresh",
            buttonIcon: <RotateCcw size={12} />
        },
        "empty-with-filters": {
            title: "Zero Matches",
            description: "No entries match your current filter parameters.",
            icon: <SearchX className="size-6 text-zinc-400" />,
            accent: "border-zinc-200",
            buttonText: "Reset Filters",
            buttonIcon: <RotateCcw size={12} />
        }
    };

    const config = stateConfig[stateType];

    return (
        <div className="w-full h-80 flex flex-col justify-center items-center bg-zinc-50/50 p-8 border border-dashed border-zinc-200">
            <div className={`flex flex-col items-center gap-4 max-w-70 text-center`}>
                {/* Square Icon Container */}
                <div className={`w-14 h-14 flex justify-center items-center border-2 border-zinc-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    {config.icon}
                </div>

                <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">
                        {config.title}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight leading-relaxed">
                        {config.description}
                    </p>
                </div>

                <div className="pt-2">
                    {stateType === "empty-with-filters" ? (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="rounded-none border-zinc-900 bg-zinc-900 text-white hover:bg-emerald-600 hover:border-emerald-600 text-[10px] font-black uppercase tracking-widest h-8 px-6 transition-all"
                        >
                            {config.buttonIcon}
                            <span className="ml-2">{config.buttonText}</span>
                        </Button>
                        
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!profile || !executeService) return;
                                executeService(profile.userId);
                            }}
                            className="rounded-none border-zinc-200 hover:border-zinc-900 text-[10px] font-black uppercase tracking-widest h-8 px-6"
                        >
                            {config.buttonIcon}
                            <span className="ml-2">{config.buttonText}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamesFetchEmptyOrErrState;