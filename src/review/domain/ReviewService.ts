import { Repository as ReviewRepository } from "../infrastructure/Repository";

import Review from "./Review";

class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor(reviewRepository: ReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public async create(review: Review, productId: string, userId: string): Promise<Review> {
        return this.reviewRepository.create(review, productId, userId);
    }

    public async createBulk(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        return this.reviewRepository.createBulk(reviews, productIds, userIds);
    }
}

export default ReviewService;
