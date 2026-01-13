import { SessionData, SignupCredentials } from "@shared/index.js";
import { IUserDocument, User } from "../models/User.js";
import bcrypt from "bcrypt"
import { MongoCrud, Query } from "../types/db-service.types.js";
import { RedisService } from "./redis.service.js";
import { createToken } from "./auth.services.js";
import { DatabaseService } from "./db.service.js";

interface NewSessionArgs {
    sessionData: SessionData;
    returnTokens?: boolean;
    refreshTokenPayload?: {
        userId: string;
        tokenVersion: number;
    }
}


// Redis service
const redisService = new RedisService();

// Database service
const databaseService = new DatabaseService()

export class UserService {

    // ===== Creates a user document in the db ===== \\
    async createUser(args: MongoCrud<SignupCredentials>["create"]) {
        const passwordHash = await bcrypt.hash(args.password, 12)

        return await databaseService.createDoc<IUserDocument>(User, {
            username: args.username,
            email: args.email,
            passwordHash,
        })
    };

    // ===== Gets a user document from the db ===== \\
    async getSingleOrBulkUser<LeanGeneric>(args: MongoCrud["read"]) {
        return await databaseService.getBulkOrSingleDoc<IUserDocument, LeanGeneric>(User, args)
    }

    // ===== Updates a user document in the db ===== \\
    async updateUser<LeanGeneric>(args: MongoCrud["update"]) {
       return await databaseService.updateDoc<IUserDocument, LeanGeneric>(User, args)
    };

    // ===== Deletes a user document from the db ===== \\
    async deleteUser<LeanGeneric>(args: MongoCrud["delete"]) {
        return await databaseService.deleteDoc<IUserDocument, LeanGeneric>(User, args)
    }

    // ===== Count documents in user collection ===== \\
    async countUserDocs(query?: Query) {
        return await databaseService.countDoc<IUserDocument>(User, query)
    }

    // ===== Creates a new session ===== \\
    async newSession({
        sessionData,
        returnTokens = true,
        refreshTokenPayload,
    }: NewSessionArgs) {
        const key = `session-${sessionData.userId}`;
        let refreshToken = "";
        let accessToken = ""

        if (returnTokens) {
            accessToken = createToken(
                "accessToken",
                sessionData
            );

            if (refreshTokenPayload) {
                refreshToken = createToken(
                    "refreshToken",
                    refreshTokenPayload
                );
            }
        }

        // Cache the user
        await redisService.writeOperation<{
            userId: string;
            email: string;
            username: string;
        }>(key, sessionData, 1800);

        if (returnTokens) {
            let tokens: {
                accessToken: string;
                refreshToken?: string
            } = { accessToken }

            if (refreshTokenPayload) {
                tokens = {
                    ...tokens,
                    refreshToken,
                }
            };

            return tokens
        }
    }
}
