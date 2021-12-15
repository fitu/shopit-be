interface ReviewAttributes {
    id: number;
    name: string;
    rating: number;
    comment: string;
}

class Review implements ReviewAttributes {
    constructor(public name: string, public id: number, public rating: number, public comment: string) {}
}

export type { ReviewAttributes };
export default Review;
