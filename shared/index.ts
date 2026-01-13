import { EventType } from "./types/socket.types";


// ===== Socket events ===== \\
export const events: EventType = {
    ping: "ping",
    pong: "pong"
}

// ===== Types ===== \\
export * from "./types/auth.types";
export * from "./types/profile.types";
export * from "./types/socket.types"