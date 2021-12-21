import PaymentInfo from "../domain/PaymentInfo";

interface Repository {
    save: (paymentInfo: PaymentInfo) => Promise<PaymentInfo>;
    saveBulk: (paymentInfos: Array<PaymentInfo>) => Promise<Array<PaymentInfo>>;
}

class PaymentInfoRepository implements Repository {
    public async save(paymentInfo: PaymentInfo): Promise<PaymentInfo> {
        return new Promise(() => {});
    }

    public async saveBulk(paymentInfos: Array<PaymentInfo>): Promise<Array<PaymentInfo>> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default PaymentInfoRepository;
