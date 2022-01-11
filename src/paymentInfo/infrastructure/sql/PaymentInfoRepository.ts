import UserDao from "../../../user/infrastructure/sql/UserDao";
import PaymentInfo from "../../domain/PaymentInfo";
import { Repository } from "../Repository";

import PaymentInfoDao from "./PaymentInfoDao";

class PaymentInfoRepository implements Repository {
    public async save(paymentInfo: PaymentInfo, userId: string): Promise<PaymentInfo> {
        const newPaymentInfo = await PaymentInfoDao.create({
            status: paymentInfo.status,
        });

        const user = await UserDao.findByPk(userId);
        await user.setPaymentsInfo([newPaymentInfo]);

        return newPaymentInfo.toModel();
    }

    public async saveBulk(paymentsInfo: Array<PaymentInfo>, userIds: Array<string>): Promise<Array<PaymentInfo>> {
        const paymentsInfoToSave = paymentsInfo.map((paymentInfo) => {
            return {
                status: paymentInfo.status,
            };
        });

        const newPaymentsInfo = await PaymentInfoDao.bulkCreate(paymentsInfoToSave);
        const usersWithPaymentsInfoPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            return user.setPaymentsInfo([newPaymentsInfo[index]]);
        });

        await Promise.all(usersWithPaymentsInfoPromises);

        return newPaymentsInfo.map((newPaymentInfo) => newPaymentInfo.toModel());
    }
}

export type { Repository };
export default PaymentInfoRepository;
