import UserDao from "../../../user/infrastructure/sql/UserDao";
import ShippingInfo from "../../domain/ShippingInfo";
import { Repository } from "../Repository";

import ShippingInfoDao from "./ShippingInfoDao";

class ShippingInfoRepository implements Repository {
    public async insert(shippingInfo: ShippingInfo, userId: string): Promise<ShippingInfo> {
        const newShippingInfo = await ShippingInfoDao.create({
            ...(shippingInfo.id && { id: shippingInfo.id }),
            address: shippingInfo.address,
            city: shippingInfo.city,
            phone: shippingInfo.phone,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,
        });

        const user = await UserDao.findByPk(userId);
        await user.setShippingsInfo([newShippingInfo]);

        return newShippingInfo.toModel();
    }

    public async insertBatch(shippingsInfo: Array<ShippingInfo>, userIds: Array<string>): Promise<Array<ShippingInfo>> {
        const shippingsInfoToSave = shippingsInfo.map((shippingInfo) => {
            return {
                ...(shippingInfo.id && { id: shippingInfo.id }),
                address: shippingInfo.address,
                city: shippingInfo.city,
                phone: shippingInfo.phone,
                postalCode: shippingInfo.postalCode,
                country: shippingInfo.country,
            };
        });

        const newShippingsInfo = await ShippingInfoDao.bulkCreate(shippingsInfoToSave);
        const usersWithShippingsInfoPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            await user.setShippingsInfo([newShippingsInfo[index]]);
        });

        await Promise.all(usersWithShippingsInfoPromises);

        return newShippingsInfo.map((newShippingInfo) => newShippingInfo.toModel());
    }
}

export default ShippingInfoRepository;
