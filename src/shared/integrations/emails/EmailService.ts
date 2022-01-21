import Email from "./Email";
import { Repository as EmailRepository } from "./Repository";

class EmailService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public init(key: string): void {
        this.emailRepository.init(key);
    }

    public async sendEmail(email: Email): Promise<void> {
        this.emailRepository.sendEmail(email.to, email.from, email.subject, email.body);
    }

    public async sendWelcomeEmail(to: string): Promise<void> {
        // TODO: remove hardcoded
        const emailData = new Email({
            to,
            from: "victorio.matteucci.shopit@gmail.com",
            subject: "Thanks for creating a new account!",
            body: "<h1>You successfully signed up! :)</h1>",
        });

        this.sendEmail(emailData);
    }

    public async sendForgotPassword(email: string, token: string): Promise<void> {
        // TODO: remove hardcoded
        const emailData = new Email({
            to: email,
            from: "victorio.matteucci.shopit@gmail.com",
            subject: "Follow the link to change your password",
            body: `<h1>Hit this <a href="http://localhost:3000/users/reset-password?token=${token}&email=${email}">link</a></h1>`,
        });

        this.sendEmail(emailData);
    }
}

export default EmailService;
