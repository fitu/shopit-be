import SignInError from "../../shared/error/SignInError";
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

    public async execute(data: SignInUserData): Promise<UserData> {
        const { email, password } = data;

        const user: User = await this.userService.getUserByEmail(email);

        const doPasswordMatch: boolean = await this.userService.checkPassword(user, password);
        if (!doPasswordMatch) {
            // TODO: do not hardcode this
            throw new SignInError("User or password invalid");
        }

        const userData: UserData = UserData.fromModel(user);

        return userData;
    }
}

export type { SignInUserData };
export default SignInUserInteractor;
