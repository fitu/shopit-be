import Cart from "@cart/domain/Cart";

class CartCSV {
    constructor(public id: string, public itemsPrice: number, public taxPrice: number, public totalPrice: number) {}

    static toModel(cartCSV: CartCSV): Cart {
        return new Cart({
            id: cartCSV.id,
            itemsPrice: cartCSV.itemsPrice,
            taxPrice: cartCSV.taxPrice,
            totalPrice: cartCSV.totalPrice,
        });
    }
}

export default CartCSV;
