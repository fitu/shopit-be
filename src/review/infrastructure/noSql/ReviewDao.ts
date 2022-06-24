import { omit } from "lodash";
import mongoose, { Document } from "mongoose";

import { PRODUCT_SCHEMA } from "../../../product/infrastructure/noSql/ProductDao";
import { USER_SCHEMA } from "../../../user/infrastructure/noSql/UserDao";
import Review from "../../domain/Review";

const REVIEW_SCHEMA = "Review";

interface ReviewDao {
    _id: string;
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
    _id: {
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

reviewSchema.methods.toModel = function (): Review {
    const reviewDocument = this as ReviewFullDocument;
    const review = new Review({
        id: reviewDocument.id.toString(),
        name: reviewDocument.name,
        rating: reviewDocument.rating,
        comment: reviewDocument.comment,
    });

    return review;
};

const fromReviewToDao = (review: Review, productId: string, userId: string): ReviewDao => {
    const _id = review.id;
    const reviewWithoutId = omit(review, "id");

    return {
        _id,
        productId: productId,
        userId: userId,
        ...reviewWithoutId,
    };
};

const model = mongoose.model<ReviewFullDocument>(REVIEW_SCHEMA, reviewSchema);

export type { ReviewDao };
export { REVIEW_SCHEMA, fromReviewToDao };
export default model;
