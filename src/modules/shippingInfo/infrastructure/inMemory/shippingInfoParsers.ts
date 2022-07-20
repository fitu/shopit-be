import ShippingInfo from "@shippingInfo/domain/ShippingInfo";
import ShippingInfoDao from "@shippingInfo/infrastructure/inMemory/ShippingInfoDao";

const fromShippingInfoDaoToModel = (shippingInfoDao: ShippingInfoDao): ShippingInfo => {
    const shippingInfo = new ShippingInfo({
        id: shippingInfoDao.id,
        address: shippingInfoDao.address,
        city: shippingInfoDao.city,
        phone: shippingInfoDao.phone,
        postalCode: shippingInfoDao.postalCode,
        country: shippingInfoDao.country,
    });

    return shippingInfo;
};

const fromModelToShippingInfoDao = (shippingInfo: ShippingInfo): ShippingInfoDao => {
    const shippingInfoDao = new ShippingInfoDao({
        id: shippingInfo.id,
        address: shippingInfo.address,
        city: shippingInfo.city,
        phone: shippingInfo.phone,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
    });

    return shippingInfoDao;
};

export { fromShippingInfoDaoToModel, fromModelToShippingInfoDao };
