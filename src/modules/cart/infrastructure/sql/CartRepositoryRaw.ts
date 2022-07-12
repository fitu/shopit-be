import { Sequelize } from "sequelize";

import Cart from "@cart/domain/Cart";
import { Repository } from "@cart/infrastructure/Repository";

class CartRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async create(cart: Cart, userId: string): Promise<Cart> {
        return new Promise(() => {});
    }
}

export default CartRepositoryRaw;
