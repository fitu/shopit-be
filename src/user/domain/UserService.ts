import moment from "moment";

import Page from "../../shared/Page";
import NotAllowError from "../../shared/error/NotAllowError";
import NotFoundError from "../../shared/error/NotFoundError";
import InvalidDataError from "../../shared/error/InvalidDataError";
import { doPasswordsMatch } from "../../shared/utils/hashUtils";
import { Repository as UserRepository } from "../infrastructure/Repository";

import User from "./User";

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

    public async getUserById(userId: string): Promise<User> {
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            // TODO: do not hardcode this
            throw new NotFoundError("User not found");
        }

        return user;
    }

    public async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.getUserByEmail(email);

        if (!user) {
            // TODO: do not hardcode this
            throw new NotFoundError("User not found");
        }

        return user;
    }

    public async checkPassword(user: User, password: string): Promise<boolean> {
        return doPasswordsMatch(password, user.password);
    }

    public async checkUserPermissions(userId: string, userIdToCheck?: string): Promise<void> {
        const isAdmin = await this.isAdmin(userId);
        if (isAdmin || userId === userIdToCheck) {
            return;
        }

        // TODO: do not hardcode this
        throw new NotAllowError("You are not allow to do this action");
    }

    public async addTokenToUser(email: string, token: string): Promise<void> {
        const user = await this.userRepository.getUserByEmail(email);

        user.resetPasswordToken = token;
        user.resetPasswordExpirationDate = moment().add(1, "day").toDate();

        await this.userRepository.updateUserById(user.id, user);
    }

    public async updatePassword(user: User, newPassword: string, resetPasswordToken: string): Promise<void> {
        if (resetPasswordToken != user.resetPasswordToken) {
            // TODO: do not hardcode this
            throw new InvalidDataError("Data submited is invalid");
        }

        await this.userRepository.updatePassword(user, newPassword);
    }

    public async isAdmin(userId: string): Promise<boolean> {
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            return false;
        }

        // TODO: do not hardcode this
        return user.role === "admin";
    }

    public async deleteUserById(userId: string): Promise<void> {
        const success = await this.userRepository.deleteUserById(userId);

        if (!success) {
            // TODO: do not hardcode strings
            throw new NotFoundError("User not found");
        }
    }

    public async updateUserById(userId: string, user: User): Promise<User> {
        const updatedUser = await this.userRepository.updateUserById(userId, user);

        if (!user) {
            // TODO: do not hardcode strings
            throw new NotFoundError("User not found");
        }

        return updatedUser;
    }
}

export default UserService;
