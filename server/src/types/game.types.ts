import { IGame } from './../models/Game';
import mongoose from "mongoose";

export type BulkGamesLean = {
    _id: mongoose.Types.ObjectId;

    players: {
        preference: "X" | "O";
        userId: {
            _id: mongoose.Types.ObjectId;
            username: string;
        };
    }[];

    result: "decisive" | "draw";
    winner: mongoose.Types.ObjectId;
    finishedAt: Date;
    moves: IGame["moves"]
}[];



export type ActiveOrFinishedGameLean = {
    _id: mongoose.Types.ObjectId;
    players: {
        preference: "X" | "O"
        userId: {
            _id: mongoose.Types.ObjectId;
            username: string;
            profileUrl: string;
            currentWinStreak: number
        }
    }[];
    gameSettings: IGame["gameSettings"];
    moves: IGame["moves"]
} | null


export type LiveGameForBannerLean = ({
    _id: mongoose.Types.ObjectId;
    players: IGame["players"];
    moves: IGame["moves"];
}) | null;


export type GameBeingTerminated = {
    _id: mongoose.Types.ObjectId;
    players: IGame["players"];
    winner: mongoose.Types.ObjectId | null;
} | null