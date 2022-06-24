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
    _id: {
        type: String,
        required: true,
    },
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
    const orderDocument = this as OrderFullDocument;
    const order = new Order({
        id: orderDocument.id,
        itemsPrice: orderDocument.itemsPrice,
        taxPrice: orderDocument.taxPrice,
        shippingPrice: orderDocument.shippingPrice,
        totalPrice: orderDocument.totalPrice,
        orderStatus: orderDocument.orderStatus,
        deliveredAt: orderDocument.deliveredAt,
        paidAt: orderDocument.paidAt,
    });

    return order;
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
