class OrderItem {
    readonly id: string;
    readonly quantity: number;

    constructor({ id, quantity }: { id: string; quantity: number }) {
        this.id = id;
        this.quantity = quantity;
    }
}

export default OrderItem;
