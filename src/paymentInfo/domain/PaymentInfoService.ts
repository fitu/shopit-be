import { Repository as PaymentInfoRepository } from "../infrastructure/Repository";

import PaymentInfo from "./PaymentInfo";

class PaymentInfoService {
    private paymentInfoRepository: PaymentInfoRepository;

    constructor(paymentInfoRepository: PaymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public async create(paymentInfo: PaymentInfo, userId: string): Promise<PaymentInfo> {
        return this.paymentInfoRepository.create(paymentInfo, userId);
    }

    public async createBulk(paymentsInfo: Array<PaymentInfo>, userIds: Array<string>): Promise<Array<PaymentInfo>> {
        return this.paymentInfoRepository.createBulk(paymentsInfo, userIds);
    }
}

export default PaymentInfoService;
