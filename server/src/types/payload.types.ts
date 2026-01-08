import mongoose from "mongoose";
import { FormattedGame } from "./game.types";

export interface BusinessLogicType {
    success: boolean;
    data?: unknown;
    error?: unknown;
}



export interface PaginationPayload {
    page: number;
    limit: number;
    totalPages: number;
    totalGames: number;
    data: FormattedGame[];
}
