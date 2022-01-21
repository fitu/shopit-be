import ShippingInfo from "../domain/ShippingInfo";

interface Repository {
    create: (shippingInfo: ShippingInfo, userId: string) => Promise<ShippingInfo>;
    createBulk: (shippingsInfo: Array<ShippingInfo>, userIds: Array<string>) => Promise<Array<ShippingInfo>>;
}

export type { Repository };
