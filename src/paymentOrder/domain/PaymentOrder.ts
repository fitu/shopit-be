class PaymentOrder {
    readonly id: string;
    readonly amount: number;

    constructor({ id, amount }: { id: string; amount: number }) {
        this.id = id;
        this.amount = amount;
    }
}

export default PaymentOrder;
