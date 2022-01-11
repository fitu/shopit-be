import Review from "../domain/Review";

interface Repository {
    save: (review: Review, productId: string, userId: string) => Promise<Review>;
    saveBulk: (reviews: Array<Review>, productIds: Array<string>, userIds: Array<string>) => Promise<Array<Review>>;
}

export type { Repository };
