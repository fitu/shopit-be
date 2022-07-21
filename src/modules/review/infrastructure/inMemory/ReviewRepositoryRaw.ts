import Review from "@review/domain/Review";
import { Repository } from "@review/infrastructure/Repository";

class ReviewRepositoryRaw implements Repository {
    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        return Promise.resolve(<Review>{});
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        return Promise.resolve([]);
    }
}

export default ReviewRepositoryRaw;
