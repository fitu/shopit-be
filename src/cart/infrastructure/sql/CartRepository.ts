import Cart from "../../domain/Cart";
import { Repository } from "../Repository";

import CartDao from "./CartDao";

class CartRepository implements Repository {
    public async save(cart: Cart, userId: number): Promise<Cart> {
        const newCart = await CartDao.create({
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        return newCart.toModel();
    }
}

export type { Repository };
export default CartRepository;
