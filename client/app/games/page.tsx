"use client"
import { ArrowLeftIcon, FunnelIcon, GameControllerIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/redux/store";
import { setBooleanTrigger } from "@/redux/slices/triggers-slice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Filter, { Filters, getSelects } from "@/components/reusable/Filter";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { GameCard, GameCardSkeleton } from "@/components/reusable/GameCard";22
import useGameFetchService from "@/hooks/useGameFetchService";

const EmptyGames = ({ dispatch }: { dispatch: AppDispatch }) => {
  return (
    <Card className="p-8 text-center border-dashed">
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
          <GameControllerIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">No games created yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first game to start playing against opponents
          </p>
        </div>
        <div className="pt-2">
          <Button
            onClick={() => dispatch(setBooleanTrigger({ key: "gameCreation", value: true }))}
            className="px-6"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create a Game
          </Button>
        </div>
      </div>
    </Card>
  )
}

const EmptyGamesWithFilters = ({ setFilters, filtersKeys }: {
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filtersKeys: Omit<keyof Filters, "page" | "limit">;
}) => {
  return (
    <Card className="p-8 text-center border-dashed">
      <div className="space-y-6 max-w-md mx-auto">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
          <GameControllerIcon className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xl">
            {filtersKeys.length > 0 ? 'No matching games found' : 'No games created yet'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {filtersKeys.length > 0
              ? 'Try adjusting your filters or create a new game with different settings.'
              : 'Create your first game to start playing against opponents.'
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({});
              if (typeof window !== "undefined") localStorage.removeItem("filters")
            }}
            className="gap-2"
          >
            <XIcon className="h-4 w-4" />
            Clear all filters
          </Button>
        </div>
      </div>
    </Card>
  )
}

const GamesLoadingState = () => {
  return (
    Array.from({ length: 8 }).map((_, i: number) => {
      return <GameCardSkeleton key={i} />
    })
  )
};

const Games = () => {
  // Global state helpers
  const dispatch = useAppDispatch();
  const { gamesFetchResult } = useAppSelector((state) => state.game);

  // Custom hook to aid games fetch
  const {
    filterHelpers,
    filters,
    setFilters,
    apiService: { isLoading, isFetching, seeMoreData, targetDivRef }
  } = useGameFetchService();

  // Loading state + selects
  const isGettingGames = isLoading || isFetching;
  const selects = getSelects();

  // Filters keys and entries
  const filtersKeys = filterHelpers.getFiltersKeysOrEntries("keys");
  const filtersEntries = filterHelpers.getFiltersKeysOrEntries("entries");
  return (
    <div ref={targetDivRef} className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ===== Header with filters ===== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Your Created Games</h2>
              <p className="text-sm text-muted-foreground">
                Games you created. Click "Search for an opponent" to start matchmaking
              </p>
            </div>

            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeftIcon /> Go back
              </Button>
            </Link>
          </div>

          {/* ====== Filters Section ===== */}
          <div className="space-y-4">
            {/* Filter Card */}
            <Card className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FunnelIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Filters</h3>
                      <p className="text-xs text-muted-foreground">
                        Refine your game list
                      </p>
                    </div>
                  </div>

                  {Object.keys(filters).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => filterHelpers.manipulateFilters("clear")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="h-3.5 w-3.5 mr-1.5" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* ===== Filter Grid ===== */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {selects.map((select, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        {select.valuePlaceholder}
                      </label>
                      <Filter
                        filters={filters}
                        setFilters={setFilters}
                        select={select}
                      />
                    </div>
                  ))}

                  {/* Sort order */}
                </div>

                {/* ===== Active Filters ===== */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active filters</span>
                    <span className="text-xs text-muted-foreground">
                      {filtersKeys.length} {filtersKeys.length === 1 ? "result" : "results"}
                    </span>
                  </div>
                  {filtersKeys.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {filtersEntries.map(([rawKey, rawValue]) => {
                        // Add null checks
                        if (rawKey === undefined || rawKey === null || rawValue === null || rawValue === undefined) return;

                        const key = rawKey.toString();
                        const value = rawValue
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: -4 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Badge
                              variant="secondary"
                              className="p-2.5"
                            >
                              <span className="font-medium">
                                {
                                  key === "time_setting_ms" ? "Time setting" :
                                    (key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()).replace('_', ' ')
                                }:
                              </span>
                              <span className="ml-1 font-normal">
                                {typeof value === 'boolean'
                                  ? (value ? 'No' : 'Yes')
                                  : key === 'time_setting_ms'
                                    ? `${Number(value) / 1000}s` :
                                    key === "sort_order" ? (value.toString()).replace("_", " ").split(" ").map((val: string, i: number) => {
                                      if (i === 0) return val.charAt(0).toUpperCase() + val.slice(1);
                                      return val
                                    }).join(" ")
                                      : key === "status" && value === "in_queue" ? "In queue" : value
                                }
                              </span>

                              <Button
                                onClick={() => filterHelpers.manipulateFilters("remove", { key: key as keyof Filters })}
                                size="icon-xs"
                                variant="ghost"
                                className="bg-destructive/10! hover:text-destructive ml-2 size-4">
                                <XIcon />
                              </Button>
                            </Badge>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-[10px]">None</div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ===== Games Grid or Empty State ===== */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <GamesLoadingState />
          </div>
        ) : gamesFetchResult ? (
          gamesFetchResult.data.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{gamesFetchResult.data.length}</span> {gamesFetchResult.data.length === 1 ? "game" : "games"}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => dispatch(setBooleanTrigger({ key: "gameCreation", value: true }))}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                    Create New Game
                  </Button>
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Suspense fallback={<GamesLoadingState />}>
                  {isGettingGames ? (<GamesLoadingState />) : (
                    gamesFetchResult.data.map((game) => (
                      <GameCard key={game._id} game={game} />
                    ))
                  )}
                </Suspense>
              </div>

              {/* See more button */}
              {gamesFetchResult.totalPages > gamesFetchResult.page && (
                <div className="w-full flex justify-center items-center mt-4">
                  <Button disabled={isFetching || isLoading} onClick={seeMoreData} variant="outline">
                    {isFetching && (<Spinner />)}
                    {isFetching ? "Loading..." : "See more"}
                  </Button>
                </div>
              )}
            </div>
          ) : filtersKeys.length > 0 && gamesFetchResult.data.length <= 0 ?
            (<EmptyGamesWithFilters filtersKeys={filtersKeys as unknown as Omit<keyof Filters, "page" | "limit">} setFilters={setFilters} />) :
            (<EmptyGames dispatch={dispatch} />)
        ) : (<EmptyGames dispatch={dispatch} />)}
      </div>
    </div>
  );
};

export default Games