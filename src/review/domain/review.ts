class Review {
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
}

export default Review;
