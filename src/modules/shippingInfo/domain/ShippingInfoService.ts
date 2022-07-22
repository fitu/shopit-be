import { Repository as ShippingInfoRepository } from "@shippingInfo/infrastructure/Repository";
import ShippingInfo from "@shippingInfo/domain/ShippingInfo";

class ShippingInfoService {
    constructor(private readonly shippingInfoRepository: ShippingInfoRepository) {}

    public async insert(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        return this.shippingInfoRepository.insert(shippingInfo, userId);
    }

    public async insertBatch(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        return this.shippingInfoRepository.insertBatch(shippingsInfo, userIds);
    }
}

export default ShippingInfoService;
