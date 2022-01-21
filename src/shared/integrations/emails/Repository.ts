interface Repository {
    init: (key: string) => void;
    sendEmail: (to: string, from: string, subject: string, body: string) => Promise<void>;
}

export type { Repository };
