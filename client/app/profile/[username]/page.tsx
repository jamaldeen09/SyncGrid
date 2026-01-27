"use client"
import React, { useEffect, useState } from "react";
import {
    TrendingUp,
    Search,
    RotateCcw,
    History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader, ProfileHeaderSkeleton } from "@/components/profile-page/ProfileHeader";
import { useProfileFetch } from "@/contexts/ProfileFetchContext";
import { useGameFetch } from "@/contexts/GamesFetchContext";
import { GetGamesData } from "@shared/index";
import GamesTable from "@/components/profile-page/GamesTable";
import Selects from "@/components/profile-page/Selects";
import { Spinner } from "@/components/ui/spinner";
import GamesFetchEmptyOrErrState from "@/components/profile-page/GamesFetchEmptyOrErrState";
import LiveGameBanner from "@/components/profile-page/LiveGameBanner";
import BannerLiveGameProvider from "@/providers/BannerLiveGameProvider";
import { useAppSelector } from "@/redux/store";
import { useBannerLiveGame } from "@/contexts/BannerLiveGameContext";

const ProfilePage = (): React.ReactElement => {
    // Local states
    const [accumulatedFilters, setAccumulatedFilters] = useState<GetGamesData>({});

    // Current user's id
    const currentUserId = useAppSelector((state) => state.user.auth.userId)

    // ===== Hooks ===== \\
    // Profile fetch hook
    const {
        profile,
        setProfile,

        apiService: {
            isLoading: isLoadingProfile,
            isFetching: isFetchingProfile,
        }
    } = useProfileFetch();

    // Games fetch hook
    const {
        gamesFetchResult,
        resetGameFetchState,
        filters,
        addFilter,
        clearFilters,
        goToNextPage,
        apiService: {
            executeService,
            isLoading: isLoadingGames,
            isFetching: isFetchingGames,
            isError,
            error,
        }
    } = useGameFetch();

    const {
    bannerLiveGameId
    } = useBannerLiveGame();

    // ===== Useful booleans ===== \\
    const isGettingProfile = isLoadingProfile || isFetchingProfile;
    const isGettingGames = isLoadingGames || isFetchingGames;
    const isErrDuringGameFetch = error !== undefined || isError;
    const disableResetBtn = Object.keys(filters).length <= 2; // page and limit always exists indicating there are no real filters

    // Resets filters and accumulated filters
    const handleReset = () => {
        clearFilters();
        setAccumulatedFilters({});
    };

    // UseEffect responsible for fetching a user's games
    useEffect(() => {
        if (!profile) return;
        executeService(profile.userId);
    }, [profile, filters]);
    return (
        <BannerLiveGameProvider userId={profile?.userId || ""} currentUserId={currentUserId}>
            <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-8 font-sans selection:bg-emerald-100">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <section className="border-b border-zinc-200 pb-8">
                        {(isGettingProfile || !profile) ? (
                            <ProfileHeaderSkeleton />
                        ) : (
                            <ProfileHeader
                                resetGameFetchState={resetGameFetchState}
                                setProfile={setProfile}
                                profile={profile}
                                isGettingProfile={isGettingProfile}
                            />
                        )}
                    </section> 

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT: Game History */}
                        <main className="lg:col-span-9 space-y-6">
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black italic tracking-tight uppercase flex items-center gap-2">
                                        <History size={20} className="text-zinc-900" />
                                        Game History
                                    </h2>
                                    <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                                        Total Games: {profile?.totalGamesPlayed || 0}
                                    </p>
                                </div>
                                {isGettingGames && <Spinner className="w-4 h-4 text-emerald-500" />}
                            </div>

                            <div className="space-y-2">
                                {/* 1. Live Game Section (Only show if a live game exists in your state/context) */}
                                {(bannerLiveGameId && profile) && (currentUserId === profile.userId) && (
                                    <LiveGameBanner
                                        bannerLiveGameId={bannerLiveGameId}
                                    />
                                )}

                                {/* 2. Historical Games Table */}
                                <div className="bg-white border border-zinc-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]">
                                    {isErrDuringGameFetch ? (
                                        <GamesFetchEmptyOrErrState
                                            profile={profile}
                                            executeService={executeService}
                                            stateType="error"
                                        />
                                    ) : (
                                        <GamesTable
                                            isGettingGames={isGettingGames}
                                            gamesFetchResult={gamesFetchResult!}
                                            profile={profile!}
                                            getGames={executeService}
                                            clearFilters={handleReset}
                                            totalFilters={Object.keys(filters).length - 2}
                                            seeMore={goToNextPage}
                                            isLoadingGames={isLoadingGames}
                                        />
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* RIGHT: Stats & Filters */}
                        <aside className="lg:col-span-3 space-y-8">

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                    <TrendingUp size={14} /> Analytics
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="p-4 bg-white border border-zinc-200">
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Win Rate</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-emerald-600">{profile?.winRate || 0}</p>
                                    </div>
                                    <div className="p-4 bg-white border border-zinc-200">
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Peak Streak</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-zinc-900">{profile?.bestWinStreak || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-200">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                    <Search size={14} /> Filters
                                </h3>

                                <div className="space-y-4">
                                    <Selects
                                        disabled={isGettingGames || isGettingProfile}
                                        filters={filters}
                                        setAccumulatedFilters={setAccumulatedFilters}
                                    />

                                    <div className="flex flex-col gap-2 pt-2">
                                        <Button
                                            onClick={() => addFilter(accumulatedFilters)}
                                            disabled={isGettingGames || Object.keys(accumulatedFilters).length === 0}
                                            className="w-full bg-zinc-900 text-white rounded-none h-10 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)] hover:shadow-none"
                                        >
                                            {(isGettingGames && Object.keys(accumulatedFilters).length >= 1) ? (<Spinner />) : "Execute Search"}
                                        </Button>
                                        <Button
                                            disabled={disableResetBtn}
                                            onClick={handleReset}
                                            variant="outline"
                                            className="w-full rounded-none h-10 text-[10px] font-bold uppercase tracking-widest border-zinc-200"
                                        >
                                            <RotateCcw className="mr-2" size={12} /> Reset
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </BannerLiveGameProvider>
    );
};

export default ProfilePage;