class PaymentOrder {
    readonly id: number;
    readonly amount: number;

    constructor({ id, amount }: { id: number; amount: number }) {
        this.id = id;
        this.amount = amount;
    }
}

export default PaymentOrder;
