import { Game, IGameDocument } from "../models/Game.js";
import { MongoCrud, Query } from "../types/db-service.types.js";
import { DatabaseService } from "./db.service.js";

interface GameCreationType {
    players: {
        userId: string;
        preference: "X" | "O"
    }[];
    gameSettings: { 
        visibility: "public";
        status: "active";
    }
};

// Database service
const databaseService = new DatabaseService();

export class GameService {

    // ===== Creates a game document in the db ===== \\
    async createGame(args: MongoCrud<GameCreationType>["create"]) {
        return await databaseService.createDoc<IGameDocument>(Game, args)
    };

    // ===== Get a game or multiple game documents in the db ===== \\
    async getBulkOrSingleGame<LeanGeneric>(args: MongoCrud["read"]) {
        return await databaseService.getBulkOrSingleDoc<IGameDocument, LeanGeneric>(Game, args)
    }

    // ===== Update a game document in the database ===== \\
    async updateGame<LeanGeneric>(args: MongoCrud["update"]) {
        return await databaseService.updateDoc<IGameDocument, LeanGeneric>(Game, args);
    }

    // ===== Delete's a game document from the database ===== \\
    async deleteGame<LeanGeneric>(args: MongoCrud["delete"]) {
        return await databaseService.deleteDoc<IGameDocument, LeanGeneric>(Game, args)
    }

    // ===== Count documents in game collection ===== \\
    async countGameDocs(query?: Query) {
        return await databaseService.countDoc<IGameDocument>(Game, query);
    }
}