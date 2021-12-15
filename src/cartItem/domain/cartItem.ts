interface CartItemAttributes {
    id: number;
    quantity: number;
}

class CartItem implements CartItemAttributes {
    constructor(public id: number, public quantity: number) {}
}

export type { CartItemAttributes };
export default CartItem;
