import { Repository as EmailRepository } from "./Repository";

class EmailService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public init(key: String): void {
        this.emailRepository.init(key);
    }

    public async sendEmail(to: String, from: String, subject: String, body: String): Promise<boolean> {
        return this.emailRepository.sendEmail(to, from, subject, body);
    }
}

export default EmailService;
