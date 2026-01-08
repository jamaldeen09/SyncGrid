"use client"
import { useUi } from "@/contexts/UiContext";
import { onFoundGame } from "@/lib/event-handlers";
import socket from "@/lib/socket";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SocketProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  const socketConnectionRef = useRef<boolean>(false) // Used to only attempt to connect once and preventing re renders
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { closeUi } = useUi();

  useEffect(() => {
    if (socketConnectionRef.current) return;

    // Manually connects when this component mounts
    socket.connect();

    // ===== Connection and disconnection ===== \\
    socket.on("connect", () => console.log("✅ Connected"));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    // ===== Reconnection =====
    socket.io.on("reconnect", (attempt) => console.log(`Reconnected to server on attempt: ${attempt}`));
    socket.io.on("reconnect_attempt", (attempt) => console.log(`***** Attempting to reconnect... *****\nCurrent attempt: ${attempt}`));
    socket.io.on("reconnect_error", (err) => console.error(`***** Reconnection error *****\n${err}`));
    socket.io.on("reconnect_failed", () => console.error("❌ Reconnection failed after all attemps"));


    // ===== Matchmaking ===== \\
    socket.on("found_game", ({ gameId }) => onFoundGame({
      gameId,
      router,
      dispatch,
      closeUi,
    }));

    socketConnectionRef.current = true;
    return () => {
      // Clean up events when component unmounts to prevent lingering events from firing 

      // ===== Connection and disconnection ===== \\
      socket.off("connect");
      socket.off("disconnect");

      // ===== Reconnection ===== \\
      socket.io.off("reconnect");
      socket.io.off("reconnect_attempt");
      socket.io.off("reconnect_error");
      socket.io.off("reconnect_failed");

      // ===== Matchmaking ===== \\
      socket.off("found_game", ({ gameId }) => onFoundGame({
        gameId,
        router,
        dispatch,
        closeUi,
      }));
    }
  }, []);
  return <>{children}</>
};

export default SocketProvider;