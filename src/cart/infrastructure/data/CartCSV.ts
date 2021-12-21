import Cart from "../../domain/Cart";

class CartCSV {
    constructor(public id: number, public itemsPrice: number, public taxPrice: number, public totalPrice: number) {}

    static toModel(cartCSV: CartCSV): Cart {
        return {
            id: cartCSV['cart/id'],
            itemsPrice: cartCSV['cart/itemsPrice'],
            taxPrice: cartCSV['cart/taxPrice'],
            totalPrice: cartCSV['cart/totalPrice'],
        };
    }
}

export default CartCSV;
