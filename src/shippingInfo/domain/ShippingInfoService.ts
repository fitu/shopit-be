import ShippingInfoRepository from "../infrastructure/ShippingInfoRepository";

import ShippingInfo from "./ShippingInfo";

class ShippingInfoService {
    private shippingInfoRepository: ShippingInfoRepository;

    constructor(shippingInfoRepository: ShippingInfoRepository) {
        this.shippingInfoRepository = shippingInfoRepository;
    }

    public async create(shippingInfo: ShippingInfo): Promise<ShippingInfo> {
        return await this.shippingInfoRepository.save(shippingInfo);
    }

    public async createBulk(shippingInfos: Array<ShippingInfo>): Promise<Array<ShippingInfo>> {
        return await this.shippingInfoRepository.saveBulk(shippingInfos);
    }
}

export default ShippingInfoService;
