import ShippingInfo from "@shippingInfo/domain/ShippingInfo";

interface Repository {
    insert: (shippingInfo: ShippingInfo, userId: string) => Promise<ShippingInfo>;
    insertBatch: (shippingsInfo: Array<ShippingInfo>, userIds: Array<string>) => Promise<Array<ShippingInfo>>;
}

export type { Repository };
