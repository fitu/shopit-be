import { Repository as ReviewRepository } from "../infrastructure/Repository";

import Review from "./Review";

class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor(reviewRepository: ReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        return this.reviewRepository.insert(review, productId, userId);
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        return this.reviewRepository.insertBatch(reviews, productIds, userIds);
    }
}

export default ReviewService;
