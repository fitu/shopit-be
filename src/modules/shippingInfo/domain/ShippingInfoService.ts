import { Repository as ShippingInfoRepository } from "@shippingInfo/infrastructure/Repository";
import ShippingInfo from "@shippingInfo/domain/ShippingInfo";

class ShippingInfoService {
    private shippingInfoRepository: ShippingInfoRepository;

    constructor(shippingInfoRepository: ShippingInfoRepository) {
        this.shippingInfoRepository = shippingInfoRepository;
    }

    public async insert(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        return this.shippingInfoRepository.insert(shippingInfo, userId);
    }

    public async insertBatch(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        return this.shippingInfoRepository.insertBatch(shippingsInfo, userIds);
    }
}

export default ShippingInfoService;
