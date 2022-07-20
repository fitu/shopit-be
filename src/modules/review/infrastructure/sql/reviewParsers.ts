import Review from "@review/domain/Review";
import ReviewDao from "@review/infrastructure/sql/ReviewDao";

const fromReviewDaoToModel = (reviewDao: ReviewDao): Review => {
    const review = new Review({
        id: reviewDao.id,
        name: reviewDao.name,
        rating: reviewDao.rating,
        comment: reviewDao.comment,
    });

    return review;
};

export { fromReviewDaoToModel };
