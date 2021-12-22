import UserDao from "user/infrastructure/UserDao";
import PaymentInfo from "../domain/PaymentInfo";
import PaymentInfoDao from "./PaymentInfoDao";

interface Repository {
    save: (paymentInfo: PaymentInfo, userId: number) => Promise<PaymentInfo>;
    saveBulk: (paymentsInfo: Array<PaymentInfo>, userIds: Array<number>) => Promise<Array<PaymentInfo>>;
}

class PaymentInfoRepository implements Repository {
    public async save(paymentInfo: PaymentInfo, userId: number): Promise<PaymentInfo> {
        const newPaymentInfo = await PaymentInfoDao.create({
            status: paymentInfo.status,
        });

        const user = await UserDao.findByPk(userId);
        await user.setPaymentsInfo([newPaymentInfo]);

        return newPaymentInfo.toModel();
    }

    public async saveBulk(paymentsInfo: Array<PaymentInfo>, userIds: Array<number>): Promise<Array<PaymentInfo>> {
        const paymentInfoToSave = paymentsInfo.map((paymentInfo) => {
            return {
                status: paymentInfo.status,
            };
        });

        const savedPaymentsInfo = await PaymentInfoDao.bulkCreate(paymentInfoToSave);
        const usersWithPaymentsInfoPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            return await user.setPaymentsInfo([savedPaymentsInfo[index]]);
        });

        await Promise.all(usersWithPaymentsInfoPromises);

        return savedPaymentsInfo.map((savedPaymentInfo) => savedPaymentInfo.toModel());
    }
}

export type { Repository };
export default PaymentInfoRepository;
