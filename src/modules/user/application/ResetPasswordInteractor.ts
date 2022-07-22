import UserService from "@user/domain/UserService";
import UserNotFoundError from "@user/application/error/UserNotFoundError";

type ResetPasswordData = {
    readonly email: string;
    readonly newPassword: string;
    readonly resetPasswordToken: string;
};

class ResetPasswordInteractor {
    constructor(private readonly userService: UserService) {}

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
