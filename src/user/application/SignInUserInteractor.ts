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
        const loggedInUser = await this.userService.signIn(email, password);

        return UserData.fromModel(loggedInUser);
    }
}

export type { SignInUserData };
export default SignInUserInteractor;
