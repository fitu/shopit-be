import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao from "./UserDao";

class UserRepository implements Repository {
    public async save(user: User): Promise<User> {
        return new Promise(() => {});
    }

    public async saveBulk(users: Array<User>): Promise<Array<User>> {
        await UserDao.getModel().create(users[0]);
        return new Promise(() => {});
    }

    public async addProduct(userId: number, productId: number): Promise<void> {
        return new Promise(() => {});
    }

    public async getUserById(userId: number): Promise<User> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default UserRepository;
