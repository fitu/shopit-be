type PaymentStatus = "not-paid" | "paid";

interface PaymentInfoAttributes {
    id: number;
    status: PaymentStatus;
}

class PaymentInfo implements PaymentInfoAttributes {
    constructor(public id: number, public status: PaymentStatus) {}
}

export type { PaymentStatus, PaymentInfoAttributes };
export default PaymentInfo;
