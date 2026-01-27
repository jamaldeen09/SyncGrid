import AuthProvider from "@/providers/AuthProvider";
import GameProvider from "@/providers/GameProvider";
import LiveGameProvider from "@/providers/LiveGameProvider";
import SocketProvider from "@/providers/SocketProvider";
import React from "react"

const LiveGameLayout = ({ children, params }: {
    children: React.ReactNode;
    params: React.Usable<{ gameId: string }>
}): React.ReactElement => {
    const extractedParams = React.use(params);

    return (
        <AuthProvider>
            <SocketProvider>
                <GameProvider gameId={extractedParams.gameId} gameType="live-game">
                    <LiveGameProvider>
                        {children}
                    </LiveGameProvider>
                </GameProvider>
            </SocketProvider>
        </AuthProvider>
    )
}

export default LiveGameLayout