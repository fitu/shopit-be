import { Repository as EmailRepository } from "./Repository";

class EmailService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public init(key: string): void {
        this.emailRepository.init(key);
    }

    public async sendEmail(to: string, from: string, subject: string, body: string): Promise<boolean> {
        return this.emailRepository.sendEmail(to, from, subject, body);
    }
}

export default EmailService;
