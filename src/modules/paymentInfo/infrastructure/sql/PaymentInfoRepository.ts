import UserDao from "@user/infrastructure/sql/UserDao";
import PaymentInfo from "@paymentInfo/domain/PaymentInfo";
import { Repository } from "@paymentInfo/infrastructure/Repository";
import PaymentInfoDao from "@paymentInfo/infrastructure/sql/PaymentInfoDao";

class PaymentInfoRepository implements Repository {
    public async insert(paymentInfo: PaymentInfo, userId: string): Promise<PaymentInfo> {
        const newPaymentInfo = await PaymentInfoDao.create({
            status: paymentInfo.status,
        });

        const user = await UserDao.findByPk(userId);
        await user.setPaymentsInfo([newPaymentInfo]);

        const newPaymentInfoModel = newPaymentInfo.toModel();
        return newPaymentInfoModel;
    }

    public async insertBatch(paymentsInfo: Array<PaymentInfo>, userIds: Array<string>): Promise<Array<PaymentInfo>> {
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

        const newPaymentInfoModels = newPaymentsInfo.map((newPaymentInfo) => newPaymentInfo.toModel());
        return newPaymentInfoModels;
    }
}

export default PaymentInfoRepository;
