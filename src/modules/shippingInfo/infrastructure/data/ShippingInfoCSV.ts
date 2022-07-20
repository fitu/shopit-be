import ShippingInfo from "@shippingInfo/domain/ShippingInfo";

class ShippingInfoCSV {
    constructor(
        public id: string,
        public address: string,
        public city: string,
        public phone: string,
        public postalCode: string,
        public country: string,
        public userId: string
    ) {}

    static toModel(shippingInfoCSV: ShippingInfoCSV): ShippingInfo {
        const shippingInfo = new ShippingInfo({
            id: shippingInfoCSV.id,
            address: shippingInfoCSV.address,
            city: shippingInfoCSV.city,
            phone: shippingInfoCSV.phone,
            postalCode: shippingInfoCSV.postalCode,
            country: shippingInfoCSV.country,
        });

        return shippingInfo;
    }
}

export default ShippingInfoCSV;
