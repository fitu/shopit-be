import NotFoundError from "../../shared/error/NotFoundError";
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

        if (user) {
            // TODO: do not hardcode strings
            throw new NotFoundError("User not found");
        }

        await this.userService.updatePassword(user, newPassword, resetPasswordToken);
    }
}

export type { ResetPasswordData };
export default ResetPasswordInteractor;
