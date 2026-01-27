"use client"
import { GamesPayload, ProfileType } from "@shared/index";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { formatISODate } from "@/lib/utils";
import { Clock, Hash, Plus } from "lucide-react"; 
import GamesFetchEmptyOrErrState from "./GamesFetchEmptyOrErrState";
import GamesTableHeader from "./GamesTableHeader";
import GameSkeleton from "../reusable/GameSkeleton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// Component props type
interface GamesTableProps {
    gamesFetchResult: GamesPayload;
    profile: ProfileType;
    totalFilters: number;
    getGames: (userId: string) => Promise<void>;
    clearFilters: () => void;
    seeMore: () => void;
    isGettingGames: boolean;
    isLoadingGames: boolean;
}

const GamesTable = ({
    gamesFetchResult,
    profile,
    getGames,
    totalFilters, 
    clearFilters,
    isGettingGames,
    seeMore,
    isLoadingGames,
}: GamesTableProps): React.ReactElement => {

    // Decisive booleans to determine if the requested user's 
    // paginated games has another page
    const hasNextPage = (gamesFetchResult !== null)  && (gamesFetchResult.totalPages > gamesFetchResult.page);

    // AppRouter
    const router = useRouter();

    if (isLoadingGames || (!gamesFetchResult || gamesFetchResult?.games?.length === 0)) {
        return (
            <Table>
                <GamesTableHeader />
                <TableBody>
                    {Array.from({ length: 8 }).map((_, i) => <GameSkeleton key={i} />)}
                </TableBody>
            </Table>
        )
    }

    if (gamesFetchResult?.games?.length <= 0) {
        return ( 
            <GamesFetchEmptyOrErrState
                stateType={totalFilters > 0 ? "empty-with-filters" : "empty"}
                profile={profile}
                executeService={getGames}
                clearFilters={clearFilters}
            />
        )
    }

    return (
        <div className="space-y-4">
            <Table>
                <GamesTableHeader />
                <TableBody>
                    {(gamesFetchResult?.games || [])?.map((game) => {
                        const requestedUser = game.players.find(p => p._id === profile.userId);
                        const opponent = game.players.find(p => p._id !== profile.userId);
                        const isWin = game.requestedUserInGameStatus === "Won";
                        const isLoss = game.requestedUserInGameStatus === "Loss";

                        return (
                            <TableRow onClick={(e) => {
                                e.preventDefault();
                                router.push(`/game/finished/${game._id}`)
                            }} key={game._id} className="group border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-5 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center p-2 bg-zinc-100 group-hover:bg-white transition-colors border border-transparent group-hover:border-zinc-200">
                                            <Clock size={12} className="text-zinc-400" />
                                            <span className="text-[8px] font-black text-zinc-400 mt-1 uppercase">1m</span>
                                        </div>
                                        <div className="text-[11px] tracking-tight uppercase">
                                            <span className="font-black text-zinc-900">{requestedUser?.username || "syncgrid-user"}</span>
                                            <span className="mx-2 text-zinc-300">vs</span>
                                            <span className="font-bold text-zinc-500">{opponent?.username || "syncgrid-user"}</span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <span className={`text-[10px] font-black px-2 py-1 uppercase tracking-tighter
                                        ${isWin ? "text-emerald-600" : isLoss ? "text-red-500" : "text-zinc-400"}`}>
                                        {game.requestedUserInGameStatus}
                                    </span>
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-zinc-400">
                                        <Hash size={10} />
                                        {game.moves} / 9
                                    </div>
                                </TableCell>

                                <TableCell className="text-right pr-6">
                                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                                        {formatISODate(game.finishedAt)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {/* ===== See more section button ====== */}
            {(hasNextPage) && (
                <section className="flex justify-center pt-4 pb-8">
                    <Button 
                        onClick={seeMore}
                        disabled={isGettingGames}
                        variant="outline" 
                        className="rounded-none border-2 border-zinc-900 font-black uppercase text-[10px] tracking-[0.2em] px-10 h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-900 hover:text-white active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isGettingGames ? "Loading..." : "See More"}
                        {!isGettingGames && <Plus size={14} className="ml-2" />}
                    </Button>
                </section>
            )}
        </div>
    ); 
};

export default GamesTable;