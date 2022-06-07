import Cart from "../../domain/Cart";
import { Repository } from "../Repository";

import CartDao from "./CartDao";

class CartRepositoryRaw implements Repository {
    public async create(cart: Cart, userId: string): Promise<Cart> {
        return new Promise(() => {});
    }
}

export default CartRepositoryRaw;
