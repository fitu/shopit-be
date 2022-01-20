import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, ShippingInfoDao } from "./UserDao";

class UserRepository implements Repository {
    public async save(user: User): Promise<User> {
        const shippingsInfoToSave: Array<ShippingInfoDao> =
            user.shippingsInfo?.map((shippingInfo) => ({
                ...shippingInfo,
                _id: shippingInfo.id,
            })) ?? [];
        const userToSave: UserDao = {
            ...user,
            _id: user.id,
            shippingsInfo: shippingsInfoToSave,
        };

        const newUser = await UserDocument.create(userToSave);

        return newUser.toModel();
    }

    public async saveBulk(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<UserDao> = users.map((user) => {
            const shippingsInfoToSave: Array<ShippingInfoDao> =
                user.shippingsInfo?.map((shippingInfo) => ({
                    ...shippingInfo,
                    _id: shippingInfo.id,
                })) ?? [];
            return {
                ...user,
                _id: user.id,
                shippingsInfo: shippingsInfoToSave,
            };
        });

        const newUsers = await UserDocument.insertMany(usersToSave);

        return newUsers.map((newUser) => newUser.toModel());
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async getUserById(userId: string): Promise<User> {
        return new Promise(() => {});
    }
}

export default UserRepository;
