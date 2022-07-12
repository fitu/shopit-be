import PaymentInfo from "@paymentInfo/domain/PaymentInfo";

interface Repository {
    insert: (paymentInfo: PaymentInfo, userId: string) => Promise<PaymentInfo>;
    insertBatch: (paymentsInfo: Array<PaymentInfo>, userIds: Array<string>) => Promise<Array<PaymentInfo>>;
}

export type { Repository };
