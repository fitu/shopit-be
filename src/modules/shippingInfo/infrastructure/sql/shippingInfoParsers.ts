import ShippingInfo from "@shippingInfo/domain/ShippingInfo";
import ShippingInfoDao from "@shippingInfo/infrastructure/sql/ShippingInfoDao";

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

export { fromShippingInfoDaoToModel };
