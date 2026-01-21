import AuthProvider from "@/providers/AuthProvider";
import GameProvider from "@/providers/GameProvider";
import LiveGameProvider from "@/providers/LiveGameProvider";
import PrivateProfileProvider from "@/providers/PrivateProfileProvider";
import React from "react";

const GameLayout = ({ children, params }: {
    children: React.ReactNode,
    params: React.Usable<{ gameId: string }>
}): React.ReactElement => {

    // GameId
    const { gameId } = React.use(params);
    return (
        <AuthProvider>
            <PrivateProfileProvider>
                <GameProvider gameId={gameId}>
                    <LiveGameProvider gameId={gameId}>
                        {children}
                    </LiveGameProvider>
                </GameProvider>
            </PrivateProfileProvider>
        </AuthProvider>
    )
}

export default GameLayout