import mongoose, { Document, Schema, Types } from "mongoose";

import { PRODUCT_SCHEMA } from "../../../product/infrastructure/noSql/ProductDao";
import { USER_SCHEMA } from "../../../user/infrastructure/noSql/UserDao";
import Review from "../../domain/Review";

const REVIEW_SCHEMA = 'Review';

interface ReviewDao {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    productId: Types.ObjectId;
    userId: Types.ObjectId;
}

interface ReviewDocument extends Document {
    toModel: () => Review;
}

type ReviewFullDocument = ReviewDao & ReviewDocument;

const reviewSchema = new mongoose.Schema({
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
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: PRODUCT_SCHEMA,
        required: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: USER_SCHEMA,
        required: true,
    },
});

reviewSchema.methods.toModel = function (): Review {
    const review = this as ReviewFullDocument;

    return {
        id: review._id.toString(),
        name: review.name,
        rating: review.rating,
        comment: review.comment,
    };
};

const model = mongoose.model<ReviewFullDocument>(REVIEW_SCHEMA, reviewSchema);

export type { ReviewDao };
export { REVIEW_SCHEMA };
export default model;
