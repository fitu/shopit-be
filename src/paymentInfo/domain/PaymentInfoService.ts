import PaymentInfoRepository from "../infrastructure/PaymentInfoRepository";

import PaymentInfo from "./PaymentInfo";

class PaymentInfoService {
    private paymentInfoRepository: PaymentInfoRepository;

    constructor(paymentInfoRepository: PaymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public async create(paymentInfo: PaymentInfo): Promise<PaymentInfo> {
        return await this.paymentInfoRepository.save(paymentInfo);
    }

    public async createBulk(paymentInfos: Array<PaymentInfo>): Promise<Array<PaymentInfo>> {
        return await this.paymentInfoRepository.saveBulk(paymentInfos);
    }
}

export default PaymentInfoService;
