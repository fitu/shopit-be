import User from "../domain/User";

interface Repository {
    create: (user: User) => Promise<User>;
    createBulk: (users: Array<User>) => Promise<Array<User>>;
    update: (user: User) => Promise<User>;
    addProduct: (userId: string, productId: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<User>;
    getUserById: (userId: string) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User>;
}

export type { Repository };
