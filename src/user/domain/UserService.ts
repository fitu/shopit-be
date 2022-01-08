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
        const foo = await this.userRepository.saveBulk(users);
        console.log(foo)
        return foo;
    }

    public async getUserById(userId: number): Promise<User> {
        return this.userRepository.getUserById(userId);
    }
}

export default UserService;
