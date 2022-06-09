import { NotFoundError } from "../../shared/error/NotFoundError";
import { SignInError } from "../../shared/error/SignInError";
import UserService from "../domain/UserService";

import UserData from "./UserData";

interface SignInUserData {
    email: string;
    password: string;
}

class SignInUserInteractor {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

        public async execute(data: SignInUserData): Promise<UserData> {
        const { email, password } = data;
        
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            // TODO: do not hardcode this
            throw new NotFoundError('User not found');
        }

        const doPasswordMatch = await this.userService.checkPassword(user, password);
        if (!doPasswordMatch) {
            // TODO: do not hardcode this
            throw new SignInError('User or password invalid');
        }

        return UserData.fromModel(user);
    }
}

export type { SignInUserData };
export default SignInUserInteractor;
