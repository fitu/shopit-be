import ShippingInfo from "../domain/ShippingInfo";

interface Repository {
    save: (shippingInfo: ShippingInfo, userId: string) => Promise<ShippingInfo>;
    saveBulk: (shippingsInfo: Array<ShippingInfo>, userIds: Array<string>) => Promise<Array<ShippingInfo>>;
}

export type { Repository };
