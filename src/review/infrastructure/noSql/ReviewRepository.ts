import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDao from "./ReviewDao";

class ReviewRepository implements Repository {
    // FIXME: fitu
    public async save(review: Review, productId: string, userId: string): Promise<Review> {
        const reviewToSave = { ...review, productId, userId };
        const newReview = await ReviewDao.create(reviewToSave);
        return newReview.toModel();
    }

    // FIXME: fitu
    public async saveBulk(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        const reviewsToSave = reviews.map((review) => ({ ...review, userIds }));
        const newReviews = await ReviewDao.insertMany(reviewsToSave);
        return newReviews.map((newReview) => newReview.toModel());
    }
}

export type { Repository };
export default ReviewRepository;
