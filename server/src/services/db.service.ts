import mongoose, { Model, Document, AnyKeys, AnyObject } from "mongoose";
import { DbQuery, MongoCrud, Query } from "../types/db-service.types.js";


export class DatabaseService {
    // ===== Get bulk or single document ===== \\
    async getBulkOrSingleDoc<TDoc, LeanGeneric>(
        model: Model<TDoc>,
        args: MongoCrud["read"]
    ): Promise<LeanGeneric | LeanGeneric[] | { _id: mongoose.Types.ObjectId } | null> {
        let query: DbQuery<TDoc> = null;

        if (args.result === "bulk") {
            const bulkQuery = model.find(args.query).select(args.selectFields || "");

            if (args.paginationConfig) {
                bulkQuery.skip(args.paginationConfig.offset).limit(args.paginationConfig.limit);
            }
 
            if (args.populateOptions) {
                bulkQuery.populate(args.populateOptions);
            }

            return await bulkQuery.lean<LeanGeneric>().exec();
        }

        // ===== Single Document Logic ===== 
        if (!args.optionConfig) return null;

        if (args.optionConfig.optionType === "find") {
            if (args.optionConfig.option === "via-id") {
                query = model.findById(args.query);
            } else if (args.optionConfig.option === "via-query") {
                query = model.findOne(args.query);
            }

            if (!query) return null;

            query.select(args.selectFields || "");

            if (args.populateOptions) {
                query.populate(args.populateOptions);
            }

            return await query.lean<LeanGeneric>().exec();
        } else {
            const existsResult = await model.exists(args.query || {}).exec();
            return existsResult;
        }
    };

    // ===== Creates a document ===== \\
    async createDoc<TDoc extends Document>(model: Model<TDoc>, args: (AnyKeys<TDoc> & AnyObject)) {
        const [doc] = await model.create([args]);
        return doc;
    }


    // ===== Updates a document ===== \\
    async updateDoc<TDoc extends Document, LeanGeneric>(
        model: Model<TDoc>,
        args: MongoCrud<unknown, TDoc>["update"]
    ) {
        let query: DbQuery<TDoc> = null;

        if (args.returnUpdatedDoc) {
            if (!args.optionConfig) return null;

            if (args.optionConfig.option === "via-id" && args.id) {

                query = model.findByIdAndUpdate(
                    args.id, 
                    args.updateQuery,
                    { new: true },
                ).select(args.selectFields || "");

            } else if (args.optionConfig.option === "via-query") {

                query = model.findOneAndUpdate(
                    args.filterQuery,
                    args.updateQuery
                ).select(args.selectFields || "");

            } else {
                return null
            }

            // Populate options
            if (args.populateOptions) {
                query = query.populate(args.populateOptions)
            }

            return await query.lean<LeanGeneric>().exec()
        } else {
            await model.updateOne(args.filterQuery, args.updateQuery)
        }

        return null
    };

    // ===== Delete's a document ===== \\
    async deleteDoc<TDoc extends Document, LeanGeneric>(
        model: Model<TDoc>, 
        args: MongoCrud["delete"]
    ) {
        let query: DbQuery<TDoc> = null;

        if (args.returnDeletedDoc) {
            if (!args.optionConfig) return null;

            if (args.optionConfig.option === "via-id" && args.id) {
                query = model.findByIdAndDelete(
                    args.id
                ).select(args.selectFields || "");
            } else if (args.optionConfig.option === "via-query") {
                query = model.findOneAndDelete(
                    args.query
                ).select(args.selectFields || "");
            } else { return null }

            // Populate options
            if (args.populateOptions) {
                query = query.populate(args.populateOptions)
            }

            return await query.lean<LeanGeneric>().exec();
        } else {
            await model.deleteOne(args.query);
        }
    }

    // Counts the total number of documents in a collection
    async countDoc<TDoc extends Document>(model: Model<TDoc>, query?: Query): Promise<number> {
        return await model.countDocuments(query)
    }
}