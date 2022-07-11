import { Sequelize } from "sequelize";

import Cart from "../../domain/Cart";
import { Repository } from "../Repository";

import CartDao from "./CartDao";

class CartRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async create(cart: Cart, userId: string): Promise<Cart> {
        return new Promise(() => {});
    }
}

export default CartRepositoryRaw;
