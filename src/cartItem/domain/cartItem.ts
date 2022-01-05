class CartItem {
    readonly id: number;
    readonly quantity: number;

    constructor({ id, quantity }: { id: number; quantity: number }) {
        this.id = id;
        this.quantity = quantity;
    }
}

export default CartItem;
