type PaymentStatus = "not-paid" | "paid";

class PaymentInfo {
    constructor(public id: number, public status: PaymentStatus) {}
}

export type { PaymentStatus };
export default PaymentInfo;
