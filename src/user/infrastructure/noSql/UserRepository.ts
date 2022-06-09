import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, ShippingInfoDao } from "./UserDao";

class UserRepository implements Repository {
    public async create(user: User): Promise<User> {
        const shippingsInfoToSave: Array<ShippingInfoDao> =
            user.shippingsInfo?.map((shippingInfo) => ({
                ...shippingInfo,
            })) ?? [];
        const userToSave: UserDao = {
            ...user,
            shippingsInfo: shippingsInfoToSave,
        };

        const newUser = await UserDocument.create(userToSave);

        return newUser.toModel();
    }

    public async createBulk(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<UserDao> = users.map((user) => {
            const shippingsInfoToSave: Array<ShippingInfoDao> =
                user.shippingsInfo?.map((shippingInfo) => ({
                    ...shippingInfo,
                })) ?? [];
            return {
                ...user,
                shippingsInfo: shippingsInfoToSave,
            };
        });

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

    public async getUserById(userId: string): Promise<User> {
        return UserDocument.findById(userId).exec();
    }

    public async getUserByEmail(email: string): Promise<User> {
        return UserDocument.findOne({ email }).exec();
    }
}

export default UserRepository;
