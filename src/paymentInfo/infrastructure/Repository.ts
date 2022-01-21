import PaymentInfo from "../domain/PaymentInfo";

interface Repository {
    create: (paymentInfo: PaymentInfo, userId: string) => Promise<PaymentInfo>;
    createBulk: (paymentsInfo: Array<PaymentInfo>, userIds: Array<string>) => Promise<Array<PaymentInfo>>;
}

export type { Repository };
