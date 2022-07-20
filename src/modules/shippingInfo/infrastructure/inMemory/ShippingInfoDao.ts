import ShippingInfo from "@shippingInfo/domain/ShippingInfo";
import {
    fromModelToShippingInfoDao,
    fromShippingInfoDaoToModel,
} from "@shippingInfo/infrastructure/inMemory/shippingInfoParsers";

class ShippingInfoDao {
    readonly id?: string;
    readonly address: string;
    readonly city: string;
    readonly phone: string;
    readonly postalCode: string;
    readonly country: string;

    constructor({
        id,
        address,
        city,
        phone,
        postalCode,
        country,
    }: {
        id?: string;
        address: string;
        city: string;
        phone: string;
        postalCode: string;
        country: string;
    }) {
        this.id = id;
        this.address = address;
        this.city = city;
        this.phone = phone;
        this.postalCode = postalCode;
        this.country = country;
    }

    public toModel(): ShippingInfo {
        return fromShippingInfoDaoToModel(this);
    }

    public toDao(shippingInfo: ShippingInfo): ShippingInfoDao {
        return fromModelToShippingInfoDao(shippingInfo);
    }
}

export default ShippingInfoDao;
