class Cart {
    readonly id?: string;
    readonly itemsPrice: number;
    readonly taxPrice: number;
    readonly totalPrice: number;

    constructor({
        id,
        itemsPrice,
        taxPrice,
        totalPrice,
    }: {
        id?: string;
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
