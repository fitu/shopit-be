interface Repository {
    init: (key: string) => void;
    sendEmail: (to: string, from: string, subject: string, body: string) => Promise<boolean>;
}

export type { Repository };
