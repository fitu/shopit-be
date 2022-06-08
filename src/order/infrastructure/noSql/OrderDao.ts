import mongoose, { Document } from "mongoose";

import Order, { OrderStatus } from "../../domain/Order";

const ORDER_SCHEMA = 'Order';

interface OrderDocument extends Document {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: OrderStatus;
    deliveredAt: Date;
    paidAt: Date;
    toModel: () => Order;
}

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
            values: ['processing', 'shipped', 'delivered'],
            message: 'Please select correct category for product',
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

orderSchema.methods.toModel = function (): Order {
    const review = this as OrderDocument;

    return {
        id: review.id,
        itemsPrice: review.itemsPrice,
        taxPrice: review.taxPrice,
        shippingPrice: review.shippingPrice,
        totalPrice: review.totalPrice,
        orderStatus: review.orderStatus,
        deliveredAt: review.deliveredAt,
        paidAt: review.paidAt,
    };
};


const model = mongoose.model<OrderDocument>(ORDER_SCHEMA, orderSchema);

export type { OrderDocument };
export { ORDER_SCHEMA };
export default model;
