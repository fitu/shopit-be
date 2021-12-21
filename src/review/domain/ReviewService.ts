import ReviewRepository from "../infrastructure/ReviewRepository";

import Review from "./Review";

class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor(reviewRepository: ReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public async create(review: Review): Promise<Review> {
        return await this.reviewRepository.save(review);
    }

    public async createBulk(reviews: Array<Review>): Promise<Array<Review>> {
        return await this.reviewRepository.saveBulk(reviews);
    }
}

export default ReviewService;
