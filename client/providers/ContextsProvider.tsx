import { BannerLiveGameContextProvider } from "@/contexts/BannerLiveGameContext";
import { GamesFetchContextProvider } from "@/contexts/GamesFetchContext";
import { GameStateContextProvider } from "@/contexts/GameStateContext";
import { MatchmakingContextProvider } from "@/contexts/MatchmakingContext";
import { ProfileFetchContextProvider } from "@/contexts/ProfileFetchContext";
import { UiContextProvider } from "@/contexts/UiContext";
import React from "react";

const ContextsProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <UiContextProvider>
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
    </UiContextProvider>
  );
};

export default ContextsProvider;