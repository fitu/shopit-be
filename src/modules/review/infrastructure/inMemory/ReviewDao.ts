import Review from "@review/domain/Review";
import { fromModelToReviewDao, fromReviewDaoToModel } from "@review/infrastructure/inMemory/reviewParsers";

class ReviewDao {
    readonly id?: string;
    readonly name: string;
    readonly rating: number;
    readonly comment: string;

    constructor({ id, name, rating, comment }: { id?: string; name: string; rating: number; comment: string }) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.comment = comment;
    }

    public toModel(): Review {
        return fromReviewDaoToModel(this);
    }

    public toDao(review: Review): ReviewDao {
        return fromModelToReviewDao(review);
    }
}

export default ReviewDao;
