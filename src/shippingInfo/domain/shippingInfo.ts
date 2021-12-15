interface ShippingInfoAttributes {
    id: number;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

class ShippingInfo implements ShippingInfoAttributes {
    constructor(
        public id: number,
        public address: string,
        public city: string,
        public phone: string,
        public postalCode: string,
        public country: string
    ) {}
}

export type { ShippingInfoAttributes };
export default ShippingInfo;
