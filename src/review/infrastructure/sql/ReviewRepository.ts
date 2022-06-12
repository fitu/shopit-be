import ProductDao from "../../../product/infrastructure/sql/ProductDao";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Review from "../../domain/Review";
import { Repository } from "../Repository";

import ReviewDao from "./ReviewDao";

class ReviewRepository implements Repository {
    public async insert(review: Review, productId: string, userId: string): Promise<Review> {
        const newReview = await ReviewDao.create({
            ...(review.id && { id: review.id }),
            name: review.name,
            rating: review.rating,
            comment: review.comment,
        });

        const product = await ProductDao.findByPk(productId);
        await product.setReviews([newReview]);

        const user = await UserDao.findByPk(userId);
        await user.setReviews([newReview]);

        return newReview.toModel();
    }

    public async insertBatch(
        reviews: Array<Review>,
        productIds: Array<string>,
        userIds: Array<string>
    ): Promise<Array<Review>> {
        const reviewsToSave = reviews.map((review) => {
            return {
                ...(review.id && { id: review.id }),
                name: review.name,
                rating: +review.rating,
                comment: review.comment,
            };
        });

        const newReviews = await ReviewDao.bulkCreate(reviewsToSave);

        const productsWithReviewsPromises = productIds.map(async (productId, index) => {
            const product = await ProductDao.findByPk(productId);
            await product.setReviews([newReviews[index]]);
        });
        await Promise.all(productsWithReviewsPromises);

        const usersWithReviewsPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            await user.setReviews([newReviews[index]]);
        });
        await Promise.all(usersWithReviewsPromises);

        return newReviews.map((newReview) => newReview.toModel());
    }
}

export default ReviewRepository;
