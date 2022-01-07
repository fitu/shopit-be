import mongoose, { Model, Mongoose } from "mongoose";

class ReviewDao {
    private static model: Model<ReviewDao>;

    constructor() {}

    public init(instance: Mongoose): void {
        const schema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        });

        ReviewDao.model = instance.model("Review", schema);
    }

    public static getModel(): Model<ReviewDao> {
        return ReviewDao.model;
    }
}

export default ReviewDao;
