import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    autoConnect: false, // Prevents automatic connections

    reconnection: true,
    reconnectionAttempts: 70,  // Number of times it attempts to reconnect
    reconnectionDelay: 1000,  // Delay in between reconnections (in ms)
    reconnectionDelayMax: 10000, // After stacking up reconnectionDelay and adding [reconnectionDelay_value + reconnectionDelay_value] each reaconnection this value is the stop delay limit (the point where it stops getting stacked up)
    randomizationFactor: 0.5,
    timeout: 20000, // Wait x_ms for server responses
    auth: (cb) => {
        cb({ token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined });
    }
})

export default socket   