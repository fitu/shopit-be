import { Repository as ReviewRepository } from "@review/infrastructure/Repository";
import Review from "@review/domain/Review";

class ReviewService {
    constructor(private readonly reviewRepository: ReviewRepository) {}

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
