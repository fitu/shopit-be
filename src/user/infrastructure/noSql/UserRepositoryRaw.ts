import mongoose from "mongoose";

import { hashPassword, hashPasswordSync } from "../../../shared/utils/hashUtils";
import Page from "../../../shared/Page";
import User from "../../domain/User";
import { Repository } from "../Repository";

import { UserDao, USER_DOCUMENT } from "./UserDao";
import { fromUserDaoToModel, fromUserToDao } from "./userParsers";

class UserRepositoryRaw implements Repository {
    public async insert(user: User): Promise<User> {
        // FIXME: check id
        const hashedPassword: string = await hashPassword(user.password);
        user.password = hashedPassword;

        const userToSave: UserDao = fromUserToDao(user);
        await mongoose.connection.db.collection(USER_DOCUMENT).insertOne(userToSave);

        return user;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        // FIXME: check id
        const usersToSave: Array<UserDao> = users.map((user) => {
            const hashedPassword: string = hashPasswordSync(user.password);
            user.password = hashedPassword;

            const userDao: UserDao = fromUserToDao(user);

            return userDao;
        });

        await mongoose.connection.db.collection(USER_DOCUMENT).insertMany(usersToSave);

        return users;
    }

    // FIXME: fix this
    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userToUpdate: UserDao = fromUserToDao(user);

        const foo = await mongoose.connection.db
            .collection(USER_DOCUMENT)
            .updateOne({ remoteId: userId }, userToUpdate);
        console.log(foo);

        return user;
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const { value } = await mongoose.connection.db.collection(USER_DOCUMENT).findOneAndDelete({ remoteId: userId });

        const success = !!value;

        return success;
    }

    // TODO: paginate this & check if there are no entries
    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const queryResults = await mongoose.connection.db.collection(USER_DOCUMENT).find().toArray();

        const users: Array<User> = queryResults.map((queryResult) => {
            const userDao = queryResult as UserDao;
            const user: User = fromUserDaoToModel(userDao);

            return user;
        });
        const totalDocuments = users.length;

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const queryResult = await mongoose.connection.db.collection(USER_DOCUMENT).findOne({ remoteId: userId });

        if (!queryResult) {
            return null;
        }

        const userDao = queryResult as UserDao;
        const user: User = fromUserDaoToModel(userDao);

        return user;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const queryResult = await mongoose.connection.db.collection(USER_DOCUMENT).findOne({ email });

        if (!queryResult) {
            return null;
        }

        const userDao = queryResult as UserDao;
        const user: User = fromUserDaoToModel(userDao);

        return user;
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }
}

export default UserRepositoryRaw;
