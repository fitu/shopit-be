import { Sequelize } from "sequelize";

import Cart from "@cart/domain/Cart";
import { Repository } from "@cart/infrastructure/Repository";

class CartRepositoryRaw implements Repository {
    readonly instance: Sequelize;

    constructor(db: Sequelize ) {
        this.instance = db;
    }

    public async create(cart: Cart, userId: string): Promise<Cart> {
        return Promise.resolve(<Cart>{});
    }
}

export default CartRepositoryRaw;
