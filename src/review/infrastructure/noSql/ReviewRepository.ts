import Review from "../../domain/Review";
import { Repository } from "../Repository";

class ReviewRepository implements Repository {
    public async save(review: Review, userId: number): Promise<Review> {
        return new Promise(() => {});
    }
    public async saveBulk(
        reviews: Array<Review>,
        productIds: Array<number>,
        userIds: Array<number>
    ): Promise<Array<Review>> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default ReviewRepository;
