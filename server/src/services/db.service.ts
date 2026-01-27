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
                const direction = args.paginationConfig.sortOrder === "oldest_to_newest" ? 1 : -1;
                let sortDefinition: any = {};
            
                if (args.paginationConfig.sortFields && args.paginationConfig.sortFields.length > 0) {
                    args.paginationConfig.sortFields.forEach((field) => {
                        sortDefinition[field] = direction;
                    });
                } else {
                    // Fallback if no fields provided
                    sortDefinition.createdAt = direction;
                }
            
                // Secondary sort for stability
                sortDefinition._id = direction;
            
                // Re-assign to ensure the chain is preserved
                bulkQuery.sort(sortDefinition);
                
                // Skip and Limit must come AFTER sort
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
                query = model.findById(args.id);
            } else if (args.optionConfig.option === "via-query") {
                query = model.findOne(args.query);
            }

            if (!query) return null;

            query.select(args.selectFields || "");

            if (args.populateOptions) {
                query.populate(args.populateOptions);
            }

            return await query.lean<LeanGeneric>().exec()
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

                // Pipeline updates
                query = model.findByIdAndUpdate(
                    args.id,
                    args.updateQuery,
                    { new: true, updatePipeline: Array.isArray(args.updateQuery) },
                ).select(args.selectFields || "");
            } else if (args.optionConfig.option === "via-query") {

                // Handle pipeline updates
                query = model.findOneAndUpdate(
                    args.filterQuery,
                    args.updateQuery,
                    { new: true, updatePipeline: Array.isArray(args.updateQuery) },
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
            if (!args.filterQuery) return null;
            await model.updateOne((args.filterQuery), args.updateQuery, {
                updatePipeline: Array.isArray(args.updateQuery)
            })
        }
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