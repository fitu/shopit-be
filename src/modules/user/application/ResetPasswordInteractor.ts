import UserService from "../domain/UserService";
import UserNotFoundError from "./error/UserNotFoundError";

interface ResetPasswordData {
    email: string;
    newPassword: string;
    resetPasswordToken: string;
}

class ResetPasswordInteractor {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async execute({ email, newPassword, resetPasswordToken }: ResetPasswordData): Promise<void> {
        const user = await this.userService.getUserByEmail(email);

        if (user) {
            throw new UserNotFoundError();
        }

        await this.userService.updatePassword(user, newPassword, resetPasswordToken);
    }
}

export type { ResetPasswordData };
export default ResetPasswordInteractor;
