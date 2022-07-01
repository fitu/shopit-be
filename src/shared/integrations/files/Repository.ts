interface Repository {
    init: () => void;
    generateInvoice: (invoicePath: string) => Promise<void>;
}

export type { Repository };
