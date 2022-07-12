import Cart from "@cart/domain/Cart";
import { Repository } from "@cart/infrastructure/Repository";
import CartDao from "@cart/infrastructure/sql/CartDao";

class CartRepository implements Repository {
    // TODO: is this in use?
    public async create(cart: Cart, userId: string): Promise<Cart> {
        const newCart = await CartDao.create({
            ...(cart.id && { id: cart.id }),
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        const newCartModel = newCart.toModel();
        return newCartModel;
    }
}

export default CartRepository;
