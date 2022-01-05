type PaymentStatus = "not-paid" | "paid";

class PaymentInfo {
    readonly id: number;
    readonly status: PaymentStatus;

    constructor({ id, status }: { id: number; status: PaymentStatus }) {
        this.id = id;
        this.status = status;
    }
}

export type { PaymentStatus };
export default PaymentInfo;
