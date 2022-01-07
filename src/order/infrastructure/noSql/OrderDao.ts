import mongoose, { Model, Mongoose } from "mongoose";

class OrderDao {
    private static model: Model<OrderDao>;

    constructor() {}

    public init(instance: Mongoose): void {
        const schema = new mongoose.Schema({
            itemsPrice: {
                type: Number,
                required: true,
            },
            taxPrice: {
                type: Number,
                required: true,
            },
            shippingPrice: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
            orderStatus: {
                type: String,
                required: true,
                enum: {
                    // TODO: remove hardcoded
                    values: ["processing", "shipped", "delivered"],
                    message: "Please select correct category for product",
                },
            },
            deliveredAt: {
                type: Date,
                default: Date.now,
            },
            paidAt: {
                type: Date,
            },
        });

        OrderDao.model = instance.model("Order", schema);
    }

    public static getModel(): Model<OrderDao> {
        return OrderDao.model;
    }
}

export default OrderDao;
