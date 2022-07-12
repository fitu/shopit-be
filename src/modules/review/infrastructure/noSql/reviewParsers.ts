import { omit } from "lodash";

import Review from "@review/domain/Review";
import { ReviewFullDocument, ReviewDao } from "@review/infrastructure/noSql/ReviewDao";

const fromReviewDocumentToModel = (reviewDocument: ReviewFullDocument): Review => {
    const review = new Review({
        id: reviewDocument.remoteId,
        name: reviewDocument.name,
        rating: reviewDocument.rating,
        comment: reviewDocument.comment,
    });

    return review;
};

const fromReviewToDao = (review: Review, productId: string, userId: string): ReviewDao => {
    const remoteId = review.id;
    const reviewWithoutId = omit(review, "id");

    const reviewDao: ReviewDao = {
        ...reviewWithoutId,
        productId,
        userId,
        remoteId,
    };

    return reviewDao;
};

export { fromReviewDocumentToModel, fromReviewToDao };
