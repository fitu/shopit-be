import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
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

export default orderSchema;
