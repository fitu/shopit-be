import { Repository as UserRepository } from "../infrastructure/Repository";

import User from "./User";

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    public async createBulk(users: Array<User>): Promise<Array<User>> {
        return this.userRepository.saveBulk(users);
    }

    public async getUserById(userId: string): Promise<User> {
        return this.userRepository.getUserById(userId);
    }
}

export default UserService;
