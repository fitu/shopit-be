import Review from "@review/domain/Review";

interface Repository {
    insert: (review: Review, productId: string, userId: string) => Promise<Review>;
    insertBatch: (reviews: Array<Review>, productIds: Array<string>, userIds: Array<string>) => Promise<Array<Review>>;
}

export type { Repository };
