type OrderStatus = "processing" | "shipped" | "delivered";

class Order {
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

export type { OrderStatus };
export default Order;
