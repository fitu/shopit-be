import Review from "@review/domain/Review";

class ReviewCSV {
    constructor(
        public id: string,
        public name: string,
        public rating: number,
        public comment: string,
        public userId: string,
        public productId: string
    ) {}

    static toModel(reviewCSV: ReviewCSV): Review {
        return new Review({
            id: reviewCSV.id,
            name: reviewCSV.name,
            rating: reviewCSV.rating,
            comment: reviewCSV.comment,
        });
    }
}

export default ReviewCSV;
