import mongoose, { Model, Mongoose } from "mongoose";

class ProductDao {
    private static model: Model<ProductDao>;

    constructor() {}

    public init(instance: Mongoose): void {
        const schema = new mongoose.Schema({
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
            },
            ratings: {
                type: Number,
                required: true,
            },
            imageUrl: {
                type: String,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
            },
        });

        ProductDao.model = instance.model("Product", schema);
    }

    public static getModel(): Model<ProductDao> {
        return ProductDao.model;
    }
}

export default ProductDao;
