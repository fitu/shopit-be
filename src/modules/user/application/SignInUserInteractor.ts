import UserService from "../domain/UserService";
import User from "../domain/User";
import UserNotFoundError from "./error/UserNotFoundError";
import SignInError from "./error/SignInError";
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
            throw new UserNotFoundError();
        }

        const doPasswordMatch: boolean = await this.userService.checkPassword(user, password);
        if (!doPasswordMatch) {
            throw new SignInError("error.user_or_password_invalid");
        }

        const userData: UserData = UserData.fromModel(user);

        return userData;
    }
}

export type { SignInUserData };
export default SignInUserInteractor;
