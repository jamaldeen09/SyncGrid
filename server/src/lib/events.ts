export const events = {
    // ===== Matchmaking ===== \\
    findOpponent: "find:opponent",
    foundOpponent: "found:opponent", 
    matchmakingErr: "matchmaking:err",
    newMove: "new:move",
    moveRegistered: "move:registered",
    cancelMatchmaking: "cancel:matchmaking",

    matchmakingQueue: {
        X: "matchmaking-queue:X",
        O: "matchmaking-queue:O",
    },

    bannerLiveGame: "live-game:banner",
    gameEnded: "game:ended",
    bannerUpdate: "banner:update",
    statusUpdate: "status:update",
    forfeitGame: "game:forfeit",

    // ===== live game ===== \\
    getLiveGame: "live:game"
};  