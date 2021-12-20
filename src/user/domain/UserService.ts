import UserRepository from "../infrastructure/UserRepository";

import User from "./User";

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async createBulk(users: Array<User>): Promise<Array<User>> {
        return await this.userRepository.saveBulk(users);
    }

    public async getUserById(userId: number): Promise<User> {
        return await this.userRepository.getUserById(userId);
    }
}

export default UserService;
