import User from "../domain/User";

interface Repository {
    create: (user: User) => Promise<User>;
    createBulk: (users: Array<User>) => Promise<Array<User>>;
    update: (user: User) => Promise<User>;
    addProduct: (userId: string, productId: string) => Promise<void>;
    getUserById: (userId: string) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User>;
}

export type { Repository };
