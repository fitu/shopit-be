import UserService from "@user/domain/UserService";
import User from "@user/domain/User";
import UserNotFoundError from "@user/application/error/UserNotFoundError";
import SignInError from "@user/application/error/SignInError";
import UserData from "@user/application/UserData";

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
