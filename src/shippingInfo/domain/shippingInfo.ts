class ShippingInfo {
    constructor(
        public id: number,
        public address: string,
        public city: string,
        public phone: string,
        public postalCode: string,
        public country: string
    ) {}
}

export default ShippingInfo;
