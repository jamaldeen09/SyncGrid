import React from "react";
import { Button } from "../ui/button";
import { UsersThreeIcon } from "@phosphor-icons/react";

const PublicGamesSection = (): React.ReactElement => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Live Public Games</h2>
                    <p className="text-sm text-muted-foreground">Join ongoing matches in real-time</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <UsersThreeIcon className="h-4 w-4" />
                        <span>Leaderboard</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            </div>


            {/* See more */}
            <div className="w-full flex justify-center items-center mt-10">
                <Button variant="outline">See more</Button>
            </div>
        </section>
    );
};

export default PublicGamesSection;