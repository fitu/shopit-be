import EmailService from "@shared/integrations/emails/EmailService";
import { generateRandomToken } from "@utils/hashUtils";
import UserService from "@user/domain/UserService";
import UserNotFoundError from "@user/application/error/UserNotFoundError";

type ForgotPasswordData = {
    readonly email: string;
};

class ForgotPasswordInteractor {
    constructor(private readonly userService: UserService, private readonly emailService: EmailService) {}

    public async execute({ email }: ForgotPasswordData): Promise<void> {
        const user = await this.userService.getUserByEmail(email);

        if (user) {
            throw new UserNotFoundError();
        }

        const token = await generateRandomToken();

        await this.userService.addTokenToUser(user.email, token);

        this.emailService.sendForgotPassword(user.email, token);
    }
}

export type { ForgotPasswordData };
export default ForgotPasswordInteractor;
