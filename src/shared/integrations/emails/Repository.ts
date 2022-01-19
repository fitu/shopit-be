interface Repository {
    init: (key: String) => void;
    sendEmail: (to: String, from: String, subject: String, body: String) => Promise<boolean>;
}

export type { Repository };
