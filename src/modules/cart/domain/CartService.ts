import { Repository as CartRepository } from "@cart/infrastructure/Repository";
import Cart from "@cart/domain/Cart";

class CartService {
    constructor(private readonly cartRepository: CartRepository) {}

    public async create(cart: Cart, userId: string): Promise<Cart> {
        return this.cartRepository.create(cart, userId);
    }
}

export default CartService;
