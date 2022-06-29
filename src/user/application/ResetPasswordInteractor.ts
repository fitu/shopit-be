import UserService from "../domain/UserService";

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
        await this.userService.updatePassword(user, newPassword, resetPasswordToken);
    }
}

export type { ResetPasswordData };
export default ResetPasswordInteractor;
