import Review from "../domain/Review";

interface Repository {
    create: (review: Review, productId: string, userId: string) => Promise<Review>;
    createBulk: (reviews: Array<Review>, productIds: Array<string>, userIds: Array<string>) => Promise<Array<Review>>;
}

export type { Repository };
