"use client"
import { GamesPayload, ProfileType } from "@shared/index";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { formatISODate } from "@/lib/utils";
import { Clock, Hash } from "lucide-react"; // Swapped to Lucide
import GamesFetchEmptyOrErrState from "./GamesFetchEmptyOrErrState";
import GamesTableHeader from "./GamesTableHeader";
import GameSkeleton from "../reusable/GameSkeleton";

interface GamesTableProps {
    gamesFetchResult: GamesPayload;
    profile: ProfileType;
    totalFilters: number;
    getGames: (userId: string) => Promise<void>;
    clearFilters: () => void;
    isGettingGames: boolean;
}

const GamesTable = ({
    gamesFetchResult,
    profile,
    getGames,
    totalFilters, 
    clearFilters,
    isGettingGames
}: GamesTableProps): React.ReactElement => {

    if (isGettingGames || !gamesFetchResult) {
        return (
            <Table>
                <GamesTableHeader />
                <TableBody>
                    {Array.from({ length: 8 }).map((_, i) => <GameSkeleton key={i} />)}
                </TableBody>
            </Table>
        )
    }

    if (gamesFetchResult.games.length <= 0) {
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
        <Table>
            <GamesTableHeader />
            <TableBody>
                {gamesFetchResult.games.map((game) => {
                    const requestedUser = game.players.find(p => p._id === profile.userId);
                    const opponent = game.players.find(p => p._id !== profile.userId);
                    const isWin = game.requestedUserInGameStatus === "Won";
                    const isLoss = game.requestedUserInGameStatus === "Loss";

                    return (
                        <TableRow key={game._id} className="group border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                            <TableCell className="py-5 pl-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center p-2 bg-zinc-100 group-hover:bg-white transition-colors border border-transparent group-hover:border-zinc-200">
                                        <Clock size={12} className="text-zinc-400" />
                                        <span className="text-[8px] font-black text-zinc-400 mt-1 uppercase">3m</span>
                                    </div>
                                    <div className="text-[11px] tracking-tight uppercase">
                                        <span className="font-black text-zinc-900">{requestedUser?.username}</span>
                                        <span className="mx-2 text-zinc-300">vs</span>
                                        <span className="font-bold text-zinc-500">{opponent?.username}</span>
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
                                    {game.moves.toString().padStart(2, '0')} / 09
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
    );
};

export default GamesTable;