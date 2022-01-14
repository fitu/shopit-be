import mongoose, { Document, Schema, Types } from "mongoose";

import Review from "../../domain/Review";

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
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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

const model = mongoose.model<ReviewFullDocument>("Review", reviewSchema);

export type { ReviewDao };
export default model;
