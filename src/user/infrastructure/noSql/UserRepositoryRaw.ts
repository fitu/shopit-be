import mongoose from "mongoose";

import Page from "../../../shared/Page";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, ShippingInfoDao } from "./UserDao";

class UserRepositoryRaw implements Repository {
    public async insert(user: User): Promise<User> {
        return new Promise(() => {});
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        return new Promise(() => {});
    }

    public async updateUserById(userIs: string, user: User): Promise<User | null> {
        return new Promise(() => {});
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        return new Promise(() => {});
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        return new Promise(() => {});
    }

    public async getUserById(userId: string): Promise<User | null> {
        return new Promise(() => {});
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return new Promise(() => {});
    }

    public async addProduct(userId: string, productId: string): Promise<void> {
        return new Promise(() => {});
    }
}

export default UserRepositoryRaw;
