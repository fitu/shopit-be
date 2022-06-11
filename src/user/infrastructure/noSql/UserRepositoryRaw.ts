import mongoose from 'mongoose';

import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, ShippingInfoDao } from "./UserDao";

class UserRepositoryRaw implements Repository {
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
        return new Promise(() => {});
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return new Promise(() => {});
    }
}

export default UserRepositoryRaw;
