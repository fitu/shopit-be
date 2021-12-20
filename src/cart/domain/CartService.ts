import CartRepository from "../infrastructure/CartRepository";

import Cart from "./Cart";

class CartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    public async create(cart: Cart, userId: number): Promise<Cart> {
        return await this.cartRepository.save(cart, userId);
    }
}

export default CartService;
