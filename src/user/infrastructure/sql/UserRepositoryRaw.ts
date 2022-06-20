import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import Page from "../../../shared/Page";
import { hashPasswordSync } from "../../../shared/utils/hashUtils";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDao, {
    USER_TABLE,
    USER_ID,
    USER_FIRST_NAME,
    USER_LAST_NAME,
    USER_EMAIL,
    USER_ROLE,
    USER_PASSWORD,
    USER_RESET_PASSWORD_TOKEN,
    USER_RESET_PASSWORD_EXPIRATION_DATE,
    USER_CREATED_AT,
    USER_UPDATED_AT,
    USER_CART,
    USER_AVATAR,
    USER_PAYMENTS_INFO,
    USER_SHIPPINGS_INFO,
    USER_PRODUCTS,
    USER_REVIEWS,
    USER_ORDERS,
} from "./UserDao";

class UserRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async insert(user: User): Promise<User> {
        const userId = user.id || uuidv4();

        await this.instance.query(
            `
                INSERT INTO ${USER_TABLE} (
                    "${USER_ID}",
                    "${USER_FIRST_NAME}",
                    "${USER_LAST_NAME}",
                    "${USER_EMAIL}",
                    "${USER_ROLE}",
                    "${USER_PASSWORD}",
                    "${USER_RESET_PASSWORD_TOKEN}",
                    "${USER_RESET_PASSWORD_EXPIRATION_DATE}",
                    "${USER_CREATED_AT}",
                    "${USER_UPDATED_AT}"
                )
                VALUES (
                    :${USER_ID},
                    :${USER_FIRST_NAME},
                    :${USER_LAST_NAME},
                    :${USER_EMAIL},
                    :${USER_ROLE},
                    :${USER_PASSWORD},
                    :${USER_RESET_PASSWORD_TOKEN},
                    :${USER_RESET_PASSWORD_EXPIRATION_DATE},
                    :${USER_CREATED_AT},
                    :${USER_UPDATED_AT}
                );
            `,
            {
                replacements: {
                    [USER_ID]: userId,
                    [USER_FIRST_NAME]: user.firstName,
                    [USER_LAST_NAME]: user.lastName,
                    [USER_EMAIL]: user.email,
                    [USER_ROLE]: user.role,
                    [USER_PASSWORD]: hashPasswordSync(user.password),
                    [USER_RESET_PASSWORD_TOKEN]: user.resetPasswordToken,
                    [USER_RESET_PASSWORD_EXPIRATION_DATE]: user.resetPasswordExpirationDate,
                    [USER_CREATED_AT]: new Date().toISOString(),
                    [USER_UPDATED_AT]: new Date().toISOString(),
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
                FROM "${USER_TABLE}"
                WHERE "${USER_ID}" = '${userId}';
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
                FROM "${USER_TABLE}"
                WHERE "${USER_EMAIL}" = '${email}';
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
