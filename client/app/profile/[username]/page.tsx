"use client"
import React, { useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ChartLineUpIcon,
    MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { ProfileHeader, ProfileHeaderSkeleton } from "@/components/profile-page/ProfileHeader";
import { useProfileFetch } from "@/contexts/ProfileFetchContext";
import { useGameFetch } from "@/contexts/GamesFetchContext";
import { GetGamesData, ProfileType } from "@shared/index";
import GamesTable from "@/components/profile-page/GamesTable";
import Selects from "@/components/profile-page/Selects";
import { Spinner } from "@/components/ui/spinner";
import GamesFetchEmptyOrErrState from "@/components/profile-page/GamesFetchEmptyOrErrState";


const ProfilePage = (): React.ReactElement => {
    // Local State
    const [accumulatedFilters, setAccumulatedFilters] = useState<GetGamesData>({});

    // ===== Profile fetch service ===== \\
    const { profile, apiService: {
        isLoading: isLoadingProfile,
        isFetching: isFetchingProfile
    } } = useProfileFetch();

    // ===== Games fetch service ===== \\
    const {
        gamesFetchResult,
        filters,
        addFilter,
        clearFilters,
        apiService: {
            executeService,
            isLoading: isLoadingGames,
            isFetching: isFetchingGames,
            error,
            isError,
        }
    } = useGameFetch();

    // ===== Decisive boolean to track profile fetching ===== \\
    const isGettingProfile = (isLoadingProfile || isFetchingProfile);

    // ===== Decisive boolean to track games fetching ===== \\
    const isGettingGames = (isLoadingGames || isFetchingGames)

    // ===== Decisive boolean to track error during game fetching ===== \\
    const isErrDuringGameFetch = (error !== undefined || isError);

    // ===== Decisive boolean to decide if to show games ===== \\
    const showGames = (!isGettingProfile && !isGettingGames) && (profile !== null && gamesFetchResult !== null) && (!error && !isError);

    // ===== Decisive boolean to show "see more" button ===== \\
    const showSeeMoreBtn = showGames && (gamesFetchResult.page > filters.page);

    // ===== Decisive boolean to disable action button ===== \\
    const disableActionBtn = (isGettingGames || isGettingProfile || Object.keys(accumulatedFilters).length <= 0)

    // ===== Tabs trigger ===== \\
    const tabTriggers = [
        {
            id: 1,
            value: "overview",
            content: "Overview"
        },
        {
            id: 2,
            value: "games",
            content: "Games"
        },
        {
            id: 3,
            value: "friends",
            content: "Friends"
        },
    ];


    // ===== Handles filters reset ===== \\
    const handleReset = () => {
        clearFilters();
        setAccumulatedFilters({});
    };

    // ===== UseEffect to fetch the user's games ===== \\
    useEffect(() => {
        if (!profile) return;
        executeService(profile.userId);
    }, [profile, filters]);


    // Page and limit excluded filters to get the proper length
    // of filters for ui
    const pageAndLimitExcludedFilters = Object.entries(filters).filter(([ key, value ]) => {
        if (key === "page" || key === "limit") return;

        return [ key, value ]
    });
    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">

            {/* ===== Top Profile Header ===== */}
            {(isGettingProfile || !profile) ? (
                <ProfileHeaderSkeleton />
            ) : (<ProfileHeader profile={profile} isGettingProfile={isGettingProfile}/>)}

            {/* ===== Main Content Area ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Tabs and History (8 Columns) */}
                <div className="lg:col-span-8 space-y-4">
                    <Tabs defaultValue="games" className="w-full">
                        {/* ===== Tabs list ===== */}
                        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-12 p-0 gap-6">
                            {tabTriggers.map((trigger) => (
                                <TabsTrigger
                                    key={trigger.id}
                                    value={trigger.value}
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent font-bold uppercase text-[10px]"
                                >
                                    {trigger.content}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* ===== Tabs content ===== */}
                        <TabsContent value="games" className="pt-4 space-y-4">
                            {/* Live Game */}

                            {/* ==== Game history ==== */}
                            <h3 className="text-sm text-muted-foreground font-bold">Game History {(profile && profile.totalGamesPlayed >= 1) && profile.totalGamesPlayed}</h3>

                            {(isErrDuringGameFetch) ? (
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
                                    totalFilters={Object.keys(pageAndLimitExcludedFilters).length}
                                />
                            )}

                            {/* See more games */}
                            {showSeeMoreBtn && (
                                <Button
                                    variant="ghost"
                                    className="w-full text-[10px] font-bold uppercase text-muted-foreground hover:text-primary"
                                >
                                    See more
                                </Button>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side: Stats Sidebar (4 Columns) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Metric card */}
                    <Card className="p-4 bg-muted/10 border-dashed">
                        <div>
                            <h3 className="text-xs font-black text-primary mb-4 flex items-center gap-2">
                                <ChartLineUpIcon size={14} weight="bold" />
                                Performance Metrics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold">Win Rate</p>
                                    <p className="text-lg font-black">64.2%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold">Best Streak</p>
                                    <p className="text-lg font-black">{profile?.bestWinStreak || 0}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Filter card */}
                    <Card className="p-4 bg-muted/10 border-dashed gap-2">
                        <header className="font-bold text-xs pb-2 text-primary flex items-center gap-2">
                            <MagnifyingGlassIcon />
                            Search
                        </header>

                        <div className="flex flex-col gap-4">
                            {/* Selects */}
                            <Selects 
                              disabled={(isFetchingGames || isFetchingProfile)}
                              filters={filters}
                              setAccumulatedFilters={setAccumulatedFilters} 
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between flex-col sm:flex-row gap-2 mt-2">
                            <Button
                                onClick={() => addFilter(accumulatedFilters)}
                                disabled={disableActionBtn || isErrDuringGameFetch}
                                size="sm"
                                className="w-full sm:flex-1"
                            >
                                {(isFetchingGames && (Object.keys(filters).length > 2) && filters.page === 1) && <Spinner />}
                                {(isFetchingGames && (Object.keys(filters).length > 2) && filters.page === 1) ? "Searching..." : "Search"}
                            </Button>

                            <Button
                                onClick={handleReset}
                                disabled={disableActionBtn || isErrDuringGameFetch}
                                size="sm"
                                variant="outline"
                                className="w-full sm:flex-1"
                            >
                                Reset
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
