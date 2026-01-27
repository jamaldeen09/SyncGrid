import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

const GameSkeleton = (): React.ReactElement => {
    return (
        <TableRow className="border-b border-white/5">
            {/* Time + players */}
            <TableCell className="py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-1.5">
                        <Skeleton className="h-4.5 w-4.5 rounded-full" />
                        <Skeleton className="h-2.5 w-10" />
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-6" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </TableCell>

            {/* Result */}
            <TableCell className="text-center">
                <Skeleton className="mx-auto h-5 w-12 rounded-full" />
            </TableCell>

            {/* Moves */}
            <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-10" />
            </TableCell>

            {/* Date */}
            <TableCell className="text-right">
                <Skeleton className="ml-auto h-3 w-20" />
            </TableCell>
        </TableRow>
    );
};

export default GameSkeleton;