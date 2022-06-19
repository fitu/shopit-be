import { omit } from "lodash";
import mongoose, { Document } from "mongoose";

import Order, { OrderStatus } from "../../domain/Order";

const ORDER_SCHEMA = "Order";

interface OrderDao {
    _id?: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: OrderStatus;
    deliveredAt?: Date;
    paidAt?: Date;
}
interface OrderDocument extends Document {
    toModel: () => Order;
}

type OrderFullDocument = OrderDao & OrderDocument;

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

orderSchema.methods.toModel = function (): Order {
    const review = this as OrderFullDocument;

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

const fromOrderToDao = (order: Order): OrderDao => {
    const _id = order.id;
    const orderWithoutId = omit(order, "id");

    return {
        _id,
        ...orderWithoutId,
    };
};

const model = mongoose.model<OrderDocument>(ORDER_SCHEMA, orderSchema);

export type { OrderDocument };
export { ORDER_SCHEMA, fromOrderToDao };
export default model;
