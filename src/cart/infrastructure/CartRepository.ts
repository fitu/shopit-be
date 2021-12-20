import Cart from "../domain/Cart";

import CartDao from "./CartDao";

interface Repository {
    save: (cart: Cart, userId: number) => Promise<Cart>;
}

class CartRepository implements Repository {
    public async save(cart: Cart, userId: number): Promise<Cart> {
        const newCart = await CartDao.create({
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            userId: userId,
        });

        return newCart.toModel();
    }
}

export type { Repository };
export default CartRepository;
