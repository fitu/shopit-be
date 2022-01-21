import Cart from "../../domain/Cart";
import { Repository } from "../Repository";

import CartDao from "./CartDao";

class CartRepository implements Repository {
    // TODO: is this in use?
    public async create(cart: Cart, userId: string): Promise<Cart> {
        const newCart = await CartDao.create({
            ...(cart.id && { id: cart.id }),
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        return newCart.toModel();
    }
}

export default CartRepository;
