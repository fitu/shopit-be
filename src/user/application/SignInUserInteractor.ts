import SignInError from "../../shared/error/SignInError";
import NotFoundError from "../../shared/error/NotFoundError";
import UserService from "../domain/UserService";
import User from "../domain/User";

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

    public async execute({ email, password }: SignInUserData): Promise<UserData> {
        const user: User = await this.userService.getUserByEmail(email);

        if (!user) {
            // TODO: remove hardcoded
            throw new NotFoundError("User not found");
        }

        const doPasswordMatch: boolean = await this.userService.checkPassword(user, password);
        if (!doPasswordMatch) {
            // TODO: remove hardcoded
            throw new SignInError("User or password invalid");
        }

        const userData: UserData = UserData.fromModel(user);

        return userData;
    }
}

export type { SignInUserData };
export default SignInUserInteractor;
