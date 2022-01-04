import User from "../domain/User";

interface Repository {
    save: (user: User) => Promise<User>;
    saveBulk: (users: Array<User>) => Promise<Array<User>>;
    addProduct: (userId: number, productId: number) => Promise<void>;
    getUserById: (userId: number) => Promise<User>;
}

export type { Repository };
