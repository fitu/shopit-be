import mongoose from "mongoose";

import Review from "../../domain/Review";
import { Repository } from "../Repository";

import { ReviewDao, REVIEW_DOCUMENT } from "./ReviewDao";
import { fromReviewToDao } from "./reviewParsers";

class ReviewRepositoryRaw implements Repository {
    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        const reviewToSave: ReviewDao = fromReviewToDao(review, productId, userId);

        await mongoose.connection.db.collection(REVIEW_DOCUMENT).insertOne(reviewToSave);

        return review;
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        const reviewsToSave: Array<ReviewDao> = reviews.map((review, index) => {
            const productId = productIds[index];
            const userId = userIds[index];
            const reviewDao: ReviewDao = fromReviewToDao(review, productId, userId);

            return reviewDao;
        });

        await mongoose.connection.db.collection(REVIEW_DOCUMENT).insertMany(reviewsToSave);

        return reviews;
    }
}

export default ReviewRepositoryRaw;
