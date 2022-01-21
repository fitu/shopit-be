import { Repository as ShippingInfoRepository } from "../infrastructure/Repository";

import ShippingInfo from "./ShippingInfo";

class ShippingInfoService {
    private shippingInfoRepository: ShippingInfoRepository;

    constructor(shippingInfoRepository: ShippingInfoRepository) {
        this.shippingInfoRepository = shippingInfoRepository;
    }

    public async create(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        return this.shippingInfoRepository.create(shippingInfo, userId);
    }

    public async createBulk(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        return this.shippingInfoRepository.createBulk(shippingsInfo, userIds);
    }
}

export default ShippingInfoService;
