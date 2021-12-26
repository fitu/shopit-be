import ReviewRepository from "../infrastructure/ReviewRepository";

import Review from "./Review";

class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor(reviewRepository: ReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public async create(review: Review, userId: number): Promise<Review> {
        return await this.reviewRepository.save(review, userId);
    }

    public async createBulk(
        reviews: Array<Review>,
        productIds: Array<number>,
        userIds: Array<number>
    ): Promise<Array<Review>> {
        return await this.reviewRepository.saveBulk(reviews, productIds, userIds);
    }
}

export default ReviewService;
