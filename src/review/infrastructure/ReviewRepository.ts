import Review from "../domain/Review";

interface Repository {
    save: (review: Review) => Promise<Review>;
    saveBulk: (reviews: Array<Review>) => Promise<Array<Review>>;
}

class ReviewRepository implements Repository {
    public async save(review: Review): Promise<Review> {
        return new Promise(() => {});
    }

    public async saveBulk(reviews: Array<Review>): Promise<Array<Review>> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default ReviewRepository;
