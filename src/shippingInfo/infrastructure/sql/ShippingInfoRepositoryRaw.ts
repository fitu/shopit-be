import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import ShippingInfo from "../../domain/ShippingInfo";
import { Repository } from "../Repository";

import { SHIPPING_INFO_TABLE } from "./ShippingInfoDao";

class ShippingInfoRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async insert(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        const shippingInfoId = shippingInfo.id || uuidv4();

        await this.instance.query(
            `
                INSERT INTO "${SHIPPING_INFO_TABLE}" (
                    id,
                    address,
                    city,
                    phone,
                    "postalCode",
                    country,
                    "createdAt",
                    "updatedAt",
                    "userId"
                )
                VALUES (
                    :id,
                    :address,
                    :city,
                    :phone,
                    :postalCode,
                    :country,
                    :createdAt,
                    :updatedAt,
                    :userId
                );
            `,
            {
                replacements: {
                    id: shippingInfoId,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    phone: shippingInfo.phone,
                    postalCode: shippingInfo.postalCode,
                    country: shippingInfo.country,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId,
                },
            }
        );

        return { ...shippingInfo, id: shippingInfoId };
    }

    public async insertBatch(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        const shippingInfosWithUserIdsPromises = shippingsInfo
            .map((shippingInfo, index) => [shippingInfo, userIds[index]])
            .map(async (shippingInfoWithUserId) => {
                const shippingInfo = shippingInfoWithUserId[0] as ShippingInfo;
                const userId = shippingInfoWithUserId[1] as string;
                return this.insert(shippingInfo, userId);
            });

        return await Promise.all(shippingInfosWithUserIdsPromises);
    }
}

export default ShippingInfoRepositoryRaw;
