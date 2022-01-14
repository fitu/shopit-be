import { zip } from "lodash";

import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDocument from "./ReviewDao";

class ReviewRepository implements Repository {
    public async save(review: Review, productId: string, userId: string): Promise<Review> {
        // TODO: complete this
        const reviewToSave = { ...review, productId, userId };
        const newReview = await ReviewDocument.create(reviewToSave);
        return newReview.toModel();
    }

    public async saveBulk(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        const reviewProductsUsers: Array<[Review, string, string]> = zip(reviews, productIds, userIds);
        // TODO: complete this
        const reviewsToSave = reviewProductsUsers.map(([review, productId, userId]) => ({ ...review, productId, userId }));
        const newReviews = await ReviewDocument.insertMany(reviewsToSave);
        return newReviews.map((newReview) => newReview.toModel());
    }
}

export type { Repository };
export default ReviewRepository;
