import mongoose, { Document } from "mongoose";

import Review from "../../domain/Review";

interface ReviewDocument extends Document {
    name: string;
    rating: number;
    comment: string;
    toModel: () => Review;
}

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
});

reviewSchema.methods.toModel = function (): Review {
    const review = this as ReviewDocument;

    return {
        id: review._id.toString(),
        name: review.name,
        rating: review.rating,
        comment: review.comment,
    };
};

const model = mongoose.model<ReviewDocument>("Review", reviewSchema);

export type { ReviewDocument };
export default model;
