import Cart from "../domain/Cart";

interface Repository {
    save: (cart: Cart, userId: string) => Promise<Cart>;
}

export type { Repository };
