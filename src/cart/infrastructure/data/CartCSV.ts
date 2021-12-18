import Cart from "../../domain/Cart";

class CartCSV {
    constructor(
        public id: number,
        public itemsPrice: number,
        public taxPrice: number,
        public totalPrice: number,
        public userId: number
    ) {}

    static toModel(cartCSV: CartCSV): Cart {
        return {
            id: cartCSV.id,
            itemsPrice: cartCSV.itemsPrice,
            taxPrice: cartCSV.taxPrice,
            totalPrice: cartCSV.totalPrice,
        };
    }
}

export default CartCSV;
