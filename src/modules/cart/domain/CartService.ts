import { Repository as CartRepository } from "../infrastructure/Repository";

import Cart from "./Cart";

class CartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    public async create(cart: Cart, userId: string): Promise<Cart> {
        return this.cartRepository.create(cart, userId);
    }
}

export default CartService;
