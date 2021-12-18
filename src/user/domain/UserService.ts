import Cart from "../../cart/domain/Cart";
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

    public async addCart(user: User, cart: Cart): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async getUserById(userId: number): Promise<User> {
        return await this.userRepository.getUserById(userId);
    }
}

export default UserService;
