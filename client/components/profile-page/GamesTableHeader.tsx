"use client"
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GamesTableHeader = (): React.ReactElement => {
    return (
        <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent border-b-2 border-zinc-900">
                {/* Players Section */}
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 py-4 pl-6">
                    Players
                </TableHead>
                
                {/* Status/Result */}
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-center">
                    Result
                </TableHead>
                
                {/* Data/Moves */}
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-center">
                    Moves
                </TableHead>
                
                {/* Timestamp */}
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-right pr-6">
                    Timestamp
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};

export default GamesTableHeader;