import ShippingInfo from "../domain/ShippingInfo";

interface Repository {
    save: (shippingInfo: ShippingInfo, userId: number) => Promise<ShippingInfo>;
    saveBulk: (shippingsInfo: Array<ShippingInfo>, userIds: Array<number>) => Promise<Array<ShippingInfo>>;
}

export type { Repository };
