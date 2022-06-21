import Page from "../../../shared/Page";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, UserFullDocument, fromUserToDao } from "./UserDao";

class UserRepository implements Repository {
    public async insert(user: User): Promise<User> {
        const userToSave: UserDao = fromUserToDao(user);

        const newUser: UserFullDocument = await UserDocument.create(userToSave);

        return newUser.toModel();
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<UserDao> = users.map((user) => fromUserToDao(user));

        const newUsers: Array<UserFullDocument> = await UserDocument.insertMany(usersToSave);

        return newUsers.map((newUser) => newUser.toModel());
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userDocument: UserFullDocument = await UserDocument.findById(userId).exec();

        // TODO: this does not scale
        userDocument.id = user.id;
        userDocument.firstName = user.firstName;
        userDocument.lastName = user.lastName;
        userDocument.email = user.email;
        userDocument.role = user.role;
        userDocument.password = user.password;
        userDocument.resetPasswordToken = user.resetPasswordToken;
        userDocument.resetPasswordExpirationDate = user.resetPasswordExpirationDate;

        const updatedUser: UserFullDocument = await userDocument.save();

        return updatedUser.toModel();
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        await UserDocument.deleteOne({ id: userId }).exec();
        return true;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const userDocuments: Array<UserFullDocument> = await UserDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
        const users: Array<User> = userDocuments.map((userDocument) => userDocument.toModel());

        const totalDocuments: number = users.length;

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const userDocument: UserFullDocument = await UserDocument.findById(userId).exec();
        return userDocument.toModel();
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const userDocument: UserFullDocument = await UserDocument.findOne({ email }).exec();
        return userDocument.toModel();
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }
}

export default UserRepository;
