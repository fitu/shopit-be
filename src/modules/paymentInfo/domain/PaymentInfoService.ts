import { Repository as PaymentInfoRepository } from "@paymentInfo/infrastructure/Repository";
import PaymentInfo from "@paymentInfo/domain/PaymentInfo";

class PaymentInfoService {
    private paymentInfoRepository: PaymentInfoRepository;

    constructor(paymentInfoRepository: PaymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public async insert(paymentInfo: PaymentInfo, userId: string): Promise<PaymentInfo> {
        return this.paymentInfoRepository.insert(paymentInfo, userId);
    }

    public async insertBatch(paymentsInfo: Array<PaymentInfo>, userIds: Array<string>): Promise<Array<PaymentInfo>> {
        return this.paymentInfoRepository.insertBatch(paymentsInfo, userIds);
    }
}

export default PaymentInfoService;
