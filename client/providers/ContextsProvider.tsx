import { BannerLiveGameContextProvider } from "@/contexts/BannerLiveGameContext";
import { GamesFetchContextProvider } from "@/contexts/GamesFetchContext";
import { GameStateContextProvider } from "@/contexts/GameStateContext";
import { MatchmakingContextProvider } from "@/contexts/MatchmakingContext";
import { ProfileFetchContextProvider } from "@/contexts/ProfileFetchContext";
import React from "react";

const ContextsProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <GamesFetchContextProvider>
      <ProfileFetchContextProvider>
        <MatchmakingContextProvider>
          <BannerLiveGameContextProvider>
            <GameStateContextProvider>
              {children}
            </GameStateContextProvider>
          </BannerLiveGameContextProvider>
        </MatchmakingContextProvider>
      </ProfileFetchContextProvider>
    </GamesFetchContextProvider>
  );
};

export default ContextsProvider;