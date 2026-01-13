import { ChartLineIcon, FireIcon, TrophyIcon, UserCircleIcon } from "@phosphor-icons/react";
import React from "react";

const StatsSection = (): React.ReactElement => {
    return (
        <section className="bg-linear-to-r from-muted/30 to-muted/10 rounded-2xl p-6 border border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                        <UserCircleIcon className="h-5 w-5 text-primary" weight="fill" />
                        <div className="text-3xl font-bold text-primary">24</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                        <FireIcon className="h-5 w-5 text-primary" weight="fill" />
                        <div className="text-3xl font-bold text-primary">12</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Live Games</div>
                </div>
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                        <ChartLineIcon className="h-5 w-5 text-primary" weight="fill" />
                        <div className="text-3xl font-bold text-primary">156</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Games Today</div>
                </div>
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                        <TrophyIcon className="h-5 w-5 text-primary" weight="fill" />
                        <div className="text-3xl font-bold text-primary">98%</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;