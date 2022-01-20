import AvatarDao from "../../../avatar/infrastructure/sql/AvatarDao";
import CartDao from "../../../cart/infrastructure/sql/CartDao";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao from "./UserDao";

class UserRepository implements Repository {
    public async save(user: User): Promise<User> {
        const newUser = await UserDao.create({
            ...(user.id && { id: user.id }),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpirationDate: new Date(user.resetPasswordExpirationDate),
        });

        return newUser.toModel();
    }

    public async saveBulk(users: Array<User>): Promise<Array<User>> {
        const usersToSave = users.map((user) => {
            const cart = {
                id: user.cart.id,
                itemsPrice: user.cart.itemsPrice,
                taxPrice: user.cart.taxPrice,
                totalPrice: user.cart.totalPrice,
            };

            const avatar = user.avatar
                ? {
                      id: user.avatar.id,
                      publicId: user.avatar.publicId,
                      url: user.avatar.url,
                  }
                : null;

            return {
                ...(user.id && { id: user.id }),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                password: user.password,
                resetPasswordToken: user.resetPasswordToken,
                resetPasswordExpirationDate: new Date(user.resetPasswordExpirationDate),
                cart,
                ...(avatar && { avatar }),
            };
        });

        const newUsers = await UserDao.bulkCreate(usersToSave, {
            include: [
                { model: CartDao, as: "cart" },
                { model: AvatarDao, as: "avatar" },
            ],
        });

        return newUsers.map((newUser) => newUser.toModel());
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async getUserById(userId: string): Promise<User> {
        return UserDao.findByPk(userId);
    }
}

export default UserRepository;
