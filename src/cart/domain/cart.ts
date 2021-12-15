interface CartAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
}

class Cart implements CartAttributes {
    constructor(public id: number, public itemsPrice: number, public taxPrice: number, public totalPrice: number) {}
}

export type { CartAttributes };
export default Cart;
