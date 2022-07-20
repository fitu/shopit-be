import Review from "@review/domain/Review";
import ReviewDao from "@review/infrastructure/inMemory/ReviewDao";

const fromReviewDaoToModel = (reviewDao: ReviewDao): Review => {
    const review = new Review({
        id: reviewDao.id,
        name: reviewDao.name,
        rating: reviewDao.rating,
        comment: reviewDao.comment,
    });

    return review;
};

const fromModelToReviewDao = (review: Review): ReviewDao => {
    const reviewDao = new ReviewDao({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
    });

    return reviewDao;
};

export { fromReviewDaoToModel, fromModelToReviewDao };
