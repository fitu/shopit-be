import PaymentInfo from "@paymentInfo/domain/PaymentInfo";
import PaymentInfoDao from "@paymentInfo/infrastructure/sql/PaymentInfoDao";

const fromPaymentInfoDaoToModel = (paymentInfoDao: PaymentInfoDao): PaymentInfo => {
    const paymentInfo = new PaymentInfo({
        id: paymentInfoDao.id,
        status: paymentInfoDao.status,
    });

    return paymentInfo;
};

export { fromPaymentInfoDaoToModel };
