"use client"
import Loader from "@/components/reusable/Loader";
import { useBannerLiveGame } from "@/contexts/BannerLiveGameContext";
import React, { useEffect, useState } from "react";

const BannerLiveGameProvider = ({ children, userId, currentUserId }: {
    children: React.ReactNode,
    userId?: string;
    currentUserId?: string;
}): React.ReactElement => {
    // Local states

    // Hooks
    const { apiService: { executeService } } = useBannerLiveGame();

    // Use effect to make an http req
    // to get banner live game data when the component mounts
    useEffect(() => {
        if ((userId || currentUserId) && (userId === currentUserId)) executeService();
        if (!userId && !currentUserId) executeService();
    }, [userId, currentUserId]);

    return <>{children}</>
};

export default BannerLiveGameProvider;