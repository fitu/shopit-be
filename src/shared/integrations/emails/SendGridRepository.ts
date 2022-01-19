import nodemailer from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid-transport";

import { Repository } from "./Repository";

class SendGridRepository implements Repository {
    private transporter: any;

    public init(key: String): void {
        const transportOptions = { auth: { api_key: key } };
        this.transporter = nodemailer.createTransport(sendGridTransport(transportOptions));
    }

    public async sendEmail(to: String, from: String, subject: String, body: String): Promise<boolean> {
        try {
            await this.transporter.sendMail({ to, from, subject, body });
            return true;
        } catch {
            return false;
        }
    }
}

export default SendGridRepository;
