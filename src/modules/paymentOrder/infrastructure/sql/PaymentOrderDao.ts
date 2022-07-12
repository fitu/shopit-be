import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import OrderDao from "@order/infrastructure/sql/OrderDao";
import PaymentInfoDao from "@paymentInfo/infrastructure/sql/PaymentInfoDao";

const PAYMENT_ORDER_TABLE = 'paymentOrders';

interface PaymentOrderAttributes {
    id: string;
    amount: number;
}

interface OrderItemCreationAttributes extends Optional<PaymentOrderAttributes, 'id'> {}

class PaymentOrderDao
    extends Model<PaymentOrderAttributes, OrderItemCreationAttributes>
    implements PaymentOrderAttributes
{
    public id!: string;
    public amount!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getOrder!: HasOneGetAssociationMixin<OrderDao>;
    public setOrder!: HasOneSetAssociationMixin<OrderDao, number>;

    public getPaymentInfo!: HasOneGetAssociationMixin<PaymentInfoDao>;
    public setPaymentInfo!: HasOneSetAssociationMixin<PaymentInfoDao, number>;

    public readonly order?: OrderDao;
    public readonly paymentInfo?: PaymentInfoDao;

    public static associations: {
        order: Association<PaymentOrderDao, OrderDao>;
        paymentInfo: Association<PaymentOrderDao, PaymentInfoDao>;
    };
}

const init = (sequelize: Sequelize): void => {
    PaymentOrderDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: PAYMENT_ORDER_TABLE,
            sequelize,
        }
    );
};

export { init, PAYMENT_ORDER_TABLE };
export default PaymentOrderDao;
