import { zip } from "lodash";
import { Types } from "mongoose";

import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDocument, { ReviewDao } from "./ReviewDao";

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
