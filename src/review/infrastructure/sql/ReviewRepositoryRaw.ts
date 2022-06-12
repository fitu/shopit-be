import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import Review from "../../domain/Review";
import { Repository } from "../Repository";
import { REVIEW_TABLE } from "./ReviewDao";

class ReviewRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        const reviewId = review.id || uuidv4();

        await this.instance.query(
            `
                INSERT INTO ${REVIEW_TABLE} (
                    id,
                    name,
                    rating,
                    comment,
                    "createdAt",
                    "updatedAt",
                    "userId",
                    "productId"
                )
                VALUES (
                    :id,
                    :name,
                    :rating,
                    :comment,
                    :createdAt,
                    :updatedAt,
                    :userId,
                    :productId
                );
            `,
            {
                replacements: {
                    id: reviewId,
                    name: review.name,
                    rating: +review.rating,
                    comment: review.comment,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId,
                    productId,
                },
            }
        );

        return { ...review, id: reviewId };
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        const reviewsWithProductIdsAndUserIdsPromises = reviews
            .map((review, index) => [review, productIds[index], userIds[index]])
            .map(async (reviewWithProductIdAndUserId) => {
                const review = reviewWithProductIdAndUserId[0] as Review;
                const productId = reviewWithProductIdAndUserId[1] as string;
                const userId = reviewWithProductIdAndUserId[2] as string;
                return this.insert(review, productId, userId);
            });

        return await Promise.all(reviewsWithProductIdsAndUserIdsPromises);
    }
}

export default ReviewRepositoryRaw;
