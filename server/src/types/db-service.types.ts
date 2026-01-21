import mongoose, { Document, PopulateOptions, QueryWithHelpers, UpdateQuery } from "mongoose";

export type SelectFields = string | readonly string[] | Record<string, string | number | boolean | object>;
export type Query = Record<string, any> | { [key: string]: any };
export type Option = "via-id" | "via-query"


export interface OptionConfig  {
    option?: Option;
    optionType: "exists" | "find";
};

export interface MongoDbExtraType {
    selectFields?: SelectFields;
    populateOptions?: PopulateOptions | (string | PopulateOptions)[]
}


export type ExistsQueryLean = { _id: mongoose.Types.ObjectId } | null

export interface MongoCrud <TCreate = unknown, TDoc = unknown>{
    create: TCreate;

    read: {
        result: "single" | "bulk";
        paginationConfig?: {
            limit: number;
            offset: number;
            sortOrder?: "newest_to_oldest" | "oldest_to_newest"
        };
        optionConfig?: OptionConfig
        query?: Query;
        id?: string;
    } & MongoDbExtraType;

    update: {
        updateQuery: UpdateQuery<TDoc>;
        filterQuery?: Query;
        returnUpdatedDoc: boolean;

        optionConfig?: OptionConfig;
        id?: string;
    } & MongoDbExtraType;

    delete: {
        returnDeletedDoc: boolean;
        optionConfig?: OptionConfig
        query?: Query;
        id?: string;
    } & MongoDbExtraType
}


export type DbQuery<TDoc> = QueryWithHelpers<any, TDoc> | null;