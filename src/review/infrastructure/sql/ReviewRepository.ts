import ProductDao from "../../../product/infrastructure/sql/ProductDao";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDao from "./ReviewDao";

class ReviewRepository implements Repository {
    public async save(review: Review, userId: number): Promise<Review> {
        const newReview = await ReviewDao.create({
            name: review.name,
            rating: review.rating,
            comment: review.comment,
        });

        const user = await UserDao.findByPk(userId);
        await user.setReviews([newReview]);

        return newReview.toModel();
    }

    public async saveBulk(
        reviews: Array<Review>,
        productIds: Array<number>,
        userIds: Array<number>
    ): Promise<Array<Review>> {
        const reviewsToSave = reviews.map((review) => {
            return {
                name: review.name,
                rating: +review.rating,
                comment: review.comment,
            };
        });

        const newReviews = await ReviewDao.bulkCreate(reviewsToSave);

        const productsWithReviewsPromises = productIds.map(async (productId, index) => {
            const product = await ProductDao.findByPk(productId);
            // TODO: is this required?
            return await product.setReviews([newReviews[index]]);
        });
        await Promise.all(productsWithReviewsPromises);

        const usersWithReviewsPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            // TODO: is this required?
            return await user.setReviews([newReviews[index]]);
        });
        await Promise.all(usersWithReviewsPromises);

        return newReviews.map((newReview) => newReview.toModel());
    }
}

export type { Repository };
export default ReviewRepository;
