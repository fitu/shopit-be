import UserDao from "../../../user/infrastructure/sql/UserDao";
import ShippingInfo from "../../domain/ShippingInfo";
import { Repository } from "../Repository";

import ShippingInfoDao from "./ShippingInfoDao";

class ShippingInfoRepositoryRaw implements Repository {
    public async create(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        return new Promise(() => {});
    }

    public async createBulk(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        return new Promise(() => {});
    }
}

export default ShippingInfoRepositoryRaw;
