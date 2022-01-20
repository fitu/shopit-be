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

    public async sendEmail(email: Email): Promise<boolean> {
        return this.emailRepository.sendEmail(email.to, email.from, email.subject, email.body);
    }

    public async sendWelcomeEmail(to: string): Promise<boolean> {
        // TODO: remove hardcoded
        const email = new Email({
            to,
            from: "victorio.matteucci.shopit@gmail.com",
            subject: "Thanks for creating a new account!",
            body: "<h1>You successfully signed up! :)</h1>",
        });

        return this.sendEmail(email);
    }
}

export default EmailService;
