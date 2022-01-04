import PaymentInfo from "../domain/PaymentInfo";

interface Repository {
    save: (paymentInfo: PaymentInfo, userId: number) => Promise<PaymentInfo>;
    saveBulk: (paymentsInfo: Array<PaymentInfo>, userIds: Array<number>) => Promise<Array<PaymentInfo>>;
}

export type { Repository };
