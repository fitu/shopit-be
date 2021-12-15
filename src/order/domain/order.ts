type OrderStatus = "processing" | "shipped" | "delivered";

interface OrderAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: OrderStatus;
    deliveredAt: Date | null;
    paidAt: Date | null;
}

class Order implements OrderAttributes {
    constructor(
        public id: number,
        public itemsPrice: number,
        public taxPrice: number,
        public shippingPrice: number,
        public totalPrice: number,
        public orderStatus: OrderStatus,
        public deliveredAt: Date | null,
        public paidAt: Date | null
    ) {}
}

export type { OrderStatus, OrderAttributes };
export default Order;
