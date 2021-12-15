interface OrderItemAttributes {
    id: number;
    quantity: number;
}

class OrderItem implements OrderItemAttributes {
    constructor(public id: number, public quantity: number) {}
}

export type { OrderItemAttributes };
export default OrderItem;
