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

    public async execute(data: ResetPasswordData): Promise<void> {
        this.userService.updatePassword(data.email, data.newPassword, data.resetPasswordToken);
    }
}

export type { ResetPasswordData };
export default ResetPasswordInteractor;
