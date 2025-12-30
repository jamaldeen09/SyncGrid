import mongoose, { Document, Model, Schema } from 'mongoose';

// Schema type
export interface IComment {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    content: string;
    game_id: mongoose.Types.ObjectId;
    created_at: Date;
}

// Useful types
export type ICommentDocument = Document & IComment;
export type ICommentModel = Model<ICommentDocument>;
export type ICommentQuery = ICommentDocument | null;

// Schema
const CommentSchema = new Schema<ICommentDocument, ICommentModel>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        trim: true,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 150,
    },
    game_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        trim: true,
        required: true,
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: false,
    }
});


// Model
export const Comment = mongoose.model<ICommentDocument, ICommentModel>("Comment", CommentSchema);