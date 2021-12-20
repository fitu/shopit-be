import ProductDao from "../../product/infrastructure/ProductDao";
import CartDao from "../../cart/infrastructure/CartDao";
import Cart from "../../cart/domain/Cart";
import User from "../domain/User";

import UserDao from "./UserDao";

interface Repository {
    save: (user: User) => Promise<User>;
    saveBulk: (users: Array<User>) => Promise<Array<User>>;
    addCart: (userId: number, cart: Cart) => Promise<void>;
    addProduct: (userId: number, productId: number) => Promise<void>;
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
        const usersToSave = users.map((user) => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpire: new Date(user.resetPasswordExpire),
        }));

        const savedUsers = await UserDao.bulkCreate(usersToSave);

        return savedUsers.map((savedUser) => savedUser.toModel());
    }

    public async addCart(userId: number, cart: Cart): Promise<void> {
        const foundUser = await UserDao.findByPk(userId);
        const newCart = await CartDao.findByPk(cart.id);
        // FIXME: fix this setter
        await foundUser.setCart(newCart);
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
