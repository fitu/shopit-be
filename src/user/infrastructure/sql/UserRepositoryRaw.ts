import { Sequelize } from "sequelize";
import AvatarDao from "../../../avatar/infrastructure/sql/AvatarDao";
import CartDao from "../../../cart/infrastructure/sql/CartDao";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao, { USER_TABLE } from "./UserDao";
import { isEmpty } from "lodash";

class UserRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async create(user: User): Promise<User> {
        return new Promise(() => {});
    }

    public async createBulk(users: Array<User>): Promise<Array<User>> {
        return new Promise(() => {});
    }

    public async update(user: User): Promise<User> {
        return new Promise(() => {});
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async getUserById(userId: string): Promise<User | null> {
        const users = await this.instance.query(
            `
                SELECT *
                FROM ${USER_TABLE}
                WHERE id = '${userId}';
            `,
            {
                model: UserDao,
                mapToModel: true,
            }
        );

        return !isEmpty(users) ? users.map((user) => user.toModel())[0] : null;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const users = await this.instance.query(
            `
                SELECT *
                FROM ${USER_TABLE}
                WHERE email = '${email}';
            `,
            {
                model: UserDao,
                mapToModel: true,
            }
        );

        return !isEmpty(users) ? users.map((user) => user.toModel())[0] : null;
    }
}

export default UserRepositoryRaw;
