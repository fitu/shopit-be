import Cart from "../../domain/Cart";
import { Repository } from "../Repository";

class CartRepository implements Repository {
    public async save(cart: Cart, userId: number): Promise<Cart> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default CartRepository;
