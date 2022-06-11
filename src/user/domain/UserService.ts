import moment from "moment";

import { doPasswordsMatch, hashPassword } from "../../shared/utils/hashUtils";
import { Repository as UserRepository } from "../infrastructure/Repository";

import User from "./User";

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async create(user: User): Promise<User> {
        return this.userRepository.create(user);
    }

    public async createBulk(users: Array<User>): Promise<Array<User>> {
        return this.userRepository.createBulk(users);
    }

    public async getUserById(userId: string): Promise<User> {
        return this.userRepository.getUserById(userId);
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getUserByEmail(email);
    }

    public async checkPassword(user: User, password: string): Promise<boolean> {
        return doPasswordsMatch(password, user.password);
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
