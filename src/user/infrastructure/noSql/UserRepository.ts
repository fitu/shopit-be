import Page from "../../../shared/Page";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, fromUserToDao } from "./UserDao";

class UserRepository implements Repository {
    public async insert(user: User): Promise<User> {
        const userToSave: UserDao = fromUserToDao(user);

        const newUser = await UserDocument.create(userToSave);

        return newUser.toModel();
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<UserDao> = users.map((user) => fromUserToDao(user));

        const newUsers = await UserDocument.insertMany(usersToSave);

        return newUsers.map((newUser) => newUser.toModel());
    }

    public async update(user: User): Promise<User> {
        const userDao = await UserDocument.findById(user.id).exec();

        // TODO: this does not scale
        userDao.id = user.id;
        userDao.firstName = user.firstName;
        userDao.lastName = user.lastName;
        userDao.email = user.email;
        userDao.role = user.role;
        userDao.password = user.password;
        userDao.resetPasswordToken = user.resetPasswordToken;
        userDao.resetPasswordExpirationDate = user.resetPasswordExpirationDate;

        const updatedUser = await userDao.save();

        return updatedUser.toModel();
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const users = await UserDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
        const userModels = users.map((user) => user.toModel());

        const totalDocuments = await UserDocument.countDocuments();

        return new Page<Array<User>>({
            data: userModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        return UserDocument.findById(userId).exec();
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return UserDocument.findOne({ email }).exec();
    }
}

export default UserRepository;
