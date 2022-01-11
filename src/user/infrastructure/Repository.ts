import User from "../domain/User";

interface Repository {
    save: (user: User) => Promise<User>;
    saveBulk: (users: Array<User>) => Promise<Array<User>>;
    addProduct: (userId: string, productId: string) => Promise<void>;
    getUserById: (userId: string) => Promise<User>;
}

export type { Repository };
