enum OrderStatus {
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERD = "delivered",
}

const validOrderStatus: Array<string> = Object.values(OrderStatus);

class Order {
    readonly id?: string;
    readonly itemsPrice: number;
    readonly taxPrice: number;
    readonly shippingPrice: number;
    readonly totalPrice: number;
    readonly orderStatus: OrderStatus;
    readonly deliveredAt?: Date | null;
    readonly paidAt?: Date | null;

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
        id?: string;
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        totalPrice: number;
        orderStatus: OrderStatus;
        deliveredAt?: Date | null;
        paidAt?: Date | null;
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

export { OrderStatus, validOrderStatus };
export default Order;
