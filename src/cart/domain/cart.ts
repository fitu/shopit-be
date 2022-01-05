class Cart {
    readonly id: number;
    readonly itemsPrice: number;
    readonly taxPrice: number;
    readonly totalPrice: number;

    constructor({
        id,
        itemsPrice,
        taxPrice,
        totalPrice,
    }: {
        id: number;
        itemsPrice: number;
        taxPrice: number;
        totalPrice: number;
    }) {
        this.id = id;
        this.itemsPrice = itemsPrice;
        this.taxPrice = taxPrice;
        this.totalPrice = totalPrice;
    }
}

export default Cart;
