interface PaymentOrderAttributes {
    id: number;
    amount: number;
}

class PaymentOrder implements PaymentOrderAttributes {
    constructor(public id: number, public amount: number) {}
}

export type { PaymentOrderAttributes };
export default PaymentOrder;
