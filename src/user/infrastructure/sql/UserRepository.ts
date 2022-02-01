import { doPasswordsMatch } from "../../../shared/utils/hashUtils";
import AvatarDao from "../../../avatar/infrastructure/sql/AvatarDao";
import CartDao from "../../../cart/infrastructure/sql/CartDao";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao from "./UserDao";

class UserRepository implements Repository {
    public async create(user: User): Promise<User> {
        const userToSave = {
            ...(user.id && { id: user.id }),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            resetPasswordToken: user.resetPasswordToken ?? null,
            resetPasswordExpirationDate: user.resetPasswordExpirationDate
                ? new Date(user.resetPasswordExpirationDate)
                : null,
        };
        const newUser = await UserDao.create(userToSave);

        return newUser.toModel();
    }

    public async createBulk(users: Array<User>): Promise<Array<User>> {
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
                resetPasswordToken: user.resetPasswordToken ?? null,
                resetPasswordExpirationDate: user.resetPasswordExpirationDate
                    ? new Date(user.resetPasswordExpirationDate)
                    : null,
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

    public async update(user: User): Promise<User> {
        const userDao = await UserDao.findByPk(user.id);

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
        return UserDao.findByPk(userId);
    }

    public async signIn(email: string, password: string): Promise<User> {
        const user = await UserDao.findOne({ where: { email } });
        const doMatch = await doPasswordsMatch(password, user.password);
        if (!doMatch) {
            // TODO: check errors
            throw new Error();
        }

        return user;
    }

    public async getUserByEmail(email: string): Promise<User> {
        const user = await UserDao.findOne({ where: { email } });
        return user.toModel();
    }
}

export default UserRepository;
