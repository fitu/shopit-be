import UserDao from "@user/infrastructure/sql/UserDao";
import ShippingInfo from "@shippingInfo/domain/ShippingInfo";
import { Repository } from "@shippingInfo/infrastructure/Repository";
import ShippingInfoDao from "@shippingInfo/infrastructure/sql/ShippingInfoDao";

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

        const newShippingInfoModel = newShippingInfo.toModel();
        return newShippingInfoModel;
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

        const newShippingInfoModels = newShippingsInfo.map((newShippingInfo) => newShippingInfo.toModel());
        return newShippingInfoModels;
    }
}

export default ShippingInfoRepository;
