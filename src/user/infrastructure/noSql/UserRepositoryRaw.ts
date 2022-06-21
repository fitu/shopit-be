import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import Page from "../../../shared/Page";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserFullDocument, UserDao, ShippingInfoDao, fromUserToDao } from "./UserDao";

class UserRepositoryRaw implements Repository {
    public async insert(user: User): Promise<User> {
        const userDao = fromUserToDao(user);
        const userWithId = {
            ...userDao,
            _id: new ObjectId(userDao._id),
        };

        const foo = await mongoose.connection.db.collection("users").insertOne(userWithId);

        console.log(foo);
        return user;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersDao = users.map((user) => {
            const userDao = fromUserToDao(user);
            const userWithId = {
                ...userDao,
                _id: new ObjectId(userDao._id),
            };
            return userWithId;
        });

        const foo = await mongoose.connection.db.collection("users").insertMany(usersDao);

        console.log(foo);
        return users;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userDao = fromUserToDao(user);

        const foo = await mongoose.connection.db.collection("users").updateOne({ _id: new ObjectId(userId) }, userDao);
        console.log(foo);

        return user;
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const foo = await mongoose.connection.db.collection("users").findOneAndDelete({ _id: new ObjectId(userId) });

        console.log(foo);

        return true;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const usersDao: Array<any> = await mongoose.connection.db.collection("users").find().toArray();

        const users = usersDao.map((userDao) => userDao.toModel());
        const totalDocuments = users.length;

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const userDao: any = await mongoose.connection.db.collection("users").findOne({ _id: new ObjectId(userId) });

        return userDao;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const userDao: any = await mongoose.connection.db.collection("users").findOne({ email });

        return userDao;
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }
}

export default UserRepositoryRaw;
