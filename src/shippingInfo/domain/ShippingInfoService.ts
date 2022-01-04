import { Repository as ShippingInfoRepository } from "../infrastructure/Repository";

import ShippingInfo from "./ShippingInfo";

class ShippingInfoService {
    private shippingInfoRepository: ShippingInfoRepository;

    constructor(shippingInfoRepository: ShippingInfoRepository) {
        this.shippingInfoRepository = shippingInfoRepository;
    }

    public async create(shippingInfo: ShippingInfo, userId: number): Promise<ShippingInfo> {
        return await this.shippingInfoRepository.save(shippingInfo, userId);
    }

    public async createBulk(shippingsInfo: Array<ShippingInfo>, userIds: Array<number>): Promise<Array<ShippingInfo>> {
        return await this.shippingInfoRepository.saveBulk(shippingsInfo, userIds);
    }
}

export default ShippingInfoService;
