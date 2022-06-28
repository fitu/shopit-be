import Page from "../../../shared/Page";
import AvatarDao from "../../../avatar/infrastructure/sql/AvatarDao";
import CartDao from "../../../cart/infrastructure/sql/CartDao";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao, { USER_AVATAR, USER_CART, validateUserFieldsToInsert } from "./UserDao";

class UserRepository implements Repository {
    public async insert(user: User): Promise<User> {
        const userToInsert: User = validateUserFieldsToInsert(user);
        const newUser: UserDao = await UserDao.create(userToInsert);

        return newUser.toModel();
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<User> = users.map((user) => validateUserFieldsToInsert(user));
        const newUsers = await UserDao.bulkCreate(usersToSave, {
            include: [
                { model: CartDao, as: USER_CART },
                { model: AvatarDao, as: USER_AVATAR },
            ],
        });

        return newUsers.map((newUser) => newUser.toModel());
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userToUpdate: UserDao = await UserDao.findByPk(userId);

        if (!userToUpdate) {
            return null;
        }

        const userToSave: User = validateUserFieldsToInsert(user);
        const updatedUser: UserDao = await userToUpdate.update(userToSave);

        return updatedUser.toModel();
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const userToDelete: UserDao = await UserDao.findByPk(userId);

        if (!userToDelete) {
            return false;
        }

        await userToDelete.destroy();

        return true;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const allUsersWithMetadata = await UserDao.findAndCountAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const userModels: Array<User> = allUsersWithMetadata.rows.map((user) => user.toModel());
        const totalDocuments: number = allUsersWithMetadata.count;

        return new Page<Array<User>>({
            data: userModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const user: UserDao = await UserDao.findByPk(userId);
        return user?.toModel();
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const user: UserDao = await UserDao.findOne({ where: { email } });
        return user?.toModel();
    }

    // TODO: complete this
    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }
}

export default UserRepository;
