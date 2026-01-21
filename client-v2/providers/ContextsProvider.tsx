import { AuthContextProvider } from "@/contexts/AuthContext";
import { GamesFetchContextProvider } from "@/contexts/GamesFetchContext";
import { ProfileFetchContextProvider } from "@/contexts/ProfileFetchContext";
import { UiContextProvider } from "@/contexts/UiContext";
import React from "react";

const ContextsProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <UiContextProvider>
      <AuthContextProvider>
        <GamesFetchContextProvider>
          <ProfileFetchContextProvider>
            {children}
          </ProfileFetchContextProvider>
        </GamesFetchContextProvider>
      </AuthContextProvider>
    </UiContextProvider>
  );
};

export default ContextsProvider;