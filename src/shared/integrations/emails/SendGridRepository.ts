import nodemailer from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid-transport";

import { Repository } from "@shared/integrations/emails/Repository";

class SendGridRepository implements Repository {
    private transporter: any;

    public init(key: string): void {
        const transportOptions = { auth: { api_key: key } };
        this.transporter = nodemailer.createTransport(sendGridTransport(transportOptions));
    }

    public async sendEmail(to: string, from: string, subject: string, body: string): Promise<void> {
        // TODO: improve this
        try {
            await this.transporter.sendMail({ to, from, subject, html: body });
        } catch (error) {
            // TODO: use logger
            console.log(`Error when sending email: ${error}`);
        }
    }
}

export default SendGridRepository;
