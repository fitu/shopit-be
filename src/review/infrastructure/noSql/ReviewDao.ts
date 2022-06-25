import { omit } from "lodash";
import mongoose, { Document, Types } from "mongoose";

import { PRODUCT_SCHEMA } from "../../../product/infrastructure/noSql/ProductDao";
import { USER_SCHEMA } from "../../../user/infrastructure/noSql/UserDao";
import Review from "../../domain/Review";

import { fromReviewDocumentToModel } from "./reviewParsers";

const REVIEW_SCHEMA = "Review";
const REVIEW_DOCUMENT = "reviews";

interface ReviewDao {
    _id?: Types.ObjectId;
    remoteId?: string;
    name: string;
    rating: number;
    comment: string;
    productId: string;
    userId: string;
}

interface ReviewDocument extends Document {
    toModel: () => Review;
}

type ReviewFullDocument = ReviewDao & ReviewDocument;

const reviewSchema = new mongoose.Schema({
    remoteId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        ref: PRODUCT_SCHEMA,
        required: true,
    },
    userId: {
        type: String,
        ref: USER_SCHEMA,
        required: true,
    },
});

// TODO: move to parser
reviewSchema.methods.toModel = function (): Review {
    return fromReviewDocumentToModel(this);
};

const model = mongoose.model<ReviewFullDocument>(REVIEW_SCHEMA, reviewSchema);

export type { ReviewDao, ReviewFullDocument };
export { REVIEW_SCHEMA, REVIEW_DOCUMENT };
export default model;
