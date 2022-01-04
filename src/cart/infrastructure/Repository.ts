import Cart from "../domain/Cart";

interface Repository {
    save: (cart: Cart, userId: number) => Promise<Cart>;
}

export type { Repository };
