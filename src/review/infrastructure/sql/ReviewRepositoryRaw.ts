import ProductDao from "../../../product/infrastructure/sql/ProductDao";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDao from "./ReviewDao";

class ReviewRepositoryRaw implements Repository {
    public async create(review: Review, productId: string, userId: string): Promise<Review> {
        return new Promise(() => {});
    }

    public async createBulk(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        return new Promise(() => {});
    }
}

export default ReviewRepositoryRaw;
