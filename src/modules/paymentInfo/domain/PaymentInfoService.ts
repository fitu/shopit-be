import { Repository as PaymentInfoRepository } from "@paymentInfo/infrastructure/Repository";
import PaymentInfo from "@paymentInfo/domain/PaymentInfo";

class PaymentInfoService {
    constructor(private readonly paymentInfoRepository: PaymentInfoRepository) {}

    public async insert(paymentInfo: PaymentInfo, userId: string): Promise<PaymentInfo> {
        return this.paymentInfoRepository.insert(paymentInfo, userId);
    }

    public async insertBatch(paymentsInfo: Array<PaymentInfo>, userIds: Array<string>): Promise<Array<PaymentInfo>> {
        return this.paymentInfoRepository.insertBatch(paymentsInfo, userIds);
    }
}

export default PaymentInfoService;
