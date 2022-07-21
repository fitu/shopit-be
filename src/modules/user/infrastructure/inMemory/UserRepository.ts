import Page from "@shared/Page";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import UserDao from "@user/infrastructure/inMemory/UserDao";
import { fromUserDaoToModel, fromModelToUserDao } from "@user/infrastructure/inMemory/userParsers";

class UserRepository implements Repository {
    readonly client: any;

    constructor(db: any) {
        this.client = db;
    }

    public async insert(user: User): Promise<User> {
        const userDao = fromModelToUserDao(user);

        await this.client.json.set("user", ".", { user: userDao });
        const newUser: UserDao = await this.client.json.get("user", {
            path: ".user",
        });

        const newUserModel = fromUserDaoToModel(newUser);
        return newUserModel;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const userPromises = users.map(async (user) => this.insert(user));

        await Promise.all(userPromises);

        const result = users.map((user) => ({ ...user, id: "foo" }));

        return Promise.resolve(result);
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        return Promise.resolve(null);
    }

    public async updatePassword(user: User, newPassword: string): Promise<void> {
        return Promise.resolve();
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        return Promise.resolve(<Page<Array<User>>>{});
    }

    public async getUserById(userId: string): Promise<User | null> {
        return Promise.resolve(null);
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return Promise.resolve(null);
    }
}

export default UserRepository;
