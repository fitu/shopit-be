class Email {
    readonly to: string;
    readonly from: string;
    readonly subject: string;
    readonly body: string;

    constructor({
        to,
        from,
        subject,
        body,
    }: {
        to: string;
        from: string;
        subject: string;
        body: string;
    }) {
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.body = body;
    }
}

export default Email;
