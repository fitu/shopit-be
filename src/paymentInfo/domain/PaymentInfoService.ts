import PaymentInfoRepository from "../infrastructure/PaymentInfoRepository";

import PaymentInfo from "./PaymentInfo";

class PaymentInfoService {
    private paymentInfoRepository: PaymentInfoRepository;

    constructor(paymentInfoRepository: PaymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public async create(paymentInfo: PaymentInfo, userId: number): Promise<PaymentInfo> {
        return await this.paymentInfoRepository.save(paymentInfo, userId);
    }

    public async createBulk(paymentsInfo: Array<PaymentInfo>, userIds: Array<number>): Promise<Array<PaymentInfo>> {
        return await this.paymentInfoRepository.saveBulk(paymentsInfo, userIds);
    }
}

export default PaymentInfoService;
