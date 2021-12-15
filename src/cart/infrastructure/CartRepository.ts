import CartModel from "../domain/Cart";
import Cart from "./cart";

interface Repository {
    createCart: () => Promise<CartModel>;
}

class CartRepository implements Repository {
    public createCart = async (): Promise<CartModel> => {
        const newCart = await Cart.create({
            itemsPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
        });

        return newCart;
    };
}

export type { Repository };
export default CartRepository;
