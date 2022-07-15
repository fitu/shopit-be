import Review from "@review/domain/Review";
import { Repository } from "@review/infrastructure/Repository";

class ReviewRepositoryRaw implements Repository {
    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        return new Promise(() => {});
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        return new Promise(() => {});
    }
}

export default ReviewRepositoryRaw;
