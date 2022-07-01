import { isEmpty } from "lodash";
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { wasDeletionSuccessful } from "../../../shared/utils/sqlUtils";
import Page from "../../../shared/Page";
import { hashPassword } from "../../../shared/utils/hashUtils";
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
        const userId: string = user.id || uuidv4();
        const hashedPassword = await hashPassword(user.password);

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
                    [USER_PASSWORD]: hashedPassword,
                    [USER_RESET_PASSWORD_TOKEN]: user.resetPasswordToken,
                    [USER_RESET_PASSWORD_EXPIRATION_DATE]: user.resetPasswordExpirationDate,
                    [USER_CREATED_AT]: new Date().toISOString(),
                    [USER_UPDATED_AT]: new Date().toISOString(),
                },
            }
        );

        const newUser = new User({ ...user, id: userId });

        return newUser;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersPromises = users.map(async (user) => {
            return this.insert(user);
        });

        return await Promise.all(usersPromises);
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        await this.instance.query(
            `
                UPDATE "${USER_TABLE}"
                SET 
                    "${USER_ID}" = :${USER_ID},
                    "${USER_FIRST_NAME}" = :${USER_FIRST_NAME},
                    "${USER_LAST_NAME}" = :${USER_LAST_NAME},
                    "${USER_EMAIL}" = :${USER_EMAIL},
                    "${USER_ROLE}" = :${USER_ROLE},
                    "${USER_RESET_PASSWORD_TOKEN}" = :${USER_RESET_PASSWORD_TOKEN},
                    "${USER_RESET_PASSWORD_EXPIRATION_DATE}" = :${USER_RESET_PASSWORD_EXPIRATION_DATE},
                    "${USER_UPDATED_AT}" = :${USER_UPDATED_AT}
                WHERE "${USER_ID}" = '${userId}';
            `,
            {
                replacements: {
                    [USER_ID]: userId,
                    [USER_FIRST_NAME]: user.firstName,
                    [USER_LAST_NAME]: user.lastName,
                    [USER_EMAIL]: user.email,
                    [USER_ROLE]: user.role,
                    [USER_RESET_PASSWORD_TOKEN]: user.resetPasswordToken,
                    [USER_RESET_PASSWORD_EXPIRATION_DATE]: user.resetPasswordExpirationDate,
                    [USER_UPDATED_AT]: new Date().toISOString(),
                },
            }
        );

        return user;
    }

    public async updatePassword(user: User, newPassword: string): Promise<void> {
        const hashedPassword = await hashPassword(newPassword);

        await this.instance.query(
            `
                UPDATE "${USER_TABLE}"
                SET 
                    "${USER_PASSWORD}" = :${USER_PASSWORD},
                    "${USER_RESET_PASSWORD_TOKEN}" = :${USER_RESET_PASSWORD_TOKEN},
                    "${USER_RESET_PASSWORD_EXPIRATION_DATE}" = :${USER_RESET_PASSWORD_EXPIRATION_DATE},
                    "${USER_UPDATED_AT}" = :${USER_UPDATED_AT}
                WHERE "${USER_ID}" = '${user.id}';
            `,
            {
                replacements: {
                    [USER_PASSWORD]: hashedPassword,
                    [USER_RESET_PASSWORD_TOKEN]: null,
                    [USER_RESET_PASSWORD_EXPIRATION_DATE]: null,
                    [USER_UPDATED_AT]: new Date().toISOString(),
                },
            }
        );
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const [_, metadata] = await this.instance.query(
            `
                DELETE FROM "${USER_TABLE}"
                WHERE "${USER_ID}" = '${userId}';
            `
        );

        return wasDeletionSuccessful(metadata);
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const users = await this.instance.query(
            `
                SELECT *
                FROM "${USER_TABLE}"
                LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
            `,
            {
                model: UserDao,
                mapToModel: true,
            }
        );

        const userModels: Array<User> = users.map((user) => user.toModel());

        return new Page<Array<User>>({
            data: userModels,
            currentPage: page,
            totalNumberOfDocuments: users.length,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const [user] = await this.instance.query(
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

        if (isEmpty(user)) {
            return null;
        }

        const userModel = user.toModel();
        return userModel;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const [user] = await this.instance.query(
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

        if (isEmpty(user)) {
            return null;
        }

        const userModel = user.toModel();
        return userModel;
    }
}

export default UserRepositoryRaw;
