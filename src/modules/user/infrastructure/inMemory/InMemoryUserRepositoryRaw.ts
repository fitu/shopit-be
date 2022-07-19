import Page from "@shared/Page";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";

class UserRepositoryRaw implements Repository {
    public async insert(user: User): Promise<User> {
        return Promise.resolve(<User>{});
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        return Promise.resolve([]);
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

export default UserRepositoryRaw;
