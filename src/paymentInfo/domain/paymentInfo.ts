type PaymentStatus = "not-paid" | "paid";

class PaymentInfo {
    readonly id: string;
    readonly status: PaymentStatus;

    constructor({ id, status }: { id: string; status: PaymentStatus }) {
        this.id = id;
        this.status = status;
    }
}

export type { PaymentStatus };
export default PaymentInfo;
