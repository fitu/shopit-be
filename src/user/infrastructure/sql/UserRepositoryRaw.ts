import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import Page from "../../../shared/Page";
import { hashPasswordSync } from "../../../shared/utils/hashUtils";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao, { USER_TABLE } from "./UserDao";

class UserRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async insert(user: User): Promise<User> {
        const userId = user.id || uuidv4();

        await this.instance.query(
            `
                INSERT INTO ${USER_TABLE} (
                    id,
                    "firstName",
                    "lastName",
                    email,
                    role,
                    password,
                    "resetPasswordToken",
                    "resetPasswordExpirationDate",
                    "createdAt",
                    "updatedAt"
                )
                VALUES (
                    :id,
                    :firstName,
                    :lastName,
                    :email,
                    :role,
                    :password,
                    :resetPasswordToken,
                    :resetPasswordExpirationDate,
                    :createdAt,
                    :updatedAt
                );
            `,
            {
                replacements: {
                    id: userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    password: hashPasswordSync(user.password),
                    resetPasswordToken: user.resetPasswordToken,
                    resetPasswordExpirationDate: user.resetPasswordExpirationDate,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            }
        );

        return { ...user, id: userId };
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersPromises = users.map(async (user) => {
            return this.insert(user);
        });

        return await Promise.all(usersPromises);
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        return new Promise(() => {});
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        return new Promise(() => {});
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
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

        return users?.map((user) => user.toModel())[0];
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

        return users?.map((user) => user.toModel())[0];
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }
}

export default UserRepositoryRaw;
