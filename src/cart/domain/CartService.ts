import CartRepository from "../infrastructure/CartRepository";

import Cart from "./Cart";

class CartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    public async create(cart: Cart): Promise<Cart> {
        return await this.cartRepository.save(cart);
    }
}

export default CartService;
