import Cart from "@cart/domain/Cart";

interface Repository {
    create: (cart: Cart, userId: string) => Promise<Cart>;
}

export type { Repository };
