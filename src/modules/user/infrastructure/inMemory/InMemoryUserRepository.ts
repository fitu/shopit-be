import { Entity, Schema } from "redis-om";
import { Client, Repository as RedisRepository } from "redis-om";

import Page from "@shared/Page";
import User, { UserRole } from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import Cart from "@cart/domain/Cart";
import Avatar from "@avatar/domain/Avatar";
import Product from "@product/domain/Product";
import Review from "@review/domain/Review";
import ShippingInfo from "@shippingInfo/domain/ShippingInfo";

class UserEntity extends Entity {}

const userSchema = new Schema(UserEntity, {
    id: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    // role: { type: UserRole },
    password: { type: "string" },
    resetPasswordToken: { type: "string" },
    resetPasswordExpirationDate: { type: "date" },
    // cart: { type: Cart },
    // avatar: { type: Avatar },
    // products: { type: Array<Product> },
    // reviews: { type: Array<Review> },
    // shippingsInfo: { type: Array<ShippingInfo> },
});

class UserRepository implements Repository {
    readonly client: any;
    readonly userRepository: RedisRepository<UserEntity>;

    constructor(db: any) {
        this.client = db;
    }

    public async insert(user: User): Promise<User> {
        const foo = await this.client.jsonset("user", user);
        // const value = await client.json.get(TEST_KEY, {
        //   // JSON Path: .node = the element called 'node' at root level.
        //   path: '.node'
        // });

        console.log("foo");

        return { ...user, id: "foo" };
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const userPromises = users.map(async (user) => this.insert(user));

        await Promise.all(userPromises);

        const result = users.map((user) => ({ ...user, id: "foo" }));

        return Promise.resolve(result);
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        return Promise.resolve(null);
    }

    public async updatePassword(user: User, newPassword: string): Promise<void> {
        return Promise.resolve();
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        return Promise.resolve(<Page<Array<User>>>{});
    }

    public async getUserById(userId: string): Promise<User | null> {
        return Promise.resolve(null);
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return Promise.resolve(null);
    }
}

export default UserRepository;
