"use client"
import React, { useState } from "react";
import PreferenceSelectorSection from "./PreferenceSelectorSection";
import ActionSection from "./ActionSection";
import { useMatchmaking } from "@/contexts/MatchmakingContext";
import { useAppSelector } from "@/redux/store";
import { callToast } from "@/providers/SonnerProvider";
import { useBannerLiveGame } from "@/contexts/BannerLiveGameContext";

const CoreWorkspace = (): React.ReactElement => {
    // Local states
    const [preference, setPreference] = useState<"X" | "O">("X");

    // Global states
    const { isAuthenticated, userId } = useAppSelector((state) => state.user.auth)

    // Custom hooks
    const {
        isFindingMatch,
        findMatch,
        isCancelingMatchmaking,
        cancelOpponentSearch
    } = useMatchmaking();

    const {
        bannerLiveGameId
    } = useBannerLiveGame();

    const isUserCurrentlyInAGame = bannerLiveGameId !== null
    return (
        <main className="flex-1 flex flex-col lg:flex-row items-stretch">

            {/* Preference Selector */}
            <PreferenceSelectorSection
                preference={preference}
                setPreference={setPreference}
                isFindingMatch={isFindingMatch}
                disableSelectors={isUserCurrentlyInAGame}
            />

            {/* Action Zone */}
            <ActionSection
                isFindingMatch={isFindingMatch}
                isCancelingMatchmaking={isCancelingMatchmaking}
                findMatch={() => {
                    if (!isAuthenticated) 
                        return callToast.error("Create an account to start playing!");

                    if (isUserCurrentlyInAGame) 
                        return callToast.error("Please finish your active match before starting a new one.")
                    
                    findMatch(isAuthenticated, userId, preference);
                }}
                cancelSearch={() => {
                    if (!isFindingMatch) return;
                    cancelOpponentSearch(isAuthenticated ,userId, preference);
                }}
            />
        </main>
    );
};

export default CoreWorkspace;