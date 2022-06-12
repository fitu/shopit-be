import { zip } from "lodash";
import mongoose, { Types } from "mongoose";

import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDocument, { ReviewDao } from "./ReviewDao";

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
