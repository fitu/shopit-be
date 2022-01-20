import { generateToken } from "../../shared/utils/hashUtils";

import EmailService from "../../shared/integrations/emails/EmailService";
import UserService from "../domain/UserService";

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

    public async execute(data: ForgotPasswordData): Promise<void> {
        const token = await generateToken();

        await this.userService.addTokenToUser(data.email, token);

        this.emailService.sendForgotPassword(data.email, token);
    }
}

export type { ForgotPasswordData };
export default ForgotPasswordInteractor;
