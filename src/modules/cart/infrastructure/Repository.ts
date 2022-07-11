import Cart from "../domain/Cart";

interface Repository {
    create: (cart: Cart, userId: string) => Promise<Cart>;
}

export type { Repository };
