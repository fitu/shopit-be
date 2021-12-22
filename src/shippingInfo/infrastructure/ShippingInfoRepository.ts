import ShippingInfo from "../domain/ShippingInfo";

interface Repository {
    save: (shippingInfo: ShippingInfo) => Promise<ShippingInfo>;
    saveBulk: (shippingsInfo: Array<ShippingInfo>) => Promise<Array<ShippingInfo>>;
}

class ShippingInfoRepository implements Repository {
    public async save(shippingInfo: ShippingInfo): Promise<ShippingInfo> {
        return new Promise(() => {});
    }

    public async saveBulk(shippingsInfo: Array<ShippingInfo>): Promise<Array<ShippingInfo>> {
        return new Promise(() => {});
    }
}

export type { Repository };
export default ShippingInfoRepository;
