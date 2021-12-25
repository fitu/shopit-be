import UserDao from "../../user/infrastructure/UserDao";
import ShippingInfo from "../domain/ShippingInfo";

import ShippingInfoDao from "./ShippingInfoDao";

interface Repository {
    save: (shippingInfo: ShippingInfo, userId: number) => Promise<ShippingInfo>;
    saveBulk: (shippingsInfo: Array<ShippingInfo>, userIds: Array<number>) => Promise<Array<ShippingInfo>>;
}

class ShippingInfoRepository implements Repository {
    public async save(shippingInfo: ShippingInfo, userId: number): Promise<ShippingInfo> {
        const newShippingInfo = await ShippingInfoDao.create({
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

    public async saveBulk(shippingsInfo: Array<ShippingInfo>, userIds: Array<number>): Promise<Array<ShippingInfo>> {
        const shippingsInfoToSave = shippingsInfo.map((shippingInfo) => {
            return {
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
            return await user.setShippingsInfo([newShippingsInfo[index]]);
        });

        await Promise.all(usersWithShippingsInfoPromises);

        return newShippingsInfo.map((newShippingInfo) => newShippingInfo.toModel());
    }
}

export type { Repository };
export default ShippingInfoRepository;
