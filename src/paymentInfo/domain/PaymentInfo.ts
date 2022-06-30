enum PaymentStatus {
    NOT_PAID = "not-paid",
    PAID = "paid",
}

const validPaymentStatus: Array<string> = Object.values(PaymentStatus);

class PaymentInfo {
    readonly id?: string;
    readonly status: PaymentStatus;

    constructor({ id, status }: { id?: string; status: PaymentStatus }) {
        this.id = id;
        this.status = status;
    }
}

export { PaymentStatus, validPaymentStatus };
export default PaymentInfo;
