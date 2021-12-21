import AvatarDao from "../../avatar/infrastructure/AvatarDao";
import CartDao from "../../cart/infrastructure/CartDao";
import User from "../domain/User";

import UserDao from "./UserDao";

interface Repository {
    save: (user: User) => Promise<User>;
    saveBulk: (users: Array<User>) => Promise<Array<User>>;
    addProduct: (userId: number, productId: number) => Promise<void>;
    getUserById: (userId: number) => Promise<User>;
}

class UserRepository implements Repository {
    public async save(user: User): Promise<User> {
        const newUser = await UserDao.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpire: new Date(user.resetPasswordExpire),
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
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                password: user.password,
                resetPasswordToken: user.resetPasswordToken,
                resetPasswordExpire: new Date(user.resetPasswordExpire),
                cart,
                ...(avatar && { avatar }),
            };
        });

        const savedUsers = await UserDao.bulkCreate(usersToSave, {
            include: [
                { model: CartDao, as: "cart" },
                { model: AvatarDao, as: "avatar" },
            ],
        });

        return savedUsers.map((savedUser) => savedUser.toModel());
    }

    public async addProduct(userId: number, productId: number): Promise<void> {
        return new Promise(() => {});
    }

    public async getUserById(userId: number): Promise<User> {
        return await UserDao.findByPk(userId);
    }
}

export type { Repository };
export default UserRepository;
