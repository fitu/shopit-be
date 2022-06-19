import { convertUUIDToId } from "../../../shared/db/noSql/csvUtils";
import Cart from "../../domain/Cart";

class CartCSV {
    constructor(public id: string, public itemsPrice: number, public taxPrice: number, public totalPrice: number) {}

    static toModel(cartCSV: CartCSV): Cart {
        return new Cart({
            id: convertUUIDToId(cartCSV.id),
            itemsPrice: cartCSV.itemsPrice,
            taxPrice: cartCSV.taxPrice,
            totalPrice: cartCSV.totalPrice,
        });
    }
}

export default CartCSV;
