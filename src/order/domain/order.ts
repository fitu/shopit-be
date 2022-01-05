type OrderStatus = "processing" | "shipped" | "delivered";

class Order {
    readonly id: number;
    readonly itemsPrice: number;
    readonly taxPrice: number;
    readonly shippingPrice: number;
    readonly totalPrice: number;
    readonly orderStatus: OrderStatus;
    readonly deliveredAt: Date | null;
    readonly paidAt: Date | null;

    constructor({
        id,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus,
        deliveredAt,
        paidAt,
    }: {
        id: number;
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        totalPrice: number;
        orderStatus: OrderStatus;
        deliveredAt: Date | null;
        paidAt: Date | null;
    }) {
        this.id = id;
        this.itemsPrice = itemsPrice;
        this.taxPrice = taxPrice;
        this.shippingPrice = shippingPrice;
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
        this.deliveredAt = deliveredAt;
        this.paidAt = paidAt;
    }
}

export type { OrderStatus };
export default Order;
