import GameProvider from "@/providers/GameProvider";
import React from "react";

const FinishedGameLayout = ({ children, params }: {
  children: React.ReactNode;
  params: React.Usable<{ gameId: string }>
}): React.ReactElement => {
  const { gameId } = React.use(params);
  return (
    <GameProvider gameId={gameId} gameType="finished-game">
      {children}
    </GameProvider>
  );
};

export default FinishedGameLayout;