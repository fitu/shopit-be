import PaymentInfo from "../domain/PaymentInfo";

interface Repository {
    save: (paymentInfo: PaymentInfo, userId: string) => Promise<PaymentInfo>;
    saveBulk: (paymentsInfo: Array<PaymentInfo>, userIds: Array<string>) => Promise<Array<PaymentInfo>>;
}

export type { Repository };
