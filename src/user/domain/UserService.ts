import moment from "moment";

import { NotAllowError } from "../../shared/error/NotAllowError";
import { NotFoundError } from "../../shared/error/NotFoundError";
import { doPasswordsMatch, hashPassword } from "../../shared/utils/hashUtils";
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

        await this.userRepository.update(user);
    }

    public async updatePassword(email: string, newPassword: string, resetPasswordToken: string): Promise<void> {
        const user = await this.userRepository.getUserByEmail(email);

        if (resetPasswordToken != user.resetPasswordToken) {
            // TODO: handle error
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpirationDate = null;

        await this.userRepository.update(user);
    }

    public async isAdmin(userId: string): Promise<boolean> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            return false;
        }

        // TODO: do not hardcode this
        return user.role === "admin";
    }
}

export default UserService;
