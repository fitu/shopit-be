import { Repository as ReviewRepository } from "../infrastructure/Repository";

import Review from "./Review";

class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor(reviewRepository: ReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public async create(review: Review, productId: number, userId: number): Promise<Review> {
        return this.reviewRepository.save(review, productId, userId);
    }

    public async createBulk(
        reviews: Array<Review>,
        productIds: Array<number>,
        userIds: Array<number>
    ): Promise<Array<Review>> {
        return this.reviewRepository.saveBulk(reviews, productIds, userIds);
    }
}

export default ReviewService;
