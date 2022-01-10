import Review from "../domain/Review";

interface Repository {
    save: (review: Review, productId: number, userId: number) => Promise<Review>;
    saveBulk: (reviews: Array<Review>, productIds: Array<number>, userIds: Array<number>) => Promise<Array<Review>>;
}

export type { Repository };
