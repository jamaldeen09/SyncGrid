// ===== Connections ===== \\
export const onConnection = () => console.log(`✅ Connected`);

// ===== Disconnections ===== \\
export const onDisconnection = () => console.log("❌ Disconnected");

// ===== Reconnections ===== \\
export const onReconnection = (attempt: number) => console.log(`Reconnected to server on attempt: ${attempt}`);

// ===== Reconnection attempt ===== \\
export const onReconnectionAttempt = (attempt: number) => {
    console.log(`Attempting to reconnect...\nCurrent attempt: ${attempt}`);
}

// ===== Reconnection failed ===== \\
export const onReconnectionFailed = () => console.log("❌ Reconnection failed after all attempts");

// ===== Reconnection error ===== \\
export const onReconnectionError = (err: unknown) => console.error(`Reconnection error\n${err}`);

