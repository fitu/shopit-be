import { zip } from "lodash";

import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDocument, { fromReviewToDao, ReviewDao } from "./ReviewDao";

class ReviewRepository implements Repository {
    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        const reviewToSave: ReviewDao = fromReviewToDao(review, productId, userId);
        const newReview = await ReviewDocument.create(reviewToSave);
        return newReview.toModel();
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        const reviewProductsUsers: Array<[Review, string, string]> = zip(reviews, productIds, userIds);
        const reviewsToSave: Array<ReviewDao> = reviewProductsUsers.map(([review, productId, userId]) =>
            fromReviewToDao(review, productId, userId)
        );
        const newReviews = await ReviewDocument.insertMany(reviewsToSave);
        return newReviews.map((newReview) => newReview.toModel());
    }
}

export default ReviewRepository;
