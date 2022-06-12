import { Sequelize } from "sequelize";

import UserDao from "../../../user/infrastructure/sql/UserDao";
import ShippingInfo from "../../domain/ShippingInfo";
import { Repository } from "../Repository";

import ShippingInfoDao from "./ShippingInfoDao";

class ShippingInfoRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async insert(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        return new Promise(() => {});
    }

    public async insertBatch(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        return new Promise(() => {});
    }
}

export default ShippingInfoRepositoryRaw;
