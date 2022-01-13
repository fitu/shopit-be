import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao from "./UserDao";

class UserRepository implements Repository {
    public async save(user: User): Promise<User> {
        // TODO: complete this
        const userToSave = user;
        const newUser = await UserDao.create(userToSave);
        return newUser.toModel();
    }

    public async saveBulk(users: Array<User>): Promise<Array<User>> {
        // TODO: complete this

        const usersToSave = users.map((user) => user);
        const newUsers = await UserDao.insertMany(usersToSave);
        return newUsers.map((newUser) => newUser.toModel());
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async getUserById(userId: string): Promise<User> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default UserRepository;
