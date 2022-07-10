import { generateRandomToken } from "../../shared/utils/hashUtils";
import EmailService from "../../shared/integrations/emails/EmailService";
import UserService from "../domain/UserService";
import UserNotFoundError from "./error/UserNotFoundError";

interface ForgotPasswordData {
    email: string;
}

class ForgotPasswordInteractor {
    private userService: UserService;
    private emailService: EmailService;

    constructor(userService: UserService, emailService: EmailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

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
