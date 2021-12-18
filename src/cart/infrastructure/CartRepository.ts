import Cart from "../domain/Cart";

import CartDao from "./CartDao";

interface Repository {
    save: (cart: Cart) => Promise<Cart>;
}

class CartRepository implements Repository {
    public async save(cart: Cart): Promise<Cart> {
        return new Promise(() => {});
        // const newCart = await CartDao.create({
        //     itemsPrice: cart.itemsPrice,
        //     taxPrice: cart.taxPrice,
        //     totalPrice: cart.totalPrice,
        // });

        // return newCart;
    }
}

export type { Repository };
export default CartRepository;
