import Cart from "@cart/domain/Cart";
import { fromCartDaoToModel, fromModelToCartDao } from "@cart/infrastructure/inMemory/cartParsers";

class CartDao {
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

    public toModel(): Cart {
        return fromCartDaoToModel(this);
    }

    public toDao(cart: Cart): CartDao {
        return fromModelToCartDao(cart);
    }
}

export default CartDao;
