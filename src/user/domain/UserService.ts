import moment from "moment";

import Page from "../../shared/Page";
import NotAllowError from "../../shared/error/NotAllowError";
import NotFoundError from "../../shared/error/NotFoundError";
import InvalidDataError from "../../shared/error/InvalidDataError";
import { doPasswordsMatch } from "../../shared/utils/hashUtils";
import { Repository as UserRepository } from "../infrastructure/Repository";

import User, { UserRole } from "./User";

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async insert(user: User): Promise<User> {
        return this.userRepository.insert(user);
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        return this.userRepository.insertBatch(users);
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        return this.userRepository.getAllUsers(page, itemsPerPage);
    }

    public async getUserById(userId: string): Promise<User | null> {
        return this.userRepository.getUserById(userId);
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getUserByEmail(email);
    }

    public async checkPassword(user: User, password: string): Promise<boolean> {
        return doPasswordsMatch(password, user.password);
    }

    public async hasUserPermissions(userId: string, userIdToCheck?: string): Promise<boolean> {
        const isAdmin = await this.isAdmin(userId);
        return isAdmin || userId === userIdToCheck;
    }

    public async addTokenToUser(email: string, token: string): Promise<void> {
        const user = await this.userRepository.getUserByEmail(email);

        if (user) {
            // TODO: remove hardcoded
            throw new NotFoundError("User not found");
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpirationDate = moment().add(1, "day").toDate();

        await this.userRepository.updateUserById(user.id, user);
    }

    public async updatePassword(user: User, newPassword: string, resetPasswordToken: string): Promise<void> {
        if (resetPasswordToken != user.resetPasswordToken) {
            // TODO: remove hardcoded
            throw new InvalidDataError("Data submitted is invalid");
        }

        await this.userRepository.updatePassword(user, newPassword);
    }

    public async isAdmin(userId: string): Promise<boolean> {
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            return false;
        }

        return user.role === UserRole.ADMIN.toString();
    }

    public async deleteUserById(userId: string): Promise<void> {
        const success = await this.userRepository.deleteUserById(userId);

        if (!success) {
            // TODO: remove hardcoded
            throw new NotFoundError("User not found");
        }
    }

    public async updateUserById(userId: string, user: User): Promise<User> {
        const updatedUser = await this.userRepository.updateUserById(userId, user);

        if (!user) {
            // TODO: remove hardcoded
            throw new NotFoundError("User not found");
        }

        return updatedUser;
    }
}

export default UserService;
